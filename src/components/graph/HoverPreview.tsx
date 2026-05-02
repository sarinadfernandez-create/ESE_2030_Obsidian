import { memo } from 'react';

interface HoverPreviewProps {
  title: string;
  number: string;
  blurb: string;
  unitLabel: string;
  unitColor: string;
  isApplication?: boolean;
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
}

export const HoverPreview = memo(function HoverPreview({
  title,
  number,
  blurb,
  unitLabel,
  unitColor,
  isApplication,
  x,
  y,
  containerWidth,
  containerHeight,
}: HoverPreviewProps) {
  const w = 260;
  const h = 120;
  const pad = 16;

  let left = x + 20;
  let top = y - 20;

  if (left + w + pad > containerWidth) left = x - w - 20;
  if (top + h + pad > containerHeight) top = containerHeight - h - pad;
  if (top < pad) top = pad;
  if (left < pad) left = pad;

  return (
    <div
      className="glass"
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        zIndex: 100,
        padding: '14px 16px',
        borderRadius: 8,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: unitColor,
            opacity: 0.8,
          }}
        >
          {number}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {unitLabel}
        </span>
        {isApplication && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              color: 'var(--accent-dim)',
              border: '1px solid var(--accent-dim)',
              borderRadius: 3,
              padding: '1px 4px',
              opacity: 0.7,
            }}
          >
            APP
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: 6,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}
      >
        {blurb}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-tertiary)',
          marginTop: 8,
          opacity: 0.6,
        }}
      >
        click to open →
      </div>
    </div>
  );
});
