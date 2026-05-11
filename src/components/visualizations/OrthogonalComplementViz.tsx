// 6.1 — Orthogonal Complement (interactive).
// In R^3, pick a subspace W (line or plane) and a test vector v. Render W and its
// orthogonal complement W^⊥ side by side, with v decomposed as w + w^⊥.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { isometricProject, type Vec3 } from '../../lib/linearAlgebra';
import { MonoLine, NumberCell, VizControlButton } from './_shared';

type SubspaceKind = 'line' | 'plane';

const W = 480;
const H = 400;
const CX = W / 2;
const CY = H / 2 + 20;
const SCALE = 50;
const TOL = 1e-4;

const LINE_PRESETS: Record<string, Vec3> = {
  'x-axis': [1, 0, 0],
  'y-axis': [0, 1, 0],
  'z-axis': [0, 0, 1],
  diagonal: [1, 1, 1],
};

export function OrthogonalComplementViz() {
  const [kind, setKind] = useState<SubspaceKind>('line');
  const [lineDir, setLineDir] = useState<Vec3>([1, 1, 1]);
  const [planeNormal, setPlaneNormal] = useState<Vec3>([0, 0, 1]);
  const [v, setV] = useState<Vec3>([1.5, 1, 0.5]);

  // Direction of the 1D part (the line, whether it IS W or W^⊥).
  const oneDimVec: Vec3 = kind === 'line' ? lineDir : planeNormal;
  // dim(W) and dim(W^⊥)
  const dimW = kind === 'line' ? 1 : 2;
  const dimWperp = 3 - dimW;

  // Degenerate guard: 1D direction must be nonzero.
  const oneDimNorm = Math.hypot(oneDimVec[0], oneDimVec[1], oneDimVec[2]);
  const degenerate = oneDimNorm < TOL;

  // Decomposition of v: project onto the 1D vector, get parallel component, then perp.
  const { w, wPerp } = useMemo(() => {
    if (degenerate) {
      return { w: [0, 0, 0] as Vec3, wPerp: v };
    }
    const dot = v[0] * oneDimVec[0] + v[1] * oneDimVec[1] + v[2] * oneDimVec[2];
    const s = dot / (oneDimNorm * oneDimNorm);
    const parallel: Vec3 = [oneDimVec[0] * s, oneDimVec[1] * s, oneDimVec[2] * s];
    const perp: Vec3 = [v[0] - parallel[0], v[1] - parallel[1], v[2] - parallel[2]];
    // When W is the LINE: w (in W) = parallel, w^⊥ (in W^⊥) = perp
    // When W is the PLANE (normal = oneDimVec): w (in W) = perp, w^⊥ (in W^⊥) = parallel
    if (kind === 'line') {
      return { w: parallel, wPerp: perp };
    } else {
      return { w: perp, wPerp: parallel };
    }
  }, [v, oneDimVec, kind, degenerate, oneDimNorm]);

  const vNormSq = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
  const wNormSq = w[0] * w[0] + w[1] * w[1] + w[2] * w[2];
  const wPerpNormSq = wPerp[0] * wPerp[0] + wPerp[1] * wPerp[1] + wPerp[2] * wPerp[2];
  const wDotWperp = w[0] * wPerp[0] + w[1] * wPerp[1] + w[2] * wPerp[2];
  const perpOk = Math.abs(wDotWperp) < TOL * Math.max(1, vNormSq);

  const setVecEntry = (setter: (v: Vec3) => void, current: Vec3, i: number, val: number) => {
    const next: Vec3 = [...current] as Vec3;
    next[i] = val;
    setter(next);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14, alignItems: 'start' }}>
        {/* ── 3D plot ──────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 8,
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <Axes3D length={3} />

            {/* W rendering */}
            {!degenerate && kind === 'line' && (
              <SubspaceLine v={oneDimVec} color="rgba(103, 169, 255, 0.95)" thick />
            )}
            {!degenerate && kind === 'plane' && (
              <SubspacePlane normal={oneDimVec} fill="rgba(103, 169, 255, 0.18)" stroke="rgba(103, 169, 255, 0.55)" />
            )}

            {/* W^⊥ rendering */}
            {!degenerate && kind === 'line' && (
              <SubspacePlane normal={oneDimVec} fill="rgba(255, 217, 102, 0.16)" stroke="rgba(255, 217, 102, 0.55)" />
            )}
            {!degenerate && kind === 'plane' && (
              <SubspaceLine v={oneDimVec} color="rgba(255, 217, 102, 0.95)" thick />
            )}

            {/* Decomposition arrows: w (cyan dashed) from origin */}
            {!degenerate && (
              <Arrow3D v={w} color="rgba(103, 169, 255, 0.8)" label="w" dashed />
            )}
            {/* w^⊥ (yellow dashed) from tip of w to tip of v */}
            {!degenerate && (
              <ArrowFromTo from={w} to={v} color="rgba(255, 217, 102, 0.8)" label="w⊥" dashed />
            )}

            {/* v: purple */}
            <Arrow3D v={v} color="rgba(184, 150, 255, 1)" label="v" bold />

            {/* Right-angle glyph at the meeting point */}
            {!degenerate && perpOk && oneDimNorm > TOL && wNormSq > TOL && wPerpNormSq > TOL && (
              <RightAngleGlyph at={w} along={w} perpDir={wPerp} />
            )}
          </svg>

          {degenerate && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'rgba(255, 217, 102, 0.95)',
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: 6,
              }}
            >
              direction vector is zero · W = {'{0}'} · complement is all of ℝ³
            </div>
          )}
        </div>

        {/* ── Right readouts ──────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">DIMENSIONS</MonoLine>
          <div>dim(W) = <span style={{ color: 'var(--accent-bright, #67a9ff)', fontWeight: 600 }}>{dimW}</span></div>
          <div>dim(W⊥) = <span style={{ color: 'rgba(255, 217, 102, 1)', fontWeight: 600 }}>{dimWperp}</span></div>
          <div style={{ color: 'var(--text-tertiary)' }}>
            sum = {dimW + dimWperp} = dim(ℝ³) ✓
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">DECOMPOSITION</MonoLine>
            <div style={{ marginTop: 4, color: 'rgba(103, 169, 255, 0.95)' }}>
              w = ({fmt(w[0])}, {fmt(w[1])}, {fmt(w[2])})
            </div>
            <div style={{ color: 'rgba(255, 217, 102, 0.95)' }}>
              w⊥ = ({fmt(wPerp[0])}, {fmt(wPerp[1])}, {fmt(wPerp[2])})
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">CHECKS</MonoLine>
            <div style={{ color: perpOk ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)' }}>
              w · w⊥ = {wDotWperp.toFixed(4)} {perpOk && '✓'}
            </div>
            <div style={{ color: 'var(--text-tertiary)', marginTop: 4 }}>
              ‖v‖² = {vNormSq.toFixed(3)}
            </div>
            <div style={{ color: 'var(--text-tertiary)' }}>
              ‖w‖² + ‖w⊥‖² = {(wNormSq + wPerpNormSq).toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────── */}
      <div
        style={{
          marginTop: 12,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 14,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
        }}
      >
        {/* Subspace control */}
        <div>
          <MonoLine size={9} color="var(--text-tertiary)">SUBSPACE W</MonoLine>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <VizControlButton active={kind === 'line'} onClick={() => setKind('line')}>
              line (1D)
            </VizControlButton>
            <VizControlButton active={kind === 'plane'} onClick={() => setKind('plane')}>
              plane (2D)
            </VizControlButton>
          </div>
          <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
            {kind === 'line' ? 'line direction' : 'plane normal'}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {[0, 1, 2].map((i) => (
              <NumberCell
                key={i}
                label={['x', 'y', 'z'][i]}
                value={kind === 'line' ? lineDir[i] : planeNormal[i]}
                onChange={(val) =>
                  kind === 'line'
                    ? setVecEntry(setLineDir, lineDir, i, val)
                    : setVecEntry(setPlaneNormal, planeNormal, i, val)
                }
                step={0.2}
                min={-3}
                max={3}
                width={56}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
            {Object.entries(LINE_PRESETS).map(([name, vec]) => (
              <VizControlButton
                key={name}
                onClick={() => (kind === 'line' ? setLineDir([...vec] as Vec3) : setPlaneNormal([...vec] as Vec3))}
              >
                {name}
              </VizControlButton>
            ))}
          </div>
        </div>

        {/* Test vector control */}
        <div>
          <MonoLine size={9} color="var(--text-tertiary)">TEST VECTOR v</MonoLine>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {[0, 1, 2].map((i) => (
              <NumberCell
                key={i}
                label={['x', 'y', 'z'][i]}
                value={v[i]}
                onChange={(val) => setVecEntry(setV, v, i, val)}
                step={0.2}
                min={-3}
                max={3}
                width={56}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
            <VizControlButton onClick={() => setV([1.5, 1, 0.5])}>reset v</VizControlButton>
            <VizControlButton onClick={() => setV([...oneDimVec] as Vec3)}>v ∈ 1D part</VizControlButton>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 11,
              color: 'var(--text-tertiary)',
              marginTop: 8,
              lineHeight: 1.4,
            }}
          >
            v = w + w⊥ — same physical vector, decomposed into perpendicular pieces.
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 10,
          textAlign: 'center',
          fontSize: 12,
        }}
      >
        <InlineMath math={`\\mathbb{R}^3 = W \\oplus W^\\perp\\quad : \\quad ${dimW} + ${dimWperp} = 3`} />
      </div>
    </div>
  );
}

