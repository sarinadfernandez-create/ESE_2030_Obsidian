import { MarkdownMath } from '../math/MarkdownMath';

export function MisconceptionCallout({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        background: 'rgba(255, 180, 84, 0.05)',
        border: '1px solid rgba(255, 180, 84, 0.3)',
        borderRadius: 4,
        padding: '16px 20px',
        marginTop: 24,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--warn)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 8,
        }}
      >
        ⚠ Misconception
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
        <MarkdownMath source={body} />
      </div>
    </div>
  );
}
