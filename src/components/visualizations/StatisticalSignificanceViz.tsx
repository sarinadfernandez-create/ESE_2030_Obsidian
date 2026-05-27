// 11.5 — Statistical Significance of PCs. Synthetic rank-k + noise data; scree
// plot with Kaiser line, noise floor, and elbow marker.

import { useMemo, useState } from 'react';
import { MonoLine, VizControlButton } from './_shared';

const D_FEATURES = 10;

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
// Simulate eigenvalues for rank-k signal + noise.
// Signal eigenvalues decay linearly from a base; noise spreads variance across all PCs
// per Marchenko-Pastur with aspect d/n.
function simulate(trueRank: number, noiseLevel: number, n: number, d: number, seed: number, mode: 'covariance' | 'correlation'): number[] {
  const rng = mulberry32(seed);
  const evs: number[] = new Array(d).fill(0);
  // Signal contribution: rank k, sigma decays
  for (let i = 0; i < trueRank; i++) {
    const base = 8 * Math.pow(0.75, i);
    const jitter = 1 + (rng() - 0.5) * 0.2;
    evs[i] = base * jitter;
  }
  // Add noise to all eigenvalues
  for (let i = 0; i < d; i++) {
    // Noise contribution; finite-sample fluctuation, scaled by noiseLevel and aspect ratio
    const aspect = d / n;
    const beta = noiseLevel * noiseLevel * (1 + Math.sqrt(aspect)) ** 2;
    const noisecomp = beta * (0.4 + 0.6 * rng());
    evs[i] += noisecomp * (1 - 0.05 * i);
  }
  // For correlation PCA mode, rescale so trace == d
  if (mode === 'correlation') {
    const total = evs.reduce((s, v) => s + v, 0) || 1;
    for (let i = 0; i < d; i++) evs[i] = evs[i] * d / total;
  }
  return evs.sort((a, b) => b - a);
}