function fmt(n: number): string {
  if (Math.abs(n) < 0.005) return '0.00';
  return n.toFixed(2);
}

// ── 3D rendering helpers ───────────────────────────────────────────────────

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

function SubspaceLine({ v, color, thick }: { v: Vec3; color: string; thick?: boolean }) {
  const n = Math.hypot(v[0], v[1], v[2]);
  if (n < TOL) return null;
  const f = 3 / n;
  const [ax, ay] = isometricProject([v[0] * f, v[1] * f, v[2] * f], SCALE);
  const [bx, by] = isometricProject([-v[0] * f, -v[1] * f, -v[2] * f], SCALE);
  return (
    <line
      x1={CX + ax}
      y1={CY + ay}
      x2={CX + bx}
      y2={CY + by}
      stroke={color}
      strokeOpacity={0.55}
      strokeWidth={thick ? 4 : 2}
      strokeLinecap="round"
    />
  );
}

function SubspacePlane({
  normal,
  fill,
  stroke,
}: {
  normal: Vec3;
  fill: string;
  stroke: string;
}) {
  // Compute two basis vectors for the plane orthogonal to `normal`.
  const n = Math.hypot(normal[0], normal[1], normal[2]);
  if (n < TOL) return null;
  // Pick an arbitrary vector not parallel to normal
  const nNorm: Vec3 = [normal[0] / n, normal[1] / n, normal[2] / n];
  const pick: Vec3 = Math.abs(nNorm[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  // basis1 = pick - (pick · nNorm) nNorm
  const proj = pick[0] * nNorm[0] + pick[1] * nNorm[1] + pick[2] * nNorm[2];
  let b1: Vec3 = [pick[0] - proj * nNorm[0], pick[1] - proj * nNorm[1], pick[2] - proj * nNorm[2]];
  const b1n = Math.hypot(b1[0], b1[1], b1[2]);
  b1 = [b1[0] / b1n, b1[1] / b1n, b1[2] / b1n];
  // basis2 = nNorm × b1
  const b2: Vec3 = [
    nNorm[1] * b1[2] - nNorm[2] * b1[1],
    nNorm[2] * b1[0] - nNorm[0] * b1[2],
    nNorm[0] * b1[1] - nNorm[1] * b1[0],
  ];
  const ext = 2.4;
  const corners: Vec3[] = [
    [b1[0] * ext + b2[0] * ext, b1[1] * ext + b2[1] * ext, b1[2] * ext + b2[2] * ext],
    [b1[0] * ext - b2[0] * ext, b1[1] * ext - b2[1] * ext, b1[2] * ext - b2[2] * ext],
    [-b1[0] * ext - b2[0] * ext, -b1[1] * ext - b2[1] * ext, -b1[2] * ext - b2[2] * ext],
    [-b1[0] * ext + b2[0] * ext, -b1[1] * ext + b2[1] * ext, -b1[2] * ext + b2[2] * ext],
  ];
  const pts = corners.map((c) => isometricProject(c, SCALE));
  return (
    <polygon
      points={pts.map((p) => `${CX + p[0]},${CY + p[1]}`).join(' ')}
      fill={fill}
      stroke={stroke}
      strokeWidth={1.2}
    />
  );
}

function Arrow3D({
  v,
  color,
  label,
  bold,
  dashed,
}: {
  v: Vec3;
  color: string;
  label?: string;
  bold?: boolean;
  dashed?: boolean;
}) {
  const n = Math.hypot(v[0], v[1], v[2]);
  if (n < TOL) return null;
  const max = 2.6;
  const f = n > max ? max / n : 1;
  const [px, py] = isometricProject([v[0] * f, v[1] * f, v[2] * f], SCALE);
  const x2 = CX + px;
  const y2 = CY + py;
  const dx = x2 - CX;
  const dy = y2 - CY;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const ah = bold ? 8 : 6;
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
        strokeWidth={bold ? 2.6 : 1.8}
        strokeDasharray={dashed ? '5 5' : undefined}
      />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 4} y={y2 - 4} fontSize={bold ? 11 : 10} fontFamily="var(--font-mono)" fontStyle="italic" fill={color} fontWeight={bold ? 600 : 400}>
          {label}
        </text>
      )}
    </g>
  );
}

