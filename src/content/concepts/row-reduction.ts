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
        difficulty: 1,
        statement: 'Reduce $\\left[\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 0 & 2 & 1 & 8 \\\\ 0 & 0 & 3 & 9 \\end{array}\\right]$ to RREF.',
        hint: 'The matrix is already in REF. Scale rows to make pivots equal to $1$, then eliminate above each pivot.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.3b',
        difficulty: 2,
        statement: 'Reduce the augmented matrix for the system $\\begin{cases} x + y + z = 3 \\\\ 2x + 2y + 2z = 7 \\end{cases}$ and explain why this system has no solution.',
        hint: 'After eliminating $R_2 \\to R_2 - 2 R_1$, the second row becomes $0 = 1$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.3c',
        difficulty: 2,
        statement: 'Reduce the augmented matrix for the system $\\begin{cases} x + 2y + 3z = 6 \\\\ 2x + 4y + 6z = 12 \\end{cases}$. How many solutions does this system have? Identify the free and bound variables.',
        hint: 'After elimination, the second row vanishes entirely. There is one pivot column, two non-pivot columns.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.3d',
        difficulty: 3,
        statement: 'Suppose $A$ is an $m \\times n$ matrix and $\\text{RREF}(A)$ has $r$ pivots. Argue that the equation $Ax = 0$ has exactly $n - r$ free variables, and use this to describe the dimension of its solution space.',
        hint: 'Each pivot column corresponds to a bound variable. Each non-pivot column corresponds to a free variable. The free variables parameterize the solution space.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
