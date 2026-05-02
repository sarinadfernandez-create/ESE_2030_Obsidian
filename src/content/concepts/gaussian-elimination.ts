import type { Concept } from '../types';

export const gaussianElimination: Concept = {
  id: 'gaussian-elimination',
  unitId: 'ch1',
  number: '1.5',
  title: 'Composition & Elimination',
  blurb: 'Row operations as matrix multiplication: every elimination step is a left-multiplication by an elementary matrix.',
  tier: 'full',

  learn: {
    overview: `
[[row-reduction|Row reduction]] does not just produce a simpler matrix — it produces it through a specific algebraic process that can itself be encoded as matrix multiplication. Each elementary row operation corresponds to left-multiplication by an **elementary matrix**, a matrix obtained by performing that single operation on the identity. This shift in perspective — from "operations on rows" to "products of matrices" — is what makes [[lu-decomposition]] possible and what unifies row reduction with the rest of linear algebra.

Three families of elementary matrices, one for each row operation:
- **Type R1 (swap):** the identity with two rows swapped. A permutation matrix.
- **Type R2 (scale):** the identity with one diagonal entry replaced by a nonzero scalar $c$.
- **Type R3 (add):** the identity with a single off-diagonal entry replaced by a scalar $c$.

For each type, left-multiplication by the elementary matrix performs the corresponding row operation on whatever it is multiplied by. So a sequence of row operations applied to $A$ is equivalent to the product $E_k E_{k-1} \\cdots E_1 A$, where each $E_i$ is the elementary matrix for the $i$-th operation.

**Gaussian elimination** is the specific row reduction algorithm that uses only Type R3 operations (and Type R1 swaps when necessary) to reduce $A$ to upper triangular form. Crucially, when no row swaps are needed, the product $E_k \\cdots E_1$ is *lower triangular* — and its inverse, $L = (E_k \\cdots E_1)^{-1}$, is also lower triangular. This is the seed of [[lu-decomposition]]: $A = L U$ with $U = E_k \\cdots E_1 A$.

When row swaps *are* needed (the next pivot position contains a zero), the analysis becomes slightly more delicate. The swaps must be tracked separately as a permutation matrix $P$, leading to [[plu-decomposition|PLU decomposition]] $PA = LU$.

Recognizing row reduction as matrix multiplication has another consequence: every invertible matrix is a product of elementary matrices. This is the structural reason every step of [[inverses|computing an inverse]] via row reduction works.
    `.trim(),

    definitions: [
      {
        term: 'Elementary matrix',
        body: 'A matrix obtained from the identity by applying a single elementary row operation. There are three types, one for each operation R1, R2, R3.',
      },
      {
        term: 'Gaussian elimination',
        body: 'The algorithm that reduces a matrix to upper triangular form using only Type R3 operations (add multiple of one row to another), supplemented with Type R1 (row swaps) when needed to avoid zero pivots.',
      },
      {
        term: 'Forward elimination',
        body: 'The "downward" pass of Gaussian elimination: starting from the top, use each pivot to eliminate all entries below it. Result: an upper triangular matrix in REF.',
      },
    ],

    theorems: [
      {
        name: 'Row operations are left-multiplications',
        statement: 'If $E$ is the elementary matrix for a row operation, then performing that operation on $A$ produces $EA$.',
        intuition: 'Apply the operation to $I$ to get $E$. Then $E I = E$, so $E$ records the operation. Multiplying any other matrix by $E$ on the left applies the same row-mixing pattern to that matrix.',
      },
      {
        name: 'Elementary matrices are invertible',
        statement: 'Every elementary matrix is invertible, and its inverse is also an elementary matrix of the same type. Specifically: a swap is its own inverse; a scaling by $c$ has inverse a scaling by $1/c$; an "add $c$ times row $j$ to row $i$" has inverse "add $-c$ times row $j$ to row $i$."',
        intuition: 'Every row operation is reversible — that is what made [[row-reduction]] solution-preserving in the first place. The inverse operation is exactly the elementary matrix that undoes it.',
      },
      {
        name: 'Gaussian elimination produces $A = LU$ when no swaps are needed',
        statement: "If Gaussian elimination on a square invertible matrix $A$ requires no row swaps, then $A = LU$ where $L$ is lower triangular with $1$'s on the diagonal and $U$ is upper triangular.",
        intuition: 'Each Type R3 operation multiplies by a lower-triangular elementary matrix. Their product (and inverse) is therefore also lower triangular. The result of forward elimination is upper triangular by construction. Together they factor $A$.',
      },
    ],

    keyFormulas: [
      'E_k \\cdots E_1 A = U \\quad (\\text{Gaussian elimination})',
      'A = (E_k \\cdots E_1)^{-1} U = L U',
      'A^{-1} = E_k \\cdots E_1 \\quad \\text{when } E_k \\cdots E_1 A = I',
    ],
  },

  explore: {
    vizComponent: 'EliminationAsMatrices',
    description: 'Watch row reduction unfold as a sequence of matrix products. Each step shows the elementary matrix $E_i$ being applied, with the cumulative product on the left and the partially-reduced $A$ on the right. By the end of forward elimination, the cumulative product is $L^{-1}$ and the right side is $U$.',
    misconception: {
      title: 'Row operations multiply on the LEFT, not the right',
      body: `
A persistent confusion: $EA$ versus $AE$.

**Left**-multiplication by $E$ performs a row operation on $A$. **Right**-multiplication by $E$ performs a *column* operation on $A$. These are different, and which one you want depends on the problem.

When solving a system $Ax = b$, row operations are what preserve the solution set, so left-multiplication is the right tool. When changing basis (covered later in [[change-of-basis]]), column operations on the matrix of a transformation correspond to changing the source basis — there, right-multiplication is what's needed.

A second misconception: assuming the order of elementary matrices doesn't matter. It absolutely does — matrix multiplication is not commutative. The order $E_k \\cdots E_1$ matters because each subsequent operation is applied to the result of all previous ones.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Construct an elementary matrix',
        body: 'The Type R3 operation "add $-2$ times row 1 to row 2" on a $3 \\times 3$ matrix corresponds to $E = \\begin{pmatrix} 1 & 0 & 0 \\\\ -2 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$. Verify: $E I = E$.',
      },
      {
        title: 'Apply $E$ to a sample matrix',
        body: 'Let $A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 2 & 3 & 5 \\\\ 0 & 1 & 1 \\end{pmatrix}$. Then $EA = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 3 \\\\ 0 & 1 & 1 \\end{pmatrix}$, exactly as if we had performed the row operation directly.',
      },
      {
        title: 'Identify the inverse',
        body: 'The inverse operation is "add $+2$ times row 1 to row 2," with elementary matrix $E^{-1} = \\begin{pmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$. Note: only the sign of the off-diagonal entry flips.',
      },
    ],

    problems: [
      {
        id: 'P-1.5a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $A$ be a $3 \\times 3$ matrix. The following row operations are performed in sequence:\n\n• Step 1: Add $-2$ times row 1 to row 2\n• Step 2: Swap rows 2 and 3\n• Step 3: Multiply row 3 by 5\n\nLet $E_1, E_2, E_3$ be the elementary matrices corresponding to Steps 1, 2, 3 respectively. Which expression gives the resulting matrix?',
        choices: [
          { label: 'A' as const, body: '$E_1 E_2 E_3 A$' },
          { label: 'B' as const, body: '$E_3 E_2 E_1 A$' },
          { label: 'C' as const, body: '$A E_1 E_2 E_3$' },
          { label: 'D' as const, body: '$A E_3 E_2 E_1$' },
          { label: 'E' as const, body: '$(E_1 E_2 E_3)^{-1} A$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Each row operation on $A$ is a left-multiplication by the corresponding elementary matrix. Starting with $A$, after Step 1 we have $E_1 A$. After Step 2: $E_2 (E_1 A) = E_2 E_1 A$. After Step 3: $E_3 (E_2 E_1 A) = E_3 E_2 E_1 A$. The most recent operation appears as the **leftmost** factor, because each new operation is applied to the result of all previous ones.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Writes the matrices in the order operations were performed (left to right). This is the most common error and reflects a misunderstanding of how composition works.' },
            { choice: 'C' as const, why: 'Right-multiplication performs *column* operations, not row operations.' },
            { choice: 'D' as const, why: 'Combines two errors: right-multiplication (wrong side) and reversed order.' },
            { choice: 'E' as const, why: '$(E_1 E_2 E_3)^{-1}$ would *undo* these operations, not perform them.' },
          ],
        },
      },
      {
        id: 'P-1.5b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $E_1$ be the elementary matrix that swaps rows 1 and 2, and let $E_2$ be the elementary matrix that adds 3 times row 2 to row 1. Which statement about the product $E_2 E_1$ is TRUE?',
        choices: [
          { label: 'A' as const, body: '$E_2 E_1 = E_1 E_2$ — these operations commute.' },
          { label: 'B' as const, body: '$(E_2 E_1)^{-1} = E_1^{-1} E_2^{-1}$.' },
          { label: 'C' as const, body: '$(E_2 E_1)^{-1} = E_2^{-1} E_1^{-1}$.' },
          { label: 'D' as const, body: 'The effect of $E_2 E_1$ on a matrix $A$ is to first add 3 times row 2 to row 1, then swap rows 1 and 2.' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The general inverse-of-a-product rule is $(XY)^{-1} = Y^{-1} X^{-1}$ — the order reverses. So $(E_2 E_1)^{-1} = E_1^{-1} E_2^{-1}$. Both $E_1$ and $E_2$ are invertible elementary matrices, so this product is well-defined.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Matrix multiplication is non-commutative in general, and these specific operations do not commute. Verify by computing both products on a sample matrix.' },
            { choice: 'C' as const, why: 'Reverses the correct order. The standard inverse-of-product rule is $(XY)^{-1} = Y^{-1} X^{-1}$, with the order swapped.' },
            { choice: 'D' as const, why: 'Reverses the order of operations. $E_2 E_1$ first applies $E_1$ (the rightmost factor), then $E_2$ — that is, first swap, then add.' },
            { choice: 'E' as const, why: '(B) is correct.' },
          ],
        },
      },
      {
        id: 'P-1.5c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For an $n \\times n$ matrix, standard Gaussian elimination to upper triangular form (forward elimination only, no back substitution) requires approximately how many multiplication operations?',
        choices: [
          { label: 'A' as const, body: '$n^2$ operations.' },
          { label: 'B' as const, body: '$n^3 / 3$ operations.' },
          { label: 'C' as const, body: '$n^3$ operations.' },
          { label: 'D' as const, body: '$2 n^3 / 3$ operations.' },
          { label: 'E' as const, body: '$n!$ operations.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'For each pivot column $k$, eliminating below the pivot requires $\\sim n - k$ row updates, each costing $\\sim n - k$ multiplications. Summing $\\sum_{k=1}^{n} (n - k)^2 \\sim n^3 / 3$.',
          partialCredit: '(C) earns partial credit for the correct order of magnitude but the wrong constant. (D) is the count for the full solve including back substitution, which is what some texts report.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Far too low — $n^2$ is the cost of a single row update or a back substitution.' },
            { choice: 'C' as const, why: 'Right order of magnitude, wrong constant. Earns partial credit.' },
            { choice: 'D' as const, why: 'This is the count for the complete solve including back substitution. Forward elimination alone is $n^3/3$.' },
            { choice: 'E' as const, why: 'Factorial growth would be catastrophically slow, not at all reflective of polynomial-time elimination.' },
          ],
        },
      },
      {
        id: 'P-1.5d',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Why do we use partial pivoting (row exchanges) in Gaussian elimination?',
        choices: [
          { label: 'A' as const, body: 'To make the matrix symmetric.' },
          { label: 'B' as const, body: 'To avoid division by zero and reduce numerical errors.' },
          { label: 'C' as const, body: 'To ensure all pivots are equal to 1.' },
          { label: 'D' as const, body: 'To minimize the number of operations.' },
          { label: 'E' as const, body: 'To guarantee that an LU decomposition exists.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Partial pivoting serves two purposes: (1) it allows elimination to continue when the natural pivot is zero (otherwise you would divide by zero), and (2) it reduces the magnitude of the multipliers, which limits how much rounding errors can be amplified by subsequent operations. Numerical stability is the main practical motivation.',
          partialCredit: '(E) earns partial credit — partial pivoting (more precisely, allowing any pivoting) does ensure a PLU decomposition exists. But this is a consequence of using row swaps, not the primary motivation.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Pivoting does not produce symmetry, and symmetry is not the goal.' },
            { choice: 'C' as const, why: 'Pivots are typically not made equal to 1 in standard Gaussian elimination — they are scaled later in RREF.' },
            { choice: 'D' as const, why: 'Pivoting actually adds operations (the swaps and the comparisons). It is not a performance optimization.' },
            { choice: 'E' as const, why: 'True consequence, not the main purpose. Earns partial credit.' },
          ],
        },
      },
    ],
  },
};
