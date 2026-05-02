import { MarkdownMath } from '../math/MarkdownMath';
import type { Theorem } from '../../content/types';

export function TheoremCard({ theorem }: { theorem: Theorem }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        padding: '16px 20px',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--accent-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 8,
        }}
      >
        Theorem
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 16,
          color: 'var(--text-primary)',
          marginBottom: 10,
        }}
      >
        {theorem.name}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: theorem.intuition ? 12 : 0 }}>
        <MarkdownMath source={theorem.statement} />
      </div>
      {theorem.intuition && (
        <div
          style={{
            fontSize: 13,
            color: 'var(--text-tertiary)',
            paddingTop: 10,
            borderTop: '1px solid var(--border-subtle)',
            fontStyle: 'italic',
          }}
        >
          <MarkdownMath source={theorem.intuition} />
        </div>
      )}
    </div>
  );
}
