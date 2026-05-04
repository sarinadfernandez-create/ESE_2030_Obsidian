// 2.4 — Span & Independence (interactive).
// In R^2, drag 2 or 3 vectors. The span is rendered as a translucent line or plane.
// Right panel reports span dim, independence, and the dependence relation when present.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 460;
const H = 460;
const CX = W / 2;
const CY = H / 2;
const UNIT = 60;
const TOL = 1e-3;

const COLORS = ['var(--viz-blue, #67a9ff)', 'var(--viz-yellow, #ffd966)', 'rgba(184, 150, 255, 0.95)'];

function det2(a: Vec2, b: Vec2): number {
  return a[0] * b[1] - a[1] * b[0];
}

function isZero(v: Vec2): boolean {
  return Math.hypot(v[0], v[1]) < TOL;
}

// Compute span dim and dependence relation (when 3 vectors are present, give c1, c2 such that v3 = c1 v1 + c2 v2)
function analyze(vectors: Vec2[]): { dim: number; relation: { c1: number; c2: number } | null } {
  const nonzero = vectors.filter((v) => !isZero(v));
  if (nonzero.length === 0) return { dim: 0, relation: null };
  if (nonzero.length === 1) return { dim: 1, relation: null };

  // dim 2 if any pair is independent
  let dim = 1;
  for (let i = 0; i < nonzero.length && dim < 2; i++) {
    for (let j = i + 1; j < nonzero.length && dim < 2; j++) {
      if (Math.abs(det2(nonzero[i], nonzero[j])) > TOL) dim = 2;
    }
  }

  // If 3 vectors and dim 2, find dependence: v3 = c1 v1 + c2 v2
  let relation: { c1: number; c2: number } | null = null;
  if (vectors.length === 3 && dim === 2) {
    const v1 = vectors[0];
    const v2 = vectors[1];
    const v3 = vectors[2];
    const d = det2(v1, v2);
    if (Math.abs(d) > TOL) {
      const c1 = det2(v3, v2) / d;
      const c2 = det2(v1, v3) / d;
      relation = { c1, c2 };
    }
  }
  return { dim, relation };
}

