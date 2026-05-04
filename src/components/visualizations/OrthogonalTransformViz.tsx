// 5.6 — Orthogonal Transformation (interactive).
// Edit Q. Compute Q^T Q. Show unit circle and its image (which is the unit circle iff Q
// is orthogonal). Determinant classifies into rotation, reflection, or neither.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { type Mat2 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, NumberCell, VizControlButton } from './_shared';

const W = 460;
const H = 460;
const CX = W / 2;
const CY = H / 2;
const UNIT = 70;
const TOL = 1e-4;

const PRESETS: Record<string, Mat2> = {
  identity: [
    [1, 0],
    [0, 1],
  ],
  'rotation 30°': [
    [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6)],
    [Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)],
  ],
  'reflect y=x': [
    [0, 1],
    [1, 0],
  ],
  'shear (not orth)': [
    [1, 1],
    [0, 1],
  ],
  'scale (not orth)': [
    [2, 0],
    [0, 0.5],
  ],
};

function fmt(n: number): string {
  if (Math.abs(n) < 0.005) return '0.00';
  return n.toFixed(2);
}

function det2(M: Mat2): number {
  return M[0][0] * M[1][1] - M[0][1] * M[1][0];
}

function transposeTimes(Q: Mat2): Mat2 {
  // Q^T Q
  const a = Q[0][0];
  const b = Q[0][1];
  const c = Q[1][0];
  const d = Q[1][1];
  return [
    [a * a + c * c, a * b + c * d],
    [a * b + c * d, b * b + d * d],
  ];
}

function isIdentity(M: Mat2): boolean {
  return (
    Math.abs(M[0][0] - 1) < TOL &&
    Math.abs(M[1][1] - 1) < TOL &&
    Math.abs(M[0][1]) < TOL &&
    Math.abs(M[1][0]) < TOL
  );
}

export function OrthogonalTransformViz() {
  const [Q, setQ] = useState<Mat2>(PRESETS['rotation 30°'].map((r) => [...r]) as Mat2);

  const QtQ = useMemo(() => transposeTimes(Q), [Q]);
  const det = det2(Q);
  const isOrth = isIdentity(QtQ);
  const classification = !isOrth
    ? 'not orthogonal'
    : Math.abs(det - 1) < TOL
    ? 'rotation (det = +1)'
    : Math.abs(det + 1) < TOL
    ? 'reflection (det = −1)'
    : 'neither';

  const norm1 = Math.hypot(Q[0][0], Q[1][0]);
  const norm2 = Math.hypot(Q[0][1], Q[1][1]);

  const setEntry = (r: number, c: number, val: number) => {
    setQ((M) => {
      const next = M.map((row) => [...row]) as Mat2;
      next[r][c] = val;
      return next;
    });
  };

  // Sample the unit circle and its image
  const N_SAMPLES = 64;
  const inputCircle: [number, number][] = [];
  const outputCurve: [number, number][] = [];
  for (let i = 0; i <= N_SAMPLES; i++) {
    const a = (i / N_SAMPLES) * 2 * Math.PI;
    const x = Math.cos(a);
    const y = Math.sin(a);
    inputCircle.push([x, y]);
    outputCurve.push([Q[0][0] * x + Q[0][1] * y, Q[1][0] * x + Q[1][1] * y]);
  }

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 14, alignItems: 'start' }}>
        {/* ── Plane ────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 8,
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Input unit circle */}
            <polyline
              points={inputCircle.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1.4}
              strokeDasharray="3 4"
            />

            {/* Output curve */}
            <polyline
              points={outputCurve.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
              fill={isOrth ? 'none' : 'rgba(103,169,255,0.08)'}
              stroke="rgba(103,169,255,0.85)"
              strokeWidth={1.8}
            />

            {/* Direction marker on input (at angle 0) */}
            <circle cx={w2sX(1)} cy={w2sY(0)} r={3.5} fill="rgba(255,255,255,0.6)" />
            {/* Direction marker on output: image of (1, 0) = first column of Q */}
            <circle cx={w2sX(Q[0][0])} cy={w2sY(Q[1][0])} r={4} fill="rgba(103, 169, 255, 1)" />

            {/* Q e_1, Q e_2 as arrows */}
            <ColArrow to={[Q[0][0], Q[1][0]]} color="var(--viz-blue, #67a9ff)" label="Q e₁" />
            <ColArrow to={[Q[0][1], Q[1][1]]} color="var(--viz-yellow, #ffd966)" label="Q e₂" />
          </svg>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            dashed = unit circle · solid cyan = image under Q
          </div>
        </div>

        {/* ── Status ──────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            MATRIX Q
          </MonoLine>
          <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(2, auto)', gap: 4 }}>
            {Q.flatMap((row, r) =>
              row.map((cell, c) => (
                <NumberCell
                  key={`${r}-${c}`}
                  value={cell}
                  onChange={(v) => setEntry(r, c, v)}
                  step={0.1}
                  min={-3}
                  max={3}
                  width={56}
                />
              ))
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">
              Q⁻¹Q
            </MonoLine>
            <div style={{ marginTop: 4, fontSize: 12, textAlign: 'center' }}>
              <InlineMath
                math={`Q^T Q = \\begin{pmatrix} ${fmt(QtQ[0][0])} & ${fmt(QtQ[0][1])} \\\\ ${fmt(QtQ[1][0])} & ${fmt(QtQ[1][1])} \\end{pmatrix}`}
              />
            </div>
          </div>

          <div
            style={{
              padding: 8,
              background: isOrth ? 'rgba(111, 212, 154, 0.08)' : 'rgba(255, 123, 107, 0.06)',
              border: `1px solid ${isOrth ? 'rgba(111, 212, 154, 0.4)' : 'rgba(255, 123, 107, 0.4)'}`,
              borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
            }}
          >
            <div style={{ color: isOrth ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)', fontWeight: 600 }}>
              {isOrth ? '✓ orthogonal' : '✗ not orthogonal'}
            </div>
            <div style={{ marginTop: 4, color: 'var(--text-secondary)' }}>{classification}</div>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-tertiary)',
              lineHeight: 1.5,
            }}
          >
            det(Q) = {fmt(det)}
            <br />
            ‖Q e₁‖ = {fmt(norm1)} {Math.abs(norm1 - 1) < TOL && '✓'}
            <br />
            ‖Q e₂‖ = {fmt(norm2)} {Math.abs(norm2 - 1) < TOL && '✓'}
          </div>
        </div>
      </div>

      {/* ── Presets ───────────────────────────────────── */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(PRESETS).map(([name, mat]) => (
          <VizControlButton key={name} onClick={() => setQ(mat.map((r) => [...r]) as Mat2)}>
            {name}
          </VizControlButton>
        ))}
      </div>
    </div>
  );
}

function ColArrow({ to, color, label }: { to: [number, number]; color: string; label: string }) {
  const x2 = CX + to[0] * UNIT;
  const y2 = CY - to[1] * UNIT;
  const dx = x2 - CX;
  const dy = y2 - CY;
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
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={2.2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      <text x={x2 + 6} y={y2 - 6} fontSize={10} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>
        {label}
      </text>
    </g>
  );
}
