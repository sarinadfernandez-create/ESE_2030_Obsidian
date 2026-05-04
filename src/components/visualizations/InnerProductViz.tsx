// 5.1 — Inner Products (interactive).
// Standard vs weighted inner product on R^2. The unit "circle" deforms into an ellipse
// under a weighted inner product, and orthogonality changes accordingly.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, NumberCell, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 460;
const H = 460;
const CX = W / 2;
const CY = H / 2;
const UNIT = 70;

type Choice = 'standard' | 'weighted';

export function InnerProductViz() {
  const [choice, setChoice] = useState<Choice>('standard');
  const [u, setU] = useState<Vec2>([1.5, 0.5]);
  const [v, setV] = useState<Vec2>([0.5, -1]);
  // Default M is positive definite, distinct from identity.
  const [M, setM] = useState<number[][]>([
    [2, 1],
    [1, 3],
  ]);

  // Use M only when choice is weighted; standard => identity-like.
  const Meff = choice === 'weighted' ? M : [
    [1, 0],
    [0, 1],
  ];

  const ipUV = inner(u, v, Meff);
  const ipUU = inner(u, u, Meff);
  const ipVV = inner(v, v, Meff);
  const normU = Math.sqrt(Math.max(0, ipUU));
  const normV = Math.sqrt(Math.max(0, ipVV));
  const cosTheta = normU > 1e-9 && normV > 1e-9 ? ipUV / (normU * normV) : 0;
  const angle = Math.max(-1, Math.min(1, cosTheta));
  const thetaDeg = (Math.acos(angle) * 180) / Math.PI;
  const isOrth = Math.abs(ipUV) < 1e-3 * Math.max(1, normU * normV);

  // Validate weighted M.
  const Mvalid = M[0][0] > 0 && M[0][0] * M[1][1] - M[0][1] * M[1][0] > 0 && Math.abs(M[0][1] - M[1][0]) < 1e-6;
  const MvalidActive = choice === 'standard' ? true : Mvalid;

  // Setting M with symmetry constraint (off-diagonal entries linked).
  const setMEntry = (r: number, c: number, val: number) => {
    setM((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = val;
      // Mirror off-diagonal
      if (r === 0 && c === 1) next[1][0] = val;
      if (r === 1 && c === 0) next[0][1] = val;
      return next;
    });
  };

  // Sample the unit "circle" of the active inner product.
  // For weighted: ||v||_M = 1 means v^T M v = 1 — an ellipse.
  // Parameterize: v(t) = R(t)(1/sqrt(λ_i)) where R diagonalizes M.
  // Easier: sample as sphere then transform by L^-T where M = L L^T (Cholesky-ish).
  const unitCirclePoints = useMemo(() => {
    if (!MvalidActive) return [];
    const pts: Vec2[] = [];
    const N = 96;
    // Find sqrt of M^-1 via eigendecomposition.
    // For a symmetric 2x2: solve eigen.
    const a = Meff[0][0];
    const b = Meff[0][1];
    const d = Meff[1][1];
    const tr = a + d;
    const det = a * d - b * b;
    const disc = Math.max(0, tr * tr - 4 * det);
    const lam1 = (tr + Math.sqrt(disc)) / 2;
    const lam2 = Math.max(1e-9, (tr - Math.sqrt(disc)) / 2);
    // Eigenvectors
    let theta = 0;
    if (Math.abs(b) > 1e-9) theta = Math.atan2(lam1 - a, b);
    else if (d > a) theta = Math.PI / 2;
    const cs = Math.cos(theta);
    const sn = Math.sin(theta);
    // For unit circle in inner-product metric: v = (cos t / sqrt(lam1) * e1) + (sin t / sqrt(lam2) * e2)
    // where e1, e2 are eigenvectors.
    const r1 = 1 / Math.sqrt(lam1);
    const r2 = 1 / Math.sqrt(lam2);
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const a1 = r1 * Math.cos(t);
      const a2 = r2 * Math.sin(t);
      // v = a1 * (cs, sn) + a2 * (-sn, cs)
      pts.push([a1 * cs - a2 * sn, a1 * sn + a2 * cs]);
    }
    return pts;
  }, [Meff, MvalidActive]);

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14, alignItems: 'start' }}>
        {/* ── Plane ──────────────────────────────────────── */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Unit "circle" of the active inner product */}
            {MvalidActive && unitCirclePoints.length > 0 && (
              <polyline
                points={unitCirclePoints.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
                fill="rgba(103, 169, 255, 0.06)"
                stroke="rgba(103, 169, 255, 0.55)"
                strokeWidth={1.4}
                strokeDasharray="3 4"
              />
            )}

            <DragArrow u={u} color="var(--viz-blue, #67a9ff)" label="u" onMove={setU} />
            <DragArrow u={v} color="var(--viz-yellow, #ffd966)" label="v" onMove={setV} />

            {/* Right-angle indicator near origin if orthogonal in this inner product */}
            {isOrth && (
              <text
                x={CX + 14}
                y={CY - 14}
                fontSize={14}
                fontFamily="var(--font-mono)"
                fill="rgba(111, 212, 154, 1)"
                fontWeight="bold"
              >
                ⊥
              </text>
            )}
          </svg>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 4 }}>
            dashed = unit "circle" {`(∥v∥ = 1)`} in current inner product
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────── */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MonoLine size={9} color="var(--text-tertiary)">INNER PRODUCT</MonoLine>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <RadioOption label="standard ⟨u,v⟩ = u·v" active={choice === 'standard'} onClick={() => setChoice('standard')} />
            <RadioOption label="weighted u^T M v" active={choice === 'weighted'} onClick={() => setChoice('weighted')} />
          </div>

          {choice === 'weighted' && (
            <div style={{ paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
              <MonoLine size={9} color="var(--text-tertiary)">M (symmetric, pos def)</MonoLine>
              <div style={{ marginTop: 6, display: 'inline-grid', gridTemplateColumns: 'repeat(2, auto)', gap: 4 }}>
                {M.flatMap((row, r) =>
                  row.map((cell, c) => (
                    <NumberCell key={`${r}-${c}`} value={cell} onChange={(val) => setMEntry(r, c, val)} step={0.1} min={-3} max={5} width={48} />
                  ))
                )}
              </div>
              {!Mvalid && (
                <div style={{ marginTop: 6, color: 'rgba(255, 123, 107, 0.95)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                  not pos def — entries reverted in spirit
                </div>
              )}
            </div>
          )}

          <div style={{ paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7 }}>
            <div>⟨u,v⟩ = <span style={{ color: 'var(--accent-bright, #67a9ff)' }}>{ipUV.toFixed(2)}</span></div>
            <div>‖u‖ = {normU.toFixed(2)} · ‖v‖ = {normV.toFixed(2)}</div>
            <div>θ = {thetaDeg.toFixed(1)}°</div>
            <div style={{ color: isOrth ? 'rgba(111, 212, 154, 1)' : 'var(--text-secondary)', fontWeight: isOrth ? 600 : 400 }}>
              orthogonal? {isOrth ? '✓ yes' : '✗ no'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 10, background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, textAlign: 'center', fontSize: 13 }}>
        {choice === 'standard' ? (
          <InlineMath math={`\\langle u, v \\rangle = u_1 v_1 + u_2 v_2 = ${ipUV.toFixed(2)}`} />
        ) : (
          <InlineMath
            math={`\\langle u, v \\rangle_M = u^T M v = ${ipUV.toFixed(2)}`}
          />
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton onClick={() => { setU([1, 0.5]); setV([-0.5, 1]); }}>reset vectors</VizControlButton>
        <VizControlButton onClick={() => setM([[2, 1], [1, 3]])}>reset M</VizControlButton>
      </div>
    </div>
  );
}

function inner(u: Vec2, v: Vec2, M: number[][]): number {
  // u^T M v
  return (
    M[0][0] * u[0] * v[0] +
    M[0][1] * u[0] * v[1] +
    M[1][0] * u[1] * v[0] +
    M[1][1] * u[1] * v[1]
  );
}

function RadioOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'rgba(103, 169, 255, 0.12)' : 'var(--bg-elevated)',
        border: `1px solid ${active ? 'var(--accent-bright, #67a9ff)' : 'var(--border-subtle)'}`,
        borderRadius: 4,
        padding: '6px 10px',
        textAlign: 'left',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
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
    e.stopPropagation();
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
      <line x1={CX} y1={CY} x2={x2} y2={y2} stroke={color} strokeWidth={2.2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && <text x={x2 + 6} y={y2 - 6} fontSize={11} fontFamily="var(--font-mono)" fontStyle="italic" fill={color}>{label}</text>}
      <circle cx={x2} cy={y2} r={10} fill={color} fillOpacity={0.001} style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
        <title>{label}: ({u[0].toFixed(2)}, {u[1].toFixed(2)})</title>
      </circle>
    </g>
  );
}
