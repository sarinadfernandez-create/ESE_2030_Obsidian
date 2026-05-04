// 2.2 — Vector Space Examples (interactive).
// Cycle through standard vector space examples. For each, show a representative
// element (center) and the basis (right). Footer reports dim(V).

import { useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Example = 'r2' | 'r2x2' | 'p2' | 'p3' | 'ode-solutions' | 'sequences';

const LABELS: Record<Example, string> = {
  r2: 'ℝ²',
  r2x2: 'ℝ²ˣ² (2×2 matrices)',
  p2: '𝒫₂ (polynomials, deg ≤ 2)',
  p3: '𝒫₃ (polynomials, deg ≤ 3)',
  'ode-solutions': "solutions to f'' + f = 0",
  sequences: 'ℓ²-style sequences (truncated)',
};

const DIMS: Record<Example, string> = {
  r2: '2',
  r2x2: '4',
  p2: '3',
  p3: '4',
  'ode-solutions': '2',
  sequences: '\\aleph_0',
};

export function VectorSpaceExamplesViz() {
  const [example, setExample] = useState<Example>('r2');

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Selector */}
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <select
          className="viz-preset-select"
          value={example}
          onChange={(e) => setExample(e.target.value as Example)}
        >
          {(Object.keys(LABELS) as Example[]).map((e) => (
            <option key={e} value={e}>
              {LABELS[e]}
            </option>
          ))}
        </select>
      </div>

      {/* ── Side-by-side: representative | basis ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
          <MonoLine size={9} color="var(--text-tertiary)">REPRESENTATIVE ELEMENT</MonoLine>
          <ExampleElement example={example} />
        </div>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
          <MonoLine size={9} color="var(--text-tertiary)">BASIS</MonoLine>
          <ExampleBasis example={example} />
        </div>
      </div>

      {/* ── Footer: dimension ─────────────────────────────── */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          textAlign: 'center',
          fontSize: 16,
        }}
      >
        <InlineMath math={`\\dim(V) = ${DIMS[example]}`} />
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {(Object.keys(LABELS) as Example[]).map((e) => (
          <VizControlButton key={e} active={example === e} onClick={() => setExample(e)}>
            {LABELS[e]}
          </VizControlButton>
        ))}
      </div>
    </div>
  );
}

const W = 320;
const H = 240;

function ExampleElement({ example }: { example: Example }) {
  switch (example) {
    case 'r2':
      return <R2Element />;
    case 'r2x2':
      return <MatrixElement />;
    case 'p2':
      return <PolyElement coeffs={[2, -1, 3]} label="p(x) = 2 - x + 3x^2" />;
    case 'p3':
      return <PolyElement coeffs={[1, 2, -1, 0.5]} label="p(x) = 1 + 2x - x^2 + 0.5x^3" />;
    case 'ode-solutions':
      return <ODEElement />;
    case 'sequences':
      return <SequenceElement values={[1, -1, 2, 0, 3, -1, 1, 0]} label="(1, -1, 2, 0, 3, ...)" />;
  }
}

function ExampleBasis({ example }: { example: Example }) {
  switch (example) {
    case 'r2':
      return <R2Basis />;
    case 'r2x2':
      return <MatrixBasis />;
    case 'p2':
      return <PolyBasis degrees={[0, 1, 2]} />;
    case 'p3':
      return <PolyBasis degrees={[0, 1, 2, 3]} />;
    case 'ode-solutions':
      return <ODEBasis />;
    case 'sequences':
      return <SequenceBasis />;
  }
}

// ── Element renderings ─────────────────────────────────────────────────────

function R2Element() {
  const cx = W / 2;
  const cy = H / 2;
  const u = 30;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <GridAxes width={W} height={H} unit={u} />
      {/* Vector at (2, -1) */}
      <line x1={cx} y1={cy} x2={cx + 2 * u} y2={cy + 1 * u} stroke="var(--viz-blue, #67a9ff)" strokeWidth={2.4} />
      <polygon
        points={`${cx + 2 * u},${cy + 1 * u} ${cx + 2 * u - 8},${cy + 1 * u - 4} ${cx + 2 * u - 8},${cy + 1 * u + 4}`}
        fill="var(--viz-blue, #67a9ff)"
      />
      <text x={cx + 2 * u + 6} y={cy + 1 * u + 6} fontSize={11} fontFamily="var(--font-mono)" fontStyle="italic" fill="var(--viz-blue, #67a9ff)">
        v = (2, -1)
      </text>
    </svg>
  );
}

