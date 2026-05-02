import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { CONCEPTS, MANUAL_EDGES, computeMentionEdges } from '../../content/concepts.index';
import { useNotesStore } from '../../store/notesStore';
import type { EdgeType } from '../../content/types';

interface Props {
  target: { kind: 'concept'; id: string } | { kind: 'note'; id: string };
}

interface ConceptRow {
  id: string;
  title: string;
}

interface ConceptEdgeRow {
  id: string;
  title: string;
  edgeType: EdgeType;
  direction: 'in' | 'out' | 'undirected';
}

interface NoteRow {
  id: string;
  title: string;
  date: number;
}

function conceptTitle(id: string): string {
  return CONCEPTS.find((c) => c.id === id)?.title ?? id;
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function BacklinksPanel({ target }: Props) {
  const notes = useNotesStore((s) => s.notes);

  if (target.kind === 'note') {
    // For note pages: show outgoing concept links
    const note = notes[target.id];
    const linkedConcepts: ConceptRow[] = note
      ? note.linkedConcepts
          .map((id) => ({ id, title: conceptTitle(id) }))
          .filter((c, i, a) => a.findIndex((x) => x.id === c.id) === i)
      : [];
    return (
      <Section title="LINKS TO CONCEPTS" empty="This note links to no concepts yet.">
        {linkedConcepts.map((c) => (
          <RowLink key={c.id} to={`/concept/${c.id}`} icon="→" color="var(--accent)">
            {c.title}
          </RowLink>
        ))}
      </Section>
    );
  }

  const conceptId = target.id;

  // 1. Mention-derived links from other concepts' prose pointing AT this concept.
  const mentionedFrom: ConceptRow[] = [];
  for (const e of computeMentionEdges()) {
    if (e.to === conceptId && e.from !== conceptId) {
      if (!mentionedFrom.some((r) => r.id === e.from)) {
        mentionedFrom.push({ id: e.from, title: conceptTitle(e.from) });
      }
    }
  }

  // 2. User notes that reference this concept.
  const linkedNotes: NoteRow[] = [];
  for (const note of Object.values(notes)) {
    if (note.linkedConcepts.includes(conceptId)) {
      linkedNotes.push({
        id: note.id,
        title:
          note.title.trim() ||
          note.body.split('\n')[0]?.slice(0, 40) ||
          'Untitled',
        date: note.updatedAt,
      });
    }
  }
  linkedNotes.sort((a, b) => b.date - a.date);

  // 3. Manual editorial relationships involving this concept.
  const manual: ConceptEdgeRow[] = [];
  const seenManual = new Set<string>();
  for (const e of MANUAL_EDGES) {
    let row: ConceptEdgeRow | null = null;
    if (e.from === conceptId && e.to !== conceptId) {
      row = {
        id: e.to,
        title: conceptTitle(e.to),
        edgeType: e.type,
        direction: e.type === 'dual-of' ? 'undirected' : 'out',
      };
    } else if (e.to === conceptId && e.from !== conceptId) {
      row = {
        id: e.from,
        title: conceptTitle(e.from),
        edgeType: e.type,
        direction: e.type === 'dual-of' ? 'undirected' : 'in',
      };
    }
    if (row && !seenManual.has(row.id + ':' + row.edgeType)) {
      seenManual.add(row.id + ':' + row.edgeType);
      manual.push(row);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Section
        title={`LINKED FROM CONCEPTS${mentionedFrom.length ? ` · ${mentionedFrom.length}` : ''}`}
        empty="No concept prose mentions this one."
      >
        {mentionedFrom.map((c) => (
          <RowLink key={c.id} to={`/concept/${c.id}`} icon="←" color="var(--text-secondary)">
            {c.title}
          </RowLink>
        ))}
      </Section>

      <Section
        title={`LINKED FROM YOUR NOTES${linkedNotes.length ? ` · ${linkedNotes.length}` : ''}`}
        empty="No notes link here yet."
      >
        {linkedNotes.map((n) => (
          <RowLink
            key={n.id}
            to={`/note/${n.id}`}
            icon="←"
            color="var(--note-yellow)"
            suffix={formatDate(n.date)}
          >
            {n.title}
          </RowLink>
        ))}
      </Section>

      <Section
        title={`PREREQUISITES & RELATED${manual.length ? ` · ${manual.length}` : ''}`}
        empty="No manually-curated relationships yet."
      >
        {manual.map((c) => {
          const Icon =
            c.direction === 'in' ? ArrowLeft : c.direction === 'out' ? ArrowRight : ArrowLeftRight;
          return (
            <Link
              key={`${c.id}:${c.edgeType}`}
              to={`/concept/${c.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 0',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              <Icon size={10} />
              <span>{c.title}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>· {c.edgeType}</span>
            </Link>
          );
        })}
      </Section>
    </div>
  );
}

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div>
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
        {title}
      </div>
      {hasChildren ? (
        <div>{children}</div>
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {empty}
        </p>
      )}
    </div>
  );
}

function RowLink({
  to,
  icon,
  color,
  suffix,
  children,
}: {
  to: string;
  icon: string;
  color: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 0',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color,
        textDecoration: 'none',
      }}
    >
      <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
      <span style={{ flex: 1 }}>{children}</span>
      {suffix && (
        <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>{suffix}</span>
      )}
    </Link>
  );
}
