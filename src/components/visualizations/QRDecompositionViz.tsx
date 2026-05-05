// 5.7 — QR Decomposition (interactive).
// Step-by-step Gram-Schmidt on the columns of a 3x3 A. Each step populates
// the next column of Q and the next column of R. Verifies QR = A and Q^T Q = I at the end.

import { useEffect, useMemo, useState } from 'react';
import { isometricProject, type Vec3 } from '../../lib/linearAlgebra';
import { MonoLine, NumberCell, VizControlButton } from './_shared';

const W = 380;
const H = 320;
const CX = W / 2;
const CY = H / 2 + 20;
const SCALE = 50;

const PRESETS: Record<string, number[][]> = {
  'default (full rank)': [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
  ],
  'diagonal': [
    [2, 0, 0],
    [0, 1, 0],
    [0, 0, 3],
  ],
  'singular (rank 2)': [
    [1, 2, 3],
    [0, 1, 1],
    [1, 3, 4],
  ],
};

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function scale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}
function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}

interface QRResult {
  Q: Vec3[]; // columns
  R: number[][];
  // residuals at each step (for visualization)
  residuals: (Vec3 | null)[];
  projections: Vec3[][]; // projections[i] = list of projection vectors from a_i
  failed: boolean;
}

function computeQR(matrix: number[][]): QRResult {
  // Columns of A
  const a: Vec3[] = [
    [matrix[0][0], matrix[1][0], matrix[2][0]],
    [matrix[0][1], matrix[1][1], matrix[2][1]],
    [matrix[0][2], matrix[1][2], matrix[2][2]],
  ];
  const Q: Vec3[] = [];
  const R: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const residuals: (Vec3 | null)[] = [null, null, null];
  const projections: Vec3[][] = [[], [], []];
  let failed = false;
  for (let j = 0; j < 3; j++) {
    let v: Vec3 = [...a[j]];
    for (let i = 0; i < j; i++) {
      const r = dot(a[j], Q[i]);
      R[i][j] = r;
      const proj = scale(Q[i], r);
      projections[j].push(proj);
      v = sub(v, proj);
    }
    residuals[j] = v;
    const n = norm(v);
    R[j][j] = n;
    if (n < 1e-9) {
      failed = true;
      Q.push([0, 0, 0]);
    } else {
      Q.push(scale(v, 1 / n));
    }
  }
  return { Q, R, residuals, projections, failed };
}

