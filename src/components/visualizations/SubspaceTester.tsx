// 2.3 — Subspace Tester (interactive).
// Pick a candidate region in R^2; drag two test vectors u and v; see live whether
// (i) origin is in the region, (ii) u + v is in the region, (iii) c·u is in the region.

import { useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

type Region =
  | 'line-through-origin'
  | 'half-plane-x-pos'
  | 'shifted-line'
  | 'union-of-axes'
  | 'unit-disk'
  | 'origin-only';

const W = 460;
const H = 460;
const CX = W / 2;
const CY = H / 2;
const UNIT = 70;
const TOL = 0.05;

function inRegion(v: Vec2, r: Region): boolean {
  const [x, y] = v;
  switch (r) {
    case 'line-through-origin':
      return Math.abs(y - 0.5 * x) < TOL;
    case 'half-plane-x-pos':
      return x >= -TOL;
    case 'shifted-line':
      return Math.abs(x + y - 1) < TOL;
    case 'union-of-axes':
      return Math.abs(x * y) < TOL;
    case 'unit-disk':
      return x * x + y * y <= 1 + TOL;
    case 'origin-only':
      return Math.abs(x) < TOL && Math.abs(y) < TOL;
  }
}

const REGION_LABELS: Record<Region, string> = {
  'line-through-origin': 'line through origin (y = ½x)',
  'half-plane-x-pos': 'half-plane (x ≥ 0)',
  'shifted-line': 'shifted line (x + y = 1)',
  'union-of-axes': 'union of axes (xy = 0)',
  'unit-disk': 'unit disk (x² + y² ≤ 1)',
  'origin-only': 'origin only ({0})',
};

const COUNTEREXAMPLES: Record<Region, { u: Vec2; v: Vec2; c: number } | null> = {
  'line-through-origin': null, // is a subspace
  'half-plane-x-pos': { u: [1, 0], v: [0, 0], c: -1 }, // c·u = (-1, 0) leaves region
  'shifted-line': { u: [1, 0], v: [0, 0], c: 1 }, // origin not in region
  'union-of-axes': { u: [1, 0], v: [0, 1], c: 1 }, // u+v = (1,1) leaves region
  'unit-disk': { u: [1, 0], v: [0, 0], c: 2 }, // c·u = (2, 0) leaves disk
  'origin-only': null, // is the trivial subspace
};

export function SubspaceTester() {
  const [region, setRegion] = useState<Region>('line-through-origin');
  const [u, setU] = useState<Vec2>([1, 0.5]);
  const [v, setV] = useState<Vec2>([-0.5, -0.25]);
  const [c, setC] = useState<number>(2);

  const containsZero = inRegion([0, 0], region);
  const sum: Vec2 = [u[0] + v[0], u[1] + v[1]];
  const closedAdd = inRegion(u, region) && inRegion(v, region) && inRegion(sum, region);
  const cu: Vec2 = [c * u[0], c * u[1]];
  const closedScale = inRegion(u, region) && inRegion(cu, region);

  const isSubspace = containsZero && closedAdd && closedScale;

  const showCounterexample = () => {
    const ce = COUNTEREXAMPLES[region];
    if (ce) {
      setU(ce.u);
      setV(ce.v);
      setC(ce.c);
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <select
          className="viz-preset-select"
          value={region}
          onChange={(e) => setRegion(e.target.value as Region)}
        >
          {(Object.keys(REGION_LABELS) as Region[]).map((r) => (
            <option key={r} value={r}>
              {REGION_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />
            <RegionShape region={region} />

            {/* Sum vector u+v in purple */}
            <Arrow u={sum} color="rgba(184, 150, 255, 0.85)" label="u+v" dashed />
            {/* Scaled vector c·u in green */}
            <Arrow u={cu} color="rgba(111, 212, 154, 0.85)" label={`${c}·u`} dotted />

            {/* Draggable u, v */}
            <DragArrow u={u} color="var(--viz-blue, #67a9ff)" label="u" onMove={setU} />
            <DragArrow u={v} color="var(--viz-yellow, #ffd966)" label="v" onMove={setV} />
          </svg>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">SUBSPACE CHECKS</MonoLine>
          <CheckRow label="contains 0" ok={containsZero} />
          <CheckRow label="closed under +" ok={closedAdd} />
          <CheckRow label="closed under c·" ok={closedScale} />

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginTop: 4 }}>
            <div
              style={{
                padding: 8,
                background: isSubspace ? 'rgba(111, 212, 154, 0.08)' : 'rgba(255, 123, 107, 0.06)',
                border: `1px solid ${isSubspace ? 'rgba(111, 212, 154, 0.4)' : 'rgba(255, 123, 107, 0.4)'}`,
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: isSubspace ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {isSubspace ? '✓ subspace' : '✗ NOT a subspace'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 20 }}>c</span>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 32, textAlign: 'right' }}>
              {c.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {COUNTEREXAMPLES[region] && (
          <VizControlButton onClick={showCounterexample}>find counterexample</VizControlButton>
        )}
        <VizControlButton onClick={() => { setU([1, 0.5]); setV([-0.5, -0.25]); setC(2); }}>reset vectors</VizControlButton>
      </div>
    </div>
  );
}

function CheckRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 8px',
        background: ok ? 'rgba(111, 212, 154, 0.04)' : 'rgba(255, 123, 107, 0.06)',
        borderRadius: 3,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
      }}
    >
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: ok ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)', fontWeight: 600 }}>
        {ok ? '✓' : '✗'}
      </span>
    </div>
  );
}

