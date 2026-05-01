import { Link } from 'react-router-dom';
import { UNITS, CONCEPTS } from '../content/concepts.index';

export function GraphHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      <p className="font-mono text-xs tracking-widest uppercase text-text-tertiary mb-6">
        Concept Graph
      </p>
      <h2 className="font-display text-4xl font-semibold text-text-primary mb-3">
        Graph goes here
      </h2>
      <p className="text-text-secondary text-sm max-w-md text-center mb-12">
        The force-directed concept graph arrives in Deliverable 3.{' '}
        {CONCEPTS.length} concepts · {UNITS.length} units · navigate directly to any topic below.
      </p>

      {/* Quick-access grid — all units with flagship concepts highlighted */}
      <div className="w-full max-w-3xl grid grid-cols-2 gap-3">
        {UNITS.map((unit) => {
          const flagship = CONCEPTS.find(
            (c) => c.unitId === unit.id && c.tier === 'flagship'
          );
          return (
            <div
              key={unit.id}
              className="bg-bg-panel border border-border-subtle rounded p-4 hover:border-border-default transition-colors"
            >
              <p className="font-mono text-xs text-text-muted mb-1">
                Ch.{unit.number}
              </p>
              <p className="font-sans text-sm font-medium text-text-secondary mb-2">
                {unit.title}
              </p>
              {flagship && (
                <Link
                  to={`/concept/${flagship.id}`}
                  className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:text-accent-bright transition-colors"
                >
                  ★ {flagship.title}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
