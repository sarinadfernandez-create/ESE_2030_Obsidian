// 4.2 — Coordinates (interactive).
// One R^2 plane, one fixed vector v, two bases B and C.
// Coordinate readouts in both bases update live as the user drags v or any basis vector.
// The vector is the SAME — only its representation changes.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 480;
const H = 480;
const CX = W / 2;
const CY = H / 2;
const UNIT = 56;

function det2(b1: Vec2, b2: Vec2): number {
  return b1[0] * b2[1] - b1[1] * b2[0];
}

// Solve [c1, c2] = B^-1 v where B has columns b1, b2.
function coordsIn(b1: Vec2, b2: Vec2, v: Vec2): Vec2 | null {
  const d = det2(b1, b2);
  if (Math.abs(d) < 1e-6) return null;
  const c1 = (b2[1] * v[0] - b2[0] * v[1]) / d;
  const c2 = (-b1[1] * v[0] + b1[0] * v[1]) / d;
  return [c1, c2];
}

export function CoordinateViz() {
  const [v, setV] = useState<Vec2>([2, 1]);
  const [b1, setB1] = useState<Vec2>([1, 0]);
  const [b2, setB2] = useState<Vec2>([0, 1]);
  const [c1, setC1] = useState<Vec2>([1, 1]);
  const [c2, setC2] = useState<Vec2>([-1, 1]);
  const [lockB, setLockB] = useState(true);
  const [active, setActive] = useState<'B' | 'C'>('C');

  const Bcoords = useMemo(() => coordsIn(b1, b2, v), [b1, b2, v]);
  const Ccoords = useMemo(() => coordsIn(c1, c2, v), [c1, c2, v]);

  const norm = Math.hypot(v[0], v[1]);

  const setStdBasis = () => {
    setB1([1, 0]);
    setB2([0, 1]);
  };
  const setRotatedC = () => {
    setC1([Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)]);
    setC2([-Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)]);
  };

  // When lockB is on, force B to standard basis.
  const effB1: Vec2 = lockB ? [1, 0] : b1;
  const effB2: Vec2 = lockB ? [0, 1] : b2;

  const activeBasis = active === 'B' ? [effB1, effB2] : [c1, c2];
  const activeCoords = active === 'B' ? Bcoords : Ccoords;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, alignItems: 'start' }}>
        {/* ── Plane ────────────────────────────────────────── */}
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

            {/* Decomposition parallelogram for the active basis */}
            {activeCoords && (
              <Decomp
                b1={activeBasis[0]}
                b2={activeBasis[1]}
                c1={activeCoords[0]}
                c2={activeCoords[1]}
                color={active === 'B' ? 'rgba(103, 169, 255, 0.4)' : 'rgba(255, 217, 102, 0.4)'}
              />
            )}

            {/* B basis */}
            <BasisVec u={effB1} color="var(--viz-blue, #67a9ff)" label="b1" onMove={lockB ? undefined : setB1} />
            <BasisVec u={effB2} color="var(--viz-blue, #67a9ff)" label="b2" dashed onMove={lockB ? undefined : setB2} />

            {/* C basis */}
            <BasisVec u={c1} color="var(--viz-yellow, #ffd966)" label="c1" onMove={setC1} />
            <BasisVec u={c2} color="var(--viz-yellow, #ffd966)" label="c2" dashed onMove={setC2} />

            {/* Vector v — purple, thick */}
            <FatArrow u={v} color="rgba(184, 150, 255, 0.95)" label="v" onMove={setV} />
          </svg>
        </div>

        {/* ── Coordinate readouts ─────────────────────────── */}
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
          <ReadoutCard
            label="basis B"
            color="var(--viz-blue, #67a9ff)"
            coords={Bcoords}
            ortho={isOrthonormal(effB1, effB2)}
            norm={norm}
            isActive={active === 'B'}
            onActivate={() => setActive('B')}
          />
          <ReadoutCard
            label="basis C"
            color="var(--viz-yellow, #ffd966)"
            coords={Ccoords}
            ortho={isOrthonormal(c1, c2)}
            norm={norm}
            isActive={active === 'C'}
            onActivate={() => setActive('C')}
          />
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 11,
              color: 'var(--text-tertiary)',
              lineHeight: 1.4,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 8,
            }}
          >
            v is the same arrow — only the basis-relative coordinates change.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton onClick={() => setLockB((l) => !l)} active={lockB}>
          lock B = standard basis
        </VizControlButton>
        <VizControlButton onClick={setStdBasis} disabled={lockB}>
          B → standard
        </VizControlButton>
        <VizControlButton onClick={setRotatedC}>C → 30° rotated</VizControlButton>
        <VizControlButton
          onClick={() => {
            setV([2, 1]);
            setStdBasis();
            setC1([1, 1]);
            setC2([-1, 1]);
          }}
        >
          reset
        </VizControlButton>
      </div>
    </div>
  );
}

