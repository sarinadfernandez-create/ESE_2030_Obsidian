import { useState, useMemo } from 'react';
import { fmtCell } from '../../lib/linearAlgebra';
import {
  CANVAS_W,
  GridAxes,
  MonoLine,
  NumberCell,
  OverlayPanel,
  PresetSelect,
  VizControlButton,
  w2sX,
  w2sY,
} from './_shared';

const CANVAS_H = 500;
const CENTER_Y = CANVAS_H / 2;
const EPS = 1e-6;

interface LinearEq {
  a: number;
  b: number;
  c: number;
}

const PRESETS: Record<string, [LinearEq, LinearEq]> = {
  'Default (unique)': [{ a: 2, b: 1, c: 5 }, { a: 1, b: -1, c: 1 }],
  'Parallel (no solution)': [{ a: 1, b: 1, c: 3 }, { a: 2, b: 2, c: 7 }],
  'Coincident (infinite)': [{ a: 1, b: 1, c: 3 }, { a: 2, b: 2, c: 6 }],
  'Vertical line': [{ a: 1, b: 0, c: 3 }, { a: 1, b: -1, c: 1 }],
  'Horizontal line': [{ a: 0, b: 1, c: 2 }, { a: 1, b: -1, c: 1 }],
  'Degenerate (eq 1 is 0 = 1)': [{ a: 0, b: 0, c: 1 }, { a: 1, b: -1, c: 1 }],
};

type Result =
  | { kind: 'unique'; x: number; y: number; offscreen: boolean }
  | { kind: 'none'; reason: string }
  | { kind: 'infinite'; reason: string }
  | { kind: 'all'; reason: string }
  | { kind: 'one-trivial'; eqDropped: 1 | 2 };

function classify(e1: LinearEq, e2: LinearEq): Result {
  const e1Trivial = Math.abs(e1.a) < EPS && Math.abs(e1.b) < EPS;
  const e2Trivial = Math.abs(e2.a) < EPS && Math.abs(e2.b) < EPS;

  if (e1Trivial && e2Trivial) {
    if (Math.abs(e1.c) < EPS && Math.abs(e2.c) < EPS)
      return { kind: 'all', reason: 'both equations trivial; every point is a solution' };
    return { kind: 'none', reason: 'both equations are 0 = c with c ≠ 0' };
  }
  if (e1Trivial) {
    if (Math.abs(e1.c) < EPS) return { kind: 'one-trivial', eqDropped: 1 };
    return { kind: 'none', reason: 'equation 1 is 0 = c with c ≠ 0' };
  }
  if (e2Trivial) {
    if (Math.abs(e2.c) < EPS) return { kind: 'one-trivial', eqDropped: 2 };
    return { kind: 'none', reason: 'equation 2 is 0 = c with c ≠ 0' };
  }

  const det = e1.a * e2.b - e1.b * e2.a;
  if (Math.abs(det) > EPS) {
    const x = (e1.c * e2.b - e1.b * e2.c) / det;
    const y = (e1.a * e2.c - e1.c * e2.a) / det;
    const offscreen = Math.abs(x) > 6 || Math.abs(y) > 6;
    return { kind: 'unique', x, y, offscreen };
  }
  // Parallel — coincident iff scaled cross-products vanish.
  const cross1 = e1.a * e2.c - e1.c * e2.a;
  const cross2 = e1.b * e2.c - e1.c * e2.b;
  if (Math.abs(cross1) < EPS && Math.abs(cross2) < EPS)
    return { kind: 'infinite', reason: 'equations describe the same line' };
  return { kind: 'none', reason: 'lines are parallel and distinct' };
}

function lineEndpoints(eq: LinearEq): { x1: number; y1: number; x2: number; y2: number } | null {
  const T = 30;
  if (Math.abs(eq.b) > EPS) {
    return {
      x1: -T,
      y1: (eq.c - eq.a * -T) / eq.b,
      x2: T,
      y2: (eq.c - eq.a * T) / eq.b,
    };
  }
  if (Math.abs(eq.a) > EPS) {
    return { x1: eq.c / eq.a, y1: -T, x2: eq.c / eq.a, y2: T };
  }
  return null;
}

export function LinearSystemViz() {
  const [eq1, setEq1] = useState<LinearEq>(PRESETS['Default (unique)'][0]);
  const [eq2, setEq2] = useState<LinearEq>(PRESETS['Default (unique)'][1]);

  const result = useMemo(() => classify(eq1, eq2), [eq1, eq2]);

  const reset = () => {
    setEq1(PRESETS['Default (unique)'][0]);
    setEq2(PRESETS['Default (unique)'][1]);
  };
  const applyPreset = (name: string) => {
    const p = PRESETS[name];
    if (p) {
      setEq1({ ...p[0] });
      setEq2({ ...p[1] });
    }
  };

  return (
    <div style={{ position: 'relative', maxWidth: CANVAS_W }}>
      <Canvas eq1={eq1} eq2={eq2} result={result} />
      <Overlay eq1={eq1} eq2={eq2} result={result} />

      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        <VizControlButton onClick={reset}>reset</VizControlButton>
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <EqRow label="eq 1" eq={eq1} onChange={setEq1} color="var(--viz-blue)" />
        <EqRow label="eq 2" eq={eq2} onChange={setEq2} color="var(--viz-yellow)" />
        <div style={{ marginTop: 4 }}>
          <PresetSelect presets={Object.keys(PRESETS)} onPick={applyPreset} />
        </div>
      </div>
    </div>
  );
}

