// 5.2 — Angles & Cauchy-Schwarz (interactive).
// Two draggable vectors u, v. Show angle arc, inner product, lengths, CS check.
// Pythagorean callout activates when u and v are orthogonal.

import { useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 460;
const H = 460;
const CX = W / 2;
const CY = H / 2;
const UNIT = 70;

export function AnglesViz() {
  const [u, setU] = useState<Vec2>([2, 0]);
  const [v, setV] = useState<Vec2>([1, 1]);

  const dot = u[0] * v[0] + u[1] * v[1];
  const normU = Math.hypot(u[0], u[1]);
  const normV = Math.hypot(v[0], v[1]);
  const product = normU * normV;
  const cos = product > 1e-9 ? dot / product : 0;
  const cosClamped = Math.max(-1, Math.min(1, cos));
  const thetaRad = Math.acos(cosClamped);
  const thetaDeg = (thetaRad * 180) / Math.PI;

  const isOrth = product > 1e-9 && Math.abs(dot) < 0.01 * product;
  const isParallel = product > 1e-9 && Math.abs(Math.abs(dot) - product) < 0.01 * product;

  const csLeft = Math.abs(dot);
  const csRight = product;

  const sumNormSq = (u[0] + v[0]) ** 2 + (u[1] + v[1]) ** 2;
  const pythagSumSq = normU * normU + normV * normV;

  // Angle arc — sample points along arc from angle of u to angle of v
  const angU = Math.atan2(u[1], u[0]);
  const angV = Math.atan2(v[1], v[0]);
  let dAng = angV - angU;
  while (dAng > Math.PI) dAng -= 2 * Math.PI;
  while (dAng < -Math.PI) dAng += 2 * Math.PI;
  const arcRadius = Math.min(36, Math.min(normU, normV) * UNIT * 0.6);
  const arcPoints: [number, number][] = [];
  if (product > 1e-6) {
    const N = 24;
    for (let i = 0; i <= N; i++) {
      const a = angU + (dAng * i) / N;
      arcPoints.push([Math.cos(a) * arcRadius, Math.sin(a) * arcRadius]);
    }
  }

  const w2sX = (x: number) => CX + x;
  const w2sY = (y: number) => CY - y;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            {/* Angle arc */}
            {arcPoints.length > 0 && (
              <polyline
                points={arcPoints.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
                fill="none"
                stroke="rgba(111, 212, 154, 0.85)"
                strokeWidth={1.6}
              />
            )}
            {arcPoints.length > 0 && (
              <text
                x={w2sX(arcPoints[Math.floor(arcPoints.length / 2)][0] * 1.4)}
                y={w2sY(arcPoints[Math.floor(arcPoints.length / 2)][1] * 1.4)}
                fontSize={11}
                fontFamily="var(--font-mono)"
                fill="rgba(111, 212, 154, 0.95)"
                textAnchor="middle"
              >
                θ = {thetaDeg.toFixed(1)}°
              </text>
            )}
            {/* Right angle marker if orthogonal */}
            {isOrth && (
              <RightAngleSquare u={u} v={v} />
            )}

            <DragArrow u={u} color="var(--viz-blue, #67a9ff)" label="u" onMove={setU} />
            <DragArrow u={v} color="var(--viz-yellow, #ffd966)" label="v" onMove={setV} />
          </svg>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <MonoLine size={9} color="var(--text-tertiary)">QUANTITIES</MonoLine>
          <div>⟨u, v⟩ = <span style={{ color: 'var(--accent-bright, #67a9ff)' }}>{dot.toFixed(2)}</span></div>
          <div>‖u‖ = {normU.toFixed(2)}</div>
          <div>‖v‖ = {normV.toFixed(2)}</div>
          <div>cos θ = {cosClamped.toFixed(3)}</div>
          <div>θ = {thetaDeg.toFixed(1)}° = {thetaRad.toFixed(3)} rad</div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">CAUCHY-SCHWARZ</MonoLine>
            <div style={{ marginTop: 4 }}>
              |⟨u,v⟩| = {csLeft.toFixed(2)} ≤ ‖u‖·‖v‖ = {csRight.toFixed(2)}
            </div>
            <div style={{ color: 'rgba(111, 212, 154, 1)', fontWeight: 600 }}>✓ holds (always)</div>
            {isParallel && (
              <div style={{ color: 'rgba(255, 217, 102, 0.95)', fontStyle: 'italic', marginTop: 2 }}>
                equality! u, v linearly dependent
              </div>
            )}
          </div>
        </div>
      </div>

      {isOrth && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: 'rgba(111, 212, 154, 0.08)',
            border: '1px solid rgba(111, 212, 154, 0.4)',
            borderRadius: 6,
            textAlign: 'center',
            fontSize: 13,
          }}
        >
          <InlineMath math={`u \\perp v \\;\\Rightarrow\\; \\|u + v\\|^2 = \\|u\\|^2 + \\|v\\|^2 \\;:\\; ${sumNormSq.toFixed(2)} = ${pythagSumSq.toFixed(2)} \\;\\checkmark`} />
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton
          onClick={() => {
            // Make v perpendicular to u
            const n = Math.hypot(u[0], u[1]);
            if (n > 1e-6) setV([(-u[1] * n) / n, (u[0] * n) / n]);
          }}
        >
          make ⊥
        </VizControlButton>
        <VizControlButton
          onClick={() => setV([u[0], u[1]])}
        >
          make ‖
        </VizControlButton>
        <VizControlButton
          onClick={() => {
            setU([2, 0]);
            setV([1, 1]);
          }}
        >
          reset
        </VizControlButton>
      </div>
    </div>
  );
}

