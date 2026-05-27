// 11.3 — PCA Optimality. Trial line rotates; variance captured + squared
// residual = constant total. PC1 is the line that maximizes one and minimizes the other.

import { useMemo, useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Point = { x: number; y: number };

const W = 500;
const H = 450;
const CX = W / 2;
const CY = H / 2;
const UNIT = 45;

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

function makeCloud(seed = 7): Point[] {
  const rng = mulberry32(seed);
  const c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6);
  return Array.from({ length: 80 }, () => {
    const x0 = gauss(rng) * 2.2;
    const y0 = gauss(rng) * 0.7;
    return { x: c * x0 - s * y0, y: s * x0 + c * y0 };
  });
}

export function PcaOptimalityViz() {
  const [trialAngle, setTrialAngle] = useState(Math.PI / 2);
  const [showResiduals, setShowResiduals] = useState(true);
  const [seed] = useState(7);

  const pts = useMemo(() => makeCloud(seed), [seed]);
  // Centered
  const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const c = pts.map((p) => ({ x: p.x - mx, y: p.y - my }));

  // Total variance
  const totalVar = c.reduce((s, p) => s + p.x * p.x + p.y * p.y, 0);

  // Covariance
  const n = c.length;
  const sxx = c.reduce((s, p) => s + p.x * p.x, 0);
  const syy = c.reduce((s, p) => s + p.y * p.y, 0);
  const sxy = c.reduce((s, p) => s + p.x * p.y, 0);
  // Note: using sum-of-squares (not divided by n-1) for cleaner conservation identity

  // True PC1 direction (eigenvector of covariance)
  const tr = sxx + syy;
  const det = sxx * syy - sxy * sxy;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambda1 = (tr + Math.sqrt(disc)) / 2;
  let pc1: Point;
  if (Math.abs(sxy) > 1e-10) pc1 = { x: lambda1 - syy, y: sxy };
  else pc1 = sxx >= syy ? { x: 1, y: 0 } : { x: 0, y: 1 };
  const nrm = Math.hypot(pc1.x, pc1.y) || 1;
  pc1 = { x: pc1.x / nrm, y: pc1.y / nrm };

  // Trial direction
  const u = { x: Math.cos(trialAngle), y: Math.sin(trialAngle) };
  // Variance captured u^T Σ u (using sum-of-squares scaling)
  const captured = sxx * u.x * u.x + 2 * sxy * u.x * u.y + syy * u.y * u.y;
  const residual = totalVar - captured;
  const fraction = captured / totalVar;

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            {/* Data */}
            {c.map((p, i) => (
              <circle key={i} cx={w2sX(p.x)} cy={w2sY(p.y)} r={2.5} fill="var(--viz-purple, #b896ff)" fillOpacity={0.75} />
            ))}
            {/* PC1 line */}
            <line x1={w2sX(-pc1.x * 6)} y1={w2sY(-pc1.y * 6)} x2={w2sX(pc1.x * 6)} y2={w2sY(pc1.y * 6)} stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.5} strokeOpacity={0.6} strokeDasharray="3 3" />
            {/* Trial line */}
            <line x1={w2sX(-u.x * 6)} y1={w2sY(-u.y * 6)} x2={w2sX(u.x * 6)} y2={w2sY(u.y * 6)} stroke="var(--viz-yellow, #ffd966)" strokeWidth={2.4} />
            {/* Perpendicular residuals */}
            {showResiduals && c.map((p, i) => {
              const proj = p.x * u.x + p.y * u.y;
              const fx = proj * u.x;
              const fy = proj * u.y;
              return <line key={`res${i}`} x1={w2sX(p.x)} y1={w2sY(p.y)} x2={w2sX(fx)} y2={w2sY(fy)} stroke="var(--viz-red, #ff7b6b)" strokeWidth={0.7} strokeOpacity={0.6} />;
            })}
            <text x={w2sX(pc1.x * 5)} y={w2sY(pc1.y * 5)} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-blue, #67a9ff)">PC₁</text>
            <text x={w2sX(u.x * 5.5)} y={w2sY(u.y * 5.5)} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-yellow, #ffd966)">trial</text>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <label style={{ display: 'block' }}>
              trial angle = {((trialAngle * 180) / Math.PI).toFixed(0)}°
              <input type="range" min={-Math.PI} max={Math.PI} step={0.02} value={trialAngle} onChange={(e) => setTrialAngle(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </label>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
              <VizControlButton onClick={() => setTrialAngle(Math.atan2(pc1.y, pc1.x))}>snap to PC₁</VizControlButton>
              <VizControlButton onClick={() => setTrialAngle(0)}>x-axis</VizControlButton>
              <VizControlButton onClick={() => setTrialAngle(Math.PI / 2)}>y-axis</VizControlButton>
            </div>
            <label style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              <input type="checkbox" checked={showResiduals} onChange={(e) => setShowResiduals(e.target.checked)} /> show perpendicular residuals
            </label>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">CONSERVATION</MonoLine>
            <div style={{ marginTop: 6 }}>variance captured = <span style={{ color: 'var(--viz-blue, #67a9ff)' }}>{captured.toFixed(2)}</span></div>
            <div>squared residual = <span style={{ color: 'var(--viz-red, #ff7b6b)' }}>{residual.toFixed(2)}</span></div>
            <div style={{ marginTop: 6, borderTop: '1px solid var(--border-subtle)', paddingTop: 6 }}>
              sum = {(captured + residual).toFixed(2)} <span style={{ color: 'var(--viz-green, #6fd49a)' }}>(invariant)</span>
            </div>
            <div style={{ marginTop: 6 }}>fraction captured: <span style={{ fontWeight: 700 }}>{(fraction * 100).toFixed(1)}%</span></div>
          </div>

          <div style={{ background: 'rgba(111, 212, 154, 0.06)', border: '1px solid rgba(111, 212, 154, 0.3)', borderRadius: 6, padding: 8, fontSize: 10 }}>
            n = {n} points. PC₁ maximizes captured variance ⇔ minimizes residual.
          </div>
        </div>
      </div>
    </div>
  );
}
