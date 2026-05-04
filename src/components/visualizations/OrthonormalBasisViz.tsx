// 5.3 — Orthonormal Basis (interactive).
// Rotated orthonormal basis {q1, q2}. Vector v is decomposed via inner products:
// c_i = ⟨v, q_i⟩. Parseval verified: ‖v‖² = c1² + c2².

import { useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 460;
const H = 460;
const CX = W / 2;
const CY = H / 2;
const UNIT = 70;

export function OrthonormalBasisViz() {
  const [theta, setTheta] = useState<number>(0);
  const [v, setV] = useState<Vec2>([2, 1]);

  const q1: Vec2 = [Math.cos(theta), Math.sin(theta)];
  const q2: Vec2 = [-Math.sin(theta), Math.cos(theta)];

  const c1 = v[0] * q1[0] + v[1] * q1[1];
  const c2 = v[0] * q2[0] + v[1] * q2[1];

  const normSq = v[0] * v[0] + v[1] * v[1];
  const parsevalSum = c1 * c1 + c2 * c2;
  const parsevalOk = Math.abs(normSq - parsevalSum) < 1e-4;

  // Projection onto q1: point at c1 * q1
  const proj1: Vec2 = [c1 * q1[0], c1 * q1[1]];
  const proj2: Vec2 = [c2 * q2[0], c2 * q2[1]];

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, alignItems: 'start' }}>
        {/* ── Plane ──────────────────────────────────── */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Projection lines: from v perpendicular to q1 (drops to proj1), and to q2 */}
            <line x1={w2sX(v[0])} y1={w2sY(v[1])} x2={w2sX(proj1[0])} y2={w2sY(proj1[1])} stroke="rgba(184, 150, 255, 0.5)" strokeWidth={1.2} strokeDasharray="3 3" />
            <line x1={w2sX(v[0])} y1={w2sY(v[1])} x2={w2sX(proj2[0])} y2={w2sY(proj2[1])} stroke="rgba(184, 150, 255, 0.5)" strokeWidth={1.2} strokeDasharray="3 3" />

            {/* q1, q2 — extend as long lines (the basis directions) */}
            <line x1={w2sX(-q1[0] * 5)} y1={w2sY(-q1[1] * 5)} x2={w2sX(q1[0] * 5)} y2={w2sY(q1[1] * 5)} stroke="rgba(103, 169, 255, 0.25)" strokeWidth={1} />
            <line x1={w2sX(-q2[0] * 5)} y1={w2sY(-q2[1] * 5)} x2={w2sX(q2[0] * 5)} y2={w2sY(q2[1] * 5)} stroke="rgba(103, 169, 255, 0.25)" strokeWidth={1} />

            {/* q1, q2 unit arrows */}
            <BasisArrow u={q1} color="var(--viz-blue, #67a9ff)" label="q₁" />
            <BasisArrow u={q2} color="var(--viz-blue, #67a9ff)" label="q₂" dashed />

            {/* Projection points on q1, q2 */}
            <circle cx={w2sX(proj1[0])} cy={w2sY(proj1[1])} r={4} fill="rgba(184, 150, 255, 0.95)" />
            <circle cx={w2sX(proj2[0])} cy={w2sY(proj2[1])} r={4} fill="rgba(184, 150, 255, 0.95)" />

            {/* v as purple thick arrow */}
            <DragArrow u={v} color="rgba(184, 150, 255, 0.95)" label="v" onMove={setV} thick />
          </svg>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 4 }}>
            dashed lines = projections from v onto q₁, q₂
          </div>
        </div>

        {/* ── Right panel ─────────────────────────────── */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <MonoLine size={9} color="var(--text-tertiary)">COORDINATES</MonoLine>
          <div>c₁ = ⟨v, q₁⟩ = <span style={{ color: 'var(--accent-bright, #67a9ff)' }}>{c1.toFixed(2)}</span></div>
          <div>c₂ = ⟨v, q₂⟩ = <span style={{ color: 'var(--accent-bright, #67a9ff)' }}>{c2.toFixed(2)}</span></div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            <MonoLine size={9} color="var(--text-tertiary)">PARSEVAL</MonoLine>
            <div style={{ marginTop: 4, fontSize: 12 }}>
              <InlineMath math={`\\|v\\|^2 = ${normSq.toFixed(2)}`} />
            </div>
            <div style={{ fontSize: 12 }}>
              <InlineMath math={`c_1^2 + c_2^2 = ${parsevalSum.toFixed(2)}`} />
            </div>
            <div style={{ color: parsevalOk ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)', fontWeight: 600, marginTop: 4 }}>
              {parsevalOk ? '✓ Parseval holds' : '✗ numerical error'}
            </div>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 11,
              color: 'var(--text-tertiary)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 8,
              lineHeight: 1.4,
            }}
          >
            same v · norm constant · coordinates change as basis rotates
          </div>
        </div>
      </div>

      {/* ── Rotation slider ──────────────────────────── */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 80 }}>basis angle θ</span>
        <input
          type="range"
          min={0}
          max={Math.PI / 2}
          step={Math.PI / 180}
          value={theta}
          onChange={(e) => setTheta(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 50, textAlign: 'right' }}>
          {((theta * 180) / Math.PI).toFixed(0)}°
        </span>
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton onClick={() => setTheta(0)}>θ = 0 (standard)</VizControlButton>
        <VizControlButton onClick={() => setTheta(Math.PI / 6)}>θ = 30°</VizControlButton>
        <VizControlButton onClick={() => setTheta(Math.PI / 4)}>θ = 45°</VizControlButton>
        <VizControlButton onClick={() => { setTheta(0); setV([2, 1]); }}>reset</VizControlButton>
      </div>
    </div>
  );
}

function BasisArrow({ u, color, label, dashed }: { u: Vec2; color: string; label: string; dashed?: boolean }) {
  const x2 = CX + u[0] * UNIT;
  const y2 = CY - u[1] * UNIT;
  const dx = x2 - CX;
  const dy = y2 - CY;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const ah = 6;
  const ax = x2 - ux * ah - uy * ah * 0.5;
  const ay = y2 - uy * ah + ux * ah * 0.5;
  const bx = x2 - ux * ah + uy * ah * 0.5;
  const by = y2 - uy * ah - ux * ah * 0.5;
  return (
    <g>
      <line
        x1={CX}
        y1={CY}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? '5 5' : undefined}
      />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      <text x={x2 + 4} y={y2 - 4} fontSize={11} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>{label}</text>
    </g>
  );
}

function DragArrow({ u, color, label, onMove, thick }: { u: Vec2; color: string; label?: string; onMove: (v: Vec2) => void; thick?: boolean }) {
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
  const ah = thick ? 9 : 7;
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
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={thick ? 3 : 2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && <text x={x2 + 6} y={y2 - 6} fontSize={12} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>{label}</text>}
      <circle cx={x2} cy={y2} r={10} fill={color} fillOpacity={0.001} style={{ cursor: 'grab' }} onPointerDown={onPointerDown} />
    </g>
  );
}
