// 12.1 — Optimal Low-Rank (Eckart-Mirsky-Young). Image alongside its rank-k
// truncated-SVD reconstruction; scree plot with retained/discarded bars; live
// numerical verification of |A - A_k|_F^2 = Σ_{j>k} σ_j^2.

import { useMemo, useState } from 'react';
import { MatrixHeatmap } from './primitives/MatrixHeatmap';
import {
  frobeniusError,
  frobeniusNorm,
  makeCheckerboard,
  makeGradient,
  makeLowRank,
  makeNoise,
  makePortrait,
  svd,
  type Matrix,
} from './utils/lowRank';
import { MonoLine, VizControlButton } from './_shared';

type Source = 'portrait' | 'checkerboard' | 'gradient' | 'noise' | 'lowRankSynthetic';

function generate(source: Source): Matrix {
  const dim = 32;
  switch (source) {
    case 'portrait': return makePortrait(dim, dim);
    case 'checkerboard': return makeCheckerboard(dim, dim);
    case 'gradient': return makeGradient(dim, dim);
    case 'noise': return makeNoise(dim, dim, 7);
    case 'lowRankSynthetic': return makeLowRank(dim, dim, 5, 0.02, 11);
  }
}

function residual(A: Matrix, B: Matrix): Matrix {
  const m = A.length, n = A[0].length;
  const R: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) R[i][j] = A[i][j] - B[i][j];
  return R;
}

// Build A_k from precomputed SVD factors. Avoids recomputing SVD on every slider tick.
function rankK(U: Matrix, sigma: number[], V: Matrix, k: number, m: number, n: number): Matrix {
  const r = Math.min(k, sigma.length);
  const Ak: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let p = 0; p < r; p++) {
    const s = sigma[p];
    if (s < 1e-12) break;
    for (let i = 0; i < m; i++) {
      const ui = U[i][p];
      if (ui === 0) continue;
      for (let j = 0; j < n; j++) Ak[i][j] += s * ui * V[j][p];
    }
  }
  return Ak;
}

export function EckartMirskyYoungViz() {
  const [source, setSource] = useState<Source>('portrait');
  const [k, setK] = useState(4);
  const [showResidual, setShowResidual] = useState(false);

  const A = useMemo(() => generate(source), [source]);
  const factors = useMemo(() => svd(A), [A]);
  const sigma = factors.sigma;
  const m = A.length, n = A[0].length;
  const Ak = useMemo(() => rankK(factors.U, sigma, factors.V, k, m, n), [factors, sigma, k, m, n]);
  const Aresid = useMemo(() => residual(A, Ak), [A, Ak]);

  const totalEnergy = sigma.reduce((s, v) => s + v * v, 0);
  const capturedEnergy = sigma.slice(0, k).reduce((s, v) => s + v * v, 0);
  const discardedEnergy = totalEnergy - capturedEnergy;
  const directError = frobeniusError(A, Ak);
  const errorFromSpectrum = Math.sqrt(Math.max(0, discardedEnergy));
  const aNorm = frobeniusNorm(A);
  const relError = aNorm > 1e-12 ? (directError / aNorm) * 100 : 0;
  const capturedPct = totalEnergy > 1e-12 ? (capturedEnergy / totalEnergy) * 100 : 100;

  const trueRank = sigma.filter((v) => v > 1e-10 * (sigma[0] || 1)).length;

  // Scree plot
  const SW = 280, SH = 160;
  const sigmaMax = Math.max(...sigma, 1);
  const barCount = Math.min(sigma.length, 24);
  const barW = (SW - 20) / barCount;

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: 14, alignItems: 'start' }}>
        {/* Original */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">ORIGINAL (rank = {trueRank})</MonoLine>
          <MatrixHeatmap matrix={A} width={260} height={260} />
        </div>

        {/* Reconstruction or residual */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">{showResidual ? `RESIDUAL A − A_k` : `RANK-k RECONSTRUCTION (k = ${k})`}</MonoLine>
          <MatrixHeatmap
            matrix={showResidual ? Aresid : Ak}
            width={260}
            height={260}
            mode={showResidual ? 'diverging' : 'grayscale'}
          />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SINGULAR VALUES</MonoLine>
            <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" style={{ display: 'block', marginTop: 4 }}>
              {sigma.slice(0, barCount).map((s, i) => {
                const h = (s / sigmaMax) * (SH - 30);
                const color = i < k ? 'var(--viz-blue, #67a9ff)' : 'var(--viz-red, #ff7b6b)';
                return (
                  <g key={i}>
                    <rect x={10 + i * barW} y={SH - 20 - h} width={Math.max(1, barW - 1)} height={h} fill={color} />
                  </g>
                );
              })}
              {/* Divider */}
              <line x1={10 + k * barW} y1={6} x2={10 + k * barW} y2={SH - 20} stroke="var(--viz-yellow, #ffd966)" strokeWidth={1.2} strokeDasharray="3 3" />
              {/* x-axis */}
              <line x1={10} y1={SH - 20} x2={SW - 10} y2={SH - 20} stroke="var(--viz-axis, #555)" strokeWidth={0.8} />
              <text x={10 + k * barW} y={SH - 4} fontSize={9} fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--viz-yellow, #ffd966)">k = {k}</text>
            </svg>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <MonoLine size={9} color="var(--text-tertiary)">ECKART-YOUNG ERROR</MonoLine>
            <div style={{ marginTop: 6 }}>‖A − A_k‖_F = <span style={{ color: 'var(--viz-blue, #67a9ff)' }}>{directError.toFixed(3)}</span></div>
            <div>√Σ<sub>j&gt;k</sub> σ_j² = <span style={{ color: 'var(--viz-green, #6fd49a)' }}>{errorFromSpectrum.toFixed(3)}</span></div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>(equal up to roundoff)</div>
            <div style={{ marginTop: 6, borderTop: '1px solid var(--border-subtle)', paddingTop: 6 }}>
              relative error: {relError.toFixed(1)}%<br />
              captured energy: {capturedPct.toFixed(1)}%
            </div>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <label style={{ display: 'block' }}>
              rank k = {k}
              <input type="range" min={1} max={Math.min(m, n)} step={1} value={k} onChange={(e) => setK(parseInt(e.target.value))} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <input type="checkbox" checked={showResidual} onChange={(e) => setShowResidual(e.target.checked)} /> show residual
            </label>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(['portrait', 'checkerboard', 'gradient', 'noise', 'lowRankSynthetic'] as Source[]).map((s) => (
              <VizControlButton key={s} onClick={() => { setSource(s); setK(4); }}>
                {source === s ? '✓ ' : ''}{s}
              </VizControlButton>
            ))}
            <VizControlButton onClick={() => { setK(1); setShowResidual(false); }}>reset</VizControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}
