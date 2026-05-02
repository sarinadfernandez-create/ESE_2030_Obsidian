import { MarkdownMath } from '../math/MarkdownMath';
import type { WorkedExampleStep } from '../../content/types';

export function WorkedExample({ steps }: { steps: WorkedExampleStep[] }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 6,
        padding: '20px 24px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Worked Example
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {steps.map((step, i) => (
          <li key={i} style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--accent)',
                flexShrink: 0,
                width: 28,
                paddingTop: 2,
              }}
            >
              {String(i + 1).padStart(2, '0')}.
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  marginBottom: 6,
                }}
              >
                {step.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                <MarkdownMath source={step.body} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