function R2Basis() {
  const cx = W / 2;
  const cy = H / 2;
  const u = 50;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <GridAxes width={W} height={H} unit={u} />
      <BasisArrow x1={cx} y1={cy} x2={cx + u} y2={cy} color="var(--viz-blue, #67a9ff)" label="e₁" />
      <BasisArrow x1={cx} y1={cy} x2={cx} y2={cy - u} color="var(--viz-yellow, #ffd966)" label="e₂" />
    </svg>
  );
}

function MatrixElement() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: H, fontSize: 18 }}>
      <InlineMath math="A = \begin{pmatrix} 2 & -1 \\ 0 & 3 \end{pmatrix}" />
    </div>
  );
}

function MatrixBasis() {
  const items = [
    'E_{11} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}',
    'E_{12} = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}',
    'E_{21} = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}',
    'E_{22} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}',
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 12, height: H, alignContent: 'center' }}>
      {items.map((m, i) => (
        <div key={i} style={{ textAlign: 'center', fontSize: 12 }}>
          <InlineMath math={m} />
        </div>
      ))}
    </div>
  );
}

function PolyElement({ coeffs, label }: { coeffs: number[]; label: string }) {
  // Render polynomial as a curve on [-1, 1].
  const cx = W / 2;
  const cy = H / 2;
  const u = 40;
  const samples: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const x = -1 + (i / 60) * 2;
    const y = coeffs.reduce((acc, c, k) => acc + c * Math.pow(x, k), 0);
    samples.push([x, y]);
  }
  // Auto-scale Y if it exceeds bounds
  const ys = samples.map((s) => s[1]);
  const maxY = Math.max(2, Math.max(...ys.map(Math.abs)));
  const yScale = u / maxY * 2;
  const path = samples
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${cx + x * u} ${cy - y * yScale}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <GridAxes width={W} height={H} unit={u} />
      <path d={path} fill="none" stroke="var(--viz-blue, #67a9ff)" strokeWidth={2} />
      <text x={cx} y={H - 8} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--text-secondary)">
        <tspan>{label}</tspan>
      </text>
    </svg>
  );
}

function PolyBasis({ degrees }: { degrees: number[] }) {
  const cx = W / 2;
  const cy = H / 2;
  const u = 35;
  const colors = ['var(--viz-blue, #67a9ff)', 'var(--viz-yellow, #ffd966)', 'rgba(184, 150, 255, 0.95)', 'rgba(111, 212, 154, 0.95)'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <GridAxes width={W} height={H} unit={u} />
      {degrees.map((deg, i) => {
        const samples: [number, number][] = [];
        for (let j = 0; j <= 60; j++) {
          const x = -1 + (j / 60) * 2;
          const y = Math.pow(x, deg);
          samples.push([x, y]);
        }
        const path = samples.map(([x, y], k) => `${k === 0 ? 'M' : 'L'} ${cx + x * u} ${cy - y * u * 0.6}`).join(' ');
        return <path key={deg} d={path} fill="none" stroke={colors[i % colors.length]} strokeWidth={1.6} />;
      })}
      <text x={W - 8} y={20} textAnchor="end" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-secondary)">
        {degrees.map((d) => (d === 0 ? '1' : d === 1 ? 'x' : `x^${d}`)).join(', ')}
      </text>
    </svg>
  );
}

function ODEElement() {
  // x(t) = 2 cos t + 3 sin t on [0, 4π]
  const samples: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const t = (i / 100) * 4 * Math.PI;
    const x = 2 * Math.cos(t) + 3 * Math.sin(t);
    samples.push([t, x]);
  }
  const tMax = 4 * Math.PI;
  const xMax = Math.max(...samples.map((s) => Math.abs(s[1])));
  const path = samples
    .map(([t, x], i) => {
      const sx = 20 + (t / tMax) * (W - 40);
      const sy = H / 2 - (x / xMax) * (H / 2 - 30);
      return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <line x1={20} y1={H / 2} x2={W - 20} y2={H / 2} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.8} />
      <path d={path} fill="none" stroke="var(--viz-blue, #67a9ff)" strokeWidth={2} />
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--text-secondary)">
        x(t) = 2 cos t + 3 sin t
      </text>
    </svg>
  );
}

