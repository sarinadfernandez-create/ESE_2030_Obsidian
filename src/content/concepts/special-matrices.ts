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
        difficulty: 1,
        statement: 'Solve $Lx = b$ by forward substitution, where $L = \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & 3 & 0 \\\\ 4 & -1 & 2 \\end{pmatrix}$ and $b = (4, 7, 6)^T$.',
        hint: 'Row 1 immediately gives $x_1$. Substitute into row 2 to get $x_2$. Substitute both into row 3 for $x_3$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.2b',
        difficulty: 2,
        statement: 'How many distinct $3 \\times 3$ permutation matrices are there? List them by giving the permutation each one represents.',
        hint: 'A $3 \\times 3$ permutation matrix corresponds to a permutation of $\\{1, 2, 3\\}$. Count the permutations.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.2c',
        difficulty: 2,
        statement: 'Show that the product of two upper triangular matrices is upper triangular. (You may assume both are square and the same size.)',
        hint: 'Compute $(AB)_{ij}$ for $i > j$ using the definition of matrix multiplication and the assumption that $A_{ik} = 0$ for $i > k$ and $B_{kj} = 0$ for $k > j$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.2d',
        difficulty: 1,
        statement: 'For a $4 \\times 4$ diagonal matrix $D$ with diagonal entries $d_1, d_2, d_3, d_4$, all nonzero, write down $D^{-1}$.',
        hint: 'A diagonal matrix is inverted by inverting each diagonal entry.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
