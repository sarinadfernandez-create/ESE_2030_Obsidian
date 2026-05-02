import { useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';
import { fmtCell, m2apply, m2det, type Mat2, type Vec2 } from '../../lib/linearAlgebra';
import {
  CANVAS_W,
  GridAxes,
  MonoLine,
  OverlayPanel,
  VizControlButton,
  w2sX,
  w2sY,
} from './_shared';

const CANVAS_H = 500;

interface Variant {
  matrix: Mat2;
  label: string;
}

interface Family {
  name: string;
  description: string;
  variants: Variant[];
}

const FAMILIES: Family[] = [
  {
    name: 'Identity',
    description: 'Does nothing. Every vector maps to itself.',
    variants: [{ matrix: [[1, 0], [0, 1]], label: 'I₂' }],
  },
  {
    name: 'Permutation',
    description: 'Reorders coordinate axes.',
    variants: [
      { matrix: [[0, 1], [1, 0]], label: 'swap x and y' },
      { matrix: [[1, 0], [0, 1]], label: 'identity (no swap)' },
    ],
  },
  {
    name: 'Diagonal',
    description: 'Independently scales each coordinate.',
    variants: [
      { matrix: [[2, 0], [0, 0.5]], label: 'stretch x, compress y' },
      { matrix: [[2, 0], [0, 2]], label: 'uniform scale by 2' },
      { matrix: [[1, 0], [0, -1]], label: 'reflect across x-axis' },
      { matrix: [[1, 0], [0, 0]], label: 'singular (rank 1)' },
    ],
  },
  {
    name: 'Triangular',
    description: 'Stretches and shears in a controlled way.',
    variants: [
      { matrix: [[1, 1], [0, 1]], label: 'horizontal shear' },
      { matrix: [[2, 1], [0, 1]], label: 'shear + stretch' },
      { matrix: [[1, 0], [-1, 1]], label: 'lower triangular shear' },
    ],
  },
];

const SAMPLE_COUNT = 8;
const SAMPLE_VECTORS: Vec2[] = Array.from({ length: SAMPLE_COUNT }, (_, i) => {
  const a = (2 * Math.PI * i) / SAMPLE_COUNT;
  return [Math.cos(a) * 2, Math.sin(a) * 2];
});

export function SpecialMatrixGallery() {
  const [familyIndex, setFamilyIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);

  const family = FAMILIES[familyIndex];
  const safeVariantIndex = Math.min(variantIndex, family.variants.length - 1);
  const variant = family.variants[safeVariantIndex];
  const A = variant.matrix;

  const det = useMemo(() => m2det(A), [A]);
  const isReflection = useMemo(() => det < 0, [det]);
  const isSingular = useMemo(() => Math.abs(det) < 1e-9, [det]);
  const isIdentity = useMemo(
    () => Math.abs(A[0][0] - 1) < 1e-9 && Math.abs(A[0][1]) < 1e-9 && Math.abs(A[1][0]) < 1e-9 && Math.abs(A[1][1] - 1) < 1e-9,
    [A]
  );

  const reset = () => {
    setFamilyIndex(0);
    setVariantIndex(0);
  };

  return (
    <div style={{ position: 'relative', maxWidth: CANVAS_W }}>
      <Canvas A={A} isReflection={isReflection} isSingular={isSingular} isIdentity={isIdentity} />
      <Overlay
        family={family}
        A={A}
        det={det}
        isSingular={isSingular}
        isReflection={isReflection}
        isIdentity={isIdentity}
      />

      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        <VizControlButton onClick={reset}>reset</VizControlButton>
      </div>

      {/* Family tabs */}
      <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
        {FAMILIES.map((f, i) => (
          <button
            key={f.name}
            onClick={() => {
              setFamilyIndex(i);
              setVariantIndex(0);
            }}
            className="graph-control-btn"
            style={{
              fontSize: 10,
              padding: '6px 12px',
              flex: 1,
              borderColor: i === familyIndex ? 'var(--border-glow)' : undefined,
              color: i === familyIndex ? 'var(--accent-bright)' : undefined,
              boxShadow:
                i === familyIndex ? '0 0 12px rgba(96, 196, 255, 0.25)' : undefined,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Variant chips */}
      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {family.variants.map((v, i) => (
          <button
            key={i}
            onClick={() => setVariantIndex(i)}
            style={{
              padding: '4px 10px',
              borderRadius: 9,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              background:
                i === safeVariantIndex
                  ? 'rgba(96, 196, 255, 0.18)'
                  : 'var(--bg-panel)',
              color:
                i === safeVariantIndex
                  ? 'var(--accent-bright)'
                  : 'var(--text-secondary)',
              border:
                '1px solid ' + (i === safeVariantIndex ? 'var(--border-glow)' : 'var(--border-subtle)'),
              cursor: 'pointer',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Canvas({
  A,
  isReflection,
  isSingular,
  isIdentity,
}: {
  A: Mat2;
  isReflection: boolean;
  isSingular: boolean;
  isIdentity: boolean;
}) {
  const cy = CANVAS_H / 2;
  const transformed = SAMPLE_VECTORS.map((v) => m2apply(A, v));

  // Image of unit circle: ellipse derived from A
  const ellipsePath = useMemo(() => {
    // Approximate by sampling the unit circle at 64 points and pushing through A.
    const N = 64;
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const t = (2 * Math.PI * i) / N;
      const v = m2apply(A, [Math.cos(t), Math.sin(t)]);
      pts.push([v[0], v[1]]);
    }
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${w2sX(p[0])} ${w2sY(p[1], cy)}`).join(' ');
  }, [A, cy]);

  const imageColor = isReflection ? 'var(--viz-red)' : 'var(--accent)';

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

      {/* Reference unit circle */}
      <circle cx={CANVAS_W / 2} cy={cy} r={40} fill="none" stroke="var(--viz-grid)" strokeWidth={1} />

      {/* Image of unit circle */}
      <path d={ellipsePath} fill={imageColor} fillOpacity={0.08} stroke={imageColor} strokeOpacity={0.5} strokeWidth={1.2} />

      {/* Original sample arrows */}
      {SAMPLE_VECTORS.map((v, i) => (
        <Arrow
          key={`s-${i}`}
          x1={CANVAS_W / 2}
          y1={cy}
          x2={w2sX(v[0])}
          y2={w2sY(v[1], cy)}
          color="var(--text-tertiary)"
          opacity={0.5}
        />
      ))}

      {/* Trails */}
      {!isIdentity &&
        SAMPLE_VECTORS.map((v, i) => {
          const tip = transformed[i];
          return (
            <line
              key={`t-${i}`}
              x1={w2sX(v[0])}
              y1={w2sY(v[1], cy)}
              x2={w2sX(tip[0])}
              y2={w2sY(tip[1], cy)}
              stroke="var(--text-muted)"
              strokeWidth={0.6}
              strokeDasharray="2 3"
              opacity={0.6}
            />
          );
        })}

      {/* Transformed arrows */}
      {!isSingular &&
        transformed.map((v, i) => (
          <Arrow
            key={`tr-${i}`}
            x1={CANVAS_W / 2}
            y1={cy}
            x2={w2sX(v[0])}
            y2={w2sY(v[1], cy)}
            color={imageColor}
          />
        ))}

      {/* Singular case: collapsed circle */}
      {isSingular && (
        <text
          x={CANVAS_W / 2}
          y={CANVAS_H - 18}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--warn)"
        >
          rank 1 — collapses 2D to 1D
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
  opacity = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  opacity?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const arrowSize = 6;
  const ax = x2 - ux * arrowSize - uy * arrowSize * 0.5;
  const ay = y2 - uy * arrowSize + ux * arrowSize * 0.5;
  const bx = x2 - ux * arrowSize + uy * arrowSize * 0.5;
  const by = y2 - uy * arrowSize - ux * arrowSize * 0.5;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.4} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
    </g>
  );
}

function Overlay({
  family,
  A,
  det,
  isSingular,
  isReflection,
  isIdentity,
}: {
  family: Family;
  A: Mat2;
  det: number;
  isSingular: boolean;
  isReflection: boolean;
  isIdentity: boolean;
}) {
  const matrixLatex = `A = \\begin{pmatrix} ${fmtCell(A[0][0])} & ${fmtCell(A[0][1])} \\\\ ${fmtCell(A[1][0])} & ${fmtCell(A[1][1])} \\end{pmatrix}`;

  let detHint: string;
  if (isSingular) detHint = 'singular — area collapses to 0';
  else if (isIdentity) detHint = 'every vector is its own image';
  else if (Math.abs(Math.abs(det) - 1) < 1e-9)
    detHint = isReflection ? 'preserves area, reverses orientation' : 'preserves area';
  else detHint = `scales area by |det| = ${fmtCell(Math.abs(det))}`;

  return (
    <OverlayPanel>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: 4,
        }}
      >
        {family.name}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          marginBottom: 10,
          lineHeight: 1.5,
        }}
      >
        {family.description}
      </div>
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        <BlockMath math={matrixLatex} />
      </div>
      <MonoLine>det(A) = {fmtCell(det)}</MonoLine>
      <MonoLine color="var(--text-tertiary)">{detHint}</MonoLine>
    </OverlayPanel>
  );
}
