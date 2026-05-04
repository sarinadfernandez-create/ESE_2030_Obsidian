// 2.1 — Vector Space Axioms (interactive).
// Pick a candidate set; see which of the eight axioms hold and which fail,
// with a concrete failure example for the non-vector spaces.

import { useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Candidate =
  | 'r2-standard'
  | 'positive-quadrant'
  | 'shifted-line'
  | 'unit-circle'
  | 'integer-lattice'
  | 'positive-reals-mult';

interface Info {
  id: Candidate;
  label: string;
  description: string;
  axioms: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  failure: string | null;
}

const CANDIDATES: Info[] = [
  {
    id: 'r2-standard',
    label: 'ℝ² with standard ops',
    description: 'all 2D vectors with componentwise addition and scaling',
    axioms: [true, true, true, true, true, true, true, true],
    failure: null,
  },
  {
    id: 'positive-quadrant',
    label: 'positive quadrant {x ≥ 0}',
    description: 'half-plane: only nonneg x components',
    axioms: [true, true, true, false, true, true, true, true],
    failure: 'Axiom 4 (additive inverse): (1, 0) is in W, but −(1, 0) = (−1, 0) has x = −1 < 0, so the inverse is not in W. Also fails closure under scalar mult with negative scalars.',
  },
  {
    id: 'shifted-line',
    label: 'shifted line {x + y = 1}',
    description: 'affine line not through origin',
    axioms: [true, true, false, false, false, false, true, true],
    failure: 'Axiom 3 (additive identity): 0 = (0, 0) is not in W since 0 + 0 ≠ 1. Without zero, multiple downstream axioms also fail.',
  },
  {
    id: 'unit-circle',
    label: 'unit circle {x² + y² = 1}',
    description: 'curved set; vectors on the unit sphere',
    axioms: [true, true, false, false, false, false, true, true],
    failure: 'Axiom 3: origin not in W (0² + 0² = 0 ≠ 1). Also not closed under sums or scaling: (1, 0) + (1, 0) = (2, 0) is not on the circle.',
  },
  {
    id: 'integer-lattice',
    label: 'integer lattice ℤ²',
    description: 'integer-coordinate dots',
    axioms: [true, true, true, true, false, true, true, true],
    failure: '½ · (1, 0) = (½, 0) leaves ℤ². Closure under scalar mult fails for non-integer scalars c. (Axioms hold for integer-only scaling — but a real vector space needs ALL real scalars.)',
  },
  {
    id: 'positive-reals-mult',
    label: 'ℝ₊ with redefined ops',
    description: 'positive reals · multiplication-as-addition · exponent-as-scaling',
    axioms: [true, true, true, true, true, true, true, true],
    failure: null,
  },
];

const AXIOM_LABELS = [
  'commutativity: u + v = v + u',
  'associativity: (u + v) + w = u + (v + w)',
  'identity exists: 0 + v = v',
  'inverse exists: v + (−v) = 0',
  'c(u + v) = cu + cv',
  '(c + d) v = cv + dv',
  '(cd) v = c(dv)',
  '1 · v = v',
];

export function VectorSpaceAxiomsViz() {
  const [candidateId, setCandidateId] = useState<Candidate>('r2-standard');
  const info = CANDIDATES.find((c) => c.id === candidateId)!;
  const allPass = info.axioms.every(Boolean);

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <select
          className="viz-preset-select"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value as Candidate)}
        >
          {CANDIDATES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <MonoLine size={9} color="var(--text-tertiary)">CANDIDATE</MonoLine>
          <CandidateDiagram id={candidateId} />
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
            {info.description}
          </div>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
          <MonoLine size={9} color="var(--text-tertiary)">EIGHT AXIOMS</MonoLine>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {AXIOM_LABELS.map((label, i) => {
              const pass = info.axioms[i];
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 6px',
                    background: pass ? 'rgba(111, 212, 154, 0.04)' : 'rgba(255, 123, 107, 0.06)',
                    borderRadius: 3,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                  }}
                >
                  <span style={{ color: pass ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)', fontWeight: 600, width: 14 }}>
                    {pass ? '✓' : '✗'}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-tertiary)', marginRight: 4 }}>{i + 1}.</span>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: allPass ? 'rgba(111, 212, 154, 0.08)' : 'rgba(255, 123, 107, 0.06)',
          border: `1px solid ${allPass ? 'rgba(111, 212, 154, 0.4)' : 'rgba(255, 123, 107, 0.4)'}`,
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            color: allPass ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)',
          }}
        >
          {allPass ? '✓ this IS a vector space' : '✗ NOT a vector space'}
        </div>
        {info.failure && (
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {info.failure}
          </div>
        )}
        {candidateId === 'positive-reals-mult' && (
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Surprising! With ⊕ = · and c ⊙ x = x^c, the additive identity is <strong>1</strong> (since 1 · x = x), and the &ldquo;zero scalar&rdquo; gives 0 ⊙ x = x⁰ = 1. All eight axioms hold under these redefined operations.
          </div>
        )}
        {candidateId === 'integer-lattice' && info.failure && (
          <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            (The lattice IS a ℤ-module — fine over integer scalars. As a real vector space it fails closure under non-integer scaling.)
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {CANDIDATES.map((c) => (
          <VizControlButton key={c.id} active={candidateId === c.id} onClick={() => setCandidateId(c.id)}>
            {c.label.length > 28 ? c.label.slice(0, 26) + '…' : c.label}
          </VizControlButton>
        ))}
      </div>
    </div>
  );
}

