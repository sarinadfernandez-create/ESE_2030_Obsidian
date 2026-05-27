// 11.2 — Principal Components (flagship). Gaussian cloud with adjustable elongation
// and rotation; PC arrows update live; scree plot and score histograms.

import { useMemo, useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Point = { x: number; y: number };

const W = 450;
const H = 450;
const CX = W / 2;
const CY = H / 2;
const UNIT = 50;

// Deterministic Gaussian via Box-Muller with seeded RNG
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
  const u = Math.max(1e-12, rng());
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generateCloud(elongation: number, rotation: number, n: number, seed: number): Point[] {
  const rng = mulberry32(seed);
  const c = Math.cos(rotation), s = Math.sin(rotation);
  const sigma1 = Math.sqrt(elongation);
  const sigma2 = 1 / sigma1;
  return Array.from({ length: n }, () => {
    const x0 = gauss(rng) * sigma1;
    const y0 = gauss(rng) * sigma2;
    return { x: c * x0 - s * y0, y: s * x0 + c * y0 };
  });
}

export function PrincipalComponentsViz() {
  const [elongation, setElongation] = useState(5);
  const [rotation, setRotation] = useState(Math.PI / 6);
  const [nPoints, setNPoints] = useState(150);
  const [seed, setSeed] = useState(1);
  const [showProjection, setShowProjection] = useState(false);
  const [showEllipsoid, setShowEllipsoid] = useState(true);

  const pts = useMemo(() => generateCloud(elongation, rotation, nPoints, seed), [elongation, rotation, nPoints, seed]);

  // Sample covariance
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  const cpts = pts.map((p) => ({ x: p.x - mx, y: p.y - my }));
  const sxx = cpts.reduce((s, p) => s + p.x * p.x, 0) / (n - 1);
  const syy = cpts.reduce((s, p) => s + p.y * p.y, 0) / (n - 1);
  const sxy = cpts.reduce((s, p) => s + p.x * p.y, 0) / (n - 1);

  // Eigendecomposition of Σ
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, tr * tr - 4 * det);
  const sqrtD = Math.sqrt(disc);
  const lambda1 = (tr + sqrtD) / 2;
  const lambda2 = Math.max(0, (tr - sqrtD) / 2);
  let q1: Point;
  if (Math.abs(sxy) > 1e-10) q1 = { x: lambda1 - syy, y: sxy };
  else q1 = sxx >= syy ? { x: 1, y: 0 } : { x: 0, y: 1 };
  const nrm = Math.hypot(q1.x, q1.y) || 1;
  q1 = { x: q1.x / nrm, y: q1.y / nrm };
  const q2: Point = { x: -q1.y, y: q1.x };

  // Projection scores
  const scores1 = cpts.map((p) => p.x * q1.x + p.y * q1.y);
  const scores2 = cpts.map((p) => p.x * q2.x + p.y * q2.y);

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  // Ellipse for x^T Σ^{-1} x = 1: axes are q1, q2 with lengths sqrt(lambda1), sqrt(lambda2)
  const ellipsePts: [number, number][] = [];
  const ES = 80;
  for (let i = 0; i <= ES; i++) {
    const t = (i / ES) * 2 * Math.PI;
    const a = Math.sqrt(lambda1) * Math.cos(t);
    const b = Math.sqrt(lambda2) * Math.sin(t);
    const x = q1.x * a + q2.x * b;
    const y = q1.y * a + q2.y * b;
    ellipsePts.push([x, y]);
  }

  // Histogram helpers
  const hist = (vals: number[], bins = 18, range = 5): number[] => {
    const h = new Array(bins).fill(0);
    vals.forEach((v) => {
      const b = Math.floor(((v + range) / (2 * range)) * bins);
      if (b >= 0 && b < bins) h[b]++;
    });
    return h;
  };
  const h1 = hist(scores1);
  const h2 = hist(scores2);
  const maxH = Math.max(...h1, ...h2, 1);

  const totalVar = lambda1 + lambda2;
  const explained1 = ((lambda1 / totalVar) * 100).toFixed(1);

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            {/* Data points */}
            {pts.map((p, i) => (
              <circle key={i} cx={w2sX(p.x - mx)} cy={w2sY(p.y - my)} r={2.5} fill="var(--viz-purple, #b896ff)" fillOpacity={0.65} />
            ))}
            {/* Ellipsoid */}
            {showEllipsoid && (
              <polygon
                points={ellipsePts.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
                fill="none" stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.2} strokeOpacity={0.4} strokeDasharray="4 3"
              />
            )}
            {/* Projection lines */}
            {showProjection && cpts.slice(0, 80).map((p, i) => {
              const s = p.x * q1.x + p.y * q1.y;
              const px = s * q1.x;
              const py = s * q1.y;
              return <line key={`pr${i}`} x1={w2sX(p.x)} y1={w2sY(p.y)} x2={w2sX(px)} y2={w2sY(py)} stroke="var(--viz-green, #6fd49a)" strokeWidth={0.6} strokeOpacity={0.4} strokeDasharray="2 2" />;
            })}
            {/* PC arrows */}
            <line x1={CX} y1={CY} x2={w2sX(q1.x * Math.sqrt(lambda1))} y2={w2sY(q1.y * Math.sqrt(lambda1))} stroke="var(--viz-blue, #67a9ff)" strokeWidth={3} />
            <line x1={CX} y1={CY} x2={w2sX(q2.x * Math.sqrt(lambda2))} y2={w2sY(q2.y * Math.sqrt(lambda2))} stroke="var(--viz-yellow, #ffd966)" strokeWidth={2.4} />
            <text x={w2sX(q1.x * Math.sqrt(lambda1)) + 6} y={w2sY(q1.y * Math.sqrt(lambda1)) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-blue, #67a9ff)">PC₁ · λ={lambda1.toFixed(3)}</text>
            <text x={w2sX(q2.x * Math.sqrt(lambda2)) + 6} y={w2sY(q2.y * Math.sqrt(lambda2)) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-yellow, #ffd966)">PC₂ · λ={lambda2.toFixed(3)}</text>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">CONTROLS</MonoLine>
            <label style={{ display: 'block', marginTop: 4 }}>
              elongation = {elongation.toFixed(1)}
              <input type="range" min={1} max={20} step={0.5} value={elongation} onChange={(e) => setElongation(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginTop: 4 }}>
              rotation = {((rotation * 180) / Math.PI).toFixed(0)}°
              <input type="range" min={-Math.PI / 2} max={Math.PI / 2} step={0.05} value={rotation} onChange={(e) => setRotation(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginTop: 4 }}>
              n points = {nPoints}
              <input type="range" min={20} max={500} step={10} value={nPoints} onChange={(e) => setNPoints(parseInt(e.target.value))} style={{ width: '100%' }} />
            </label>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SCREE</MonoLine>
            <svg viewBox="0 0 200 80" width="100%" style={{ display: 'block', marginTop: 4 }}>
              <rect x={20} y={70 - (lambda1 / totalVar) * 60} width={70} height={(lambda1 / totalVar) * 60} fill="var(--viz-blue, #67a9ff)" />
              <rect x={110} y={70 - (lambda2 / totalVar) * 60} width={70} height={(lambda2 / totalVar) * 60} fill="var(--viz-yellow, #ffd966)" />
              <line x1={10} y1={70} x2={190} y2={70} stroke="var(--viz-axis, #555)" strokeWidth={0.8} />
            </svg>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>PC₁ explains {explained1}% of variance</div>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">PC₁ SCORES (σ = {Math.sqrt(lambda1).toFixed(2)})</MonoLine>
            <svg viewBox={`0 0 ${h1.length * 12} 50`} width="100%" style={{ display: 'block' }}>
              {h1.map((v, i) => (
                <rect key={i} x={i * 12} y={50 - (v / maxH) * 45} width={10} height={(v / maxH) * 45} fill="var(--viz-blue, #67a9ff)" />
              ))}
            </svg>
          </div>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">PC₂ SCORES (σ = {Math.sqrt(lambda2).toFixed(2)})</MonoLine>
            <svg viewBox={`0 0 ${h2.length * 12} 50`} width="100%" style={{ display: 'block' }}>
              {h2.map((v, i) => (
                <rect key={i} x={i * 12} y={50 - (v / maxH) * 45} width={10} height={(v / maxH) * 45} fill="var(--viz-yellow, #ffd966)" />
              ))}
            </svg>
          </div>

          <label style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={showProjection} onChange={(e) => setShowProjection(e.target.checked)} /> show projection
          </label>
          <label style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={showEllipsoid} onChange={(e) => setShowEllipsoid(e.target.checked)} /> show ellipsoid
          </label>
          <VizControlButton onClick={() => setSeed((s) => s + 1)}>resample</VizControlButton>
        </div>
      </div>
    </div>
  );
}
