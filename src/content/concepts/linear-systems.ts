import type { Concept } from '../types';

export const linearSystems: Concept = {
  id: 'linear-systems',
  unitId: 'ch1',
  number: '1.1',
  title: 'Linear Systems & Equations',
  blurb: 'The starting point: equations of the form $Ax = b$, and what it means to solve them.',
  tier: 'full',

  learn: {
    overview: `
A **linear equation** in unknowns $x_1, \\dots, x_n$ has the form $a_1 x_1 + a_2 x_2 + \\cdots + a_n x_n = b$, where the coefficients $a_i$ and the right-hand side $b$ are constants. The defining feature is that each unknown appears to the first power, with no products of unknowns, no exponents, no transcendental functions. A **linear system** is a collection of such equations that must hold simultaneously.

Linear systems are the simplest interesting equations in mathematics, and they are everywhere applied science needs to model relationships: circuit analysis, structural engineering, optimization, network flow, computer graphics, machine learning. The reason they are tractable is structural: the solutions to a linear system form a geometric object — a point, a line, a plane, or some higher-dimensional flat — and the algebra of finding it can be reduced to a recipe.

A linear system in $n$ unknowns can be packaged compactly using matrix notation: $Ax = b$, where $A$ is the coefficient matrix, $x$ is the vector of unknowns, and $b$ is the right-hand side. This compression is more than notation. Once we view systems as matrix equations, we can ask coordinate-free questions about them: when does a solution exist? When is it unique? What is the *structure* of the solution set? These questions lead naturally into the theory of [[special-matrices]], the algorithm of [[row-reduction]], and the deeper structural results in [[inverses]] and the [[fundamental-theorem]].

Three things can happen when you try to solve a linear system: there can be exactly one solution, infinitely many solutions, or no solutions at all. Which of these occurs is determined by the relationship between the rows of $A$ and the vector $b$ — specifically, whether $b$ lies in the column space of $A$ and whether $A$'s rows are linearly independent. These conditions become precise once we have the language of [[span-and-independence]] and [[image-and-kernel]], but the classification itself is visible from the very first examples.
    `.trim(),

    definitions: [
      {
        term: 'Linear equation',
        body: 'An equation of the form $a_1 x_1 + a_2 x_2 + \\cdots + a_n x_n = b$, where each $a_i$ and $b$ is a constant scalar and each $x_i$ is an unknown.',
      },
      {
        term: 'Linear system',
        body: 'A finite collection of linear equations in the same unknowns, all required to hold simultaneously. A system with $m$ equations in $n$ unknowns can be written as $Ax = b$, where $A$ is $m \\times n$, $x \\in \\mathbb{R}^n$, and $b \\in \\mathbb{R}^m$.',
      },
      {
        term: 'Coefficient matrix',
        body: 'The matrix $A$ whose entry $A_{ij}$ is the coefficient of $x_j$ in the $i$-th equation.',
      },
      {
        term: 'Augmented matrix',
        body: 'The matrix $[A \\mid b]$ formed by appending the right-hand side $b$ as an additional column. Equivalent to the original system, but in a form ready for [[row-reduction]].',
      },
      {
        term: 'Homogeneous system',
        body: 'A linear system $Ax = 0$ — that is, with right-hand side equal to the zero vector. Always has at least the trivial solution $x = 0$.',
      },
      {
        term: 'Solution set',
        body: 'The set of all $x \\in \\mathbb{R}^n$ satisfying $Ax = b$. Always one of three things: empty (no solutions), a single point (unique solution), or an affine subspace of $\\mathbb{R}^n$ (infinitely many solutions).',
      },
    ],

    theorems: [
      {
        name: 'Three possibilities for solutions',
        statement: 'For any linear system $Ax = b$, exactly one of the following holds: (i) no solution, (ii) exactly one solution, (iii) infinitely many solutions.',
        intuition: 'Two solutions $x_1$ and $x_2$ generate a whole line of solutions $x_1 + t(x_2 - x_1)$, because $A$ is linear and the difference $x_2 - x_1$ satisfies $A(x_2 - x_1) = 0$. So the moment you have two distinct solutions, you have infinitely many.',
      },
      {
        name: 'Structure of solutions to $Ax = b$',
        statement: 'If $x_p$ is any particular solution to $Ax = b$ and the solution set of $Ax = 0$ is the subspace $N$, then the solution set of $Ax = b$ is the affine set $x_p + N = \\{x_p + n : n \\in N\\}$.',
        intuition: 'The general solution is one specific solution plus anything in the null space. This decomposition recurs in linear differential equations, least-squares regression, and beyond — wherever a "linear inhomogeneous problem" appears.',
      },
    ],

    keyFormulas: [
      'Ax = b',
      '[A \\mid b]',
      'x = x_p + x_h \\quad \\text{where} \\quad A x_h = 0',
    ],
  },

  explore: {
    vizComponent: 'LinearSystemViz',
    description: 'Adjust the coefficients of two linear equations in two unknowns. Watch the solution set: a single point when the lines cross, a whole line when they coincide, and nothing when they are parallel but distinct.',
    misconception: {
      title: '"More equations than unknowns" does not mean "no solution"',
      body: `
A common reflex is to count: $m$ equations in $n$ unknowns, $m > n$ means "overdetermined, no solution." But this is not how linear systems work. The right question is whether the equations are *consistent* — whether they describe relationships that can hold simultaneously — not how many of them there are.

Three equations in two unknowns can have a unique solution if all three lines pass through the same point. Two equations in two unknowns can have *no* solution if the lines are parallel and distinct. The number of equations versus unknowns gives a heuristic for the *expected* outcome, but the actual outcome depends on the rank of $A$ and whether $b$ lies in the column space — both of which are revealed by [[row-reduction]] and made precise by [[rank-and-conditioning]].
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Write a system in matrix form',
        body: 'The system $\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}$ becomes $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$, $x = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$, $b = \\begin{pmatrix} 5 \\\\ 1 \\end{pmatrix}$.',
      },
      {
        title: 'Form the augmented matrix',
        body: '$[A \\mid b] = \\left[\\begin{array}{cc|c} 2 & 1 & 5 \\\\ 1 & -1 & 1 \\end{array}\\right]$. This is the object [[row-reduction]] operates on.',
      },
      {
        title: 'Solve by elimination',
        body: 'Subtract twice row 2 from row 1: $\\left[\\begin{array}{cc|c} 0 & 3 & 3 \\\\ 1 & -1 & 1 \\end{array}\\right]$. From the first row, $y = 1$. Back-substitute: $x = 2$. Solution: $x = 2, y = 1$.',
      },
    ],

    problems: [
      {
        id: 'P-1.1a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A $4 \\times 5$ matrix $A$ row reduces to $\\begin{pmatrix} 1 & 0 & 2 & 0 & -1 \\\\ 0 & 1 & 3 & 0 & 4 \\\\ 0 & 0 & 0 & 1 & 2 \\\\ 0 & 0 & 0 & 0 & 0 \\end{pmatrix}$. For the homogeneous system $Ax = 0$, which statement is correct?',
        choices: [
          { label: 'A' as const, body: 'The solution set is a 1-dimensional subspace of $\\mathbb{R}^5$.' },
          { label: 'B' as const, body: 'The solution set is a 2-dimensional subspace of $\\mathbb{R}^5$.' },
          { label: 'C' as const, body: 'The solution set is a 3-dimensional subspace of $\\mathbb{R}^4$.' },
          { label: 'D' as const, body: 'The general solution has exactly three free parameters.' },
          { label: 'E' as const, body: 'The system has only the trivial solution $x = 0$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The RREF has 3 pivots (in columns 1, 2, and 4), leaving 2 non-pivot columns (columns 3 and 5). Each non-pivot column corresponds to a free variable, and the dimension of the solution space to $Ax = 0$ equals the number of free variables. So the solution set is a 2-dimensional subspace of $\\mathbb{R}^5$. By rank-nullity, $\\text{nullity} = 5 - \\text{rank} = 5 - 3 = 2$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Counts only column 5 as free, missing column 3. Both non-pivot columns contribute to the null space.' },
            { choice: 'C' as const, why: 'Has the correct dimension count but wrong ambient space. Solutions are vectors $x$ with 5 components, so they live in $\\mathbb{R}^5$, not $\\mathbb{R}^4$.' },
            { choice: 'D' as const, why: 'Confuses the count of pivots with the count of free variables. There are 3 pivots, but the question is about free parameters, of which there are 2.' },
            { choice: 'E' as const, why: 'Only true when there are no free variables (i.e., when the rank equals the number of columns). Here we have free variables, so non-trivial solutions exist.' },
          ],
          visual: {
            kind: 'matrix-highlight' as const,
            data: {
              matrix: [
                ['1', '0', '2', '0', '-1'],
                ['0', '1', '3', '0', '4'],
                ['0', '0', '0', '1', '2'],
                ['0', '0', '0', '0', '0'],
              ],
              highlights: [
                { row: 0, col: 0, color: 'pivot' as const },
                { row: 1, col: 1, color: 'pivot' as const },
                { row: 2, col: 3, color: 'pivot' as const },
              ],
            },
            caption: 'Pivots in columns 1, 2, 4. Non-pivot columns 3 and 5 contribute the free variables.',
          },
        },
      },
      {
        id: 'P-1.1b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Suppose the linear system $Ax = b$ has two distinct solutions $x_1$ and $x_2$. Which statement must be TRUE?',
        choices: [
          { label: 'A' as const, body: 'There are exactly two solutions: $x_1$ and $x_2$.' },
          { label: 'B' as const, body: 'There are infinitely many solutions, including all vectors of the form $x_1 + t(x_2 - x_1)$ for $t \\in \\mathbb{R}$.' },
          { label: 'C' as const, body: 'The matrix $A$ must be singular and the system inconsistent.' },
          { label: 'D' as const, body: 'The vector $b$ must be the zero vector.' },
          { label: 'E' as const, body: 'The solutions $x_1$ and $x_2$ must be linearly independent.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'For any $t \\in \\mathbb{R}$, consider $x = x_1 + t(x_2 - x_1)$. Then $Ax = Ax_1 + t \\cdot A(x_2 - x_1) = b + t(b - b) = b$. So every such $x$ is a solution. Since these vectors form a line through $x_1$ and $x_2$, there are infinitely many solutions.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Misses the structural fact: linear systems have exactly 0, 1, or infinitely many solutions. Two distinct solutions force infinitely many.' },
            { choice: 'C' as const, why: 'Two distinct solutions means $A$ is singular (the kernel contains $x_2 - x_1 \\neq 0$), but the system is consistent — $b$ is in the column space. "Singular" and "inconsistent" are different.' },
            { choice: 'D' as const, why: 'No relationship to $b$. The system $Ax = b$ can have multiple solutions for many right-hand sides $b$, not just $b = 0$.' },
            { choice: 'E' as const, why: 'The solutions themselves can be linearly dependent (e.g., one might be a scalar multiple of the other). What matters is that $x_2 - x_1 \\neq 0$, not that $x_1, x_2$ are independent.' },
          ],
        },
      },
      {
        id: 'P-1.1c',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Which of the following pairs of equations describes a system with **no solution**?',
        choices: [
          { label: 'A' as const, body: '$2x + y = 5$ and $x - y = 1$' },
          { label: 'B' as const, body: '$x + y = 3$ and $2x + 2y = 7$' },
          { label: 'C' as const, body: '$x + y = 3$ and $2x + 2y = 6$' },
          { label: 'D' as const, body: '$3x = 0$ and $y = 0$' },
          { label: 'E' as const, body: 'Both (B) and (C) have no solution.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'In (B), the second equation says $2x + 2y = 7$, but multiplying the first equation by 2 gives $2x + 2y = 6$. This is a contradiction, so no $(x, y)$ satisfies both. Geometrically, the lines are parallel and distinct.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The lines $2x + y = 5$ and $x - y = 1$ have different slopes, so they intersect at a unique point. There is exactly one solution: $x = 2, y = 1$.' },
            { choice: 'C' as const, why: 'The second equation is exactly twice the first, so they describe the same line. Infinitely many solutions, not zero.' },
            { choice: 'D' as const, why: 'Unique solution: $x = 0, y = 0$.' },
            { choice: 'E' as const, why: 'Only (B) has no solution. (C) has infinitely many.' },
          ],
          visual: {
            kind: 'lines-2d' as const,
            data: {
              lines: [
                { a: 1, b: 1, c: 3, color: 'blue' as const, label: 'x + y = 3' },
                { a: 2, b: 2, c: 7, color: 'yellow' as const, label: '2x + 2y = 7' },
              ],
              range: [-1, 5] as [number, number],
            },
            caption: 'Two parallel lines with no intersection.',
          },
        },
      },
      {
        id: 'P-1.1d',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Which of the following statements about a homogeneous linear system $Ax = 0$ is FALSE?',
        choices: [
          { label: 'A' as const, body: 'The system always has at least one solution.' },
          { label: 'B' as const, body: 'The trivial solution $x = 0$ always works.' },
          { label: 'C' as const, body: 'The solution set is always a subspace of $\\mathbb{R}^n$.' },
          { label: 'D' as const, body: 'The system has a non-trivial solution if and only if $A$ has more rows than columns.' },
          { label: 'E' as const, body: 'If $A$ is invertible, then the only solution is $x = 0$.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'A homogeneous system has a non-trivial solution if and only if $A$ has a non-trivial null space — equivalently, if $A$ is not injective, equivalently, if $A$ does not have full column rank. This is determined by the rank, not by the row-vs-column count alone. A matrix with more rows than columns can still have full column rank (no non-trivial null space), and a matrix with fewer rows than columns automatically does have a non-trivial null space.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'True — $x = 0$ always satisfies $A \\cdot 0 = 0$.' },
            { choice: 'B' as const, why: 'True — the same fact restated.' },
            { choice: 'C' as const, why: 'True — the null space is closed under linear combinations.' },
            { choice: 'E' as const, why: 'True — invertibility means the kernel is trivial.' },
          ],
        },
      },
    ],
  },
};
