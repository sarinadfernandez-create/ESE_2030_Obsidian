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
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'In the PLU decomposition $PA = LU$, which statement about the permutation matrix $P$ is FALSE?',
        choices: [
          { label: 'A' as const, body: '$P^{-1} = P^T$ — that is, $P$ is orthogonal.' },
          { label: 'B' as const, body: '$P$ records the row exchanges needed during elimination.' },
          { label: 'C' as const, body: '$\\det(P) = \\pm 1$.' },
          { label: 'D' as const, body: '$P$ can always be chosen to be the identity matrix.' },
          { label: 'E' as const, body: '$P$ is a product of elementary row exchange matrices.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: '$P$ encodes the row swaps actually performed during elimination. For matrices where elimination proceeds without zero pivots, no swaps are needed and $P = I$. But in general — when a zero appears in a pivot position, or when partial pivoting is used to choose the largest pivot — $P$ is a non-trivial permutation. So claiming $P$ "can always be chosen to be the identity" is false.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'True. Permutation matrices are orthogonal: $P^T P = I$.' },
            { choice: 'B' as const, why: 'True. $P$ is built from the row swaps.' },
            { choice: 'C' as const, why: 'True. Each swap flips the sign of the determinant; the identity has $\\det = 1$, so permutations have $\\det = \\pm 1$.' },
            { choice: 'E' as const, why: 'True. $P$ is built by composing elementary swap matrices.' },
          ],
        },
      },
      {
        id: 'P-1.7b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A matrix $A$ has the PLU decomposition $PA = LU$. To solve $Ax = b$, which procedure is correct?',
        choices: [
          { label: 'A' as const, body: 'Compute $A = PLU$, then solve via $y = L^{-1}(PLU)x$.' },
          { label: 'B' as const, body: 'Multiply both sides of $Ax = b$ by $P$ to get $LUx = Pb$, then forward-substitute to find $y = L^{-1}(Pb)$, then back-substitute to find $x = U^{-1}y$.' },
          { label: 'C' as const, body: 'Use the factorization $A = LPU$, with $P$ between the triangular factors.' },
          { label: 'D' as const, body: 'Since $P^{-1} = -P$, we have $A = -PLU$, then solve in the standard way.' },
          { label: 'E' as const, body: 'PLU only works when $A$ is symmetric.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Starting from $Ax = b$, multiply both sides by $P$ on the left: $PAx = Pb$. Substitute the factorization: $LUx = Pb$. Now solve in two stages: (1) Forward-substitute on $Ly = Pb$ to find $y$. (2) Back-substitute on $Ux = y$ to find $x$. The key insight is that $P$ acts on the right-hand side (reordering equations), not on the matrix factors $L, U$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Writes the factorization incorrectly. From $PA = LU$, we get $A = P^{-1} LU = P^T LU$, not $A = PLU$.' },
            { choice: 'C' as const, why: 'Incorrect form. Elimination produces $PA = LU$, not $A = LPU$. The permutation does not appear between the triangular factors.' },
            { choice: 'D' as const, why: '$P^{-1} = P^T$, not $-P$. This confuses permutation matrices with anti-symmetric matrices, which is unrelated.' },
            { choice: 'E' as const, why: 'PLU works for any matrix where elimination completes — it is not restricted to symmetric matrices.' },
          ],
        },
      },
      {
        id: 'P-1.7c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'When performing Gaussian elimination with partial pivoting on column $k$, which element is selected as the pivot?',
        choices: [
          { label: 'A' as const, body: 'The element with the largest absolute value in column $k$, at or below row $k$.' },
          { label: 'B' as const, body: 'The first nonzero element encountered in column $k$.' },
          { label: 'C' as const, body: 'The element closest to $1$ in column $k$.' },
          { label: 'D' as const, body: 'The first positive element in column $k$, if one exists.' },
          { label: 'E' as const, body: 'Always the diagonal element $a_{kk}$ — pivoting only swaps rows, it does not change which element is the pivot.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Partial pivoting chooses, at each step, the largest-magnitude available entry as the next pivot. Specifically: scan column $k$ from row $k$ down to the bottom, find the entry with the largest $|a_{ik}|$, and swap that row up to row $k$. The reason is numerical stability: dividing by a larger pivot produces smaller multipliers, which limits how much rounding errors are amplified.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'The first nonzero would be sufficient to *avoid* division by zero, but it is suboptimal for numerical stability — the multipliers can be large.' },
            { choice: 'C' as const, why: '"Closest to 1" is not a standard criterion. The criterion is largest absolute value.' },
            { choice: 'D' as const, why: 'Sign is irrelevant. Magnitude is what matters.' },
            { choice: 'E' as const, why: 'The whole point of partial pivoting is to potentially swap a different row up to position $k$.' },
          ],
        },
      },
      {
        id: 'P-1.7d',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'For the matrix $A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$, which statement is TRUE about its PLU decomposition?',
        choices: [
          { label: 'A' as const, body: '$P = I$, $L = I$, $U = A$.' },
          { label: 'B' as const, body: 'PLU does not exist because $A$ is singular.' },
          { label: 'C' as const, body: '$P = \\begin{pmatrix}0 & 1\\\\1 & 0\\end{pmatrix}$, $L = I$, $U = I$.' },
          { label: 'D' as const, body: '$P$ must be the identity, but no $L, U$ can be found.' },
          { label: 'E' as const, body: 'PLU exists but is not unique.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: '$A$ has a zero in the $(1,1)$ position, so plain LU fails. Swap rows 1 and 2: $PA = \\begin{pmatrix}1&0\\\\0&1\\end{pmatrix} = I$, where $P = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$. The swapped matrix is already $I$, so $L = I$ (no elimination needed) and $U = I$. Verify: $PA = LU \\implies I = I \\cdot I$. ✓ And $A$ is invertible (it has $\\det = -1$), so it is not singular.',
          trickAnalysis: [
            { choice: 'A' as const, why: "With $P = I$, the equation $PA = LU$ becomes $A = LU$, but $A$'s zero pivot makes this impossible without a swap." },
            { choice: 'B' as const, why: '$A$ is invertible: $\\det A = -1 \\neq 0$.' },
            { choice: 'D' as const, why: '$P$ does not have to be the identity, and $L, U$ can be found — see the correct answer.' },
            { choice: 'E' as const, why: 'PLU is unique when $L$ is constrained to be unit lower triangular (which is the standard convention).' },
          ],
        },
      },
    ],
  },
};
