// 3.8 — Coimage & Cokernel (interactive).
// Default: 3×3 matrix with rank 2. Two isometric ℝ³ panels: domain shows kernel+coimage;
// codomain shows image+cokernel. Coimage rendered as ker^⊥; cokernel rendered as im^⊥.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import {
  computeRREF,
  imageBasisFromPivots,
  isometricProject,
  nullSpaceBasis,
  type Vec3,
} from '../../lib/linearAlgebra';
import { MonoLine, NumberCell, VizControlButton } from './_shared';

const W = 320;
const H = 280;
const CX = W / 2;
const CY = H / 2 + 20;
const SCALE = 36;

const PRESETS: { label: string; matrix: number[][] }[] = [
  { label: 'rank 2 (default)', matrix: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  { label: 'rank 1', matrix: [[1, 2, 3], [2, 4, 6], [3, 6, 9]] },
  { label: 'rank 3 (full)', matrix: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
  { label: 'rank 0 (zero)', matrix: [[0, 0, 0], [0, 0, 0], [0, 0, 0]] },
];

function transpose(M: number[][]): number[][] {
  const r = M.length;
  const c = M[0].length;
  const T: number[][] = Array.from({ length: c }, () => new Array(r).fill(0));
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) T[j][i] = M[i][j];
  return T;
}

export function CoimageCokernelViz() {
  const [matrix, setMatrix] = useState<number[][]>(PRESETS[0].matrix.map((r) => [...r]));

  const rank = useMemo(() => computeRREF(matrix).rank, [matrix]);
  const nullity = 3 - rank; // domain dim 3
  const cokernelDim = 3 - rank; // codomain dim 3

  const kernelBasis = useMemo(() => nullSpaceBasis(matrix), [matrix]);
  const cokernelBasis = useMemo(() => nullSpaceBasis(transpose(matrix)), [matrix]);
  const imageInfo = useMemo(() => imageBasisFromPivots(matrix), [matrix]);

  // Coimage basis = rows of A (span row space = ker^⊥). Use original rows to keep
  // basis vectors readable (rather than RREF rows).
  const coimageBasis = useMemo(() => {
    if (rank === 0) return [];
    // Use the pivot rows of A — find which rows of A are linearly independent.
    // Since the rank is `rank`, we need `rank` independent rows.
    // Approach: compute RREF of A^T, the pivot columns of that = independent rows of A.
    const At = transpose(matrix);
    const rref = computeRREF(At);
    const pivotCols = rref.pivots.map((p) => p.col);
    return pivotCols.map((i) => [...matrix[i]]);
  }, [matrix, rank]);

  const setEntry = (r: number, c: number, val: number) => {
    setMatrix((M) => {
      const next = M.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  return (
    <div style={{ maxWidth: 760 }}>
      {/* ── Top row: domain | matrix | codomain ─────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 12,
          alignItems: 'stretch',
        }}
      >
        <SubspacePanel
          title="DOMAIN · ℝ³"
          subspaces={[
            { kind: 'kernel', label: 'kernel', dim: nullity, basis: kernelBasis as Vec3[], color: 'rgba(255, 123, 107, 0.95)', fill: 'rgba(255, 123, 107, 0.18)' },
            { kind: 'coimage', label: 'coimage = ker(T)⊥', dim: rank, basis: coimageBasis as Vec3[], color: 'rgba(103, 169, 255, 0.95)', fill: 'rgba(103, 169, 255, 0.18)' },
          ]}
        />

        {/* Matrix in the middle */}
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
            3 × 3 MATRIX A
          </MonoLine>
          <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, auto)', gap: 4 }}>
            {matrix.flatMap((row, r) =>
              row.map((cell, c) => (
                <NumberCell
                  key={`${r}-${c}`}
                  value={cell}
                  onChange={(v) => setEntry(r, c, v)}
                  step={0.5}
                  min={-9}
                  max={9}
                  width={48}
                />
              ))
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            rank = <span style={{ color: 'var(--accent-bright, #67a9ff)', fontWeight: 600 }}>{rank}</span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-tertiary)',
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: 180,
              lineHeight: 1.3,
            }}
          >
            coimage rendered as ker(T)⊥; cokernel as im(T)⊥
          </div>
        </div>

        <SubspacePanel
          title="CODOMAIN · ℝ³"
          subspaces={[
            { kind: 'image', label: 'image', dim: rank, basis: imageInfo.cols.map((c) => [c[0], c[1], c[2] ?? 0]) as Vec3[], color: 'rgba(103, 169, 255, 0.95)', fill: 'rgba(103, 169, 255, 0.18)' },
            { kind: 'cokernel', label: 'cokernel = im(T)⊥', dim: cokernelDim, basis: cokernelBasis as Vec3[], color: 'rgba(255, 217, 102, 0.95)', fill: 'rgba(255, 217, 102, 0.18)' },
          ]}
        />
      </div>

      {/* ── Dimensional summary ──────────────────────────────── */}
      <div
        style={{
          marginTop: 14,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: 13,
        }}
      >
        <IdentityRow
          math={`V \\cong \\ker T \\oplus \\mathrm{coim}\\, T \\;\\;:\\;\\; 3 = ${nullity} + ${rank}`}
          ok={nullity + rank === 3}
        />
        <IdentityRow
          math={`W \\cong \\mathrm{im}\\, T \\oplus \\mathrm{coker}\\, T \\;\\;:\\;\\; 3 = ${rank} + ${cokernelDim}`}
          ok={rank + cokernelDim === 3}
        />
        <IdentityRow math={`\\mathrm{coim}\\, T \\,\\cong\\, \\mathrm{im}\\, T \\;\\;:\\;\\; \\dim = ${rank}`} ok />
      </div>

      {/* ── Presets ──────────────────────────────────────────── */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PRESETS.map((p) => (
          <VizControlButton key={p.label} onClick={() => setMatrix(p.matrix.map((r) => [...r]))}>
            {p.label}
          </VizControlButton>
        ))}
      </div>
    </div>
  );
}

interface SubspaceSpec {
  kind: 'kernel' | 'coimage' | 'image' | 'cokernel';
  label: string;
  dim: number;
  basis: Vec3[];
  color: string;
  fill: string;
}

function SubspacePanel({ title, subspaces }: { title: string; subspaces: SubspaceSpec[] }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <MonoLine size={9} color="var(--text-tertiary)">
        {title}
      </MonoLine>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <Axes3D length={3} />
        {subspaces.map((s) => (
          <SubspaceRender key={s.kind} spec={s} />
        ))}
        {/* Arrows last so they're on top */}
        {subspaces.map((s) =>
          s.basis.slice(0, 3).map((v, i) => (
            <Arrow3D
              key={`${s.kind}-${i}`}
              v={v}
              color={s.color}
              label={s.kind[0] + (i + 1)}
            />
          ))
        )}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
        {subspaces.map((s) => (
          <div
            key={s.kind}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
            <span style={{ color: s.color, fontWeight: 600 }}>dim = {s.dim}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Axes3D({ length }: { length: number }) {
  const x = isometricProject([length, 0, 0], SCALE);
  const y = isometricProject([0, length, 0], SCALE);
  const z = isometricProject([0, 0, length], SCALE);
  const xn = isometricProject([-length, 0, 0], SCALE);
  const yn = isometricProject([0, -length, 0], SCALE);
  const zn = isometricProject([0, 0, -length], SCALE);
  return (
    <g>
      <line x1={CX + xn[0]} y1={CY + xn[1]} x2={CX + x[0]} y2={CY + x[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
      <line x1={CX + yn[0]} y1={CY + yn[1]} x2={CX + y[0]} y2={CY + y[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
      <line x1={CX + zn[0]} y1={CY + zn[1]} x2={CX + z[0]} y2={CY + z[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
      <text x={CX + x[0] + 4} y={CY + x[1]} fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">x</text>
      <text x={CX + y[0] + 4} y={CY + y[1]} fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">y</text>
      <text x={CX + z[0] + 4} y={CY + z[1]} fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">z</text>
    </g>
  );
}

function SubspaceRender({ spec }: { spec: SubspaceSpec }) {
  const { dim, basis, color, fill } = spec;
  if (dim === 0) {
    return <circle cx={CX} cy={CY} r={3} fill={color} />;
  }
  if (dim === 1 && basis[0]) {
    const v = basis[0];
    const norm = Math.hypot(v[0], v[1], v[2]);
    if (norm < 1e-9) return null;
    const f = 3 / norm;
    const [ax, ay] = isometricProject([v[0] * f, v[1] * f, v[2] * f], SCALE);
    const [bx, by] = isometricProject([-v[0] * f, -v[1] * f, -v[2] * f], SCALE);
    return (
      <line
        x1={CX + ax}
        y1={CY + ay}
        x2={CX + bx}
        y2={CY + by}
        stroke={color}
        strokeOpacity={0.5}
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  }
  if (dim === 2 && basis.length >= 2) {
    const [v1, v2] = [basis[0], basis[1]];
    const f = 1.5;
    const corners: Vec3[] = [
      [v1[0] * f + v2[0] * f, v1[1] * f + v2[1] * f, v1[2] * f + v2[2] * f],
      [v1[0] * f - v2[0] * f, v1[1] * f - v2[1] * f, v1[2] * f - v2[2] * f],
      [-v1[0] * f - v2[0] * f, -v1[1] * f - v2[1] * f, -v1[2] * f - v2[2] * f],
      [-v1[0] * f + v2[0] * f, -v1[1] * f + v2[1] * f, -v1[2] * f + v2[2] * f],
    ];
    const pts = corners.map((c) => isometricProject(c, SCALE));
    return (
      <polygon
        points={pts.map((p) => `${CX + p[0]},${CY + p[1]}`).join(' ')}
        fill={fill}
        stroke={color}
        strokeOpacity={0.6}
        strokeWidth={1.2}
      />
    );
  }
  // Full space (dim 3)
  return (
    <rect
      x={4}
      y={4}
      width={W - 8}
      height={H - 8}
      fill={fill}
      stroke={color}
      strokeOpacity={0.4}
      strokeWidth={1.2}
      strokeDasharray="4 5"
      rx={4}
    />
  );
}

function Arrow3D({
  v,
  color,
  label,
}: {
  v: Vec3;
  color: string;
  label?: string;
}) {
  const norm = Math.hypot(v[0], v[1], v[2]);
  if (norm < 1e-9) return null;
  const max = 2.5;
  const f = norm > max ? max / norm : 1;
  const [px, py] = isometricProject([v[0] * f, v[1] * f, v[2] * f], SCALE);
  const x2 = CX + px;
  const y2 = CY + py;
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
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={1.8} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 4} y={y2 - 4} fontSize={9} fontFamily="var(--font-mono)" fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

function IdentityRow({ math, ok }: { math: string; ok: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ flex: 1, fontSize: 12 }}>
        <InlineMath math={math} />
      </span>
      <span
        style={{
          color: ok ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {ok ? '✓' : '✗'}
      </span>
    </div>
  );
}
