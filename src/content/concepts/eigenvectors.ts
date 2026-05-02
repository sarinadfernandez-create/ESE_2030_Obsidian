import type { Concept } from '../types';

export const eigenvectors: Concept = {
  id: 'eigenvectors',
  unitId: 'ch7',
  number: '7.3',
  title: 'Eigenvalues & Eigenvectors',
  blurb: 'The directions a matrix preserves — and the scalars it stretches them by.',
  tier: 'flagship',

  learn: {
    overview: `
Most vectors, when hit by a matrix, get rotated and stretched into something pointing somewhere new. But for any square matrix, there exist a few special directions where this rotation simply doesn't happen — the matrix only stretches or compresses along that line, leaving its direction untouched. These directions are called **eigenvectors**, and the amount of stretching is called the **eigenvalue**.

This is a deeper claim than it first sounds. It says that hidden inside the action of any matrix $A$ — no matter how complicated its entries — there is a *coordinate system* in which $A$ acts diagonally: pure scaling, no mixing between axes. Finding this coordinate system is the project of diagonalization, and eigenvectors are the basis vectors of that hidden system.

Once you can see a matrix this way, much of what follows in linear algebra becomes geometric. Powers of $A$ stretch along eigendirections. Differential equations $x' = Ax$ have solutions that grow or decay along eigendirections. The long-run behavior of dynamical systems is dominated by the eigenvector with the largest eigenvalue. PageRank, principal component analysis, the spectral theorem, and the singular value decomposition all begin here.
    `.trim(),

    definitions: [
      {
        term: 'Eigenvector',
        body: 'A nonzero vector $v$ such that $Av = \\lambda v$ for some scalar $\\lambda$. Geometrically: $v$ lies on a line through the origin that $A$ leaves invariant — $A$ may stretch, compress, or flip $v$, but cannot rotate it off its line.',
      },
      {
        term: 'Eigenvalue',
        body: 'The scalar $\\lambda$ associated with an eigenvector $v$. It is the factor by which $A$ stretches $v$. Eigenvalues can be positive (stretching), negative (flipping and stretching), zero (collapsing onto the null space), or complex (rotation, when no real invariant line exists).',
      },
      {
        term: 'Eigenspace',
        body: 'For a fixed eigenvalue $\\lambda$, the set of all vectors $v$ satisfying $Av = \\lambda v$, together with the zero vector. Equivalently, $\\ker(A - \\lambda I)$. This is always a subspace.',
      },
      {
        term: 'Characteristic polynomial',
        body: 'The polynomial $p_A(\\lambda) = \\det(A - \\lambda I)$ in the variable $\\lambda$. Its roots are exactly the eigenvalues of $A$. For an $n \\times n$ matrix, $p_A$ has degree $n$.',
      },
      {
        term: 'Algebraic multiplicity',
        body: 'The number of times an eigenvalue $\\lambda$ appears as a root of the characteristic polynomial.',
      },
      {
        term: 'Geometric multiplicity',
        body: 'The dimension of the eigenspace for $\\lambda$ — that is, the number of linearly independent eigenvectors with eigenvalue $\\lambda$. Always at most the algebraic multiplicity.',
      },
    ],

    theorems: [
      {
        name: 'Eigenvalues are roots of the characteristic polynomial',
        statement: '$\\lambda$ is an eigenvalue of $A$ if and only if $\\det(A - \\lambda I) = 0$.',
        intuition: 'The equation $Av = \\lambda v$ rearranges to $(A - \\lambda I)v = 0$. A nonzero $v$ satisfies this exactly when $A - \\lambda I$ has a nontrivial null space, which happens exactly when its determinant is zero.',
      },
      {
        name: 'Eigenvectors of distinct eigenvalues are linearly independent',
        statement: 'If $v_1, \\dots, v_k$ are eigenvectors of $A$ with pairwise distinct eigenvalues $\\lambda_1, \\dots, \\lambda_k$, then $\\{v_1, \\dots, v_k\\}$ is linearly independent.',
        intuition: 'Distinct eigenvalues mean genuinely different scaling behaviors, and a single vector cannot simultaneously scale by two different factors. This is what makes diagonalization possible when all eigenvalues are distinct.',
      },
      {
        name: 'Trace and determinant from eigenvalues',
        statement: 'For an $n \\times n$ matrix $A$ with eigenvalues $\\lambda_1, \\dots, \\lambda_n$ (counted with algebraic multiplicity), $\\operatorname{tr}(A) = \\sum_i \\lambda_i$ and $\\det(A) = \\prod_i \\lambda_i$.',
        intuition: "The trace and determinant are coordinate-free invariants of $A$ — they don't depend on the basis. The eigenvalues, which describe $A$'s diagonal action in its eigenbasis, are also coordinate-free. These two coordinate-free quantities must therefore agree with the obvious functions of the eigenvalues.",
      },
    ],

    keyFormulas: [
      'Av = \\lambda v',
      '\\det(A - \\lambda I) = 0',
      '(A - \\lambda I) v = 0',
      'p_A(\\lambda) = \\lambda^n - \\operatorname{tr}(A) \\lambda^{n-1} + \\cdots + (-1)^n \\det(A)',
    ],
  },

  explore: {
    vizComponent: 'EigenvectorViz',
    description: "Drag the four entries of $A$ to deform the matrix. The faint dashed lines are the **invariant lines** — the eigenvector directions, where $Av$ stays parallel to $v$. Drag the orange vector $v$ around: notice how $Av$ rotates off $v$'s line almost everywhere, except along the invariant lines, where it just stretches. When the eigenvalues become complex, no real invariant line exists and the dashed lines disappear.",
    misconception: {
      title: 'Eigenvectors are about invariance, not about stretching the most',
      body: `
Three traps to watch for:

**Eigenvalues can be zero, negative, or complex.** A zero eigenvalue means $A$ collapses that direction onto the origin — $v$ is in $\\ker A$. A negative eigenvalue means $Av$ points opposite to $v$ along the same line. Complex eigenvalues mean there's no real direction $A$ leaves invariant; the matrix acts like a rotation-and-scale.

**Eigenvectors aren't the directions $A$ stretches the most.** That's a different question, and the answer is the right singular vectors — the columns of $V$ in the SVD. For a symmetric matrix, the two coincide; for a general matrix, they don't.

**An eigenvector isn't unique — an eigenline is.** If $v$ is an eigenvector with eigenvalue $\\lambda$, so is $cv$ for any nonzero $c$. The geometrically meaningful object is the *line* through the origin in direction $v$, called the eigenline.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Set up the characteristic equation',
        body: 'Find the eigenvalues of $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$. We solve $\\det(A - \\lambda I) = 0$.',
      },
      {
        title: 'Compute the determinant',
        body: '$\\det(A - \\lambda I) = \\det\\begin{pmatrix} 2-\\lambda & 1 \\\\ 0 & 3-\\lambda \\end{pmatrix} = (2-\\lambda)(3-\\lambda) - 0 = 0$.',
      },
      {
        title: 'Read off the eigenvalues',
        body: 'The polynomial factors as $(2 - \\lambda)(3 - \\lambda) = 0$, giving $\\lambda_1 = 2$ and $\\lambda_2 = 3$.',
      },
      {
        title: 'Find an eigenvector for each eigenvalue',
        body: 'For $\\lambda_1 = 2$: solve $(A - 2I)v = 0$, which gives $\\begin{pmatrix} 0 & 1 \\\\ 0 & 1 \\end{pmatrix} v = 0$, so $v_1 = (1, 0)^T$. For $\\lambda_2 = 3$: solve $(A - 3I)v = 0$, which gives $\\begin{pmatrix} -1 & 1 \\\\ 0 & 0 \\end{pmatrix} v = 0$, so $v_2 = (1, 1)^T$.',
      },
    ],

    problems: [
      {
        format: 'open' as const,
        id: 'P-7.3a',
        difficulty: 2,
        statement: 'Show that if $v$ is an eigenvector of $A$ with eigenvalue $\\lambda$, then $v$ is also an eigenvector of $A^2$. What is the corresponding eigenvalue?',
        hint: 'Apply $A$ to both sides of $Av = \\lambda v$, and use linearity of $A$.',
        hasAnimatedSolution: true,
        solutionFrames: [
          {
            caption: 'We start with the assumption: $v$ is an eigenvector of $A$, meaning $Av = \\lambda v$.',
            vizState: { stage: 'initial', v: [1, 0.5], lambda: 2 },
            durationMs: 2000,
          },
          {
            caption: 'Apply $A$ to both sides: $A(Av) = A(\\lambda v)$. The left side is $A^2 v$.',
            vizState: { stage: 'apply-once', v: [1, 0.5], lambda: 2 },
            durationMs: 2200,
          },
          {
            caption: 'On the right, $\\lambda$ is a scalar so it pulls out: $A(\\lambda v) = \\lambda(Av) = \\lambda(\\lambda v) = \\lambda^2 v$.',
            vizState: { stage: 'pull-scalar', v: [1, 0.5], lambda: 2 },
            durationMs: 2400,
          },
          {
            caption: 'Therefore $A^2 v = \\lambda^2 v$. So $v$ is an eigenvector of $A^2$ with eigenvalue $\\lambda^2$.',
            vizState: { stage: 'final', v: [1, 0.5], lambda: 2 },
            durationMs: 2400,
          },
        ],
      },
      {
        format: 'open' as const,
        id: 'P-7.3b',
        difficulty: 2,
        statement: 'Suppose $A$ is invertible with eigenvector $v$ and eigenvalue $\\lambda$. Show that $v$ is an eigenvector of $A^{-1}$, and find the corresponding eigenvalue.',
        hint: 'Start with $Av = \\lambda v$ and apply $A^{-1}$ to both sides. Note that an invertible matrix cannot have $\\lambda = 0$ as an eigenvalue.',
        hasAnimatedSolution: true,
        solutionFrames: [
          {
            caption: 'Start with $Av = \\lambda v$. Since $A$ is invertible, $\\det(A) \\neq 0$, so $\\lambda \\neq 0$.',
            vizState: { stage: 'initial', v: [1, 0.5], lambda: 2 },
            durationMs: 2200,
          },
          {
            caption: 'Apply $A^{-1}$ to both sides: $A^{-1}(Av) = A^{-1}(\\lambda v)$.',
            vizState: { stage: 'apply-inverse', v: [1, 0.5], lambda: 2 },
            durationMs: 2200,
          },
          {
            caption: 'The left side simplifies: $A^{-1} A v = v$. The right side: $A^{-1}(\\lambda v) = \\lambda A^{-1} v$.',
            vizState: { stage: 'simplify', v: [1, 0.5], lambda: 2 },
            durationMs: 2400,
          },
          {
            caption: 'So $v = \\lambda A^{-1} v$, which gives $A^{-1} v = \\frac{1}{\\lambda} v$. The eigenvalue is $1/\\lambda$.',
            vizState: { stage: 'final-inverse', v: [1, 0.5], lambda: 2 },
            durationMs: 2400,
          },
        ],
      },
      {
        format: 'open' as const,
        id: 'P-7.3c',
        difficulty: 3,
        statement: 'Let $A$ be a $3 \\times 3$ matrix with $\\operatorname{tr}(A) = 6$ and $\\det(A) = 6$. If $\\lambda_1 = 1$ is one eigenvalue, find the other two.',
        hint: 'Use the trace-sum and determinant-product identities. You will get a system of two equations in two unknowns; one will be quadratic.',
        hasAnimatedSolution: false,
      },
      {
        format: 'open' as const,
        id: 'P-7.3d',
        difficulty: 1,
        statement: 'Find all eigenvalues and eigenvectors of $A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$.',
        hint: 'This matrix swaps coordinates. The characteristic polynomial factors nicely. Look for vectors that are either symmetric or antisymmetric in their components.',
        hasAnimatedSolution: true,
        solutionFrames: [
          {
            caption: 'Set up the characteristic polynomial: $\\det(A - \\lambda I) = \\det\\begin{pmatrix} -\\lambda & 1 \\\\ 1 & -\\lambda \\end{pmatrix}$.',
            vizState: { stage: 'setup', matrix: [[0, 1], [1, 0]] },
            durationMs: 2200,
          },
          {
            caption: 'Compute: $(-\\lambda)(-\\lambda) - (1)(1) = \\lambda^2 - 1 = 0$.',
            vizState: { stage: 'compute', matrix: [[0, 1], [1, 0]] },
            durationMs: 2200,
          },
          {
            caption: 'Factor: $(\\lambda - 1)(\\lambda + 1) = 0$, giving $\\lambda_1 = 1$ and $\\lambda_2 = -1$.',
            vizState: { stage: 'factor', matrix: [[0, 1], [1, 0]] },
            durationMs: 2400,
          },
          {
            caption: 'For $\\lambda = 1$: $(A - I)v = 0$ gives $v_1 = (1, 1)^T$. For $\\lambda = -1$: $v_2 = (1, -1)^T$.',
            vizState: { stage: 'eigenvectors', matrix: [[0, 1], [1, 0]] },
            durationMs: 2600,
          },
        ],
      },
    ],
  },
};
