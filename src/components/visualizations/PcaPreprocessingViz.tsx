// 11.4 — PCA Preprocessing. Covariance PCA vs Correlation PCA on the same cloud
// while one feature is rescaled. Covariance PC1 tilts; correlation PC1 stays put.

import { useMemo, useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Point = { x: number; y: number };

const W = 350;
const H = 350;
const CX = W / 2;
const CY = H / 2;
const UNIT = 30;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(rng: () => number): number {
  return Math.sqrt(-2 * Math.log(Math.max(1e-12, rng()))) * Math.cos(2 * Math.PI * rng());
}

function makeBaseCloud(seed = 11): Point[] {
  const rng = mulberry32(seed);
  const c = Math.cos(Math.PI / 4), s = Math.sin(Math.PI / 4);
  return Array.from({ length: 80 }, () => {
    const x0 = gauss(rng) * 1.6;
    const y0 = gauss(rng) * 0.6;
    return { x: c * x0 - s * y0, y: s * x0 + c * y0 };
  });
}

function pca(pts: Point[]): { lambda1: number; lambda2: number; q1: Point; q2: Point } {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  const sxx = pts.reduce((s, p) => s + (p.x - mx) ** 2, 0) / (n - 1);
  const syy = pts.reduce((s, p) => s + (p.y - my) ** 2, 0) / (n - 1);
  const sxy = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / (n - 1);
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = (tr + Math.sqrt(disc)) / 2;
  const lambda2 = Math.max(0, (tr - Math.sqrt(disc)) / 2);
  let q1: Point;
  if (Math.abs(sxy) > 1e-10) q1 = { x: lambda1 - syy, y: sxy };
  else q1 = sxx >= syy ? { x: 1, y: 0 } : { x: 0, y: 1 };
  const nrm = Math.hypot(q1.x, q1.y) || 1;
  q1 = { x: q1.x / nrm, y: q1.y / nrm };
  const q2: Point = { x: -q1.y, y: q1.x };
  return { lambda1, lambda2, q1, q2 };
}

export function PcaPreprocessingViz() {
  const [logScale, setLogScale] = useState(0); // log10 of scale, slider -1 to 2
  const scaleX = Math.pow(10, logScale);
  const basePts = useMemo(() => makeBaseCloud(), []);

  // Covariance: rescaled raw cloud
  const covPts = basePts.map((p) => ({ x: p.x * scaleX, y: p.y }));
  const covPca = pca(covPts);

  // Correlation: standardize each column
  const stdX = Math.sqrt(covPts.reduce((s, p) => s + p.x * p.x, 0) / (covPts.length - 1));
  const stdY = Math.sqrt(covPts.reduce((s, p) => s + p.y * p.y, 0) / (covPts.length - 1));
  const corrPts = covPts.map((p) => ({ x: p.x / (stdX || 1), y: p.y / (stdY || 1) }));
  const corrPca = pca(corrPts);

  const renderCanvas = (title: string, pts: Point[], result: ReturnType<typeof pca>) => {
    // Compute display scale so cloud fits canvas
    const maxR = Math.max(...pts.map((p) => Math.hypot(p.x, p.y)), 0.1);
    const dispScale = Math.min((W / 2 - 30) / (maxR * UNIT), 1);
    const w2sX = (x: number) => CX + x * UNIT * dispScale;
    const w2sY = (y: number) => CY - y * UNIT * dispScale;
    const explained = (result.lambda1 / (result.lambda1 + result.lambda2)) * 100;
    return (
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
        <MonoLine size={9} color="var(--text-tertiary)">{title}</MonoLine>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
          <GridAxes width={W} height={H} unit={UNIT * dispScale} />
          {pts.map((p, i) => (
            <circle key={i} cx={w2sX(p.x)} cy={w2sY(p.y)} r={2.2} fill="var(--viz-purple, #b896ff)" fillOpacity={0.7} />
          ))}
          <line x1={CX} y1={CY} x2={w2sX(result.q1.x * Math.sqrt(result.lambda1))} y2={w2sY(result.q1.y * Math.sqrt(result.lambda1))} stroke="var(--viz-blue, #67a9ff)" strokeWidth={2.4} />
          <line x1={CX} y1={CY} x2={w2sX(result.q2.x * Math.sqrt(result.lambda2))} y2={w2sY(result.q2.y * Math.sqrt(result.lambda2))} stroke="var(--viz-yellow, #ffd966)" strokeWidth={2} />
        </svg>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: 4, color: 'var(--text-secondary)' }}>
          λ₁ = {result.lambda1.toFixed(3)}, λ₂ = {result.lambda2.toFixed(3)}<br />
          PC₁ explains {explained.toFixed(1)}%
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        <label style={{ display: 'block' }}>
          scale on feature 1 = ×{scaleX.toFixed(2)} (log scale)
          <input type="range" min={-1} max={2} step={0.05} value={logScale} onChange={(e) => setLogScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </label>
        <VizControlButton onClick={() => setLogScale(0)}>reset scale = 1</VizControlButton>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {renderCanvas('COVARIANCE PCA (raw scale)', covPts, covPca)}
        {renderCanvas('CORRELATION PCA (standardized)', corrPts, corrPca)}
      </div>
      <div style={{ marginTop: 10, padding: 10, background: 'rgba(255, 217, 102, 0.08)', border: '1px solid rgba(255, 217, 102, 0.3)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        Drag the scale slider: covariance PC₁ tilts toward the rescaled feature; correlation PC₁ is invariant.
      </div>
    </div>
  );
}
