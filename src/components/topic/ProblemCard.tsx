import { useState } from 'react';
import { MarkdownMath } from '../math/MarkdownMath';
import { useDrawerStore } from '../../store/drawerStore';
import { MultipleChoiceCard } from './MultipleChoiceCard';
import type { Problem, OpenProblem, ConceptId } from '../../content/types';

export function ProblemCard({
  problem,
  conceptId,
  vizComponent,
}: {
  problem: Problem;
  conceptId: ConceptId;
  vizComponent: string;
}) {
  if (problem.format === 'multiple-choice') {
    return <MultipleChoiceCard problem={problem} />;
  }
  return <OpenProblemCard problem={problem} conceptId={conceptId} vizComponent={vizComponent} />;
}

function OpenProblemCard({
  problem,
  conceptId,
  vizComponent,
}: {
  problem: OpenProblem;
  conceptId: ConceptId;
  vizComponent: string;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showWritten, setShowWritten] = useState(false);
  const open = useDrawerStore((s) => s.open);

  const stars = '★'.repeat(problem.difficulty) + '☆'.repeat(3 - problem.difficulty);

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 4,
        padding: '16px 20px',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
            }}
          >
            {problem.id}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--warn)',
              opacity: 0.8,
            }}
          >
            {stars}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {problem.hasAnimatedSolution && (
            <button
              onClick={() => open(problem, conceptId, vizComponent)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-glow)',
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                padding: '4px 10px',
                borderRadius: 3,
                cursor: 'pointer',
              }}
            >
              ▶ animated solution
            </button>
          )}
        </div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: problem.hint ? 10 : 0 }}>
        <MarkdownMath source={problem.statement} />
      </div>
      {problem.hint && (
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => setShowHint((s) => !s)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {showHint ? '▼ hide hint' : '▶ show hint'}
          </button>
          {showHint && (
            <div
              style={{
                marginTop: 6,
                padding: 10,
                background: 'var(--bg-base)',
                borderRadius: 3,
                fontSize: 13,
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
              }}
            >
              <MarkdownMath source={problem.hint} />
            </div>
          )}
        </div>
      )}
      {problem.writtenSolution && (
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => setShowWritten((s) => !s)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {showWritten ? '▼ hide written solution' : '▶ show written solution'}
          </button>
          {showWritten && (
            <div
              style={{
                marginTop: 6,
                padding: '12px 14px',
                background: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 4,
                fontSize: 13,
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}
            >
              <MarkdownMath source={problem.writtenSolution} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
