// 4.3 — Change of Basis (interactive).
// Two side-by-side R^2 panels: source basis B with v decomposed in B,
// and target basis C with v decomposed in C. Same physical v in both.
// Center column: the change-of-basis matrix P satisfying [v]_C = P [v]_B.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 280;
const H = 320;
const CX = W / 2;
const CY = H / 2;
const UNIT = 36;

function det2(b1: Vec2, b2: Vec2): number {
  return b1[0] * b2[1] - b1[1] * b2[0];
}

function coordsIn(b1: Vec2, b2: Vec2, v: Vec2): Vec2 | null {
  const d = det2(b1, b2);
  if (Math.abs(d) < 1e-6) return null;
  return [(b2[1] * v[0] - b2[0] * v[1]) / d, (-b1[1] * v[0] + b1[0] * v[1]) / d];
}

export function ChangeOfBasisViz() {
  const [v, setV] = useState<Vec2>([2, 1]);
  const [b1, setB1] = useState<Vec2>([1, 0]);
  const [b2, setB2] = useState<Vec2>([0, 1]);
  const [c1, setC1] = useState<Vec2>([1, 1]);
  const [c2, setC2] = useState<Vec2>([-1, 1]);

  const Bcoords = useMemo(() => coordsIn(b1, b2, v), [b1, b2, v]);
  const Ccoords = useMemo(() => coordsIn(c1, c2, v), [c1, c2, v]);
  // P columns = [b1]_C, [b2]_C
  const P = useMemo(() => {
    const col1 = coordsIn(c1, c2, b1);
    const col2 = coordsIn(c1, c2, b2);
    if (!col1 || !col2) return null;
    return [
      [col1[0], col2[0]],
      [col1[1], col2[1]],
    ];
  }, [c1, c2, b1, b2]);

  return (
    <div style={{ maxWidth: 760 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 12,
          alignItems: 'stretch',
        }}
      >
        {/* ── Source panel (B) ─────────────────────────────── */}
        <Panel title="ℝ² in basis B" basisColor="var(--viz-blue, #67a9ff)">
          <BasisAndVector
            b1={b1}
            b2={b2}
            v={v}
            coords={Bcoords}
            basisColor="var(--viz-blue, #67a9ff)"
            setV={setV}
            setB1={setB1}
            setB2={setB2}
          />
        </Panel>

        {/* ── Center: matrix P ─────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            minWidth: 180,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            CHANGE OF BASIS · B → C
          </MonoLine>
          <span style={{ fontSize: 22, color: 'var(--text-tertiary)' }}>→</span>
          {P ? (
            <div style={{ fontSize: 14, lineHeight: 1.4 }}>
              <InlineMath
                math={`P = \\begin{pmatrix} ${P[0][0].toFixed(2)} & ${P[0][1].toFixed(2)} \\\\ ${P[1][0].toFixed(2)} & ${P[1][1].toFixed(2)} \\end{pmatrix}`}
              />
            </div>
          ) : (
            <div style={{ color: 'rgba(255, 123, 107, 0.95)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              C is singular
            </div>
          )}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-tertiary)',
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: 160,
              lineHeight: 1.3,
            }}
          >
            column j = [b_j]_C
          </div>
          <div style={{ fontSize: 11, marginTop: 4 }}>
            <InlineMath math="[v]_\mathcal{C} = P [v]_\mathcal{B}" />
          </div>
        </div>

        {/* ── Target panel (C) ─────────────────────────────── */}
        <Panel title="ℝ² in basis C" basisColor="var(--viz-yellow, #ffd966)">
          <BasisAndVector
            b1={c1}
            b2={c2}
            v={v}
            coords={Ccoords}
            basisColor="var(--viz-yellow, #ffd966)"
            setV={setV}
            setB1={setC1}
            setB2={setC2}
          />
        </Panel>
      </div>

      {/* ── Verification ─────────────────────────────────── */}
      <div
        style={{
          marginTop: 14,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 14,
        }}
      >
        <MonoLine size={9} color="var(--text-tertiary)">
          VERIFICATION
        </MonoLine>
        {P && Bcoords && Ccoords ? (
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 13 }}>
            <InlineMath
              math={`P [v]_\\mathcal{B} = \\begin{pmatrix} ${P[0][0].toFixed(2)} & ${P[0][1].toFixed(2)} \\\\ ${P[1][0].toFixed(2)} & ${P[1][1].toFixed(2)} \\end{pmatrix} \\begin{pmatrix} ${Bcoords[0].toFixed(2)} \\\\ ${Bcoords[1].toFixed(2)} \\end{pmatrix} = \\begin{pmatrix} ${Ccoords[0].toFixed(2)} \\\\ ${Ccoords[1].toFixed(2)} \\end{pmatrix} = [v]_\\mathcal{C} \\;\\;\\checkmark`}
            />
          </div>
        ) : (
          <div style={{ marginTop: 8, color: 'rgba(255, 123, 107, 0.95)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            verification unavailable — basis is singular
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton
          onClick={() => {
            setB1([1, 0]);
            setB2([0, 1]);
          }}
        >
          B → standard
        </VizControlButton>
        <VizControlButton
          onClick={() => {
            setC1([Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)]);
            setC2([-Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)]);
          }}
        >
          C → rotated 30°
        </VizControlButton>
        <VizControlButton
          onClick={() => {
            setV([2, 1]);
            setB1([1, 0]);
            setB2([0, 1]);
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

function Panel({
  title,
  basisColor,
  children,
}: {
  title: string;
  basisColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: `1px solid var(--border-subtle)`,
        borderRadius: 8,
        padding: 8,
        boxShadow: `inset 0 0 0 1px ${basisColor.replace(', 0.', ', 0.04')}`,
      }}
    >
      <MonoLine size={9} color="var(--text-tertiary)">
        {title}
      </MonoLine>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <GridAxes width={W} height={H} unit={UNIT} />
        {children}
      </svg>
    </div>
  );
}

function BasisAndVector({
  b1,
  b2,
  v,
  coords,
  basisColor,
  setV,
  setB1,
  setB2,
}: {
  b1: Vec2;
  b2: Vec2;
  v: Vec2;
  coords: Vec2 | null;
  basisColor: string;
  setV: (v: Vec2) => void;
  setB1: (v: Vec2) => void;
  setB2: (v: Vec2) => void;
}) {
  return (
    <>
      {/* Decomposition parallelogram */}
      {coords && <Decomp b1={b1} b2={b2} c1={coords[0]} c2={coords[1]} color={basisColor} />}

      {/* Basis */}
      <DragArrow u={b1} color={basisColor} label="b1" onMove={setB1} />
      <DragArrow u={b2} color={basisColor} label="b2" dashed onMove={setB2} />

      {/* v in purple */}
      <DragArrow u={v} color="rgba(184, 150, 255, 0.95)" label="v" thick onMove={setV} />

      {/* Coordinate readout in upper-left of panel */}
      {coords && (
        <text x={8} y={H - 8} fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-secondary)">
          [v] = ({coords[0].toFixed(2)}, {coords[1].toFixed(2)})
        </text>
      )}
    </>
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
  const pt = (vv: Vec2) => `${CX + vv[0] * UNIT},${CY - vv[1] * UNIT}`;
  return (
    <polygon
      points={`${CX},${CY} ${pt(a)} ${pt(b)} ${pt(c)}`}
      fill={color}
      fillOpacity={0.18}
      stroke={color}
      strokeWidth={1}
      strokeDasharray="3 3"
    />
  );
}

function DragArrow({
  u,
  color,
  label,
  dashed,
  thick,
  onMove,
}: {
  u: Vec2;
  color: string;
  label?: string;
  dashed?: boolean;
  thick?: boolean;
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
  const ah = thick ? 8 : 6;
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
      <line
        x1={CX}
        y1={CY}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={thick ? 2.6 : 1.6}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 5} y={y2 - 5} fontSize={9} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>
          {label}
        </text>
      )}
      <circle
        cx={x2}
        cy={y2}
        r={9}
        fill={color}
        fillOpacity={0.001}
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
