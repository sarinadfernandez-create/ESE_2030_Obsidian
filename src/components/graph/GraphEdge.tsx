import { memo } from 'react';
import type { EdgeType } from '../../content/types';

interface GraphEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: EdgeType;
  dimmed?: boolean;
}

export const GraphEdge = memo(function GraphEdge({
  x1,
  y1,
  x2,
  y2,
  type,
  dimmed,
}: GraphEdgeProps) {
  const opacity = dimmed ? 0.08 : 1;

  switch (type) {
    case 'prereq':
      return (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--border-default)"
          strokeWidth={1}
          opacity={opacity}
        />
      );

    case 'generalizes': {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLen = 8;
      const ax = x2 - headLen * Math.cos(angle - 0.35);
      const ay = y2 - headLen * Math.sin(angle - 0.35);
      const bx = x2 - headLen * Math.cos(angle + 0.35);
      const by = y2 - headLen * Math.sin(angle + 0.35);
      return (
        <g opacity={opacity}>
          <line
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--border-default)"
            strokeWidth={1.5}
          />
          <polyline
            points={`${ax},${ay} ${x2},${y2} ${bx},${by}`}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth={1.5}
          />
        </g>
      );
    }

    case 'applies-to':
      return (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--accent-dim)"
          strokeWidth={1}
          strokeDasharray="6 4"
          opacity={opacity}
        />
      );

    case 'related':
      return (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--border-subtle)"
          strokeWidth={0.8}
          strokeDasharray="2 3"
          opacity={opacity}
        />
      );

    case 'dual-of': {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const offset = 2;
      return (
        <g opacity={opacity}>
          <line
            x1={x1 + nx * offset} y1={y1 + ny * offset}
            x2={x2 + nx * offset} y2={y2 + ny * offset}
            stroke="var(--border-default)"
            strokeWidth={0.8}
          />
          <line
            x1={x1 - nx * offset} y1={y1 - ny * offset}
            x2={x2 - nx * offset} y2={y2 - ny * offset}
            stroke="var(--border-default)"
            strokeWidth={0.8}
          />
        </g>
      );
    }

    default:
      return (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--border-subtle)"
          strokeWidth={0.5}
          opacity={opacity}
        />
      );
  }
});

interface UnitEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const UnitEdge = memo(function UnitEdge({ x1, y1, x2, y2 }: UnitEdgeProps) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="var(--border-subtle)"
      strokeWidth={0.8}
      opacity={0.5}
    />
  );
});
