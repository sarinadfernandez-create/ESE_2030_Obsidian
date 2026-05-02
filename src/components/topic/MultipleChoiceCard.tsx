import { useEffect, useMemo, useState } from 'react';
import { MarkdownMath } from '../math/MarkdownMath';
import { SolutionVisual } from '../visualizations/SolutionVisual';
import type { MultipleChoiceProblem, Choice, TrickAnalysis } from '../../content/types';

const STORAGE_KEY = 'ese2030-mc-selection';
type ChoiceLabel = Choice['label'];

function loadSelection(): Record<string, ChoiceLabel> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ChoiceLabel>) : {};
  } catch {
    return {};
  }
}

function saveSelection(map: Record<string, ChoiceLabel>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota */
  }
}

export function MultipleChoiceCard({ problem }: { problem: MultipleChoiceProblem }) {
  const [selected, setSelected] = useState<ChoiceLabel | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [reduceMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Hydrate from localStorage
  useEffect(() => {
    const map = loadSelection();
    const saved = map[problem.id];
    if (saved) {
      setSelected(saved);
      setShowSolution(true);
    }
  }, [problem.id]);

  const handleSelect = (label: ChoiceLabel) => {
    setSelected(label);
    setShowSolution(true);
    const map = loadSelection();
    map[problem.id] = label;
    saveSelection(map);
  };

  const isCorrect = selected === problem.correctAnswer;
  const stars = '★'.repeat(problem.difficulty) + '☆'.repeat(3 - problem.difficulty);
  const trickByLabel = useMemo(() => {
    const m = new Map<ChoiceLabel, TrickAnalysis>();
    problem.solution.trickAnalysis.forEach((t) => m.set(t.choice, t));
    return m;
  }, [problem.solution.trickAnalysis]);

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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>
            {problem.id}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border-subtle)',
              padding: '1px 6px',
              borderRadius: 3,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
            title="Modeled on Prof. Ghrist's quiz bank style"
          >
            Ghrist Bank
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--warn)', opacity: 0.8 }}>
          {stars}
        </span>
      </div>

      {/* Statement */}
      <div style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 14 }}>
        <MarkdownMath source={problem.statement} />
      </div>

      {/* Choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {problem.choices.map((choice) => {
          const isSel = selected === choice.label;
          const isCorrectChoice = choice.label === problem.correctAnswer;
          const showFeedback = showSolution && (isSel || (selected !== null && isCorrectChoice));
          let leftBorder = '3px solid transparent';
          if (showFeedback) {
            leftBorder = isCorrectChoice ? '3px solid var(--success)' : '3px solid #ff7b6b';
          }
          let bg = 'transparent';
          if (showFeedback) {
            bg = isCorrectChoice
              ? 'rgba(79, 214, 163, 0.06)'
              : 'rgba(255, 123, 107, 0.06)';
          }
          return (
            <button
              key={choice.label}
              onClick={() => handleSelect(choice.label)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 14px',
                paddingLeft: 12,
                background: bg,
                border: '1px solid var(--border-subtle)',
                borderLeft: leftBorder,
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'left',
                transition: reduceMotion ? 'none' : 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!showFeedback) e.currentTarget.style.borderColor = 'var(--border-glow)';
              }}
              onMouseLeave={(e) => {
                if (!showFeedback) e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: showFeedback
                    ? isCorrectChoice
                      ? 'var(--success)'
                      : '#ff7b6b'
                    : 'var(--text-tertiary)',
                  flexShrink: 0,
                  width: 22,
                }}
              >
                ({choice.label})
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  flex: 1,
                  lineHeight: 1.5,
                }}
              >
                <MarkdownMath source={choice.body} />
              </span>
              {showFeedback && (
                <span style={{ fontSize: 14, color: isCorrectChoice ? 'var(--success)' : '#ff7b6b' }}>
                  {isCorrectChoice ? '✓' : '✗'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Show solution button */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        {!showSolution ? (
          <button
            onClick={() => setShowSolution(true)}
            className="graph-control-btn"
            style={{ fontSize: 10, padding: '4px 10px' }}
          >
            show solution
          </button>
        ) : (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
            {selected
              ? isCorrect
                ? '✓ correct — see solution below'
                : '✗ not quite — see solution below'
              : 'solution shown'}
          </span>
        )}
      </div>

      {/* Solution panel */}
      {showSolution && (
        <SolutionPanel problem={problem} trickByLabel={trickByLabel} />
      )}
    </div>
  );
}

function SolutionPanel({
  problem,
  trickByLabel,
}: {
  problem: MultipleChoiceProblem;
  trickByLabel: Map<ChoiceLabel, TrickAnalysis>;
}) {
  return (
    <div
      style={{
        marginTop: 14,
        paddingTop: 14,
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--accent-bright)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 10,
        }}
      >
        Correct answer: ({problem.correctAnswer})
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 8 }}>
        <MarkdownMath source={problem.solution.explanation} />
      </div>

      {problem.solution.visual && problem.solution.visual.kind !== 'none' && (
        <SolutionVisual visual={problem.solution.visual} />
      )}

      {problem.solution.partialCredit && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--accent-bright)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}
          >
            Partial credit
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            <MarkdownMath source={problem.solution.partialCredit} />
          </div>
        </div>
      )}

      {problem.solution.trickAnalysis.length > 0 && (
        <div style={{ marginTop: 12 }}>
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
            Why the wrong answers are tempting
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {problem.choices
              .filter((c) => c.label !== problem.correctAnswer)
              .map((c) => {
                const t = trickByLabel.get(c.label);
                if (!t) return null;
                return (
                  <li key={c.label} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#ff9d8c', flexShrink: 0, width: 30 }}>
                      ({c.label})
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.5 }}>
                      <MarkdownMath source={t.why} />
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