const D_W = 360;
const D_H = 280;
const D_CX = D_W / 2;
const D_CY = D_H / 2;
const D_UNIT = 36;

function CandidateDiagram({ id }: { id: Candidate }) {
  return (
    <svg viewBox={`0 0 ${D_W} ${D_H}`} width="100%" style={{ display: 'block' }}>
      <GridAxes width={D_W} height={D_H} unit={D_UNIT} />

      {id === 'r2-standard' && (
        <text x={D_CX} y={D_CY - 50} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="var(--accent-bright, #67a9ff)" fontStyle="italic">
          all of ℝ²
        </text>
      )}

      {id === 'positive-quadrant' && (
        <rect x={D_CX} y={0} width={D_W - D_CX} height={D_H} fill="rgba(103, 169, 255, 0.18)" stroke="rgba(103, 169, 255, 0.5)" strokeWidth={1} />
      )}

      {id === 'shifted-line' && (
        <>
          <line x1={D_CX - 4 * D_UNIT} y1={D_CY - 5 * D_UNIT} x2={D_CX + 4 * D_UNIT} y2={D_CY + 3 * D_UNIT} stroke="rgba(103, 169, 255, 0.85)" strokeWidth={2} />
          <text x={D_CX + D_UNIT} y={D_CY - D_UNIT} fontSize={10} fontFamily="var(--font-mono)" fill="rgba(103, 169, 255, 0.95)">
            x + y = 1
          </text>
          <circle cx={D_CX} cy={D_CY} r={4} fill="rgba(255, 123, 107, 0.95)" />
          <text x={D_CX + 8} y={D_CY + 14} fontSize={9} fontFamily="var(--font-mono)" fill="rgba(255, 123, 107, 0.95)">
            origin not on line
          </text>
        </>
      )}

      {id === 'unit-circle' && (
        <>
          <circle cx={D_CX} cy={D_CY} r={D_UNIT} fill="none" stroke="rgba(103, 169, 255, 0.85)" strokeWidth={2} />
          <circle cx={D_CX} cy={D_CY} r={3} fill="rgba(255, 123, 107, 0.95)" />
          <text x={D_CX + 8} y={D_CY + 14} fontSize={9} fontFamily="var(--font-mono)" fill="rgba(255, 123, 107, 0.95)">
            origin not on circle
          </text>
        </>
      )}

      {id === 'integer-lattice' && (
        <g>
          {[-3, -2, -1, 0, 1, 2, 3].flatMap((i) =>
            [-2, -1, 0, 1, 2].map((j) => (
              <circle key={`${i}-${j}`} cx={D_CX + i * D_UNIT} cy={D_CY - j * D_UNIT} r={2.4} fill="rgba(103, 169, 255, 0.75)" />
            ))
          )}
        </g>
      )}

      {id === 'positive-reals-mult' && (
        <>
          <line x1={20} y1={D_CY} x2={D_W - 20} y2={D_CY} stroke="var(--viz-axis, #2a3850)" strokeWidth={1} />
          {[0.25, 0.5, 1, 2, 4].map((v, i) => {
            const x = 40 + (Math.log(v) + 2) * 50;
            return (
              <g key={i}>
                <circle cx={x} cy={D_CY} r={4} fill={v === 1 ? 'rgba(255, 217, 102, 0.95)' : 'rgba(103, 169, 255, 0.85)'} />
                <text x={x} y={D_CY + 18} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
                  {v}
                </text>
              </g>
            );
          })}
          <text x={D_CX} y={40} textAnchor="middle" fontSize={11} fontFamily="var(--font-mono)" fill="rgba(255, 217, 102, 0.95)" fontStyle="italic">
            ℝ₊ on log scale
          </text>
          <text x={D_CX} y={D_H - 10} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
            additive identity = 1 (yellow)
          </text>
        </>
      )}
    </svg>
  );
}
