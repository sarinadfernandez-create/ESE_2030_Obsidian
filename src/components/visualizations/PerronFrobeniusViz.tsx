// 9.3 — Perron-Frobenius. Positive 2x2 matrix; Perron eigenvector lives in the
// positive quadrant; multiple seed vectors iterate and converge to it.

import { useState } from 'react';
import { computeEigen2, m2apply, v2norm, type Mat2, type Vec2 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

const W = 500;
const H = 500;
const CX = W / 2;
const CY = H / 2;
const UNIT = 50;

const SEEDS_START: Vec2[] = [
  [3, 1], [2, 3], [4, 2], [1, 4],
];

export function PerronFrobeniusViz() {
  const [a, setA] = useState<Mat2>([[2, 1], [1, 3]]);
  const [signMode, setSignMode] = useState<'positive' | 'oneNeg' | 'negA'>('positive');
  const [k, setK] = useState(10);

  // Adjusted matrix per mode
  let M: Mat2 = a;
  if (signMode === 'oneNeg') M = [[a[0][0], -a[0][1]], [a[1][0], a[1][1]]];
  if (signMode === 'negA') M = [[-a[0][0], -a[0][1]], [-a[1][0], -a[1][1]]];

  const eig = computeEigen2(M);

  // Normalize each seed iterate to keep on canvas
  const normalize = (v: Vec2): Vec2 => {
    const n = v2norm(v);
    return n > 1e-12 ? [v[0] / n * 4, v[1] / n * 4] : v;
  };
  const trails: Vec2[][] = SEEDS_START.map((seed) => {
    const arr: Vec2[] = [seed];
    let cur = seed;
    for (let i = 0; i < k; i++) {
      cur = normalize(m2apply(M, cur));
      arr.push(cur);
    }
    return arr;
  });

  // Perron direction (largest-modulus real eigenvalue with positive vector for positive M)
  let perron: Vec2 | null = null;
  let perronVal: number | null = null;
  if (eig.kind === 'real') {
    const [l1, l2] = eig.values;
    const [v1, v2] = eig.vectors;
    if (Math.abs(l1) >= Math.abs(l2)) {
      perron = v1[0] >= 0 ? v1 : [-v1[0], -v1[1]];
      perronVal = l1;
    } else {
      perron = v2[0] >= 0 ? v2 : [-v2[0], -v2[1]];
      perronVal = l2;
    }
  }

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            {/* Highlight positive quadrant */}
            <rect x={CX} y={0} width={CX} height={CY} fill="rgba(111, 212, 154, 0.05)" />
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Perron eigenvector ray */}
            {perron && (
              <line
                x1={CX} y1={CY}
                x2={w2sX(perron[0] * 5)} y2={w2sY(perron[1] * 5)}
                stroke="var(--viz-green, #6fd49a)" strokeWidth={3} strokeOpacity={0.8}
              />
            )}

            {/* Trails */}
            {trails.map((trail, ti) => (
              <g key={ti}>
                {trail.slice(0, k + 1).map((v, i) => i > 0 && (
                  <line key={i} x1={w2sX(trail[i - 1][0])} y1={w2sY(trail[i - 1][1])} x2={w2sX(v[0])} y2={w2sY(v[1])} stroke="var(--viz-blue, #67a9ff)" strokeWidth={0.8} strokeOpacity={0.3} />
                ))}
                {trail.slice(0, k + 1).map((v, i) => (
                  <circle key={i} cx={w2sX(v[0])} cy={w2sY(v[1])} r={i === k ? 5 : 2} fill={`hsl(${(ti * 73) % 360}, 60%, 60%)`} fillOpacity={i === k ? 1 : 0.35} />
                ))}
              </g>
            ))}
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <MonoLine size={9} color="var(--text-tertiary)">POSITIVE MATRIX A</MonoLine>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 6 }}>
              {[0, 1].map((i) =>
                [0, 1].map((j) => (
                  <input
                    key={`${i}${j}`}
                    type="number"
                    step={0.1}
                    min={0}
                    value={a[i][j]}
                    onChange={(e) => {
                      const v = Math.max(0, parseFloat(e.target.value) || 0);
                      const next: Mat2 = [[a[0][0], a[0][1]], [a[1][0], a[1][1]]];
                      next[i][j] = v;
                      setA(next);
                    }}
                    style={{ background: 'var(--bg-elevated, #1a1f2e)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 11, padding: 4, borderRadius: 4 }}
                  />
                ))
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <MonoLine size={9} color="var(--text-tertiary)">PERRON SPECTRUM</MonoLine>
            {perronVal !== null && perron && (
              <>
                <div style={{ marginTop: 6 }}>λ★ = <span style={{ color: 'var(--viz-green, #6fd49a)' }}>{perronVal.toFixed(3)}</span></div>
                <div>v★ ≈ ({perron[0].toFixed(2)}, {perron[1].toFixed(2)})</div>
              </>
            )}
            {eig.kind === 'complex' && (
              <div style={{ color: 'var(--viz-red, #ff7b6b)' }}>Complex eigenvalues — hypothesis violated</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SIGN MODE</MonoLine>
            {(['positive', 'oneNeg', 'negA'] as const).map((mode) => (
              <VizControlButton key={mode} onClick={() => setSignMode(mode)}>
                {signMode === mode ? '✓ ' : ''}{mode === 'positive' ? 'all positive' : mode === 'oneNeg' ? 'flip one entry' : 'use −A'}
              </VizControlButton>
            ))}
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <label>
              iterations k = {k}
              <input type="range" min={0} max={20} step={1} value={k} onChange={(e) => setK(parseInt(e.target.value))} style={{ width: '100%' }} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
