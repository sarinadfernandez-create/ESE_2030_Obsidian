import { useEffect, useMemo, useState } from 'react';
import { computeRREF, fmtCell, matMat, type RowOp } from '../../lib/linearAlgebra';
import { MatrixGrid, MonoLine, PresetSelect, VizControlButton } from './_shared';

const PRESETS: Record<string, number[][]> = {
  'Default 3×3 (invertible)': [
    [2, 1, 1],
    [4, 3, 3],
    [8, 7, 9],
  ],
  Identity: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  Singular: [
    [1, 2, 3],
    [2, 4, 6],
    [1, 1, 1],
  ],
  'Swap needed': [
    [0, 1, 2],
    [1, 0, 1],
    [2, 3, 1],
  ],
};

// Build the elementary matrix for a given row op on an n×n identity.
function elementaryMatrix(op: RowOp, n: number): number[][] {
  const E: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
  if (op.type === 'swap' && op.j !== undefined) {
    [E[op.i], E[op.j]] = [E[op.j], E[op.i]];
  } else if (op.type === 'scale') {
    E[op.i][op.i] = op.scalar ?? 1;
  } else if (op.type === 'add' && op.j !== undefined) {
    E[op.i][op.j] = op.scalar ?? 0;
  }
  return E;
}

function describeOp(op: RowOp): string {
  if (op.type === 'swap') return `R${(op.i ?? 0) + 1} ↔ R${(op.j ?? 0) + 1}`;
  if (op.type === 'scale') return `R${op.i + 1} → ${fmtCell(op.scalar ?? 1)} · R${op.i + 1}`;
  const s = op.scalar ?? 0;
  return `R${op.i + 1} → R${op.i + 1} ${s < 0 ? '−' : '+'} ${fmtCell(Math.abs(s))} · R${(op.j ?? 0) + 1}`;
}

export function EliminationAsMatrices() {
  const [matrix, setMatrix] = useState<number[][]>(PRESETS['Default 3×3 (invertible)']);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const result = useMemo(() => computeRREF(matrix, { partialPivot: false }), [matrix]);
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [matrix]);
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (stepIndex < result.snapshots.length - 1) setStepIndex((s) => s + 1);
      else setPlaying(false);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [playing, stepIndex, result.snapshots.length]);

  const n = matrix.length;
  const numSteps = result.ops.length;

  // Cumulative product of E_k...E_1 up to step `stepIndex` ops applied.
  const cumProduct = useMemo(() => {
    let P: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
    for (let k = 0; k < stepIndex; k++) {
      const E = elementaryMatrix(result.ops[k], n);
      P = matMat(E, P);
    }
    return P;
  }, [stepIndex, result.ops, n]);

  const right = result.snapshots[stepIndex] ?? matrix;
  const currentE = stepIndex > 0 ? elementaryMatrix(result.ops[stepIndex - 1], n) : null;
  const currentOp = stepIndex > 0 ? result.ops[stepIndex - 1] : null;

  const isReachedI = useMemo(() => {
    if (stepIndex !== numSteps) return false;
    const M = right;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const target = i === j ? 1 : 0;
        if (Math.abs(M[i][j] - target) > 1e-7) return false;
      }
    return true;
  }, [right, n, numSteps, stepIndex]);

  return (
    <div style={{ maxWidth: 760 }}>
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div>
            <MonoLine color="var(--text-tertiary)" size={9}>
              E_k · … · E₁
            </MonoLine>
            <div style={{ marginTop: 4 }}>
              <MatrixGrid matrix={cumProduct} cellSize={42} />
            </div>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              color: 'var(--text-tertiary)',
            }}
          >
            ·
          </span>
          <div>
            <MonoLine color="var(--text-tertiary)" size={9}>
              current state
            </MonoLine>
            <div style={{ marginTop: 4 }}>
              <MatrixGrid matrix={right} cellSize={42} />
            </div>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              color: 'var(--text-tertiary)',
            }}
          >
            =
          </span>
          <div>
            <MonoLine color="var(--text-tertiary)" size={9}>
              E_k · … · E₁ · A
            </MonoLine>
            <div style={{ marginTop: 4 }}>
              <MatrixGrid matrix={matMat(cumProduct, matrix)} cellSize={42} />
            </div>
          </div>
        </div>

        {currentE && currentOp && (
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <MonoLine color="var(--accent-bright)" size={11}>
              E_{stepIndex} = E({describeOp(currentOp)})
            </MonoLine>
            <MatrixGrid
              matrix={currentE}
              cellSize={36}
              highlight={Array.from({ length: n }, (_, j) => ({ row: currentOp.i, col: j }))}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <VizControlButton onClick={() => setStepIndex(0)} disabled={stepIndex === 0}>
            ⏮ start
          </VizControlButton>
          <VizControlButton onClick={() => setStepIndex((s) => Math.max(0, s - 1))} disabled={stepIndex === 0}>
            ◀ prev
          </VizControlButton>
          <VizControlButton onClick={() => setPlaying((p) => !p)} disabled={stepIndex === numSteps}>
            {playing ? '⏸ pause' : '▶ play'}
          </VizControlButton>
          <VizControlButton
            onClick={() => setStepIndex((s) => Math.min(numSteps, s + 1))}
            disabled={stepIndex === numSteps}
          >
            next ▶
          </VizControlButton>
          <VizControlButton onClick={() => setStepIndex(numSteps)} disabled={stepIndex === numSteps}>
            RREF ⏭
          </VizControlButton>
        </div>
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
        {stepIndex === numSteps && isReachedI && (
          <MonoLine color="var(--success)">
            Eₙ · … · E₁ · A = I → cumulative product on left is A⁻¹
          </MonoLine>
        )}
        {stepIndex === numSteps && !isReachedI && (
          <MonoLine color="var(--warn)">
            A is singular — cumulative product on left is not an inverse
          </MonoLine>
        )}
        {stepIndex < numSteps && (
          <MonoLine color="var(--text-secondary)">
            step {stepIndex} of {numSteps} — applying elementary matrices left-to-right on A
          </MonoLine>
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <PresetSelect
          presets={Object.keys(PRESETS)}
          onPick={(name) => setMatrix(PRESETS[name].map((r) => [...r]))}
        />
      </div>
    </div>
  );
}
