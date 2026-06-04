// 12.2 — Low-Rank in Practice. Storage comparison: dense mn vs factored
// k(m+n+1); break-even rank k* = mn / (m+n+1).

import { useMemo, useState } from 'react';
import { MatrixHeatmap } from './primitives/MatrixHeatmap';
import {
  frobeniusError,
  frobeniusNorm,
  makeLowRank,
  makeNoise,
  makePortrait,
  svd,
  type Matrix,
} from './utils/lowRank';
import { MonoLine, VizControlButton } from './_shared';

type Source = 'portrait' | 'satellite' | 'lowRankSynthetic' | 'textPattern';

function generate(source: Source, m: number, n: number): Matrix {
  switch (source) {
    case 'portrait': return makePortrait(m, n);
    case 'satellite': return makeNoise(m, n, 13);
    case 'lowRankSynthetic': return makeLowRank(m, n, 4, 0.01, 17);
    case 'textPattern': {
      // Sharp banded pattern: vertical and horizontal stripes
      const A: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
        A[i][j] = ((i % 5 === 0) || (j % 4 === 0)) ? 0.85 : 0.15;
      }
      return A;
    }
  }
}

function rankK(U: Matrix, sigma: number[], V: Matrix, k: number): Matrix {
  const m = U.length, n = V.length;
  const Ak: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const r = Math.min(k, sigma.length);
  for (let p = 0; p < r; p++) {
    const s = sigma[p];
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) Ak[i][j] += s * U[i][p] * V[j][p];
  }
  return Ak;
}

export function LowRankInPracticeViz() {
  const [source, setSource] = useState<Source>('portrait');
  const [dim, setDim] = useState(32);
  const [k, setK] = useState(4);
  const [showGhost, setShowGhost] = useState(false);

  const m = dim, n = dim;
  const A = useMemo(() => generate(source, m, n), [source, m, n]);
  const factors = useMemo(() => svd(A), [A]);
  const Ak = useMemo(() => rankK(factors.U, factors.sigma, factors.V, k), [factors, k]);

  const dense = m * n;
  const factored = k * (m + n + 1);
  const breakEven = dense / (m + n + 1);
  const compression = factored > 0 ? dense / factored : 0;
  const aNorm = frobeniusNorm(A);
  const err = frobeniusError(A, Ak);
  const relErr = aNorm > 1e-12 ? (err / aNorm) * 100 : 0;
  // PSNR-style (heuristic) using [min, max] range
  let mn = Infinity, mx = -Infinity;
  for (const row of A) for (const v of row) { if (v < mn) mn = v; if (v > mx) mx = v; }
  const range = mx - mn || 1;
  const mse = (err * err) / (m * n);
  const psnr = mse > 1e-12 ? 20 * Math.log10(range / Math.sqrt(mse)) : 99;

  const isOverBreakEven = k > breakEven;

  // Storage bar
  const SW = 320, SH = 100;
  const maxBar = Math.max(dense, factored, 1);
  const denseBarW = (dense / maxBar) * (SW - 80);
  const factoredBarW = Math.min((factored / maxBar) * (SW - 80), SW - 80);

  // Storage-vs-rank line plot
  const PW = 320, PH = 140;
  const minDim = Math.min(m, n);
  const lineX = (kk: number) => 10 + (kk / minDim) * (PW - 20);
  const maxY = Math.max(dense, minDim * (m + n + 1));
  const lineY = (v: number) => PH - 14 - (v / maxY) * (PH - 24);

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">RANK-{k} RECONSTRUCTION</MonoLine>
          <div style={{ position: 'relative' }}>
            {showGhost && (
              <div style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }}>
                <MatrixHeatmap matrix={A} width={300} height={300} />
              </div>
            )}
            <MatrixHeatmap matrix={Ak} width={300} height={300} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">STORAGE</MonoLine>
            <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" style={{ display: 'block', marginTop: 4 }}>
              <text x={4} y={26} fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">dense</text>
              <rect x={70} y={14} width={denseBarW} height={20} fill="var(--viz-red, #ff7b6b)" />
              <text x={4} y={66} fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">rank-k</text>
              <rect x={70} y={54} width={factoredBarW} height={20} fill={isOverBreakEven ? 'var(--viz-red, #ff7b6b)' : 'var(--viz-blue, #67a9ff)'} />
              <text x={72 + denseBarW} y={28} fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-secondary)">{dense}</text>
              <text x={72 + factoredBarW} y={68} fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-secondary)">{factored}</text>
            </svg>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <div>compression: <span style={{ color: isOverBreakEven ? 'var(--viz-red, #ff7b6b)' : 'var(--viz-blue, #67a9ff)', fontWeight: 700 }}>{compression.toFixed(2)}×</span> {isOverBreakEven && '(no longer compressing)'}</div>
            <div style={{ marginTop: 4 }}>break-even k* = {breakEven.toFixed(1)}</div>
            <div style={{ marginTop: 4 }}>relative error: {relErr.toFixed(1)}%</div>
            <div>PSNR (heuristic): {psnr.toFixed(1)} dB</div>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">STORAGE VS RANK</MonoLine>
            <svg viewBox={`0 0 ${PW} ${PH}`} width="100%" style={{ display: 'block', marginTop: 4 }}>
              {/* Dense flat line */}
              <line x1={lineX(0)} y1={lineY(dense)} x2={lineX(minDim)} y2={lineY(dense)} stroke="var(--viz-red, #ff7b6b)" strokeWidth={1.5} />
              {/* Factored linear line */}
              <line x1={lineX(0)} y1={lineY(0)} x2={lineX(minDim)} y2={lineY(minDim * (m + n + 1))} stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.5} />
              {/* Break-even vertical */}
              <line x1={lineX(breakEven)} y1={6} x2={lineX(breakEven)} y2={PH - 14} stroke="var(--viz-yellow, #ffd966)" strokeWidth={1} strokeDasharray="3 3" />
              <text x={lineX(breakEven) + 4} y={20} fontSize={9} fontFamily="var(--font-mono)" fill="var(--viz-yellow, #ffd966)">k* = {breakEven.toFixed(1)}</text>
              {/* Current-k dot */}
              <circle cx={lineX(k)} cy={lineY(factored)} r={5} fill="var(--viz-purple, #b896ff)" />
              {/* X-axis */}
              <line x1={10} y1={PH - 14} x2={PW - 10} y2={PH - 14} stroke="var(--viz-axis, #555)" strokeWidth={0.6} />
              <text x={PW - 6} y={PH - 2} textAnchor="end" fontSize={8} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">k</text>
            </svg>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <label style={{ display: 'block' }}>
              rank k = {k}
              <input type="range" min={1} max={minDim} step={1} value={k} onChange={(e) => setK(parseInt(e.target.value))} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginTop: 6 }}>
              size m = n = {dim}
              <input type="range" min={16} max={64} step={4} value={dim} onChange={(e) => { setDim(parseInt(e.target.value)); setK(Math.min(k, parseInt(e.target.value))); }} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <input type="checkbox" checked={showGhost} onChange={(e) => setShowGhost(e.target.checked)} /> show ghost original
            </label>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(['portrait', 'satellite', 'lowRankSynthetic', 'textPattern'] as Source[]).map((s) => (
              <VizControlButton key={s} onClick={() => { setSource(s); setK(4); }}>
                {source === s ? '✓ ' : ''}{s}
              </VizControlButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
