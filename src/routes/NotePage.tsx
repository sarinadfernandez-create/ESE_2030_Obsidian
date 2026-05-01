import { Link, useParams } from 'react-router-dom';

export function NotePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      <div className="max-w-xl w-full">
        <Link
          to="/graph"
          className="font-mono text-xs uppercase tracking-widest text-text-tertiary hover:text-text-secondary transition-colors mb-8 inline-block"
        >
          ← Graph
        </Link>
        <p className="font-mono text-xs text-text-muted mb-2">{id}</p>
        <h1 className="font-display text-4xl font-semibold text-text-primary mb-4">
          Note
        </h1>
        <p className="text-text-tertiary text-sm">
          The full note editor arrives in a future deliverable.
        </p>
      </div>
    </div>
  );
}