function isOrthonormal(b1: Vec2, b2: Vec2): boolean {
  const dot = b1[0] * b2[0] + b1[1] * b2[1];
  const n1 = Math.hypot(b1[0], b1[1]);
  const n2 = Math.hypot(b2[0], b2[1]);
  return Math.abs(dot) < 1e-3 && Math.abs(n1 - 1) < 1e-3 && Math.abs(n2 - 1) < 1e-3;
}

function ReadoutCard({
  label,
  color,
  coords,
  ortho,
  norm,
  isActive,
  onActivate,
}: {
  label: string;
  color: string;
  coords: Vec2 | null;
  ortho: boolean;
  norm: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      onClick={onActivate}
      style={{
        padding: 10,
        background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid ${isActive ? color : 'var(--border-subtle)'}`,
        borderRadius: 4,
        cursor: 'pointer',
      }}
    >
      <MonoLine size={9} color={color}>
        {label.toUpperCase()} {isActive && '· decomposing'}
      </MonoLine>
      {coords ? (
        <>
          <div style={{ fontSize: 13, marginTop: 6 }}>
            <InlineMath math={`[v]_{\\mathcal{${label.split(' ')[1]}}} = (${coords[0].toFixed(2)},\\, ${coords[1].toFixed(2)})^T`} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-tertiary)',
              marginTop: 4,
            }}
          >
            ‖[v]‖ = {Math.hypot(coords[0], coords[1]).toFixed(2)}
            {ortho ? ' · = ‖v‖ ✓' : ' ≠ ‖v‖ (basis not ortho)'}
            {' · '}‖v‖ = {norm.toFixed(2)}
          </div>
        </>
      ) : (
        <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(255, 123, 107, 0.95)', fontFamily: 'var(--font-mono)' }}>
          basis singular · coords undefined
        </div>
      )}
    </div>
  );
}

function Decomp({
  b1,
  b2,
  c1,
  c2,
  color,
}: {
  b1: Vec2;
  b2: Vec2;
  c1: number;
  c2: number;
  color: string;
}) {
  const max = 4;
  const clamp = (v: Vec2): Vec2 => {
    const n = Math.hypot(v[0], v[1]);
    return n > max ? [(v[0] * max) / n, (v[1] * max) / n] : v;
  };
  const a = clamp([c1 * b1[0], c1 * b1[1]]);
  const b = clamp([c1 * b1[0] + c2 * b2[0], c1 * b1[1] + c2 * b2[1]]);
  const c = clamp([c2 * b2[0], c2 * b2[1]]);
  const pt = (v: Vec2) => `${CX + v[0] * UNIT},${CY - v[1] * UNIT}`;
  return (
    <g>
      <polygon points={`${CX},${CY} ${pt(a)} ${pt(b)} ${pt(c)}`} fill={color} fillOpacity={0.4} stroke="none" />
      <line x1={CX} y1={CY} x2={CX + a[0] * UNIT} y2={CY - a[1] * UNIT} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={CX} y1={CY} x2={CX + c[0] * UNIT} y2={CY - c[1] * UNIT} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
    </g>
  );
}

function BasisVec({
  u,
  color,
  label,
  dashed,
  onMove,
}: {
  u: Vec2;
  color: string;
  label: string;
  dashed?: boolean;
  onMove?: (v: Vec2) => void;
}) {
  return <Arrow u={u} color={color} label={label} dashed={dashed} thin onMove={onMove} />;
}

function FatArrow(props: { u: Vec2; color: string; label?: string; onMove?: (v: Vec2) => void }) {
  return <Arrow {...props} thick />;
}

function Arrow({
  u,
  color,
  label,
  dashed,
  thin,
  thick,
  onMove,
}: {
  u: Vec2;
  color: string;
  label?: string;
  dashed?: boolean;
  thin?: boolean;
  thick?: boolean;
  onMove?: (v: Vec2) => void;
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
  const ah = thick ? 9 : 7;
  const ax = x2 - ux * ah - uy * ah * 0.5;
  const ay = y2 - uy * ah + ux * ah * 0.5;
  const bx = x2 - ux * ah + uy * ah * 0.5;
  const by = y2 - uy * ah - ux * ah * 0.5;
  const sw = thick ? 3 : thin ? 1.6 : 2;

  const onPointerDown = onMove
    ? (e: React.PointerEvent<SVGCircleElement>) => {
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
      }
    : undefined;

  return (
    <g>
      <line
        x1={CX}
        y1={CY}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={sw}
        strokeDasharray={dashed ? '5 5' : undefined}
      />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 6} y={y2 - 6} fontSize={11} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>
          {label}
        </text>
      )}
      {onMove && (
        <circle
          cx={x2}
          cy={y2}
          r={10}
          fill={color}
          fillOpacity={0.001}
          style={{ cursor: 'grab' }}
          onPointerDown={onPointerDown}
        >
          <title>
            {label}: ({u[0].toFixed(2)}, {u[1].toFixed(2)})
          </title>
        </circle>
      )}
    </g>
  );
}
