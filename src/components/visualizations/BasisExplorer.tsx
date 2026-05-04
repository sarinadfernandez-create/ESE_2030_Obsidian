// 4.1 — Basis Explorer (interactive).
// In R^2: drag up to 3 candidate vectors. The span is rendered as a translucent
// line / plane. Status panel reports spanning, independence, and "is basis".

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 460;
const H = 400;
const CX = W / 2;
const CY = H / 2;
const UNIT = 50;

const COLORS = ['var(--viz-blue, #67a9ff)', 'var(--viz-yellow, #ffd966)', 'rgba(184, 150, 255, 0.95)'];

const TOL = 1e-4;

function det2(v1: Vec2, v2: Vec2): number {
  return v1[0] * v2[1] - v1[1] * v2[0];
}

function isZero(v: Vec2): boolean {
  return Math.hypot(v[0], v[1]) < TOL;
}

// Compute span dimension of vectors in R^2.
function spanDim(vectors: Vec2[]): number {
  const nonzero = vectors.filter((v) => !isZero(v));
  if (nonzero.length === 0) return 0;
  if (nonzero.length === 1) return 1;
  // Pairwise check: two vectors are independent iff det != 0.
  // Iterate through pairs; any independent pair gives dim >= 2.
  for (let i = 0; i < nonzero.length; i++) {
    for (let j = i + 1; j < nonzero.length; j++) {
      if (Math.abs(det2(nonzero[i], nonzero[j])) > TOL) return 2;
    }
  }
  return 1;
}

export function BasisExplorer() {
  const [count, setCount] = useState<number>(2);
  const [vectors, setVectors] = useState<Vec2[]>([
    [1.5, 0],
    [0, 1.5],
    [1, 1],
  ]);

  const active = vectors.slice(0, count);
  const dim = useMemo(() => spanDim(active), [active]);
  const ambient = 2;
  const independent = count <= 1 ? !isZero(active[0] ?? [0, 0]) : count <= ambient && dim === count;
  const spans = dim === ambient;
  const isBasis = independent && spans;

  const setVec = (i: number, v: Vec2) => {
    setVectors((vs) => {
      const next = [...vs];
      next[i] = v;
      return next;
    });
  };

  const setStandard = () => {
    setCount(2);
    setVectors([
      [1.5, 0],
      [0, 1.5],
      [1, 1],
    ]);
  };
  const setDependent = () => {
    setCount(2);
    setVectors([
      [1.5, 0],
      [3, 0],
      [1, 1],
    ]);
  };
  const setOverdetermined = () => {
    setCount(3);
    setVectors([
      [1.5, 0],
      [0, 1.5],
      [1, 1],
    ]);
  };

  // Span shape: line (along nonzero vector) or plane.
  const spanRender = () => {
    if (dim === 0) {
      return <circle cx={CX} cy={CY} r={4} fill="rgba(103, 169, 255, 0.6)" />;
    }
    if (dim === 1) {
      // Pick the first nonzero vector as direction.
      const dir = active.find((v) => !isZero(v))!;
      const norm = Math.hypot(dir[0], dir[1]);
      const f = 6 / norm;
      const x1 = CX + dir[0] * f * UNIT;
      const y1 = CY - dir[1] * f * UNIT;
      const x2 = CX - dir[0] * f * UNIT;
      const y2 = CY + dir[1] * f * UNIT;
      return (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(103, 169, 255, 0.5)"
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
    // dim 2: full plane tint
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
        {/* ── Plane ────────────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 8,
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            {spanRender()}
            {active.map((v, i) => (
              <Vec
                key={i}
                u={v}
                color={COLORS[i]}
                label={`v${i + 1}`}
                onMove={(nv) => setVec(i, nv)}
              />
            ))}
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
            drag arrows to test different configurations
          </div>
        </div>

        {/* ── Status panel ─────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            STATUS
          </MonoLine>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>vectors:</span>
            <button
              onClick={() => setCount(Math.max(1, count - 1))}
              disabled={count <= 1}
              style={btnSmall}
            >
              −
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, minWidth: 14, textAlign: 'center' }}>
              {count}
            </span>
            <button
              onClick={() => setCount(Math.min(3, count + 1))}
              disabled={count >= 3}
              style={btnSmall}
            >
              +
            </button>
          </div>

          <StatusRow label="spans ℝ²?" ok={spans} />
          <StatusRow label="linearly indep.?" ok={independent} />
          <StatusRow label="is a basis?" ok={isBasis} highlight />

          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 10,
              marginTop: 4,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div>
              dim(span) = <span style={{ color: 'var(--accent-bright, #67a9ff)', fontWeight: 600 }}>{dim}</span>
            </div>
            <div>
              shortfall = <span style={{ color: 'var(--text-secondary)' }}>{ambient - dim}</span>
            </div>
            {count > ambient && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  color: 'rgba(255, 217, 102, 0.95)',
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                }}
              >
                {count} vectors in 2D → forced dependent
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Controls ─────────────────────────────────────────── */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton onClick={setStandard}>standard basis</VizControlButton>
        <VizControlButton onClick={setDependent}>dependent example</VizControlButton>
        <VizControlButton onClick={setOverdetermined}>3 vectors (forced dep)</VizControlButton>
      </div>

      <div
        style={{
          marginTop: 14,
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--text-tertiary)',
          textAlign: 'center',
        }}
      >
        <InlineMath math={`\\dim(\\mathrm{span}) = ${dim} \\;\\;\\;\\; \\dim(V) - \\dim(\\mathrm{span}) = ${ambient - dim}`} />
      </div>
    </div>
  );
}

const btnSmall: React.CSSProperties = {
  width: 22,
  height: 22,
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: 3,
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
};

function StatusRow({ label, ok, highlight }: { label: string; ok: boolean; highlight?: boolean }) {
  const color = ok ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: highlight ? '6px 8px' : 0,
        background: highlight ? (ok ? 'rgba(111, 212, 154, 0.08)' : 'rgba(255, 123, 107, 0.06)') : 'transparent',
        border: highlight ? `1px solid ${ok ? 'rgba(111, 212, 154, 0.4)' : 'rgba(255, 123, 107, 0.4)'}` : 'none',
        borderRadius: 4,
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{label}</span>
      <span style={{ color, fontWeight: 600 }}>{ok ? '✓ yes' : '✗ no'}</span>
    </div>
  );
}

function Vec({
  u,
  color,
  label,
  onMove,
}: {
  u: Vec2;
  color: string;
  label?: string;
  onMove: (v: Vec2) => void;
}) {
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
    const onMoveEv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      onMove([Number(wx.toFixed(2)), Number(wy.toFixed(2))]);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMoveEv);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMoveEv);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <g>
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 6} y={y2 - 6} fontSize={10} fontFamily="var(--font-mono)" fill={color}>
          {label}
        </text>
      )}
      <circle
        cx={x2}
        cy={y2}
        r={9}
        fill={color}
        fillOpacity={0.001}
        stroke="transparent"
        style={{ cursor: 'grab' }}
        onPointerDown={onPointerDown}
      >
        <title>
          {label}: ({u[0].toFixed(2)}, {u[1].toFixed(2)})
        </title>
      </circle>
    </g>
  );
}
