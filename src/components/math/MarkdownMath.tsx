import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Link } from 'react-router-dom';
import type { Components } from 'react-markdown';
import { preprocessBacklinks } from '../../lib/parseBacklinks';

interface Props {
  source: string;
  className?: string;
}

const baseComponents: Components = {
  p: ({ children }) => <p style={{ margin: '0 0 0.8em 0', lineHeight: 1.6 }}>{children}</p>,
  strong: ({ children }) => <strong style={{ color: 'var(--text-primary)' }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: 'var(--text-secondary)' }}>{children}</em>,
  code: ({ children }) => (
    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em', color: 'var(--accent)' }}>
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '0.8em 0' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          fontSize: '0.92em',
          border: '1px solid var(--border-subtle)',
          borderRadius: 4,
        }}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: 'var(--bg-elevated)' }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th
      style={{
        padding: '6px 12px',
        textAlign: 'left',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85em',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      style={{
        padding: '6px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
      }}
    >
      {children}
    </td>
  ),
  a: ({ href, children }) => {
    if (typeof href === 'string' && href.startsWith('#concept:')) {
      const id = href.slice('#concept:'.length);
      return <BacklinkChip to={`/concept/${id}`}>{children}</BacklinkChip>;
    }
    if (typeof href === 'string' && href.startsWith('#invalid:')) {
      return <BrokenChip>{children}</BrokenChip>;
    }
    return (
      <a href={href ?? '#'} style={{ color: 'var(--accent)' }}>
        {children}
      </a>
    );
  },
};

function BacklinkChip({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      style={{
        display: 'inline-block',
        padding: '1px 8px',
        margin: '0 1px',
        borderRadius: 9,
        background: 'rgba(96, 196, 255, 0.12)',
        color: 'var(--accent-bright)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85em',
        textDecoration: 'none',
        textTransform: 'lowercase',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(96, 196, 255, 0.22)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(96, 196, 255, 0.12)';
      }}
    >
      {children}
    </Link>
  );
}

function BrokenChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      title="No concept matches this id"
      style={{
        display: 'inline-block',
        padding: '1px 8px',
        margin: '0 1px',
        borderRadius: 9,
        background: 'rgba(255, 123, 107, 0.12)',
        color: '#ff9d8c',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85em',
        textDecoration: 'underline wavy #ff7b6b',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export function MarkdownMath({ source, className }: Props) {
  const processed = useMemo(() => preprocessBacklinks(source), [source]);
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={baseComponents}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
