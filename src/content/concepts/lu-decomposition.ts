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
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For which of the following matrices does an LU decomposition (without row exchanges) NOT exist?',
        choices: [
          { label: 'A' as const, body: '$\\begin{pmatrix} 2 & 4 \\\\ 1 & 3 \\end{pmatrix}$' },
          { label: 'B' as const, body: '$\\begin{pmatrix} 0 & 1 \\\\ 2 & 3 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$\\begin{pmatrix} 1 & 2 \\\\ 3 & 6 \\end{pmatrix}$' },
          { label: 'D' as const, body: '$\\begin{pmatrix} 3 & 1 \\\\ 6 & 4 \\end{pmatrix}$' },
          { label: 'E' as const, body: 'None of the above — all have LU decompositions.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'For (B), the $(1,1)$ entry is zero, so the first pivot is unavailable. No Type R3 row operation can introduce a nonzero entry in the $(1,1)$ position — only a row swap can. Therefore plain LU (without swaps) does not exist; you would need PLU.',
          partialCredit: '(C) is a partial-credit answer — that matrix is **singular** (its second row is 3 times its first), but an LU decomposition does still exist. Singularity does not preclude LU; the singularity simply shows up as a zero on the diagonal of $U$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'LU exists: $L = \\begin{pmatrix}1&0\\\\0.5&1\\end{pmatrix}$, $U = \\begin{pmatrix}2&4\\\\0&1\\end{pmatrix}$.' },
            { choice: 'C' as const, why: "Singular but LU exists: $L = \\begin{pmatrix}1&0\\\\3&1\\end{pmatrix}$, $U = \\begin{pmatrix}1&2\\\\0&0\\end{pmatrix}$. The zero on $U$'s diagonal reveals singularity but does not prevent the factorization." },
            { choice: 'D' as const, why: 'LU exists: $L = \\begin{pmatrix}1&0\\\\2&1\\end{pmatrix}$, $U = \\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}$.' },
            { choice: 'E' as const, why: '(B) does not have a plain LU decomposition.' },
          ],
        },
      },
      {
        id: 'P-1.6b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'In the LU decomposition $A = LU$ with $L$ unit lower triangular, which property does $L$ ALWAYS have?',
        choices: [
          { label: 'A' as const, body: 'All diagonal entries of $L$ are $1$.' },
          { label: 'B' as const, body: 'All entries of $L$ are nonnegative.' },
          { label: 'C' as const, body: '$L$ is symmetric.' },
          { label: 'D' as const, body: 'The entries below the diagonal are the negatives of the multipliers used in elimination.' },
          { label: 'E' as const, body: '$L^{-1}$ is upper triangular.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: "By the convention of \"unit lower triangular,\" $L$ has $1$'s on the main diagonal. The sub-diagonal entries are the multipliers from Gaussian elimination — specifically, $L_{ij}$ for $i > j$ is the multiplier used to eliminate $A_{ij}$ during the elimination of column $j$.",
          trickAnalysis: [
            { choice: 'B' as const, why: 'Multipliers can be negative (if the corresponding entry is negative). For example, eliminating a positive entry below a negative pivot produces a negative multiplier.' },
            { choice: 'C' as const, why: '$L$ is generally not symmetric — its strictly upper-triangular entries are zero, while its strictly lower-triangular entries are nonzero in general.' },
            { choice: 'D' as const, why: 'Subtle but wrong. The sub-diagonal entries of $L$ ARE the multipliers, not their negatives. The negatives appear in the elementary matrices used during elimination, but $L$ stores the positive (un-negated) multipliers.' },
            { choice: 'E' as const, why: 'The inverse of a lower triangular matrix is also lower triangular, not upper.' },
          ],
        },
      },
      {
        id: 'P-1.6c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Suppose a $4 \\times 4$ matrix $A$ has an LU decomposition $A = LU$ where $L$ is unit lower triangular and $U$ is upper triangular. If $u_{33} = 0$ (the third diagonal entry of $U$), which statement MUST be true?',
        choices: [
          { label: 'A' as const, body: '$A$ is invertible, but $U$ is not.' },
          { label: 'B' as const, body: '$Ax = b$ has no solution for any $b$.' },
          { label: 'C' as const, body: '$A$ has rank exactly 2.' },
          { label: 'D' as const, body: '$A$ is singular.' },
          { label: 'E' as const, body: 'The LU decomposition does not exist — this situation is impossible.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'Since $L$ is unit lower triangular, $\\det(L) = 1$, so $\\det(A) = \\det(L) \\det(U) = \\det(U)$. The determinant of an upper triangular matrix is the product of its diagonal entries: $\\det(U) = u_{11} u_{22} u_{33} u_{44}$. Since $u_{33} = 0$, we have $\\det(U) = 0$, hence $\\det(A) = 0$, hence $A$ is singular.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Self-contradictory: if $U$ is singular and $A = LU$ with $L$ invertible, then $A$ must also be singular.' },
            { choice: 'B' as const, why: 'Singular matrices can still have solutions for some right-hand sides — namely, those $b$ in the column space of $A$.' },
            { choice: 'C' as const, why: 'Rank could be 2 or 3 depending on $u_{44}$. If $u_{44} \\neq 0$, rank is 3; if also zero, rank is 2 or less.' },
            { choice: 'E' as const, why: "LU decompositions can have zero entries on $U$'s diagonal — that is exactly how singularity manifests in the factorization." },
          ],
        },
      },
      {
        id: 'P-1.6d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'An engineer needs to solve $A x_i = b_i$ for $i = 1, \\dots, 100$, where $A$ is a fixed $500 \\times 500$ invertible matrix and the $b_i$ arrive sequentially over time. Why is computing the LU decomposition of $A$ advantageous?',
        choices: [
          { label: 'A' as const, body: 'Computing $A^{-1}$ once and using $x_i = A^{-1} b_i$ requires storing a dense matrix, while $L$ and $U$ are sparse.' },
          { label: 'B' as const, body: 'LU decomposition is the only factorization method that works when $A$ is not symmetric.' },
          { label: 'C' as const, body: 'The diagonal entries of $U$ directly give the solutions $x_i$ without further computation.' },
          { label: 'D' as const, body: 'Row reducing $[A \\mid b_i]$ separately for each new $b_i$ repeats $O(n^3)$ work; with LU, the $O(n^3)$ factorization is done once and each solve costs only $O(n^2)$.' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'The key benefit is amortization. Gaussian elimination on $[A \\mid b_i]$ costs $O(n^3)$ per system. Doing this 100 times: $100 \\cdot O(n^3)$. With LU: factor once at $O(n^3)$, then each system $LUx_i = b_i$ requires only forward substitution (solve $Ly_i = b_i$) and back substitution (solve $Ux_i = y_i$), each at $O(n^2)$. Total: $O(n^3) + 100 \\cdot O(n^2)$ — a factor of about $n/3 \\sim 167$ speedup for $n = 500$.',
          trickAnalysis: [
            { choice: 'A' as const, why: '$L$ and $U$ are NOT generally sparse for a dense $A$ — they have the same storage cost as $A$. Memory is not the advantage.' },
            { choice: 'B' as const, why: 'Several methods work for non-symmetric matrices: QR decomposition, direct row reduction, computing $A^{-1}$. LU is not unique in this regard.' },
            { choice: 'C' as const, why: 'The diagonal of $U$ holds the pivots, not the solutions. Forward and back substitution are still required.' },
            { choice: 'E' as const, why: '(D) is correct, so this is wrong.' },
          ],
        },
      },
    ],
  },
};
