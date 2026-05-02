export type ConceptId = string;
export type UnitId = string;
export type TabId = 'learn' | 'explore' | 'practice';

export interface Unit {
  id: UnitId;
  number: number;
  title: string;
  short: string;
  color: string;
}

export interface Concept {
  id: ConceptId;
  unitId: UnitId;
  number: string;
  title: string;
  blurb: string;
  isApplication?: boolean;
  tier: 'flagship' | 'full' | 'stub';

  learn?: {
    overview: string;
    definitions: Definition[];
    theorems: Theorem[];
    keyFormulas?: string[];
  };

  explore?: {
    vizComponent: string;
    misconception: {
      title: string;
      body: string;
    };
    description: string;
  };

  practice?: {
    workedExample: WorkedExampleStep[];
    problems: Problem[];
  };
}

export interface Definition {
  term: string;
  body: string;
}

export interface Theorem {
  name: string;
  statement: string;
  intuition?: string;
}

export interface WorkedExampleStep {
  title: string;
  body: string;
}

export interface Problem {
  id: string;
  difficulty: 1 | 2 | 3;
  statement: string;
  hint?: string;
  hasAnimatedSolution: boolean;
  solutionFrames?: SolutionFrame[];
}

export interface SolutionFrame {
  caption: string;
  vizState: unknown;
  durationMs: number;
}

export type EdgeType = 'prereq' | 'generalizes' | 'applies-to' | 'related' | 'dual-of';

export interface EdgeSource {
  kind: 'manual' | 'mention' | 'note';
  // For 'mention': "<concept-id>.<field-path>" e.g. "row-reduction.learn.overview"
  // For 'note': "note:<id>"
  location?: string;
}

export interface Edge {
  from: ConceptId;
  to: ConceptId;
  type: EdgeType;
  source?: EdgeSource;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  linkedConcepts: ConceptId[];
  positionHint?: { x: number; y: number };
}
