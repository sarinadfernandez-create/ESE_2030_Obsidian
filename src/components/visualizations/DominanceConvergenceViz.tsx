// 9.2 — Dominance & Convergence. Side-by-side power iteration on two matrices
// with different spectral gaps; angle-to-v1 vs iteration plot.

import { useEffect, useRef, useState } from 'react';
import { MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 340;
const H = 340;
const CX = W / 2;
const CY = H / 2;
const UNIT = 100;

const NW = 320;
const NH = 100;

const MAX_ITER = 30;

function normalize(v: Vec2): Vec2 {
  const n = Math.hypot(v[0], v[1]);
  return n > 1e-12 ? [v[0] / n, v[1] / n] : [1, 0];
}

function iterate(v: Vec2, lambda1: number, lambda2: number): Vec2 {
  return normalize([lambda1 * v[0], lambda2 * v[1]]);
}

export function DominanceConvergenceViz() {
  const lambda1 = 10;
  const lambda2A = 9;
  const [lambda2B, setLambda2B] = useState(2);
  const [x0, setX0] = useState<Vec2>(normalize([1, 1]));
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tieMode, setTieMode] = useState(false);
  const rafRef = useRef<number | null>(null);

  const effL2B = tieMode ? -lambda1 : lambda2B;

  // Iterate paths (normalized)
  const pathA: Vec2[] = [x0];
  const pathB: Vec2[] = [x0];
  for (let i = 0; i < MAX_ITER; i++) {
    pathA.push(iterate(pathA[i], lambda1, lambda2A));
    pathB.push(iterate(pathB[i], lambda1, effL2B));
  }

  const angleA = (v: Vec2) => Math.abs(Math.atan2(v[1], v[0]));
  const angleB = (v: Vec2) => Math.abs(Math.atan2(v[1], v[0]));
  const sinAnglesA = pathA.map((v) => Math.abs(Math.sin(angleA(v))));
  const sinAnglesB = pathB.map((v) => Math.abs(Math.sin(angleB(v))));

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last > 500) {
        setK((kk) => kk >= MAX_ITER ? (setPlaying(false), MAX_ITER) : kk + 1);
        last = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  const onDragX0 = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      setX0(normalize([wx, wy]));
      setK(0);
    };
    const onUp = () => { window.removeEventListener('pointermove', onMv); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  const renderCanvas = (label: string, path: Vec2[], ratio: number) => (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
      <MonoLine size={9} color="var(--text-tertiary)">{label}</MonoLine>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <line x1={0} y1={CY} x2={W} y2={CY} stroke="var(--viz-axis, #555)" strokeWidth={0.6} />
        <line x1={CX} y1={0} x2={CX} y2={H} stroke="var(--viz-axis, #555)" strokeWidth={0.6} />
        {/* Unit circle */}
        <circle cx={CX} cy={CY} r={UNIT} fill="none" stroke="var(--viz-grid, #444)" strokeWidth={0.6} />
        {/* Dominant eigenline */}
        <line x1={0} y1={CY} x2={W} y2={CY} stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.5} strokeOpacity={0.5} />
        {/* Trail */}
        {path.slice(0, k + 1).map((v, i) => (
          <circle key={i} cx={w2sX(v[0])} cy={w2sY(v[1])} r={i === k ? 6 : 3} fill="var(--viz-yellow, #ffd966)" fillOpacity={i === k ? 1 : 0.3 + (0.7 * i) / Math.max(1, k)} />
        ))}
        {/* x0 (only show on left canvas; same on both) */}
        <circle cx={w2sX(x0[0])} cy={w2sY(x0[1])} r={6} fill="var(--viz-purple, #b896ff)" style={{ cursor: 'grab' }} onPointerDown={onDragX0} />
      </svg>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: 4, color: 'var(--text-secondary)' }}>
        ratio |λ₂/λ₁| = {ratio.toFixed(3)}
      </div>
    </div>
  );

  const renderLogPlot = (label: string, sins: number[]) => (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 6 }}>
      <MonoLine size={9} color="var(--text-tertiary)">{label} (log scale)</MonoLine>
      <svg viewBox={`0 0 ${NW} ${NH}`} width="100%" style={{ display: 'block' }}>
        {sins.slice(0, k + 1).map((s, i) => i > 0 && (
          <line
            key={i}
            x1={(NW - 20) * ((i - 1) / MAX_ITER) + 10}
            y1={NH - 10 - Math.max(-10, Math.log10(Math.max(sins[i - 1], 1e-10))) * 8}
            x2={(NW - 20) * (i / MAX_ITER) + 10}
            y2={NH - 10 - Math.max(-10, Math.log10(Math.max(s, 1e-10))) * 8}
            stroke="var(--viz-yellow, #ffd966)"
            strokeWidth={1.5}
          />
        ))}
        <line x1={10} y1={NH - 10} x2={NW - 10} y2={NH - 10} stroke="var(--viz-axis, #555)" strokeWidth={0.6} />
      </svg>
    </div>
  );

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        <label style={{ display: 'block' }}>
          λ₂ on Matrix B = {effL2B.toFixed(2)} (λ₁ fixed at {lambda1})
          <input type="range" min={0.5} max={9.5} step={0.1} value={lambda2B} onChange={(e) => { setLambda2B(parseFloat(e.target.value)); setK(0); }} style={{ width: '100%' }} disabled={tieMode} />
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <input type="checkbox" checked={tieMode} onChange={(e) => { setTieMode(e.target.checked); setK(0); }} /> tie mode (λ₂ = −λ₁)
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {renderCanvas(`MATRIX A · λ = (${lambda1}, ${lambda2A})`, pathA, lambda2A / lambda1)}
        {renderCanvas(`MATRIX B · λ = (${lambda1}, ${effL2B})`, pathB, Math.abs(effL2B) / lambda1)}
        {renderLogPlot('|sin θ| matrix A', sinAnglesA)}
        {renderLogPlot('|sin θ| matrix B', sinAnglesB)}
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
        <VizControlButton onClick={() => setPlaying((p) => !p)}>{playing ? 'pause' : 'play'}</VizControlButton>
        <VizControlButton onClick={() => setK((kk) => Math.min(MAX_ITER, kk + 1))}>step</VizControlButton>
        <VizControlButton onClick={() => { setK(0); setPlaying(false); }}>reset</VizControlButton>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textAlign: 'center', color: 'var(--text-tertiary)' }}>k = {k} / {MAX_ITER}</div>
    </div>
  );
}
