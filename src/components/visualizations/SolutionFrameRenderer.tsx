import { EigenvectorViz } from './EigenvectorViz';
import { GramSchmidtViz } from './GramSchmidtViz';
import type { SolutionFrame } from '../../content/types';

interface Props {
  vizComponent: string;
  frame: SolutionFrame;
  prevFrame: SolutionFrame | null;
  t: number;
}

export function SolutionFrameRenderer({ vizComponent, frame, prevFrame, t }: Props) {
  switch (vizComponent) {
    case 'EigenvectorViz':
      return <EigenvectorViz controlled frame={frame} prevFrame={prevFrame} t={t} />;
    case 'GramSchmidtViz':
      return <GramSchmidtViz controlled frame={frame} prevFrame={prevFrame} t={t} />;
    default:
      return (
        <div
          style={{
            padding: 24,
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
          }}
        >
          Unknown visualization: {vizComponent}
        </div>
      );
  }
}
