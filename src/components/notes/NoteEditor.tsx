import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import { CONCEPTS } from '../../content/concepts.index';
import { useNotesStore } from '../../store/notesStore';
import { parseBacklinks, resolveBacklink } from '../../lib/parseBacklinks';
import { Link as RLink } from 'react-router-dom';

interface Props {
  noteId: string;
  autoFocus?: boolean;
}

const AUTOSAVE_INTERVAL_MS = 2000;

// Render [[id]] as clickable links — invalid in red.
const buildComponents = (): Components => ({
  p: ({ children }) => <p style={{ margin: '0 0 0.8em 0', lineHeight: 1.6 }}>{children}</p>,
  strong: ({ children }) => <strong style={{ color: 'var(--text-primary)' }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: 'var(--text-secondary)' }}>{children}</em>,
  code: ({ children }) => (
    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em', color: 'var(--accent)' }}>
      {children}
    </code>
  ),
  a: ({ href, children }) => (
    <a href={href ?? '#'} style={{ color: 'var(--accent)' }}>
      {children}
    </a>
  ),
});

// Pre-process markdown: convert [[id]] to a custom inline element.
// We use a markdown link wrapped with a sentinel so react-markdown processes it normally.
function preprocessBacklinks(md: string): string {
  return md.replace(/\[\[([^\]]+)\]\]/g, (_full, target: string) => {
    const id = resolveBacklink(target);
    if (id) {
      return `[[[${target}]]](#concept:${id})`;
    }
    return `[[[${target}]]](#invalid:${target})`;
  });
}

