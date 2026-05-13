import type { Concept } from '../types';

export const perronFrobenius: Concept = {
  id: 'perron-frobenius',
  unitId: 'ch9',
  number: '9.3',
  title: 'Perron-Frobenius Theorem',
  blurb: 'Matrices with positive entries have a real positive dominant eigenvalue and positive eigenvector.',
  tier: 'full',

  learn: {
    overview: `
The Perron-Frobenius theorem is the structural miracle behind every well-behaved iteration involving "amount of something" — populations, money, web traffic, particles. A square matrix with all entries strictly positive has a uniquely determined real positive eigenvalue that dominates the entire spectrum, *and* a positive eigenvector pointing in the direction of long-term equilibrium. The theorem replaces the general possibility of complex, negative, or tied dominant eigenvalues with a clean structural guarantee.

**Statement.** Let $A$ be a square matrix with $a_{ij} > 0$ for all $i, j$. Then:
1. There exists a real eigenvalue $\\lambda_* > 0$ such that $|\\lambda| \\leq \\lambda_*$ for every other eigenvalue $\\lambda$ of $A$.
2. The inequality is strict: $|\\lambda| < \\lambda_*$ for all other eigenvalues. (Strict dominance.)
3. The eigenvalue $\\lambda_*$ is *simple* (algebraic multiplicity 1).
4. There exists an eigenvector $\\mathbf{v}_*$ with all entries strictly positive: $A \\mathbf{v}_* = \\lambda_* \\mathbf{v}_*$, $v_{*,i} > 0$ for all $i$.

The geometric content is striking. Picture the positive orthant (all coordinates positive) as a cone in $\\mathbb{R}^n$. A positive matrix maps the positive orthant strictly inside itself: $A\\mathbf{x}$ has positive entries whenever $\\mathbf{x}$ does. This is the geometric reason there must be a fixed ray inside the cone — the Perron-Frobenius eigenvector points along it, and the Perron eigenvalue measures the dilation factor along that ray.

The structural consequences are enormous. Strict dominance (item 2) means the [[dominance-convergence|power method]] converges from any positive initial condition. Positivity of $\\mathbf{v}_*$ (item 4) means the long-term direction has a physical interpretation: a population distribution, a probability distribution, a fraction. Simplicity (item 3) means the dominant eigenspace is 1D, so the iterate aligns with a specific direction, not a 2D family.

When the entries are positive but not strictly positive — for instance, the adjacency matrix of a graph, where $a_{ij} = 0$ or $1$ — a generalized version applies under the condition of *irreducibility* (the directed graph is strongly connected) and *aperiodicity*. Most engineering examples (population transitions, Markov chains with full-rank-ish structure, PageRank-style web matrices) satisfy these, and Perron-Frobenius governs their long-term behavior.

The theorem fails decisively for matrices with mixed signs. A matrix with even one negative entry can have complex dominant eigenvalues, sign-flipping eigenvectors, or no real dominant eigenvalue at all. The geometric reason: the positive orthant is no longer preserved, so there is no invariant cone for the eigenvector to live in.

**Where this lives.** [[pagerank|PageRank]] is the most famous instance: Google's link matrix is positive (after the random-jump regularization), and Perron-Frobenius guarantees a unique positive PageRank vector. The [[consensus|stationary distribution]] of a Markov chain with positive transition matrix is the Perron eigenvector for $\\lambda = 1$. Leslie population matrices (with positive fertility and survival entries) inherit Perron-Frobenius and give a clean asymptotic population structure.
    `.trim(),

    definitions: [
      {
        term: 'Positive matrix',
        body: 'A real matrix $A$ with every entry strictly positive: $a_{ij} > 0$ for all $i, j$.',
      },
      {
        term: 'Nonnegative matrix',
        body: 'A real matrix with every entry $\\geq 0$. The full Perron-Frobenius theorem extends to nonnegative matrices under additional irreducibility conditions; for strictly positive matrices, no extra hypothesis is needed.',
      },
      {
        term: 'Perron eigenvalue',
        body: 'The unique real positive eigenvalue $\\lambda_*$ guaranteed by Perron-Frobenius. Equals the spectral radius $\\rho(A)$. Sometimes called the *Perron root*.',
      },
      {
        term: 'Perron eigenvector',
        body: 'The eigenvector $\\mathbf{v}_*$ (unique up to positive scalar) for $\\lambda_*$, with all entries strictly positive. Sometimes called the *Perron vector*.',
      },
    ],

    theorems: [
      {
        name: 'Perron-Frobenius (strictly positive case)',
        statement: 'If $A$ has all entries $a_{ij} > 0$, then $A$ has a unique simple eigenvalue $\\lambda_* > 0$ equal to $\\rho(A)$, strictly greater in magnitude than every other eigenvalue, with a strictly positive eigenvector $\\mathbf{v}_*$.',
        intuition: 'Positivity preserves the positive orthant: $A$ maps a positive vector to a positive vector. Iteration repeatedly contracts angular freedom within the cone, forcing convergence to a single positive direction. The eigenvalue along that direction is real (since the eigenvector is real) and positive (since positive $\\to$ positive multiplied by the eigenvalue), and it must be the largest in magnitude or another direction would dominate.',
      },
      {
        name: 'Spectral radius equals Perron eigenvalue',
        statement: 'For a positive matrix, $\\rho(A) = \\lambda_*$. Furthermore, $\\rho(-A) = \\lambda_*$ as well, with the same eigenvector (now associated to eigenvalue $-\\lambda_*$).',
        intuition: 'Negating a positive matrix flips every eigenvalue\'s sign but preserves eigenvectors and magnitudes. The Perron eigenvector of $A$ is still an eigenvector of $-A$, just with eigenvalue $-\\lambda_*$ instead of $\\lambda_*$. The spectral radius is unchanged. So $-A$ has a *real negative* dominant eigenvalue with the *same positive* eigenvector. Note: Perron-Frobenius does *not* apply to $-A$ in its statement form (which requires positive entries), but the eigenstructure of $-A$ is fully determined by that of $A$.',
      },
      {
        name: 'Convergence of positive iteration',
        statement: 'For positive $A$ and any starting vector $\\mathbf{x}_0$ with at least one positive entry, $A^k \\mathbf{x}_0 / \\lambda_*^k$ converges to a positive multiple of $\\mathbf{v}_*$.',
        intuition: 'Any positive starting vector has nonzero overlap with $\\mathbf{v}_*$ (since they are both positive). The power method, divided by the dominant scaling $\\lambda_*^k$, isolates that overlap. The result is a clean asymptotic statement: positive iterations converge to the Perron eigenvector, scaled by the per-step factor $\\lambda_*$.',
      },
    ],

    keyFormulas: [
      'A \\mathbf{v}_* = \\lambda_* \\mathbf{v}_*, \\quad \\mathbf{v}_* > 0, \\quad \\lambda_* > 0',
      '\\rho(A) = \\lambda_* \\text{ (for positive } A\\text{)}',
      'A^k \\mathbf{x}_0 \\sim c \\lambda_*^k \\mathbf{v}_* \\text{ as } k \\to \\infty \\text{ for any } \\mathbf{x}_0 > 0',
      '|\\lambda| < \\lambda_* \\text{ for all other eigenvalues } \\lambda \\text{ of } A',
    ],
  },

  explore: {
    vizComponent: 'PerronFrobeniusViz',
    description: 'A 2D viz showing a positive $2 \\times 2$ matrix acting on the positive quadrant. The user adjusts entries via sliders and sees: the positive eigenvector (drawn in green inside the quadrant), the unit circle of eigenvalues plotted in the complex plane (the Perron eigenvalue marked, strict dominance shown by spacing), and an animated power iteration starting from various positive seed vectors all converging to the same green eigenline. A toggle introduces a negative entry to break Perron-Frobenius and show the resulting chaos: the eigenvector may rotate out of the positive quadrant, complex eigenvalues may appear, and the iteration loses its clean convergence.',
    misconception: {
      title: 'Applying Perron-Frobenius outside its hypotheses, and confusing what changes for $-A$',
      body: `Students often invoke Perron-Frobenius as if it were a general theorem about "matrices with a dominant eigenvalue." It is not. It is a statement about *positive* (or, under stronger hypotheses, *nonnegative-and-irreducible*) matrices. A matrix with a single negative entry can have complex dominant eigenvalues or no real dominant eigenvalue at all; Perron-Frobenius simply does not apply.

The subtler trap is what Perron-Frobenius says about $-A$ when $A$ is positive. The conclusion is *not* that $-A$ has a positive dominant eigenvalue (it cannot, since its eigenvalues are all negatives of $A$'s). It is also *not* that Perron-Frobenius fails to constrain $-A$ — the eigenstructure of $-A$ is completely determined by that of $A$. Specifically: $A$ has Perron eigenvalue $\\lambda_* > 0$ with positive eigenvector $\\mathbf{v}_*$. Therefore $-A$ has eigenvalue $-\\lambda_*$ (real, negative, with magnitude $\\lambda_*$) with the *same* positive eigenvector $\\mathbf{v}_*$. The spectral radius is preserved ($\\rho(-A) = \\lambda_*$), the dominance is preserved, and the eigenvector is preserved — only the sign of the eigenvalue flips.

So $-A$ has a dominant real *negative* eigenvalue with a *positive* eigenvector. This is exactly what Perron-Frobenius implies *for the related matrix*, even though the theorem itself was stated for $A$.

A third confusion: assuming Perron-Frobenius guarantees a *unique* dominant eigenvector. It does — *up to positive scalar*. The Perron eigenvector is a 1D ray inside the positive cone, not a 1D subspace; any positive multiple of $\\mathbf{v}_*$ is also a Perron eigenvector, but no negative multiple. This is sharper than the usual eigenspace statement: the geometric multiplicity is $1$ *and* the eigenvector has a canonical sign.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: applying Perron-Frobenius to $-A$',
        body: 'Let $A$ be a $3 \\times 3$ matrix with all entries strictly positive, so Perron-Frobenius applies. We want to deduce what it says about $-A$ (every entry strictly negative).',
      },
      {
        title: 'Apply the theorem to $A$',
        body: 'Perron-Frobenius gives $A$ a unique real positive dominant eigenvalue $\\lambda_* > 0$, strictly larger in magnitude than every other eigenvalue, with a positive eigenvector $\\mathbf{v}_*$.',
      },
      {
        title: 'Translate to $-A$',
        body: 'Eigenvalues of $-A$ are negatives of those of $A$, so $-A$ has $-\\lambda_*$ (which is real and negative) as an eigenvalue. Since negation preserves magnitudes, $|-\\lambda_*| = \\lambda_*$ is still strictly larger than every other magnitude. So $-\\lambda_*$ is the *dominant* eigenvalue of $-A$, and it is real and negative. The eigenvector $\\mathbf{v}_*$ is unchanged: $(-A) \\mathbf{v}_* = -A \\mathbf{v}_* = -\\lambda_* \\mathbf{v}_*$. Crucially, $\\mathbf{v}_*$ is still positive. So $-A$ has dominant eigenvalue $-\\lambda_*$ (negative) with positive eigenvector $\\mathbf{v}_*$. Perron-Frobenius cannot be applied to $-A$ directly (its hypothesis fails), but the conclusion *via* $A$ is fully determined.',
      },
    ],

    problems: [
      {
        id: 'P-9.3a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Let $A$ be a square matrix with all entries strictly positive, so that the Perron-Frobenius theorem applies. Consider the matrix $-A$ (all entries strictly negative). Which statement about $-A$ does Perron-Frobenius imply?',
        choices: [
          { label: 'A', body: '$-A$ has a dominant real positive eigenvalue with positive eigenvector.' },
          { label: 'B', body: '$-A$ has a dominant real negative eigenvalue with positive eigenvector.' },
          { label: 'C', body: '$-A$ has a dominant real negative eigenvalue with negative eigenvector.' },
          { label: 'D', body: 'Perron-Frobenius does not apply to $-A$, so nothing definite can be said about its eigenstructure.' },
          { label: 'E', body: 'None of the above is entirely accurate.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Apply Perron-Frobenius to $A$: there is a real $\\lambda_* > 0$ with $|\\lambda_*|$ strictly larger than every other $|\\lambda|$, and a positive eigenvector $\\mathbf{v}_*$. The eigenvalues of $-A$ are exactly the negatives $\\{-\\lambda_i\\}$ of those of $A$, with the *same eigenvectors*. So $-A$ has eigenvalue $-\\lambda_*$, which is real and negative, with the *same* positive eigenvector $\\mathbf{v}_*$. Magnitudes are preserved under sign flip, so $|-\\lambda_*| = \\lambda_*$ remains the largest magnitude; $-\\lambda_*$ is the dominant eigenvalue of $-A$. The eigenvector remains positive.',
          partialCredit: 'Choice D recognizes the literal-hypothesis failure (the theorem requires positive entries, not negative) but misses that the eigenstructure of $-A$ is completely determined by that of $A$ even when the theorem applies only to $A$.',
          trickAnalysis: [
            { choice: 'A', why: 'Confuses "dominant eigenvalue" with "positive eigenvalue." Negating $A$ negates all eigenvalues; the dominant eigenvalue of $-A$ has the opposite sign of $A$\'s.' },
            { choice: 'C', why: 'Believes negating the matrix should negate the eigenvector too. Eigenvectors are not affected by scalar negation: if $A\\mathbf{v} = \\lambda\\mathbf{v}$ then $(-A)\\mathbf{v} = -\\lambda\\mathbf{v}$, so $\\mathbf{v}$ is unchanged.' },
            { choice: 'D', why: 'Mistakenly assumes that if the theorem\'s hypothesis fails, the conclusion gives no information. The structure of $-A$ is fully determined by that of $A$ via the eigenvalue-flip rule.' },
            { choice: 'E', why: 'Choice B is correct and accurate; this hedge option does not apply.' },
          ],
        },
      },
      {
        id: 'P-9.3b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A $3 \\times 3$ matrix $A$ has all entries strictly positive. Which of the following statements MUST be true?',
        choices: [
          { label: 'A', body: 'All three eigenvalues of $A$ are real and positive.' },
          { label: 'B', body: 'The largest-magnitude eigenvalue of $A$ has algebraic multiplicity $1$ and a positive eigenvector.' },
          { label: 'C', body: '$A$ is diagonalizable with a basis of positive eigenvectors.' },
          { label: 'D', body: '$A$ has no complex eigenvalues.' },
          { label: 'E', body: '$A$ is symmetric.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Perron-Frobenius (positive case) guarantees exactly one thing about the *dominant* eigenvalue: it is real positive, has algebraic multiplicity $1$ (simple), strictly dominates all other eigenvalues in magnitude, and has a positive eigenvector. It says *nothing* about the other eigenvalues, which may be complex, may be negative, may have any multiplicity. Choice B is the exact conclusion of the theorem.',
          partialCredit: 'Choice C is true only for the dominant eigenvector. The other eigenvectors need not be positive, and $A$ need not even be diagonalizable.',
          trickAnalysis: [
            { choice: 'A', why: 'Perron-Frobenius applies only to the *dominant* eigenvalue. The other eigenvalues of a positive matrix can be negative, complex, or repeated. E.g., a $3\\times 3$ rotation-scaled matrix can be positive yet have a complex conjugate pair.' },
            { choice: 'C', why: 'Only the dominant eigenvector is guaranteed positive (and unique up to scalar). Other eigenvectors can have mixed signs. Diagonalizability is not guaranteed by Perron-Frobenius.' },
            { choice: 'D', why: 'Same error as A: complex eigenvalues are allowed among the non-dominant ones. They are guaranteed to have magnitude less than $\\lambda_*$, but can exist.' },
            { choice: 'E', why: 'Symmetry has nothing to do with entry positivity. A symmetric matrix with positive entries is one case, but $A$ being positive does not force symmetry.' },
          ],
        },
      },
    ],
  },
};
