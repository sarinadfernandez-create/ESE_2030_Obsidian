// 3.1 — Euclidean Transformations (interactive).
// Stack scaling, rotation, shear, reflection. Watch the unit square get transformed,
// the composite matrix update, and the determinant/orientation reverse on reflections.

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { InlineMath } from 'react-katex';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Mat2 = [[number, number], [number, number]];

type Transform =
  | { id: number; kind: 'scale'; sx: number; sy: number }
  | { id: number; kind: 'rotate'; theta: number } // degrees
  | { id: number; kind: 'shear'; k: number; axis: 'x' | 'y' }
  | { id: number; kind: 'reflect'; line: 'x-axis' | 'y-axis' | 'y=x' };

const I2: Mat2 = [
  [1, 0],
  [0, 1],
];

let _id = 1;
const nextId = () => _id++;

function tMatrix(t: Transform): Mat2 {
  switch (t.kind) {
    case 'scale':
      return [
        [t.sx, 0],
        [0, t.sy],
      ];
    case 'rotate': {
      const r = (t.theta * Math.PI) / 180;
      const c = Math.cos(r);
      const s = Math.sin(r);
      return [
        [c, -s],
        [s, c],
      ];
    }
    case 'shear':
      return t.axis === 'x'
        ? [
            [1, t.k],
            [0, 1],
          ]
        : [
            [1, 0],
            [t.k, 1],
          ];
    case 'reflect':
      if (t.line === 'x-axis')
        return [
          [1, 0],
          [0, -1],
        ];
      if (t.line === 'y-axis')
        return [
          [-1, 0],
          [0, 1],
        ];
      return [
        [0, 1],
        [1, 0],
      ];
  }
}

function mMul(A: Mat2, B: Mat2): Mat2 {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];
}

