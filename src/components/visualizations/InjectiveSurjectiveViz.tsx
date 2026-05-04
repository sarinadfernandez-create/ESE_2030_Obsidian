// 3.4 — Injective / Surjective / Isomorphism (interactive).
// Pick a matrix shape and entries; live status for injectivity, surjectivity,
// and isomorphism; schematic kernel/image preview in domain and codomain.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { computeRREF } from '../../lib/linearAlgebra';
import { MonoLine, NumberCell, VizControlButton } from './_shared';

type Shape = '2x2' | '2x3' | '3x2' | '3x3';

const PRESETS: Record<Shape, { label: string; matrix: number[][] }[]> = {
  '2x2': [
    { label: 'identity (iso)', matrix: [[1, 0], [0, 1]] },
    { label: 'rank 1 (neither)', matrix: [[1, 2], [2, 4]] },
    { label: 'rotation 30° (iso)', matrix: [[0.866, -0.5], [0.5, 0.866]] },
  ],
  '2x3': [
    { label: 'rank 2 (surj only)', matrix: [[1, 0, 0], [0, 1, 0]] },
    { label: 'rank 1 (neither)', matrix: [[1, 2, 3], [2, 4, 6]] },
  ],
  '3x2': [
    { label: 'rank 2 (inj only)', matrix: [[1, 0], [0, 1], [0, 0]] },
    { label: 'rank 1 (neither)', matrix: [[1, 2], [2, 4], [3, 6]] },
  ],
  '3x3': [
    { label: 'identity (iso)', matrix: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
    { label: 'rank 2', matrix: [[1, 0, 1], [0, 1, 1], [0, 0, 0]] },
    { label: 'rank 1', matrix: [[1, 2, 3], [2, 4, 6], [3, 6, 9]] },
  ],
};

function dimsFor(shape: Shape): { m: number; n: number } {
  const [a, b] = shape.split('x').map(Number);
  return { m: a, n: b };
}

function emptyMatrix(m: number, n: number): number[][] {
  return Array.from({ length: m }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

export function InjectiveSurjectiveViz() {
  const [shape, setShape] = useState<Shape>('2x3');
  const { m, n } = dimsFor(shape);
  const [matrix, setMatrix] = useState<number[][]>(PRESETS[shape][0].matrix.map((r) => [...r]));

  const rank = useMemo(() => computeRREF(matrix).rank, [matrix]);
  const nullity = n - rank;

  const injective = nullity === 0;
  const surjective = rank === m;
  const isomorphism = injective && surjective;

  const setShapeAndPreset = (newShape: Shape) => {
    setShape(newShape);
    setMatrix(PRESETS[newShape][0].matrix.map((r) => [...r]));
  };

  const setEntry = (r: number, c: number, val: number) => {
    setMatrix((M) => {
      const next = M.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  // Constraints are dimensional: explain WHY a property is impossible when relevant.
  const injReason = injective
    ? `nullity = 0`
    : `nullity = ${nullity} > 0`;
  const surjReason = surjective
    ? `rank = m = ${m}`
    : `rank = ${rank} < m = ${m}`;
  const dimConstraint =
    n > m
      ? `domain dim ${n} > codomain dim ${m} → injective is impossible`
      : n < m
      ? `domain dim ${n} < codomain dim ${m} → surjective is impossible`
      : `domain dim = codomain dim → injective ⇔ surjective ⇔ iso`;

  return (
    <div style={{ maxWidth: 760 }}>
      {/* ── Shape selector ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        {(['2x2', '2x3', '3x2', '3x3'] as Shape[]).map((s) => (
          <VizControlButton key={s} active={shape === s} onClick={() => setShapeAndPreset(s)}>
            {s}
          </VizControlButton>
        ))}
      </div>

      {/* ── Domain | Matrix | Codomain ─────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 14,
          alignItems: 'stretch',
        }}
      >
        <SubspacePanel
          title={`Domain · ℝ^${n}`}
          ambientDim={n}
          subspaceLabel="kernel"
          subspaceDim={nullity}
          color="rgba(255, 123, 107, 0.85)"
        />

        {/* Matrix in the middle */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            {m} × {n} matrix A
          </MonoLine>
          <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${n}, auto)`, gap: 4 }}>
            {matrix.flatMap((row, r) =>
              row.map((cell, c) => (
                <NumberCell
                  key={`${r}-${c}`}
                  value={cell}
                  onChange={(v) => setEntry(r, c, v)}
                  step={0.5}
                  min={-9}
                  max={9}
                  width={48}
                />
              ))
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            rank = <span style={{ color: 'var(--accent-bright, #67a9ff)', fontWeight: 600 }}>{rank}</span>
          </div>
        </div>

        <SubspacePanel
          title={`Codomain · ℝ^${m}`}
          ambientDim={m}
          subspaceLabel="image"
          subspaceDim={rank}
          color="rgba(103, 169, 255, 0.85)"
        />
      </div>

      {/* ── Status ──────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 16,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 14,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
        }}
      >
        <StatusBox
          label="injective"
          ok={injective}
          formula="\ker T = \{0\}"
          reason={injReason}
        />
        <StatusBox
          label="surjective"
          ok={surjective}
          formula="\mathrm{im}\,T = W"
          reason={surjReason}
        />
        <StatusBox
          label="isomorphism"
          ok={isomorphism}
          formula="T \text{ bijective}"
          reason={isomorphism ? 'both injective and surjective' : 'one or both fail'}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--text-tertiary)',
          textAlign: 'center',
        }}
      >
        {dimConstraint}
      </div>

      {/* ── Presets ─────────────────────────────────────────── */}
      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PRESETS[shape].map((p) => (
          <VizControlButton
            key={p.label}
            onClick={() => setMatrix(p.matrix.map((r) => [...r]))}
          >
            {p.label}
          </VizControlButton>
        ))}
        <VizControlButton onClick={() => setMatrix(emptyMatrix(m, n))}>
          identity-like
        </VizControlButton>
      </div>
    </div>
  );
}

function StatusBox({
  label,
  ok,
  formula,
  reason,
}: {
  label: string;
  ok: boolean;
  formula: string;
  reason: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: 8,
        background: ok ? 'rgba(111, 212, 154, 0.08)' : 'rgba(255, 123, 107, 0.06)',
        border: `1px solid ${ok ? 'rgba(111, 212, 154, 0.5)' : 'rgba(255, 123, 107, 0.4)'}`,
        borderRadius: 4,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
        <span style={{ color: ok ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)', fontWeight: 600 }}>
          {ok ? '✓' : '✗'}
        </span>
      </div>
      <div style={{ fontSize: 12 }}>
        <InlineMath math={formula} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{reason}</div>
    </div>
  );
}

function SubspacePanel({
  title,
  ambientDim,
  subspaceLabel,
  subspaceDim,
  color,
}: {
  title: string;
  ambientDim: number;
  subspaceLabel: string;
  subspaceDim: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minHeight: 220,
      }}
    >
      <MonoLine size={9} color="var(--text-tertiary)">
        {title}
      </MonoLine>
      <svg viewBox="0 0 200 130" width="100%" height={130}>
        {/* ambient frame */}
        <rect
          x={6}
          y={6}
          width={188}
          height={118}
          fill="rgba(255,255,255,0.02)"
          stroke="var(--border-subtle)"
          strokeWidth={1}
          rx={4}
        />
        <text
          x={100}
          y={120}
          textAnchor="middle"
          fontSize={9}
          fontFamily="var(--font-mono)"
          fill="var(--text-tertiary)"
        >
          ambient dim {ambientDim}
        </text>
        {/* subspace shape based on its dimension */}
        {subspaceDim === 0 && <circle cx={100} cy={64} r={4} fill={color} />}
        {subspaceDim === 1 && (
          <line x1={28} y1={64} x2={172} y2={64} stroke={color} strokeWidth={2.6} />
        )}
        {subspaceDim === 2 && (
          <rect x={28} y={32} width={144} height={64} fill={color} fillOpacity={0.32} stroke={color} strokeWidth={1.6} />
        )}
        {subspaceDim >= 3 && (
          <rect x={10} y={10} width={180} height={108} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.4} rx={3} />
        )}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--text-primary)',
          }}
        >
          {subspaceLabel}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color }}>
          dim = <span style={{ fontWeight: 600 }}>{subspaceDim}</span>
        </span>
      </div>
    </div>
  );
}
