// 8.5 — Computing Eigenvalues. Trace-determinant diagram for 2x2 matrices,
// with discriminant parabola separating real-distinct / repeated / complex-pair regions.
// Eigenvalues plotted in the complex plane; the (tr, det) point is draggable.

import { useState } from 'react';
import { MonoLine, VizControlButton } from './_shared';

const W = 460;
const H = 460;
const CX = W / 2;
const CY = H / 2;

const TD_W = 320;
const TD_H = 320;
const TD_UNIT = 40; // pixels per (tr or det) unit

// Complex plane: maps complex z to canvas
const C_UNIT = 60;
const cmplxX = (re: number) => CX + re * C_UNIT;
const cmplxY = (im: number) => CY - im * C_UNIT;

// Trace-determinant plane
const tdX = (tr: number) => TD_W / 2 + tr * TD_UNIT;
const tdY = (det: number) => TD_H / 2 - det * TD_UNIT;

export function QRAlgorithmViz() {
  const [tr, setTr] = useState(1.5);
  const [det, setDet] = useState(0.5);
  const [symmetric, setSymmetric] = useState(false);
  const [offDiag, setOffDiag] = useState(0.5);

  // For symmetric mode, constrain det = (tr/2)^2 - offDiag^2 + (a-d)/2 contribution
  // Simpler: with symmetric a, d entries and off-diagonal b:
  // det = a*d - b^2; tr = a+d. Force a = d (so det = a^2 - b^2 = (tr/2)^2 - b^2)
  const effDet = symmetric ? (tr / 2) ** 2 - offDiag ** 2 : det;
  const discriminant = tr * tr - 4 * effDet;

  let l1: { re: number; im: number };
  let l2: { re: number; im: number };
  if (discriminant >= 0) {
    const sq = Math.sqrt(discriminant);
    l1 = { re: (tr + sq) / 2, im: 0 };
    l2 = { re: (tr - sq) / 2, im: 0 };
  } else {
    const sq = Math.sqrt(-discriminant);
    l1 = { re: tr / 2, im: sq / 2 };
    l2 = { re: tr / 2, im: -sq / 2 };
  }

  // Matrix display
  let a11: number, a12: number, a21: number, a22: number;
  if (symmetric) {
    a11 = tr / 2;
    a22 = tr / 2;
    a12 = offDiag;
    a21 = offDiag;
  } else {
    a11 = tr;
    a22 = 0;
    a12 = -effDet;
    a21 = 1;
  }

  const regimeLabel =
    Math.abs(discriminant) < 1e-3
      ? 'Repeated eigenvalue'
      : discriminant > 0
      ? 'Real distinct'
      : 'Complex conjugate pair';

  const onDragTd = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * TD_W;
      const sy = ((ev.clientY - rect.top) / rect.height) * TD_H;
      const newTr = (sx - TD_W / 2) / TD_UNIT;
      const newDet = (TD_H / 2 - sy) / TD_UNIT;
      setTr(Number(newTr.toFixed(2)));
      if (!symmetric) setDet(Number(newDet.toFixed(2)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMv);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  // Parabola path
  const parabolaPoints: string[] = [];
  for (let t = -4; t <= 4; t += 0.05) {
    parabolaPoints.push(`${tdX(t)},${tdY((t * t) / 4)}`);
  }

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 14, alignItems: 'start' }}>
        {/* Complex plane (eigenvalues) */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">EIGENVALUES IN COMPLEX PLANE</MonoLine>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            {/* Axes */}
            <line x1={0} y1={CY} x2={W} y2={CY} stroke="var(--viz-axis, #555)" strokeWidth={1} />
            <line x1={CX} y1={0} x2={CX} y2={H} stroke="var(--viz-axis, #555)" strokeWidth={1} />
            {/* Grid */}
            {[-4, -3, -2, -1, 1, 2, 3, 4].map((g) => (
              <g key={g} opacity={0.3}>
                <line x1={cmplxX(g)} y1={0} x2={cmplxX(g)} y2={H} stroke="var(--viz-grid, #444)" strokeWidth={0.5} />
                <line x1={0} y1={cmplxY(g)} x2={W} y2={cmplxY(g)} stroke="var(--viz-grid, #444)" strokeWidth={0.5} />
              </g>
            ))}
            {/* Eigenvalue dots */}
            <circle cx={cmplxX(l1.re)} cy={cmplxY(l1.im)} r={8} fill="var(--viz-blue, #67a9ff)" />
            <circle cx={cmplxX(l2.re)} cy={cmplxY(l2.im)} r={8} fill="var(--viz-blue, #67a9ff)" fillOpacity={0.7} />
            <text x={cmplxX(l1.re) + 10} y={cmplxY(l1.im) - 8} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-blue, #67a9ff)">
              λ₁
            </text>
            <text x={cmplxX(l2.re) + 10} y={cmplxY(l2.im) - 8} fontSize={11} fontFamily="var(--font-mono)" fill="var(--viz-blue, #67a9ff)" opacity={0.7}>
              λ₂
            </text>
          </svg>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 4, color: 'var(--text-secondary)' }}>
            λ = ({l1.re.toFixed(3)}{l1.im >= 0 ? ' + ' : ' − '}{Math.abs(l1.im).toFixed(3)}i), ({l2.re.toFixed(3)}{l2.im >= 0 ? ' + ' : ' − '}{Math.abs(l2.im).toFixed(3)}i)
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* (tr, det) plane */}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">(TRACE, DETERMINANT) PLANE</MonoLine>
            <svg viewBox={`0 0 ${TD_W} ${TD_H}`} width="100%" style={{ display: 'block', marginTop: 4 }}>
              {/* Regions */}
              <rect x={0} y={0} width={TD_W} height={TD_H} fill="rgba(255, 123, 107, 0.06)" />
              {/* Below-parabola region (real distinct) */}
              <polygon
                points={`0,${TD_H} ${parabolaPoints.join(' ')} ${TD_W},${TD_H}`}
                fill="rgba(103, 169, 255, 0.08)"
              />
              {/* Parabola curve */}
              <polyline points={parabolaPoints.join(' ')} fill="none" stroke="var(--viz-yellow, #ffd966)" strokeWidth={2} />
              {/* Axes */}
              <line x1={0} y1={TD_H / 2} x2={TD_W} y2={TD_H / 2} stroke="var(--viz-axis, #555)" strokeWidth={0.8} />
              <line x1={TD_W / 2} y1={0} x2={TD_W / 2} y2={TD_H} stroke="var(--viz-axis, #555)" strokeWidth={0.8} />
              {/* Draggable point */}
              <circle cx={tdX(tr)} cy={tdY(effDet)} r={7} fill="var(--viz-purple, #b896ff)" stroke="white" strokeWidth={1.5} style={{ cursor: 'grab' }} onPointerDown={onDragTd} />
              {/* Axis labels */}
              <text x={TD_W - 30} y={TD_H / 2 - 4} fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">tr</text>
              <text x={TD_W / 2 + 4} y={12} fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">det</text>
            </svg>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginTop: 4 }}>
              tr = {tr.toFixed(2)}, det = {effDet.toFixed(2)}<br />
              discriminant = {discriminant.toFixed(3)}<br />
              <span style={{ color: discriminant > 0 ? 'var(--viz-blue, #67a9ff)' : discriminant < 0 ? 'var(--viz-red, #ff7b6b)' : 'var(--viz-yellow, #ffd966)' }}>
                {regimeLabel}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <label style={{ display: 'block' }}>
              trace = {tr.toFixed(2)}
              <input type="range" min={-4} max={4} step={0.05} value={tr} onChange={(e) => setTr(parseFloat(e.target.value))} style={{ width: '100%' }} />
            </label>
            {!symmetric && (
              <label style={{ display: 'block', marginTop: 6 }}>
                det = {det.toFixed(2)}
                <input type="range" min={-4} max={4} step={0.05} value={det} onChange={(e) => setDet(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </label>
            )}
            {symmetric && (
              <label style={{ display: 'block', marginTop: 6 }}>
                off-diag = {offDiag.toFixed(2)}
                <input type="range" min={-3} max={3} step={0.05} value={offDiag} onChange={(e) => setOffDiag(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </label>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <input type="checkbox" checked={symmetric} onChange={(e) => setSymmetric(e.target.checked)} /> symmetric matrix
            </label>
          </div>

          {/* Matrix readout */}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <MonoLine size={9} color="var(--text-tertiary)">EXAMPLE MATRIX</MonoLine>
            <div style={{ marginTop: 4 }}>
              [[{a11.toFixed(2)}, {a12.toFixed(2)}], [{a21.toFixed(2)}, {a22.toFixed(2)}]]
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6 }}>
              λ = (tr ± √(tr²−4·det)) / 2
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <VizControlButton onClick={() => { setTr(2); setDet(0); setSymmetric(false); }}>real saddle</VizControlButton>
            <VizControlButton onClick={() => { setTr(0); setDet(2); setSymmetric(false); }}>pure rotation</VizControlButton>
            <VizControlButton onClick={() => { setTr(2); setDet(1); setSymmetric(false); }}>repeated</VizControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}
