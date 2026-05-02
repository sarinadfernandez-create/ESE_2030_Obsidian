// Inline solution figures for multiple-choice problem panels.
// Each subcomponent is a small self-contained SVG (~360×240).

import { fmtCell, m2apply, m2det } from '../../lib/linearAlgebra';
import type {
  Lines2DData,
  MatrixHighlightData,
  ParallelogramData,
  SolutionVisual as SolutionVisualType,
  SubspaceTestData,
} from '../../content/types';

const FIG_W = 360;
const FIG_H = 240;

const HIGHLIGHT_COLOR: Record<MatrixHighlightData['highlights'][number]['color'], string> = {
  pivot: 'rgba(96, 196, 255, 0.18)',
  zero: 'rgba(120, 130, 150, 0.10)',
  warning: 'rgba(255, 180, 84, 0.18)',
  correct: 'rgba(79, 214, 163, 0.18)',
};

const HIGHLIGHT_BORDER: Record<MatrixHighlightData['highlights'][number]['color'], string> = {
  pivot: 'var(--accent)',
  zero: 'var(--text-muted)',
  warning: 'var(--warn)',
  correct: 'var(--success)',
};

export function SolutionVisual({ visual }: { visual: SolutionVisualType }) {
  if (!visual || visual.kind === 'none') return null;
  return (
    <figure
      style={{
        margin: '12px 0',
        padding: 14,
        background: 'var(--bg-base)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 6,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {visual.kind === 'matrix-highlight' && (
          <MatrixHighlight data={visual.data as MatrixHighlightData} />
        )}
        {visual.kind === 'lines-2d' && <Lines2D data={visual.data as Lines2DData} />}
        {visual.kind === 'parallelogram' && (
          <Parallelogram data={visual.data as ParallelogramData} />
        )}
        {visual.kind === 'subspace-test' && (
          <SubspaceTest data={visual.data as SubspaceTestData} />
        )}
      </div>
      {visual.caption && (
        <figcaption
          style={{
            marginTop: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-tertiary)',
            textAlign: 'center',
          }}
        >
          {visual.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── matrix-highlight ────────────────────────────────────────────────────────
function MatrixHighlight({ data }: { data: MatrixHighlightData }) {
  const cols = data.matrix[0]?.length ?? 0;
  const cell = 40;
  const sep = data.rowSeparator;
  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gap: 0,
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        background: 'var(--bg-panel)',
        padding: 4,
      }}
    >
      {data.matrix.flatMap((row, r) =>
        row.map((entry, c) => {
          const hl = data.highlights.find((h) => h.row === r && h.col === c);
          const value = typeof entry === 'number' ? fmtCell(entry) : entry;
          return (
            <div
              key={`${r}-${c}`}
              style={{
                height: cell - 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-primary)',
                background: hl ? HIGHLIGHT_COLOR[hl.color] : 'transparent',
                border: hl ? `1px solid ${HIGHLIGHT_BORDER[hl.color]}` : '1px solid transparent',
                borderRadius: 3,
                marginRight: sep !== undefined && c === sep - 1 ? 4 : 0,
                paddingRight: sep !== undefined && c === sep - 1 ? 4 : 0,
                borderRight:
                  sep !== undefined && c === sep - 1
                    ? '1px solid var(--border-default)'
                    : (hl ? `1px solid ${HIGHLIGHT_BORDER[hl.color]}` : '1px solid transparent'),
              }}
            >
              {value}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── lines-2d ────────────────────────────────────────────────────────────────
const LINE_COLORS = {
  blue: 'var(--viz-blue)',
  yellow: 'var(--viz-yellow)',
  red: 'var(--viz-red)',
};

function Lines2D({ data }: { data: Lines2DData }) {
  const [lo, hi] = data.range ?? [-4, 4];
  const range = hi - lo;
  const w2sX = (x: number) => ((x - lo) / range) * FIG_W;
  const w2sY = (y: number) => FIG_H - ((y - lo) / range) * FIG_H;

  // Endpoints for each line ax + by = c clipped at world bounds.
  const lineEndpoints = (a: number, b: number, c: number) => {
    if (Math.abs(b) > 1e-9) {
      return {
        x1: lo,
        y1: (c - a * lo) / b,
        x2: hi,
        y2: (c - a * hi) / b,
      };
    }
    if (Math.abs(a) > 1e-9) {
      return { x1: c / a, y1: lo, x2: c / a, y2: hi };
    }
    return null;
  };

  // Grid lines every 1 unit
  const gridStep = 1;
  const grid: React.ReactNode[] = [];
  for (let x = Math.ceil(lo); x <= hi; x += gridStep) {
    grid.push(
      <line
        key={`gx-${x}`}
        x1={w2sX(x)}
        y1={0}
        x2={w2sX(x)}
        y2={FIG_H}
        stroke="var(--viz-grid)"
        strokeWidth={0.5}
      />
    );
  }
  for (let y = Math.ceil(lo); y <= hi; y += gridStep) {
    grid.push(
      <line
        key={`gy-${y}`}
        x1={0}
        y1={w2sY(y)}
        x2={FIG_W}
        y2={w2sY(y)}
        stroke="var(--viz-grid)"
        strokeWidth={0.5}
      />
    );
  }

  return (
    <svg viewBox={`0 0 ${FIG_W} ${FIG_H}`} width={FIG_W} height={FIG_H}>
      {grid}
      <line x1={0} y1={w2sY(0)} x2={FIG_W} y2={w2sY(0)} stroke="var(--viz-axis)" strokeWidth={1} />
      <line x1={w2sX(0)} y1={0} x2={w2sX(0)} y2={FIG_H} stroke="var(--viz-axis)" strokeWidth={1} />
      {data.lines.map((line, i) => {
        const ep = lineEndpoints(line.a, line.b, line.c);
        if (!ep) return null;
        return (
          <g key={i}>
            <line
              x1={w2sX(ep.x1)}
              y1={w2sY(ep.y1)}
              x2={w2sX(ep.x2)}
              y2={w2sY(ep.y2)}
              stroke={LINE_COLORS[line.color]}
              strokeWidth={1.6}
            />
            {line.label && (
              <text
                x={w2sX(ep.x2) - 6}
                y={w2sY(ep.y2) + 14}
                textAnchor="end"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill={LINE_COLORS[line.color]}
              >
                {line.label}
              </text>
            )}
          </g>
        );
      })}
      {data.intersection && (
        <g>
          <circle
            cx={w2sX(data.intersection.x)}
            cy={w2sY(data.intersection.y)}
            r={4}
            fill="var(--accent)"
            stroke="var(--bg-base)"
            strokeWidth={2}
          />
          <text
            x={w2sX(data.intersection.x) + 8}
            y={w2sY(data.intersection.y) - 8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--accent-bright)"
          >
            {data.intersection.label ??
              `(${fmtCell(data.intersection.x)}, ${fmtCell(data.intersection.y)})`}
          </text>
        </g>
      )}
    </svg>
  );
}

// ── parallelogram ──────────────────────────────────────────────────────────
function Parallelogram({ data }: { data: ParallelogramData }) {
  const range = 4;
  const w2sX = (x: number) => ((x + range) / (2 * range)) * FIG_W;
  const w2sY = (y: number) => FIG_H - ((y + range) / (2 * range)) * FIG_H;
  const square: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const image = square.map((p) => m2apply(data.matrix, p));
  const path = (pts: [number, number][]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${w2sX(p[0])} ${w2sY(p[1])}`).join(' ') + ' Z';

  const det = m2det(data.matrix);

  return (
    <svg viewBox={`0 0 ${FIG_W} ${FIG_H}`} width={FIG_W} height={FIG_H}>
      <line x1={0} y1={w2sY(0)} x2={FIG_W} y2={w2sY(0)} stroke="var(--viz-axis)" strokeWidth={1} />
      <line x1={w2sX(0)} y1={0} x2={w2sX(0)} y2={FIG_H} stroke="var(--viz-axis)" strokeWidth={1} />
      {(data.showOriginalSquare ?? true) && (
        <path
          d={path(square)}
          fill="var(--viz-blue)"
          fillOpacity={0.1}
          stroke="var(--viz-blue)"
          strokeOpacity={0.6}
          strokeWidth={1.4}
        />
      )}
      <path
        d={path(image as [number, number][])}
        fill="var(--accent)"
        fillOpacity={0.18}
        stroke="var(--accent)"
        strokeOpacity={0.7}
        strokeWidth={1.6}
      />
      {(data.showDeterminant ?? true) && (
        <text
          x={FIG_W - 12}
          y={FIG_H - 12}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fill={Math.abs(det) < 1e-9 ? 'var(--warn)' : 'var(--accent-bright)'}
        >
          det = {fmtCell(det)}
        </text>
      )}
    </svg>
  );
}

// ── subspace-test ──────────────────────────────────────────────────────────
function SubspaceTest({ data }: { data: SubspaceTestData }) {
  const range = 4;
  const w2sX = (x: number) => ((x + range) / (2 * range)) * FIG_W;
  const w2sY = (y: number) => FIG_H - ((y + range) / (2 * range)) * FIG_H;

  const regionPath = (() => {
    switch (data.region) {
      case 'upper-half-plane':
        return `M 0 ${FIG_H / 2} L ${FIG_W} ${FIG_H / 2} L ${FIG_W} 0 L 0 0 Z`;
      case 'shifted-line':
        // y = x + 1, drawn as a thick line
        return null;
      case 'union-of-axes':
        return null;
      case 'unit-disk':
        return null;
      case 'custom':
      default:
        return null;
    }
  })();

  return (
    <svg viewBox={`0 0 ${FIG_W} ${FIG_H}`} width={FIG_W} height={FIG_H}>
      <line x1={0} y1={w2sY(0)} x2={FIG_W} y2={w2sY(0)} stroke="var(--viz-axis)" strokeWidth={1} />
      <line x1={w2sX(0)} y1={0} x2={w2sX(0)} y2={FIG_H} stroke="var(--viz-axis)" strokeWidth={1} />
      {regionPath && <path d={regionPath} fill="var(--viz-blue)" fillOpacity={0.12} stroke="var(--viz-blue)" strokeOpacity={0.4} />}
      {data.region === 'shifted-line' && (
        <line
          x1={w2sX(-range)}
          y1={w2sY(-range + 1)}
          x2={w2sX(range)}
          y2={w2sY(range + 1)}
          stroke="var(--viz-blue)"
          strokeOpacity={0.6}
          strokeWidth={1.6}
        />
      )}
      {data.region === 'union-of-axes' && (
        <>
          <line x1={0} y1={w2sY(0)} x2={FIG_W} y2={w2sY(0)} stroke="var(--viz-blue)" strokeOpacity={0.6} strokeWidth={2} />
          <line x1={w2sX(0)} y1={0} x2={w2sX(0)} y2={FIG_H} stroke="var(--viz-blue)" strokeOpacity={0.6} strokeWidth={2} />
        </>
      )}
      {data.region === 'unit-disk' && (
        <circle cx={w2sX(0)} cy={w2sY(0)} r={FIG_W / (2 * range)} fill="var(--viz-blue)" fillOpacity={0.12} stroke="var(--viz-blue)" strokeOpacity={0.5} strokeWidth={1.4} />
      )}

      {/* Failure annotation */}
      {data.failureExample.points?.map((p, i) => (
        <circle
          key={i}
          cx={w2sX(p[0])}
          cy={w2sY(p[1])}
          r={4}
          fill="var(--warn)"
          stroke="var(--bg-base)"
          strokeWidth={1.5}
        />
      ))}
      {data.failureExample.arrow && (
        <line
          x1={w2sX(data.failureExample.arrow.from[0])}
          y1={w2sY(data.failureExample.arrow.from[1])}
          x2={w2sX(data.failureExample.arrow.to[0])}
          y2={w2sY(data.failureExample.arrow.to[1])}
          stroke="var(--warn)"
          strokeWidth={2}
        />
      )}
      <text
        x={FIG_W / 2}
        y={FIG_H - 10}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fill="var(--warn)"
      >
        fails: {data.failureExample.kind.replace('-', ' ')}
      </text>
    </svg>
  );
}
