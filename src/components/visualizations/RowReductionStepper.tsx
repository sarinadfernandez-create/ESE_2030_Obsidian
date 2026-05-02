import { useEffect, useMemo, useState } from 'react';
import { computeRREF, fmtCell, type RowOp } from '../../lib/linearAlgebra';
import {
  MatrixGrid,
  MonoLine,
  PresetSelect,
  VizControlButton,
} from './_shared';

const PRESETS: Record<string, { matrix: number[][]; augmented: number }> = {
  'Unique solution (3×3)': {
    matrix: [
      [1, 2, 1, 4],
      [2, 5, 1, 7],
      [3, 6, 4, 13],
    ],
    augmented: 3,
  },
  'Free variable present': {
    matrix: [
      [1, 2, 3, 6],
      [2, 4, 6, 12],
    ],
    augmented: 3,
  },
  'Inconsistent system': {
    matrix: [
      [1, 1, 1, 3],
      [2, 2, 2, 7],
    ],
    augmented: 3,
  },
  'Already in RREF': {
    matrix: [
      [1, 0, 0, 5],
      [0, 1, 0, -2],
      [0, 0, 1, 3],
    ],
    augmented: 3,
  },
  'Identity input': {
    matrix: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    augmented: undefined as unknown as number,
  },
  'Singular augmented (one zero row)': {
    matrix: [
      [1, 2, 3, 4],
      [2, 4, 6, 8],
      [1, 1, 1, 1],
    ],
    augmented: 3,
  },
};

function describeOp(op: RowOp): string {
  if (op.type === 'swap') return `R${(op.i ?? 0) + 1} ↔ R${(op.j ?? 0) + 1}`;
  if (op.type === 'scale') return `R${op.i + 1} → ${fmtCell(op.scalar ?? 1)} · R${op.i + 1}`;
  const s = op.scalar ?? 0;
  const sign = s < 0 ? '−' : '+';
  return `R${op.i + 1} → R${op.i + 1} ${sign} ${fmtCell(Math.abs(s))} · R${(op.j ?? 0) + 1}`;
}

export function RowReductionStepper() {
  const [presetName, setPresetName] = useState('Unique solution (3×3)');
  const preset = PRESETS[presetName];
  const augmented = preset?.augmented;
  const [matrix, setMatrix] = useState<number[][]>(preset.matrix);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Recompute on matrix change. Reset to step 0.
  const result = useMemo(() => computeRREF(matrix, { partialPivot: false }), [matrix]);
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [matrix]);

  // Auto-play timer
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (stepIndex < result.snapshots.length - 1) setStepIndex((s) => s + 1);
      else setPlaying(false);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [playing, stepIndex, result.snapshots.length]);

  const numSteps = result.ops.length;
  const currentMatrix = result.snapshots[stepIndex] ?? matrix;
  const currentOp = stepIndex > 0 ? result.ops[stepIndex - 1] : null;

  const inconsistentRow = useMemo(() => {
    if (augmented === undefined) return -1;
    const M = result.rref;
    const dataCols = augmented;
    for (let r = 0; r < M.length; r++) {
      const allZero = M[r].slice(0, dataCols).every((x) => Math.abs(x) < 1e-9);
      const rhsNonzero = Math.abs(M[r][dataCols]) > 1e-9;
      if (allZero && rhsNonzero) return r;
    }
    return -1;
  }, [result, augmented]);

  // Pivot highlight: show pivots up through the current step.
  const visiblePivots = useMemo(() => {
    // Pivots are recorded only at the end. For simplicity, show all pivots once we've reached RREF.
    if (stepIndex === numSteps) return result.pivots;
    return [];
  }, [stepIndex, numSteps, result.pivots]);

  const status = (() => {
    if (numSteps === 0) return 'matrix is already in RREF';
    if (stepIndex === 0) return 'step 0: original matrix';
    if (stepIndex < numSteps) return `step ${stepIndex} of ${numSteps}: ${describeOp(currentOp!)}`;
    if (inconsistentRow >= 0) return `inconsistent — row ${inconsistentRow + 1} reads [0 … 0 | c] with c ≠ 0`;
    if (augmented !== undefined) {
      const dataCols = augmented;
      const freeCount = dataCols - result.rank;
      if (freeCount > 0) return `RREF reached — rank = ${result.rank}, free vars = ${freeCount}`;
      return `RREF reached — rank = ${result.rank}, unique solution`;
    }
    return `RREF reached — rank = ${result.rank}`;
  })();

  const handlePreset = (name: string) => {
    setPresetName(name);
    setMatrix(PRESETS[name].matrix.map((r) => [...r]));
  };

  const handleReset = () => {
    setMatrix(preset.matrix.map((r) => [...r]));
  };

  const cols = matrix[0]?.length ?? 0;

  return (
    <div style={{ position: 'relative', maxWidth: 760 }}>
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ alignSelf: 'flex-start' }}>
          <MonoLine color="var(--accent-bright)" size={11}>
            {currentOp ? describeOp(currentOp) : stepIndex === 0 ? 'original matrix' : 'RREF reached'}
          </MonoLine>
        </div>
        <MatrixGrid
          matrix={currentMatrix}
          highlight={visiblePivots}
          augmentedColumn={augmented}
          warnRows={inconsistentRow >= 0 && stepIndex === numSteps ? [inconsistentRow] : []}
        />
        <MonoLine color="var(--text-tertiary)">
          step {stepIndex} of {numSteps}
        </MonoLine>
        <div style={{ display: 'flex', gap: 8 }}>
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
          <VizControlButton
            onClick={() => setStepIndex(numSteps)}
            disabled={stepIndex === numSteps}
          >
            RREF ⏭
          </VizControlButton>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6,
        }}
      >
        <MonoLine color="var(--accent)" size={11}>
          {status}
        </MonoLine>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <PresetSelect presets={Object.keys(PRESETS)} onPick={handlePreset} />
        <VizControlButton onClick={handleReset}>reset</VizControlButton>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
          edit cells:
        </span>
      </div>

      {/* Editable grid */}
      <div
        style={{
          marginTop: 10,
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${cols}, 60px)`,
          gap: 4,
        }}
      >
        {matrix.flatMap((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              type="number"
              step={1}
              value={cell}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (!Number.isFinite(n)) return;
                const next = matrix.map((row) => [...row]);
                next[r][c] = n;
                setMatrix(next);
              }}
              style={{
                width: 60,
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-subtle)',
                borderRight:
                  augmented !== undefined && c === augmented - 1
                    ? '2px solid var(--border-default)'
                    : undefined,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                padding: '4px 6px',
                textAlign: 'center',
                borderRadius: 3,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
