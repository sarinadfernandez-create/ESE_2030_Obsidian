import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';

interface Props {
  source: string;
  className?: string;
}

const components: Components = {
  p: ({ children }) => <p style={{ margin: '0 0 0.8em 0', lineHeight: 1.6 }}>{children}</p>,
  strong: ({ children }) => <strong style={{ color: 'var(--text-primary)' }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: 'var(--text-secondary)' }}>{children}</em>,
  code: ({ children }) => (
    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em', color: 'var(--accent)' }}>
      {children}
    </code>
  ),
};

export function MarkdownMath({ source, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
