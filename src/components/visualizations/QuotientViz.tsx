// 3.7 — Quotient Spaces (interactive).
// V = R^2, U is a 1D subspace (line through origin). Cosets of U are parallel lines.
// The right-side number line is the key teaching device: V/U is 1-dimensional, and
// the cosets correspond to points on a number line.

import { useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

const W = 460;
const H = 460;
const CX = W / 2;
const CY = H / 2;
const UNIT = 60;

// Coset offsets (perpendicular signed distance from origin, in world units).
const OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

const COLORS = [
  'rgba(184, 150, 255, 0.7)', // purple
  'rgba(255, 217, 102, 0.7)', // yellow
  'rgba(111, 212, 154, 0.7)', // green
];

function cosetColor(idx: number): string {
  if (idx === 0) return 'rgba(103, 169, 255, 0.95)'; // cyan for U itself
  return COLORS[Math.abs(idx) % COLORS.length];
}

export function QuotientViz() {
  // Direction of U as an angle in radians; default 45° (diagonal — most pedagogically clear).
  const [theta, setTheta] = useState<number>(Math.PI / 4);
  // Selected coset, indexed by its offset value.
  const [selected, setSelected] = useState<number>(2);

  const dir: [number, number] = [Math.cos(theta), Math.sin(theta)];
  const perp: [number, number] = [-Math.sin(theta), Math.cos(theta)]; // unit perpendicular

  // Convert a world-space click to nearest offset.
  const onPlaneClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * W;
    const sy = ((e.clientY - rect.top) / rect.height) * H;
    const wx = (sx - CX) / UNIT;
    const wy = (CY - sy) / UNIT;
    // Project onto perpendicular: t = <(wx, wy), perp>
    const t = wx * perp[0] + wy * perp[1];
    // Snap to nearest available offset
    const nearest = OFFSETS.reduce((best, o) =>
      Math.abs(o - t) < Math.abs(best - t) ? o : best
    , OFFSETS[0]);
    setSelected(nearest);
  };

  // Render a coset at offset t: line through (t * perp) in direction dir.
  // Parameterize as anchor + s * dir for s ∈ [-5, 5] (clipped by viewport).
  const cosetEndpoints = (t: number): [[number, number], [number, number]] => {
    const ax = t * perp[0];
    const ay = t * perp[1];
    const ext = 5;
    return [
      [ax + ext * dir[0], ay + ext * dir[1]],
      [ax - ext * dir[0], ay - ext * dir[1]],
    ];
  };

  const repPoint = (t: number): [number, number] => [t * perp[0], t * perp[1]];

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  // Drag handle for theta
  const handlePos: [number, number] = [Math.cos(theta) * 2.6, Math.sin(theta) * 2.6];

  const onHandlePointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMove = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      const ang = Math.atan2(wy, wx);
      // Restrict to [0, π) — direction is unsigned (line through origin)
      let normalized = ang;
      while (normalized < 0) normalized += Math.PI;
      while (normalized >= Math.PI) normalized -= Math.PI;
      setTheta(normalized);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, alignItems: 'start' }}>
        {/* ── Plane ─────────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 8,
          }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ display: 'block', cursor: 'crosshair' }}
            onClick={onPlaneClick}
          >
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Cosets */}
            {OFFSETS.map((t) => {
              const [[x1, y1], [x2, y2]] = cosetEndpoints(t);
              const isU = t === 0;
              const isSelected = t === selected;
              return (
                <g key={t}>
                  <line
                    x1={w2sX(x1)}
                    y1={w2sY(y1)}
                    x2={w2sX(x2)}
                    y2={w2sY(y2)}
                    stroke={cosetColor(t)}
                    strokeWidth={isSelected ? 3 : isU ? 2.4 : 1.4}
                    strokeDasharray={isU ? undefined : isSelected ? undefined : '4 4'}
                    opacity={isSelected || isU ? 1 : 0.8}
                  />
                  {/* Representative dot */}
                  {(isSelected || isU) && (
                    <circle
                      cx={w2sX(repPoint(t)[0])}
                      cy={w2sY(repPoint(t)[1])}
                      r={4}
                      fill={cosetColor(t)}
                    />
                  )}
                </g>
              );
            })}

            {/* Drag handle for U direction */}
            <line
              x1={CX}
              y1={CY}
              x2={w2sX(handlePos[0])}
              y2={w2sY(handlePos[1])}
              stroke="rgba(103, 169, 255, 0.4)"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
            <circle
              cx={w2sX(handlePos[0])}
              cy={w2sY(handlePos[1])}
              r={9}
              fill="rgba(103, 169, 255, 0.25)"
              stroke="var(--viz-blue, #67a9ff)"
              strokeWidth={1.6}
              style={{ cursor: 'grab' }}
              onPointerDown={onHandlePointerDown}
            />
            <text
              x={w2sX(handlePos[0]) + 12}
              y={w2sY(handlePos[1])}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--accent-bright, #67a9ff)"
            >
              U dir
            </text>
          </svg>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            click anywhere to select the nearest coset · drag the U handle to rotate
          </div>
        </div>

        {/* ── Right panel: number line for V/U ──────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            QUOTIENT V / U · 1-DIMENSIONAL
          </MonoLine>

          {/* Number line as a vertical strip */}
          <svg viewBox="0 0 200 280" width="100%" height={280}>
            <line x1={100} y1={20} x2={100} y2={260} stroke="var(--viz-axis, #2a3850)" strokeWidth={1} />
            {OFFSETS.map((t) => {
              const cy = 140 + t * 32;
              const isSelected = t === selected;
              const isU = t === 0;
              return (
                <g
                  key={t}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(t)}
                >
                  <line
                    x1={94}
                    y1={cy}
                    x2={106}
                    y2={cy}
                    stroke="var(--text-tertiary)"
                    strokeWidth={1}
                  />
                  <circle
                    cx={100}
                    cy={cy}
                    r={isSelected ? 7 : 5}
                    fill={cosetColor(t)}
                    stroke={isSelected ? 'var(--text-primary)' : 'transparent'}
                    strokeWidth={1.4}
                  />
                  <text
                    x={120}
                    y={cy + 3}
                    fontFamily="var(--font-mono)"
                    fontSize={isU ? 11 : 10}
                    fill={isU ? 'var(--accent-bright, #67a9ff)' : 'var(--text-secondary)'}
                  >
                    {isU ? '[0] = U' : `[${t > 0 ? '+' : ''}${t}]`}
                  </text>
                </g>
              );
            })}
            <text
              x={100}
              y={272}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--text-tertiary)"
              fontStyle="italic"
            >
              cosets as points
            </text>
          </svg>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 14,
          padding: 12,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 13 }}>
          <InlineMath math="\dim(V/U) = \dim V - \dim U = 2 - 1 = 1" />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
          selected: <InlineMath math={`[v_{${selected}}]`} />
          {selected !== 0 && (
            <span style={{ marginLeft: 8 }}>
              · representative ≈ ({(selected * perp[0]).toFixed(2)}, {(selected * perp[1]).toFixed(2)})
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton onClick={() => setTheta(Math.PI / 4)}>U at 45°</VizControlButton>
        <VizControlButton onClick={() => setTheta(0)}>U = x-axis</VizControlButton>
        <VizControlButton onClick={() => setTheta(Math.PI / 2)}>U = y-axis</VizControlButton>
        <VizControlButton onClick={() => setSelected(0)}>select [0] = U</VizControlButton>
        <VizControlButton
          onClick={() => {
            setTheta(Math.PI / 4);
            setSelected(2);
          }}
        >
          reset
        </VizControlButton>
      </div>
    </div>
  );
}
