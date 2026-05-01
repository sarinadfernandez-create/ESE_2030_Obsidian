import type { Concept, Unit } from '../../content/types';
import { ReviewedToggle } from '../ui/ReviewedToggle';

interface TopicHeaderProps {
  concept: Concept;
  unit: Unit;
}

export function TopicHeader({ concept, unit }: TopicHeaderProps) {
  return (
    <div className="mb-2">
      {/* Unit label */}
      <p className="font-mono text-xs tracking-widest uppercase text-text-tertiary mb-3">
        Ch.{unit.number} · {unit.short}
        {concept.isApplication && (
          <span className="ml-2 text-warn">· Application</span>
        )}
      </p>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-4 min-w-0">
          <span
            className="font-mono text-sm text-text-muted flex-shrink-0 mt-1"
            aria-label={`Section ${concept.number}`}
          >
            {concept.number}
          </span>
          <h1 className="font-display text-5xl font-semibold text-text-primary leading-tight">
            {concept.title}
          </h1>
        </div>
        <div className="flex-shrink-0 mt-2">
          <ReviewedToggle conceptId={concept.id} />
        </div>
      </div>

      {/* Blurb */}
      <p className="mt-3 ml-14 text-text-secondary font-sans text-base leading-relaxed max-w-2xl">
        {concept.blurb}
      </p>
    </div>
  );
}