function RightAngleSquare({ u, v }: { u: Vec2; v: Vec2 }) {
  const nU = Math.hypot(u[0], u[1]);
  const nV = Math.hypot(v[0], v[1]);
  if (nU < 1e-6 || nV < 1e-6) return null;
  const size = 14;
  const uHat: Vec2 = [(u[0] / nU) * size, (u[1] / nU) * size];
  const vHat: Vec2 = [(v[0] / nV) * size, (v[1] / nV) * size];
  const a = [CX + uHat[0], CY - uHat[1]];
  const b = [CX + uHat[0] + vHat[0], CY - uHat[1] - vHat[1]];
  const c = [CX + vHat[0], CY - vHat[1]];
  return (
    <polyline
      points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`}
      fill="none"
      stroke="rgba(111, 212, 154, 0.95)"
      strokeWidth={1.4}
    />
  );
}

function DragArrow({ u, color, label, onMove }: { u: Vec2; color: string; label?: string; onMove: (v: Vec2) => void }) {
  const max = 3;
  const norm = Math.hypot(u[0], u[1]);
  const f = norm > max ? max / norm : 1;
  const x2 = CX + u[0] * f * UNIT;
  const y2 = CY - u[1] * f * UNIT;
  const dx = x2 - CX;
  const dy = y2 - CY;
  const len = Math.hypot(dx, dy);
  const ux = len > 0 ? dx / len : 0;
  const uy = len > 0 ? dy / len : 0;
  const ah = 8;
  const ax = x2 - ux * ah - uy * ah * 0.5;
  const ay = y2 - uy * ah + ux * ah * 0.5;
  const bx = x2 - ux * ah + uy * ah * 0.5;
  const by = y2 - uy * ah - ux * ah * 0.5;

  const onPointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      onMove([Number(wx.toFixed(2)), Number(wy.toFixed(2))]);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMv);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <g>
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={2.4} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && <text x={x2 + 6} y={y2 - 6} fontSize={12} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>{label}</text>}
      <circle cx={x2} cy={y2} r={10} fill={color} fillOpacity={0.001} style={{ cursor: 'grab' }} onPointerDown={onPointerDown} />
    </g>
  );
}