export function NoteEditor({ noteId, autoFocus }: Props) {
  const note = useNotesStore((s) => s.notes[noteId]);
  const updateNote = useNotesStore((s) => s.updateNote);

  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const [savedAt, setSavedAt] = useState<number | null>(note?.updatedAt ?? null);
  const [saveFlash, setSaveFlash] = useState(false);
  const dirtyRef = useRef(false);

  // Autocomplete
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteQuery, setAutocompleteQuery] = useState('');
  const [autocompletePos, setAutocompletePos] = useState({ left: 0, top: 0 });
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pull state from store if note changes (e.g. opened a different note in same component)
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
      setSavedAt(note.updatedAt);
      dirtyRef.current = false;
    }
  }, [noteId]); // intentional: only when noteId changes

  // Autosave
  useEffect(() => {
    if (!note) return;
    if (title === note.title && body === note.body) {
      dirtyRef.current = false;
      return;
    }
    dirtyRef.current = true;
    const t = setTimeout(() => {
      if (dirtyRef.current) {
        updateNote(noteId, { title, body });
        setSavedAt(Date.now());
        dirtyRef.current = false;
      }
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [title, body, noteId, note, updateNote]);

  const handleSaveNow = useCallback(() => {
    if (!note) return;
    // Always write through on explicit save so the user gets visible feedback,
    // even if autosave already wrote the same content.
    updateNote(noteId, { title, body });
    setSavedAt(Date.now());
    setSaveFlash(true);
    dirtyRef.current = false;
    window.setTimeout(() => setSaveFlash(false), 1200);
  }, [title, body, noteId, note, updateNote]);

  const filteredConcepts = useMemo(() => {
    const q = autocompleteQuery.trim().toLowerCase();
    if (!q) return CONCEPTS.slice(0, 8);
    return CONCEPTS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [autocompleteQuery]);

  // When the user types inside the textarea, detect [[ trigger and open autocomplete
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setBody(next);

    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    // Look backwards for [[ without a closing ]]
    const before = next.slice(0, pos);
    const lastOpen = before.lastIndexOf('[[');
    if (lastOpen === -1) {
      setAutocompleteOpen(false);
      return;
    }
    const between = before.slice(lastOpen + 2);
    if (between.includes(']]') || between.includes('\n')) {
      setAutocompleteOpen(false);
      return;
    }
    setAutocompleteQuery(between);
    setAutocompleteIndex(0);
    setAutocompleteOpen(true);
    // Approximate position: just below cursor by line count
    const lines = before.split('\n');
    const lineCount = lines.length;
    const col = lines[lines.length - 1].length;
    setAutocompletePos({
      left: Math.min(col * 7.5 + 16, 380),
      top: lineCount * 20 + 14,
    });
  };

  const insertCompletion = (conceptId: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const before = body.slice(0, pos);
    const after = body.slice(pos);
    const lastOpen = before.lastIndexOf('[[');
    if (lastOpen === -1) return;
    const newBefore = before.slice(0, lastOpen) + `[[${conceptId}]]`;
    const newBody = newBefore + after;
    setBody(newBody);
    setAutocompleteOpen(false);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = newBefore.length;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (autocompleteOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutocompleteIndex((i) => Math.min(filteredConcepts.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutocompleteIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        const c = filteredConcepts[autocompleteIndex];
        if (c) {
          e.preventDefault();
          insertCompletion(c.id);
        }
      } else if (e.key === 'Escape') {
        setAutocompleteOpen(false);
      }
    }
    if ((e.key === 's' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      handleSaveNow();
    }
  };

  const components = useMemo(buildComponents, []);
  const processedBody = useMemo(() => preprocessBacklinks(body), [body]);

  if (!note) {
    return (
      <div style={{ padding: 32, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        Note not found.
      </div>
    );
  }

  const lastSavedLabel = savedAt
    ? new Date(savedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled note"
        autoFocus={autoFocus}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 500,
          padding: '4px 0',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      />

      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-tertiary)',
        }}
      >
        <span>
          last saved · {lastSavedLabel}
          {saveFlash && (
            <span style={{ color: 'var(--success)', marginLeft: 8 }}>saved ✓</span>
          )}
          {!saveFlash && dirtyRef.current && (
            <span style={{ color: 'var(--warn)', marginLeft: 8 }}>unsaved…</span>
          )}
        </span>
        <button
          type="button"
          onClick={handleSaveNow}
          className="graph-control-btn"
          style={{ fontSize: 10, padding: '4px 10px' }}
        >
          save
        </button>
      </div>

      {/* Two-pane editor */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          flex: 1,
          minHeight: 320,
        }}
      >
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={body}
            onChange={handleBodyChange}
            onKeyDown={handleKeyDown}
            placeholder="Write in markdown. Use $...$ for inline math, $$...$$ for blocks, and [[concept-id]] to link concepts."
            style={{
              width: '100%',
              height: '100%',
              minHeight: 320,
              resize: 'none',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              lineHeight: 1.55,
              padding: 14,
              outline: 'none',
            }}
          />
          {autocompleteOpen && filteredConcepts.length > 0 && (
            <div
              style={{
                position: 'absolute',
                left: autocompletePos.left,
                top: autocompletePos.top,
                zIndex: 50,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 4,
                padding: 4,
                minWidth: 240,
                maxHeight: 240,
                overflowY: 'auto',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              }}
            >
              {filteredConcepts.map((c, i) => (
                <button
                  key={c.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertCompletion(c.id);
                  }}
                  style={{
                    display: 'flex',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 8px',
                    background: i === autocompleteIndex ? 'var(--bg-panel)' : 'transparent',
                    border: 'none',
                    borderRadius: 3,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    gap: 8,
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', minWidth: 36 }}>
                    {c.number}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12 }}>
                    {c.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding: 14,
            overflowY: 'auto',
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          {body.trim().length === 0 ? (
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              preview appears here…
            </span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                ...components,
                a: ({ href, children }) => {
                  if (typeof href === 'string' && href.startsWith('#concept:')) {
                    const id = href.slice('#concept:'.length);
                    return (
                      <RLink
                        to={`/concept/${id}`}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.9em',
                          color: 'var(--accent)',
                          textDecoration: 'none',
                          borderBottom: '1px dashed var(--accent-dim)',
                        }}
                      >
                        {children}
                      </RLink>
                    );
                  }
                  if (typeof href === 'string' && href.startsWith('#invalid:')) {
                    return (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.9em',
                          color: '#ff7b6b',
                          textDecoration: 'underline wavy #ff7b6b',
                        }}
                        title="No concept matches this id"
                      >
                        {children}
                      </span>
                    );
                  }
                  return <a href={href ?? '#'} style={{ color: 'var(--accent)' }}>{children}</a>;
                },
              }}
            >
              {processedBody}
            </ReactMarkdown>
          )}
        </div>
      </div>

      {/* Linked concepts summary */}
      <LinkedConceptsLine body={body} />
    </div>
  );
}

function LinkedConceptsLine({ body }: { body: string }) {
  const matches = useMemo(() => parseBacklinks(body), [body]);
  if (matches.length === 0) return null;
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
      links: {matches.map((m, i) => (
        <span key={i} style={{ marginRight: 8 }}>
          {m.conceptId ? (
            <RLink to={`/concept/${m.conceptId}`} style={{ color: 'var(--accent)' }}>
              [[{m.target}]]
            </RLink>
          ) : (
            <span style={{ color: '#ff7b6b' }}>[[{m.target}]]</span>
          )}
        </span>
      ))}
    </div>
  );
}
