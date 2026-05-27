// 8.2 — Repeated Eigenvalues: diagonalizable (λI) vs defective (λI + N) Jordan block.
// Side-by-side: same eigenvalue, dramatically different action on unit square.

import { useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];
type Mat2 = [[number, number], [number, number]];

const W = 360;
const H = 360;
const CX = W / 2;
const CY = H / 2;
const UNIT = 50;

const SQUARE: Vec2[] = [[1, 1], [-1, 1], [-1, -1], [1, -1]];

function matPow(M: Mat2, k: number): Mat2 {
  let R: Mat2 = [[1, 0], [0, 1]];
  for (let i = 0; i < k; i++) {
    R = [
      [R[0][0] * M[0][0] + R[0][1] * M[1][0], R[0][0] * M[0][1] + R[0][1] * M[1][1]],
      [R[1][0] * M[0][0] + R[1][1] * M[1][0], R[1][0] * M[0][1] + R[1][1] * M[1][1]],
    ];
  }
  return R;
}

function apply(M: Mat2, v: Vec2): Vec2 {
  return [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
}

export function RepeatedEigenvalueViz() {
  const [lambda, setLambda] = useState(1.0);
  const [k, setK] = useState(2);
  const [testVec, setTestVec] = useState<Vec2>([0, 1]);

  const Ad: Mat2 = [[lambda, 0], [0, lambda]];
  const Aj: Mat2 = [[lambda, 1], [0, lambda]];

  const AdK = matPow(Ad, k);
  const AjK = matPow(Aj, k);

  const sqD = SQUARE.map((p) => apply(AdK, p));
  const sqJ = SQUARE.map((p) => apply(AjK, p));
  const vD = apply(AdK, testVec);
  const vJ = apply(AjK, testVec);

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  const onDragTest = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      setTestVec([Number(wx.toFixed(2)), Number(wy.toFixed(2))]);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMv);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  const renderCanvas = (
    label: string,
    M: Mat2,
    shape: Vec2[],
    v: Vec2,
    eigenvectorOnly: boolean
  ) => (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 6 }}>
      <MonoLine size={9} color="var(--text-tertiary)">{label}</MonoLine>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <GridAxes width={W} height={H} unit={UNIT} />

        {/* Original unit square outline */}
        <polygon
          points={SQUARE.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
          fill="none"
          stroke="var(--viz-blue, #67a9ff)"
          strokeWidth={1}
          strokeOpacity={0.3}
          strokeDasharray="3 3"
        />

        {/* Transformed shape */}
        <polygon
          points={shape.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
          fill="var(--viz-blue, #67a9ff)"
          fillOpacity={0.15}
          stroke="var(--viz-blue, #67a9ff)"
          strokeWidth={1.6}
        />

        {/* Eigenvector x-axis line highlighted */}
        <line
          x1={0}
          y1={CY}
          x2={W}
          y2={CY}
          stroke="var(--viz-green, #6fd49a)"
          strokeWidth={1.2}
          strokeOpacity={0.5}
        />

        {/* Generalized eigenvector (y-axis) for Jordan side */}
        {!eigenvectorOnly && (
          <line
            x1={CX}
            y1={0}
            x2={CX}
            y2={H}
            stroke="var(--viz-yellow, #ffd966)"
            strokeWidth={1.2}
            strokeOpacity={0.5}
            strokeDasharray="4 4"
          />
        )}

        {/* Test vector original */}
        <line x1={CX} y1={CY} x2={w2sX(testVec[0])} y2={w2sY(testVec[1])} stroke="var(--viz-purple, #b896ff)" strokeWidth={1.8} strokeOpacity={0.4} />
        <circle
          cx={w2sX(testVec[0])}
          cy={w2sY(testVec[1])}
          r={6}
          fill="var(--viz-purple, #b896ff)"
          fillOpacity={0.5}
          style={{ cursor: 'grab' }}
          onPointerDown={onDragTest}
        />

        {/* Test vector image */}
        <line x1={CX} y1={CY} x2={w2sX(v[0])} y2={w2sY(v[1])} stroke="var(--viz-purple, #b896ff)" strokeWidth={2.2} />
        <circle cx={w2sX(v[0])} cy={w2sY(v[1])} r={5} fill="var(--viz-purple, #b896ff)" />
      </svg>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 8px', color: 'var(--text-secondary)' }}>
        Aᵏ = [[{M[0][0].toFixed(2)}, {M[0][1].toFixed(2)}], [{M[1][0].toFixed(2)}, {M[1][1].toFixed(2)}]]
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Shared controls */}
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        <label style={{ display: 'block' }}>
          λ = {lambda.toFixed(2)}
          <input type="range" min={-2} max={2} step={0.05} value={lambda} onChange={(e) => setLambda(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          k = {k}
          <input type="range" min={0} max={8} step={1} value={k} onChange={(e) => setK(parseInt(e.target.value))} style={{ width: '100%' }} />
        </label>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <VizControlButton onClick={() => { setLambda(1); setK(2); }}>λ = 1 (Jordan-shear demo)</VizControlButton>
          <VizControlButton onClick={() => { setLambda(0.5); setK(3); }}>λ = 0.5 (contract+shear)</VizControlButton>
          <VizControlButton onClick={() => { setLambda(-1); setK(2); }}>λ = -1 (flip+shear)</VizControlButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {renderCanvas('DIAGONALIZABLE  A = λI', AdK, sqD, vD, true)}
        {renderCanvas('JORDAN BLOCK  A = λI + N', AjK, sqJ, vJ, false)}
      </div>

      <div style={{ marginTop: 10, padding: 10, background: 'rgba(111, 212, 154, 0.08)', border: '1px solid rgba(111, 212, 154, 0.4)', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
        Eigenvector direction (green): both matrices act identically. Generalized direction (yellow dashed): Jordan block shears.
      </div>
    </div>
  );
}
