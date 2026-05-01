import { PenLine, Link2 } from 'lucide-react';

interface NotesSidebarProps {
  conceptId: string;
}

export function NotesSidebar({ conceptId: _conceptId }: NotesSidebarProps) {
  return (
    <aside className="w-72 flex-shrink-0 border-l border-border-subtle pl-6 pt-1">
      {/* Notes header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Notes
        </h3>
        <button
          aria-label="New note"
          className="
            w-6 h-6 flex items-center justify-center
            text-text-tertiary hover:text-accent
            border border-border-subtle hover:border-border-glow
            rounded transition-all duration-150
            focus:outline-none focus:ring-1 focus:ring-accent/50
          "
        >
          <span className="text-sm leading-none">+</span>
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center py-8 gap-3 text-center">
        <PenLine size={20} className="text-text-muted" />
        <p className="text-xs text-text-muted font-sans leading-relaxed">
          No notes yet.<br />
          Use <span className="font-mono">[[concept-name]]</span> to link concepts.
        </p>
        <button
          className="
            mt-1 px-3 py-1.5
            font-mono text-xs tracking-wide
            text-accent border border-border-default rounded
            hover:border-border-glow hover:bg-bg-elevated
            transition-all duration-150
            focus:outline-none focus:ring-1 focus:ring-accent/50
          "
        >
          + New Note
        </button>
      </div>

      {/* Backlinks section */}
      <div className="mt-6 pt-6 border-t border-border-subtle">
        <div className="flex items-center gap-2 mb-3">
          <Link2 size={12} className="text-text-muted" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            Backlinks
          </h3>
        </div>
        <p className="text-xs text-text-muted font-sans">
          No notes link here yet.
        </p>
      </div>
    </aside>
  );
}
