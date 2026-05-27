// 9.4 — Symmetric Spectra. Real symmetric 2x2 acts as pure stretching along
// perpendicular eigenaxes. Unit circle → ellipse; chosen vector decomposed in eigenbasis.

import { useState } from 'react';
import { computeEigen2, m2apply, type Mat2, type Vec2 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

const W = 500;
const H = 500;
const CX = W / 2;
const CY = H / 2;
const UNIT = 60;

export function SymmetricSpectraViz() {
  const [a, setA11] = useState(3);
  const [b, setB] = useState(1);
  const [d, setA22] = useState(1);
  const [x, setX] = useState<Vec2>([1.5, 1]);
  const [repeated, setRepeated] = useState(false);

  const a11 = a;
  const a12 = repeated ? 0 : b;
  const a22 = repeated ? a : d;
  const A: Mat2 = [[a11, a12], [a12, a22]];

  const eig = computeEigen2(A);

  let l1 = 0, l2 = 0;
  let v1: Vec2 = [1, 0], v2: Vec2 = [0, 1];
  if (eig.kind === 'real') {
    l1 = eig.values[0]; l2 = eig.values[1];
    v1 = eig.vectors[0]; v2 = eig.vectors[1];
  } else if (eig.kind === 'repeated') {
    l1 = eig.value; l2 = eig.value;
  }

  // Project x onto eigenbasis
  const c1 = v1[0] * x[0] + v1[1] * x[1];
  const c2 = v2[0] * x[0] + v2[1] * x[1];
  const Ax = m2apply(A, x);

  // Image ellipse
  const ellipsePts: [number, number][] = [];
  const N = 80;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 * Math.PI;
    const u: Vec2 = [Math.cos(t), Math.sin(t)];
    const img = m2apply(A, u);
    ellipsePts.push([img[0], img[1]]);
  }

  const w2sX = (xv: number) => CX + xv * UNIT;
  const w2sY = (yv: number) => CY - yv * UNIT;

  const onDragX = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      setX([Number(((sx - CX) / UNIT).toFixed(2)), Number(((CY - sy) / UNIT).toFixed(2))]);
    };
    const onUp = () => { window.removeEventListener('pointermove', onMv); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            {/* Unit circle */}
            <circle cx={CX} cy={CY} r={UNIT} fill="none" stroke="var(--viz-blue, #67a9ff)" strokeWidth={1} strokeOpacity={0.3} strokeDasharray="3 3" />
            {/* Image ellipse */}
            <polygon
              points={ellipsePts.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
              fill="var(--viz-blue, #67a9ff)" fillOpacity={0.08}
              stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.8}
            />
            {/* Eigenvector rays */}
            <line x1={w2sX(-v1[0] * 5)} y1={w2sY(-v1[1] * 5)} x2={w2sX(v1[0] * 5)} y2={w2sY(v1[1] * 5)} stroke="var(--viz-blue, #67a9ff)" strokeWidth={1.5} strokeOpacity={0.6} />
            <line x1={w2sX(-v2[0] * 5)} y1={w2sY(-v2[1] * 5)} x2={w2sX(v2[0] * 5)} y2={w2sY(v2[1] * 5)} stroke="var(--viz-yellow, #ffd966)" strokeWidth={1.5} strokeOpacity={0.6} />
            {/* x and Ax */}
            <line x1={CX} y1={CY} x2={w2sX(x[0])} y2={w2sY(x[1])} stroke="var(--viz-purple, #b896ff)" strokeWidth={2} />
            <line x1={CX} y1={CY} x2={w2sX(Ax[0])} y2={w2sY(Ax[1])} stroke="var(--viz-purple, #b896ff)" strokeWidth={2} strokeDasharray="5 3" />
            <circle cx={w2sX(x[0])} cy={w2sY(x[1])} r={8} fill="var(--viz-purple, #b896ff)" style={{ cursor: 'grab' }} onPointerDown={onDragX} />
            <text x={w2sX(x[0]) + 8} y={w2sY(x[1]) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-purple, #b896ff)">x</text>
            <text x={w2sX(Ax[0]) + 8} y={w2sY(Ax[1]) - 6} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-purple, #b896ff)">Ax</text>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SYMMETRIC MATRIX</MonoLine>
            <label style={{ display: 'block', marginTop: 6 }}>
              a₁₁ = {a.toFixed(2)}
              <input type="range" min={-3} max={3} step={0.05} value={a} onChange={(e) => setA11(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </label>
            {!repeated && (
              <>
                <label style={{ display: 'block', marginTop: 6 }}>
                  a₁₂ = {b.toFixed(2)}
                  <input type="range" min={-3} max={3} step={0.05} value={b} onChange={(e) => setB(parseFloat(e.target.value))} style={{ width: '100%' }} />
                </label>
                <label style={{ display: 'block', marginTop: 6 }}>
                  a₂₂ = {d.toFixed(2)}
                  <input type="range" min={-3} max={3} step={0.05} value={d} onChange={(e) => setA22(parseFloat(e.target.value))} style={{ width: '100%' }} />
                </label>
              </>
            )}
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <input type="checkbox" checked={repeated} onChange={(e) => setRepeated(e.target.checked)} /> repeated eigenvalue
            </label>
          </div>

          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SPECTRUM</MonoLine>
            <div style={{ marginTop: 6 }}>λ₁ = <span style={{ color: 'var(--viz-blue, #67a9ff)' }}>{l1.toFixed(3)}</span></div>
            <div>λ₂ = <span style={{ color: 'var(--viz-yellow, #ffd966)' }}>{l2.toFixed(3)}</span></div>
            <div style={{ marginTop: 6 }}>c₁ = q₁ᵀx = {c1.toFixed(3)}</div>
            <div>c₂ = q₂ᵀx = {c2.toFixed(3)}</div>
            <div style={{ marginTop: 6 }}>‖Ax‖² = λ₁²c₁² + λ₂²c₂²</div>
            <div>= {(l1 * l1 * c1 * c1 + l2 * l2 * c2 * c2).toFixed(3)}</div>
          </div>

          {repeated && (
            <div style={{ background: 'rgba(255, 217, 102, 0.08)', border: '1px solid rgba(255, 217, 102, 0.4)', borderRadius: 6, padding: 8, fontSize: 10 }}>
              λ₁ = λ₂: ANY perpendicular pair is an eigenbasis. Gram-Schmidt picks one.
            </div>
          )}

          <VizControlButton onClick={() => { setA11(3); setB(1); setA22(1); setX([1.5, 1]); setRepeated(false); }}>reset</VizControlButton>
        </div>
      </div>
    </div>
  );
}
