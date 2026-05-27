// 11.1 — Covariance vs Correlation. Centered 2D cloud; Σ and R as heatmaps;
// correlation as cosine of angle between centered feature columns.

import { useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Point = { x: number; y: number };

const W = 400;
const H = 400;
const CX = W / 2;
const CY = H / 2;
const UNIT = 40;

function genPositive(): Point[] {
  return Array.from({ length: 40 }, (_, i) => {
    const t = (i / 40) * 4 - 2;
    return { x: t + (Math.random() - 0.5) * 0.5, y: t * 0.8 + (Math.random() - 0.5) * 0.6 };
  });
}
function genNegative(): Point[] {
  return Array.from({ length: 40 }, (_, i) => {
    const t = (i / 40) * 4 - 2;
    return { x: t + (Math.random() - 0.5) * 0.5, y: -t * 0.8 + (Math.random() - 0.5) * 0.6 };
  });
}
function genUncorrelated(): Point[] {
  return Array.from({ length: 40 }, () => ({ x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 }));
}

function center(pts: Point[]): Point[] {
  const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  return pts.map((p) => ({ x: p.x - mx, y: p.y - my }));
}

function stats(pts: Point[]) {
  const n = pts.length;
  const sxx = pts.reduce((s, p) => s + p.x * p.x, 0) / (n - 1);
  const syy = pts.reduce((s, p) => s + p.y * p.y, 0) / (n - 1);
  const sxy = pts.reduce((s, p) => s + p.x * p.y, 0) / (n - 1);
  const r = (sxx > 1e-10 && syy > 1e-10) ? sxy / Math.sqrt(sxx * syy) : 0;
  return { sxx, syy, sxy, r };
}

export function CovarianceCorrelationViz() {
  const [rawPts, setRawPts] = useState<Point[]>(genPositive);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const pts = center(rawPts).map((p) => ({ x: p.x * scaleX, y: p.y * scaleY }));
  const { sxx, syy, sxy, r } = stats(pts);
  const theta = Math.acos(Math.max(-1, Math.min(1, r)));
  const thetaDeg = (theta * 180) / Math.PI;

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  const heatColor = (v: number) => {
    if (v >= 0) return `rgba(103, 169, 255, ${Math.min(0.9, Math.abs(v) / 4 + 0.1)})`;
    return `rgba(255, 123, 107, ${Math.min(0.9, Math.abs(v) / 4 + 0.1)})`;
  };

  const renderMatrix = (vals: number[][], title: string) => (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
      <MonoLine size={9} color="var(--text-tertiary)">{title}</MonoLine>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginTop: 4 }}>
        {vals.flat().map((v, i) => (
          <div key={i} style={{ background: heatColor(v), padding: '14px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, borderRadius: 3, color: 'var(--text-primary)' }}>
            {v.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            {pts.map((p, i) => (
              <circle key={i} cx={w2sX(p.x)} cy={w2sY(p.y)} r={3} fill="var(--viz-purple, #b896ff)" fillOpacity={0.75} />
            ))}
            <line x1={CX} y1={CY} x2={w2sX(Math.sqrt(sxx))} y2={CY} stroke="var(--viz-blue, #67a9ff)" strokeWidth={2} />
            <line x1={CX} y1={CY} x2={CX} y2={w2sY(Math.sqrt(syy))} stroke="var(--viz-yellow, #ffd966)" strokeWidth={2} />
            <text x={w2sX(Math.sqrt(sxx)) + 6} y={CY - 8} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-blue, #67a9ff)">σ₁</text>
            <text x={CX + 8} y={w2sY(Math.sqrt(syy)) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-yellow, #ffd966)">σ₂</text>
          </svg>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 4px', color: 'var(--text-secondary)' }}>
            θ between feature vectors = {thetaDeg.toFixed(1)}°, cos θ = r = {r.toFixed(3)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {renderMatrix(
            [[sxx, sxy], [sxy, syy]],
            'Σ (covariance, units!)'
          )}
          {renderMatrix(
            [[1, r], [r, 1]],
            'R (correlation, dimensionless)'
          )}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <label style={{ display: 'block' }}>
              scale feature 1 = {scaleX.toFixed(2)}
              <input type="range" min={0.1} max={10} step={0.1} value={scaleX} onChange={(e) => setScaleX(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginTop: 6 }}>
              scale feature 2 = {scaleY.toFixed(2)}
              <input type="range" min={0.1} max={10} step={0.1} value={scaleY} onChange={(e) => setScaleY(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </label>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6 }}>
              Σ rescales with units; R is invariant.
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <VizControlButton onClick={() => { setRawPts(genPositive()); setScaleX(1); setScaleY(1); }}>positive</VizControlButton>
            <VizControlButton onClick={() => { setRawPts(genNegative()); setScaleX(1); setScaleY(1); }}>negative</VizControlButton>
            <VizControlButton onClick={() => { setRawPts(genUncorrelated()); setScaleX(1); setScaleY(1); }}>uncorrelated</VizControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}
