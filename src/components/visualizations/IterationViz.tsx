// 9.1 — Iteration (flagship). Repeated x_{k+1} = A x_k for a 2x2 matrix.
// Eigenvectors / eigenvalues shown; trail of iterates; log-norm sidebar.

import { useEffect, useRef, useState } from 'react';
import { computeEigen2, m2apply, v2norm, type Mat2, type Vec2 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

const W = 500;
const H = 500;
const CX = W / 2;
const CY = H / 2;
const UNIT = 50;

const NW = 240;
const NH = 120;

const MAX_ITER = 20;

const PRESETS: Record<string, Mat2> = {
  contraction: [[0.7, 0], [0, 0.5]],
  rotationScale: [[1.1 * Math.cos(Math.PI / 6), -1.1 * Math.sin(Math.PI / 6)], [1.1 * Math.sin(Math.PI / 6), 1.1 * Math.cos(Math.PI / 6)]],
  saddle: [[1.5, 0], [0, 0.4]],
  markov: [[0.7, 0.3], [0.3, 0.7]],
  reflection: [[1, 0], [0, -1]],
};

export function IterationViz() {
  const [A, setA] = useState<Mat2>(PRESETS.saddle);
  const [x0, setX0] = useState<Vec2>([2, 0.5]);
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  const eig = computeEigen2(A);

  const iterates: Vec2[] = [x0];
  for (let i = 0; i < MAX_ITER; i++) iterates.push(m2apply(A, iterates[i]));

  // Spectral radius and eigenvalue summary
  let rho = 0;
  let eigSummary: React.ReactNode;
  let rays: { v: Vec2; color: string }[] = [];
  if (eig.kind === 'real') {
    const m1 = Math.abs(eig.values[0]);
    const m2 = Math.abs(eig.values[1]);
    rho = Math.max(m1, m2);
    rays = [
      { v: eig.vectors[0], color: 'var(--viz-blue, #67a9ff)' },
      { v: eig.vectors[1], color: 'var(--viz-yellow, #ffd966)' },
    ];
    eigSummary = (
      <>
        <div>λ₁ = {eig.values[0].toFixed(3)}, |λ₁| = {m1.toFixed(3)}</div>
        <div>λ₂ = {eig.values[1].toFixed(3)}, |λ₂| = {m2.toFixed(3)}</div>
      </>
    );
  } else if (eig.kind === 'complex') {
    rho = Math.hypot(eig.real, eig.imag);
    eigSummary = (
      <>
        <div>λ = {eig.real.toFixed(3)} ± {Math.abs(eig.imag).toFixed(3)}i</div>
        <div>|λ| = {rho.toFixed(3)}</div>
      </>
    );
  } else {
    rho = Math.abs(eig.value);
    if (eig.vector) rays = [{ v: eig.vector, color: 'var(--viz-blue, #67a9ff)' }];
    eigSummary = (
      <>
        <div>λ = {eig.value.toFixed(3)} (repeated{eig.defective ? ', defective' : ''})</div>
        <div>|λ| = {rho.toFixed(3)}</div>
      </>
    );
  }

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last > 600) {
        setK((kk) => {
          if (kk >= MAX_ITER) { setPlaying(false); return MAX_ITER; }
          return kk + 1;
        });
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
      setX0([Number(((sx - CX) / UNIT).toFixed(2)), Number(((CY - sy) / UNIT).toFixed(2))]);
      setK(0);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMv);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  const rayLen = 6;

  // Log norm plot
  const norms = iterates.slice(0, k + 1).map((v) => v2norm(v));
  const logNorms = norms.map((n) => (n > 1e-12 ? Math.log10(n) : -12));
  const maxLog = Math.max(...logNorms, 1);
  const minLog = Math.min(...logNorms, -1);
  const span = maxLog - minLog + 0.01;
  const plotX = (i: number) => 10 + (i / MAX_ITER) * (NW - 20);
  const plotY = (lv: number) => NH - 10 - ((lv - minLog) / span) * (NH - 20);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Invariant-subspace dashed circle for complex eigenvalues */}
            {eig.kind === 'complex' && (
              <circle cx={CX} cy={CY} r={UNIT * Math.min(rho, 6)} fill="none" stroke="var(--viz-yellow, #ffd966)" strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.4} />
            )}

            {/* Eigenvector rays */}
            {rays.map((r, i) => (
              <line
                key={i}
                x1={w2sX(-r.v[0] * rayLen)} y1={w2sY(-r.v[1] * rayLen)}
                x2={w2sX(r.v[0] * rayLen)} y2={w2sY(r.v[1] * rayLen)}
                stroke={r.color} strokeWidth={1.5} strokeOpacity={0.5}
              />
            ))}

            {/* Iterate trail */}
            {iterates.slice(0, k + 1).map((p, i) => i > 0 && (
              <line key={`l${i}`} x1={w2sX(iterates[i - 1][0])} y1={w2sY(iterates[i - 1][1])} x2={w2sX(p[0])} y2={w2sY(p[1])} stroke="var(--viz-blue, #67a9ff)" strokeWidth={1} strokeOpacity={0.35} />
            ))}
            {iterates.slice(0, k + 1).map((p, i) => (
              <circle key={i} cx={w2sX(p[0])} cy={w2sY(p[1])} r={i === k ? 6 : 3} fill="var(--viz-blue, #67a9ff)" fillOpacity={i === k ? 1 : 0.3 + (0.7 * i) / Math.max(1, k)} />
            ))}

            {/* x0 (draggable) */}
            <circle cx={w2sX(x0[0])} cy={w2sY(x0[1])} r={9} fill="var(--viz-purple, #b896ff)" style={{ cursor: 'grab' }} onPointerDown={onDragX0} />
            <text x={w2sX(x0[0]) + 10} y={w2sY(x0[1]) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-purple, #b896ff)">x₀</text>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Matrix entry */}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">MATRIX A</MonoLine>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 6 }}>
              {[0, 1].map((i) =>
                [0, 1].map((j) => (
                  <input
                    key={`${i}${j}`}
                    type="number"
                    step={0.1}
                    value={A[i][j]}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      const next: Mat2 = [[A[0][0], A[0][1]], [A[1][0], A[1][1]]];
                      next[i][j] = v;
                      setA(next);
                      setK(0);
                    }}
                    style={{ background: 'var(--bg-elevated, #1a1f2e)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 11, padding: 4, borderRadius: 4 }}
                  />
                ))
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SPECTRUM</MonoLine>
            <div style={{ marginTop: 6 }}>
              {eigSummary}
              <div style={{ marginTop: 4 }}>ρ(A) = <span style={{ color: rho > 1 ? 'var(--viz-red, #ff7b6b)' : 'var(--viz-green, #6fd49a)' }}>{rho.toFixed(3)}</span></div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">log₁₀ ‖xₖ‖</MonoLine>
            <svg viewBox={`0 0 ${NW} ${NH}`} width="100%" style={{ display: 'block' }}>
              {logNorms.length > 1 && (
                <polyline
                  points={logNorms.map((lv, i) => `${plotX(i)},${plotY(lv)}`).join(' ')}
                  fill="none" stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.5}
                />
              )}
              <line x1={10} y1={NH - 10} x2={NW - 10} y2={NH - 10} stroke="var(--viz-axis, #555)" strokeWidth={0.6} />
            </svg>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {Object.keys(PRESETS).map((name) => (
              <VizControlButton key={name} onClick={() => { setA(PRESETS[name]); setK(0); }}>{name}</VizControlButton>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <VizControlButton onClick={() => setPlaying((p) => !p)}>{playing ? 'pause' : 'play'}</VizControlButton>
            <VizControlButton onClick={() => setK((kk) => Math.min(MAX_ITER, kk + 1))}>step</VizControlButton>
            <VizControlButton onClick={() => { setK(0); setPlaying(false); }}>reset</VizControlButton>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textAlign: 'center', color: 'var(--text-tertiary)' }}>k = {k} / {MAX_ITER}</div>
        </div>
      </div>
    </div>
  );
}
