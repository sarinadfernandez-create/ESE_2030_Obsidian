// Shared building blocks for Unit 1 visualizations: canvas grid/axes,
// drag-or-type matrix cells, status-overlay panels, preset selects, etc.

import { useEffect, useRef, useState } from 'react';
import { fmtCell } from '../../lib/linearAlgebra';

export const CANVAS_W = 640;
export const CANVAS_H = 440;
export const UNIT = 40;

export const w2sX = (x: number, cx = CANVAS_W / 2) => cx + x * UNIT;
export const w2sY = (y: number, cy = CANVAS_H / 2) => cy - y * UNIT;

// Grid + axes layer for any 2D viz canvas.
export function GridAxes({
  width = CANVAS_W,
  height = CANVAS_H,
  unit = UNIT,
}: {
  width?: number;
  height?: number;
  unit?: number;
}) {
  const cx = width / 2;
  const cy = height / 2;
  const lines: React.ReactNode[] = [];
  const xExtent = Math.ceil(cx / unit);
  const yExtent = Math.ceil(cy / unit);
  for (let i = -xExtent; i <= xExtent; i++) {
    lines.push(
      <line
        key={`gx-${i}`}
        x1={cx + i * unit}
        y1={0}
        x2={cx + i * unit}
        y2={height}
        stroke="var(--viz-grid)"
        strokeWidth={0.5}
      />
    );
  }
  for (let i = -yExtent; i <= yExtent; i++) {
    lines.push(
      <line
        key={`gy-${i}`}
        x1={0}
        y1={cy - i * unit}
        x2={width}
        y2={cy - i * unit}
        stroke="var(--viz-grid)"
        strokeWidth={0.5}
      />
    );
  }
  return (
    <g>
      {lines}
      <line x1={0} y1={cy} x2={width} y2={cy} stroke="var(--viz-axis)" strokeWidth={1} />
      <line x1={cx} y1={0} x2={cx} y2={height} stroke="var(--viz-axis)" strokeWidth={1} />
    </g>
  );
}

// Glass panel positioned over the top-left of a relative parent.
export function OverlayPanel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="glass"
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        padding: '10px 14px',
        borderRadius: 6,
        maxWidth: 320,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Drag-or-type number cell: horizontal-drag to scrub by `step`, click to type.
export function NumberCell({
  label,
  value,
  onChange,
  step = 0.1,
  min = -5,
  max = 5,
  width = 70,
}: {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  width?: number;
}) {
  const [text, setText] = useState(fmtCell(value));
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!editing) setText(fmtCell(value));
  }, [value, editing]);

  const dragRef = useRef<{ startX: number; startVal: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startVal: value };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const next = Math.max(min, Math.min(max, dragRef.current.startVal + dx * step * 0.1));
    onChange(Number(next.toFixed(3)));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 4,
        padding: '5px 8px',
        cursor: 'ew-resize',
        userSelect: 'none',
        width,
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-tertiary)',
          }}
        >
          {label}
        </span>
      )}
      <input
        type="text"
        value={text}
        onFocus={() => setEditing(true)}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => {
          setEditing(false);
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(n);
          else setText(fmtCell(value));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          width: 0,
          minWidth: 0,
          cursor: 'text',
        }}
      />
    </div>
  );
}

// Tiny preset-select with shared styling.
export function PresetSelect({
  presets,
  onPick,
}: {
  presets: string[];
  onPick: (name: string) => void;
}) {
  return (
    <select
      className="viz-preset-select"
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) onPick(e.target.value);
        e.target.value = '';
      }}
    >
      <option value="" disabled>
        Preset…
      </option>
      {presets.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}

// Inline matrix renderer for steppers (uses fmtCell for display).
export function MatrixGrid({
  matrix,
  highlight,
  augmentedColumn,
  cellSize = 44,
  warnRows,
}: {
  matrix: number[][];
  highlight?: { row: number; col: number }[];
  augmentedColumn?: number; // column index after which a vertical separator is drawn
  cellSize?: number;
  warnRows?: number[];
}) {
  if (matrix.length === 0) return null;
  const cols = matrix[0].length;
  const isHi = (r: number, c: number) => highlight?.some((p) => p.row === r && p.col === c);
  const isWarn = (r: number) => warnRows?.includes(r);
  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gap: 0,
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        background: 'var(--bg-panel)',
        position: 'relative',
        padding: 4,
      }}
    >
      {matrix.flatMap((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              height: cellSize - 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: isWarn(r) ? 'var(--warn)' : 'var(--text-primary)',
              background: isHi(r, c)
                ? 'rgba(96, 196, 255, 0.18)'
                : isWarn(r)
                ? 'rgba(255, 180, 84, 0.06)'
                : 'transparent',
              borderRadius: 3,
              borderRight:
                augmentedColumn !== undefined && c === augmentedColumn - 1
                  ? '1px solid var(--border-default)'
                  : undefined,
              marginRight:
                augmentedColumn !== undefined && c === augmentedColumn - 1 ? 4 : undefined,
              paddingRight:
                augmentedColumn !== undefined && c === augmentedColumn - 1 ? 4 : undefined,
            }}
          >
            {fmtCell(cell)}
          </div>
        ))
      )}
    </div>
  );
}

export function MonoLine({
  children,
  color = 'var(--text-secondary)',
  size = 10,
}: {
  children: React.ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: size, color }}>{children}</div>
  );
}

export function VizControlButton({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="graph-control-btn"
      style={{
        fontSize: 10,
        padding: '4px 10px',
        borderColor: active ? 'var(--border-glow)' : undefined,
        color: active ? 'var(--accent-bright)' : undefined,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}