export function SpanAndIndependenceViz() {
  const [count, setCount] = useState<2 | 3>(2);
  const [vectors, setVectors] = useState<Vec2[]>([
    [1.5, 0.5],
    [-0.5, 1.2],
    [1, 1.7],
  ]);

  const active = vectors.slice(0, count);
  const { dim, relation } = useMemo(() => analyze(active), [active]);
  const independent = count <= dim;

  const setVec = (i: number, v: Vec2) => {
    setVectors((vs) => {
      const next = [...vs];
      next[i] = v;
      return next;
    });
  };

  const snapDependent = () => {
    // Make v3 = 0.5 v1 + 0.5 v2
    setVectors((vs) => {
      const next = [...vs];
      next[2] = [0.5 * vs[0][0] + 0.5 * vs[1][0], 0.5 * vs[0][1] + 0.5 * vs[1][1]];
      return next;
    });
    setCount(3);
  };

  const snapIndependent = () => {
    setVectors([[1.5, 0.5], [-0.5, 1.2], [1, 1.7]]);
    setCount(3);
  };

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  // Span shape
  const spanRender = () => {
    if (dim === 0) return <circle cx={CX} cy={CY} r={4} fill="rgba(103, 169, 255, 0.6)" />;
    if (dim === 1) {
      const dir = active.find((v) => !isZero(v))!;
      const norm = Math.hypot(dir[0], dir[1]);
      const f = 6 / norm;
      return (
        <line
          x1={w2sX(dir[0] * f)}
          y1={w2sY(dir[1] * f)}
          x2={w2sX(-dir[0] * f)}
          y2={w2sY(-dir[1] * f)}
          stroke="rgba(103, 169, 255, 0.4)"
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
    return (
      <rect
        x={4}
        y={4}
        width={W - 8}
        height={H - 8}
        fill="rgba(103, 169, 255, 0.08)"
        stroke="rgba(103, 169, 255, 0.25)"
        strokeWidth={1}
        strokeDasharray="4 5"
        rx={4}
      />
    );
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            {spanRender()}
            {active.map((v, i) => (
              <DragArrow
                key={i}
                u={v}
                color={COLORS[i]}
                label={`v${i + 1}`}
                onMove={(nv) => setVec(i, nv)}
              />
            ))}
          </svg>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MonoLine size={9} color="var(--text-tertiary)">SPAN</MonoLine>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>vectors:</span>
            <button onClick={() => setCount(2)} disabled={count === 2} style={btnSmall(count === 2)}>2</button>
            <button onClick={() => setCount(3)} disabled={count === 3} style={btnSmall(count === 3)}>3</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <div>
              dim(span) = <span style={{ color: 'var(--accent-bright, #67a9ff)', fontWeight: 600 }}>{dim}</span>
            </div>
            <div style={{ color: independent ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)', fontWeight: 600 }}>
              {independent ? '✓ linearly independent' : '✗ linearly dependent'}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              shortfall = {2 - dim}
            </div>
          </div>

          {relation && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
              <MonoLine size={9} color="var(--text-tertiary)">DEPENDENCE</MonoLine>
              <div style={{ marginTop: 4, fontSize: 12 }}>
                <InlineMath math={`v_3 = ${relation.c1.toFixed(2)} v_1 + ${relation.c2.toFixed(2)} v_2`} />
              </div>
            </div>
          )}

          {count === 3 && (
            <div style={{ fontSize: 10, fontStyle: 'italic', color: 'var(--text-tertiary)', lineHeight: 1.4, paddingTop: 4 }}>
              three vectors in ℝ² → forced dependent
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton onClick={snapIndependent}>independent example</VizControlButton>
        <VizControlButton onClick={snapDependent}>snap v₃ to span(v₁, v₂)</VizControlButton>
        <VizControlButton onClick={() => { setVectors([[1.5, 0.5], [-0.5, 1.2], [1, 1.7]]); setCount(2); }}>reset</VizControlButton>
      </div>
    </div>
  );
}

const btnSmall = (active: boolean): React.CSSProperties => ({
  width: 26,
  height: 22,
  background: active ? 'rgba(103, 169, 255, 0.18)' : 'var(--bg-elevated)',
  border: `1px solid ${active ? 'var(--accent-bright, #67a9ff)' : 'var(--border-subtle)'}`,
  color: 'var(--text-primary)',
  borderRadius: 3,
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
});

function DragArrow({ u, color, label, onMove }: { u: Vec2; color: string; label?: string; onMove: (v: Vec2) => void }) {
  const max = 4;
  const norm = Math.hypot(u[0], u[1]);
  const f = norm > max ? max / norm : 1;
  const x2 = CX + u[0] * f * UNIT;
  const y2 = CY - u[1] * f * UNIT;
  const dx = x2 - CX;
  const dy = y2 - CY;
  const len = Math.hypot(dx, dy);
  const ux = len > 0 ? dx / len : 0;
  const uy = len > 0 ? dy / len : 0;
  const ah = 7;
  const ax = x2 - ux * ah - uy * ah * 0.5;
  const ay = y2 - uy * ah + ux * ah * 0.5;
  const bx = x2 - ux * ah + uy * ah * 0.5;
  const by = y2 - uy * ah - ux * ah * 0.5;

  const onPointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      onMove([Number(wx.toFixed(2)), Number(wy.toFixed(2))]);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMv);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <g>
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && <text x={x2 + 5} y={y2 - 5} fontSize={11} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>{label}</text>}
      <circle cx={x2} cy={y2} r={11} fill={color} fillOpacity={0.001} style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
        <title>{label}: ({u[0].toFixed(2)}, {u[1].toFixed(2)})</title>
      </circle>
    </g>
  );
}
