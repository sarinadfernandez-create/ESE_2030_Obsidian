// 3.6 — Rank-Nullity (interactive).
// Editable matrix on top, horizontal rank/nullity bar in the middle, equations on bottom.
// The bar splits cyan (rank) and yellow (nullity) and always sums to n = number of columns.

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { InlineMath } from 'react-katex';
import { computeRREF } from '../../lib/linearAlgebra';
import { MonoLine, NumberCell, VizControlButton } from './_shared';

type Mat = number[][];

const PRESETS: Record<string, Mat> = {
  'rank 0 (zero matrix)': [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  'rank 1': [
    [1, 2, 3, 4],
    [2, 4, 6, 8],
    [3, 6, 9, 12],
  ],
  'rank 2 (default)': [
    [1, 0, 1, 2],
    [0, 1, 1, 1],
    [1, 1, 2, 3],
  ],
  'full rank (3×4)': [
    [1, 0, 0, 1],
    [0, 1, 0, 2],
    [0, 0, 1, 3],
  ],
};

export function RankNullityViz() {
  const [matrix, setMatrix] = useState<Mat>(PRESETS['rank 2 (default)'].map((r) => [...r]));
  const [showMini, setShowMini] = useState(true);

  const m = matrix.length;
  const n = matrix[0]?.length ?? 0;

  const rank = useMemo(() => computeRREF(matrix).rank, [matrix]);
  const nullity = n - rank;
  const ratio = n > 0 ? rank / n : 0;

  const setEntry = (r: number, c: number, val: number) => {
    setMatrix((M) => {
      const next = M.map((row) => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  const reset = () => setMatrix(PRESETS['rank 2 (default)'].map((r) => [...r]));

  return (
    <div style={{ maxWidth: 760 }}>
      {/* ── Matrix editor ────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 16,
        }}
      >
        <MonoLine size={9} color="var(--text-tertiary)">
          MATRIX A &nbsp;&middot;&nbsp; {m} × {n}
        </MonoLine>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
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
                  width={56}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Rank-nullity bar ─────────────────────────────────────── */}
      <div
        style={{
          marginTop: 16,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: '20px 24px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 16,
              color: 'var(--text-secondary)',
            }}
          >
            domain dimension splits as
          </span>
          <span style={{ marginLeft: 10, fontSize: 15 }}>
            <InlineMath math={`\\mathrm{rank}(A) + \\mathrm{nullity}(A) = ${n}`} />
          </span>
        </div>

        <RankBar rank={rank} nullity={nullity} ratio={ratio} />

        <div
          style={{
            marginTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <Stat label="rank = dim(im T)" value={rank} color="var(--viz-blue, #67a9ff)" />
          <Stat label="nullity = dim(ker T)" value={nullity} color="var(--viz-yellow, #ffd966)" />
          <Stat label={`n = #columns`} value={n} color="var(--text-secondary)" />
        </div>
      </div>

      {/* ── Mini kernel/image preview ────────────────────────────── */}
      {showMini && (
        <div
          style={{
            marginTop: 16,
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            gap: 16,
            justifyContent: 'space-around',
          }}
        >
          <MiniSubspace
            title="kernel ⊂ ℝⁿ"
            dim={nullity}
            ambient={n}
            color="var(--viz-yellow, #ffd966)"
          />
          <MiniSubspace
            title="image ⊂ ℝᵐ"
            dim={rank}
            ambient={m}
            color="var(--viz-blue, #67a9ff)"
          />
        </div>
      )}

      {/* ── Controls ─────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 14,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {Object.keys(PRESETS).map((name) => (
          <VizControlButton key={name} onClick={() => setMatrix(PRESETS[name].map((r) => [...r]))}>
            {name}
          </VizControlButton>
        ))}
        <VizControlButton onClick={() => setShowMini((s) => !s)} active={showMini}>
          kernel/image preview
        </VizControlButton>
        <VizControlButton onClick={reset}>reset</VizControlButton>
      </div>
    </div>
  );
}

// ── Subcomponents ──────────────────────────────────────────────────────────

function RankBar({ rank, nullity, ratio }: { rank: number; nullity: number; ratio: number }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);

  // Minimum visible width for each segment, so a tiny rank or nullity is still visible.
  const cyanPct = rank === 0 ? 0 : Math.max(ratio * 100, 4);
  const yellowPct = nullity === 0 ? 0 : Math.max((1 - ratio) * 100, 4);
  // Renormalize so they sum to 100.
  const total = cyanPct + yellowPct;
  const cyanW = total > 0 ? (cyanPct / total) * 100 : 0;
  const yellowW = total > 0 ? (yellowPct / total) * 100 : 0;

  const transition = reducedMotion ? { duration: 0 } : { duration: 0.32, ease: 'easeOut' as const };

  return (
    <div
      style={{
        position: 'relative',
        height: 38,
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid var(--border-default)',
        display: 'flex',
        background: 'var(--bg-elevated)',
      }}
    >
      <motion.div
        animate={{ width: `${cyanW}%` }}
        transition={transition}
        style={{
          background: 'linear-gradient(90deg, rgba(103,169,255,0.45), rgba(103,169,255,0.7))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {rank > 0 && `rank ${rank}`}
      </motion.div>
      <motion.div
        animate={{ width: `${yellowW}%` }}
        transition={transition}
        style={{
          background: 'linear-gradient(90deg, rgba(255,217,102,0.7), rgba(255,217,102,0.45))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1a1d24',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {nullity > 0 && `nullity ${nullity}`}
      </motion.div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
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
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

function MiniSubspace({
  title,
  dim,
  ambient,
  color,
}: {
  title: string;
  dim: number;
  ambient: number;
  color: string;
}) {
  // Render conceptually: a small box representing ambient, with `dim` dots/lines/etc.
  return (
    <div style={{ flex: 1, textAlign: 'center', padding: 8, minWidth: 140 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <svg viewBox="0 0 140 80" width="100%" height={70}>
        {/* ambient frame */}
        <rect
          x={4}
          y={4}
          width={132}
          height={72}
          fill="rgba(255,255,255,0.02)"
          stroke="var(--border-subtle)"
          strokeWidth={1}
          rx={3}
        />
        {/* axis labels */}
        <text x={70} y={70} textAnchor="middle" fontSize={8} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
          ambient dim {ambient}
        </text>
        {/* visualization of subspace */}
        {dim === 0 ? (
          <circle cx={70} cy={36} r={3} fill={color} />
        ) : dim === 1 ? (
          <line x1={20} y1={36} x2={120} y2={36} stroke={color} strokeWidth={2.4} />
        ) : dim === 2 ? (
          <rect x={20} y={18} width={100} height={36} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.4} />
        ) : (
          <rect x={6} y={6} width={128} height={68} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.2} rx={2} />
        )}
      </svg>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-secondary)',
          marginTop: 4,
        }}
      >
        dim = <span style={{ color, fontWeight: 600 }}>{dim}</span>
      </div>
    </div>
  );
}
