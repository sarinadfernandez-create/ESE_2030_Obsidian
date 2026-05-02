import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNotesStore } from '../store/notesStore';
import { NoteEditor } from '../components/notes/NoteEditor';
import { BacklinksPanel } from '../components/notes/BacklinksPanel';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export function NotePage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const note = useNotesStore((s) => s.notes[id]);
  const createNote = useNotesStore((s) => s.createNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  // /note/new sentinel: create a fresh note and redirect
  useEffect(() => {
    if (id === 'new') {
      const newId = createNote({});
      navigate(`/note/${newId}`, { replace: true });
    }
  }, [id, createNote, navigate]);

  if (id === 'new') return null;

  if (!note) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          404 · Note not found
        </p>
        <p className="font-mono text-xs text-text-tertiary">{id}</p>
        <Link
          to="/graph"
          className="font-mono text-xs text-accent hover:text-accent-bright transition-colors mt-4"
        >
          ← Back to graph
        </Link>
      </div>
    );
  }

  const displayTitle = note.title.trim() || note.body.split('\n')[0]?.slice(0, 60) || 'Untitled';

  const handleDelete = () => {
    if (confirm('Delete this note? This cannot be undone.')) {
      deleteNote(note.id);
      navigate('/graph');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <div className="flex gap-12">
        <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column' }}>
          <Breadcrumb
            items={[
              { label: 'Graph', href: '/graph' },
              { label: 'My Notes' },
              { label: displayTitle },
            ]}
          />
          <div style={{ flex: 1, marginTop: 12 }}>
            <NoteEditor noteId={note.id} autoFocus />
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
            <BacklinksPanel target={{ kind: 'note', id: note.id }} />
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleDelete}
              className="graph-control-btn"
              style={{
                fontSize: 10,
                color: 'var(--warn)',
                borderColor: 'rgba(255, 180, 84, 0.3)',
              }}
            >
              delete note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
