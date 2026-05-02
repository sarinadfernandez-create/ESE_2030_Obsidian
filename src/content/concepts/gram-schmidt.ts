import type { Concept } from '../types';

export const gramSchmidt: Concept = {
  id: 'gram-schmidt',
  unitId: 'ch5',
  number: '5.4',
  title: 'Gram-Schmidt Orthogonalization',
  blurb: 'Turn any basis into an orthonormal one, one projection-subtraction at a time.',
  tier: 'flagship',

  learn: {
    overview: `
Given a basis for a subspace, can we always replace it with an *orthonormal* basis — one where the vectors are mutually perpendicular and each has unit length — that spans the same subspace? The answer is yes, and the Gram-Schmidt process is the constructive proof.

The idea is iterative and geometric. Start with the first vector and just normalize it; that's done. For the second vector, find the component of it that points along the first, and *subtract that component out*. What remains is, by construction, orthogonal to the first. Normalize it. For the third vector, subtract out its components along the first two, and what remains is orthogonal to both. And so on.

This is more than a computational trick. It's a structural fact: orthogonality can always be achieved by repeated projection-subtraction, and the resulting basis is uniquely determined (up to sign) by the order of the original vectors. The process also reveals the **QR decomposition** as a free byproduct — the orthonormal vectors form the columns of $Q$, and the projection coefficients fill the upper-triangular matrix $R$.

Numerically, the textbook version of Gram-Schmidt has stability problems on a computer (small errors compound across iterations), so practitioners use a modified version. But the geometric story is the same in both: orthogonality is built up by removing redundancy, one direction at a time.
    `.trim(),

    definitions: [
      {
        term: 'Orthogonal set',
        body: 'A set of vectors $\\{v_1, v_2, \\dots, v_k\\}$ is orthogonal if $\\langle v_i, v_j \\rangle = 0$ for all $i \\neq j$. The zero vector is excluded.',
      },
      {
        term: 'Orthonormal set',
        body: 'An orthogonal set in which every vector also has unit length: $\\langle v_i, v_j \\rangle = \\delta_{ij}$, where $\\delta_{ij} = 1$ if $i = j$ and $0$ otherwise.',
      },
      {
        term: 'Projection of $v$ onto $u$',
        body: '$\\operatorname{proj}_u(v) = \\dfrac{\\langle v, u \\rangle}{\\langle u, u \\rangle} u$. This is the component of $v$ that lies along the line spanned by $u$. If $u$ is already a unit vector, this simplifies to $\\langle v, u \\rangle u$.',
      },
      {
        term: 'Gram-Schmidt process',
        body: 'Given linearly independent vectors $v_1, \\dots, v_n$, produce orthonormal vectors $e_1, \\dots, e_n$ via: $u_k = v_k - \\sum_{j < k} \\operatorname{proj}_{e_j}(v_k)$, then $e_k = u_k / \\|u_k\\|$.',
      },
    ],

    theorems: [
      {
        name: 'Gram-Schmidt produces an orthonormal basis',
        statement: 'If $\\{v_1, \\dots, v_n\\}$ is linearly independent, then the Gram-Schmidt process produces $\\{e_1, \\dots, e_n\\}$ that is orthonormal and spans the same subspace.',
        intuition: 'At each step, $u_k$ is built by subtracting from $v_k$ all of its components along the previously-orthogonalized directions. Whatever remains must be orthogonal to all of them. Linear independence of the input is what guarantees $u_k \\neq 0$ at each step.',
      },
      {
        name: 'Stagewise span preservation',
        statement: 'For each $k$, $\\operatorname{span}\\{v_1, \\dots, v_k\\} = \\operatorname{span}\\{e_1, \\dots, e_k\\}$.',
        intuition: 'Each $e_k$ is built from a linear combination of $v_1, \\dots, v_k$, and conversely each $v_k$ can be recovered from $e_1, \\dots, e_k$. The process never "leaves" the partial span — it just chooses better axes for it.',
      },
      {
        name: 'QR decomposition exists',
        statement: 'For any $m \\times n$ matrix $A$ with linearly independent columns, $A = QR$ where $Q$ has orthonormal columns and $R$ is upper triangular with positive diagonal.',
        intuition: 'Gram-Schmidt applied to the columns of $A$ produces $Q$. The matrix $R$ records the projection coefficients used along the way. Upper-triangularity falls out of the fact that $e_k$ only depends on $v_1, \\dots, v_k$ — never on later vectors.',
      },
    ],

    keyFormulas: [
      'u_k = v_k - \\sum_{j=1}^{k-1} \\operatorname{proj}_{e_j}(v_k)',
      'e_k = \\dfrac{u_k}{\\|u_k\\|}',
      '\\operatorname{proj}_u(v) = \\dfrac{\\langle v, u \\rangle}{\\langle u, u \\rangle} u',
      'A = QR, \\quad R_{jk} = \\langle v_k, e_j \\rangle',
    ],
  },

  explore: {
    vizComponent: 'GramSchmidtViz',
    description: "Three vectors in 3D, drawn in isometric projection. Use the slider to step through the Gram-Schmidt process: at each step, watch the **projection vector** appear, then watch the input vector slide as that projection is subtracted away. The final three vectors form an orthonormal basis. Try the preset configurations to see how the process handles edge cases — including what happens when two vectors are parallel.",
    misconception: {
      title: 'The hard part is the projection-subtraction, not the normalization',
      body: `
A common mistake is to think Gram-Schmidt just rescales each vector to unit length. It does that — but as a final, almost trivial step. The real work is the **projection subtraction**: removing from each vector the components that lie along the previously-orthogonalized directions.

A way to see why: if you only normalized, you'd just get three vectors of unit length pointing in the *original* directions, which usually aren't orthogonal at all. The orthogonality is created by carefully removing the "shadow" each vector casts on the previously-built directions. Normalization is housekeeping; projection-subtraction is the algorithm.

A second mistake: thinking Gram-Schmidt requires inputs that are already "close to orthogonal." It doesn't. As long as the input vectors are linearly independent, the process works regardless of their starting angles. If they happen to be linearly dependent — say, two of them are parallel — the process produces a zero vector at the offending step, which is the algorithm's way of telling you the input wasn't a basis to begin with.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Set up',
        body: 'Apply Gram-Schmidt to $v_1 = (1, 1, 0)$, $v_2 = (1, 0, 1)$, $v_3 = (0, 1, 1)$.',
      },
      {
        title: 'First vector — just normalize',
        body: '$\\|v_1\\| = \\sqrt{2}$, so $e_1 = \\frac{1}{\\sqrt{2}}(1, 1, 0)$.',
      },
      {
        title: 'Second vector — subtract projection onto $e_1$',
        body: '$\\langle v_2, e_1 \\rangle = \\frac{1}{\\sqrt{2}}$, so $\\operatorname{proj}_{e_1}(v_2) = \\frac{1}{2}(1, 1, 0)$. Then $u_2 = v_2 - \\operatorname{proj}_{e_1}(v_2) = (\\frac{1}{2}, -\\frac{1}{2}, 1)$. Normalize: $\\|u_2\\| = \\sqrt{3/2}$, so $e_2 = \\sqrt{2/3}(\\frac{1}{2}, -\\frac{1}{2}, 1)$.',
      },
      {
        title: 'Third vector — subtract projections onto $e_1$ and $e_2$',
        body: '$\\langle v_3, e_1 \\rangle = \\frac{1}{\\sqrt{2}}$ and $\\langle v_3, e_2 \\rangle = \\sqrt{2/3} \\cdot \\frac{1}{2}$. Subtract both projections from $v_3$, then normalize. The result $e_3$ is orthogonal to both $e_1$ and $e_2$, and together $\\{e_1, e_2, e_3\\}$ is an orthonormal basis for $\\mathbb{R}^3$.',
      },
    ],

    problems: [
      {
        id: 'P-5.4a',
        difficulty: 1,
        statement: 'Apply Gram-Schmidt to $v_1 = (3, 0)$ and $v_2 = (1, 2)$. Find $e_1$ and $e_2$.',
        hint: 'After normalizing $v_1$, the projection of $v_2$ onto $e_1$ subtracts the horizontal component of $v_2$, leaving only the vertical part.',
        hasAnimatedSolution: true,
        solutionFrames: [
          {
            caption: 'Start with $v_1 = (3, 0)$ and $v_2 = (1, 2)$.',
            vizState: { stage: 'initial', v1: [3, 0, 0], v2: [1, 2, 0] },
            durationMs: 2000,
          },
          {
            caption: 'Normalize $v_1$: $\\|v_1\\| = 3$, so $e_1 = (1, 0)$.',
            vizState: { stage: 'normalize-v1', v1: [3, 0, 0], v2: [1, 2, 0] },
            durationMs: 2200,
          },
          {
            caption: 'Project $v_2$ onto $e_1$: $\\langle v_2, e_1 \\rangle = 1$, so $\\operatorname{proj}_{e_1}(v_2) = (1, 0)$.',
            vizState: { stage: 'project-v2', v1: [3, 0, 0], v2: [1, 2, 0] },
            durationMs: 2400,
          },
          {
            caption: 'Subtract: $u_2 = v_2 - \\operatorname{proj}_{e_1}(v_2) = (0, 2)$. This is now orthogonal to $e_1$.',
            vizState: { stage: 'subtract-v2', v1: [3, 0, 0], v2: [1, 2, 0] },
            durationMs: 2400,
          },
          {
            caption: 'Normalize: $e_2 = (0, 1)$. The orthonormal basis is $\\{e_1, e_2\\} = \\{(1, 0), (0, 1)\\}$.',
            vizState: { stage: 'final', v1: [3, 0, 0], v2: [1, 2, 0] },
            durationMs: 2400,
          },
        ],
      },
      {
        id: 'P-5.4b',
        difficulty: 2,
        statement: 'Show that if $\\{e_1, \\dots, e_n\\}$ is an orthonormal basis and $v = \\sum_i c_i e_i$, then $c_i = \\langle v, e_i \\rangle$.',
        hint: 'Take the inner product of both sides with $e_j$ and use orthonormality.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-5.4c',
        difficulty: 2,
        statement: 'What happens when Gram-Schmidt is applied to a linearly dependent set? Specifically, run the process on $v_1 = (1, 0, 0)$, $v_2 = (0, 1, 0)$, $v_3 = (1, 1, 0)$, and explain at which step it fails and why.',
        hint: 'Compute $u_3$ explicitly. Recall that $v_3$ is already in $\\operatorname{span}\\{v_1, v_2\\}$.',
        hasAnimatedSolution: true,
        solutionFrames: [
          {
            caption: '$v_1, v_2$ are already orthonormal, so $e_1 = v_1$ and $e_2 = v_2$.',
            vizState: { stage: 'gs-degenerate-1', v1: [1, 0, 0], v2: [0, 1, 0], v3: [1, 1, 0] },
            durationMs: 2200,
          },
          {
            caption: 'Compute projections of $v_3$ onto $e_1$ and $e_2$: $\\operatorname{proj}_{e_1}(v_3) = (1, 0, 0)$, $\\operatorname{proj}_{e_2}(v_3) = (0, 1, 0)$.',
            vizState: { stage: 'gs-degenerate-2', v1: [1, 0, 0], v2: [0, 1, 0], v3: [1, 1, 0] },
            durationMs: 2600,
          },
          {
            caption: 'Subtract: $u_3 = v_3 - (1, 0, 0) - (0, 1, 0) = (0, 0, 0)$. The result is the zero vector.',
            vizState: { stage: 'gs-degenerate-3', v1: [1, 0, 0], v2: [0, 1, 0], v3: [1, 1, 0] },
            durationMs: 2400,
          },
          {
            caption: 'Normalization fails — we cannot divide by zero. The algorithm has detected that $v_3 \\in \\operatorname{span}\\{v_1, v_2\\}$, so $\\{v_1, v_2, v_3\\}$ is linearly dependent.',
            vizState: { stage: 'gs-degenerate-4', v1: [1, 0, 0], v2: [0, 1, 0], v3: [1, 1, 0] },
            durationMs: 2800,
          },
        ],
      },
      {
        id: 'P-5.4d',
        difficulty: 3,
        statement: 'Let $A$ be an $m \\times n$ matrix with linearly independent columns. Show that the QR decomposition $A = QR$ produced by Gram-Schmidt has $R_{kk} = \\|u_k\\|$ on its diagonal, where $u_k$ is the $k$-th orthogonalized vector before normalization. Conclude that $R$ has positive diagonal entries.',
        hint: 'Express $v_k$ in terms of $e_1, \\dots, e_k$ using the Gram-Schmidt formulas. The coefficient of $e_k$ in this expression is exactly $R_{kk}$.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
