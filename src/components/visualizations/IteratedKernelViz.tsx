// 8.4 — Iterated Kernel / Finding Jordan Form (interactive walkthrough).
// Preset 3x3 matrices; reveals characteristic poly, eigenvalues, kernel chain,
// and resulting Jordan form step by step.

import { useState } from 'react';
import { MonoLine, VizControlButton } from './_shared';

type Mat3 = number[][];

type Preset = {
  name: string;
  label: string;
  A: Mat3;
  charPoly: string;
  eigenvalues: { lambda: number; alg: number }[];
  kernelChain: { lambda: number; dims: number[] }[];
  jordanBlocks: { lambda: number; size: number }[];
};

const PRESETS: Record<string, Preset> = {
  diagonalizable: {
    name: 'diagonalizable',
    label: 'Diagonalizable (distinct λ)',
    A: [[1, 0, 0], [0, 2, 0], [0, 0, 3]],
    charPoly: '-(λ-1)(λ-2)(λ-3)',
    eigenvalues: [{ lambda: 1, alg: 1 }, { lambda: 2, alg: 1 }, { lambda: 3, alg: 1 }],
    kernelChain: [
      { lambda: 1, dims: [1, 1] },
      { lambda: 2, dims: [1, 1] },
      { lambda: 3, dims: [1, 1] },
    ],
    jordanBlocks: [
      { lambda: 1, size: 1 },
      { lambda: 2, size: 1 },
      { lambda: 3, size: 1 },
    ],
  },
  oneJordanBlock: {
    name: 'oneJordanBlock',
    label: 'One Jordan block (size 3)',
    A: [[1, 1, 0], [0, 1, 1], [0, 0, 1]],
    charPoly: '-(λ-1)³',
    eigenvalues: [{ lambda: 1, alg: 3 }],
    kernelChain: [{ lambda: 1, dims: [1, 2, 3] }],
    jordanBlocks: [{ lambda: 1, size: 3 }],
  },
  twoBlocksSameEigenvalue: {
    name: 'twoBlocksSameEigenvalue',
    label: 'Two blocks at λ = 2 (sizes 2,1)',
    A: [[2, 1, 0], [0, 2, 0], [0, 0, 2]],
    charPoly: '-(λ-2)³',
    eigenvalues: [{ lambda: 2, alg: 3 }],
    kernelChain: [{ lambda: 2, dims: [2, 3, 3] }],
    jordanBlocks: [{ lambda: 2, size: 2 }, { lambda: 2, size: 1 }],
  },
};

export function IteratedKernelViz() {
  const [preset, setPreset] = useState<keyof typeof PRESETS>('oneJordanBlock');
  const [step, setStep] = useState(0); // 0..5

  const p = PRESETS[preset];

  const setP = (name: keyof typeof PRESETS) => {
    setPreset(name);
    setStep(0);
  };

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((k) => (
          <VizControlButton key={k} onClick={() => setP(k)}>
            {PRESETS[k].label}
          </VizControlButton>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Step 0: matrix */}
        <Panel title="STEP 1 · Matrix A">
          <MatrixDisplay M={p.A} />
        </Panel>

        {/* Step 1: characteristic polynomial */}
        {step >= 1 && (
          <Panel title="STEP 2 · Characteristic polynomial p(λ) = det(A − λI)">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--viz-yellow, #ffd966)' }}>p(λ) = {p.charPoly}</div>
          </Panel>
        )}

        {/* Step 2: eigenvalues */}
        {step >= 2 && (
          <Panel title="STEP 3 · Eigenvalues with algebraic multiplicity">
            {p.eigenvalues.map((e, i) => (
              <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                λ = <span style={{ color: 'var(--viz-blue, #67a9ff)' }}>{e.lambda}</span>, alg mult = {e.alg}
              </div>
            ))}
          </Panel>
        )}

        {/* Step 3: kernel chain dimensions */}
        {step >= 3 && (
          <Panel title="STEP 4 · Iterated kernel dimensions dim ker(A − λI)ᵏ">
            {p.kernelChain.map((c, i) => (
              <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 4 }}>
                λ = {c.lambda}:&nbsp;
                {c.dims.map((d, k) => (
                  <span key={k} style={{ marginRight: 8 }}>
                    dim ker(A − λI)<sup>{k + 1}</sup> = <span style={{ color: 'var(--viz-green, #6fd49a)' }}>{d}</span>
                  </span>
                ))}
              </div>
            ))}
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6 }}>
              # blocks of size ≥ k = (dim grows from k-1 to k). Geometric mult = dim at k=1.
            </div>
          </Panel>
        )}

        {/* Step 4: Jordan blocks */}
        {step >= 4 && (
          <Panel title="STEP 5 · Jordan block sizes">
            {p.jordanBlocks.map((b, i) => (
              <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                λ = {b.lambda}: block size {b.size}
              </div>
            ))}
          </Panel>
        )}

        {/* Step 5: Jordan form matrix */}
        {step >= 5 && (
          <Panel title="STEP 6 · Jordan form J = P⁻¹AP">
            <JordanMatrix blocks={p.jordanBlocks} />
          </Panel>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <VizControlButton onClick={() => setStep((s) => Math.max(0, s - 1))}>← back</VizControlButton>
          <VizControlButton onClick={() => setStep((s) => Math.min(5, s + 1))}>next step →</VizControlButton>
          <VizControlButton onClick={() => setStep(0)}>reset</VizControlButton>
        </div>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
          step {step} / 5
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
      <MonoLine size={9} color="var(--text-tertiary)">{title}</MonoLine>
      <div style={{ marginTop: 8 }}>{children}</div>
    </div>
  );
}

function MatrixDisplay({ M }: { M: number[][] }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, display: 'inline-block' }}>
      {M.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 12 }}>
          {row.map((v, j) => (
            <span key={j} style={{ width: 28, textAlign: 'right', color: v === 0 ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function JordanMatrix({ blocks }: { blocks: { lambda: number; size: number }[] }) {
  const n = blocks.reduce((a, b) => a + b.size, 0);
  const M: (string | number)[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
  let offset = 0;
  for (const b of blocks) {
    for (let i = 0; i < b.size; i++) {
      M[offset + i][offset + i] = b.lambda;
      if (i < b.size - 1) M[offset + i][offset + i + 1] = 1;
    }
    offset += b.size;
  }
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, display: 'inline-block' }}>
      {M.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 12 }}>
          {row.map((v, j) => (
            <span key={j} style={{ width: 28, textAlign: 'right', color: v === 0 ? 'var(--text-tertiary)' : (v === 1 ? 'var(--viz-yellow, #ffd966)' : 'var(--viz-blue, #67a9ff)'), fontWeight: v === 0 ? 400 : 600 }}>
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
