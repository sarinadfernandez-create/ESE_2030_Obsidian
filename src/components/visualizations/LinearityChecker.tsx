// 3.2 — Linearity Checker (interactive).
// Pick a candidate T: R^2 → R^2 (linear or impostor) and check both linearity axioms
// with concrete u, v, c inputs. Two side-by-side planes show the inputs and outputs.

import { useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

type Candidate =
  | 'matrix'
  | 'translation'
  | 'product'
  | 'absolute-value'
  | 'square'
  | 'swap'
  | 'cumulative';

interface CandidateInfo {
  id: Candidate;
  label: string;
  formula: string;
  linear: boolean;
  apply: (v: Vec2, params: { a: number; b: number; c: number; d: number }) => Vec2;
}

const CANDIDATES: CandidateInfo[] = [
  {
    id: 'matrix',
    label: 'matrix T(x,y) = (ax+by, cx+dy)',
    formula: 'T(x, y) = (a x + b y,\\, c x + d y)',
    linear: true,
    apply: ([x, y], { a, b, c, d }) => [a * x + b * y, c * x + d * y],
  },
  {
    id: 'swap',
    label: 'swap T(x,y) = (y, x)',
    formula: 'T(x, y) = (y, x)',
    linear: true,
    apply: ([x, y]) => [y, x],
  },
  {
    id: 'cumulative',
    label: 'cumulative T(x,y) = (x, x+y)',
    formula: 'T(x, y) = (x,\\, x + y)',
    linear: true,
    apply: ([x, y]) => [x, x + y],
  },
  {
    id: 'translation',
    label: 'translation T(x,y) = (x+1, y)',
    formula: 'T(x, y) = (x + 1,\\, y)',
    linear: false,
    apply: ([x, y]) => [x + 1, y],
  },
  {
    id: 'product',
    label: 'product T(x,y) = (xy, 0)',
    formula: 'T(x, y) = (x y,\\, 0)',
    linear: false,
    apply: ([x, y]) => [x * y, 0],
  },
  {
    id: 'absolute-value',
    label: 'absolute T(x,y) = (|x|, y)',
    formula: 'T(x, y) = (|x|,\\, y)',
    linear: false,
    apply: ([x, y]) => [Math.abs(x), y],
  },
  {
    id: 'square',
    label: 'square T(x,y) = (x², y²)',
    formula: 'T(x, y) = (x^2,\\, y^2)',
    linear: false,
    apply: ([x, y]) => [x * x, y * y],
  },
];

const TOL = 1e-3;
const W = 220;
const H = 220;
const CX = W / 2;
const CY = H / 2;
const UNIT = 28;

function vecEqual(a: Vec2, b: Vec2): boolean {
  return Math.hypot(a[0] - b[0], a[1] - b[1]) < TOL;
}

export function LinearityChecker() {
  const [candidate, setCandidate] = useState<Candidate>('matrix');
  const [params, setParams] = useState({ a: 1, b: 0.5, c: -0.5, d: 1 });
  const [u, setU] = useState<Vec2>([1, 0.5]);
  const [v, setV] = useState<Vec2>([-0.5, 1]);
  const [scalar, setScalar] = useState<number>(2);

  const info = CANDIDATES.find((c) => c.id === candidate)!;

  const Tu = info.apply(u, params);
  const Tv = info.apply(v, params);
  const Tuv = info.apply([u[0] + v[0], u[1] + v[1]], params);
  const TuPlusTv: Vec2 = [Tu[0] + Tv[0], Tu[1] + Tv[1]];
  const Tcu = info.apply([scalar * u[0], scalar * u[1]], params);
  const cTu: Vec2 = [scalar * Tu[0], scalar * Tu[1]];

  const additivityHolds = vecEqual(Tuv, TuPlusTv);
  const homogeneityHolds = vecEqual(Tcu, cTu);
  const sometimesLinear = additivityHolds && homogeneityHolds;

  const counterexample = () => {
    // Pick inputs that demonstrate the failure for non-linear candidates.
    if (candidate === 'translation') {
      setU([0, 0]);
      setV([0, 0]);
      setScalar(2);
    } else if (candidate === 'product') {
      setU([1, 0]);
      setV([0, 1]);
      setScalar(1);
    } else if (candidate === 'absolute-value') {
      setU([1, 0]);
      setV([0, 0]);
      setScalar(-1);
    } else if (candidate === 'square') {
      setU([2, 0]);
      setV([0, 0]);
      setScalar(2);
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      {/* ── Candidate selector + formula ──────────────────────── */}
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        <select
          className="viz-preset-select"
          value={candidate}
          onChange={(e) => setCandidate(e.target.value as Candidate)}
          style={{ marginBottom: 8 }}
        >
          {CANDIDATES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <div style={{ fontSize: 14 }}>
          <InlineMath math={info.formula} />
        </div>
      </div>

      {/* ── Two planes side by side ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
        <PlanePanel title="INPUT">
          <Vec u={u} color="var(--viz-blue, #67a9ff)" label="u" />
          <Vec u={v} color="var(--viz-yellow, #ffd966)" label="v" />
          <Vec u={[u[0] + v[0], u[1] + v[1]]} color="rgba(184, 150, 255, 0.85)" label="u+v" dashed />
          <Vec u={[scalar * u[0], scalar * u[1]]} color="rgba(111, 212, 154, 0.85)" label={`${scalar}u`} dashed />
          <DragHandle pos={u} setPos={setU} color="var(--viz-blue, #67a9ff)" />
          <DragHandle pos={v} setPos={setV} color="var(--viz-yellow, #ffd966)" />
        </PlanePanel>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>→</span>
          <span style={{ fontStyle: 'italic' }}>T</span>
        </div>

        <PlanePanel title="OUTPUT">
          <Vec u={Tu} color="var(--viz-blue, #67a9ff)" label="T(u)" />
          <Vec u={Tv} color="var(--viz-yellow, #ffd966)" label="T(v)" />
          <Vec u={Tuv} color="rgba(184, 150, 255, 0.85)" label="T(u+v)" dashed />
          <Vec u={TuPlusTv} color="rgba(111, 212, 154, 0.6)" label="T(u)+T(v)" dotted />
        </PlanePanel>
      </div>

      {/* ── Test panels ───────────────────────────────────────── */}
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <TestBox
          ok={additivityHolds}
          formula="T(u+v) = T(u) + T(v)"
          lhs={Tuv}
          rhs={TuPlusTv}
          lhsLabel="T(u+v)"
          rhsLabel="T(u)+T(v)"
        />
        <TestBox
          ok={homogeneityHolds}
          formula={`T(${scalar}u) = ${scalar} T(u)`}
          lhs={Tcu}
          rhs={cTu}
          lhsLabel={`T(${scalar}u)`}
          rhsLabel={`${scalar} T(u)`}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 10,
          background: sometimesLinear
            ? 'rgba(111, 212, 154, 0.08)'
            : 'rgba(255, 123, 107, 0.08)',
          border: `1px solid ${sometimesLinear ? 'rgba(111, 212, 154, 0.4)' : 'rgba(255, 123, 107, 0.4)'}`,
          borderRadius: 6,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
        }}
      >
        {sometimesLinear
          ? info.linear
            ? '✓ both axioms hold for these inputs · candidate is linear'
            : '✓ both axioms hold for THESE inputs — but linearity requires ALL inputs. Try the counterexample button.'
          : `✗ axiom failure detected — ${info.linear ? 'numerical artifact?' : 'this candidate is NOT linear'}`}
      </div>

      {/* ── Controls ──────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 60 }}>scalar c</span>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={scalar}
            onChange={(e) => setScalar(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, minWidth: 40, textAlign: 'right' }}>
            {scalar.toFixed(1)}
          </span>
        </div>

        {candidate === 'matrix' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(['a', 'b', 'c', 'd'] as const).map((k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 14 }}>{k}</span>
                <input
                  type="range"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={params[k]}
                  onChange={(e) => setParams((p) => ({ ...p, [k]: Number(e.target.value) }))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 32, textAlign: 'right' }}>
                  {params[k].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {!info.linear && (
            <VizControlButton onClick={counterexample}>find counterexample</VizControlButton>
          )}
          <VizControlButton
            onClick={() => {
              setU([1, 0.5]);
              setV([-0.5, 1]);
              setScalar(2);
            }}
          >
            reset inputs
          </VizControlButton>
        </div>
      </div>
    </div>
  );
}

function PlanePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: 8,
        position: 'relative',
      }}
    >
      <MonoLine size={9} color="var(--text-tertiary)">
        {title}
      </MonoLine>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginTop: 4 }}>
        <GridAxes width={W} height={H} unit={UNIT} />
        {children}
      </svg>
    </div>
  );
}

function Vec({
  u,
  color,
  label,
  dashed,
  dotted,
}: {
  u: Vec2;
  color: string;
  label?: string;
  dashed?: boolean;
  dotted?: boolean;
}) {
  // Clamp display length
  const max = 3.2;
  const norm = Math.hypot(u[0], u[1]);
  const f = norm > max ? max / norm : 1;
  const x2 = CX + u[0] * f * UNIT;
  const y2 = CY - u[1] * f * UNIT;
  const dx = x2 - CX;
  const dy = y2 - CY;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const ah = 6;
  const ax = x2 - ux * ah - uy * ah * 0.5;
  const ay = y2 - uy * ah + ux * ah * 0.5;
  const bx = x2 - ux * ah + uy * ah * 0.5;
  const by = y2 - uy * ah - ux * ah * 0.5;
  const dashStyle = dashed ? '4 4' : dotted ? '2 3' : undefined;
  return (
    <g>
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={1.6} strokeDasharray={dashStyle} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 4} y={y2 - 4} fontSize={9} fontFamily="var(--font-mono)" fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

function DragHandle({
  pos,
  setPos,
  color,
}: {
  pos: Vec2;
  setPos: (v: Vec2) => void;
  color: string;
}) {
  const max = 3.2;
  const norm = Math.hypot(pos[0], pos[1]);
  const f = norm > max ? max / norm : 1;
  const x = CX + pos[0] * f * UNIT;
  const y = CY - pos[1] * f * UNIT;

  const onPointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMove = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      const nx = Math.max(-3, Math.min(3, wx));
      const ny = Math.max(-3, Math.min(3, wy));
      setPos([Number(nx.toFixed(2)), Number(ny.toFixed(2))]);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <circle
      cx={x}
      cy={y}
      r={6}
      fill={color}
      fillOpacity={0.3}
      stroke={color}
      strokeWidth={1.5}
      style={{ cursor: 'grab' }}
      onPointerDown={onPointerDown}
    />
  );
}

function TestBox({
  ok,
  formula,
  lhs,
  rhs,
  lhsLabel,
  rhsLabel,
}: {
  ok: boolean;
  formula: string;
  lhs: Vec2;
  rhs: Vec2;
  lhsLabel: string;
  rhsLabel: string;
}) {
  return (
    <div
      style={{
        padding: 10,
        background: ok ? 'rgba(111, 212, 154, 0.06)' : 'rgba(255, 123, 107, 0.06)',
        border: `1px solid ${ok ? 'rgba(111, 212, 154, 0.4)' : 'rgba(255, 123, 107, 0.4)'}`,
        borderRadius: 4,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 12 }}>
          <InlineMath math={formula} />
        </span>
        <span style={{ color: ok ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)', fontWeight: 600 }}>
          {ok ? '✓' : '✗'}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
        {lhsLabel} = ({lhs[0].toFixed(2)}, {lhs[1].toFixed(2)})
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
        {rhsLabel} = ({rhs[0].toFixed(2)}, {rhs[1].toFixed(2)})
      </div>
    </div>
  );
}
