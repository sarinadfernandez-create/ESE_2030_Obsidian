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
        difficulty: 1,
        statement: 'Write the system $\\begin{cases} 3x_1 - x_2 + 2x_3 = 4 \\\\ x_1 + x_2 - x_3 = 0 \\\\ 2x_1 + 3x_3 = 7 \\end{cases}$ as $Ax = b$. Identify $A$, $x$, and $b$ explicitly.',
        hint: "Each row of $A$ corresponds to one equation. Watch out for missing variables — the second column of $A$'s third row should be $0$, since $x_2$ does not appear.",
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.1b',
        difficulty: 2,
        statement: 'Give an example of a linear system in two unknowns with three equations that has (a) a unique solution, (b) no solution, (c) infinitely many solutions.',
        hint: "For (a), pick any three lines through a common point. For (b), pick three lines that don't all share a common intersection. For (c), pick three copies of the same line.",
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.1c',
        difficulty: 2,
        statement: 'Suppose $Ax = b$ has two distinct solutions $x_1, x_2$. Show it has infinitely many, and describe the full solution set in terms of $x_1$ and the difference $x_2 - x_1$.',
        hint: 'Show that $x_1 + t(x_2 - x_1)$ is a solution for every scalar $t$, by directly computing $A(x_1 + t(x_2 - x_1))$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.1d',
        difficulty: 1,
        statement: 'A homogeneous system $Ax = 0$ always has at least one solution. What is it, and why does it always exist?',
        hint: 'Try $x = 0$.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
