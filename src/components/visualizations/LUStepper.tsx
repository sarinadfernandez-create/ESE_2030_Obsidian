import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { forwardEliminate } from '../../lib/linearAlgebra';
import { MatrixGrid, MonoLine, PresetSelect, VizControlButton } from './_shared';

const PRESETS: Record<string, number[][]> = {
  'Default 3×3': [
    [2, 1, 1],
    [4, 3, 3],
    [8, 7, 9],
  ],
  'Already triangular': [
    [2, 1, 1],
    [0, 3, 2],
    [0, 0, 1],
  ],
  'Requires swap (LU fails)': [
    [0, 1, 2],
    [1, 0, 1],
    [2, 3, 1],
  ],
  '4×4 example': [
    [1, 2, 3, 4],
    [2, 5, 8, 11],
    [3, 8, 14, 20],
    [4, 11, 20, 30],
  ],
};

export function LUStepper() {
  const [matrix, setMatrix] = useState<number[][]>(PRESETS['Default 3×3']);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const result = useMemo(() => forwardEliminate(matrix, { partialPivot: false }), [matrix]);
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [matrix]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      const max = result.snapshots.length - 1;
      if (stepIndex < max) setStepIndex((s) => s + 1);
      else setPlaying(false);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [playing, stepIndex, result.snapshots.length]);

  const numSteps = result.ops.length;
  const U = result.snapshots[Math.min(stepIndex, result.snapshots.length - 1)];

  // Reconstruct partial L: include multipliers for ops up to stepIndex.
  const partialL = useMemo(() => {
    const m = matrix.length;
    const L: number[][] = Array.from({ length: m }, (_, i) =>
      Array.from({ length: m }, (_, j) => (i === j ? 1 : 0))
    );
    let opCount = 0;
    for (const mult of result.multipliers) {
      // Each multiplier corresponds to one op in result.ops; there can also be swap ops in between.
      // Walk ops to count which multipliers are applied so far.
      // Simpler: use the snapshots indexing directly — count the ops up to stepIndex that are 'add' ops.
      void mult;
      void opCount;
    }
    // Direct approach: replay ops and only fill L[i][c] for 'add' ops (with -scalar).
    let s = 0;
    for (const op of result.ops) {
      if (s >= stepIndex) break;
      if (op.type === 'add' && op.j !== undefined) {
        L[op.i][op.j] = -(op.scalar ?? 0);
      }
      s++;
    }
    return L;
  }, [stepIndex, result.ops, matrix.length]);

  const failedHere =
    result.failedAt !== null && stepIndex >= result.snapshots.length - 1;

  return (
    <div style={{ maxWidth: 800 }}>
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 20,
          display: 'flex',
          gap: 18,
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Block label="L" matrix={partialL} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text-tertiary)' }}>·</span>
        <Block label="U" matrix={U} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text-tertiary)' }}>=</span>
        <Block label="A" matrix={matrix} />
      </div>

      <div
        style={{
          marginTop: 14,
          padding: 12,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6,
        }}
      >
        {failedHere ? (
          <MonoLine color="var(--warn)">
            LU fails — pivot is zero at column {result.failedAt! + 1}. Use{' '}
            <Link
              to="/concept/plu-decomposition"
              style={{
                color: 'var(--accent-bright)',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                borderBottom: '1px dashed var(--accent-dim)',
              }}
            >
              PLU decomposition
            </Link>{' '}
            instead.
          </MonoLine>
        ) : stepIndex === 0 ? (
          <MonoLine>step 0: starting state</MonoLine>
        ) : stepIndex >= result.snapshots.length - 1 ? (
          <MonoLine color="var(--success)">A = LU ✓ — decomposition complete</MonoLine>
        ) : (
          <MonoLine>step {stepIndex} of {numSteps}: applying multiplier</MonoLine>
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <VizControlButton onClick={() => setStepIndex(0)} disabled={stepIndex === 0}>
          ⏮
        </VizControlButton>
        <VizControlButton
          onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
          disabled={stepIndex === 0}
        >
          ◀ prev
        </VizControlButton>
        <VizControlButton onClick={() => setPlaying((p) => !p)} disabled={stepIndex >= numSteps}>
          {playing ? '⏸' : '▶'} play
        </VizControlButton>
        <VizControlButton
          onClick={() => setStepIndex((s) => Math.min(numSteps, s + 1))}
          disabled={stepIndex >= numSteps}
        >
          next ▶
        </VizControlButton>
        <VizControlButton
          onClick={() => setStepIndex(numSteps)}
          disabled={stepIndex >= numSteps}
        >
          done ⏭
        </VizControlButton>
      </div>

      <div style={{ marginTop: 12 }}>
        <PresetSelect presets={Object.keys(PRESETS)} onPick={(name) => setMatrix(PRESETS[name].map((r) => [...r]))} />
      </div>
    </div>
  );
}

function Block({ label, matrix }: { label: string; matrix: number[][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontStyle: 'italic',
          color: 'var(--text-primary)',
        }}
      >
        {label}
      </span>
      <MatrixGrid matrix={matrix} cellSize={40} />
    </div>
  );
}
