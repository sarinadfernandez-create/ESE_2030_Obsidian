import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      <div className="max-w-xl w-full">
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-text-secondary transition-colors mb-8 inline-block"
        >
          ← Back
        </Link>
        <h1 className="font-display text-5xl font-semibold text-text-primary mb-4">
          About
        </h1>
        <p className="font-display text-xl italic text-text-secondary mb-8">
          ESE 2030 Visual Companion
        </p>
        <div className="space-y-4 text-text-secondary font-sans text-base leading-relaxed">
          <p>
            This site is a gift from a student to{' '}
            <span className="text-text-primary font-medium">Professor Robert Ghrist</span>,
            built to accompany ESE 2030: Linear Algebra — Essence & Form at Penn.
          </p>
          <p>
            Every concept in the course lives in the graph — clustered by chapter,
            connected by prerequisites and applications. Flagship topics have
            interactive visualizations and worked examples. Stub topics have clean
            definitions and will grow over time.
          </p>
          <p className="text-text-tertiary text-sm font-mono mt-8">
            v0.1 — Deliverable 2 · Routing & Data Model
          </p>
        </div>
      </div>
    </div>
  );
}
