import type { Concept } from '../types';

export const geometricFundamentalTheorem: Concept = {
  id: 'geometric-fundamental-theorem',
  unitId: 'ch6',
  number: '6.3',
  title: 'Geometric Fundamental Theorem of Linear Algebra',
  blurb: 'The four fundamental subspaces, with orthogonality: kernel ⟂ row space, image ⟂ left null space.',
  tier: 'full',

  learn: {
    overview: `
The [[fundamental-theorem|algebraic Fundamental Theorem]] of Linear Algebra (Section 3.9) gives the four-piece decomposition $V \\cong \\ker(T) \\oplus \\text{coim}(T)$ and $W \\cong \\text{im}(T) \\oplus \\text{coker}(T)$. The **geometric form**, available once we have an [[dot-and-inner-products|inner product]], adds a crucial layer: the four fundamental subspaces are pairwise [[orthogonal-complements|orthogonal complements]].

For a [[linear-transformation-defs|linear transformation]] $T: V \\to W$ between finite-dimensional inner product spaces, the geometric FTLA states:

$$\\ker(T)^\\perp = \\text{im}(T^*) \\quad \\text{(in } V\\text{)}$$
$$\\text{im}(T)^\\perp = \\ker(T^*) \\quad \\text{(in } W\\text{)}.$$

In words: the kernel of $T$ and the image of the [[adjoints-and-transposes|adjoint]] $T^*$ are orthogonal complements in the domain. Symmetrically, the image of $T$ and the kernel of $T^*$ are orthogonal complements in the codomain. With these, the algebraic decomposition becomes a *geometric* decomposition:

$$V = \\ker(T) \\oplus \\text{im}(T^*), \\quad W = \\text{im}(T) \\oplus \\ker(T^*).$$

**The four fundamental subspaces in matrix terms.** For a matrix $A \\in \\mathbb{R}^{m \\times n}$ with adjoint = transpose:

| Subspace | Lives in | Dimension |
|----------|----------|-----------|
| $\\ker(A)$ — null space | $\\mathbb{R}^n$ | $n - r$ |
| $\\text{im}(A^T)$ — row space | $\\mathbb{R}^n$ | $r$ |
| $\\text{im}(A)$ — column space | $\\mathbb{R}^m$ | $r$ |
| $\\ker(A^T)$ — left null space | $\\mathbb{R}^m$ | $m - r$ |

The geometric FTLA asserts: **null space ⟂ row space** in $\\mathbb{R}^n$; **column space ⟂ left null space** in $\\mathbb{R}^m$.

This orthogonality is not just structural decoration — it is what makes [[orthogonal-projections|orthogonal projection]] onto the column space the right notion of "closest reachable point," and it is the engine behind [[least-squares|least squares]].

**Why null space ⟂ row space.** Take $v \\in \\ker(A)$. By definition, $Av = 0$, which means each row of $A$ dotted with $v$ gives zero. So $v$ is orthogonal to every row of $A$, hence to the entire row space. Conversely, if $v$ is orthogonal to every row of $A$, then $Av = 0$, so $v \\in \\ker(A)$. Equality.

**Why column space ⟂ left null space.** $\\ker(A^T)$ consists of vectors $w$ with $A^T w = 0$, which means $w$ is orthogonal to every column of $A$ (each column dotted with $w$ gives zero). So $\\ker(A^T) = \\text{im}(A)^\\perp$.

These two orthogonality relations *force* the four subspaces into the geometric decomposition: in $\\mathbb{R}^n$, the kernel and row space partition every vector $v = v_\\parallel + v_\\perp$ (kernel piece + row-space piece); in $\\mathbb{R}^m$, the column space and left null space partition $w = w_\\parallel + w_\\perp$ similarly.

**Solvability of $Ax = b$.** A consequence: the system $Ax = b$ has a solution iff $b \\in \\text{im}(A)$, equivalently iff $b \\perp \\ker(A^T)$. So the left null space provides a clean test for solvability — if $w \\in \\ker(A^T)$ is any nonzero left-null-space vector, then $w \\cdot b = 0$ is a *necessary condition* for $Ax = b$ to be solvable.

**Connection to [[least-squares|least squares]].** When $Ax = b$ has no exact solution (i.e., $b \\notin \\text{im}(A)$), the least-squares "solution" is the $x$ that minimizes $\\|Ax - b\\|$. By the closest-point property of orthogonal projection, this $x$ satisfies $A x = \\Pi_{\\text{im}(A)}(b)$ — projecting $b$ onto the column space. The geometric FTLA tells us this projection equals $b - r$ where $r$ is the part of $b$ in the left null space (the part of $b$ that $A$ cannot reach). Section 6.4 develops this in detail.

A useful mental picture: the geometric FTLA splits both $V$ and $W$ into "the active part" (the subspaces $T$ acts on isomorphically: row space ↔ column space) and "the inactive part" (kernels: null space and left null space). The active parts have equal dimension and are connected by $T$ as an isomorphism; the inactive parts are detached.
    `.trim(),

    definitions: [
      {
        term: 'Row space',
        body: 'For a matrix $A$: $\\text{im}(A^T)$, the span of $A$\'s rows (viewed as vectors in $\\mathbb{R}^n$). Equal to $\\ker(A)^\\perp$.',
      },
      {
        term: 'Left null space',
        body: 'For a matrix $A$: $\\ker(A^T)$, the set of vectors $w$ with $A^T w = 0$. Equal to $\\text{im}(A)^\\perp$.',
      },
      {
        term: 'Four fundamental subspaces',
        body: 'For a matrix $A \\in \\mathbb{R}^{m \\times n}$: null space, row space, column space, left null space. Two pairs of orthogonal complements: null space ⟂ row space (in $\\mathbb{R}^n$); column space ⟂ left null space (in $\\mathbb{R}^m$).',
      },
    ],

    theorems: [
      {
        name: 'Geometric Fundamental Theorem (orthogonality form)',
        statement: 'For a linear $T: V \\to W$ between finite-dimensional inner product spaces: $\\ker(T)^\\perp = \\text{im}(T^*)$ in $V$, and $\\text{im}(T)^\\perp = \\ker(T^*)$ in $W$.',
        intuition: 'The two orthogonality relations express the geometric content: the kernel of $T$ is precisely the perpendicular complement of the image of $T^*$. Each captures the same fact from a different angle: $T$ and $T^*$ "swap" kernels and images while pinning down their orthogonal partners.',
      },
      {
        name: 'Geometric decomposition',
        statement: 'For a linear $T: V \\to W$ between finite-dimensional inner product spaces: $V = \\ker(T) \\oplus \\text{im}(T^*)$ and $W = \\text{im}(T) \\oplus \\ker(T^*)$.',
        intuition: 'A direct corollary of the orthogonality theorem and $V = U \\oplus U^\\perp$ for any subspace $U$. Each space splits into the subspace $T$ acts on and its perpendicular complement.',
      },
      {
        name: 'Solvability via left null space',
        statement: 'The system $Ax = b$ is solvable iff $w \\cdot b = 0$ for every $w \\in \\ker(A^T)$.',
        intuition: 'Solvability requires $b \\in \\text{im}(A) = \\ker(A^T)^\\perp$. So $b$ must be orthogonal to every left-null-space vector. Each $w \\in \\ker(A^T)$ provides a linear constraint $w \\cdot b = 0$ that $b$ must satisfy.',
      },
    ],

    keyFormulas: [
      '\\ker(T)^\\perp = \\text{im}(T^*)',
      '\\text{im}(T)^\\perp = \\ker(T^*)',
      'V = \\ker(T) \\oplus \\text{im}(T^*)',
      'W = \\text{im}(T) \\oplus \\ker(T^*)',
    ],
  },

  explore: {
    vizComponent: 'GeometricFTLAViz',
    description: 'For a $3 \\times 3$ matrix $A$ (rank $r$ adjustable), watch all four fundamental subspaces render simultaneously: null space and row space in the domain $\\mathbb{R}^3$ (highlighting their perpendicularity with a small angle indicator), column space and left null space in the codomain $\\mathbb{R}^3$. Drag the matrix to see how the subspaces deform while preserving their orthogonality.',
    misconception: {
      title: 'Null space and column space live in DIFFERENT ambient spaces — they are NOT orthogonal complements',
      body: `
A subtle but persistent confusion: thinking $\\ker(A)$ and $\\text{im}(A)$ are orthogonal complements. For a non-square matrix $A \\in \\mathbb{R}^{m \\times n}$, $\\ker(A) \\subseteq \\mathbb{R}^n$ (in the domain) while $\\text{im}(A) \\subseteq \\mathbb{R}^m$ (in the codomain). They are subspaces of *different* ambient spaces. Asking whether they are orthogonal complements is a category error — orthogonal complement is only defined within a single inner product space.

The correct orthogonal-complement pairs are within each ambient space:
- In $\\mathbb{R}^n$: $\\ker(A) \\oplus \\text{im}(A^T) = \\mathbb{R}^n$ (null space ⟂ row space).
- In $\\mathbb{R}^m$: $\\text{im}(A) \\oplus \\ker(A^T) = \\mathbb{R}^m$ (column space ⟂ left null space).

A second misconception: thinking that if a vector $w$ is "orthogonal to $A$" (satisfying $A^T w = 0$), then $A w = 0$. These are different conditions. $A^T w = 0$ means $w$ is in the LEFT null space; $A w = 0$ means $w$ is in the (right) null space. These spaces have different dimensions ($m - r$ vs. $n - r$) and live in different ambient spaces.

A third trap: thinking that "orthogonality of fundamental subspaces" requires an orthonormal basis. It does not. The orthogonality of $\\ker(A)$ and $\\text{im}(A^T)$ is a geometric fact about $\\mathbb{R}^n$ with the standard inner product — it holds regardless of which basis you use to describe these subspaces. Choosing an orthonormal basis just makes the orthogonality more visible computationally.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Check solvability via the left null space',
        body: 'Consider $A = \\begin{pmatrix} 1 & 2 \\\\ 1 & 2 \\\\ 0 & 0 \\end{pmatrix}$ and the system $A x = b$ for $b = (3, 3, 1)$. The left null space is $\\ker(A^T) = $ vectors $w$ with $w_1 + w_2 = 0$ and $2 w_1 + 2 w_2 = 0$ — both reduce to $w_1 = -w_2$, with $w_3$ free. Basis of left null space: $\\{(1, -1, 0), (0, 0, 1)\\}$.',
      },
      {
        title: 'Test orthogonality with $b$',
        body: '$b \\cdot (1, -1, 0) = 3 - 3 + 0 = 0$ ✓. $b \\cdot (0, 0, 1) = 0 + 0 + 1 = 1 \\neq 0$. So $b$ fails the second orthogonality test, and $A x = b$ has NO solution. Verify: the column space of $A$ is $\\text{span}\\{(1, 1, 0)\\}$, a line through origin — and $b = (3, 3, 1)$ is not on this line.',
      },
    ],

    problems: [
      {
        id: 'P-6.3a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $A$ be a $5 \\times 8$ matrix with $\\text{rank}(A) = 3$. Consider the four fundamental subspaces of $A$: $\\ker(A)$, $\\text{im}(A)$, $\\ker(A)^\\perp$, $\\text{im}(A)^\\perp$. Which of the following is TRUE?',
        choices: [
          { label: 'A' as const, body: '$\\ker(A)$ and $\\text{im}(A)$ are orthogonal complements.' },
          { label: 'B' as const, body: '$\\ker(A)$ has dimension $3$ and is a subspace of $\\mathbb{R}^5$.' },
          { label: 'C' as const, body: '$\\dim(\\text{im}(A)^\\perp) = 3$' },
          { label: 'D' as const, body: '$\\dim(\\ker(A)^\\perp) = 5$' },
          { label: 'E' as const, body: 'A vector $x \\in \\mathbb{R}^8$ orthogonal to every row of $A$ must be in $\\ker(A)$.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'The geometric FTLA states that $\\ker(A) = (\\text{row space of } A)^\\perp$ in $\\mathbb{R}^8$. So a vector orthogonal to every row of $A$ lies in the orthogonal complement of the row space, which is exactly $\\ker(A)$. This is the orthogonal restatement of the fact that $A x = 0$ iff each row of $A$ dotted with $x$ gives zero.',
          trickAnalysis: [
            { choice: 'A' as const, why: '$\\ker(A) \\subseteq \\mathbb{R}^8$ and $\\text{im}(A) \\subseteq \\mathbb{R}^5$ live in different ambient spaces. They cannot be orthogonal complements. The correct complementary pairs are: $\\ker(A) \\oplus \\ker(A)^\\perp = \\mathbb{R}^8$ and $\\text{im}(A) \\oplus \\text{im}(A)^\\perp = \\mathbb{R}^5$.' },
            { choice: 'B' as const, why: 'Two errors: $\\dim(\\ker(A)) = 8 - 3 = 5$, not $3$; and $\\ker(A) \\subseteq \\mathbb{R}^8$, not $\\mathbb{R}^5$.' },
            { choice: 'C' as const, why: '$\\text{im}(A) \\subseteq \\mathbb{R}^5$ has dimension $3$, so $\\dim(\\text{im}(A)^\\perp) = 5 - 3 = 2$, not $3$. Students who assume a subspace and its complement have equal dimension pick this.' },
            { choice: 'D' as const, why: '$\\ker(A) \\subseteq \\mathbb{R}^8$ has dimension $5$, so $\\dim(\\ker(A)^\\perp) = 8 - 5 = 3$, not $5$. Students who confuse the dimension of the subspace with the dimension of its complement pick this.' },
          ],
        },
      },
      {
        id: 'P-6.3b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For a matrix $A \\in \\mathbb{R}^{m \\times n}$, which of the following is the correct geometric statement of the FTLA?',
        choices: [
          { label: 'A' as const, body: '$\\mathbb{R}^n = \\ker(A) \\oplus \\text{im}(A)$' },
          { label: 'B' as const, body: '$\\mathbb{R}^n = \\ker(A) \\oplus \\text{im}(A^T)$ and $\\mathbb{R}^m = \\text{im}(A) \\oplus \\ker(A^T)$' },
          { label: 'C' as const, body: '$\\ker(A) = \\text{im}(A)$ when $m = n$' },
          { label: 'D' as const, body: '$\\ker(A) \\cong \\text{im}(A)$ via the linear isomorphism induced by $A$' },
          { label: 'E' as const, body: '$\\dim(\\ker(A)) = \\dim(\\text{im}(A))$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The geometric FTLA splits each of the two ambient spaces into orthogonal complements. In the domain $\\mathbb{R}^n$, the null space and the row space are perpendicular and together fill the space. In the codomain $\\mathbb{R}^m$, the column space and the left null space are perpendicular and together fill the space.',
          trickAnalysis: [
            { choice: 'A' as const, why: '$\\ker(A)$ and $\\text{im}(A)$ live in different ambient spaces — cannot decompose either space into them.' },
            { choice: 'C' as const, why: 'Even for square matrices, kernel and image are generally different subspaces. They coincide only in special cases (e.g., for a self-adjoint projection, where they are NOT equal but rather orthogonal complements).' },
            { choice: 'D' as const, why: 'The correct isomorphism is between the row space (or coimage) and the image, not between the kernel and the image. The kernel collapses to zero under $A$, so they cannot be isomorphic via $A$.' },
            { choice: 'E' as const, why: 'Generally false. For an $m \\times n$ matrix with rank $r$: $\\dim(\\ker) = n - r$, $\\dim(\\text{im}) = r$. Equal only when $n = 2r$.' },
          ],
        },
      },
    ],
  },
};
