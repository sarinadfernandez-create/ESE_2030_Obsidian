// 2.5 — Dimension (interactive).
// Inventory of candidate vectors per space; toggle which are active. Span dim is
// computed live and shown as a thermometer bar against the ambient dimension.

import { useMemo, useState } from 'react';
import { computeRREF, isometricProject, type Vec3 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Space = 'r3' | 'p2';

interface Candidate {
  label: string;
  // Coordinates (in standard basis): for r3 a length-3 vec, for p2 a length-3 vec [const, x, x²].
  coords: number[];
  // For p2: optional extra label
  prettyLabel?: string;
}

const R3_CANDIDATES: Candidate[] = [
  { label: 'e₁ = (1, 0, 0)', coords: [1, 0, 0] },
  { label: 'e₂ = (0, 1, 0)', coords: [0, 1, 0] },
  { label: 'e₃ = (0, 0, 1)', coords: [0, 0, 1] },
  { label: '(1, 1, 0)', coords: [1, 1, 0] },
  { label: '(0, 1, 1)', coords: [0, 1, 1] },
];

const P2_CANDIDATES: Candidate[] = [
  { label: '1', coords: [1, 0, 0] },
  { label: 'x', coords: [0, 1, 0] },
  { label: 'x²', coords: [0, 0, 1] },
  { label: 'x + 1', coords: [1, 1, 0] },
  { label: 'x² - 2x', coords: [0, -2, 1] },
];

export function DimensionViz() {
  const [space, setSpace] = useState<Space>('r3');
  const [active, setActive] = useState<Set<number>>(new Set([0, 1]));

  const candidates = space === 'r3' ? R3_CANDIDATES : P2_CANDIDATES;

  // Compute current span dim: form matrix of active vectors as rows; rank = dim.
  const dim = useMemo(() => {
    if (active.size === 0) return 0;
    const rows = Array.from(active).map((i) => [...candidates[i].coords]);
    return computeRREF(rows).rank;
  }, [active, candidates]);

  // For each candidate, check if adding it to the current set would increase dim.
  const independence = useMemo(() => {
    return candidates.map((cand, idx) => {
      if (active.has(idx)) return 'active' as const;
      // Form rows of active + this candidate; if rank increases, it's independent.
      const rows = Array.from(active).map((i) => [...candidates[i].coords]);
      rows.push([...cand.coords]);
      const newRank = computeRREF(rows).rank;
      return newRank > dim ? ('independent' as const) : ('dependent' as const);
    });
  }, [active, candidates, dim]);

  const ambient = 3;
  const ratio = dim / ambient;

  const toggle = (i: number) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const reset = () => setActive(new Set([0, 1]));

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Space selector */}
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
        <VizControlButton active={space === 'r3'} onClick={() => { setSpace('r3'); setActive(new Set([0, 1])); }}>
          ℝ³
        </VizControlButton>
        <VizControlButton active={space === 'p2'} onClick={() => { setSpace('p2'); setActive(new Set([0, 1])); }}>
          𝒫₂
        </VizControlButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 14, alignItems: 'start' }}>
        {/* ── Inventory ─────────────────────────────────── */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
          <MonoLine size={9} color="var(--text-tertiary)">CANDIDATES</MonoLine>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {candidates.map((cand, i) => {
              const isActive = active.has(i);
              const status = independence[i];
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    background: isActive ? 'rgba(103, 169, 255, 0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${isActive ? 'var(--accent-bright, #67a9ff)' : 'var(--border-subtle)'}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                  }}
                >
                  <input type="checkbox" checked={isActive} readOnly style={{ pointerEvents: 'none' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, flex: 1 }}>{cand.label}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color:
                        status === 'active'
                          ? 'var(--accent-bright, #67a9ff)'
                          : status === 'independent'
                          ? 'rgba(111, 212, 154, 1)'
                          : 'rgba(255, 217, 102, 0.95)',
                    }}
                  >
                    {status === 'active' ? '✓' : status === 'independent' ? '+1' : '+0'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Span panel ────────────────────────────────── */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 32,
              color: 'var(--accent-bright, #67a9ff)',
              fontWeight: 600,
            }}
          >
            dim(span) = {dim}
          </div>

          {/* Thermometer */}
          <div
            style={{
              height: 12,
              borderRadius: 6,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: `${ratio * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, rgba(103,169,255,0.5), rgba(103,169,255,0.85))',
                transition: 'width 0.3s ease-out',
              }}
            />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: 12 }}>
            {dim} / {ambient} of ambient {space === 'r3' ? 'ℝ³' : '𝒫₂'}
          </div>

          {/* Visualization */}
          {space === 'r3' ? (
            <R3SpanViz
              activeVectors={Array.from(active).map((i) => candidates[i].coords as Vec3)}
              dim={dim}
            />
          ) : (
            <P2SpanViz activeIndices={Array.from(active)} candidates={candidates} dim={dim} />
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton onClick={() => setActive(new Set([0, 1, 2]))}>basis (first 3)</VizControlButton>
        <VizControlButton onClick={() => setActive(new Set([0, 1, 2, 3, 4]))}>add all 5</VizControlButton>
        <VizControlButton onClick={() => setActive(new Set())}>clear</VizControlButton>
        <VizControlButton onClick={reset}>reset</VizControlButton>
      </div>
    </div>
  );
}

const SP_W = 360;
const SP_H = 240;
const SP_CX = SP_W / 2;
const SP_CY = SP_H / 2;
const SP_SCALE = 32;

function R3SpanViz({ activeVectors, dim }: { activeVectors: Vec3[]; dim: number }) {
  return (
    <svg viewBox={`0 0 ${SP_W} ${SP_H}`} width="100%" style={{ display: 'block' }}>
      {/* Axes */}
      {(() => {
        const len = 3;
        const x = isometricProject([len, 0, 0], SP_SCALE);
        const y = isometricProject([0, len, 0], SP_SCALE);
        const z = isometricProject([0, 0, len], SP_SCALE);
        const xn = isometricProject([-len, 0, 0], SP_SCALE);
        const yn = isometricProject([0, -len, 0], SP_SCALE);
        const zn = isometricProject([0, 0, -len], SP_SCALE);
        return (
          <g>
            <line x1={SP_CX + xn[0]} y1={SP_CY + xn[1]} x2={SP_CX + x[0]} y2={SP_CY + x[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
            <line x1={SP_CX + yn[0]} y1={SP_CY + yn[1]} x2={SP_CX + y[0]} y2={SP_CY + y[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
            <line x1={SP_CX + zn[0]} y1={SP_CY + zn[1]} x2={SP_CX + z[0]} y2={SP_CY + z[1]} stroke="var(--viz-axis, #2a3850)" strokeWidth={0.7} opacity={0.6} />
          </g>
        );
      })()}

      {/* Span shape based on dim */}
      {dim === 0 && <circle cx={SP_CX} cy={SP_CY} r={4} fill="rgba(103, 169, 255, 0.6)" />}
      {dim === 1 && activeVectors[0] && (
        <SpanLine v={activeVectors.find((v) => Math.hypot(v[0], v[1], v[2]) > 1e-6) ?? [1, 0, 0]} />
      )}
      {dim === 2 && (
        <SpanPlane vs={activeVectors} />
      )}
      {dim === 3 && (
        <rect x={4} y={4} width={SP_W - 8} height={SP_H - 8} fill="rgba(103, 169, 255, 0.06)" stroke="rgba(103, 169, 255, 0.3)" strokeWidth={1} strokeDasharray="4 5" rx={4} />
      )}

      {/* Active vector arrows */}
      {activeVectors.map((v, i) => (
        <Vec3Arrow key={i} v={v} color="rgba(103, 169, 255, 0.95)" />
      ))}
    </svg>
  );
}

function SpanLine({ v }: { v: Vec3 }) {
  const norm = Math.hypot(v[0], v[1], v[2]);
  if (norm < 1e-6) return null;
  const f = 3 / norm;
  const a = isometricProject([v[0] * f, v[1] * f, v[2] * f], SP_SCALE);
  const b = isometricProject([-v[0] * f, -v[1] * f, -v[2] * f], SP_SCALE);
  return (
    <line
      x1={SP_CX + a[0]}
      y1={SP_CY + a[1]}
      x2={SP_CX + b[0]}
      y2={SP_CY + b[1]}
      stroke="rgba(103, 169, 255, 0.5)"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function SpanPlane({ vs }: { vs: Vec3[] }) {
  // Pick two independent vectors to span the plane.
  if (vs.length < 2) return null;
  let v1: Vec3 | null = null;
  let v2: Vec3 | null = null;
  for (const v of vs) {
    if (Math.hypot(v[0], v[1], v[2]) < 1e-6) continue;
    if (!v1) {
      v1 = v;
      continue;
    }
    // Cross product to test independence
    const cx = v1[1] * v[2] - v1[2] * v[1];
    const cy = v1[2] * v[0] - v1[0] * v[2];
    const cz = v1[0] * v[1] - v1[1] * v[0];
    if (Math.hypot(cx, cy, cz) > 1e-3) {
      v2 = v;
      break;
    }
  }
  if (!v1 || !v2) return null;
  const f = 1.6;
  const corners: Vec3[] = [
    [v1[0] * f + v2[0] * f, v1[1] * f + v2[1] * f, v1[2] * f + v2[2] * f],
    [v1[0] * f - v2[0] * f, v1[1] * f - v2[1] * f, v1[2] * f - v2[2] * f],
    [-v1[0] * f - v2[0] * f, -v1[1] * f - v2[1] * f, -v1[2] * f - v2[2] * f],
    [-v1[0] * f + v2[0] * f, -v1[1] * f + v2[1] * f, -v1[2] * f + v2[2] * f],
  ];
  const pts = corners.map((c) => isometricProject(c, SP_SCALE));
  return (
    <polygon
      points={pts.map((p) => `${SP_CX + p[0]},${SP_CY + p[1]}`).join(' ')}
      fill="rgba(103, 169, 255, 0.18)"
      stroke="rgba(103, 169, 255, 0.5)"
      strokeWidth={1.2}
    />
  );
}

function Vec3Arrow({ v, color }: { v: Vec3; color: string }) {
  const norm = Math.hypot(v[0], v[1], v[2]);
  if (norm < 1e-6) return null;
  const f = norm > 2.5 ? 2.5 / norm : 1;
  const [px, py] = isometricProject([v[0] * f, v[1] * f, v[2] * f], SP_SCALE);
  const x2 = SP_CX + px;
  const y2 = SP_CY + py;
  const dx = x2 - SP_CX;
  const dy = y2 - SP_CY;
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
      <line x1={SP_CX} y1={SP_CY} x2={x2} y2={y2} stroke={color} strokeWidth={1.6} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
    </g>
  );
}

function P2SpanViz({ activeIndices, candidates, dim }: { activeIndices: number[]; candidates: Candidate[]; dim: number }) {
  // Render active polynomials as curves on [-1, 1].
  const cx = SP_W / 2;
  const cy = SP_H / 2;
  const u = 38;
  const colors = [
    'var(--viz-blue, #67a9ff)',
    'var(--viz-yellow, #ffd966)',
    'rgba(184, 150, 255, 0.95)',
    'rgba(111, 212, 154, 0.95)',
    'rgba(255, 123, 107, 0.95)',
  ];
  return (
    <svg viewBox={`0 0 ${SP_W} ${SP_H}`} width="100%" style={{ display: 'block' }}>
      <GridAxes width={SP_W} height={SP_H} unit={u} />
      {activeIndices.map((idx, k) => {
        const coeffs = candidates[idx].coords;
        const samples: [number, number][] = [];
        for (let i = 0; i <= 60; i++) {
          const x = -1 + (i / 60) * 2;
          const y = coeffs.reduce((acc, c, j) => acc + c * Math.pow(x, j), 0);
          samples.push([x, y]);
        }
        const path = samples.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${cx + x * u} ${cy - y * u * 0.5}`).join(' ');
        return <path key={idx} d={path} fill="none" stroke={colors[k % colors.length]} strokeWidth={1.6} />;
      })}
      <text x={SP_W - 8} y={SP_H - 8} textAnchor="end" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
        spans degree-{dim - 1 < 0 ? '?' : dim - 1} polys
      </text>
    </svg>
  );
}
