import { useProgressStore } from '../../store/progressStore';

interface ReviewedToggleProps {
  conceptId: string;
}

export function ReviewedToggle({ conceptId }: ReviewedToggleProps) {
  const { isReviewed, toggleReviewed } = useProgressStore();
  const reviewed = isReviewed(conceptId);

  return (
    <button
      onClick={() => toggleReviewed(conceptId)}
      aria-pressed={reviewed}
      aria-label={reviewed ? 'Mark as not reviewed' : 'Mark as reviewed'}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full
        font-mono text-xs tracking-wide
        border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-base
        ${reviewed
          ? 'text-success border-border-strong bg-bg-elevated'
          : 'text-text-tertiary border-border-default hover:border-border-strong hover:text-text-secondary'
        }
      `}
    >
      <span className={`text-base leading-none ${reviewed ? 'text-success' : 'text-text-muted'}`}>
        {reviewed ? '●' : '○'}
      </span>
      {reviewed ? 'reviewed' : 'mark as reviewed'}
    </button>
  );
}
