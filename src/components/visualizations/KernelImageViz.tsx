// 3.5 — Kernel & Image (interactive).
// Default: 2×3 matrix with rank 1. Domain panel renders the kernel
// in ℝ³ (isometric); codomain panel renders the image in ℝ². Toggle
// to highlight which columns of A are pivot columns (those form the image basis).

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import {
  computeRREF,
  imageBasisFromPivots,
  isometricProject,
  nullSpaceBasis,
  type Vec3,
} from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, NumberCell, VizControlButton } from './_shared';

const D_W = 320;
const D_H = 280;
const D_CX = D_W / 2;
const D_CY = D_H / 2 + 20;
const D_SCALE = 36;

const C_W = 320;
const C_H = 280;
const C_CX = C_W / 2;
const C_CY = C_H / 2;
const C_UNIT = 36;

const PRESETS: { label: string; matrix: number[][] }[] = [
  { label: 'rank 1 (default)', matrix: [[1, 2, 3], [2, 4, 6]] },
  { label: 'rank 2 (full)', matrix: [[1, 0, 1], [0, 1, 1]] },
  { label: 'rank 0 (zero)', matrix: [[0, 0, 0], [0, 0, 0]] },
  { label: 'rank 1 alt', matrix: [[1, -1, 2], [3, -3, 6]] },
];

