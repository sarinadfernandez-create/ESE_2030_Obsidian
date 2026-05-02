import { useMemo, useRef, useState } from 'react';
import { BlockMath } from 'react-katex';
import {
  conditionNumber2x2,
  ellipseFromMatrix2x2,
  fmtCell,
  operatorNorm2x2,
  smallestSV2x2,
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

const CANVAS_H = 500;
const CENTER_X = CANVAS_W / 2;
const CENTER_Y = CANVAS_H / 2 + 20;
const EPS = 1e-9;

const PRESETS: Record<string, Mat2> = {
  'Identity (κ = 1, optimal)': [[1, 0], [0, 1]],
  'Mild stretch (κ ≈ 4)': [[2, 0], [0, 0.5]],
  'Hilbert-like ill-conditioning': [[1, 0.5], [0.5, 1 / 3]],
  'Near-singular (κ large)': [[1, 1], [1, 1.001]],
  Singular: [[1, 2], [2, 4]],
  'Zero matrix': [[0, 0], [0, 0]],
};

function interpretation(kappa: number, isSingular: boolean): string {
  if (isSingular || !Number.isFinite(kappa)) return 'singular';
  if (kappa < 10) return 'well-conditioned';
  if (kappa < 1e4) return 'moderately conditioned';
  if (kappa < 1e10) return 'ill-conditioned';
  return 'extremely ill-conditioned (computationally singular)';
}

export function ConditioningViz() {
  const [matrix, setMatrix] = useState<Mat2>([[2, 0], [0, 0.5]]);
  const lastValid = useRef<Mat2>(matrix);

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
      lastValid.current = next;
      setMatrix(next);
    } else setMatrix(lastValid.current);
  };

  const sigMax = useMemo(() => operatorNorm2x2(matrix), [matrix]);
  const sigMin = useMemo(() => smallestSV2x2(matrix), [matrix]);
  const kappa = useMemo(() => conditionNumber2x2(matrix), [matrix]);
  const ellipse = useMemo(() => ellipseFromMatrix2x2(matrix), [matrix]);

  const isSingular = sigMin < EPS;
  const isZero = sigMax < EPS;

  const reset = () => setMatrix([[2, 0], [0, 0.5]]);

  return (
    <div style={{ position: 'relative', maxWidth: CANVAS_W }}>
      <Canvas
        ellipse={ellipse}
        sigMax={sigMax}
        sigMin={sigMin}
        isSingular={isSingular}
        isZero={isZero}
      />
      <Overlay matrix={matrix} sigMax={sigMax} sigMin={sigMin} kappa={kappa} isSingular={isSingular} />

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
  ellipse,
  sigMax,
  sigMin,
  isSingular,
  isZero,
}: {
  ellipse: { semiMajor: number; semiMinor: number; angle: number };
  sigMax: number;
  sigMin: number;
  isSingular: boolean;
  isZero: boolean;
}) {
  const unitR = 40;
  // Map ellipse semi-axes from world units to pixels via UNIT.
  const aPx = sigMax * unitR;
  const bPx = sigMin * unitR;
  const angleDeg = (ellipse.angle * 180) / Math.PI;

  // Major/minor axis arrow tips in world coords.
  const cosA = Math.cos(ellipse.angle);
  const sinA = Math.sin(ellipse.angle);
  const majorTip: [number, number] = [sigMax * cosA, sigMax * sinA];
  const minorTip: [number, number] = [-sigMin * sinA, sigMin * cosA];

  // Ratio bar (top of canvas)
  const ratioMax = Math.max(sigMax, 0.0001);
  const majorFrac = sigMax / ratioMax;
  const minorFrac = sigMin / ratioMax;

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

      {/* Ratio bar */}
      <g transform={`translate(${CANVAS_W / 2 - 200}, 30)`}>
        <text x={0} y={-6} fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">
          σ_max : σ_min ratio
        </text>
        <rect x={0} y={0} width={400} height={6} fill="var(--bg-base)" stroke="var(--border-subtle)" />
        <rect x={0} y={0} width={400 * majorFrac} height={6} fill="var(--accent)" />
        <rect
          x={0}
          y={0}
          width={Math.max(2, 400 * minorFrac)}
          height={6}
          fill="var(--accent-bright)"
        />
      </g>

      {/* Reference unit circle */}
      <circle
        cx={CENTER_X}
        cy={CENTER_Y}
        r={unitR}
        fill="none"
        stroke="var(--viz-grid)"
        strokeWidth={1}
      />

      {/* Image ellipse */}
      {!isZero && (
        <ellipse
          cx={CENTER_X}
          cy={CENTER_Y}
          rx={Math.max(2, aPx)}
          ry={Math.max(isSingular ? 0 : 1, bPx)}
          fill="var(--accent)"
          fillOpacity={0.1}
          stroke="var(--accent)"
          strokeOpacity={0.7}
          strokeWidth={1.6}
          transform={`rotate(${-angleDeg} ${CENTER_X} ${CENTER_Y})`}
        />
      )}
      {isZero && (
        <circle cx={CENTER_X} cy={CENTER_Y} r={4} fill="var(--accent)" />
      )}

      {/* Major / minor axis arrows */}
      {!isZero && (
        <>
          <AxisArrow
            tip={majorTip}
            color="var(--accent)"
            label={`σ_max = ${fmtCell(sigMax)}`}
            cy={CENTER_Y}
          />
          {!isSingular && (
            <AxisArrow
              tip={minorTip}
              color="var(--accent-bright)"
              label={`σ_min = ${fmtCell(sigMin)}`}
              cy={CENTER_Y}
              minLengthPx={8}
            />
          )}
        </>
      )}

      {isSingular && !isZero && (
        <text
          x={CANVAS_W / 2}
          y={CANVAS_H - 18}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--warn)"
        >
          singular — image of unit circle collapses to a line segment
        </text>
      )}
      {isZero && (
        <text
          x={CANVAS_W / 2}
          y={CANVAS_H - 18}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--warn)"
        >
          rank 0 — collapses everything to origin
        </text>
      )}
    </svg>
  );
}

