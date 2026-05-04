// 3.3 — Linear Transformation Gallery (stationary).
// Six cells in a 2x3 grid: matrix mult, differentiation, integration, evaluation,
// multiplication-by-x, cumulative-sum. Each shows a formula, a tiny visualization,
// and an annotation. No interaction.

import { InlineMath } from 'react-katex';

const CELL_W = 220;
const VIZ_H = 110;

export function LinearTransformGallery() {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: 20,
        maxWidth: 760,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${CELL_W}px, 1fr))`,
          gap: 12,
        }}
      >
        <Cell
          formula="T(x) = A x"
          caption="matrix multiplication"
          annotation="Linear by construction."
          viz={<MatrixCellViz />}
        />
        <Cell
          formula="T(p) = p'"
          caption="differentiation on \mathcal{P}_3"
          annotation="(p+q)' = p' + q' and (cp)' = cp'."
          viz={<DerivativeCellViz />}
        />
        <Cell
          formula="T(f) = \int_0^1 f"
          caption="definite integral"
          annotation="Integral is linear over its integrand."
          viz={<IntegralCellViz />}
        />
        <Cell
          formula="T(p) = p(0)"
          caption="evaluation at a point"
          annotation="Functional: outputs a single number."
          viz={<EvaluationCellViz />}
        />
        <Cell
          formula="T(p) = x \cdot p"
          caption="multiplication by x: \mathcal{P}_2 \to \mathcal{P}_3"
          annotation="Raises degree by one."
          viz={<MulByXCellViz />}
        />
        <Cell
          formula="T(\mathbf{x}) = (x_1,\, x_1{+}x_2,\, x_1{+}x_2{+}x_3)"
          caption="cumulative sum"
          annotation="Lower-triangular matrix of ones."
          viz={<CumulativeCellViz />}
        />
      </div>
    </div>
  );
}

function Cell({
  formula,
  caption,
  annotation,
  viz,
}: {
  formula: string;
  caption: string;
  annotation: string;
  viz: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 6,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ fontSize: 13, lineHeight: 1.3, minHeight: 28 }}>
        <InlineMath math={formula} />
      </div>
      <div style={{ height: VIZ_H }}>{viz}</div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <InlineMath math={caption} />
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
        }}
      >
        {annotation}
      </div>
    </div>
  );
}

// ── Cell visualizations ────────────────────────────────────────────────────

// 1. Matrix multiplication: gray unit square → cyan rotated/sheared square.
function MatrixCellViz() {
  // Pick A = [[1.2, 0.4], [-0.2, 0.9]] for visual interest.
  const A = [
    [1.2, 0.4],
    [-0.2, 0.9],
  ];
  const corners: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const transformed = corners.map(([x, y]) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y]);
  const cx = 100;
  const cy = 60;
  const u = 28;
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%">
      {/* axes */}
      <line x1={cx - 80} y1={cy} x2={cx + 80} y2={cy} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.8} />
      <line x1={cx} y1={cy - 50} x2={cx} y2={cy + 50} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.8} />
      {/* original unit square */}
      <polygon
        points={corners.map(([x, y]) => `${cx + x * u},${cy - y * u}`).join(' ')}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      {/* transformed square */}
      <polygon
        points={transformed.map(([x, y]) => `${cx + x * u},${cy - y * u}`).join(' ')}
        fill="rgba(103,169,255,0.18)"
        stroke="rgba(103,169,255,0.85)"
        strokeWidth={1.4}
      />
    </svg>
  );
}

// 2. Differentiation: x^3 curve above, 3x^2 curve below, with arrow.
function DerivativeCellViz() {
  // Polynomial sampled on [-1, 1]
  const samplesP = sampleCurve((x) => x * x * x, -1, 1, 30);
  const samplesDP = sampleCurve((x) => 3 * x * x, -1, 1, 30);
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%">
      <MiniCurve samples={samplesP} cy={28} h={22} stroke="rgba(180,180,180,0.7)" label="p(x) = x^3" />
      <ArrowDown x={100} y1={56} y2={68} />
      <MiniCurve samples={samplesDP} cy={88} h={18} stroke="rgba(103,169,255,0.85)" label="p'(x) = 3x^2" />
    </svg>
  );
}

// 3. Definite integral: shaded curve → single point on number line.
function IntegralCellViz() {
  const samples = sampleCurve((x) => Math.exp(-(x - 0.5) * (x - 0.5) * 4), 0, 1, 30);
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%">
      <ShadedCurve samples={samples} y0={50} h={36} cx={50} cw={80} fill="rgba(103,169,255,0.3)" />
      {/* arrow */}
      <line x1={140} y1={50} x2={170} y2={50} stroke="rgba(103,169,255,0.6)" strokeWidth={1.2} markerEnd="url(#gallery-arrow)" />
      {/* number line + dot */}
      <line x1={170} y1={50} x2={195} y2={50} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <circle cx={183} cy={50} r={4} fill="rgba(103,169,255,0.95)" />
      <text x={183} y={68} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
        ∫f
      </text>
      <defs>
        <marker id="gallery-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(103,169,255,0.7)" />
        </marker>
      </defs>
    </svg>
  );
}

// 4. Evaluation at x=0: polynomial curve with highlighted dot at x=0.
function EvaluationCellViz() {
  const samples = sampleCurve((x) => 1 - x * x + 0.4 * x, -1, 1, 30);
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%">
      <MiniCurve samples={samples} cy={50} h={32} stroke="rgba(180,180,180,0.7)" label="" cx={50} cw={80} />
      {/* dot at x = 0 → corresponds to the center of [50, 130] = 90, value at x=0 is 1 (top of range) */}
      <circle cx={90} cy={28} r={5} fill="rgba(103,169,255,0.95)" stroke="rgba(103,169,255,1)" strokeWidth={1.5} />
      {/* arrow */}
      <line x1={140} y1={50} x2={170} y2={50} stroke="rgba(103,169,255,0.6)" strokeWidth={1.2} markerEnd="url(#gallery-arrow-2)" />
      {/* output dot */}
      <line x1={170} y1={50} x2={195} y2={50} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <circle cx={183} cy={50} r={4} fill="rgba(103,169,255,0.95)" />
      <text x={183} y={68} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
        p(0)
      </text>
      <defs>
        <marker id="gallery-arrow-2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(103,169,255,0.7)" />
        </marker>
      </defs>
    </svg>
  );
}

// 5. Multiplication by x: 1+x curve → x+x^2 curve.
function MulByXCellViz() {
  const samplesP = sampleCurve((x) => 1 + x, -1, 1, 30);
  const samplesXP = sampleCurve((x) => x + x * x, -1, 1, 30);
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%">
      <MiniCurve samples={samplesP} cy={28} h={22} stroke="rgba(180,180,180,0.7)" label="" />
      <ArrowDown x={100} y1={56} y2={68} />
      <MiniCurve samples={samplesXP} cy={88} h={18} stroke="rgba(103,169,255,0.85)" label="" />
    </svg>
  );
}

// 6. Cumulative sum: input bars → output bars.
function CumulativeCellViz() {
  const input = [1, 2, -1];
  const output = [1, 3, 2];
  const cells = (vals: number[], offsetX: number) => {
    const maxAbs = 3;
    return vals.map((v, i) => {
      const h = (Math.abs(v) / maxAbs) * 28;
      const y = v >= 0 ? 60 - h : 60;
      return (
        <rect
          key={`${offsetX}-${i}`}
          x={offsetX + i * 18}
          y={y}
          width={14}
          height={h}
          fill={v >= 0 ? 'rgba(103,169,255,0.7)' : 'rgba(255,123,107,0.7)'}
        />
      );
    });
  };
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%">
      <line x1={10} y1={60} x2={88} y2={60} stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />
      {cells(input, 12)}
      <text x={45} y={102} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
        input
      </text>
      <line x1={92} y1={60} x2={120} y2={60} stroke="rgba(103,169,255,0.6)" strokeWidth={1.2} markerEnd="url(#gallery-arrow-3)" />
      <line x1={124} y1={60} x2={194} y2={60} stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />
      {cells(output, 130)}
      <text x={163} y={102} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
        cumsum
      </text>
      <defs>
        <marker id="gallery-arrow-3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(103,169,255,0.7)" />
        </marker>
      </defs>
    </svg>
  );
}

// ── Curve helpers ──────────────────────────────────────────────────────────

function sampleCurve(f: (x: number) => number, a: number, b: number, n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const x = a + ((b - a) * i) / (n - 1);
    out.push([x, f(x)]);
  }
  return out;
}

function MiniCurve({
  samples,
  cy,
  h,
  stroke,
  label,
  cx = 100,
  cw = 180,
}: {
  samples: [number, number][];
  cy: number;
  h: number;
  stroke: string;
  label: string;
  cx?: number;
  cw?: number;
}) {
  const xs = samples.map((s) => s[0]);
  const ys = samples.map((s) => s[1]);
  const xmin = Math.min(...xs);
  const xmax = Math.max(...xs);
  const ymin = Math.min(...ys);
  const ymax = Math.max(...ys);
  const yrange = Math.max(ymax - ymin, 1e-9);
  const path = samples
    .map(([x, y], i) => {
      const sx = cx - cw / 2 + ((x - xmin) / (xmax - xmin)) * cw;
      const sy = cy - ((y - ymin) / yrange - 0.5) * 2 * h;
      return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(2)} ${sy.toFixed(2)}`;
    })
    .join(' ');
  return (
    <g>
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.4} />
      {label && (
        <text x={cx + cw / 2 + 4} y={cy + 3} fontSize={8} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
          {label}
        </text>
      )}
    </g>
  );
}

