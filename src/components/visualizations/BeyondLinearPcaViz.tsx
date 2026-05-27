// 11.6 — Beyond Linear PCA. Preset nonlinear datasets (parabola, circle,
// two concentric circles). Linear PC1 vs colored-by-kernel-PC1.

import { useMemo, useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Point = { x: number; y: number };

const W = 350;
const H = 350;
const CX = W / 2;
const CY = H / 2;
const UNIT = 70;

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

type Dataset = 'parabola' | 'circle' | 'twoCircles' | 'linear';

function generate(ds: Dataset, noise: number, seed: number): Point[] {
  const rng = mulberry32(seed);
  const n = 60;
  switch (ds) {
    case 'parabola':
      return Array.from({ length: n }, (_, i) => {
        const x = (i / (n - 1)) * 2 - 1;
        return { x, y: x * x - 1 / 3 + (rng() - 0.5) * noise };
      });
    case 'circle':
      return Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 2 * Math.PI;
        return { x: Math.cos(a) + (rng() - 0.5) * noise, y: Math.sin(a) + (rng() - 0.5) * noise };
      });
    case 'twoCircles': {
      const arr: Point[] = [];
      for (let i = 0; i < n / 2; i++) {
        const a = (i / (n / 2)) * 2 * Math.PI;
        arr.push({ x: Math.cos(a) + (rng() - 0.5) * noise, y: Math.sin(a) + (rng() - 0.5) * noise });
        arr.push({ x: 0.4 * Math.cos(a) + (rng() - 0.5) * noise, y: 0.4 * Math.sin(a) + (rng() - 0.5) * noise });
      }
      return arr;
    }
    case 'linear':
      return Array.from({ length: n }, (_, i) => {
        const t = (i / (n - 1)) * 2 - 1;
        return { x: t * 1.2, y: t * 0.6 + (rng() - 0.5) * noise };
      });
  }
}

function pca(pts: Point[]): { lambda1: number; lambda2: number; q1: Point } {
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
  return { lambda1, lambda2, q1: { x: q1.x / nrm, y: q1.y / nrm } };
}

// Polynomial-2 kernel feature map: phi(x,y) = (x, y, x^2, y^2, xy).
// We do PCA on the lifted 5D feature space.
function kernelPca(pts: Point[]): number[] {
  // Build feature matrix (n x 5), center, compute eigenvector of top component
  const phi = pts.map((p) => [p.x, p.y, p.x * p.x, p.y * p.y, p.x * p.y]);
  const n = phi.length;
  const d = 5;
  // Column means
  const means = new Array(d).fill(0);
  for (const row of phi) for (let j = 0; j < d; j++) means[j] += row[j] / n;
  const c = phi.map((row) => row.map((v, j) => v - means[j]));
  // Σ = (1/(n-1)) C^T C (5x5)
  const S: number[][] = Array.from({ length: d }, () => new Array(d).fill(0));
  for (const row of c)
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) S[i][j] += (row[i] * row[j]) / (n - 1);
  // Power iteration for top eigenvector
  let v: number[] = new Array(d).fill(0).map((_, i) => (i === 0 ? 1 : 0.1));
  for (let it = 0; it < 80; it++) {
    const u = new Array(d).fill(0);
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) u[i] += S[i][j] * v[j];
    const norm = Math.hypot(...u) || 1;
    v = u.map((x) => x / norm);
  }
  // Score each point
  return c.map((row) => row.reduce((s, x, j) => s + x * v[j], 0));
}

