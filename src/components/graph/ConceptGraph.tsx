import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { zoom as d3Zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
import { select } from 'd3-selection';
import { CONCEPTS, UNITS, EDGES } from '../../content/concepts.index';
import { useGraphStore, type ViewMode } from '../../store/graphStore';
import { useProgressStore } from '../../store/progressStore';
import { useNotesStore } from '../../store/notesStore';
import { useForceSimulation, type SimNode, type SimLink } from './useForceSimulation';
import { UnitBlob, ConceptNode, NoteNode } from './GraphNode';
import { GraphEdge, UnitEdge } from './GraphEdge';
import { HoverPreview } from './HoverPreview';
import type { Concept, EdgeType, Note, UnitId } from '../../content/types';

const EDGE_TYPE_LABELS: { type: EdgeType; label: string; style: string }[] = [
  { type: 'prereq', label: 'Prerequisite', style: 'solid' },
  { type: 'generalizes', label: 'Generalizes', style: 'solid + arrow' },
  { type: 'applies-to', label: 'Application', style: 'dashed' },
  { type: 'related', label: 'Related', style: 'dotted' },
  { type: 'dual-of', label: 'Dual', style: 'double' },
];

function computeUnitCentroids(
  width: number,
  height: number
): Record<UnitId, { x: number; y: number }> {
  const cx = width / 2;
  const cy = height / 2;
  const rX = Math.min(width * 0.35, 400);
  const rY = Math.min(height * 0.35, 300);
  const result: Record<UnitId, { x: number; y: number }> = {};
  UNITS.forEach((u, i) => {
    const angle = (2 * Math.PI * i) / UNITS.length - Math.PI / 2;
    result[u.id] = {
      x: cx + rX * Math.cos(angle),
      y: cy + rY * Math.sin(angle),
    };
  });
  // Notes cluster: pulled toward bottom-left of the canvas
  result['notes'] = { x: cx - rX * 0.7, y: cy + rY * 1.1 };
  return result;
}

// Note edges use a sentinel type so we can render them dotted yellow.
const NOTE_EDGE_TYPE = 'note-link';

function noteNodeId(noteId: string): string {
  return `note:${noteId}`;
}

function buildClusteredGraph(
  expandedUnits: Set<string>,
  notes: Note[]
): { nodes: SimNode[]; links: SimLink[] } {
  const conceptsByUnit = new Map<string, Concept[]>();
  CONCEPTS.forEach((c) => {
    const list = conceptsByUnit.get(c.unitId) ?? [];
    list.push(c);
    conceptsByUnit.set(c.unitId, list);
  });

  const nodes: SimNode[] = [];
  const visibleConceptIds = new Set<string>();

  UNITS.forEach((u) => {
    const concepts = conceptsByUnit.get(u.id) ?? [];
    if (expandedUnits.has(u.id)) {
      concepts.forEach((c) => {
        visibleConceptIds.add(c.id);
        nodes.push({
          id: c.id,
          unitId: u.id,
          isApplication: c.isApplication,
          radius: c.isApplication ? 12 : 14,
        });
      });
    } else {
      nodes.push({
        id: `unit:${u.id}`,
        unitId: u.id,
        isUnit: true,
        radius: 36 + concepts.length * 1.2,
      });
    }
  });

  const links: SimLink[] = [];
  const unitEdgeSet = new Set<string>();

  EDGES.forEach((e) => {
    const srcVisible = visibleConceptIds.has(e.from);
    const tgtVisible = visibleConceptIds.has(e.to);

    if (srcVisible && tgtVisible) {
      links.push({ source: e.from, target: e.to, type: e.type });
    } else {
      const srcConcept = CONCEPTS.find((c) => c.id === e.from);
      const tgtConcept = CONCEPTS.find((c) => c.id === e.to);
      if (!srcConcept || !tgtConcept) return;

      const srcNode = srcVisible ? e.from : `unit:${srcConcept.unitId}`;
      const tgtNode = tgtVisible ? e.to : `unit:${tgtConcept.unitId}`;

      if (srcNode === tgtNode) return;

      const key = [srcNode, tgtNode].sort().join('|');
      if (unitEdgeSet.has(key)) return;
      unitEdgeSet.add(key);

      links.push({ source: srcNode, target: tgtNode, type: 'related' });
    }
  });

  // Notes: one node per note, dotted yellow links to each linked concept (or its unit if collapsed)
  notes.forEach((note) => {
    const nid = noteNodeId(note.id);
    nodes.push({ id: nid, unitId: 'notes', isNote: true, radius: 12 });
    note.linkedConcepts.forEach((cid) => {
      const c = CONCEPTS.find((c) => c.id === cid);
      if (!c) return;
      const target = visibleConceptIds.has(cid) ? cid : `unit:${c.unitId}`;
      links.push({ source: nid, target, type: NOTE_EDGE_TYPE });
    });
  });

  return { nodes, links };
}

function buildExpandedGraph(notes: Note[]): { nodes: SimNode[]; links: SimLink[] } {
  const nodes: SimNode[] = CONCEPTS.map((c) => ({
    id: c.id,
    unitId: c.unitId,
    isApplication: c.isApplication,
    radius: c.isApplication ? 12 : 14,
  }));

  const links: SimLink[] = EDGES.map((e) => ({
    source: e.from,
    target: e.to,
    type: e.type,
  }));

  notes.forEach((note) => {
    const nid = noteNodeId(note.id);
    nodes.push({ id: nid, unitId: 'notes', isNote: true, radius: 12 });
    note.linkedConcepts.forEach((cid) => {
      links.push({ source: nid, target: cid, type: NOTE_EDGE_TYPE });
    });
  });

  return { nodes, links };
}

export function ConceptGraph() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const draggingRef = useRef<string | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const viewMode = useGraphStore((s) => s.viewMode);
  const expandedUnits = useGraphStore((s) => s.expandedUnits);
  const setViewMode = useGraphStore((s) => s.setViewMode);
  const toggleUnit = useGraphStore((s) => s.toggleUnit);
  const pinNodeStore = useGraphStore((s) => s.pinNode);
  const unpinNodeStore = useGraphStore((s) => s.unpinNode);
  const pinnedNodes = useGraphStore((s) => s.pinnedNodes);
  const isReviewed = useProgressStore((s) => s.isReviewed);
  const notesMap = useNotesStore((s) => s.notes);
  const allNotes = useMemo(() => Object.values(notesMap), [notesMap]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const unitCentroids = useMemo(
    () => computeUnitCentroids(size.width, size.height),
    [size.width, size.height]
  );

  const { nodes, links } = useMemo(() => {
    if (viewMode === 'expanded') return buildExpandedGraph(allNotes);
    return buildClusteredGraph(expandedUnits, allNotes);
  }, [viewMode, expandedUnits, allNotes]);

  const nodesWithPins = useMemo(() => {
    return nodes.map((n) => {
      const pin = pinnedNodes[n.id];
      if (pin) return { ...n, fx: pin.x, fy: pin.y };
      return n;
    });
  }, [nodes, pinnedNodes]);

  const {
    positions,
    reheat,
    pinNode,
    unpinNode,
    dragStart,
    dragMove,
    dragEnd,
  } = useForceSimulation({
    nodes: nodesWithPins,
    links,
    width: size.width,
    height: size.height,
    unitCentroids:
      viewMode === 'clustered' || expandedUnits.size > 0
        ? unitCentroids
        : undefined,
    clusterStrength: viewMode === 'expanded' ? 0.15 : 0.3,
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const zoomBehavior = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        setTransform({
          x: event.transform.x,
          y: event.transform.y,
          k: event.transform.k,
        });
      });

    select(svg).call(zoomBehavior);
    zoomRef.current = zoomBehavior;

    return () => {
      select(svg).on('.zoom', null);
    };
  }, []);

  useEffect(() => {
    reheat(0.5);
  }, [viewMode, expandedUnits, reheat]);

  const handleNodeHoverIn = useCallback(
    (id: string, e: React.MouseEvent) => {
      if (draggingRef.current) return;
      hoverTimerRef.current = setTimeout(() => {
        setHoveredNode(id);
        setHoverPos({ x: e.clientX, y: e.clientY });
        setShowPreview(true);
      }, 300);
    },
    []
  );

  const handleNodeHoverOut = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredNode(null);
    setShowPreview(false);
  }, []);

  const handleNodeClick = useCallback(
    (id: string) => {
      if (draggingRef.current) return;
      if (id.startsWith('unit:')) {
        const unitId = id.replace('unit:', '');
        toggleUnit(unitId);
      } else if (id.startsWith('note:')) {
        navigate(`/note/${id.replace('note:', '')}`);
      } else {
        navigate(`/concept/${id}`);
      }
    },
    [navigate, toggleUnit]
  );

  const handlePointerDown = useCallback(
    (id: string, e: React.PointerEvent) => {
      if (id.startsWith('unit:')) return;
      e.stopPropagation();

      const svgEl = svgRef.current;
      if (!svgEl) return;
      const ctm = svgEl.getScreenCTM();
      if (!ctm) return;

      const startX = (e.clientX - ctm.e) / ctm.a;
      const startY = (e.clientY - ctm.f) / ctm.d;
      dragStartPosRef.current = { x: startX, y: startY };

      let didDrag = false;

      const onMove = (ev: PointerEvent) => {
        const mx = (ev.clientX - ctm.e) / ctm.a;
        const my = (ev.clientY - ctm.f) / ctm.d;
        const start = dragStartPosRef.current;
        if (!didDrag && start) {
          const dist = Math.hypot(mx - start.x, my - start.y);
          if (dist > 5) {
            didDrag = true;
            draggingRef.current = id;
            dragStart(id);
            handleNodeHoverOut();
          }
        }
        if (didDrag) {
          const t = transformRef.current;
          const tx = (mx - t.x) / t.k;
          const ty = (my - t.y) / t.k;
          dragMove(id, tx, ty);
        }
      };

      const onUp = (ev: PointerEvent) => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);

        if (didDrag) {
          const mx = (ev.clientX - ctm.e) / ctm.a;
          const my = (ev.clientY - ctm.f) / ctm.d;
          const t = transformRef.current;
          const tx = (mx - t.x) / t.k;
          const ty = (my - t.y) / t.k;
          pinNode(id, tx, ty);
          pinNodeStore(id, tx, ty);
          dragEnd(id, true);
          // Keep draggingRef set briefly so the synthetic click is suppressed
          setTimeout(() => {
            draggingRef.current = null;
          }, 50);
        }
        // If no drag happened, draggingRef was never set — click handler runs normally.
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [
      dragStart,
      dragMove,
      dragEnd,
      pinNode,
      pinNodeStore,
      handleNodeHoverOut,
    ]
  );

  const handleDoubleClick = useCallback(
    (id: string) => {
      unpinNode(id);
      unpinNodeStore(id);
    },
    [unpinNode, unpinNodeStore]
  );

  const toggleViewMode = useCallback(() => {
    const next: ViewMode = viewMode === 'clustered' ? 'expanded' : 'clustered';
    setViewMode(next);
    if (next === 'expanded' && svgRef.current && zoomRef.current) {
      const zb = zoomRef.current;
      select(svgRef.current).call(zb.transform, zoomIdentity.translate(0, 0).scale(0.6));
    }
  }, [viewMode, setViewMode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        navigate('/note/new');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  const conceptMap = useMemo(() => {
    const m = new Map<string, Concept>();
    CONCEPTS.forEach((c) => m.set(c.id, c));
    return m;
  }, []);

  const unitMap = useMemo(() => {
    const m = new Map<string, (typeof UNITS)[number]>();
    UNITS.forEach((u) => m.set(u.id, u));
    return m;
  }, []);

  const conceptsByUnit = useMemo(() => {
    const m = new Map<string, number>();
    CONCEPTS.forEach((c) => {
      m.set(c.unitId, (m.get(c.unitId) ?? 0) + 1);
    });
    return m;
  }, []);

  const hoveredConcept = hoveredNode ? conceptMap.get(hoveredNode) : null;
  const hoveredUnit = hoveredConcept
    ? unitMap.get(hoveredConcept.unitId)
    : null;

  const edgeElements = useMemo(() => {
    return links.map((link, i) => {
      const srcId =
        typeof link.source === 'string' ? link.source : link.source.id;
      const tgtId =
        typeof link.target === 'string' ? link.target : link.target.id;
      const sp = positions.get(srcId);
      const tp = positions.get(tgtId);
      if (!sp || !tp) return null;

      const isUnit =
        srcId.startsWith('unit:') || tgtId.startsWith('unit:');
      const isNoteEdge = link.type === NOTE_EDGE_TYPE;

      if (isNoteEdge) {
        const dimmed =
          hoveredNode !== null &&
          hoveredNode !== srcId &&
          hoveredNode !== tgtId;
        return (
          <line
            key={`ne-${i}`}
            x1={sp.x}
            y1={sp.y}
            x2={tp.x}
            y2={tp.y}
            stroke="var(--note-yellow)"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={dimmed ? 0.1 : 0.5}
          />
        );
      }

      if (isUnit) {
        return (
          <UnitEdge
            key={`ue-${i}`}
            x1={sp.x}
            y1={sp.y}
            x2={tp.x}
            y2={tp.y}
          />
        );
      }

      return (
        <GraphEdge
          key={`e-${i}`}
          x1={sp.x}
          y1={sp.y}
          x2={tp.x}
          y2={tp.y}
          type={link.type as EdgeType}
          dimmed={
            hoveredNode !== null &&
            hoveredNode !== srcId &&
            hoveredNode !== tgtId
          }
        />
      );
    });
  }, [links, positions, hoveredNode]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-base)',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 24,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          ESE 2030
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-tertiary)',
            letterSpacing: '0.05em',
          }}
        >
          {CONCEPTS.length} concepts · {UNITS.length} units
        </span>
      </div>

      {/* Controls — top right */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 24,
          zIndex: 20,
          display: 'flex',
          gap: 8,
        }}
      >
        <button
          onClick={toggleViewMode}
          className="graph-control-btn"
          title={
            viewMode === 'clustered'
              ? 'Expand all nodes'
              : 'Collapse into units'
          }
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            ⊞ {viewMode === 'clustered' ? 'EXPAND' : 'UNITS'}
          </span>
        </button>
        <button
          onClick={() => navigate('/note/new')}
          className="graph-control-btn"
          title="Create note (n)"
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            + NOTE
          </span>
        </button>
      </div>

      {/* Legend — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          zIndex: 20,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6,
          padding: '10px 14px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          Edges
        </div>
        {EDGE_TYPE_LABELS.map((et) => (
          <div
            key={et.type}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <svg width={24} height={8}>
              <LegendLine type={et.type} />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
              }}
            >
              {et.label}
            </span>
          </div>
        ))}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            marginTop: 8,
            paddingTop: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={16} height={16}>
              <circle cx={8} cy={8} r={6} fill="#67a9ff" fillOpacity={0.35} stroke="#67a9ff" strokeOpacity={0.5} strokeWidth={1} />
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>Concept</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={16} height={16}>
              <path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" fill="var(--accent-dim)" fillOpacity={0.6} stroke="var(--accent-dim)" strokeWidth={1} />
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>Application</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={16} height={16}>
              <rect x={3} y={3} width={10} height={10} rx={1} fill="var(--note-yellow)" fillOpacity={0.2} stroke="var(--note-yellow)" strokeOpacity={0.3} strokeWidth={1} transform="rotate(6 8 8)" />
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>Note</span>
          </div>
        </div>
      </div>

      {/* SVG Graph Canvas */}
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <g
          ref={gRef}
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}
        >
          {/* Edges */}
          <g>{edgeElements}</g>

          {/* Nodes */}
          <g>
            {nodes.map((node) => {
              const pos = positions.get(node.id);
              if (!pos) return null;

              if (node.isUnit) {
                const unitId = node.id.replace('unit:', '');
                const unit = unitMap.get(unitId);
                if (!unit) return null;
                return (
                  <UnitBlob
                    key={node.id}
                    unit={unit}
                    x={pos.x}
                    y={pos.y}
                    radius={node.radius}
                    conceptCount={conceptsByUnit.get(unitId) ?? 0}
                    isHovered={hoveredNode === node.id}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => handleNodeClick(node.id)}
                  />
                );
              }

              if (node.isNote) {
                const noteId = node.id.replace('note:', '');
                const note = notesMap[noteId];
                if (!note) return null;
                const title =
                  note.title.trim() ||
                  note.body.split('\n')[0]?.slice(0, 40) ||
                  'Untitled';
                return (
                  <NoteNode
                    key={node.id}
                    x={pos.x}
                    y={pos.y}
                    title={title}
                    isHovered={hoveredNode === node.id}
                    onMouseEnter={() => {
                      hoverTimerRef.current = setTimeout(() => {
                        setHoveredNode(node.id);
                        setShowPreview(true);
                      }, 300);
                    }}
                    onMouseLeave={handleNodeHoverOut}
                    onClick={() => handleNodeClick(node.id)}
                  />
                );
              }

              const concept = conceptMap.get(node.id);
              if (!concept) return null;
              const unit = unitMap.get(concept.unitId);

              return (
                <ConceptNode
                  key={node.id}
                  id={node.id}
                  x={pos.x}
                  y={pos.y}
                  color={unit?.color ?? '#67a9ff'}
                  label={concept.title}
                  number={concept.number}
                  isApplication={concept.isApplication}
                  isReviewed={isReviewed(concept.id)}
                  isPinned={!!pinnedNodes[concept.id]}
                  isHovered={hoveredNode === node.id}
                  dimmed={
                    hoveredNode !== null &&
                    !hoveredNode.startsWith('unit:') &&
                    hoveredNode !== node.id &&
                    !links.some((l) => {
                      const s =
                        typeof l.source === 'string'
                          ? l.source
                          : l.source.id;
                      const t =
                        typeof l.target === 'string'
                          ? l.target
                          : l.target.id;
                      return (
                        (s === hoveredNode && t === node.id) ||
                        (t === hoveredNode && s === node.id)
                      );
                    })
                  }
                  onMouseEnter={(e: unknown) =>
                    handleNodeHoverIn(
                      node.id,
                      e as React.MouseEvent
                    )
                  }
                  onMouseLeave={handleNodeHoverOut}
                  onClick={() => handleNodeClick(node.id)}
                  onPointerDown={(e: React.PointerEvent) =>
                    handlePointerDown(node.id, e)
                  }
                  onDoubleClick={() => handleDoubleClick(node.id)}
                />
              );
            })}
          </g>
        </g>
      </svg>

      {/* Hover Preview — concept */}
      {showPreview && hoveredConcept && hoveredUnit && (
        <HoverPreview
          title={hoveredConcept.title}
          number={hoveredConcept.number}
          blurb={hoveredConcept.blurb}
          unitLabel={`Ch.${hoveredUnit.number} ${hoveredUnit.short}`}
          unitColor={hoveredUnit.color}
          isApplication={hoveredConcept.isApplication}
          x={hoverPos.x}
          y={hoverPos.y}
          containerWidth={size.width}
          containerHeight={size.height}
        />
      )}

      {/* Hover Preview — note */}
      {showPreview && hoveredNode?.startsWith('note:') &&
        (() => {
          const noteId = hoveredNode.replace('note:', '');
          const note = notesMap[noteId];
          if (!note) return null;
          const title =
            note.title.trim() || note.body.split('\n')[0]?.slice(0, 60) || 'Untitled';
          const firstLine =
            note.body.split('\n').find((l) => l.trim().length > 0)?.slice(0, 120) ?? '';
          return (
            <HoverPreview
              title={title}
              number="note"
              blurb={firstLine || '(empty note)'}
              unitLabel="My Notes"
              unitColor="var(--note-yellow)"
              x={hoverPos.x}
              y={hoverPos.y}
              containerWidth={size.width}
              containerHeight={size.height}
            />
          );
        })()}
    </div>
  );
}

