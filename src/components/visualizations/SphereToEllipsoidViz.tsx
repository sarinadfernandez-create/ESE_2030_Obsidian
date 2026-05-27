// 10.1 — Spheres → Ellipsoids (flagship). The unit circle under A becomes an
// ellipse; semi-axes are the singular values, and they point along the left
// singular vectors. Right singular vectors are the preimages on the unit circle.

import { useMemo, useState } from 'react';
import { m2apply, ellipseFromMatrix2x2, smallestSV2x2, operatorNorm2x2, type Mat2, type Vec2 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

const W = 520;
const H = 520;
const CX = W / 2;
const CY = H / 2;
const UNIT = 60;

const PRESETS: Record<string, Mat2> = {
  rotation: [[Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6)], [Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)]],
  stretch: [[3, 0], [0, 1]],
  shear: [[1, 1], [0, 1]],
  rank1: [[1, 1], [1, 1]],
  reflection: [[1, 0], [0, -1]],
};

// Compute right singular vectors (eigenvectors of A^T A).
function rightSingularVectors(A: Mat2): { v1: Vec2; v2: Vec2 } {
  const [a, b] = A[0];
  const [c, d] = A[1];
  const m00 = a * a + c * c;
  const m11 = b * b + d * d;
  const m01 = a * b + c * d;
  const tr = m00 + m11;
  const det = m00 * m11 - m01 * m01;
  const disc = Math.max(0, tr * tr - 4 * det);
  const sqrtD = Math.sqrt(disc);
  const lambda1 = (tr + sqrtD) / 2;
  let v1: Vec2;
  if (Math.abs(m01) > 1e-10) {
    v1 = [lambda1 - m11, m01];
  } else {
    v1 = m00 >= m11 ? [1, 0] : [0, 1];
  }
  const n1 = Math.hypot(v1[0], v1[1]) || 1;
  v1 = [v1[0] / n1, v1[1] / n1];
  const v2: Vec2 = [-v1[1], v1[0]];
  return { v1, v2 };
}

