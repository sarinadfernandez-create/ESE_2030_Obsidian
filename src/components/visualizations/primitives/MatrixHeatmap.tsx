// Shared primitive used by Unit 12 vizes. Renders a matrix as a grid of cells
// in grayscale or diverging colormap, with optional per-cell overlays.

import { divergingColor, scaleToGrayscale, type Matrix } from '../utils/lowRank';

type Overlay = 'mask' | 'observed' | 'inferred' | 'highlight' | null;

type Props = {
  matrix: Matrix;
  width?: number; // total svg width in viewBox units
  height?: number;
  mode?: 'grayscale' | 'diverging';
  range?: [number, number]; // fixed scale; otherwise auto
  overlays?: (Overlay | null)[][]; // same shape as matrix
  cellGap?: number; // gap between cells in viewBox units (0 = touching)
};

export function MatrixHeatmap({
  matrix,
  width = 240,
  height = 240,
  mode = 'grayscale',
  range,
  overlays,
  cellGap = 0,
}: Props) {
  const m = matrix.length;
  const n = matrix[0]?.length ?? 0;
  if (m === 0 || n === 0) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block' }}>
        <rect width={width} height={height} fill="var(--bg-elevated, #1a1f2e)" />
      </svg>
    );
  }
  const cellW = (width - cellGap * (n - 1)) / n;
  const cellH = (height - cellGap * (m - 1)) / m;

  let getColor: (v: number) => string;
  let scaleInfo: { min: number; max: number } | null = null;
  if (mode === 'grayscale') {
    const { toGray, min, max } = scaleToGrayscale(matrix, range);
    scaleInfo = { min, max };
    getColor = (v) => {
      const g = toGray(v);
      return `rgb(${g}, ${g}, ${g})`;
    };
  } else {
    let maxAbs = 0;
    if (range) maxAbs = Math.max(Math.abs(range[0]), Math.abs(range[1]));
    else {
      for (const row of matrix) for (const v of row) {
        const a = Math.abs(v);
        if (a > maxAbs) maxAbs = a;
      }
    }
    getColor = (v) => {
      const [r, g, b] = divergingColor(v, maxAbs);
      return `rgb(${r}, ${g}, ${b})`;
    };
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block' }}>
      {matrix.map((row, i) =>
        row.map((v, j) => {
          const x = j * (cellW + cellGap);
          const y = i * (cellH + cellGap);
          const overlay = overlays?.[i]?.[j] ?? null;
          let strokeColor: string | undefined;
          let strokeWidth = 0;
          let fillOverride: string | undefined;
          if (overlay === 'mask') {
            // Hatched red for unobserved
            fillOverride = 'var(--bg-panel, #1a1f2e)';
            strokeColor = 'rgba(255, 123, 107, 0.55)';
            strokeWidth = 0.4;
          } else if (overlay === 'observed') {
            strokeColor = 'rgba(111, 212, 154, 0.7)';
            strokeWidth = 0.5;
          } else if (overlay === 'inferred') {
            strokeColor = 'rgba(184, 150, 255, 0.5)';
            strokeWidth = 0.4;
          } else if (overlay === 'highlight') {
            strokeColor = 'rgba(255, 217, 102, 0.9)';
            strokeWidth = 0.6;
          }
          return (
            <g key={`${i}-${j}`}>
              <rect
                x={x}
                y={y}
                width={cellW}
                height={cellH}
                fill={fillOverride ?? getColor(v)}
              />
              {overlay === 'mask' && (
                // diagonal hatch lines
                <line
                  x1={x}
                  y1={y + cellH}
                  x2={x + cellW}
                  y2={y}
                  stroke="rgba(255, 123, 107, 0.6)"
                  strokeWidth={0.3}
                />
              )}
              {strokeColor && overlay !== 'mask' && (
                <rect
                  x={x}
                  y={y}
                  width={cellW}
                  height={cellH}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
              )}
            </g>
          );
        })
      )}
      {scaleInfo && range === undefined && (
        <text
          x={width - 4}
          y={height - 4}
          textAnchor="end"
          fontSize={8}
          fontFamily="var(--font-mono)"
          fill="rgba(255,255,255,0.4)"
        >
          [{scaleInfo.min.toFixed(2)}, {scaleInfo.max.toFixed(2)}]
        </text>
      )}
    </svg>
  );
}
