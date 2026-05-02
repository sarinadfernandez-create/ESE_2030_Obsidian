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
    // string: render the named viz (or "Visualization coming soon" placeholder if not registered).
    // null: skip the viz panel entirely; render only description + misconception.
    // Used for application pages where no interactive viz is appropriate.
    vizComponent: string | null;
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

// ── Problem types: open-ended (proof / construction) and multiple-choice ───

export type ProblemFormat = 'open' | 'multiple-choice';

export interface OpenProblem {
  id: string;
  format: 'open';
  difficulty: 1 | 2 | 3;
  statement: string;
  hint?: string;
  hasAnimatedSolution: boolean;
  solutionFrames?: SolutionFrame[];
  // Optional written solution shown via an inline expander.
  writtenSolution?: string;
}

export interface Choice {
  label: 'A' | 'B' | 'C' | 'D' | 'E';
  body: string;
}

export interface TrickAnalysis {
  choice: 'A' | 'B' | 'C' | 'D' | 'E';
  why: string;
}

export type SolutionVisualKind =
  | 'matrix-highlight'
  | 'lines-2d'
  | 'parallelogram'
  | 'subspace-test'
  | 'none';

export interface MatrixHighlightData {
  matrix: (number | string)[][];
  highlights: { row: number; col: number; color: 'pivot' | 'zero' | 'warning' | 'correct' }[];
  rowSeparator?: number;
}

export interface Lines2DData {
  lines: { a: number; b: number; c: number; color: 'blue' | 'yellow' | 'red'; label?: string }[];
  intersection?: { x: number; y: number; label?: string };
  range?: [number, number];
}

export interface ParallelogramData {
  matrix: [[number, number], [number, number]];
  showDeterminant?: boolean;
  showOriginalSquare?: boolean;
}

export interface SubspaceTestData {
  region: 'upper-half-plane' | 'shifted-line' | 'union-of-axes' | 'unit-disk' | 'custom';
  failureExample: {
    kind: 'closure-add' | 'closure-scale' | 'no-zero';
    points?: [number, number][];
    arrow?: { from: [number, number]; to: [number, number] };
  };
}

export interface SolutionVisual {
  kind: SolutionVisualKind;
  // The data shape depends on `kind`. Concrete components narrow at runtime.
  data: MatrixHighlightData | Lines2DData | ParallelogramData | SubspaceTestData | null;
  caption?: string;
}

export interface MultipleChoiceProblem {
  id: string;
  format: 'multiple-choice';
  difficulty: 1 | 2 | 3;
  statement: string;
  choices: Choice[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  solution: {
    explanation: string;
    partialCredit?: string;
    trickAnalysis: TrickAnalysis[];
    visual?: SolutionVisual;
  };
}

export type Problem = OpenProblem | MultipleChoiceProblem;

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
