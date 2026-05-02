import type { Concept } from '../types';

export const specialMatrices: Concept = {
  id: 'special-matrices',
  unitId: 'ch1',
  number: '1.2',
  title: 'Special Matrices',
  blurb: 'A field guide to the matrices whose structure simplifies computation.',
  tier: 'full',

  learn: {
    overview: `
Most matrices encountered in the wild are unstructured — every entry is generic, no special relationships. But a handful of matrix types appear so often, and have such useful structural properties, that they deserve names. Recognizing one of these forms in a problem is often the difference between an easy computation and a hopeless one.

The four families introduced here — identity, permutation, block-diagonal, and triangular — each correspond to a specific kind of simple action on vectors. The **identity** does nothing. **Permutations** reorder coordinates. **Block-diagonal matrices** act independently on disjoint groups of coordinates. **Triangular matrices** can be solved by direct substitution, with no need for [[row-reduction]] at all.

These types reappear constantly in the rest of the course. The identity is the multiplicative unit for matrix multiplication and the target of the inversion process in [[inverses]]. Permutation matrices show up in [[plu-decomposition]] to record row swaps. Triangular matrices are the output of [[gaussian-elimination]] and the building blocks of [[lu-decomposition]]. Block-diagonal matrices appear naturally when problems decompose into independent subproblems, and they are also the destination of [[simple-diagonalization]] when a matrix can be brought into a block form by change of basis.

The deeper point: a matrix's "shape" — its pattern of nonzero entries — encodes computational tractability. Knowing the shape often tells you how to solve the system before you compute a single number.
    `.trim(),

    definitions: [
      {
        term: 'Identity matrix',
        body: "The $n \\times n$ matrix $I_n$ with $1$'s on the diagonal and $0$'s everywhere else: $(I_n)_{ij} = \\delta_{ij}$. For any compatible matrix $A$, $I A = A$ and $A I = A$.",
      },
      {
        term: 'Permutation matrix',
        body: 'A square matrix obtained from the identity by reordering its rows. Equivalently, a $0/1$ matrix with exactly one $1$ in each row and each column. Multiplying by a permutation matrix permutes the rows (or columns) of the target.',
      },
      {
        term: 'Diagonal matrix',
        body: 'A square matrix whose only nonzero entries lie on the main diagonal. Acts on a vector by independently scaling each coordinate.',
      },
      {
        term: 'Block-diagonal matrix',
        body: 'A matrix that, with appropriate row/column ordering, decomposes into square blocks along the diagonal with zeros elsewhere. Acts on a vector by independently applying each block to the corresponding coordinate group.',
      },
      {
        term: 'Upper triangular matrix',
        body: 'A square matrix with all entries below the main diagonal equal to zero: $A_{ij} = 0$ for $i > j$. The transpose of a lower triangular matrix.',
      },
      {
        term: 'Lower triangular matrix',
        body: 'A square matrix with all entries above the main diagonal equal to zero: $A_{ij} = 0$ for $i < j$.',
      },
    ],

    theorems: [
      {
        name: 'Triangular systems solve in linear time per row',
        statement: 'A linear system $Lx = b$ with $L$ lower triangular and nonzero diagonal can be solved by **forward substitution**: solve for $x_1$, then $x_2$, and so on, each in terms of previously found values. The analogous **back substitution** solves $Ux = b$ for $U$ upper triangular.',
        intuition: 'No row interacts with rows below it (or above, for upper). Each row, when read top-down (or bottom-up), determines a single new unknown directly. This is why [[lu-decomposition]] is useful: factoring $A = LU$ converts one hard system into two easy triangular ones.',
      },
      {
        name: 'Permutations compose to permutations',
        statement: 'The product of two permutation matrices is a permutation matrix. The inverse of a permutation matrix $P$ is its transpose $P^T$.',
        intuition: 'Permutations form a group: composing reorderings gives another reordering, and undoing a reordering is itself a reordering. The transpose-equals-inverse property is what makes permutation matrices [[orthogonal-transformations]] over the reals.',
      },
      {
        name: 'Determinant of a triangular matrix',
        statement: 'For a triangular matrix (upper or lower), $\\det(A) = \\prod_i A_{ii}$ — the product of the diagonal entries.',
        intuition: 'Triangularity means the matrix never mixes coordinates "downstream" of where they appear. The determinant, which measures how the matrix scales volumes, becomes the product of the per-coordinate scalings on the diagonal.',
      },
    ],

    keyFormulas: [
      '(I_n)_{ij} = \\delta_{ij}',
      'P^{-1} = P^T \\quad \\text{for a permutation matrix } P',
      '\\det(\\text{triangular}) = \\prod_i A_{ii}',
    ],
  },

  explore: {
    vizComponent: 'SpecialMatrixGallery',
    description: 'Cycle through the four families: identity, permutation, diagonal, triangular. For each, watch how the matrix transforms a sample of vectors. The identity preserves them. Permutations relabel coordinate axes. Diagonals stretch each axis independently. Triangulars stretch and shear in a controlled way.',
    misconception: {
      title: 'A diagonal matrix is not the same as a "matrix with only one nonzero entry per column"',
      body: `
The diagonal matrix has nonzeros only on positions $(i, i)$. A matrix with one nonzero per column is more general — it could have a nonzero at $(2, 1)$, for instance, in which case it isn't diagonal.

A subtle related confusion: a permutation matrix has exactly one nonzero per row *and* per column, but those nonzeros aren't on the diagonal in general. The identity is the special permutation matrix that *is* diagonal.

Why this matters: when [[lu-decomposition]] outputs a triangular matrix with a special structure, you'll need to recognize whether you're looking at "diagonal," "triangular with special diagonal entries," or "permutation-like." These distinctions affect how you invert or apply the matrix downstream.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Apply a permutation matrix',
        body: 'Let $P = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 1 & 0 & 0 \\end{pmatrix}$ and $v = (a, b, c)^T$. Compute $Pv$.',
      },
      {
        title: 'Read the permutation',
        body: 'Each row of $P$ has its $1$ in some column $j$ and picks out the $j$-th entry of $v$. Row 1 has its $1$ in column 2, so the first entry of $Pv$ is $b$. Similarly, the second entry is $c$ and the third is $a$.',
      },
      {
        title: 'Verify with $P^T P$',
        body: '$P^T P = I_3$, confirming $P^{-1} = P^T$. The inverse permutation, applied to $(b, c, a)^T$, returns $(a, b, c)^T$.',
      },
    ],

    problems: [
      {
        id: 'P-1.2a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Given the upper triangular system $\\begin{pmatrix} 2 & 3 & 1 \\\\ 0 & 4 & 2 \\\\ 0 & 0 & 5 \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 6 \\\\ 10 \\end{pmatrix}$, which variable is determined FIRST in back substitution?',
        choices: [
          { label: 'A' as const, body: '$x_1$, because it is the first variable.' },
          { label: 'B' as const, body: '$x_2$, because it is in the middle.' },
          { label: 'C' as const, body: '$x_3$, because we work from bottom to top.' },
          { label: 'D' as const, body: 'All three are determined simultaneously.' },
          { label: 'E' as const, body: 'The order does not matter.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'In back substitution on an upper triangular system, the bottom row contains an equation in only one unknown — here, $5x_3 = 10$, giving $x_3 = 2$ — because all other entries in that row are zero. Once $x_3$ is known, the second-to-last row becomes an equation in only $x_2$ (since $x_3$ is now a known constant), and so on upward.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses back substitution with forward substitution. In forward substitution on a lower triangular system, $x_1$ comes first; in back substitution on upper triangular, $x_n$ comes first.' },
            { choice: 'B' as const, why: 'Middle rows generally involve multiple unknowns and cannot be solved first.' },
            { choice: 'D' as const, why: 'That is what direct inversion or RREF would do, but back substitution proceeds sequentially, one unknown at a time.' },
            { choice: 'E' as const, why: 'Order is essential — solving the middle row first would require knowing $x_3$, which has not been computed yet.' },
          ],
        },
      },
      {
        id: 'P-1.2b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Which of the following is NOT necessarily true about a permutation matrix $P$?',
        choices: [
          { label: 'A' as const, body: 'Each row of $P$ contains exactly one $1$ and the rest are zeros.' },
          { label: 'B' as const, body: 'Each column of $P$ contains exactly one $1$ and the rest are zeros.' },
          { label: 'C' as const, body: '$P^{-1} = P^T$.' },
          { label: 'D' as const, body: '$\\det(P) = 1$.' },
          { label: 'E' as const, body: 'Multiplying $PA$ permutes the rows of $A$.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'A permutation matrix has $\\det(P) = \\pm 1$, with the sign equal to $(-1)^k$ where $k$ is the number of row swaps used to build $P$ from the identity. The identity itself ($k = 0$) has determinant $+1$, but any odd number of swaps produces $\\det = -1$. So the determinant is not always $+1$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'True by definition — that is what makes $P$ a permutation matrix.' },
            { choice: 'B' as const, why: 'True for the same reason.' },
            { choice: 'C' as const, why: 'True. The columns of $P$ are an orthonormal basis (they are standard basis vectors in some order), so $P^T P = I$.' },
            { choice: 'E' as const, why: 'True. Each row of $P$ "selects" one row of $A$ via matrix multiplication.' },
          ],
        },
      },
      {
        id: 'P-1.2c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Suppose $A$ and $B$ are upper triangular $n \\times n$ matrices. Which of the following must also be upper triangular?',
        choices: [
          { label: 'A' as const, body: 'The product $AB$ only.' },
          { label: 'B' as const, body: 'The sum $A + B$ only.' },
          { label: 'C' as const, body: 'Both $AB$ and $A + B$.' },
          { label: 'D' as const, body: 'The transpose $A^T$.' },
          { label: 'E' as const, body: 'Both $A^T$ and $A + B$.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'For $A + B$: each entry below the diagonal of $A+B$ is the sum of the corresponding zero entries of $A$ and $B$, hence zero. So $A + B$ is upper triangular.\n\nFor $AB$: $(AB)_{ij} = \\sum_k A_{ik} B_{kj}$. For $i > j$, every term in the sum vanishes — either $A_{ik} = 0$ (when $i > k$) or $B_{kj} = 0$ (when $k > j$); since we cannot have $k \\geq i > j \\geq k$, every term is zero.\n\nThe transpose $A^T$ is **lower** triangular, not upper.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Sums of upper triangular matrices are also upper triangular — the additive structure is preserved entrywise.' },
            { choice: 'B' as const, why: 'Products of upper triangular matrices are also upper triangular, by the calculation above.' },
            { choice: 'D' as const, why: 'The transpose of an upper triangular matrix is lower triangular.' },
            { choice: 'E' as const, why: 'Same issue with $A^T$.' },
          ],
        },
      },
      {
        id: 'P-1.2d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $L$ be the $3 \\times 3$ lower triangular matrix $L = \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & 3 & 0 \\\\ 4 & -1 & 2 \\end{pmatrix}$. What is the FIRST step of forward substitution for the system $Lx = b$ where $b = (4, 7, 6)^T$?',
        choices: [
          { label: 'A' as const, body: 'Compute $x_3 = 6 / 2 = 3$.' },
          { label: 'B' as const, body: 'Compute $x_1 = 4 / 2 = 2$.' },
          { label: 'C' as const, body: 'Multiply through by $L^{-1}$.' },
          { label: 'D' as const, body: 'Swap rows 1 and 3 to bring the largest pivot to the top.' },
          { label: 'E' as const, body: 'Compute $x_2 = (7 - 1 \\cdot x_1) / 3$, leaving $x_1$ symbolic.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The first row of $Lx = b$ is $2 x_1 = 4$ (the other entries in row 1 are zero), so $x_1 = 2$. This is the defining feature of forward substitution on a lower triangular system: the first row immediately gives the first unknown, with no other unknowns involved.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses forward substitution (top-down, for lower triangular) with back substitution (bottom-up, for upper triangular).' },
            { choice: 'C' as const, why: 'Computing $L^{-1}$ explicitly defeats the purpose of forward substitution, which is to solve directly without forming an inverse.' },
            { choice: 'D' as const, why: 'Pivoting is part of Gaussian elimination, not forward substitution. Once $L$ is fixed, no row swaps are needed.' },
            { choice: 'E' as const, why: 'This is the SECOND step. The first row gives $x_1$ directly; only after that can $x_2$ be computed.' },
          ],
        },
      },
    ],
  },
};
