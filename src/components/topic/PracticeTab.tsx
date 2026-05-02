import { WorkedExample } from './WorkedExample';
import { ProblemCard } from './ProblemCard';
import type { Concept } from '../../content/types';

export function PracticeTab({ concept }: { concept: Concept }) {
  if (!concept.practice) {
    return (
      <div style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: 24 }}>
        Practice content not yet available for this concept.
      </div>
    );
  }
  const { workedExample, problems } = concept.practice;
  const vizComponent = concept.explore?.vizComponent ?? '';

  return (
    <div style={{ maxWidth: 760 }}>
      <section style={{ marginBottom: 36 }}>
        <SectionLabel>Worked example</SectionLabel>
        <WorkedExample steps={workedExample} />
      </section>

      <section>
        <SectionLabel>Problems</SectionLabel>
        {problems.map((p) => (
          <ProblemCard key={p.id} problem={p} conceptId={concept.id} vizComponent={vizComponent} />
        ))}
      </section>
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
