// 4.5 — Similarity (interactive).
// Edit A and P. B = P^-1 A P. Trace, det, eigenvalues are preserved.
// Individual entries generally differ.

import { useMemo, useState } from 'react';
import { InlineMath } from 'react-katex';
import { computeEigen2, type Mat2 } from '../../lib/linearAlgebra';
import { MonoLine, NumberCell, VizControlButton } from './_shared';

const PRESETS_P: Record<string, Mat2> = {
  identity: [
    [1, 0],
    [0, 1],
  ],
  'rot 45°': [
    [Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4)],
    [Math.sin(Math.PI / 4), Math.cos(Math.PI / 4)],
  ],
  shear: [
    [1, 1],
    [0, 1],
  ],
  scale: [
    [2, 0],
    [0, 0.5],
  ],
};

function det2(M: Mat2): number {
  return M[0][0] * M[1][1] - M[0][1] * M[1][0];
}

function inv2(M: Mat2): Mat2 | null {
  const d = det2(M);
  if (Math.abs(d) < 1e-9) return null;
  return [
    [M[1][1] / d, -M[0][1] / d],
    [-M[1][0] / d, M[0][0] / d],
  ];
}

function mul(A: Mat2, B: Mat2): Mat2 {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];
}

function fmt(n: number): string {
  if (Math.abs(n) < 0.005) return '0.00';
  return n.toFixed(2);
}

function fmtEigen(eigen: ReturnType<typeof computeEigen2>): string {
  if (eigen.kind === 'complex') {
    return `${eigen.real.toFixed(3)} \\pm ${Math.abs(eigen.imag).toFixed(3)} i`;
  }
  if (eigen.kind === 'repeated') {
    return `${eigen.value.toFixed(3)}\\, (\\text{mult } 2)`;
  }
  return `${eigen.values[0].toFixed(3)},\\, ${eigen.values[1].toFixed(3)}`;
}

export function SimilarityViz() {
  const [A, setA] = useState<Mat2>([
    [2, 1],
    [0, 3],
  ]);
  const [P, setP] = useState<Mat2>([
    [1, 1],
    [0, 1],
  ]);

  const Pinv = useMemo(() => inv2(P), [P]);
  const B = useMemo<Mat2 | null>(() => {
    if (!Pinv) return null;
    return mul(Pinv, mul(A, P));
  }, [A, P, Pinv]);

  const eigenA = useMemo(() => computeEigen2(A), [A]);
  const eigenB = useMemo(() => (B ? computeEigen2(B) : null), [B]);

  const traceA = A[0][0] + A[1][1];
  const detA = det2(A);
  const traceB = B ? B[0][0] + B[1][1] : null;
  const detB = B ? det2(B) : null;

  const setAEntry = (r: number, c: number, val: number) => {
    setA((M) => {
      const next = M.map((row) => [...row]) as Mat2;
      next[r][c] = val;
      return next;
    });
  };
  const setPEntry = (r: number, c: number, val: number) => {
    setP((M) => {
      const next = M.map((row) => [...row]) as Mat2;
      next[r][c] = val;
      return next;
    });
  };

  return (
    <div style={{ maxWidth: 760 }}>
      {/* ── Three matrices side by side ─────────────────── */}
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: 14,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto 1fr',
          gap: 10,
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <MatrixBox label="A" matrix={A} onEntry={setAEntry} editable />
        <span style={{ fontSize: 22, color: 'var(--text-tertiary)' }}>·</span>
        <MatrixBox label="P" matrix={P} onEntry={setPEntry} editable warn={!Pinv} />
        <span style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>=</span>
        {B ? (
          <MatrixBox label="B = P⁻¹AP" matrix={B} editable={false} />
        ) : (
          <div style={{ color: 'rgba(255, 123, 107, 0.95)', fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'center' }}>
            P singular · B undefined
          </div>
        )}
      </div>

      {/* ── Invariants row ──────────────────────────────── */}
      {B && eigenB && (
        <div
          style={{
            marginTop: 12,
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            INVARIANTS · preserved under similarity
          </MonoLine>
          <InvariantRow
            label="trace"
            valueA={traceA.toFixed(3)}
            valueB={(traceB as number).toFixed(3)}
            ok={Math.abs(traceA - (traceB as number)) < 1e-3}
          />
          <InvariantRow
            label="det"
            valueA={detA.toFixed(3)}
            valueB={(detB as number).toFixed(3)}
            ok={Math.abs(detA - (detB as number)) < 1e-3}
          />
          <InvariantRow
            label="eigenvalues"
            valueA={fmtEigen(eigenA)}
            valueB={fmtEigen(eigenB)}
            ok
            isMath
          />
        </div>
      )}

      {/* ── Entry-mismatch annotation ───────────────────── */}
      {B && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: 'rgba(255, 217, 102, 0.05)',
            border: '1px solid rgba(255, 217, 102, 0.4)',
            borderRadius: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-secondary)',
          }}
        >
          individual entries are NOT preserved · A₁₁ ={' '}
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{fmt(A[0][0])}</span> · B₁₁ ={' '}
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{fmt(B[0][0])}</span>
        </div>
      )}

      {/* ── Controls ────────────────────────────────────── */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(PRESETS_P).map(([name, mat]) => (
          <VizControlButton key={name} onClick={() => setP(mat.map((r) => [...r]) as Mat2)}>
            P = {name}
          </VizControlButton>
        ))}
        <VizControlButton
          onClick={() => {
            setA([
              [2, 1],
              [0, 3],
            ]);
            setP([
              [1, 1],
              [0, 1],
            ]);
          }}
        >
          reset
        </VizControlButton>
      </div>
    </div>
  );
}

function MatrixBox({
  label,
  matrix,
  onEntry,
  editable,
  warn,
}: {
  label: string;
  matrix: Mat2;
  onEntry?: (r: number, c: number, v: number) => void;
  editable?: boolean;
  warn?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 16,
          color: warn ? 'rgba(255, 123, 107, 0.95)' : 'var(--text-primary)',
        }}
      >
        {label}
      </span>
      {editable && onEntry ? (
        <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(2, auto)', gap: 4 }}>
          {matrix.flatMap((row, r) =>
            row.map((cell, c) => (
              <NumberCell
                key={`${r}-${c}`}
                value={cell}
                onChange={(v) => onEntry(r, c, v)}
                step={0.5}
                min={-9}
                max={9}
                width={48}
              />
            ))
          )}
        </div>
      ) : (
        <div style={{ fontSize: 14 }}>
          <InlineMath
            math={`\\begin{pmatrix} ${fmt(matrix[0][0])} & ${fmt(matrix[0][1])} \\\\ ${fmt(matrix[1][0])} & ${fmt(matrix[1][1])} \\end{pmatrix}`}
          />
        </div>
      )}
    </div>
  );
}

function InvariantRow({
  label,
  valueA,
  valueB,
  ok,
  isMath,
}: {
  label: string;
  valueA: string;
  valueB: string;
  ok: boolean;
  isMath?: boolean;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '110px 1fr 1fr 30px',
        gap: 12,
        alignItems: 'center',
        padding: '4px 0',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-bright, #67a9ff)' }}>
        {label}(A) = {isMath ? <InlineMath math={valueA} /> : valueA}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-bright, #67a9ff)' }}>
        {label}(B) = {isMath ? <InlineMath math={valueB} /> : valueB}
      </span>
      <span
        style={{
          color: ok ? 'rgba(111, 212, 154, 1)' : 'rgba(255, 123, 107, 1)',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {ok ? '✓' : '✗'}
      </span>
    </div>
  );
}
