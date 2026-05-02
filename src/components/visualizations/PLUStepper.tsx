import { useEffect, useMemo, useState } from 'react';
import { forwardEliminate, fmtCell } from '../../lib/linearAlgebra';
import { MatrixGrid, MonoLine, PresetSelect, VizControlButton } from './_shared';

const PRESETS: Record<string, number[][]> = {
  'Default (requires swap)': [
    [0, 1, 2],
    [1, 0, 1],
    [2, 3, 1],
  ],
  'No swaps needed': [
    [2, 1, 1],
    [4, 3, 3],
    [8, 7, 9],
  ],
  'Partial pivoting recommended': [
    [0.001, 1],
    [1, 1],
  ],
  'Singular matrix': [
    [1, 2, 3],
    [2, 4, 6],
    [3, 6, 9],
  ],
};

export function PLUStepper() {
  const [matrix, setMatrix] = useState<number[][]>(PRESETS['Default (requires swap)']);
  const [usePartialPivot, setUsePartialPivot] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const result = useMemo(
    () => forwardEliminate(matrix, { partialPivot: usePartialPivot }),
    [matrix, usePartialPivot]
  );
  useEffect(() => setStepIndex(0), [matrix, usePartialPivot]);

  const n = matrix.length;
  const numSteps = result.ops.length;
  const U = result.snapshots[Math.min(stepIndex, result.snapshots.length - 1)];

  // Partial P, L tracking: replay ops up to stepIndex.
  const { P, L } = useMemo(() => {
    const Pm: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
    const Lm: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
    let s = 0;
    for (const op of result.ops) {
      if (s >= stepIndex) break;
      if (op.type === 'swap' && op.j !== undefined) {
        [Pm[op.i], Pm[op.j]] = [Pm[op.j], Pm[op.i]];
        // Swap previously stored multipliers in L (cols < op.i).
        for (let j = 0; j < op.i; j++) {
          [Lm[op.i][j], Lm[op.j][j]] = [Lm[op.j][j], Lm[op.i][j]];
        }
      } else if (op.type === 'add' && op.j !== undefined) {
        Lm[op.i][op.j] = -(op.scalar ?? 0);
      }
      s++;
    }
    return { P: Pm, L: Lm };
  }, [stepIndex, result.ops, n]);

  const finished = stepIndex >= result.snapshots.length - 1;
  const detSign = result.swappedSteps.length % 2 === 0 ? 1 : -1;
  const detVal = U.reduce((acc, row, i) => acc * (row[i] ?? 0), 1) * detSign;

  // Largest absolute multiplier, for stability comparison.
  const maxMultiplier = result.multipliers.reduce(
    (acc, m) => Math.max(acc, Math.abs(m.value)),
    0
  );

  return (
    <div style={{ maxWidth: 880 }}>
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 20,
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Block label="P" matrix={P} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-tertiary)' }}>·</span>
        <Block label="A" matrix={matrix} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-tertiary)' }}>=</span>
        <Block label="L" matrix={L} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-tertiary)' }}>·</span>
        <Block label="U" matrix={U} />
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
        {result.failedAt !== null ? (
          <MonoLine color="var(--warn)">
            A is singular — even with available swaps, column {result.failedAt + 1} has no nonzero pivot below row {result.failedAt + 1}
          </MonoLine>
        ) : finished ? (
          <>
            <MonoLine color="var(--success)">PA = LU ✓</MonoLine>
            <MonoLine color="var(--text-tertiary)">
              det(A) = {detSign === 1 ? '' : '−'}∏ Uᵢᵢ ≈ {fmtCell(detVal)} (sign from {result.swappedSteps.length} swap{result.swappedSteps.length === 1 ? '' : 's'})
            </MonoLine>
            <MonoLine color="var(--text-tertiary)">
              max |L multiplier| = {fmtCell(maxMultiplier)}
            </MonoLine>
          </>
        ) : stepIndex === 0 ? (
          <MonoLine>step 0: starting state</MonoLine>
        ) : (
          <MonoLine>
            step {stepIndex} of {numSteps}
          </MonoLine>
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <VizControlButton onClick={() => setStepIndex(0)} disabled={stepIndex === 0}>
          ⏮
        </VizControlButton>
        <VizControlButton onClick={() => setStepIndex((s) => Math.max(0, s - 1))} disabled={stepIndex === 0}>
          ◀ prev
        </VizControlButton>
        <VizControlButton
          onClick={() => setStepIndex((s) => Math.min(numSteps, s + 1))}
          disabled={stepIndex >= numSteps}
        >
          next ▶
        </VizControlButton>
        <VizControlButton onClick={() => setStepIndex(numSteps)} disabled={stepIndex >= numSteps}>
          done ⏭
        </VizControlButton>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={usePartialPivot}
            onChange={(e) => setUsePartialPivot(e.target.checked)}
          />
          use partial pivoting
        </label>
        <PresetSelect presets={Object.keys(PRESETS)} onPick={(name) => setMatrix(PRESETS[name].map((r) => [...r]))} />
      </div>
    </div>
  );
}

function Block({ label, matrix }: { label: string; matrix: number[][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontStyle: 'italic',
          color: 'var(--text-primary)',
        }}
      >
        {label}
      </span>
      <MatrixGrid matrix={matrix} cellSize={36} />
    </div>
  );
}
