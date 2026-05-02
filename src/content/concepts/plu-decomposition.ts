import type { Concept } from '../types';

export const pluDecomposition: Concept = {
  id: 'plu-decomposition',
  unitId: 'ch1',
  number: '1.7',
  title: 'Pivots & Permutations',
  blurb: 'When LU fails: track row swaps with a permutation matrix and recover existence for every invertible matrix.',
  tier: 'full',

  learn: {
    overview: `
[[lu-decomposition|LU decomposition]] fails when forward elimination encounters a zero in a pivot position. The remedy is to swap rows to bring a nonzero entry into the pivot position, and to track those swaps with a permutation matrix.

The result is the **PLU decomposition**: $PA = LU$, where $P$ is a permutation matrix encoding all the row swaps performed during elimination, and $L, U$ are the lower-and-upper-triangular factors of the (now-permuted) matrix. Equivalently: the matrix $PA$ has an LU decomposition, even when $A$ does not.

Every invertible matrix has a PLU decomposition. The proof is constructive: at each step of forward elimination, if the next pivot is zero, swap the current row with a lower row that has a nonzero entry in the pivot column. Such a row must exist — if it didn't, the entire pivot column below the current position would be zero, making the matrix singular.

There is a second motivation for using row swaps even when not strictly necessary: numerical stability. The strategy of always selecting the largest-magnitude available entry as the next pivot — called **partial pivoting** — produces a more numerically stable factorization than naive elimination. Even when the (1,1) entry is nonzero, swapping in a larger entry from below reduces the multipliers stored in $L$, which in turn reduces the amplification of rounding errors. In practice, "LU" almost always means "LU with partial pivoting," that is, PLU.

Once $PA = LU$ is in hand, solving $Ax = b$ uses the same two-step structure as plain LU, with one extra step:
1. Form $Pb$ (permute $b$ to match the row swaps in $P$).
2. Solve $Ly = Pb$ by forward substitution.
3. Solve $Ux = y$ by back substitution.

The permutation matrix $P$ is its own inverse-transpose, so working with it is cheap.
    `.trim(),

    definitions: [
      {
        term: 'PLU decomposition',
        body: 'A factorization $PA = LU$ where $P$ is a permutation matrix, $L$ is unit lower triangular, and $U$ is upper triangular. Exists for every invertible matrix.',
      },
      {
        term: 'Partial pivoting',
        body: 'The strategy of choosing, at each step of [[gaussian-elimination|forward elimination]], the largest-magnitude entry in the current pivot column (at or below the pivot row) as the next pivot. Used for numerical stability.',
      },
      {
        term: 'Pivot column',
        body: 'A column of the matrix that contains a pivot in the [[row-reduction|REF]]. The number of pivot columns equals the [[rank-and-conditioning|rank]] of the matrix.',
      },
    ],

    theorems: [
      {
        name: 'Existence of PLU for invertible matrices',
        statement: 'Every invertible square matrix $A$ admits a PLU decomposition $PA = LU$.',
        intuition: 'The proof tracks forward elimination directly. When a zero pivot appears, [[inverses|invertibility]] guarantees a nonzero entry exists somewhere in the column below — swap it up. Each swap is recorded in $P$, each multiplier is recorded in $L$, and the result is $U$.',
      },
      {
        name: 'Determinant under permutation',
        statement: 'For a permutation matrix $P$, $\\det(P) = \\pm 1$, with the sign equal to $(-1)^k$ where $k$ is the number of row swaps used to build $P$ from the identity. From $PA = LU$: $\\det(A) = \\det(P)^{-1} \\det(L) \\det(U) = \\pm \\prod_i U_{ii}$.',
        intuition: "Each row swap flips the sign of the determinant. The product of $U$'s diagonal entries gives the magnitude; the parity of swaps gives the sign.",
      },
    ],

    keyFormulas: [
      'PA = LU',
      'Ax = b \\implies Ly = Pb, \\; Ux = y',
      '\\det(A) = \\det(P)^{-1} \\prod_i U_{ii}',
    ],
  },

  explore: {
    vizComponent: 'PLUStepper',
    description: 'Step through forward elimination on a matrix where the first pivot is zero. Watch the row swap recorded in $P$, then the elimination proceed normally. Toggle between "no pivoting" and "partial pivoting" to see how partial pivoting can produce a numerically better factorization even when not strictly required.',
    misconception: {
      title: 'Permutation matrices are not the same as orthogonal matrices in general — but they are special cases',
      body: `
A permutation matrix has exactly one $1$ in each row and column, with zeros elsewhere. Such a matrix happens to satisfy $P^T P = I$, which means it is an [[orthogonal-transformations|orthogonal matrix]]. So permutation matrices form a finite subset of the orthogonal group.

But not every orthogonal matrix is a permutation matrix — a rotation matrix in 2D is orthogonal without being a permutation. The distinction matters when reasoning about [[inverses]]: $P^{-1} = P^T$, but $P^T$ is also a permutation matrix (the inverse permutation), while the transpose of a general orthogonal matrix need not have any sparsity structure.

A second confusion: equating "no pivoting needed" with "well-conditioned." A matrix can have a clean LU decomposition with no swaps and still be ill-conditioned, in which case the small multipliers don't save you from numerical disaster. [[rank-and-conditioning|Conditioning]] and pivoting are related but separate concerns.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'A matrix that requires a swap',
        body: 'Find $PA = LU$ for $A = \\begin{pmatrix} 0 & 1 & 2 \\\\ 1 & 0 & 1 \\\\ 2 & 3 & 1 \\end{pmatrix}$.',
      },
      {
        title: 'Swap to bring a nonzero pivot to the top',
        body: "Swap rows 1 and 3: $A' = \\begin{pmatrix} 2 & 3 & 1 \\\\ 1 & 0 & 1 \\\\ 0 & 1 & 2 \\end{pmatrix}$. Record $P = \\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 0 \\end{pmatrix}$.",
      },
      {
        title: 'Apply forward elimination',
        body: 'Subtract $\\frac{1}{2}$ times row 1 from row 2 ($\\ell_{21} = 1/2$): $\\begin{pmatrix} 2 & 3 & 1 \\\\ 0 & -3/2 & 1/2 \\\\ 0 & 1 & 2 \\end{pmatrix}$. Then add $\\frac{2}{3}$ times row 2 to row 3 ($\\ell_{32} = -2/3$): $U = \\begin{pmatrix} 2 & 3 & 1 \\\\ 0 & -3/2 & 1/2 \\\\ 0 & 0 & 7/3 \\end{pmatrix}$.',
      },
      {
        title: 'Assemble $L$',
        body: '$L = \\begin{pmatrix} 1 & 0 & 0 \\\\ 1/2 & 1 & 0 \\\\ 0 & -2/3 & 1 \\end{pmatrix}$. Verify: $LU = PA$. ✓',
      },
    ],

    problems: [
      {
        id: 'P-1.7a',
        difficulty: 2,
        statement: 'Find a PLU decomposition of $A = \\begin{pmatrix} 0 & 2 \\\\ 3 & 1 \\end{pmatrix}$.',
        hint: 'Swap rows to bring a nonzero entry to the $(1,1)$ position, then proceed with forward elimination on the swapped matrix.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.7b',
        difficulty: 2,
        statement: 'Using partial pivoting, find a PLU decomposition of $A = \\begin{pmatrix} 1 & 2 \\\\ 4 & 9 \\end{pmatrix}$. Compare to the (no-pivoting) LU and note the smaller multiplier in $L$.',
        hint: 'Partial pivoting selects the largest-magnitude entry in column 1 as the first pivot. That entry is $4$, in row 2.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.7c',
        difficulty: 3,
        statement: 'Show that any invertible matrix admits a PLU decomposition, by giving an algorithm that produces $P, L, U$ given $A$.',
        hint: 'Walk through forward elimination column by column. When the next pivot is zero, [[inverses|invertibility]] guarantees a nonzero entry exists below — swap it up and update $P$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.7d',
        difficulty: 1,
        statement: 'For the PLU decomposition from the worked example, compute $\\det(A)$ using the formula $\\det(A) = \\det(P)^{-1} \\prod_i U_{ii}$.',
        hint: "$P$ swaps rows 1 and 3 once, so $\\det(P) = -1$. Multiply $U$'s diagonal entries.",
        hasAnimatedSolution: false,
      },
    ],
  },
};
