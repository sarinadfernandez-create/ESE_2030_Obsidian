import type { Concept } from '../types';

export const linearDifferentialEquations: Concept = {
  id: 'linear-differential-equations',
  unitId: 'ch2',
  number: '2.6.2',
  title: 'Linear Differential Equations',
  blurb: 'Solution sets of linear ODEs are vector spaces — and finding them reduces to finding a basis.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A **linear homogeneous differential equation** is an equation of the form
$$ a_n(t) f^{(n)} + a_{n-1}(t) f^{(n-1)} + \\cdots + a_1(t) f' + a_0(t) f = 0, $$
where $f$ is the unknown function, $f^{(k)}$ denotes its $k$-th derivative, and the $a_k(t)$ are given coefficient functions. The equation is **linear** in $f$ — meaning if $f$ and $g$ both solve it, so does $cf + dg$ for any scalars $c, d$ — and **homogeneous** because the right-hand side is zero.

The set of all solutions to such an equation is a [[subspaces|subspace]] of the [[vector-space-examples|function space]] in which $f$ lives — typically the space of $n$-times-differentiable functions. The [[subspaces|subspace test]] passes immediately: the zero function solves the equation, sums of solutions are solutions (linearity in $f$), and scalar multiples of solutions are solutions.

Once you accept that the solution set is a [[subspaces|subspace]], the entire toolkit of linear algebra applies. The fundamental result:

> **The solution space of an $n$-th order linear homogeneous ODE (with continuous coefficients on an interval) has [[dimension]] exactly $n$.**

This is why finding the general solution to an ODE reduces to finding $n$ linearly independent solutions — once you have them, every solution is a linear combination of the [[bases|basis]]. The coefficients in the linear combination are determined by initial conditions.

Concrete examples:

- $f' = f$ has solution space $\\text{span}\\{e^t\\}$, dimension $1$.
- $f'' + f = 0$ has solution space $\\text{span}\\{\\cos t, \\sin t\\}$, dimension $2$.
- $f'' - 3 f' + 2 f = 0$ has characteristic polynomial $\\lambda^2 - 3\\lambda + 2 = 0$ with roots $1, 2$, giving basis $\\{e^t, e^{2t}\\}$.
- $f^{(4)} + f = 0$ has characteristic polynomial with four roots; the solution space is 4-dimensional.

The connection to [[eigenvectors|eigenvalues]] is exact and important. For a constant-coefficient linear ODE, plugging $f = e^{\\lambda t}$ into the equation yields the **characteristic polynomial** in $\\lambda$, whose roots are the [[eigenvectors|eigenvalues]] of the differential operator $D = d/dt$ acting on the appropriate function space. Each eigenvalue contributes one (or more, in case of repeated roots) basis solution. This is the same eigenvalue story that shows up in [[simple-diagonalization|matrix diagonalization]] — and in fact, it is exactly that story applied to differential operators rather than matrices.

For non-homogeneous equations of the form $L f = g$ (where $L$ is a linear differential operator and $g$ is a given source), the solution set is an *affine* subspace: it is a particular solution $f_p$ plus the kernel of $L$ — that is, plus the solution space of the corresponding homogeneous equation. This is the same "particular plus homogeneous" structure that appeared in [[linear-systems|solving linear systems]] $Ax = b$. The unification: linear systems and linear ODEs are the same kind of problem at different levels of abstraction.

This perspective is why an entire upper-division ODE course is, structurally, a special case of linear algebra. Engineers studying control systems, vibrations, or circuit analysis are doing eigenvalue computations and basis decompositions whether they call them that or not.
    `.trim(),

    definitions: [
      {
        term: 'Linear differential operator',
        body: 'An operator of the form $L = a_n(t) D^n + \\cdots + a_1(t) D + a_0(t)$, where $D = d/dt$. Acts on a function space; produces a function from a function. Linear in the sense that $L(cf + dg) = c L(f) + d L(g)$.',
      },
      {
        term: 'Linear homogeneous ODE',
        body: 'An equation $L f = 0$, where $L$ is a linear differential operator. The "homogeneous" refers to the right-hand side being zero.',
      },
      {
        term: 'Characteristic polynomial (constant coefficients)',
        body: 'For a constant-coefficient operator $L = D^n + a_{n-1} D^{n-1} + \\cdots + a_0$, the polynomial $p(\\lambda) = \\lambda^n + a_{n-1} \\lambda^{n-1} + \\cdots + a_0$. Its roots are the values $\\lambda$ for which $e^{\\lambda t}$ is a solution.',
      },
      {
        term: 'Solution space',
        body: 'The set $\\ker(L) = \\{f : L f = 0\\}$, a [[subspaces|subspace]] of the function space. For an $n$-th order equation with continuous coefficients, has dimension $n$.',
      },
    ],

    theorems: [
      {
        name: 'Dimension of the solution space',
        statement: 'For an $n$-th order linear homogeneous ODE with continuous coefficient functions on an interval, the solution space is an $n$-dimensional [[subspaces|subspace]] of the function space.',
        intuition: "The dimension equals the order because solutions are determined by $n$ initial conditions (the values of $f, f', \\dots, f^{(n-1)}$ at any point). The map \"send a solution to its initial conditions\" is a [[injective-surjective|linear isomorphism]] between the solution space and $\\mathbb{R}^n$, so they have equal dimension.",
      },
      {
        name: 'Particular plus homogeneous decomposition',
        statement: 'For a linear non-homogeneous equation $L f = g$, every solution has the form $f = f_p + f_h$, where $f_p$ is any particular solution and $f_h$ ranges over solutions of the homogeneous equation $L f = 0$.',
        intuition: 'Same structural fact as for [[linear-systems|matrix systems]] $Ax = b$: the affine solution set is a particular solution plus the kernel. Two specific solutions to the inhomogeneous equation differ by something in the kernel.',
      },
      {
        name: 'Constant-coefficient solutions via characteristic polynomial',
        statement: 'For a constant-coefficient linear homogeneous ODE $L f = 0$ with characteristic polynomial $p(\\lambda)$: each simple root $\\lambda_i$ contributes the basis solution $e^{\\lambda_i t}$. Each root of multiplicity $k$ contributes $k$ basis solutions: $e^{\\lambda_i t}, t e^{\\lambda_i t}, \\dots, t^{k-1} e^{\\lambda_i t}$.',
        intuition: "Plugging $f = e^{\\lambda t}$ into $L f = 0$ yields $p(\\lambda) e^{\\lambda t} = 0$, so $e^{\\lambda t}$ is a solution iff $p(\\lambda) = 0$. The repeated-root case requires extra basis solutions because the simple-root recipe doesn't produce enough — the same phenomenon as defective eigenvalues requiring [[jordan-form|generalized eigenvectors]].",
      },
    ],

    keyFormulas: [
      'L f = a_n f^{(n)} + a_{n-1} f^{(n-1)} + \\cdots + a_0 f',
      'p(\\lambda) = \\lambda^n + a_{n-1} \\lambda^{n-1} + \\cdots + a_0 \\quad \\text{(constant-coefficient case)}',
      '\\dim(\\ker(L)) = n \\quad \\text{(order of the equation)}',
      'f = f_p + f_h \\quad \\text{(non-homogeneous decomposition)}',
    ],
  },

  explore: {
    vizComponent: null,
    description: 'No interactive visualization for this application.',
    misconception: {
      title: 'Solution spaces are subspaces only for HOMOGENEOUS equations',
      body: `
A common error is assuming the solution set of any differential equation is a subspace. It is not. The solution set of $L f = 0$ (homogeneous) is a [[subspaces|subspace]]. The solution set of $L f = g$ for $g \\neq 0$ is an *affine subspace* — a translate of a subspace by a particular solution — but it is not itself a subspace, because it does not contain the zero function (since $L \\cdot 0 = 0 \\neq g$).

This is exactly the distinction between solutions to $Ax = 0$ (the [[image-and-kernel|null space]], a subspace) and solutions to $Ax = b$ for $b \\neq 0$ (a coset of the null space, not a subspace). The same algebraic structure shows up in both linear systems and linear ODEs.

A second misconception: thinking the dimension of the solution space depends on which interval you look at. As long as the coefficient functions are continuous on an interval, the solution space has dimension equal to the order of the equation, regardless of the interval (assuming the standard existence and uniqueness theorems apply). The interval matters for *which* functions count as solutions, but not for *how many* basis solutions exist.

A third trap: confusing the characteristic polynomial of an ODE with the characteristic polynomial of a matrix. These are not the same object — but they are deeply related. The matrix obtained by writing an $n$-th order ODE as a system of $n$ first-order ODEs in vector form has a characteristic polynomial that *equals* the ODE's characteristic polynomial. The eigenvalue analysis is the same in both formulations, which is why ODE solving and matrix [[simple-diagonalization|diagonalization]] are structurally identical at the level of linear algebra.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: "Find the solution space of $f'' - 5 f' + 6 f = 0$",
        body: 'Try $f = e^{\\lambda t}$. Plugging in gives $(\\lambda^2 - 5 \\lambda + 6) e^{\\lambda t} = 0$, so the characteristic polynomial is $p(\\lambda) = \\lambda^2 - 5\\lambda + 6 = (\\lambda - 2)(\\lambda - 3)$. Roots: $\\lambda_1 = 2, \\lambda_2 = 3$.',
      },
      {
        title: 'Build the basis',
        body: 'Each root contributes one basis solution: $e^{2t}$ from $\\lambda_1 = 2$, and $e^{3t}$ from $\\lambda_2 = 3$. So $\\{e^{2t}, e^{3t}\\}$ is a basis for the solution space.',
      },
      {
        title: 'Write the general solution',
        body: "Every solution has the form $f(t) = c_1 e^{2t} + c_2 e^{3t}$ for some constants $c_1, c_2 \\in \\mathbb{R}$. The constants are determined by two initial conditions, e.g., $f(0)$ and $f'(0)$.",
      },
    ],

    problems: [
      {
        id: 'P-2.6.2a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'What is the dimension of the solution space of the differential equation $f^{(4)} - 16 f = 0$ (a fourth-order linear homogeneous ODE)?',
        choices: [
          { label: 'A' as const, body: '$1$' },
          { label: 'B' as const, body: '$2$' },
          { label: 'C' as const, body: '$3$' },
          { label: 'D' as const, body: '$4$' },
          { label: 'E' as const, body: 'Infinite, because functions live in an infinite-dimensional space.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'For an $n$-th order linear homogeneous ODE with continuous coefficients, the solution space has dimension exactly $n$. Here the equation is $4$-th order, so the solution space is $4$-dimensional. (Concretely: the characteristic polynomial $\\lambda^4 - 16 = (\\lambda^2 - 4)(\\lambda^2 + 4) = (\\lambda - 2)(\\lambda + 2)(\\lambda - 2i)(\\lambda + 2i)$ has four roots, contributing four real-valued basis solutions: $e^{2t}, e^{-2t}, \\cos(2t), \\sin(2t)$.)',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Mistakes the equation for first-order. The highest derivative is the fourth.' },
            { choice: 'B' as const, why: "Mistakes the equation for second-order, perhaps confusing with a related equation like $f'' + 16 f = 0$." },
            { choice: 'C' as const, why: 'Mistakes the equation for third-order, which would not match any natural reading.' },
            { choice: 'E' as const, why: "Confuses the ambient space (the function space, infinite-dimensional) with the solution subspace (finite-dimensional, equal to the ODE's order)." },
          ],
        },
      },
      {
        id: 'P-2.6.2b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Suppose $f$ and $g$ both solve a particular linear non-homogeneous equation $L h = e^t$. Which of the following must also solve this same equation?',
        choices: [
          { label: 'A' as const, body: '$f + g$' },
          { label: 'B' as const, body: '$3 f$' },
          { label: 'C' as const, body: '$f - g$' },
          { label: 'D' as const, body: '$2 f - g$' },
          { label: 'E' as const, body: 'None of the above — solutions of non-homogeneous equations cannot be combined.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'A linear combination $a f + b g$ satisfies $L(a f + b g) = a L f + b L g = a e^t + b e^t = (a + b) e^t$. For this to equal $e^t$, we need $a + b = 1$. Among the choices: (A) $a + b = 2$, fails. (B) $a + b = 3$, fails. (C) $a + b = 0$, fails (this gives a solution of the *homogeneous* equation). (D) $a + b = 1$, succeeds.',
          partialCredit: '(C) earns partial credit for the related insight: $f - g$ is in the [[image-and-kernel|kernel]] of $L$, hence a solution of the homogeneous equation. It is just not a solution of the non-homogeneous one.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Doubles the right-hand side: $L(f + g) = 2 e^t$, not $e^t$.' },
            { choice: 'B' as const, why: 'Triples the right-hand side: $L(3 f) = 3 e^t$, not $e^t$.' },
            { choice: 'C' as const, why: 'Solves the homogeneous equation, not the original non-homogeneous one. Earns partial credit.' },
            { choice: 'E' as const, why: 'Combinations with coefficient sum $1$ do work, by the calculation above.' },
          ],
        },
      },
    ],
  },
};