export function SphereToEllipsoidViz() {
  const [A, setA] = useState<Mat2>(PRESETS.shear);
  const [probe, setProbe] = useState<Vec2>([1, 0]);
  const [showProbe, setShowProbe] = useState(true);

  const sigma1 = operatorNorm2x2(A);
  const sigma2 = smallestSV2x2(A);
  const ellipse = useMemo(() => ellipseFromMatrix2x2(A), [A]);
  const { v1, v2 } = useMemo(() => rightSingularVectors(A), [A]);

  // u_i = A v_i / sigma_i
  const u1raw = m2apply(A, v1);
  const u2raw = m2apply(A, v2);
  const u1: Vec2 = sigma1 > 1e-10 ? [u1raw[0] / sigma1, u1raw[1] / sigma1] : [1, 0];
  const u2: Vec2 = sigma2 > 1e-10 ? [u2raw[0] / sigma2, u2raw[1] / sigma2] : [-u1[1], u1[0]];

  // Normalize probe to unit length on circle
  const probeNorm = Math.hypot(probe[0], probe[1]) || 1;
  const probeUnit: Vec2 = [probe[0] / probeNorm, probe[1] / probeNorm];
  const probeImage = m2apply(A, probeUnit);

  // Sample ellipse points
  const ellipsePts: [number, number][] = [];
  const N = 120;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 * Math.PI;
    const u: Vec2 = [Math.cos(t), Math.sin(t)];
    const img = m2apply(A, u);
    ellipsePts.push([img[0], img[1]]);
  }

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  const onDragProbe = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      const n = Math.hypot(wx, wy) || 1;
      setProbe([wx / n, wy / n]);
    };
    const onUp = () => { window.removeEventListener('pointermove', onMv); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  const isRank1 = sigma2 < 1e-4 * Math.max(sigma1, 1);

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Unit circle */}
            <circle cx={CX} cy={CY} r={UNIT} fill="none" stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.2} strokeOpacity={0.5} strokeDasharray="3 3" />

            {/* Image ellipse */}
            <polygon
              points={ellipsePts.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
              fill="var(--viz-purple, #b896ff)"
              fillOpacity={0.1}
              stroke="var(--viz-purple, #b896ff)"
              strokeWidth={1.8}
            />

            {/* Right singular vectors (on unit circle) */}
            <line x1={CX} y1={CY} x2={w2sX(v1[0])} y2={w2sY(v1[1])} stroke="var(--viz-blue, #67a9ff)" strokeWidth={2} strokeDasharray="5 3" />
            <line x1={CX} y1={CY} x2={w2sX(v2[0])} y2={w2sY(v2[1])} stroke={isRank1 ? 'var(--viz-red, #ff7b6b)' : 'var(--viz-yellow, #ffd966)'} strokeWidth={2} strokeDasharray="5 3" />
            <text x={w2sX(v1[0]) + 6} y={w2sY(v1[1]) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-blue, #67a9ff)">v₁</text>
            <text x={w2sX(v2[0]) + 6} y={w2sY(v2[1]) - 6} fontSize={11} fontFamily="var(--font-mono)" fill={isRank1 ? 'var(--viz-red, #ff7b6b)' : 'var(--viz-yellow, #ffd966)'}>v₂</text>

            {/* Left singular vectors (semi-axes of ellipse, length sigma_i) */}
            <line x1={CX} y1={CY} x2={w2sX(u1[0] * sigma1)} y2={w2sY(u1[1] * sigma1)} stroke="var(--viz-blue, #67a9ff)" strokeWidth={2.6} />
            {!isRank1 && (
              <line x1={CX} y1={CY} x2={w2sX(u2[0] * sigma2)} y2={w2sY(u2[1] * sigma2)} stroke="var(--viz-yellow, #ffd966)" strokeWidth={2.6} />
            )}
            <text x={w2sX(u1[0] * sigma1) + 6} y={w2sY(u1[1] * sigma1) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-blue, #67a9ff)">σ₁u₁ = {sigma1.toFixed(3)}</text>
            {!isRank1 && (
              <text x={w2sX(u2[0] * sigma2) + 6} y={w2sY(u2[1] * sigma2) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-yellow, #ffd966)">σ₂u₂ = {sigma2.toFixed(3)}</text>
            )}

            {/* Probe */}
            {showProbe && (
              <>
                <line x1={w2sX(probeUnit[0])} y1={w2sY(probeUnit[1])} x2={w2sX(probeImage[0])} y2={w2sY(probeImage[1])} stroke="var(--viz-green, #6fd49a)" strokeWidth={1} strokeOpacity={0.5} strokeDasharray="2 3" />
                <circle cx={w2sX(probeUnit[0])} cy={w2sY(probeUnit[1])} r={8} fill="var(--viz-green, #6fd49a)" fillOpacity={0.7} stroke="white" strokeWidth={1.2} style={{ cursor: 'grab' }} onPointerDown={onDragProbe} />
                <circle cx={w2sX(probeImage[0])} cy={w2sY(probeImage[1])} r={6} fill="var(--viz-green, #6fd49a)" />
              </>
            )}
          </svg>
          {isRank1 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--viz-red, #ff7b6b)', padding: 6 }}>
              σ₂ = 0: rank-1; image collapses to a line segment. v₂ is the kernel direction.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
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
                    }}
                    style={{ background: 'var(--bg-elevated, #1a1f2e)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 11, padding: 4, borderRadius: 4 }}
                  />
                ))
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SINGULAR VALUES</MonoLine>
            <div style={{ marginTop: 6 }}>σ₁ = <span style={{ color: 'var(--viz-blue, #67a9ff)' }}>{sigma1.toFixed(3)}</span></div>
            <div>σ₂ = <span style={{ color: 'var(--viz-yellow, #ffd966)' }}>{sigma2.toFixed(3)}</span></div>
            <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-secondary)' }}>ellipse angle: {((ellipse.angle * 180) / Math.PI).toFixed(1)}°</div>
          </div>

          <label style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={showProbe} onChange={(e) => setShowProbe(e.target.checked)} /> show probe vector
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {Object.keys(PRESETS).map((name) => (
              <VizControlButton key={name} onClick={() => setA(PRESETS[name])}>{name}</VizControlButton>
            ))}
            <VizControlButton onClick={() => setA([[1, 0], [0, 1]])}>reset</VizControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}
