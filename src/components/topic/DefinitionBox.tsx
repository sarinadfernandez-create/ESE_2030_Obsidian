import { MarkdownMath } from '../math/MarkdownMath';
import type { Definition } from '../../content/types';

export function DefinitionBox({ def }: { def: Definition }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderLeft: '2px solid var(--accent-dim)',
        borderRadius: 4,
        padding: '14px 18px',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 6,
        }}
      >
        Definition
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: 6,
        }}
      >
        <MarkdownMath source={def.term} />
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
        <MarkdownMath source={def.body} />
      </div>
    </div>
  );
}
