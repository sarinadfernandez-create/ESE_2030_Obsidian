// 4.4 — Matrix Representation (interactive).
// Same linear transformation T, displayed as a different matrix in different bases.
// Eigenbasis (when real eigenvalues exist) makes the matrix diagonal — visually striking.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { computeEigen2, type Mat2 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 380;
const H = 380;
const CX = W / 2;
const CY = H / 2;
const UNIT = 50;

type TransformId = 'rotation-30' | 'shear-x' | 'projection-x' | 'reflection-y=x';
type BasisId = 'standard' | 'rotated' | 'eigenbasis';

const TRANSFORMS: Record<TransformId, { label: string; matrix: Mat2 }> = {
  'rotation-30': {
    label: 'rotation 30°',
    matrix: [
      [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6)],
      [Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)],
    ],
  },
  'shear-x': {
    label: 'horizontal shear',
    matrix: [
      [1, 1],
      [0, 1],
    ],
  },
  'projection-x': {
    label: 'projection onto x-axis',
    matrix: [
      [1, 0],
      [0, 0],
    ],
  },
  'reflection-y=x': {
    label: 'reflection across y=x',
    matrix: [
      [0, 1],
      [1, 0],
    ],
  },
};

function det2(B: Mat2): number {
  return B[0][0] * B[1][1] - B[0][1] * B[1][0];
}

function inv2(B: Mat2): Mat2 | null {
  const d = det2(B);
  if (Math.abs(d) < 1e-9) return null;
  return [
    [B[1][1] / d, -B[0][1] / d],
    [-B[1][0] / d, B[0][0] / d],
  ];
}

function mat2x2(A: Mat2, B: Mat2): Mat2 {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];
}

function isDiagonal(M: Mat2, tol = 0.005): boolean {
  return Math.abs(M[0][1]) < tol && Math.abs(M[1][0]) < tol;
}

function fmt(n: number): string {
  if (Math.abs(n) < 0.005) return '0';
  return n.toFixed(2);
}