function ShadedCurve({
  samples,
  y0,
  h,
  cx,
  cw,
  fill,
}: {
  samples: [number, number][];
  y0: number;
  h: number;
  cx: number;
  cw: number;
  fill: string;
}) {
  const xs = samples.map((s) => s[0]);
  const xmin = Math.min(...xs);
  const xmax = Math.max(...xs);
  const ymax = Math.max(...samples.map((s) => s[1]));
  const ys = samples.map(([x, y]) => {
    const sx = cx - cw / 2 + ((x - xmin) / (xmax - xmin)) * cw;
    const sy = y0 - (y / ymax) * h;
    return [sx, sy] as [number, number];
  });
  const top = ys.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ');
  const baseRight = `L ${ys[ys.length - 1][0].toFixed(2)} ${y0}`;
  const baseLeft = `L ${ys[0][0].toFixed(2)} ${y0} Z`;
  return (
    <g>
      <path d={`${top} ${baseRight} ${baseLeft}`} fill={fill} stroke="rgba(103,169,255,0.7)" strokeWidth={1.2} />
    </g>
  );
}

function ArrowDown({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - 4} stroke="rgba(103,169,255,0.6)" strokeWidth={1.2} />
      <polygon points={`${x},${y2} ${x - 3},${y2 - 5} ${x + 3},${y2 - 5}`} fill="rgba(103,169,255,0.7)" />
    </g>
  );
}