function ArrowFromTo({
  from,
  to,
  color,
  label,
  dashed,
}: {
  from: Vec3;
  to: Vec3;
  color: string;
  label?: string;
  dashed?: boolean;
}) {
  const [fx, fy] = isometricProject(from, SCALE);
  const [tx, ty] = isometricProject(to, SCALE);
  const x1 = CX + fx;
  const y1 = CY + fy;
  const x2 = CX + tx;
  const y2 = CY + ty;
  const dx = x2 - x1;
  const dy = y2 - y1;
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
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1.8}
        strokeDasharray={dashed ? '5 5' : undefined}
      />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 4} fontSize={10} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

function RightAngleGlyph({
  at,
  along,
  perpDir,
}: {
  at: Vec3;
  along: Vec3;
  perpDir: Vec3;
}) {
  const alongN = Math.hypot(along[0], along[1], along[2]);
  const perpN = Math.hypot(perpDir[0], perpDir[1], perpDir[2]);
  if (alongN < TOL || perpN < TOL) return null;
  const size = 0.22;
  const aHat: Vec3 = [(along[0] / alongN) * size, (along[1] / alongN) * size, (along[2] / alongN) * size];
  const pHat: Vec3 = [(perpDir[0] / perpN) * size, (perpDir[1] / perpN) * size, (perpDir[2] / perpN) * size];
  // Glyph in world space: at - aHat, at - aHat + pHat, at + pHat (a small L-shape pointing inward)
  // For visual, draw the standard corner: from "at" go back along (-aHat), then forward along (pHat)
  const p1: Vec3 = [at[0] - aHat[0], at[1] - aHat[1], at[2] - aHat[2]];
  const p2: Vec3 = [at[0] - aHat[0] + pHat[0], at[1] - aHat[1] + pHat[1], at[2] - aHat[2] + pHat[2]];
  const p3: Vec3 = [at[0] + pHat[0], at[1] + pHat[1], at[2] + pHat[2]];
  const [s1x, s1y] = isometricProject(p1, SCALE);
  const [s2x, s2y] = isometricProject(p2, SCALE);
  const [s3x, s3y] = isometricProject(p3, SCALE);
  return (
    <polyline
      points={`${CX + s1x},${CY + s1y} ${CX + s2x},${CY + s2y} ${CX + s3x},${CY + s3y}`}
      fill="none"
      stroke="rgba(111, 212, 154, 0.95)"
      strokeWidth={1.4}
    />
  );
}