export function BeyondLinearPcaViz() {
  const [dataset, setDataset] = useState<Dataset>('circle');
  const [noise, setNoise] = useState(0.03);
  const [seed, setSeed] = useState(7);
  const pts = useMemo(() => generate(dataset, noise, seed), [dataset, noise, seed]);
  const { lambda1, lambda2, q1 } = pca(pts);
  const kernelScores = useMemo(() => kernelPca(pts), [pts]);
  const ksMin = Math.min(...kernelScores);
  const ksMax = Math.max(...kernelScores);
  const ksRange = ksMax - ksMin || 1;

  // Display fit
  const maxR = Math.max(...pts.map((p) => Math.hypot(p.x, p.y)), 1);
  const dispScale = Math.min(150 / (maxR * UNIT), 1);
  const w2sX = (x: number) => CX + x * UNIT * dispScale;
  const w2sY = (y: number) => CY - y * UNIT * dispScale;

  const linExplained = ((lambda1 / (lambda1 + lambda2)) * 100).toFixed(1);
  // Kernel "explained" approx: variance of kernel scores vs initial trace
  const kernelVar = kernelScores.reduce((s, v) => s + v * v, 0) / (kernelScores.length - 1);

  const colorFor = (i: number) => {
    const t = (kernelScores[i] - ksMin) / ksRange;
    // viridis-ish: blue to yellow
    const r = Math.round(60 + (255 - 60) * t);
    const g = Math.round(100 + (210 - 100) * t);
    const b = Math.round(220 - 180 * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Linear PC1 score histogram
  const linScores = pts.map((p) => p.x * q1.x + p.y * q1.y);
  const hist = (vals: number[], bins = 16) => {
    const mn = Math.min(...vals), mx = Math.max(...vals);
    const rng = mx - mn || 1;
    const h = new Array(bins).fill(0);
    vals.forEach((v) => {
      const b = Math.min(bins - 1, Math.floor(((v - mn) / rng) * bins));
      h[b]++;
    });
    return h;
  };
  const h1 = hist(linScores);
  const h2 = hist(kernelScores);
  const maxBin = Math.max(...h1, ...h2, 1);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(['parabola', 'circle', 'twoCircles', 'linear'] as Dataset[]).map((d) => (
            <VizControlButton key={d} onClick={() => setDataset(d)}>{dataset === d ? '✓ ' : ''}{d}</VizControlButton>
          ))}
          <VizControlButton onClick={() => setSeed((s) => s + 1)}>resample</VizControlButton>
        </div>
        <label style={{ display: 'block', marginTop: 6 }}>
          noise = {noise.toFixed(2)}
          <input type="range" min={0} max={0.3} step={0.01} value={noise} onChange={(e) => setNoise(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">LINEAR PCA</MonoLine>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT * dispScale} />
            {pts.map((p, i) => (
              <circle key={i} cx={w2sX(p.x)} cy={w2sY(p.y)} r={3} fill="var(--viz-purple, #b896ff)" fillOpacity={0.7} />
            ))}
            <line x1={w2sX(-q1.x * 3)} y1={w2sY(-q1.y * 3)} x2={w2sX(q1.x * 3)} y2={w2sY(q1.y * 3)} stroke="var(--viz-blue, #67a9ff)" strokeWidth={2} />
          </svg>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: 4, color: 'var(--text-secondary)' }}>
            PC₁ explains {linExplained}% of variance
          </div>
          <svg viewBox={`0 0 ${h1.length * 12} 40`} width="100%" style={{ display: 'block', marginTop: 4 }}>
            {h1.map((v, i) => (
              <rect key={i} x={i * 12} y={40 - (v / maxBin) * 35} width={10} height={(v / maxBin) * 35} fill="var(--viz-blue, #67a9ff)" />
            ))}
          </svg>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">KERNEL PCA (polynomial p=2)</MonoLine>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT * dispScale} />
            {pts.map((p, i) => (
              <circle key={i} cx={w2sX(p.x)} cy={w2sY(p.y)} r={4} fill={colorFor(i)} />
            ))}
          </svg>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: 4, color: 'var(--text-secondary)' }}>
            kernel PC₁ variance = {kernelVar.toFixed(3)} (colors = kernel scores)
          </div>
          <svg viewBox={`0 0 ${h2.length * 12} 40`} width="100%" style={{ display: 'block', marginTop: 4 }}>
            {h2.map((v, i) => (
              <rect key={i} x={i * 12} y={40 - (v / maxBin) * 35} width={10} height={(v / maxBin) * 35} fill="var(--viz-yellow, #ffd966)" />
            ))}
          </svg>
        </div>
      </div>
      <div style={{ marginTop: 10, padding: 10, background: 'rgba(184, 150, 255, 0.06)', border: '1px solid rgba(184, 150, 255, 0.3)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        Linear PCA finds the best linear direction; kernel PCA lifts via φ(x,y) = (x, y, x², y², xy) and recovers nonlinear order.
      </div>
    </div>
  );
}