export function StatisticalSignificanceViz() {
  const [trueRank, setTrueRank] = useState(3);
  const [noiseLevel, setNoiseLevel] = useState(1);
  const [nObs, setNObs] = useState(200);
  const [mode, setMode] = useState<'covariance' | 'correlation'>('correlation');
  const [seed, setSeed] = useState(1);

  const evs = useMemo(() => simulate(trueRank, noiseLevel, nObs, D_FEATURES, seed, mode), [trueRank, noiseLevel, nObs, seed, mode]);

  const total = evs.reduce((s, v) => s + v, 0);
  const cumvar = evs.reduce<number[]>((acc, v, i) => { acc.push((acc[i - 1] || 0) + v / total); return acc; }, []);

  // Noise floor approx: (1 + sqrt(d/n))^2 * noiseLevel^2
  const aspect = D_FEATURES / nObs;
  const noiseFloor = noiseLevel * noiseLevel * (1 + Math.sqrt(aspect)) ** 2;
  const noiseFloorEff = mode === 'correlation' ? noiseFloor * D_FEATURES / total : noiseFloor;
  const kaiser = 1;

  // Counts
  const countKaiser = evs.filter((v) => v > kaiser).length;
  const countAbove = evs.filter((v) => v > noiseFloorEff).length;
  const idx90 = cumvar.findIndex((c) => c >= 0.9);
  const count90 = idx90 === -1 ? D_FEATURES : idx90 + 1;
  // Elbow: largest gap
  let elbow = 0;
  let maxGap = 0;
  for (let i = 0; i < D_FEATURES - 1; i++) {
    const gap = evs[i] - evs[i + 1];
    if (gap > maxGap) { maxGap = gap; elbow = i + 1; }
  }

  const W = 500, H = 350;
  const margin = { l: 40, r: 20, t: 20, b: 30 };
  const plotW = W - margin.l - margin.r;
  const plotH = H - margin.t - margin.b;
  const barWidth = plotW / D_FEATURES * 0.7;
  const maxVal = Math.max(...evs, kaiser, noiseFloorEff) * 1.1;

  const x = (i: number) => margin.l + ((i + 0.5) / D_FEATURES) * plotW - barWidth / 2;
  const y = (v: number) => margin.t + plotH - (v / maxVal) * plotH;

  const barColor = (v: number) =>
    mode === 'correlation' && v > kaiser ? 'var(--viz-blue, #67a9ff)' :
    v > noiseFloorEff ? 'var(--viz-yellow, #ffd966)' :
    'var(--text-tertiary, #888)';

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">SCREE PLOT</MonoLine>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            {/* Bars */}
            {evs.map((v, i) => (
              <rect key={i} x={x(i)} y={y(v)} width={barWidth} height={margin.t + plotH - y(v)} fill={barColor(v)} />
            ))}
            {/* Kaiser line */}
            {mode === 'correlation' && (
              <>
                <line x1={margin.l} y1={y(kaiser)} x2={W - margin.r} y2={y(kaiser)} stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.2} strokeDasharray="4 3" />
                <text x={W - margin.r + 2} y={y(kaiser) + 3} fontSize={9} fontFamily="var(--font-mono)" fill="var(--viz-blue, #67a9ff)">Kaiser</text>
              </>
            )}
            {/* Noise floor */}
            <line x1={margin.l} y1={y(noiseFloorEff)} x2={W - margin.r} y2={y(noiseFloorEff)} stroke="var(--viz-red, #ff7b6b)" strokeWidth={1.2} strokeDasharray="3 3" />
            <text x={margin.l + 4} y={y(noiseFloorEff) - 2} fontSize={9} fontFamily="var(--font-mono)" fill="var(--viz-red, #ff7b6b)">noise floor</text>
            {/* Elbow */}
            <line x1={x(elbow) + barWidth / 2} y1={margin.t} x2={x(elbow) + barWidth / 2} y2={margin.t + plotH} stroke="var(--viz-green, #6fd49a)" strokeWidth={1.2} strokeDasharray="4 2" />
            {/* X axis */}
            <line x1={margin.l} y1={margin.t + plotH} x2={W - margin.r} y2={margin.t + plotH} stroke="var(--viz-axis, #555)" strokeWidth={0.8} />
            {evs.map((_, i) => (
              <text key={`l${i}`} x={x(i) + barWidth / 2} y={margin.t + plotH + 14} fontSize={9} fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--text-tertiary)">{i + 1}</text>
            ))}
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">CONTROLS</MonoLine>
            <label style={{ display: 'block', marginTop: 4 }}>
              true rank = {trueRank}
              <input type="range" min={0} max={10} step={1} value={trueRank} onChange={(e) => setTrueRank(parseInt(e.target.value))} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginTop: 4 }}>
              noise level = {noiseLevel.toFixed(2)}
              <input type="range" min={0} max={5} step={0.05} value={noiseLevel} onChange={(e) => setNoiseLevel(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </label>
            <label style={{ display: 'block', marginTop: 4 }}>
              n obs = {nObs}
              <input type="range" min={50} max={1000} step={10} value={nObs} onChange={(e) => setNObs(parseInt(e.target.value))} style={{ width: '100%' }} />
            </label>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              <VizControlButton onClick={() => setMode('covariance')}>{mode === 'covariance' ? '✓ ' : ''}covariance</VizControlButton>
              <VizControlButton onClick={() => setMode('correlation')}>{mode === 'correlation' ? '✓ ' : ''}correlation</VizControlButton>
            </div>
            <VizControlButton onClick={() => setSeed((s) => s + 1)}>resample</VizControlButton>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">RETENTION COUNTS</MonoLine>
            <div style={{ marginTop: 4 }}>{mode === 'correlation' && <>Kaiser (λ&gt;1): <span style={{ color: 'var(--viz-blue, #67a9ff)' }}>{countKaiser}</span><br /></>}
              above noise floor: <span style={{ color: 'var(--viz-yellow, #ffd966)' }}>{countAbove}</span><br />
              elbow at k = <span style={{ color: 'var(--viz-green, #6fd49a)' }}>{elbow}</span><br />
              90% cumulative: <span>{count90}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
