import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CONCEPTS, EDGES } from '../../content/concepts.index';
import { useNotesStore } from '../../store/notesStore';

interface ConceptBacklink {
  kind: 'concept';
  id: string;
  title: string;
  edgeType: string;
}

interface NoteBacklink {
  kind: 'note';
  id: string;
  title: string;
}

type Backlink = ConceptBacklink | NoteBacklink;

interface Props {
  // The thing being linked TO. Either a concept id, or a note id.
  target: { kind: 'concept'; id: string } | { kind: 'note'; id: string };
}

export function BacklinksPanel({ target }: Props) {
  const notes = useNotesStore((s) => s.notes);

  const backlinks: Backlink[] = [];

  if (target.kind === 'concept') {
    // Canonical edges: any edge where to === target.id, or from === target.id
    for (const e of EDGES) {
      if (e.to === target.id || e.from === target.id) {
        const otherId = e.to === target.id ? e.from : e.to;
        const c = CONCEPTS.find((c) => c.id === otherId);
        if (c) backlinks.push({ kind: 'concept', id: c.id, title: c.title, edgeType: e.type });
      }
    }
    // User notes that mention this concept
    for (const note of Object.values(notes)) {
      if (note.linkedConcepts.includes(target.id)) {
        backlinks.push({
          kind: 'note',
          id: note.id,
          title: note.title.trim() || note.body.split('\n')[0]?.slice(0, 60) || 'Untitled',
        });
      }
    }
  } else {
    // For a note: any other note that links to it via [[note-id]]? We don't support note→note yet,
    // but we still surface concepts that are LINKED FROM this note (the note's own linkedConcepts).
    const note = notes[target.id];
    if (note) {
      for (const conceptId of note.linkedConcepts) {
        const c = CONCEPTS.find((c) => c.id === conceptId);
        if (c) backlinks.push({ kind: 'concept', id: c.id, title: c.title, edgeType: 'link' });
      }
    }
  }

  // De-dupe
  const seen = new Set<string>();
  const unique = backlinks.filter((b) => {
    const key = `${b.kind}:${b.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 10,
        }}
      >
        Backlinks {unique.length > 0 && `· ${unique.length}`}
      </div>
      {unique.length === 0 ? (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
          {target.kind === 'concept'
            ? 'No notes link here yet.'
            : 'This note has no outgoing concept links.'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {unique.map((b) => (
            <li key={`${b.kind}:${b.id}`} style={{ marginBottom: 4 }}>
              <Link
                to={b.kind === 'concept' ? `/concept/${b.id}` : `/note/${b.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: b.kind === 'note' ? 'var(--note-yellow)' : 'var(--accent)',
                  textDecoration: 'none',
                  padding: '3px 0',
                }}
              >
                <ArrowLeft size={10} />
                <span>[[{b.title}]]</span>
                {b.kind === 'concept' && (b as ConceptBacklink).edgeType !== 'link' && (
                  <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>
                    · {(b as ConceptBacklink).edgeType}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
