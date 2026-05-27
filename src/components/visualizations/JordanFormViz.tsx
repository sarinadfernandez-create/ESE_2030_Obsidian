// 8.3 — Jordan Form (stationary). Annotated 5x5 Jordan-form diagram with two
// blocks at λ₁ = 3 (sizes 2 and 1) and one block at λ₂ = -1 (size 2).

import { useState } from 'react';
import { MonoLine } from './_shared';

type Block = {
  id: number;
  startRow: number; // 0-indexed
  size: number;
  lambda: number;
  label: string;
};

const BLOCKS: Block[] = [
  { id: 0, startRow: 0, size: 2, lambda: 3, label: 'Block 1: λ₁=3, size 2' },
  { id: 1, startRow: 2, size: 1, lambda: 3, label: 'Block 2: λ₁=3, size 1' },
  { id: 2, startRow: 3, size: 2, lambda: -1, label: 'Block 3: λ₂=-1, size 2' },
];

const N = 5;
const CELL = 56;

function getCellValue(i: number, j: number): { val: string; kind: 'eig' | 'one' | 'zero' } {
  for (const b of BLOCKS) {
    if (i >= b.startRow && i < b.startRow + b.size && j >= b.startRow && j < b.startRow + b.size) {
      if (i === j) return { val: String(b.lambda), kind: 'eig' };
      if (j === i + 1) return { val: '1', kind: 'one' };
    }
  }
  return { val: '0', kind: 'zero' };
}

function blockOfCell(i: number, j: number): number | null {
  for (const b of BLOCKS) {
    if (i >= b.startRow && i < b.startRow + b.size && j >= b.startRow && j < b.startRow + b.size) {
      return b.id;
    }
  }
  return null;
}

export function JordanFormViz() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>
        {/* Matrix grid */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
          <MonoLine size={9} color="var(--text-tertiary)">JORDAN CANONICAL FORM J (5×5)</MonoLine>
          <svg viewBox={`0 0 ${CELL * N + 20} ${CELL * N + 20}`} width="100%" style={{ display: 'block', marginTop: 8 }}>
            {/* Cells */}
            {Array.from({ length: N }).map((_, i) =>
              Array.from({ length: N }).map((_, j) => {
                const { val, kind } = getCellValue(i, j);
                const blockId = blockOfCell(i, j);
                const isHovered = hovered !== null && blockId === hovered;
                const x = 10 + j * CELL;
                const y = 10 + i * CELL;
                let fill = 'var(--bg-elevated, #1a1f2e)';
                let textColor = 'var(--text-tertiary, #888)';
                if (kind === 'eig') {
                  fill = 'rgba(103, 169, 255, 0.25)';
                  textColor = 'var(--viz-blue, #67a9ff)';
                } else if (kind === 'one') {
                  fill = 'rgba(255, 217, 102, 0.25)';
                  textColor = 'var(--viz-yellow, #ffd966)';
                }
                if (isHovered && blockId !== null) {
                  fill = 'rgba(111, 212, 154, 0.15)';
                }
                return (
                  <g key={`${i}-${j}`}>
                    <rect
                      x={x}
                      y={y}
                      width={CELL}
                      height={CELL}
                      fill={fill}
                      stroke="var(--border-subtle, #333)"
                      strokeWidth={0.5}
                    />
                    <text
                      x={x + CELL / 2}
                      y={y + CELL / 2 + 5}
                      fontSize={16}
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                      fill={textColor}
                      fontWeight={kind === 'zero' ? 400 : 600}
                    >
                      {val}
                    </text>
                  </g>
                );
              })
            )}
            {/* Block borders */}
            {BLOCKS.map((b) => {
              const x = 10 + b.startRow * CELL;
              const y = 10 + b.startRow * CELL;
              const sz = b.size * CELL;
              return (
                <rect
                  key={b.id}
                  x={x}
                  y={y}
                  width={sz}
                  height={sz}
                  fill="none"
                  stroke={hovered === b.id ? 'var(--viz-green, #6fd49a)' : 'var(--viz-blue, #67a9ff)'}
                  strokeWidth={hovered === b.id ? 2.5 : 2}
                  onPointerEnter={() => setHovered(b.id)}
                  onPointerLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </svg>
        </div>

        {/* Annotation panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <MonoLine size={9} color="var(--text-tertiary)">EIGENVALUE λ₁ = 3</MonoLine>
            <div style={{ marginTop: 4 }}>algebraic multiplicity: 3</div>
            <div>geometric multiplicity: 2 (two blocks)</div>
            <div>block sizes: {'{2, 1}'}</div>
          </div>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <MonoLine size={9} color="var(--text-tertiary)">EIGENVALUE λ₂ = -1</MonoLine>
            <div style={{ marginTop: 4 }}>algebraic multiplicity: 2</div>
            <div>geometric multiplicity: 1 (one block)</div>
            <div>block sizes: {'{2}'}</div>
          </div>
          <div style={{ background: 'rgba(111, 212, 154, 0.08)', border: '1px solid rgba(111, 212, 154, 0.4)', borderRadius: 6, padding: 10, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            # Jordan blocks for λ = geometric multiplicity.
            <br />Σ block sizes for λ = algebraic multiplicity.
          </div>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
            <MonoLine size={9} color="var(--text-tertiary)">CHAINS</MonoLine>
            <div style={{ marginTop: 4 }}>v₂ → v₁ (block 1)</div>
            <div>v₃ (block 2, no chain)</div>
            <div>v₅ → v₄ (block 3)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