function ODEBasis() {
  const samples = (f: (t: number) => number): [number, number][] => {
    const out: [number, number][] = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * 4 * Math.PI;
      out.push([t, f(t)]);
    }
    return out;
  };
  const tMax = 4 * Math.PI;
  const renderCurve = (pts: [number, number][], color: string, label: string, yOffset: number) => {
    const path = pts
      .map(([t, x], i) => {
        const sx = 20 + (t / tMax) * (W - 40);
        const sy = yOffset - x * 28;
        return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      })
      .join(' ');
    return (
      <g>
        <line x1={20} y1={yOffset} x2={W - 20} y2={yOffset} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.6} />
        <path d={path} fill="none" stroke={color} strokeWidth={1.6} />
        <text x={W - 22} y={yOffset - 32} textAnchor="end" fontSize={10} fontFamily="var(--font-mono)" fill={color} fontStyle="italic">
          {label}
        </text>
      </g>
    );
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {renderCurve(samples(Math.cos), 'var(--viz-blue, #67a9ff)', 'cos t', 70)}
      {renderCurve(samples(Math.sin), 'var(--viz-yellow, #ffd966)', 'sin t', 170)}
    </svg>
  );
}

function SequenceElement({ values, label }: { values: number[]; label: string }) {
  const cx = W / 2;
  const cy = H / 2 + 30;
  const xStep = (W - 60) / (values.length - 1);
  const yScale = 30;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <line x1={20} y1={cy} x2={W - 20} y2={cy} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.8} />
      {values.map((v, i) => {
        const x = 30 + i * xStep;
        return (
          <g key={i}>
            <line x1={x} y1={cy} x2={x} y2={cy - v * yScale} stroke="var(--viz-blue, #67a9ff)" strokeWidth={2} />
            <circle cx={x} cy={cy - v * yScale} r={3} fill="var(--viz-blue, #67a9ff)" />
            <text x={x} y={cy + 14} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
              {i}
            </text>
          </g>
        );
      })}
      <text x={cx} y={H - 8} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-secondary)">
        {label}
      </text>
    </svg>
  );
}

function SequenceBasis() {
  // Show e_0, e_1, e_2 as small stem plots.
  const W3 = W;
  const H3 = H;
  const cellW = W3 / 4;
  const colors = ['var(--viz-blue, #67a9ff)', 'var(--viz-yellow, #ffd966)', 'rgba(184, 150, 255, 0.95)'];
  return (
    <svg viewBox={`0 0 ${W3} ${H3}`} width="100%" style={{ display: 'block' }}>
      {[0, 1, 2].map((idx) => {
        const cx = idx * cellW + cellW / 2;
        const cy = H3 / 2;
        return (
          <g key={idx}>
            <line x1={cx - 30} y1={cy} x2={cx + 30} y2={cy} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.6} />
            {[0, 1, 2, 3].map((j) => {
              const x = cx - 24 + j * 16;
              const v = j === idx ? 1 : 0;
              return (
                <g key={j}>
                  <line x1={x} y1={cy} x2={x} y2={cy - v * 30} stroke={colors[idx]} strokeWidth={1.4} />
                  <circle cx={x} cy={cy - v * 30} r={2.4} fill={colors[idx]} />
                </g>
              );
            })}
            <text x={cx} y={cy + 30} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fontStyle="italic" fill={colors[idx]}>
              e_{idx}
            </text>
          </g>
        );
      })}
      <text x={W3 - 8} y={H3 - 12} textAnchor="end" fontSize={11} fontFamily="var(--font-mono)" fill="var(--text-tertiary)" fontStyle="italic">
        ⋯ infinite
      </text>
    </svg>
  );
}

function BasisArrow({ x1, y1, x2, y2, color, label }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const ah = 7;
  const ax = x2 - ux * ah - uy * ah * 0.5;
  const ay = y2 - uy * ah + ux * ah * 0.5;
  const bx = x2 - ux * ah + uy * ah * 0.5;
  const by = y2 - uy * ah - ux * ah * 0.5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      <text x={x2 + 6} y={y2 - 6} fontSize={12} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>{label}</text>
    </g>
  );
}