export function KernelImageViz() {
  // Fixed shape 2×3 for visual story (kernel in R^3, image in R^2)
  const [matrix, setMatrix] = useState<number[][]>(PRESETS[0].matrix.map((r) => [...r]));
  const [highlightPivots, setHighlightPivots] = useState(true);

  const rref = useMemo(() => computeRREF(matrix), [matrix]);
  const rank = rref.rank;
  const nullity = 3 - rank;

  const kernelBasis = useMemo(() => nullSpaceBasis(matrix), [matrix]);
  const imageInfo = useMemo(() => imageBasisFromPivots(matrix), [matrix]);
  const pivotCols = new Set(imageInfo.pivotCols);

  const setEntry = (r: number, c: number, val: number) => {
    setMatrix((M) => {
      const next = M.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 14,
          alignItems: 'stretch',
        }}
      >
        {/* ── Domain (R^3) ──────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 10,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            DOMAIN · ℝ³
          </MonoLine>
          <svg viewBox={`0 0 ${D_W} ${D_H}`} width="100%" style={{ display: 'block' }}>
            <Axes3D cx={D_CX} cy={D_CY} scale={D_SCALE} length={3} />

            {/* Kernel rendering */}
            {nullity === 0 && (
              <circle cx={D_CX} cy={D_CY} r={4} fill="rgba(255, 123, 107, 0.95)" />
            )}
            {nullity === 1 && kernelBasis[0] && (
              <KernelLine
                v={kernelBasis[0] as Vec3}
                cx={D_CX}
                cy={D_CY}
                scale={D_SCALE}
              />
            )}
            {nullity === 2 && kernelBasis.length === 2 && (
              <KernelPlane
                v1={kernelBasis[0] as Vec3}
                v2={kernelBasis[1] as Vec3}
                cx={D_CX}
                cy={D_CY}
                scale={D_SCALE}
              />
            )}
            {nullity >= 3 && (
              <rect
                x={4}
                y={4}
                width={D_W - 8}
                height={D_H - 8}
                fill="rgba(255, 123, 107, 0.12)"
                stroke="rgba(255, 123, 107, 0.5)"
                strokeWidth={1.2}
                strokeDasharray="4 4"
                rx={4}
              />
            )}

            {/* Kernel basis arrows */}
            {kernelBasis.slice(0, 2).map((v, i) => (
              <Arrow3D
                key={`k-${i}`}
                v={v as Vec3}
                cx={D_CX}
                cy={D_CY}
                scale={D_SCALE}
                color="rgba(255, 123, 107, 0.95)"
                label={`k${i + 1}`}
              />
            ))}
          </svg>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            kernel · dim = <span style={{ color: 'rgba(255, 123, 107, 1)', fontWeight: 600 }}>{nullity}</span>
          </div>
          {kernelBasis.length > 0 && (
            <div style={{ fontSize: 11, marginTop: 4, textAlign: 'center' }}>
              <KernelBasisLabel basis={kernelBasis} />
            </div>
          )}
        </div>

        {/* ── Matrix ────────────────────────────────────────── */}
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
            minWidth: 200,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            2 × 3 MATRIX A
          </MonoLine>
          <div
            style={{
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(3, auto)',
              gap: 4,
              border: '1px solid var(--border-default)',
              padding: 5,
              borderRadius: 4,
            }}
          >
            {matrix.flatMap((row, r) =>
              row.map((cell, c) => {
                const isPivot = pivotCols.has(c);
                return (
                  <div
                    key={`${r}-${c}`}
                    style={{
                      background:
                        highlightPivots && isPivot
                          ? 'rgba(103, 169, 255, 0.18)'
                          : highlightPivots && !isPivot
                          ? 'rgba(255,255,255,0.02)'
                          : 'transparent',
                      borderRadius: 3,
                      padding: 1,
                      opacity: highlightPivots && !isPivot ? 0.5 : 1,
                    }}
                  >
                    <NumberCell
                      value={cell}
                      onChange={(v) => setEntry(r, c, v)}
                      step={0.5}
                      min={-9}
                      max={9}
                      width={48}
                    />
                  </div>
                );
              })
            )}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            rank = <span style={{ color: 'var(--accent-bright, #67a9ff)', fontWeight: 600 }}>{rank}</span>
          </div>
          <VizControlButton onClick={() => setHighlightPivots((v) => !v)} active={highlightPivots}>
            highlight pivot columns
          </VizControlButton>
        </div>

        {/* ── Codomain (R^2) ─────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 10,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            CODOMAIN · ℝ²
          </MonoLine>
          <svg viewBox={`0 0 ${C_W} ${C_H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={C_W} height={C_H} unit={C_UNIT} />

            {/* Image rendering */}
            {rank === 0 && <circle cx={C_CX} cy={C_CY} r={4} fill="rgba(103, 169, 255, 0.95)" />}
            {rank === 1 && imageInfo.cols[0] && (
              <ImageLine col={imageInfo.cols[0]} cx={C_CX} cy={C_CY} unit={C_UNIT} />
            )}
            {rank === 2 && (
              <rect
                x={4}
                y={4}
                width={C_W - 8}
                height={C_H - 8}
                fill="rgba(103, 169, 255, 0.12)"
                stroke="rgba(103, 169, 255, 0.4)"
                strokeWidth={1}
                strokeDasharray="3 4"
                rx={4}
              />
            )}

            {/* Image basis arrows = pivot columns of original A */}
            {imageInfo.cols.map((col, i) => (
              <Arrow2D
                key={`img-${i}`}
                v={[col[0], col[1]]}
                cx={C_CX}
                cy={C_CY}
                unit={C_UNIT}
                color="rgba(103, 169, 255, 0.95)"
                label={`a${imageInfo.pivotCols[i] + 1}`}
              />
            ))}
          </svg>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            image · dim = <span style={{ color: 'rgba(103, 169, 255, 1)', fontWeight: 600 }}>{rank}</span>
          </div>
          <div style={{ fontSize: 11, marginTop: 4, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            basis = original pivot columns
          </div>
        </div>
      </div>

      {/* ── Rank-nullity verification ─────────────────────────── */}
      <div
        style={{
          marginTop: 14,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 12,
          textAlign: 'center',
        }}
      >
        <InlineMath
          math={`\\mathrm{rank}\\,A + \\mathrm{nullity}\\,A = ${rank} + ${nullity} = ${rank + nullity} = n \\;\\;\\checkmark`}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {PRESETS.map((p) => (
          <VizControlButton key={p.label} onClick={() => setMatrix(p.matrix.map((r) => [...r]))}>
            {p.label}
          </VizControlButton>
        ))}
      </div>
    </div>
  );
}

// ── Sub-renderers ──────────────────────────────────────────────────────────

function Axes3D({ cx, cy, scale, length }: { cx: number; cy: number; scale: number; length: number }) {
  const x = isometricProject([length, 0, 0], scale);
  const y = isometricProject([0, length, 0], scale);
  const z = isometricProject([0, 0, length], scale);
  const xn = isometricProject([-length, 0, 0], scale);
  const yn = isometricProject([0, -length, 0], scale);
  const zn = isometricProject([0, 0, -length], scale);
  return (
    <g>
      <line x1={cx + xn[0]} y1={cy + xn[1]} x2={cx + x[0]} y2={cy + x[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
      <line x1={cx + yn[0]} y1={cy + yn[1]} x2={cx + y[0]} y2={cy + y[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
      <line x1={cx + zn[0]} y1={cy + zn[1]} x2={cx + z[0]} y2={cy + z[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
      <text x={cx + x[0] + 4} y={cy + x[1]} fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">x</text>
      <text x={cx + y[0] + 4} y={cy + y[1]} fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">y</text>
      <text x={cx + z[0] + 4} y={cy + z[1]} fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">z</text>
    </g>
  );
}

function Arrow3D({
  v,
  cx,
  cy,
  scale,
  color,
  label,
}: {
  v: Vec3;
  cx: number;
  cy: number;
  scale: number;
  color: string;
  label?: string;
}) {
  const norm = Math.hypot(v[0], v[1], v[2]);
  if (norm < 1e-9) return null;
  // Clamp display length for visibility
  const maxLen = 2.5;
  const f = norm > maxLen ? maxLen / norm : 1;
  const [px, py] = isometricProject([v[0] * f, v[1] * f, v[2] * f], scale);
  const x2 = cx + px;
  const y2 = cy + py;
  const dx = x2 - cx;
  const dy = y2 - cy;
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
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={1.8} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 4} y={y2 - 4} fontSize={9} fontFamily="var(--font-mono)" fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

function Arrow2D({
  v,
  cx,
  cy,
  unit,
  color,
  label,
}: {
  v: [number, number];
  cx: number;
  cy: number;
  unit: number;
  color: string;
  label?: string;
}) {
  const norm = Math.hypot(v[0], v[1]);
  if (norm < 1e-9) return null;
  const x2 = cx + v[0] * unit;
  const y2 = cy - v[1] * unit;
  const dx = x2 - cx;
  const dy = y2 - cy;
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
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 5} y={y2 - 5} fontSize={10} fontFamily="var(--font-mono)" fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

function KernelLine({ v, cx, cy, scale }: { v: Vec3; cx: number; cy: number; scale: number }) {
  const norm = Math.hypot(v[0], v[1], v[2]);
  if (norm < 1e-9) return null;
  const f = 3 / norm;
  const [ax, ay] = isometricProject([v[0] * f, v[1] * f, v[2] * f], scale);
  const [bx, by] = isometricProject([-v[0] * f, -v[1] * f, -v[2] * f], scale);
  return (
    <line
      x1={cx + ax}
      y1={cy + ay}
      x2={cx + bx}
      y2={cy + by}
      stroke="rgba(255, 123, 107, 0.5)"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function KernelPlane({
  v1,
  v2,
  cx,
  cy,
  scale,
}: {
  v1: Vec3;
  v2: Vec3;
  cx: number;
  cy: number;
  scale: number;
}) {
  // Render the parallelogram spanned by ±v1 ± v2 (just the four corners scaled).
  const f = 1.5;
  const corners: Vec3[] = [
    [v1[0] * f + v2[0] * f, v1[1] * f + v2[1] * f, v1[2] * f + v2[2] * f],
    [v1[0] * f - v2[0] * f, v1[1] * f - v2[1] * f, v1[2] * f - v2[2] * f],
    [-v1[0] * f - v2[0] * f, -v1[1] * f - v2[1] * f, -v1[2] * f - v2[2] * f],
    [-v1[0] * f + v2[0] * f, -v1[1] * f + v2[1] * f, -v1[2] * f + v2[2] * f],
  ];
  const pts = corners.map((c) => isometricProject(c, scale));
  return (
    <polygon
      points={pts.map((p) => `${cx + p[0]},${cy + p[1]}`).join(' ')}
      fill="rgba(255, 123, 107, 0.18)"
      stroke="rgba(255, 123, 107, 0.6)"
      strokeWidth={1.2}
    />
  );
}

function ImageLine({ col, cx, cy, unit }: { col: number[]; cx: number; cy: number; unit: number }) {
  const norm = Math.hypot(col[0], col[1]);
  if (norm < 1e-9) return null;
  const f = 4 / norm;
  return (
    <line
      x1={cx + col[0] * unit * f}
      y1={cy - col[1] * unit * f}
      x2={cx - col[0] * unit * f}
      y2={cy + col[1] * unit * f}
      stroke="rgba(103, 169, 255, 0.5)"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function KernelBasisLabel({ basis }: { basis: number[][] }) {
  if (basis.length === 0) return null;
  const fmt = (v: number[]) => `(${v.map((x) => x.toFixed(1)).join(', ')})`;
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
      basis: {basis.map((v) => fmt(v)).join(', ')}
    </span>
  );
}