function mDet(A: Mat2): number {
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

function tLabel(t: Transform): string {
  switch (t.kind) {
    case 'scale':
      return `scale (${t.sx}, ${t.sy})`;
    case 'rotate':
      return `rotate ${t.theta}°`;
    case 'shear':
      return `shear ${t.axis}=${t.k}`;
    case 'reflect':
      return `reflect ${t.line}`;
  }
}

const W = 480;
const H = 400;
const CX = W / 2;
const CY = H / 2;
const UNIT = 60;

export function EuclideanTransformViz() {
  // Composition order: stack[0] is applied FIRST (rightmost factor).
  // So composite = stack[n-1] * ... * stack[1] * stack[0]
  const [stack, setStack] = useState<Transform[]>([]);

  const composite = useMemo(() => {
    let M: Mat2 = I2;
    for (const t of stack) {
      M = mMul(tMatrix(t), M);
    }
    return M;
  }, [stack]);

  const det = mDet(composite);

  const add = (t: Transform) => setStack((s) => [...s, t]);
  const remove = (id: number) => setStack((s) => s.filter((t) => t.id !== id));
  const clear = () => setStack([]);

  // Map a unit-square corner to canvas via composite.
  const px = (x: number, y: number): [number, number] => {
    const tx = composite[0][0] * x + composite[0][1] * y;
    const ty = composite[1][0] * x + composite[1][1] * y;
    return [CX + tx * UNIT, CY - ty * UNIT];
  };

  // Original unit square corners (gray reference).
  const original: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const transformed = original.map(([x, y]) => px(x, y));

  // The "F" letter — a few segments inside the unit square so we can see orientation flip.
  const fSegments: [[number, number], [number, number]][] = [
    [[0.25, 0.2], [0.25, 0.8]], // vertical
    [[0.25, 0.8], [0.7, 0.8]], // top horizontal
    [[0.25, 0.5], [0.55, 0.5]], // middle horizontal
  ];

  return (
    <div style={{ maxWidth: 760 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 240px',
          gap: 14,
          alignItems: 'start',
        }}
      >
        {/* ── Plane panel ─────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 8,
            position: 'relative',
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Original unit square (gray, dashed) */}
            <polygon
              points={original.map(([x, y]) => `${CX + x * UNIT},${CY - y * UNIT}`).join(' ')}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1.2}
              strokeDasharray="3 4"
            />
            {fSegments.map(([[x1, y1], [x2, y2]], i) => (
              <line
                key={`fo-${i}`}
                x1={CX + x1 * UNIT}
                y1={CY - y1 * UNIT}
                x2={CX + x2 * UNIT}
                y2={CY - y2 * UNIT}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={1.5}
                strokeDasharray="2 3"
              />
            ))}

            {/* Transformed unit square (cyan) */}
            <motion.polygon
              animate={{ points: transformed.map((p) => `${p[0]},${p[1]}`).join(' ') }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              fill="rgba(103,169,255,0.18)"
              stroke="rgba(103,169,255,0.85)"
              strokeWidth={1.6}
              points={transformed.map((p) => `${p[0]},${p[1]}`).join(' ')}
            />
            {/* Transformed F segments */}
            {fSegments.map(([[x1, y1], [x2, y2]], i) => {
              const [ax, ay] = px(x1, y1);
              const [bx, by] = px(x2, y2);
              return (
                <motion.line
                  key={`ft-${i}`}
                  animate={{ x1: ax, y1: ay, x2: bx, y2: by }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  x1={ax}
                  y1={ay}
                  x2={bx}
                  y2={by}
                  stroke="rgba(103,169,255,1)"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Column vectors of composite, as labeled arrows */}
            <ColumnArrow from={[CX, CY]} to={px(1, 0)} color="var(--viz-blue, #67a9ff)" label="col 1" />
            <ColumnArrow from={[CX, CY]} to={px(0, 1)} color="var(--viz-yellow, #ffd966)" label="col 2" />
          </svg>

          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 12,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: det >= 0 ? 'var(--text-secondary)' : 'rgba(255, 183, 0, 0.95)',
              background: 'var(--bg-elevated)',
              padding: '4px 8px',
              borderRadius: 3,
              border: '1px solid var(--border-subtle)',
            }}
          >
            det = {det.toFixed(2)} · |area×| = {Math.abs(det).toFixed(2)}
            {det < 0 && ' · orientation reversed'}
          </div>
        </div>

        {/* ── Stack panel ─────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
          }}
        >
          <MonoLine size={9} color="var(--text-tertiary)">
            STACK · last applied on top
          </MonoLine>
          <div
            style={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              minHeight: 130,
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {stack.length === 0 && (
              <div
                style={{
                  fontSize: 11,
                  fontStyle: 'italic',
                  color: 'var(--text-tertiary)',
                  textAlign: 'center',
                  padding: 14,
                }}
              >
                no transformations · identity
              </div>
            )}
            {[...stack].reverse().map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  background: 'var(--bg-elevated)',
                  padding: '5px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                }}
              >
                <span>{tLabel(t)}</span>
                <button
                  onClick={() => remove(t.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: 0,
                    width: 16,
                    height: 16,
                  }}
                  aria-label="remove transformation"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
            <MonoLine size={9} color="var(--text-tertiary)">
              COMPOSITE MATRIX
            </MonoLine>
            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 13 }}>
              <InlineMath
                math={`\\begin{pmatrix} ${composite[0][0].toFixed(2)} & ${composite[0][1].toFixed(2)} \\\\ ${composite[1][0].toFixed(2)} & ${composite[1][1].toFixed(2)} \\end{pmatrix}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Add buttons ─────────────────────────────────────── */}
      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <VizControlButton onClick={() => add({ id: nextId(), kind: 'rotate', theta: 30 })}>+ rotate 30°</VizControlButton>
        <VizControlButton onClick={() => add({ id: nextId(), kind: 'rotate', theta: 90 })}>+ rotate 90°</VizControlButton>
        <VizControlButton onClick={() => add({ id: nextId(), kind: 'scale', sx: 1.5, sy: 1 })}>+ scale x×1.5</VizControlButton>
        <VizControlButton onClick={() => add({ id: nextId(), kind: 'scale', sx: 1, sy: 0.5 })}>+ scale y×0.5</VizControlButton>
        <VizControlButton onClick={() => add({ id: nextId(), kind: 'shear', k: 0.5, axis: 'x' })}>+ shear x</VizControlButton>
        <VizControlButton onClick={() => add({ id: nextId(), kind: 'shear', k: 0.5, axis: 'y' })}>+ shear y</VizControlButton>
        <VizControlButton onClick={() => add({ id: nextId(), kind: 'reflect', line: 'x-axis' })}>+ reflect x-axis</VizControlButton>
        <VizControlButton onClick={() => add({ id: nextId(), kind: 'reflect', line: 'y=x' })}>+ reflect y=x</VizControlButton>
        <VizControlButton onClick={clear}>clear</VizControlButton>
      </div>
    </div>
  );
}

function ColumnArrow({
  from,
  to,
  color,
  label,
}: {
  from: [number, number];
  to: [number, number];
  color: string;
  label: string;
}) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const ah = 7;
  const bx = to[0] - ux * ah - uy * ah * 0.5;
  const by = to[1] - uy * ah + ux * ah * 0.5;
  const cx = to[0] - ux * ah + uy * ah * 0.5;
  const cy = to[1] - uy * ah - ux * ah * 0.5;
  return (
    <g>
      <motion.line
        animate={{ x2: to[0], y2: to[1] }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke={color}
        strokeWidth={2}
      />
      <motion.polygon
        animate={{ points: `${to[0]},${to[1]} ${bx},${by} ${cx},${cy}` }}
        transition={{ duration: 0.4 }}
        points={`${to[0]},${to[1]} ${bx},${by} ${cx},${cy}`}
        fill={color}
      />
      <text
        x={to[0] + uy * 10}
        y={to[1] - ux * 10}
        fill={color}
        fontFamily="var(--font-mono)"
        fontStyle="italic"
        fontSize={10}
      >
        {label}
      </text>
    </g>
  );
}
