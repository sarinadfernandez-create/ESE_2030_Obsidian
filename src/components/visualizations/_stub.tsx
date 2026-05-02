// Shared placeholder for Unit 2 viz components that aren't built yet.
// Wraps the standard "coming soon" panel so each individual viz file is just one line.

export function StubViz({ name }: { name: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 8,
        padding: '32px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 8,
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
        Visualization coming soon — read the description above and the misconception below for the conceptual takeaway.
      </div>
    </div>
  );
}
