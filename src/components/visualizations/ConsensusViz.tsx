// 9.5 — Consensus / Markov chains on 3-state simplex.
// Column-stochastic 3x3 matrix; iterate from a starting distribution; converge
// to the stationary distribution.

import { useEffect, useRef, useState } from 'react';
import { MonoLine, VizControlButton } from './_shared';

type Vec3 = [number, number, number];
type Mat3 = number[][];

const W = 480;
const H = 440;
const TRI_R = 180;
const CX = W / 2;
const CY = H / 2 + 40;

// Triangle vertices (state 1 top, state 2 lower-left, state 3 lower-right)
const V0: [number, number] = [CX, CY - TRI_R];
const V1: [number, number] = [CX - TRI_R * Math.sin(Math.PI / 3), CY + TRI_R / 2];
const V2: [number, number] = [CX + TRI_R * Math.sin(Math.PI / 3), CY + TRI_R / 2];

function bary(p: Vec3): [number, number] {
  const x = p[0] * V0[0] + p[1] * V1[0] + p[2] * V2[0];
  const y = p[0] * V0[1] + p[1] * V1[1] + p[2] * V2[1];
  return [x, y];
}

function normalizeCols(M: Mat3): Mat3 {
  const N: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let j = 0; j < 3; j++) {
    let s = 0;
    for (let i = 0; i < 3; i++) s += M[i][j];
    for (let i = 0; i < 3; i++) N[i][j] = s > 1e-12 ? M[i][j] / s : 0;
  }
  return N;
}

function apply3(M: Mat3, v: Vec3): Vec3 {
  return [
    M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
    M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
    M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2],
  ];
}

// Find stationary via power iteration
function stationary(M: Mat3, iter = 200): Vec3 {
  let v: Vec3 = [1 / 3, 1 / 3, 1 / 3];
  for (let i = 0; i < iter; i++) {
    v = apply3(M, v);
    const s = v[0] + v[1] + v[2];
    v = [v[0] / s, v[1] / s, v[2] / s];
  }
  return v;
}

const PRESETS: Record<string, Mat3> = {
  sticky: [[0.8, 0.1, 0.1], [0.1, 0.8, 0.1], [0.1, 0.1, 0.8]],
  mixing: [[0.33, 0.33, 0.33], [0.33, 0.33, 0.33], [0.34, 0.34, 0.34]],
  periodic: [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
  symmetric: [[0.5, 0.2, 0.5], [0.2, 0.6, 0.2], [0.3, 0.2, 0.3]],
};

export function ConsensusViz() {
  const [P, setP] = useState<Mat3>(normalizeCols(PRESETS.sticky));
  const [x0, setX0] = useState<Vec3>([0.7, 0.2, 0.1]);
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  const MAX = 30;
  const trail: Vec3[] = [x0];
  for (let i = 0; i < MAX; i++) trail.push(apply3(P, trail[i]));

  const stat = stationary(P);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last > 500) {
        setK((kk) => kk >= MAX ? (setPlaying(false), MAX) : kk + 1);
        last = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  const onDragX0 = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      // Convert canvas point to barycentric coords (clamped)
      // Solve [V0; V1; V2] · λ = [sx; sy; 1] for λ summing to 1.
      const denom = (V1[1] - V2[1]) * (V0[0] - V2[0]) + (V2[0] - V1[0]) * (V0[1] - V2[1]);
      const l1 = ((V1[1] - V2[1]) * (sx - V2[0]) + (V2[0] - V1[0]) * (sy - V2[1])) / denom;
      const l2 = ((V2[1] - V0[1]) * (sx - V2[0]) + (V0[0] - V2[0]) * (sy - V2[1])) / denom;
      const l3 = 1 - l1 - l2;
      if (l1 >= 0 && l2 >= 0 && l3 >= 0) {
        setX0([l1, l2, l3]);
        setK(0);
      }
    };
    const onUp = () => { window.removeEventListener('pointermove', onMv); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            {/* Triangle */}
            <polygon
              points={`${V0[0]},${V0[1]} ${V1[0]},${V1[1]} ${V2[0]},${V2[1]}`}
              fill="rgba(103, 169, 255, 0.04)" stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.5}
            />
            <text x={V0[0]} y={V0[1] - 12} fontSize={11} fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--text-secondary)">State 1</text>
            <text x={V1[0] - 8} y={V1[1] + 20} fontSize={11} fontFamily="var(--font-mono)" textAnchor="end" fill="var(--text-secondary)">State 2</text>
            <text x={V2[0] + 8} y={V2[1] + 20} fontSize={11} fontFamily="var(--font-mono)" textAnchor="start" fill="var(--text-secondary)">State 3</text>

            {/* Stationary */}
            <g transform={`translate(${bary(stat).join(',')})`}>
              <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" fill="var(--viz-green, #6fd49a)" />
            </g>

            {/* Trail */}
            {trail.slice(0, k + 1).map((p, i) => {
              const [bx, by] = bary(p);
              return <circle key={i} cx={bx} cy={by} r={i === k ? 6 : 3} fill="var(--viz-blue, #67a9ff)" fillOpacity={i === k ? 1 : 0.3 + (0.7 * i) / Math.max(1, k)} />;
            })}

            {/* x0 (draggable) */}
            <circle cx={bary(x0)[0]} cy={bary(x0)[1]} r={9} fill="var(--viz-purple, #b896ff)" style={{ cursor: 'grab' }} onPointerDown={onDragX0} />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">TRANSITION MATRIX (column-stochastic)</MonoLine>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3, marginTop: 6 }}>
              {[0, 1, 2].map((i) =>
                [0, 1, 2].map((j) => (
                  <input
                    key={`${i}${j}`}
                    type="number"
                    step={0.05}
                    min={0}
                    value={P[i][j].toFixed(2)}
                    onChange={(e) => {
                      const v = Math.max(0, parseFloat(e.target.value) || 0);
                      const next: Mat3 = P.map((row) => [...row]);
                      next[i][j] = v;
                      setP(normalizeCols(next));
                      setK(0);
                    }}
                    style={{ background: 'var(--bg-elevated, #1a1f2e)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 10, padding: 3, borderRadius: 3, width: '100%' }}
                  />
                ))
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">STATIONARY v★</MonoLine>
            <div style={{ marginTop: 6, color: 'var(--viz-green, #6fd49a)' }}>
              ({stat[0].toFixed(3)}, {stat[1].toFixed(3)}, {stat[2].toFixed(3)})
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {Object.keys(PRESETS).map((p) => (
              <VizControlButton key={p} onClick={() => { setP(normalizeCols(PRESETS[p])); setK(0); }}>{p}</VizControlButton>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <VizControlButton onClick={() => setPlaying((p) => !p)}>{playing ? 'pause' : 'play'}</VizControlButton>
            <VizControlButton onClick={() => setK((kk) => Math.min(MAX, kk + 1))}>step</VizControlButton>
            <VizControlButton onClick={() => { setK(0); setPlaying(false); }}>reset</VizControlButton>
          </div>
          <div style={{ fontSize: 10, textAlign: 'center', color: 'var(--text-tertiary)' }}>k = {k} / {MAX}</div>
        </div>
      </div>
    </div>
  );
}
