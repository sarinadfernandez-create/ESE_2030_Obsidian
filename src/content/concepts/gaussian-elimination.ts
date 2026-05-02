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
        difficulty: 1,
        statement: 'Write the $3 \\times 3$ elementary matrix corresponding to "swap rows 1 and 3."',
        hint: 'Start from $I_3$ and swap its first and third rows.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.5b',
        difficulty: 2,
        statement: 'Find elementary matrices $E_1, E_2$ such that $E_2 E_1 A = U$ for $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 7 \\end{pmatrix}$, where $U$ is upper triangular.',
        hint: 'You only need one Type R3 operation: "subtract $3$ times row 1 from row 2." That gives $E_2 = I$ (no second operation needed).',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.5c',
        difficulty: 2,
        statement: 'Argue that every invertible matrix is a product of elementary matrices.',
        hint: 'If $A$ is invertible, then row-reducing $A$ to $I$ corresponds to a product $E_k \\cdots E_1 A = I$. Solving for $A$ gives $A$ as a product of inverses of elementary matrices, which are themselves elementary.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.5d',
        difficulty: 3,
        statement: "Show that the product of two lower triangular matrices with $1$'s on the diagonal is again lower triangular with $1$'s on the diagonal. Use this to explain why the $L$ matrix in [[lu-decomposition]] always has unit diagonal when produced by Gaussian elimination.",
        hint: 'Compute $(LM)_{ii}$ and $(LM)_{ij}$ for $i < j$ directly.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
