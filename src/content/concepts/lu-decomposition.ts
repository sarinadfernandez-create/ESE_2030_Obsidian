import type { Concept } from '../types';

export const luDecomposition: Concept = {
  id: 'lu-decomposition',
  unitId: 'ch1',
  number: '1.6',
  title: 'LU Decomposition',
  blurb: 'Factor $A$ into a lower triangular times an upper triangular — and turn one hard system into two easy ones.',
  tier: 'full',

  learn: {
    overview: `
The **LU decomposition** factors a square matrix $A$ as $A = LU$, where $L$ is lower triangular with $1$'s on the diagonal and $U$ is upper triangular. When such a factorization exists, it is unique, and it transforms the problem of solving $Ax = b$ into two sequential triangular solves — each of which is fast and stable.

The factorization comes directly from [[gaussian-elimination]]. Each Type R3 row operation in the forward elimination phase corresponds to left-multiplication by a lower-triangular elementary matrix. Their cumulative product is also lower triangular, and its inverse $L$ records the multipliers used in each elimination step. The result of the forward pass, $U$, is upper triangular by construction. Together: $A = LU$.

The computational payoff: solving $Ax = b$ becomes a two-step process.
1. Solve $Ly = b$ for $y$ by **forward substitution** (top to bottom, since $L$ is lower triangular).
2. Solve $Ux = y$ for $x$ by **back substitution** (bottom to top, since $U$ is upper triangular).

Each substitution costs $O(n^2)$ operations, compared to $O(n^3)$ for full row reduction. For systems with the same $A$ but multiple right-hand sides $b$ — which arises constantly in engineering and simulation — LU lets you do the expensive factorization once and reuse it.

LU has limitations. It fails when a zero appears in a pivot position during forward elimination — for example, on a matrix where the $(1, 1)$ entry is zero. The fix is to permit row swaps, which leads to [[plu-decomposition|PLU decomposition]] $PA = LU$. PLU exists for every invertible matrix; LU exists only when no row swaps are needed.

A deeper view: LU is the prototype of a much broader phenomenon — that matrices can be factored into structured pieces whose action is easy to understand individually. Later in the course, [[qr-decomposition]] factors a matrix using orthogonality, and [[svd-form|SVD]] factors using singular values. Each gives a different lens for solving systems and analyzing the matrix's behavior.
    `.trim(),

    definitions: [
      {
        term: 'LU decomposition',
        body: "A factorization $A = LU$ of a square matrix into a lower triangular matrix $L$ (with $1$'s on the diagonal) and an upper triangular matrix $U$.",
      },
      {
        term: 'Forward substitution',
        body: 'The algorithm for solving $Ly = b$ when $L$ is lower triangular: solve for $y_1$ from row 1, then $y_2$ from row 2 using $y_1$, and so on top-to-bottom.',
      },
      {
        term: 'Back substitution',
        body: 'The algorithm for solving $Ux = y$ when $U$ is upper triangular: solve for $x_n$ from row $n$, then $x_{n-1}$ using $x_n$, and so on bottom-to-top.',
      },
    ],

    theorems: [
      {
        name: 'Existence of LU when no swaps are needed',
        statement: 'A square matrix $A$ has an LU decomposition (without row swaps) if and only if every leading principal minor — the determinant of the top-left $k \\times k$ block — is nonzero for $k = 1, \\dots, n$.',
        intuition: 'A nonzero leading principal minor at step $k$ guarantees that the $k$-th pivot, after $k-1$ rounds of elimination, is also nonzero. This is exactly the condition for [[gaussian-elimination]] to proceed without swaps.',
      },
      {
        name: 'Uniqueness of LU',
        statement: "When the LU decomposition exists with $L$ unit lower triangular (1's on the diagonal), it is unique.",
        intuition: 'The unit-diagonal constraint on $L$ removes the scaling ambiguity. Without it, you could absorb a diagonal matrix into either factor.',
      },
      {
        name: 'Determinant from LU',
        statement: 'If $A = LU$ with $L$ unit lower triangular, then $\\det(A) = \\det(U) = \\prod_i U_{ii}$.',
        intuition: "$\\det(L) = 1$ because $L$ is triangular with $1$'s on the diagonal. $\\det(U)$ is the product of $U$'s diagonal entries (from [[special-matrices]]). Multiplicativity of the determinant gives the result.",
      },
    ],

    keyFormulas: [
      'A = LU',
      'Ax = b \\implies Ly = b, \\; Ux = y',
      '\\det(A) = \\prod_i U_{ii}',
    ],
  },

  explore: {
    vizComponent: 'LUStepper',
    description: 'Step through the construction of $L$ and $U$ for a $3 \\times 3$ matrix. At each elimination step, watch the multiplier appear in $L$ and the row operation apply to $U$. The final state shows $L$, $U$, and a verification that $LU = A$.',
    misconception: {
      title: "LU exists only when forward elimination doesn't need row swaps",
      body: `
LU is sometimes presented as if every invertible matrix has one, but that's not quite right. A matrix like $A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ is invertible (its determinant is $-1$), but forward elimination on it requires swapping the rows immediately — there is no Type R3 operation that turns the $(1,1)$ entry from $0$ into a usable pivot.

The fix is [[plu-decomposition|PLU decomposition]] $PA = LU$, which adds a permutation matrix $P$ to record swaps. Every invertible matrix has a PLU decomposition; only some have a plain LU.

A second confusion: thinking $L$ and $U$ are interchangeable. They aren't — the order matters. $LU \\neq UL$ in general. The convention is that $L$ comes first because the elimination process produces $U$ on the right (the operand) while accumulating multipliers on the left.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Set up',
        body: 'Find $A = LU$ for $A = \\begin{pmatrix} 2 & 1 & 1 \\\\ 4 & 3 & 3 \\\\ 8 & 7 & 9 \\end{pmatrix}$.',
      },
      {
        title: 'Eliminate the first column',
        body: 'Subtract $2$ times row 1 from row 2 (multiplier $\\ell_{21} = 2$): row 2 becomes $(0, 1, 1)$. Subtract $4$ times row 1 from row 3 (multiplier $\\ell_{31} = 4$): row 3 becomes $(0, 3, 5)$. Current state: $\\begin{pmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 3 & 5 \\end{pmatrix}$.',
      },
      {
        title: 'Eliminate the second column',
        body: 'Subtract $3$ times the new row 2 from row 3 (multiplier $\\ell_{32} = 3$): row 3 becomes $(0, 0, 2)$. Now $U = \\begin{pmatrix} 2 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 2 \\end{pmatrix}$.',
      },
      {
        title: 'Assemble $L$',
        body: "$L$ has $1$'s on the diagonal and the multipliers in their corresponding positions: $L = \\begin{pmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ 4 & 3 & 1 \\end{pmatrix}$. Verify: $LU = A$. ✓",
      },
    ],

    problems: [
      {
        id: 'P-1.6a',
        difficulty: 1,
        statement: 'Find $A = LU$ for $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 8 \\end{pmatrix}$.',
        hint: 'One elimination step: subtract $3$ times row 1 from row 2. The multiplier $3$ goes into $L_{21}$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.6b',
        difficulty: 2,
        statement: 'Use the LU decomposition from the worked example to solve $Ax = b$ for $b = (1, 4, 18)^T$.',
        hint: 'First solve $Ly = b$ by forward substitution to find $y$. Then solve $Ux = y$ by back substitution.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.6c',
        difficulty: 2,
        statement: 'Show that $A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ has no LU decomposition (without row swaps).',
        hint: 'The $(1,1)$ entry is zero, so no Type R3 operation produces a nonzero first pivot.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.6d',
        difficulty: 3,
        statement: 'Suppose $A$ is symmetric ($A = A^T$) and admits an LU decomposition. Show $U = D L^T$ for some diagonal matrix $D$, leading to the symmetric factorization $A = L D L^T$.',
        hint: 'Use $A = A^T$ to derive $LU = U^T L^T$ and isolate the diagonal piece.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
