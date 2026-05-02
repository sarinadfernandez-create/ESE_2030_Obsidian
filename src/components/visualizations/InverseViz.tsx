import { useMemo, useState, useRef } from 'react';
import { BlockMath } from 'react-katex';
import {
  conditionNumber2x2,
  fmtCell,
  m2apply,
  m2det,
  operatorNorm2x2,
  type Mat2,
} from '../../lib/linearAlgebra';
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

const CANVAS_H = 460;
const CENTER_X = CANVAS_W / 2;
const CENTER_Y = CANVAS_H / 2;
const EPS = 1e-9;

const PRESETS: Record<string, Mat2> = {
  Identity: [[1, 0], [0, 1]],
  'Pure scale (det = 4)': [[2, 0], [0, 2]],
  'Rotation (det = 1)': [
    [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6)],
    [Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)],
  ],
  'Near-singular (det = 0.01)': [[1, 1], [1, 0.99]],
  'Singular (det = 0)': [[1, 2], [2, 4]],
  'Negative determinant': [[1, 0], [0, -1]],
};

export function InverseViz() {
  const [matrix, setMatrix] = useState<Mat2>([[1, 1], [0, 1]]);
  const lastValidRef = useRef<Mat2>(matrix);

  const updateEntry = (i: 0 | 1, j: 0 | 1) => (v: number) => {
    const next: Mat2 = [
      [matrix[0][0], matrix[0][1]],
      [matrix[1][0], matrix[1][1]],
    ];
    next[i][j] = v;
    if (
      Number.isFinite(next[0][0]) &&
      Number.isFinite(next[0][1]) &&
      Number.isFinite(next[1][0]) &&
      Number.isFinite(next[1][1])
    ) {
      lastValidRef.current = next;
      setMatrix(next);
    } else {
      setMatrix(lastValidRef.current);
    }
  };

  const det = useMemo(() => m2det(matrix), [matrix]);
  const isSingular = Math.abs(det) < EPS;
  const sigMax = useMemo(() => operatorNorm2x2(matrix), [matrix]);
  const kappa = useMemo(() => conditionNumber2x2(matrix), [matrix]);
  const invNorm = isSingular ? Infinity : kappa / sigMax || Infinity;

  const inverse: Mat2 | null = isSingular
    ? null
    : [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det],
      ];

  const reset = () => setMatrix([[1, 1], [0, 1]]);

  return (
    <div style={{ position: 'relative', maxWidth: CANVAS_W }}>
      <Canvas matrix={matrix} inverse={inverse} det={det} isSingular={isSingular} />
      <Overlay matrix={matrix} det={det} sigMax={sigMax} invNorm={invNorm} kappa={kappa} isSingular={isSingular} />

      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        <VizControlButton onClick={reset}>reset</VizControlButton>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <NumberCell label="a₁₁" value={matrix[0][0]} onChange={updateEntry(0, 0)} />
        <NumberCell label="a₁₂" value={matrix[0][1]} onChange={updateEntry(0, 1)} />
        <NumberCell label="a₂₁" value={matrix[1][0]} onChange={updateEntry(1, 0)} />
        <NumberCell label="a₂₂" value={matrix[1][1]} onChange={updateEntry(1, 1)} />
        <PresetSelect presets={Object.keys(PRESETS)} onPick={(name) => setMatrix(PRESETS[name].map((r) => [...r]) as Mat2)} />
      </div>
    </div>
  );
}

function Canvas({
  matrix,
  inverse,
  det,
  isSingular,
}: {
  matrix: Mat2;
  inverse: Mat2 | null;
  det: number;
  isSingular: boolean;
}) {
  // Unit square corners: (0,0), (1,0), (1,1), (0,1)
  const square: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const imagePts = square.map((p) => m2apply(matrix, p));
  const inversePts = inverse ? square.map((p) => m2apply(inverse, p)) : null;

  const path = (pts: [number, number][]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${w2sX(p[0])} ${w2sY(p[1], CENTER_Y)}`).join(' ') + ' Z';

  const Ae1 = m2apply(matrix, [1, 0]);
  const Ae2 = m2apply(matrix, [0, 1]);

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

      {/* Inverse parallelogram (red, faint, behind) */}
      {inversePts && (
        <path
          d={path(inversePts as [number, number][])}
          fill="var(--viz-red)"
          fillOpacity={0.1}
          stroke="var(--viz-red)"
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="4 3"
        />
      )}

      {/* Original unit square */}
      <path
        d={path(square)}
        fill="var(--viz-blue)"
        fillOpacity={0.1}
        stroke="var(--viz-blue)"
        strokeOpacity={0.6}
        strokeWidth={1.4}
      />

      {/* Image of unit square */}
      <path
        d={path(imagePts as [number, number][])}
        fill="var(--accent)"
        fillOpacity={0.18}
        stroke="var(--accent)"
        strokeOpacity={0.6}
        strokeWidth={1.6}
      />

      {/* Basis vector arrows */}
      <Arrow
        x1={CENTER_X}
        y1={CENTER_Y}
        x2={w2sX(Ae1[0])}
        y2={w2sY(Ae1[1], CENTER_Y)}
        color="var(--viz-blue)"
        label="A e₁"
      />
      <Arrow
        x1={CENTER_X}
        y1={CENTER_Y}
        x2={w2sX(Ae2[0])}
        y2={w2sY(Ae2[1], CENTER_Y)}
        color="var(--viz-yellow)"
        label="A e₂"
      />

      {isSingular && (
        <text
          x={CANVAS_W / 2}
          y={26}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fill="var(--warn)"
        >
          A is singular — no inverse exists (det = {fmtCell(det)})
        </text>
      )}
      {!isSingular && det < 0 && (
        <text
          x={CANVAS_W - 14}
          y={CANVAS_H - 14}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--text-tertiary)"
        >
          orientation reversed
        </text>
      )}
    </svg>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  label: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const aSize = 7;
  const ax = x2 - ux * aSize - uy * aSize * 0.5;
  const ay = y2 - uy * aSize + ux * aSize * 0.5;
  const bx = x2 - ux * aSize + uy * aSize * 0.5;
  const by = y2 - uy * aSize - ux * aSize * 0.5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      <text x={x2 + uy * 10} y={y2 - ux * 10} fill={color} fontFamily="var(--font-mono)" fontStyle="italic" fontSize={11}>
        {label}
      </text>
    </g>
  );
}

function Overlay({
  matrix,
  det,
  sigMax,
  invNorm,
  kappa,
  isSingular,
}: {
  matrix: Mat2;
  det: number;
  sigMax: number;
  invNorm: number;
  kappa: number;
  isSingular: boolean;
}) {
  const matrixLatex = `A = \\begin{pmatrix} ${fmtCell(matrix[0][0])} & ${fmtCell(matrix[0][1])} \\\\ ${fmtCell(matrix[1][0])} & ${fmtCell(matrix[1][1])} \\end{pmatrix}`;
  return (
    <OverlayPanel>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        <BlockMath math={matrixLatex} />
      </div>
      <MonoLine color={isSingular ? 'var(--warn)' : 'var(--text-secondary)'}>
        det A = {fmtCell(det)}
      </MonoLine>
      <MonoLine>‖A‖ ≈ {fmtCell(sigMax)}</MonoLine>
      <MonoLine>‖A⁻¹‖ ≈ {Number.isFinite(invNorm) ? fmtCell(invNorm) : '∞'}</MonoLine>
      <MonoLine color="var(--accent-bright)">
        κ(A) ≈ {Number.isFinite(kappa) ? fmtCell(kappa) : '∞'}
      </MonoLine>
    </OverlayPanel>
  );
}
