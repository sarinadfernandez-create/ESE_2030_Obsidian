// 10.4 — SVD Invariance (stationary). Singular values of Q1 A Q2 equal those of A.
// Two side-by-side columns; matched singular values connected with bubbles.

import { useState } from 'react';
import { MonoLine, VizControlButton } from './_shared';

type Mat3 = number[][];

const A_BASE: Mat3 = [[3, 0, 0], [0, 2, 0], [0, 0, 1]];
const SIGMA_BASE = [3, 2, 1];

function rotZ30(): Mat3 {
  const c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6);
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
}
function reflectY(): Mat3 {
  return [[1, 0, 0], [0, -1, 0], [0, 0, 1]];
}
function perm231(): Mat3 {
  return [[0, 1, 0], [0, 0, 1], [1, 0, 0]];
}
function eye(): Mat3 {
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

function mul3(A: Mat3, B: Mat3): Mat3 {
  const R: Mat3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++) R[i][j] += A[i][k] * B[k][j];
  return R;
}

const PRESETS = {
  rotation: { Q1: eye(), Q2: rotZ30(), label: 'Q2 = rotate 30°' },
  reflection: { Q1: reflectY(), Q2: eye(), label: 'Q1 = reflect y' },
  permutation: { Q1: perm231(), Q2: perm231(), label: 'Q1, Q2 = permutations' },
  composite: { Q1: rotZ30(), Q2: reflectY(), label: 'Q1 = rotate, Q2 = reflect' },
} as const;

type PresetKey = keyof typeof PRESETS;

export function SVDInvarianceViz() {
  const [preset, setPreset] = useState<PresetKey>('rotation');
  const [hovered, setHovered] = useState<number | null>(null);
  const { Q1, Q2, label } = PRESETS[preset];

  const Atilde = mul3(mul3(Q1, A_BASE), Q2);

  const renderMatrix = (M: Mat3, title: string) => (
    <div>
      <MonoLine size={9} color="var(--text-tertiary)">{title}</MonoLine>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 36px)', gap: 2, marginTop: 4 }}>
        {M.flat().map((v, i) => (
          <div key={i} style={{ background: 'var(--bg-elevated, #1a1f2e)', border: '1px solid var(--border-subtle)', padding: '4px 6px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: Math.abs(v) < 1e-9 ? 'var(--text-tertiary)' : 'var(--text-primary)', borderRadius: 3 }}>
            {Math.abs(v) < 1e-9 ? '0' : v.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );

  const colorForIdx = (i: number) =>
    i === 0 ? 'var(--viz-blue, #67a9ff)' :
    i === 1 ? 'var(--viz-yellow, #ffd966)' :
    'var(--viz-purple, #b896ff)';

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {(Object.keys(PRESETS) as PresetKey[]).map((p) => (
          <VizControlButton key={p} onClick={() => setPreset(p)}>
            {preset === p ? '✓ ' : ''}{p}
          </VizControlButton>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left column: A and its SVD */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
          <MonoLine size={9} color="var(--text-tertiary)">ORIGINAL A</MonoLine>
          {renderMatrix(A_BASE, 'A')}
          <div style={{ marginTop: 12 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SINGULAR VALUES σ(A)</MonoLine>
            {SIGMA_BASE.map((s, i) => (
              <div
                key={i}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                style={{
                  display: 'inline-block',
                  margin: '6px 6px 0 0',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: colorForIdx(i),
                  color: 'var(--bg-base)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  border: hovered === i ? '2px solid var(--viz-green, #6fd49a)' : 'none',
                }}
              >
                σ{i + 1} = {s.toFixed(3)}
              </div>
            ))}
          </div>
        </div>

        {/* Connection: "Same singular values!" */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--viz-green, #6fd49a)', fontWeight: 600 }}>
            Same σ values
          </div>
          <div style={{ marginTop: 8 }}>
            {SIGMA_BASE.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 3,
                  margin: '12px 0',
                  background: hovered === i ? 'var(--viz-green, #6fd49a)' : colorForIdx(i),
                  opacity: hovered === null || hovered === i ? 1 : 0.3,
                  transition: 'all 200ms',
                }}
              />
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-tertiary)', marginTop: 8 }}>
            {label}
          </div>
        </div>

        {/* Right column: Ã and its SVD */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
          <MonoLine size={9} color="var(--text-tertiary)">Ã = Q₁ A Q₂</MonoLine>
          {renderMatrix(Atilde, 'Ã')}
          <div style={{ marginTop: 12 }}>
            <MonoLine size={9} color="var(--text-tertiary)">SINGULAR VALUES σ(Ã)</MonoLine>
            {SIGMA_BASE.map((s, i) => (
              <div
                key={i}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                style={{
                  display: 'inline-block',
                  margin: '6px 6px 0 0',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: colorForIdx(i),
                  color: 'var(--bg-base)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  border: hovered === i ? '2px solid var(--viz-green, #6fd49a)' : 'none',
                }}
              >
                σ{i + 1} = {s.toFixed(3)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: 10, background: 'rgba(111, 212, 154, 0.08)', border: '1px solid rgba(111, 212, 154, 0.4)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        Q₁ A Q₂ has the same singular values as A, but generally different singular vectors. U and V rotate; Σ does not. Hover a σ to highlight the matched pair.
      </div>
    </div>
  );
}
