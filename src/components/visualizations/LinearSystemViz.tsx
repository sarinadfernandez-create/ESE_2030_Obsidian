import { useState, useMemo } from 'react';
import { BlockMath } from 'react-katex';

const CANVAS_W = 640;
const CANVAS_H = 440;
const CENTER_X = CANVAS_W / 2;
const CENTER_Y = CANVAS_H / 2;
const UNIT = 40;

const w2sX = (x: number) => CENTER_X + x * UNIT;
const w2sY = (y: number) => CENTER_Y - y * UNIT;

interface LinearEq {
  a: number;
  b: number;
  c: number; // ax + by = c
}

const PRESETS: Record<string, [LinearEq, LinearEq]> = {
  'Unique solution (lines cross)': [
    { a: 2, b: 1, c: 5 },
    { a: 1, b: -1, c: 1 },
  ],
  'No solution (parallel lines)': [
    { a: 1, b: 1, c: 3 },
    { a: 2, b: 2, c: 7 },
  ],
  'Infinite solutions (same line)': [
    { a: 1, b: 1, c: 3 },
    { a: 2, b: 2, c: 6 },
  ],
};

type Classification =
  | { kind: 'unique'; x: number; y: number }
  | { kind: 'none' }
  | { kind: 'infinite' };

function classify(e1: LinearEq, e2: LinearEq): Classification {
  const det = e1.a * e2.b - e1.b * e2.a;
  const EPS = 1e-9;
  if (Math.abs(det) > EPS) {
    const x = (e1.c * e2.b - e1.b * e2.c) / det;
    const y = (e1.a * e2.c - e1.c * e2.a) / det;
    return { kind: 'unique', x, y };
  }
  // det == 0 → parallel. Check whether they coincide.
  // Coincident iff e1 and e2 are scalar multiples (including the c term).
  // Use cross-products.
  const cross1 = e1.a * e2.c - e1.c * e2.a;
  const cross2 = e1.b * e2.c - e1.c * e2.b;
  if (Math.abs(cross1) < EPS && Math.abs(cross2) < EPS) {
    return { kind: 'infinite' };
  }
  return { kind: 'none' };
}

// Two endpoints (in world coords) for the line ax + by = c, intersected with a wide bounding box.
function lineEndpoints(eq: LinearEq): { x1: number; y1: number; x2: number; y2: number } | null {
  const T = 20;
  const { a, b, c } = eq;
  if (Math.abs(b) > Math.abs(a)) {
    // y = (c - a x) / b — sweep x
    return { x1: -T, y1: (c + a * T) / b, x2: T, y2: (c - a * T) / b };
  }
  if (Math.abs(a) > 1e-12) {
    // x = (c - b y) / a — sweep y
    return { x1: (c + b * T) / a, y1: -T, x2: (c - b * T) / a, y2: T };
  }
  return null;
}

export function LinearSystemViz() {
  const [eq1, setEq1] = useState<LinearEq>(PRESETS['Unique solution (lines cross)'][0]);
  const [eq2, setEq2] = useState<LinearEq>(PRESETS['Unique solution (lines cross)'][1]);

  const result = useMemo(() => classify(eq1, eq2), [eq1, eq2]);

  const applyPreset = (name: string) => {
    const p = PRESETS[name];
    if (p) {
      setEq1(p[0]);
      setEq2(p[1]);
    }
  };

  return (
    <div style={{ position: 'relative', maxWidth: CANVAS_W }}>
      <Canvas eq1={eq1} eq2={eq2} result={result} />
      <Overlay eq1={eq1} eq2={eq2} result={result} />
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <EqRow label="eq 1" eq={eq1} onChange={setEq1} color="var(--viz-blue)" />
        <EqRow label="eq 2" eq={eq2} onChange={setEq2} color="var(--viz-yellow)" />
        <select
          className="viz-preset-select"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) applyPreset(e.target.value);
            e.target.value = '';
          }}
          style={{ alignSelf: 'flex-start' }}
        >
          <option value="" disabled>Preset…</option>
          {Object.keys(PRESETS).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Canvas({ eq1, eq2, result }: { eq1: LinearEq; eq2: LinearEq; result: Classification }) {
  const e1 = lineEndpoints(eq1);
  const e2 = lineEndpoints(eq2);
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
      <Grid />
      <Axes />
      {e1 && (
        <line
          x1={w2sX(e1.x1)}
          y1={w2sY(e1.y1)}
          x2={w2sX(e1.x2)}
          y2={w2sY(e1.y2)}
          stroke="var(--viz-blue)"
          strokeWidth={1.6}
        />
      )}
      {e2 && (
        <line
          x1={w2sX(e2.x1)}
          y1={w2sY(e2.y1)}
          x2={w2sX(e2.x2)}
          y2={w2sY(e2.y2)}
          stroke="var(--viz-yellow)"
          strokeWidth={1.6}
          strokeDasharray={result.kind === 'infinite' ? '4 4' : undefined}
        />
      )}
      {result.kind === 'unique' &&
        Math.abs(result.x) < 8 &&
        Math.abs(result.y) < 5 && (
          <g>
            <circle
              cx={w2sX(result.x)}
              cy={w2sY(result.y)}
              r={6}
              fill="var(--accent)"
              stroke="var(--bg-base)"
              strokeWidth={2}
            />
            <text
              x={w2sX(result.x) + 12}
              y={w2sY(result.y) - 8}
              fill="var(--accent-bright)"
              fontFamily="var(--font-mono)"
              fontSize={11}
            >
              ({result.x.toFixed(2)}, {result.y.toFixed(2)})
            </text>
          </g>
        )}
    </svg>
  );
}