function Canvas({
  eq1,
  eq2,
  result,
}: {
  eq1: LinearEq;
  eq2: LinearEq;
  result: Result;
}) {
  const e1 = lineEndpoints(eq1);
  const e2 = lineEndpoints(eq2);
  const cy = CENTER_Y;

  const drawLine = (e: { x1: number; y1: number; x2: number; y2: number } | null, color: string, dashed = false) =>
    e && (
      <line
        x1={w2sX(e.x1)}
        y1={w2sY(e.y1, cy)}
        x2={w2sX(e.x2)}
        y2={w2sY(e.y2, cy)}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
    );

  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      width="100%"
      style={{
        display: 'block',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
      }}
    >
      <GridAxes width={CANVAS_W} height={CANVAS_H} />
      {result.kind === 'all' && (
        <rect width={CANVAS_W} height={CANVAS_H} fill="var(--accent)" opacity={0.08} />
      )}
      {result.kind !== 'one-trivial' || result.eqDropped !== 1 ? drawLine(e1, 'var(--viz-blue)') : null}
      {result.kind !== 'one-trivial' || result.eqDropped !== 2
        ? drawLine(e2, 'var(--viz-yellow)', result.kind === 'infinite')
        : null}
      {result.kind === 'unique' && !result.offscreen && (
        <g>
          <circle
            cx={w2sX(result.x)}
            cy={w2sY(result.y, cy)}
            r={6}
            fill="var(--accent)"
            stroke="var(--bg-base)"
            strokeWidth={2}
          />
          <text
            x={w2sX(result.x) + 12}
            y={w2sY(result.y, cy) - 8}
            fill="var(--accent-bright)"
            fontFamily="var(--font-mono)"
            fontSize={11}
          >
            ({fmtCell(result.x)}, {fmtCell(result.y)})
          </text>
        </g>
      )}
      {result.kind === 'unique' && result.offscreen && (
        <text
          x={CANVAS_W - 14}
          y={CANVAS_H - 14}
          textAnchor="end"
          fill="var(--text-tertiary)"
          fontFamily="var(--font-mono)"
          fontSize={10}
        >
          intersection at ({fmtCell(result.x)}, {fmtCell(result.y)}) — off-screen
        </text>
      )}
      {result.kind === 'none' && (
        <text
          x={CANVAS_W / 2}
          y={32}
          textAnchor="middle"
          fill="var(--warn)"
          fontFamily="var(--font-mono)"
          fontSize={11}
          opacity={0.85}
        >
          {result.reason}
        </text>
      )}
    </svg>
  );
}

function fmtEq(eq: LinearEq) {
  return `${fmtCell(eq.a)}x + ${fmtCell(eq.b)}y = ${fmtCell(eq.c)}`;
}

function Overlay({ eq1, eq2, result }: { eq1: LinearEq; eq2: LinearEq; result: Result }) {
  let status: string;
  let color = 'var(--text-secondary)';
  switch (result.kind) {
    case 'unique':
      status = result.offscreen
        ? `unique solution off-screen: (${fmtCell(result.x)}, ${fmtCell(result.y)})`
        : `unique solution: (${fmtCell(result.x)}, ${fmtCell(result.y)})`;
      color = 'var(--success)';
      break;
    case 'none':
      status = `no solution — ${result.reason}`;
      color = 'var(--warn)';
      break;
    case 'infinite':
      status = `infinite solutions — ${result.reason}`;
      color = 'var(--accent-bright)';
      break;
    case 'all':
      status = result.reason;
      color = 'var(--accent-bright)';
      break;
    case 'one-trivial':
      status = `equation ${result.eqDropped} is trivial (0 = 0); solution set is the other line`;
      color = 'var(--text-tertiary)';
      break;
  }
  return (
    <OverlayPanel>
      <MonoLine color="var(--viz-blue)" size={11}>{fmtEq(eq1)}</MonoLine>
      <div style={{ height: 4 }} />
      <MonoLine color="var(--viz-yellow)" size={11}>{fmtEq(eq2)}</MonoLine>
      <div style={{ height: 8 }} />
      <MonoLine color={color}>{status}</MonoLine>
    </OverlayPanel>
  );
}

function EqRow({
  label,
  eq,
  onChange,
  color,
}: {
  label: string;
  eq: LinearEq;
  onChange: (next: LinearEq) => void;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color,
          width: 44,
        }}
      >
        {label}
      </span>
      <NumberCell label="a" value={eq.a} onChange={(v) => onChange({ ...eq, a: v })} step={0.5} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        x +
      </span>
      <NumberCell label="b" value={eq.b} onChange={(v) => onChange({ ...eq, b: v })} step={0.5} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        y =
      </span>
      <NumberCell label="c" value={eq.c} onChange={(v) => onChange({ ...eq, c: v })} step={0.5} />
    </div>
  );
}
