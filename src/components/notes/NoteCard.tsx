import type { Note } from '../../content/types';

interface Props {
  note: Note;
  onClick: () => void;
}

function formatDate(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function NoteCard({ note, onClick }: Props) {
  const title = note.title.trim() || note.body.split('\n')[0]?.slice(0, 60) || 'Untitled';
  const preview = note.body.replace(/[#*_`]/g, '').replace(/\n+/g, ' ').slice(0, 80);
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: 'var(--note-yellow-bg)',
        border: '1px solid rgba(245, 230, 163, 0.18)',
        borderRadius: 4,
        padding: '10px 12px',
        marginBottom: 8,
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(245, 230, 163, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(245, 230, 163, 0.18)';
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-tertiary)',
          marginBottom: 4,
        }}
      >
        {formatDate(note.updatedAt)}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--note-yellow)',
          marginBottom: preview ? 4 : 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      {preview && (
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-tertiary)',
            lineHeight: 1.4,
          }}
        >
          {preview}
          {note.body.length > 80 && '…'}
        </div>
      )}
    </button>
  );
}