function AxisArrow({
  tip,
  color,
  label,
  cy,
  minLengthPx,
}: {
  tip: [number, number];
  color: string;
  label: string;
  cy: number;
  minLengthPx?: number;
}) {
  let x2 = w2sX(tip[0]);
  let y2 = w2sY(tip[1], cy);
  // Enforce minimum on-canvas arrow length so very small singular values stay visible.
  if (minLengthPx) {
    const dx = x2 - CENTER_X;
    const dy = y2 - cy;
    const len = Math.hypot(dx, dy);
    if (len < minLengthPx && len > 0) {
      const k = minLengthPx / len;
      x2 = CENTER_X + dx * k;
      y2 = cy + dy * k;
    }
  }
  const dx = x2 - CENTER_X;
  const dy = y2 - cy;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const aSize = 6;
  const ax = x2 - ux * aSize - uy * aSize * 0.5;
  const ay = y2 - uy * aSize + ux * aSize * 0.5;
  const bx = x2 - ux * aSize + uy * aSize * 0.5;
  const by = y2 - uy * aSize - ux * aSize * 0.5;
  return (
    <g>
      <line x1={CENTER_X} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      <text x={x2 + uy * 10} y={y2 - ux * 10} fill={color} fontFamily="var(--font-mono)" fontSize={10}>
        {label}
      </text>
    </g>
  );
}

function Overlay({
  matrix,
  sigMax,
  sigMin,
  kappa,
  isSingular,
}: {
  matrix: Mat2;
  sigMax: number;
  sigMin: number;
  kappa: number;
  isSingular: boolean;
}) {
  const matrixLatex = `A = \\begin{pmatrix} ${fmtCell(matrix[0][0])} & ${fmtCell(matrix[0][1])} \\\\ ${fmtCell(matrix[1][0])} & ${fmtCell(matrix[1][1])} \\end{pmatrix}`;
  const interp = interpretation(kappa, isSingular);
  let interpColor = 'var(--success)';
  if (interp === 'moderately conditioned') interpColor = 'var(--accent-bright)';
  else if (interp === 'ill-conditioned') interpColor = 'var(--warn)';
  else if (
    interp === 'extremely ill-conditioned (computationally singular)' ||
    interp === 'singular'
  )
    interpColor = '#ff7b6b';

  return (
    <OverlayPanel>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        <BlockMath math={matrixLatex} />
      </div>
      <MonoLine>σ_max = {fmtCell(sigMax)}</MonoLine>
      <MonoLine>σ_min = {fmtCell(sigMin)}</MonoLine>
      <MonoLine color="var(--accent-bright)">
        κ(A) ≈ {Number.isFinite(kappa) ? fmtCell(kappa) : '∞'}
      </MonoLine>
      <div style={{ marginTop: 6 }}>
        <MonoLine color={interpColor}>{interp}</MonoLine>
      </div>
    </OverlayPanel>
  );
}
