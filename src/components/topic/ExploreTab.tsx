import { MarkdownMath } from '../math/MarkdownMath';
import { MisconceptionCallout } from './MisconceptionCallout';
import { EigenvectorViz } from '../visualizations/EigenvectorViz';
import { GramSchmidtViz } from '../visualizations/GramSchmidtViz';
import type { Concept } from '../../content/types';

export function ExploreTab({ concept }: { concept: Concept }) {
  if (!concept.explore) {
    return (
      <div style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: 24 }}>
        Interactive visualization not yet available for this concept.
      </div>
    );
  }
  const { vizComponent, description, misconception } = concept.explore;

  return (
    <div style={{ maxWidth: 760 }}>
      <div
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          marginBottom: 24,
        }}
      >
        <MarkdownMath source={description} />
      </div>

      <div style={{ marginBottom: 32 }}>
        {vizComponent === 'EigenvectorViz' && <EigenvectorViz />}
        {vizComponent === 'GramSchmidtViz' && <GramSchmidtViz />}
        {vizComponent !== 'EigenvectorViz' && vizComponent !== 'GramSchmidtViz' && (
          <div
            style={{
              background: 'var(--bg-panel)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 8,
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
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
              {vizComponent}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
              Visualization coming soon — read the misconception below for the conceptual takeaway.
            </div>
          </div>
        )}
      </div>

      <MisconceptionCallout title={misconception.title} body={misconception.body} />
    </div>
  );
}