function Grid() {
  const lines: React.ReactNode[] = [];
  for (let i = -8; i <= 8; i++) {
    lines.push(
      <line key={`vx-${i}`} x1={w2sX(i)} y1={0} x2={w2sX(i)} y2={CANVAS_H} stroke="var(--viz-grid)" strokeWidth={0.5} />
    );
    lines.push(
      <line key={`hy-${i}`} x1={0} y1={w2sY(i)} x2={CANVAS_W} y2={w2sY(i)} stroke="var(--viz-grid)" strokeWidth={0.5} />
    );
  }
  return <g>{lines}</g>;
}

function Axes() {
  return (
    <g>
      <line x1={0} y1={CENTER_Y} x2={CANVAS_W} y2={CENTER_Y} stroke="var(--viz-axis)" strokeWidth={1} />
      <line x1={CENTER_X} y1={0} x2={CENTER_X} y2={CANVAS_H} stroke="var(--viz-axis)" strokeWidth={1} />
    </g>
  );
}

function Overlay({ eq1, eq2, result }: { eq1: LinearEq; eq2: LinearEq; result: Classification }) {
  const fmt = (eq: LinearEq) =>
    `${eq.a.toFixed(1)}x + ${eq.b.toFixed(1)}y = ${eq.c.toFixed(1)}`;

  let status: string;
  let statusColor: string;
  switch (result.kind) {
    case 'unique':
      status = `unique solution: x = ${result.x.toFixed(2)}, y = ${result.y.toFixed(2)}`;
      statusColor = 'var(--success)';
      break;
    case 'none':
      status = 'no solution — lines are parallel and distinct';
      statusColor = 'var(--warn)';
      break;
    case 'infinite':
      status = 'infinite solutions — equations describe the same line';
      statusColor = 'var(--accent-bright)';
      break;
  }

  return (
    <div
      className="glass"
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        padding: '10px 14px',
        borderRadius: 6,
        maxWidth: 320,
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--viz-blue)', marginBottom: 2 }}>
        {fmt(eq1)}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--viz-yellow)', marginBottom: 8 }}>
        {fmt(eq2)}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: statusColor }}>
        {status}
      </div>
    </div>
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
      <Cell label="a" value={eq.a} onChange={(v) => onChange({ ...eq, a: v })} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>x +</span>
      <Cell label="b" value={eq.b} onChange={(v) => onChange({ ...eq, b: v })} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>y =</span>
      <Cell label="c" value={eq.c} onChange={(v) => onChange({ ...eq, c: v })} />
    </div>
  );
}

function Cell({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      step={0.1}
      value={value}
      aria-label={label}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) onChange(n);
      }}
      style={{
        width: 64,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 3,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        padding: '4px 6px',
      }}
    />
  );
}

// Stubs to satisfy KaTeX import (ensures lazy load of latex font when this viz appears).
export const _katexWarmup = BlockMath;