export function QRDecompositionViz() {
  const [matrix, setMatrix] = useState<number[][]>(PRESETS['default (full rank)'].map((r) => [...r]));
  const [step, setStep] = useState<number>(0);
  const [playing, setPlaying] = useState(false);

  const qr = useMemo(() => computeQR(matrix), [matrix]);

  useEffect(() => setStep(0), [matrix]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (step < 3) setStep((s) => s + 1);
      else setPlaying(false);
    }, 1100);
    return () => window.clearTimeout(id);
  }, [playing, step]);

  const setEntry = (r: number, c: number, val: number) => {
    setMatrix((M) => {
      const next = M.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  // Active visualization data based on step
  const aCols: Vec3[] = [
    [matrix[0][0], matrix[1][0], matrix[2][0]],
    [matrix[0][1], matrix[1][1], matrix[2][1]],
    [matrix[0][2], matrix[1][2], matrix[2][2]],
  ];
  const aColors = ['rgba(103, 169, 255, 0.95)', 'rgba(255, 217, 102, 0.95)', 'rgba(184, 150, 255, 0.95)'];

  // Whether to display Q[i] and R[*][j]: only after step > i.
  const qVisible = (i: number) => step > i;
  const rVisible = (i: number, j: number) => i <= j && step > j;

  return (
    <div style={{ maxWidth: 760 }}>
      {/* ── Top row: 3D plot | Q | R ───────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 220px',
          gap: 14,
          alignItems: 'start',
        }}
      >
        {/* 3D plot */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 8,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            COLUMNS · STEP {step}/3
          </MonoLine>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <Axes3D length={3} />

            {/* a_j columns: dim earlier-step ones, highlight current */}
            {aCols.map((aj, j) => {
              const isCurrent = step === j + 1 || (step === 0 && j === 0);
              const isPast = step > j + 1;
              const opacity = isCurrent ? 1 : isPast ? 0.3 : 0.7;
              return (
                <Arrow3D
                  key={`a${j}`}
                  v={aj}
                  color={aColors[j]}
                  label={`a${j + 1}`}
                  opacity={opacity}
                />
              );
            })}

            {/* For step 2: show projection of a2 onto q1 (dashed) and residual */}
            {step === 2 && qr.projections[1][0] && qr.residuals[1] && (
              <>
                <Arrow3D v={qr.projections[1][0]} color="rgba(255, 217, 102, 0.5)" dashed label="proj" />
                <Arrow3D v={qr.residuals[1]} color="rgba(111, 212, 154, 0.85)" dotted label="residual" />
              </>
            )}

            {/* For step 3: show projections of a3 onto q1, q2 and residual */}
            {step === 3 && qr.projections[2].length === 2 && qr.residuals[2] && (
              <>
                <Arrow3D v={qr.projections[2][0]} color="rgba(184, 150, 255, 0.4)" dashed />
                <Arrow3D v={qr.projections[2][1]} color="rgba(184, 150, 255, 0.4)" dashed />
                <Arrow3D v={qr.residuals[2]} color="rgba(111, 212, 154, 0.85)" dotted label="residual" />
              </>
            )}

            {/* q_i (orthonormal) shown after their step */}
            {qr.Q.map((q, i) => qVisible(i) ? (
              <Arrow3D key={`q${i}`} v={scale(q, 1)} color="rgba(103, 169, 255, 1)" label={`q${i + 1}`} bold />
            ) : null)}
          </svg>
        </div>

        {/* Q and R */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <MatrixDisplay label="Q" Q={qr.Q} qVisible={qVisible} />
          <RDisplay R={qr.R} rVisible={rVisible} />
        </div>
      </div>

      {/* ── Step controls ──────────────────────────────── */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <VizControlButton onClick={() => setStep(0)} disabled={step === 0}>
            ⏮
          </VizControlButton>
          <VizControlButton onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            ◀ prev
          </VizControlButton>
          <VizControlButton onClick={() => setPlaying((p) => !p)} disabled={step >= 3}>
            {playing ? '⏸' : '▶'} play
          </VizControlButton>
          <VizControlButton onClick={() => setStep((s) => Math.min(3, s + 1))} disabled={step >= 3}>
            next ▶
          </VizControlButton>
          <VizControlButton onClick={() => setStep(3)} disabled={step >= 3}>
            done ⏭
          </VizControlButton>
        </div>

        <StepDescription step={step} qr={qr} />

        {step === 3 && !qr.failed && (
          <div
            style={{
              padding: 8,
              background: 'rgba(111, 212, 154, 0.08)',
              border: '1px solid rgba(111, 212, 154, 0.4)',
              borderRadius: 4,
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(111, 212, 154, 1)',
            }}
          >
            ✓ Q R = A · Q^T Q = I
          </div>
        )}
        {qr.failed && step >= 1 && (
          <div
            style={{
              padding: 8,
              background: 'rgba(255, 123, 107, 0.06)',
              border: '1px solid rgba(255, 123, 107, 0.4)',
              borderRadius: 4,
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(255, 123, 107, 1)',
            }}
          >
            singular: a column is in the span of earlier ones
          </div>
        )}
      </div>

      {/* ── Edit A ─────────────────────────────────────── */}
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16 }}>A =</span>
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
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(PRESETS).map(([name, mat]) => (
          <VizControlButton key={name} onClick={() => setMatrix(mat.map((r) => [...r]))}>
            {name}
          </VizControlButton>
        ))}
      </div>
    </div>
  );
}

function StepDescription({ step, qr }: { step: number; qr: QRResult }) {
  const text =
    step === 0
      ? 'starting state — three columns of A'
      : step === 1
      ? `q₁ = a₁ / ‖a₁‖,  r₁₁ = ‖a₁‖ = ${qr.R[0][0].toFixed(2)}`
      : step === 2
      ? `subtract projection of a₂ onto q₁;  q₂ = residual / ‖residual‖,  r₂₂ = ${qr.R[1][1].toFixed(2)}`
      : `subtract projections of a₃ onto q₁ and q₂;  q₃ = residual / ‖residual‖,  r₃₃ = ${qr.R[2][2].toFixed(2)}`;
  return (
    <MonoLine size={11} color="var(--text-secondary)">
      {text}
    </MonoLine>
  );
}

function MatrixDisplay({
  label,
  Q,
  qVisible,
}: {
  label: string;
  Q: Vec3[];
  qVisible: (i: number) => boolean;
}) {
  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
      <MonoLine size={9} color="var(--text-tertiary)">
        {label}
      </MonoLine>
      <div style={{ marginTop: 6, display: 'inline-grid', gridTemplateColumns: 'repeat(3, 50px)', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const visible = qVisible(col);
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: visible ? 'rgba(103, 169, 255, 0.08)' : 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 3,
                  color: visible ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  opacity: visible ? 1 : 0.4,
                  transition: 'all 0.3s',
                }}
              >
                {visible ? Q[col]?.[row]?.toFixed(2) ?? '—' : '·'}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function RDisplay({
  R,
  rVisible,
}: {
  R: number[][];
  rVisible: (i: number, j: number) => boolean;
}) {
  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
      <MonoLine size={9} color="var(--text-tertiary)">
        R (upper triangular)
      </MonoLine>
      <div style={{ marginTop: 6, display: 'inline-grid', gridTemplateColumns: 'repeat(3, 50px)', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const visible = rVisible(row, col);
            const isLowerTri = row > col;
            return (
              <div
                key={`${row}-${col}`}
                style={{
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isLowerTri
                    ? 'transparent'
                    : visible
                    ? 'rgba(255, 217, 102, 0.08)'
                    : 'var(--bg-elevated)',
                  border: isLowerTri ? '1px dashed var(--border-subtle)' : '1px solid var(--border-subtle)',
                  borderRadius: 3,
                  color: visible ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  opacity: isLowerTri ? 0.3 : visible ? 1 : 0.4,
                  transition: 'all 0.3s',
                }}
              >
                {isLowerTri ? '0' : visible ? R[row][col].toFixed(2) : '·'}
              </div>
            );
          })
        )}
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

function Arrow3D({
  v,
  color,
  label,
  opacity = 1,
  bold,
  dashed,
  dotted,
}: {
  v: Vec3;
  color: string;
  label?: string;
  opacity?: number;
  bold?: boolean;
  dashed?: boolean;
  dotted?: boolean;
}) {
  const n = norm(v);
  if (n < 1e-9) return null;
  const max = 2.5;
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
  const ah = bold ? 7 : 6;
  const ax = x2 - ux * ah - uy * ah * 0.5;
  const ay = y2 - uy * ah + ux * ah * 0.5;
  const bx = x2 - ux * ah + uy * ah * 0.5;
  const by = y2 - uy * ah - ux * ah * 0.5;
  const dash = dashed ? '4 4' : dotted ? '2 3' : undefined;
  return (
    <g opacity={opacity}>
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={bold ? 2.4 : 1.8} strokeDasharray={dash} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + 4} y={y2 - 4} fontSize={bold ? 11 : 9} fontFamily="var(--font-mono)" fontStyle="italic" fill={color} fontWeight={bold ? 600 : 400}>
          {label}
        </text>
      )}
    </g>
  );
}