export function MatrixRepresentationViz() {
  const [transformId, setTransformId] = useState<TransformId>('shear-x');
  const [basisId, setBasisId] = useState<BasisId>('standard');

  const T = TRANSFORMS[transformId].matrix;
  const eigen = useMemo(() => computeEigen2(T), [T]);

  // Pick basis matrix P (columns = basis vectors), expressed in standard coordinates.
  // matrix in this basis = P^-1 T P
  const { P, basisAvailable, note } = useMemo(() => {
    if (basisId === 'standard') {
      return {
        P: [
          [1, 0],
          [0, 1],
        ] as Mat2,
        basisAvailable: true,
        note: '',
      };
    }
    if (basisId === 'rotated') {
      const a = Math.PI / 6;
      return {
        P: [
          [Math.cos(a), -Math.sin(a)],
          [Math.sin(a), Math.cos(a)],
        ] as Mat2,
        basisAvailable: true,
        note: '',
      };
    }
    // eigenbasis
    if (eigen.kind === 'complex') {
      return {
        P: [
          [1, 0],
          [0, 1],
        ] as Mat2,
        basisAvailable: false,
        note: 'this transformation has complex eigenvalues — no real eigenbasis exists',
      };
    }
    if (eigen.kind === 'repeated') {
      if (!eigen.vector) {
        return {
          P: [
            [1, 0],
            [0, 1],
          ] as Mat2,
          basisAvailable: false,
          note: 'defective eigenvalue — no eigenbasis available',
        };
      }
      // Just show identity — defective case
      return {
        P: [
          [1, 0],
          [0, 1],
        ] as Mat2,
        basisAvailable: false,
        note: 'repeated eigenvalue with single eigenvector — incomplete eigenbasis',
      };
    }
    // real eigenvalues — use eigenvectors as basis
    return {
      P: [
        [eigen.vectors[0][0], eigen.vectors[1][0]],
        [eigen.vectors[0][1], eigen.vectors[1][1]],
      ] as Mat2,
      basisAvailable: true,
      note:
        Math.abs(eigen.values[0] - eigen.values[1]) < 1e-6 && transformId === 'projection-x'
          ? 'for this transform, the eigenbasis equals the standard basis'
          : '',
    };
  }, [basisId, eigen, transformId]);

  const Tinbasis = useMemo<Mat2 | null>(() => {
    if (!basisAvailable) return null;
    const Pinv = inv2(P);
    if (!Pinv) return null;
    return mat2x2(Pinv, mat2x2(T, P));
  }, [P, T, basisAvailable]);

  const isDiag = Tinbasis ? isDiagonal(Tinbasis) : false;

  // Apply T to unit square corners and the F segments
  const corners: Vec2[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const transformed = corners.map(([x, y]) => [T[0][0] * x + T[0][1] * y, T[1][0] * x + T[1][1] * y] as Vec2);

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  return (
    <div style={{ maxWidth: 760 }}>
      {/* ── Top selector row ──────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        {(Object.keys(TRANSFORMS) as TransformId[]).map((id) => (
          <VizControlButton key={id} active={transformId === id} onClick={() => setTransformId(id)}>
            {TRANSFORMS[id].label}
          </VizControlButton>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'stretch' }}>
        {/* ── Plane ─────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 8,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            ACTION OF T ON ℝ²
          </MonoLine>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            {/* Original unit square */}
            <polygon
              points={corners.map(([x, y]) => `${w2sX(x)},${w2sY(y)}`).join(' ')}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1.2}
              strokeDasharray="3 4"
            />
            {/* Transformed unit square */}
            <polygon
              points={transformed.map(([x, y]) => `${w2sX(x)},${w2sY(y)}`).join(' ')}
              fill="rgba(103,169,255,0.18)"
              stroke="rgba(103,169,255,0.85)"
              strokeWidth={1.6}
            />
            {/* Basis vectors overlaid */}
            {basisAvailable && (
              <>
                <BasisVec u={[P[0][0], P[1][0]]} color="rgba(255, 217, 102, 0.95)" label="b1" />
                <BasisVec u={[P[0][1], P[1][1]]} color="rgba(255, 217, 102, 0.95)" label="b2" dashed />
              </>
            )}
          </svg>
        </div>

        {/* ── Matrix display ────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            MATRIX [T] IN BASIS
          </MonoLine>

          {/* Basis selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(['standard', 'rotated', 'eigenbasis'] as BasisId[]).map((b) => (
              <button
                key={b}
                onClick={() => setBasisId(b)}
                style={{
                  background: basisId === b ? 'rgba(103, 169, 255, 0.12)' : 'var(--bg-elevated)',
                  border: `1px solid ${basisId === b ? 'var(--accent-bright, #67a9ff)' : 'var(--border-subtle)'}`,
                  borderRadius: 4,
                  padding: '6px 10px',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {b === 'standard' ? 'standard {e₁, e₂}' : b === 'rotated' ? 'rotated 30°' : 'eigenbasis'}
              </button>
            ))}
          </div>

          {/* Matrix render */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            {Tinbasis ? (
              <>
                <div
                  style={{
                    fontSize: isDiag ? 18 : 14,
                    transition: 'font-size 0.2s',
                  }}
                >
                  <InlineMath
                    math={`[T]_\\mathcal{${basisId === 'standard' ? 'E' : basisId === 'rotated' ? 'R' : 'V'}} = \\begin{pmatrix} ${fmt(Tinbasis[0][0])} & ${fmt(Tinbasis[0][1])} \\\\ ${fmt(Tinbasis[1][0])} & ${fmt(Tinbasis[1][1])} \\end{pmatrix}`}
                  />
                </div>
                {isDiag && basisId === 'eigenbasis' && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'rgba(111, 212, 154, 1)',
                      fontStyle: 'italic',
                    }}
                  >
                    diagonal! eigenvalues on the diagonal
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  color: 'rgba(255, 217, 102, 0.95)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {note}
              </div>
            )}
          </div>

          {/* Footer */}
          {Tinbasis && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-tertiary)',
                fontStyle: 'italic',
                lineHeight: 1.4,
                paddingTop: 8,
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              same T, different matrix per basis ·{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                <InlineMath math="[T]_\mathcal{B'} = P^{-1} [T]_\mathcal{B} P" />
              </span>
            </div>
          )}
          {note && Tinbasis && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'rgba(255, 217, 102, 0.95)',
                fontStyle: 'italic',
                lineHeight: 1.4,
              }}
            >
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BasisVec({
  u,
  color,
  label,
  dashed,
}: {
  u: Vec2;
  color: string;
  label: string;
  dashed?: boolean;
}) {
  const x2 = CX + u[0] * UNIT;
  const y2 = CY - u[1] * UNIT;
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
  return (
    <g>
      <line
        x1={CX}
        y1={CY}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1.8}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      <text x={x2 + 4} y={y2 - 4} fontSize={9} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>
        {label}
      </text>
    </g>
  );
}
