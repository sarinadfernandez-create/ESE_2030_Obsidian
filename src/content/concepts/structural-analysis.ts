import type { Concept } from '../types';

export const structuralAnalysis: Concept = {
  id: 'structural-analysis',
  unitId: 'ch1',
  number: '1.9.2',
  title: 'Structural Analysis',
  blurb: 'Bridges and trusses balance forces — and the balance equations are linear systems whose solvability tests structural stability.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A **truss** is a structure made of rigid bars connected at joints. Each bar can carry tension or compression along its length. At each joint, the forces from all bars meeting there must sum to zero — this is Newton's first law applied at the joint. Together with the external loads (the weights and forces the truss must support) and the constraints from supports (which restrict joint motion), these balance equations form a [[linear-systems|linear system]] in the unknown bar forces.

Whether the system has a solution determines whether the truss can equilibrate the load. Whether the solution is unique determines whether the truss is **statically determinate** (uniquely solvable from equilibrium alone) or **statically indeterminate** (requires additional information about deformation). Whether the system has a *zero solution* corresponding to nontrivial joint motion determines whether the truss is **rigid** or contains a **mechanism** — a way the joints can move without stretching any bar.

The mathematics maps directly onto familiar linear-algebra concepts. The matrix of the system is determined by the geometry of the truss. Its [[rank-and-conditioning|rank]] tells you how many independent equations of equilibrium exist. Its [[image-and-kernel|null space]] gives the mechanisms — directions of joint motion the truss cannot resist. The [[image-and-kernel|left null space]] gives the **states of self-stress** — combinations of internal forces that exist with no external load, which are responsible for thermal stresses and pre-tensioning effects.

This perspective is why linear algebra is taught to engineering students: structural problems aren't analogies to linear systems, they are linear systems. The same is true for [[network-flows|circuits]], [[building-temperature|thermal analysis]], and [[vehicle-suspension|vibration analysis]]. The unifying observation — that conservation laws on graphs are linear systems whose structure mirrors the underlying topology — runs throughout the course.
    `.trim(),

    definitions: [
      {
        term: 'Truss',
        body: 'A structure of rigid bars connected at frictionless pin joints. Each bar carries only an axial force (tension or compression along its length).',
      },
      {
        term: 'Statically determinate',
        body: 'A truss for which the equilibrium equations alone uniquely determine all bar forces. Equivalently, the equilibrium matrix is square and invertible.',
      },
      {
        term: 'Mechanism',
        body: "A nonzero joint displacement that produces no bar elongation. Lives in the [[image-and-kernel|null space]] of the equilibrium matrix's transpose. A truss with a mechanism is not rigid.",
      },
      {
        term: 'State of self-stress',
        body: 'A nonzero set of bar forces that satisfies equilibrium with zero external load. Lives in the [[image-and-kernel|null space]] of the equilibrium matrix itself.',
      },
    ],

    theorems: [
      {
        name: "Maxwell's rule",
        statement: 'A planar truss with $b$ bars, $j$ joints, and $r$ support reactions is statically determinate and rigid if $b + r = 2j$, and the equilibrium matrix is full rank.',
        intuition: 'The count $2j$ is the number of equilibrium equations (two per joint, in 2D). The count $b + r$ is the number of unknowns. Equality is necessary for unique solvability, but not sufficient — the equilibrium matrix must also be full rank, which depends on the geometry.',
      },
    ],

    keyFormulas: [
      'A f = p \\quad \\text{(equilibrium: } A \\text{ is the equilibrium matrix, } f \\text{ bar forces, } p \\text{ external loads)}',
      "b + r = 2j \\quad \\text{(Maxwell's rule, planar)}",
    ],
  },

  explore: {
    vizComponent: 'TrussViz',
    description: 'A small planar truss with adjustable joints, bars, and supports. The equilibrium matrix is shown alongside, with rank, mechanisms (null space of $A^T$), and self-stresses (null space of $A$) highlighted as you change the configuration. Try removing a bar and watch a mechanism appear.',
    misconception: {
      title: "Counting bars and joints isn't enough — geometry matters",
      body: `
[[structural-analysis|Maxwell's rule]] $b + r = 2j$ is necessary but not sufficient. A truss can satisfy the count and still be unstable, if the bars happen to be arranged in a special configuration where the equilibrium matrix loses rank.

Classic example: three bars meeting at a single point, all aligned along a line. The count works out, but no resistance to forces perpendicular to that line exists — the truss is a mechanism. The geometric defect shows up as a rank deficiency in the equilibrium matrix.

This is the same phenomenon as a [[rank-and-conditioning|rank-deficient]] linear system: the equations look like they should determine the unknowns, but a hidden linear dependence among them leaves degrees of freedom unconstrained. In structures, those degrees of freedom are mechanisms; in linear algebra, they are the null space.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'A simple triangular truss',
        body: 'Three bars forming a triangle, supported at two of the joints. Apply a vertical load at the third joint. Set up the equilibrium equations at each joint.',
      },
      {
        title: 'Build the equilibrium matrix',
        body: "Each joint contributes two equations (horizontal and vertical balance). Each bar force appears in the equations of both endpoints, with signs determined by the bar's orientation.",
      },
      {
        title: 'Solve and interpret',
        body: 'For a well-supported triangle, the matrix is full rank and the solution is unique — each bar carries a specific force in tension or compression. Negative values indicate compression; positive, tension.',
      },
    ],

    problems: [
      {
        format: 'open' as const,
        id: 'P-1.9.2a',
        difficulty: 2,
        statement: "Apply Maxwell's rule to a planar truss with 5 bars, 4 joints, and 3 support reactions. Is the count consistent with static determinacy?",
        hint: '$b + r = 5 + 3 = 8$, and $2j = 8$. The count works.',
        hasAnimatedSolution: false,
      },
      {
        format: 'open' as const,
        id: 'P-1.9.2b',
        difficulty: 3,
        statement: 'Show that a truss whose equilibrium matrix has [[image-and-kernel|null space]] of dimension $k$ has exactly $k$ independent states of self-stress.',
        hint: 'Self-stresses are bar force assignments $f$ with $A f = 0$ — exactly the null space of $A$.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