function RegionShape({ region }: { region: Region }) {
  const fill = 'rgba(103, 169, 255, 0.16)';
  const stroke = 'rgba(103, 169, 255, 0.5)';
  switch (region) {
    case 'line-through-origin':
      return (
        <line
          x1={CX - 5 * UNIT}
          y1={CY - (-2.5 * UNIT)}
          x2={CX + 5 * UNIT}
          y2={CY - 2.5 * UNIT}
          stroke="rgba(103, 169, 255, 0.85)"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.5}
        />
      );
    case 'half-plane-x-pos':
      return <rect x={CX} y={0} width={W - CX} height={H} fill={fill} stroke={stroke} strokeWidth={1} />;
    case 'shifted-line':
      return (
        <line
          x1={CX - 5 * UNIT}
          y1={CY - 6 * UNIT}
          x2={CX + 5 * UNIT}
          y2={CY + 4 * UNIT}
          stroke="rgba(103, 169, 255, 0.85)"
          strokeWidth={3}
          opacity={0.6}
        />
      );
    case 'union-of-axes':
      return (
        <g>
          <line x1={0} y1={CY} x2={W} y2={CY} stroke="rgba(103, 169, 255, 0.85)" strokeWidth={3} opacity={0.5} />
          <line x1={CX} y1={0} x2={CX} y2={H} stroke="rgba(103, 169, 255, 0.85)" strokeWidth={3} opacity={0.5} />
        </g>
      );
    case 'unit-disk':
      return <circle cx={CX} cy={CY} r={UNIT} fill={fill} stroke={stroke} strokeWidth={1.5} />;
    case 'origin-only':
      return <circle cx={CX} cy={CY} r={6} fill="rgba(103, 169, 255, 0.85)" />;
  }
}

function Arrow({ u, color, label, dashed, dotted }: { u: Vec2; color: string; label?: string; dashed?: boolean; dotted?: boolean }) {
  const max = 3;
  const norm = Math.hypot(u[0], u[1]);
  const f = norm > max ? max / norm : 1;
  const x2 = CX + u[0] * f * UNIT;
  const y2 = CY - u[1] * f * UNIT;
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
  const dash = dashed ? '4 4' : dotted ? '2 3' : undefined;
  return (
    <g>
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={1.6} strokeDasharray={dash} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && <text x={x2 + 5} y={y2 - 5} fontSize={9} fontFamily="var(--font-mono)" fill={color}>{label}</text>}
    </g>
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
      {label && <text x={x2 + 6} y={y2 - 6} fontSize={11} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>{label}</text>}
      <circle cx={x2} cy={y2} r={12} fill={color} fillOpacity={0.001} style={{ cursor: 'grab' }} onPointerDown={onPointerDown} />
    </g>
  );
}
