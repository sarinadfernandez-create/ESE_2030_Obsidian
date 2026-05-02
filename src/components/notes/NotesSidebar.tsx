import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotesStore } from '../../store/notesStore';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { BacklinksPanel } from './BacklinksPanel';
import { CONCEPTS } from '../../content/concepts.index';

interface NotesSidebarProps {
  conceptId: string;
}

export function NotesSidebar({ conceptId }: NotesSidebarProps) {
  // Subscribe to the raw notes record (stable reference unless notes change),
  // then derive the per-concept list locally. Calling a method-style selector
  // like getNotesForConcept inside useNotesStore returns a fresh array every
  // call and triggers Zustand's "getSnapshot should be cached" infinite loop.
  const notesMap = useNotesStore((s) => s.notes);
  const notes = useMemo(() => {
    return Object.values(notesMap)
      .filter((n) => n.linkedConcepts.includes(conceptId))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notesMap, conceptId]);
  const createNote = useNotesStore((s) => s.createNote);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  const concept = CONCEPTS.find((c) => c.id === conceptId);
  const conceptTitle = concept?.title ?? conceptId;

  const handleCreate = () => {
    const id = createNote({
      body: `Notes on [[${conceptId}]]\n\n`,
      linkedConcepts: [conceptId],
    });
    setOpenNoteId(id);
  };

  return (
    <>
      <aside className="w-72 flex-shrink-0 border-l border-border-subtle pl-6 pt-1">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              my notes
            </h3>
            {notes.length > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-tertiary)',
                  background: 'var(--bg-panel)',
                  padding: '1px 6px',
                  borderRadius: 9,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {notes.length} on this concept
              </span>
            )}
          </div>
          <button
            onClick={handleCreate}
            aria-label="New note"
            className="graph-control-btn"
            style={{ fontSize: 10, padding: '3px 8px' }}
          >
            + new
          </button>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <div style={{ padding: '12px 0 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              No notes yet.<br />
              Click <span style={{ color: 'var(--accent)' }}>+ new</span> to start one
              pre-linked to <span style={{ fontFamily: 'var(--font-mono)' }}>[[{conceptId}]]</span>.
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            {notes.map((n) => (
              <NoteCard key={n.id} note={n} onClick={() => setOpenNoteId(n.id)} />
            ))}
          </div>
        )}

        {/* Backlinks */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
          <BacklinksPanel target={{ kind: 'concept', id: conceptId }} />
        </div>
      </aside>

      {openNoteId && (
        <NoteModal
          noteId={openNoteId}
          conceptTitle={conceptTitle}
          onClose={() => setOpenNoteId(null)}
        />
      )}
    </>
  );
}

function NoteModal({
  noteId,
  conceptTitle: _conceptTitle,
  onClose,
}: {
  noteId: string;
  conceptTitle: string;
  onClose: () => void;
}) {
  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass"
        style={{
          width: 'min(960px, 100%)',
          height: 'min(80vh, 720px)',
          padding: 28,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Link
            to={`/note/${noteId}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-tertiary)',
              textDecoration: 'none',
            }}
          >
            ↗ open as page
          </Link>
          <button
            onClick={onClose}
            className="graph-control-btn"
            style={{ fontSize: 10, padding: '3px 10px' }}
          >
            close · esc
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <NoteEditor noteId={noteId} autoFocus />
        </div>
      </div>
    </div>
  );
}
