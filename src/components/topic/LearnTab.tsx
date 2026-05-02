import { BlockMath } from 'react-katex';
import { MarkdownMath } from '../math/MarkdownMath';
import { DefinitionBox } from './DefinitionBox';
import { TheoremCard } from './TheoremCard';
import type { Concept } from '../../content/types';

export function LearnTab({ concept }: { concept: Concept }) {
  if (!concept.learn) {
    return (
      <div style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: 24 }}>
        Learn content not yet available for this concept.
      </div>
    );
  }
  const { overview, definitions, theorems, keyFormulas } = concept.learn;
  return (
    <div style={{ maxWidth: 760 }}>
      <section style={{ marginBottom: 36 }}>
        <SectionLabel>Overview</SectionLabel>
        <div style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 }}>
          <MarkdownMath source={overview} />
        </div>
      </section>

      {keyFormulas && keyFormulas.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <SectionLabel>Key formulas</SectionLabel>
          <div
            style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '20px 24px',
            }}
          >
            {keyFormulas.map((f, i) => (
              <div key={i} style={{ marginBottom: i === keyFormulas.length - 1 ? 0 : 12 }}>
                <BlockMath math={f} />
              </div>
            ))}
          </div>
        </section>
      )}

      {definitions.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <SectionLabel>Definitions</SectionLabel>
          {definitions.map((d, i) => (
            <DefinitionBox key={i} def={d} />
          ))}
        </section>
      )}

      {theorems.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <SectionLabel>Theorems</SectionLabel>
          {theorems.map((t, i) => (
            <TheoremCard key={i} theorem={t} />
          ))}
        </section>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}
