import { memo } from 'react';
import type { Unit } from '../../content/types';

interface UnitBlobProps {
  unit: Unit;
  x: number;
  y: number;
  radius: number;
  conceptCount: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const UnitBlob = memo(function UnitBlob({
  unit,
  x,
  y,
  radius,
  conceptCount,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: UnitBlobProps) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <circle
        r={radius}
        fill={unit.color}
        fillOpacity={isHovered ? 0.25 : 0.15}
        stroke={unit.color}
        strokeOpacity={isHovered ? 0.6 : 0.3}
        strokeWidth={isHovered ? 2 : 1.5}
        style={{ transition: 'fill-opacity 0.2s, stroke-opacity 0.2s' }}
      />
      {isHovered && (
        <circle
          r={radius + 4}
          fill="none"
          stroke={unit.color}
          strokeOpacity={0.15}
          strokeWidth={1}
        />
      )}
      <text
        textAnchor="middle"
        dy="-0.3em"
        fill="var(--text-primary)"
        fontFamily="var(--font-display)"
        fontSize={14}
        fontWeight={500}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {unit.short}
      </text>
      <text
        textAnchor="middle"
        dy="1.2em"
        fill="var(--text-tertiary)"
        fontFamily="var(--font-mono)"
        fontSize={10}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        Ch.{unit.number} · {conceptCount}
      </text>
    </g>
  );
});

interface ConceptNodeProps {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  number: string;
  isApplication?: boolean;
  isReviewed?: boolean;
  isPinned?: boolean;
  isHovered: boolean;
  dimmed?: boolean;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onDoubleClick: () => void;
}

export const ConceptNode = memo(function ConceptNode({
  x,
  y,
  color,
  label,
  number,
  isApplication,
  isReviewed,
  isPinned,
  isHovered,
  dimmed,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onPointerDown,
  onDoubleClick,
}: ConceptNodeProps) {
  const r = 14;
  const opacity = dimmed ? 0.3 : 1;

  if (isApplication) {
    const d = r * 1.1;
    const diamond = `M 0 ${-d} L ${d} 0 L 0 ${d} L ${-d} 0 Z`;
    return (
      <g
        transform={`translate(${x}, ${y})`}
        opacity={opacity}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onDoubleClick={onDoubleClick}
        style={{ cursor: 'pointer' }}
      >
        <path
          d={diamond}
          fill="var(--accent-dim)"
          fillOpacity={0.6}
          stroke={isHovered ? 'var(--accent)' : 'var(--accent-dim)'}
          strokeWidth={isHovered ? 2 : 1}
          style={{ transition: 'stroke 0.15s, fill-opacity 0.15s' }}
        />
        {isHovered && (
          <path
            d={`M 0 ${-(d + 4)} L ${d + 4} 0 L 0 ${d + 4} L ${-(d + 4)} 0 Z`}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        )}
        {isReviewed && (
          <circle cx={d - 2} cy={-d + 2} r={3} fill="var(--success)" />
        )}
        {isPinned && (
          <circle cx={0} cy={d + 6} r={2} fill="var(--text-tertiary)" />
        )}
        <text
          textAnchor="middle"
          dy={r + 16}
          fill="var(--text-secondary)"
          fontFamily="var(--font-sans)"
          fontSize={10}
          opacity={isHovered ? 1 : 0.7}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {label.length > 18 ? label.slice(0, 16) + '…' : label}
        </text>
      </g>
    );
  }

  return (
    <g
      transform={`translate(${x}, ${y})`}
      opacity={opacity}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      <circle
        r={r}
        fill={color}
        fillOpacity={0.35}
        stroke={isHovered ? 'var(--accent)' : color}
        strokeOpacity={isHovered ? 1 : 0.5}
        strokeWidth={isHovered ? 2 : 1.2}
        style={{ transition: 'stroke 0.15s, stroke-opacity 0.15s' }}
      />
      {isHovered && (
        <circle
          r={r + 4}
          fill="none"
          stroke="var(--accent)"
          strokeOpacity={0.25}
          strokeWidth={1}
        />
      )}
      <text
        textAnchor="middle"
        dy="0.35em"
        fill="var(--text-primary)"
        fontFamily="var(--font-mono)"
        fontSize={8}
        fontWeight={500}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {number}
      </text>
      {isReviewed && (
        <circle cx={r - 2} cy={-r + 2} r={3} fill="var(--success)" />
      )}
      {isPinned && (
        <circle cx={0} cy={r + 6} r={2} fill="var(--text-tertiary)" />
      )}
      <text
        textAnchor="middle"
        dy={r + 16}
        fill="var(--text-secondary)"
        fontFamily="var(--font-sans)"
        fontSize={10}
        opacity={isHovered ? 1 : 0.7}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {label.length > 18 ? label.slice(0, 16) + '…' : label}
      </text>
    </g>
  );
});

interface NoteNodeProps {
  x: number;
  y: number;
  title: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const NoteNode = memo(function NoteNode({
  x,
  y,
  title,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: NoteNodeProps) {
  const size = 12;
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(6)`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={-size}
        y={-size}
        width={size * 2}
        height={size * 2}
        rx={2}
        fill="var(--note-yellow)"
        fillOpacity={isHovered ? 0.35 : 0.2}
        stroke="var(--note-yellow)"
        strokeOpacity={isHovered ? 0.6 : 0.3}
        strokeWidth={1}
      />
      <text
        textAnchor="middle"
        dy={size + 14}
        transform="rotate(-6)"
        fill="var(--note-yellow)"
        fontFamily="var(--font-sans)"
        fontSize={9}
        opacity={isHovered ? 1 : 0.6}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {title.length > 14 ? title.slice(0, 12) + '…' : title}
      </text>
    </g>
  );
});