function LegendLine({ type }: { type: EdgeType }) {
  switch (type) {
    case 'prereq':
      return (
        <line x1={0} y1={4} x2={24} y2={4} stroke="var(--border-default)" strokeWidth={1} />
      );
    case 'generalizes':
      return (
        <g>
          <line x1={0} y1={4} x2={20} y2={4} stroke="var(--border-default)" strokeWidth={1.5} />
          <polyline points="16,1 20,4 16,7" fill="none" stroke="var(--border-default)" strokeWidth={1.5} />
        </g>
      );
    case 'applies-to':
      return (
        <line x1={0} y1={4} x2={24} y2={4} stroke="var(--accent-dim)" strokeWidth={1} strokeDasharray="4 3" />
      );
    case 'related':
      return (
        <line x1={0} y1={4} x2={24} y2={4} stroke="var(--border-subtle)" strokeWidth={0.8} strokeDasharray="2 3" />
      );
    case 'dual-of':
      return (
        <g>
          <line x1={0} y1={2.5} x2={24} y2={2.5} stroke="var(--border-default)" strokeWidth={0.8} />
          <line x1={0} y1={5.5} x2={24} y2={5.5} stroke="var(--border-default)" strokeWidth={0.8} />
        </g>
      );
    default:
      return null;
  }
}
