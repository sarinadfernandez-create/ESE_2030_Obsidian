import type { Concept } from '../types';

export const rowReduction: Concept = {
  id: 'row-reduction',
  unitId: 'ch1',
  number: '1.3',
  title: 'Row Reduction',
  blurb: 'The systematic procedure for simplifying a system without changing its solutions.',
  tier: 'full',

  learn: {
    overview: `
**Row reduction** is the algorithm for simplifying a [[linear-systems|linear system]] into an equivalent one whose solutions are easy to read off. It does this by applying three reversible operations — the **elementary row operations** — to the rows of an augmented matrix $[A \\mid b]$. Each operation preserves the solution set, so a system that has been reduced has the same solutions as the original; we have just chosen a presentation in which those solutions are visible.

The three operations are conservative in different ways. Swapping two rows just reorders the equations. Multiplying a row by a nonzero scalar rescales an equation, which obviously doesn't change what makes it true. Adding a multiple of one row to another corresponds to substituting one equation into another — also a solution-preserving move. These three are enough: with only these tools, every system can be brought into a canonical simplified form.

The standard target is **row echelon form (REF)**, in which the leading nonzero entry of each row (its **pivot**) sits strictly to the right of the pivot in the row above. From here, back-substitution finds the solution. Going further to **reduced row echelon form (RREF)** — where each pivot is $1$ and is the only nonzero entry in its column — gives a form so clean the solution can be read off directly.

Row reduction is the engine behind [[gaussian-elimination]], [[inverses|matrix inversion]], the computation of determinants, and the determination of [[rank-and-conditioning|rank]]. It is also the conceptual basis for [[lu-decomposition]]: once you understand that row operations correspond to multiplication by [[gaussian-elimination|elementary matrices]], factoring $A$ into a product becomes natural.

The variables corresponding to columns with pivots are called **bound** or **basic**; the remaining variables are **free**. Free variables can be chosen arbitrarily, and the bound variables are then determined by them. The number of free variables is the dimension of the solution space when $b$ is in the [[image-and-kernel|column space]] — and it equals zero exactly when the solution is unique.
    `.trim(),

    definitions: [
      {
        term: 'Elementary row operation',
        body: 'One of three operations on the rows of a matrix: (R1) swap two rows, (R2) multiply a row by a nonzero scalar, (R3) add a scalar multiple of one row to another. Each is reversible.',
      },
      {
        term: 'Pivot',
        body: 'The first nonzero entry in a row of a row-reduced matrix. Pivots determine which columns correspond to bound (basic) variables.',
      },
      {
        term: 'Row echelon form (REF)',
        body: 'A matrix is in REF if (i) all zero rows are at the bottom, and (ii) the pivot of each nonzero row is strictly to the right of the pivot in the row above. Not unique — multiple REFs can come from the same matrix.',
      },
      {
        term: 'Reduced row echelon form (RREF)',
        body: 'REF with two additional conditions: (iii) every pivot equals $1$, and (iv) every pivot is the only nonzero entry in its column. Unique — every matrix has exactly one RREF.',
      },
      {
        term: 'Bound variable',
        body: 'A variable corresponding to a pivot column in the RREF of $[A \\mid b]$. Determined by the values of the free variables.',
      },
      {
        term: 'Free variable',
        body: 'A variable corresponding to a non-pivot column. Can take any value; each choice gives a different solution. The number of free variables equals the dimension of the [[image-and-kernel|null space]] of $A$.',
      },
    ],

    theorems: [
      {
        name: 'Row operations preserve the solution set',
        statement: "If $[A \\mid b]$ is transformed to $[A' \\mid b']$ by elementary row operations, then $\\{x : Ax = b\\} = \\{x : A'x = b'\\}$.",
        intuition: 'Each row operation corresponds to either reordering the equations, rescaling an equation, or replacing one equation with itself plus a multiple of another. None of these changes the truth-set of the system.',
      },
      {
        name: 'Uniqueness of RREF',
        statement: 'Every matrix has a unique reduced row echelon form, regardless of the sequence of row operations used to obtain it.',
        intuition: 'REF is not unique because pivots can be scaled, but RREF fixes the scale and the column structure simultaneously, leaving no freedom. This is why RREF is the canonical form for theoretical purposes.',
      },
      {
        name: 'Existence of solutions',
        statement: '$Ax = b$ has a solution if and only if the RREF of $[A \\mid b]$ has no row of the form $[0 \\; 0 \\; \\cdots \\; 0 \\mid c]$ with $c \\neq 0$.',
        intuition: 'A row of all zeros in $A$ paired with a nonzero entry in $b$ asserts $0 = c$, which is false. The absence of such a row means every equation in the reduced system is consistent.',
      },
    ],

    keyFormulas: [
      '\\text{R1: } R_i \\leftrightarrow R_j',
      '\\text{R2: } R_i \\to c R_i \\quad (c \\neq 0)',
      '\\text{R3: } R_i \\to R_i + c R_j',
    ],
  },

  explore: {
    vizComponent: 'RowReductionStepper',
    description: 'Step through row reduction on a $3 \\times 4$ augmented matrix. Each step shows the row operation applied (in mono code-style) and the resulting matrix. Pivots are highlighted as they emerge. Try the preset examples — including a system with a free variable, an inconsistent system, and a system with a unique solution — to see how each ends up in RREF.',
    misconception: {
      title: "Row reduction does not change rows in isolation — it changes the whole matrix's relationships",
      body: `
A common misstep is to treat row reduction as cosmetic — "just simplifying the numbers." It is more than that: each row operation makes a structural claim about the system. Adding a multiple of row 1 to row 2 means "row 2 is logically equivalent to itself combined with row 1's information."

A second trap: forgetting to apply row operations to the augmented column. The right-hand side $b$ must transform alongside $A$, or the resulting system is no longer equivalent to the original.

A third: thinking REF is unique. It isn't — multiple REFs can be reached from the same starting matrix depending on the operations chosen and their order. Only [[row-reduction|RREF]] is unique. This matters when you're using REF as an intermediate step (as in [[lu-decomposition]]) — there, the goal isn't a canonical form but a specific factorization.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Set up the augmented matrix',
        body: 'Reduce the system $\\begin{cases} x + 2y + z = 4 \\\\ 2x + 5y + z = 7 \\\\ 3x + 6y + 4z = 13 \\end{cases}$. The augmented matrix is $\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\\\ 2 & 5 & 1 & 7 \\\\ 3 & 6 & 4 & 13 \\end{array}\\right]$.',
      },
      {
        title: 'Eliminate below the first pivot',
        body: 'Replace $R_2 \\to R_2 - 2 R_1$ and $R_3 \\to R_3 - 3 R_1$: $\\left[\\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\\\ 0 & 1 & -1 & -1 \\\\ 0 & 0 & 1 & 1 \\end{array}\\right]$. The matrix is now in REF.',
      },
      {
        title: 'Continue to RREF',
        body: 'Eliminate above the third pivot: $R_2 \\to R_2 + R_3$ and $R_1 \\to R_1 - R_3$: $\\left[\\begin{array}{ccc|c} 1 & 2 & 0 & 3 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 1 \\end{array}\\right]$. Then eliminate above the second pivot: $R_1 \\to R_1 - 2 R_2$: $\\left[\\begin{array}{ccc|c} 1 & 0 & 0 & 3 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 1 \\end{array}\\right]$.',
      },
      {
        title: 'Read off the solution',
        body: 'The RREF directly states $x = 3, y = 0, z = 1$. All three pivots are present and there are no free variables, so the solution is unique.',
      },
    ],

    problems: [
      {
        id: 'P-1.3a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A matrix is in row echelon form (REF). Which of the following could be the pattern of its pivots? (Use $*$ for pivot, $\\times$ for any value, $0$ for zero.)',
        choices: [
          { label: 'A' as const, body: '$\\begin{pmatrix} * & \\times & \\times \\\\ 0 & 0 & * \\\\ 0 & * & \\times \\end{pmatrix}$' },
          { label: 'B' as const, body: '$\\begin{pmatrix} * & \\times & \\times \\\\ 0 & * & \\times \\\\ 0 & 0 & 0 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$\\begin{pmatrix} 0 & * & \\times \\\\ 0 & 0 & * \\\\ 0 & 0 & 0 \\end{pmatrix}$' },
          { label: 'D' as const, body: '$\\begin{pmatrix} * & \\times & \\times \\\\ 0 & * & \\times \\\\ 0 & 0 & * \\end{pmatrix}$' },
          { label: 'E' as const, body: 'Both (B) and (D) are valid REF, and (C) is also valid.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'REF requires (i) all-zero rows at the bottom, and (ii) each pivot strictly to the right of the pivot in the row above. (B) has pivots in columns 1 and 2 with a zero row at the bottom — valid. (D) has pivots in columns 1, 2, and 3 — valid. (C) has pivots in columns 2 and 3 with a zero row at the bottom — also valid (REF does not require pivots to start in column 1). So all three are valid.',
          partialCredit: 'Selecting (B), (D), or "Both B and D" earns partial credit — those are valid, but the more complete answer recognizes that (C) is also valid REF, just with leading zeros.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Violates the staircase pattern: the pivot in row 2 is in column 3, but the pivot in row 3 is in column 2 — to the LEFT of the row above. This breaks the REF rule.' },
            { choice: 'B' as const, why: 'Valid but the answer is incomplete — (C) and (D) are also valid.' },
            { choice: 'C' as const, why: 'Tricky: many students think pivots must start in column 1, but REF only requires the staircase pattern, not where it starts.' },
            { choice: 'D' as const, why: 'Valid but incomplete — (B) and (C) are also valid.' },
          ],
        },
      },
      {
        id: 'P-1.3b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'How many different reduced row echelon forms (RREF) can a given matrix have?',
        choices: [
          { label: 'A' as const, body: 'Exactly one.' },
          { label: 'B' as const, body: 'At most one — a matrix may not have an RREF.' },
          { label: 'C' as const, body: 'Depends on the rank of the matrix.' },
          { label: 'D' as const, body: 'Depends on which sequence of row operations is used.' },
          { label: 'E' as const, body: 'Infinitely many, if the matrix is singular.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Every matrix has exactly one RREF. The form is uniquely determined by the matrix — different sequences of row operations may produce the same RREF in a different number of steps, but the final form is the same. The constraints (each pivot is 1, pivots strictly to the right of the row above, only nonzero entries in pivot columns are the pivots themselves) leave no freedom.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Subtly wrong — RREF always exists. Every matrix can be reduced to RREF by some sequence of row operations.' },
            { choice: 'C' as const, why: 'Rank affects the *content* of the RREF (number of pivots) but not the count of possible RREFs.' },
            { choice: 'D' as const, why: 'A common misconception. Different operation sequences can reach RREF differently, but they always reach the SAME RREF — that is the whole point of "uniqueness."' },
            { choice: 'E' as const, why: 'Singularity affects whether the RREF has zero rows, but does not multiply the count of RREFs.' },
          ],
        },
      },
      {
        id: 'P-1.3c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Starting from the augmented system $A x = b$, we apply a sequence of elementary row operations to obtain $Ux = c$ where $U$ is upper triangular. Which statement is TRUE?',
        choices: [
          { label: 'A' as const, body: 'The two systems have identical solution sets.' },
          { label: 'B' as const, body: 'The new system is easier to solve, but its solutions may differ from the original.' },
          { label: 'C' as const, body: 'The vectors must satisfy $c = Ub$.' },
          { label: 'D' as const, body: 'The new system has more solutions than the original because we have eliminated some equations.' },
          { label: 'E' as const, body: 'We can solve the new system only if every diagonal entry of $U$ is nonzero.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Elementary row operations on the augmented matrix $[A \\mid b]$ correspond to invertible transformations of the system. Each row operation is reversible, so the solution set is preserved at every step. The whole point of row reduction is that the simplified system has the *same* solutions as the original, but in a form that makes them easier to extract.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'The first half is correct, but the second half — that solutions might differ — is false. Solutions are preserved exactly.' },
            { choice: 'C' as const, why: 'The relationship is $E_k \\cdots E_1 \\cdot [A \\mid b] = [U \\mid c]$, where the row operations are encoded as elementary matrices. There is no simple formula like $c = Ub$.' },
            { choice: 'D' as const, why: 'Row operations never create or destroy solutions. The solution set is identical.' },
            { choice: 'E' as const, why: 'Partially right — having all nonzero diagonals makes the system uniquely solvable — but a system with some zero diagonals can still be solved (consistent with infinitely many solutions, or recognized as inconsistent if the corresponding $c$ entry is nonzero).' },
          ],
        },
      },
      {
        id: 'P-1.3d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Suppose the augmented matrix $[A \\mid b]$ row-reduces to $\\left[\\begin{array}{ccc|c} 1 & 0 & 2 & 3 \\\\ 0 & 1 & -1 & 4 \\\\ 0 & 0 & 0 & 0 \\end{array}\\right]$. Which statement is TRUE about the solution set of $Ax = b$?',
        choices: [
          { label: 'A' as const, body: 'There is no solution because the bottom row is all zeros.' },
          { label: 'B' as const, body: 'There is a unique solution.' },
          { label: 'C' as const, body: 'There are infinitely many solutions, parameterized by one free variable.' },
          { label: 'D' as const, body: 'There are infinitely many solutions, parameterized by two free variables.' },
          { label: 'E' as const, body: 'There are exactly three solutions.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The RREF has 2 pivots (in columns 1 and 2) and one non-pivot column (column 3). Column 3 corresponds to a free variable $x_3$, with $x_1 = 3 - 2 x_3$ and $x_2 = 4 + x_3$. The bottom row is $0 = 0$, which is consistent and contributes no constraint. So the solution set is a 1-parameter family.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'A zero row in the augmented matrix represents the trivially true equation $0 = 0$, not an inconsistency. Inconsistency would look like $[0 \\; 0 \\; 0 \\mid c]$ with $c \\neq 0$.' },
            { choice: 'B' as const, why: 'Unique solution requires the rank of $A$ to equal the number of unknowns. Here rank 2 < 3 unknowns, so a free variable exists.' },
            { choice: 'D' as const, why: 'Counts non-pivot columns incorrectly. There is only one non-pivot column among the three coefficient columns.' },
            { choice: 'E' as const, why: 'Linear systems have 0, 1, or infinitely many solutions — never exactly three.' },
          ],
        },
      },
    ],
  },
};
