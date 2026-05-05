import type { Concept } from '../types';

export const higherOrderEquations: Concept = {
  id: 'higher-order-equations',
  unitId: 'ch7',
  number: '7.6',
  title: 'Higher-Order Equations',
  blurb: 'Scalar n-th order linear ODEs reduce to first-order matrix systems via the companion matrix.',
  tier: 'full',

  learn: {
    overview: `
A mass-spring system tracks position and velocity; an RLC circuit tracks current and charge; a chemical reaction may follow a concentration and its rate. These systems naturally produce **second-order** (or higher) differential equations like $\\ddot{x} + \\gamma \\dot{x} + \\omega_0^2 x = 0$. Higher-order equations look more complex than [[first-order-systems|first-order systems]], but a clean reduction recovers them as first-order systems in a higher-dimensional state space.

The trick is the **companion matrix construction**. For a linear homogeneous equation of order $n$ with constant coefficients $\\frac{d^n x}{dt^n} + a_{n-1} \\frac{d^{n-1} x}{dt^{n-1}} + \\cdots + a_1 \\frac{dx}{dt} + a_0 x = 0$, introduce $n$ state variables $x_1 = x$, $x_2 = \\dot{x}$, $x_3 = \\ddot{x}$, ..., $x_n = x^{(n-1)}$. By construction, $\\dot{x}_i = x_{i+1}$ for $i = 1, \\ldots, n-1$. The original equation supplies the last relation: $\\dot{x}_n = -a_0 x_1 - a_1 x_2 - \\cdots - a_{n-1} x_n$. Stacking gives a first-order system $\\dot{\\mathbf{y}} = A \\mathbf{y}$ where $A$ is the **companion matrix**:

$$A = \\begin{pmatrix} 0 & 1 & 0 & \\cdots & 0 \\\\ 0 & 0 & 1 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & 0 & \\cdots & 1 \\\\ -a_0 & -a_1 & -a_2 & \\cdots & -a_{n-1} \\end{pmatrix}$$

This matrix has 1s on the superdiagonal (encoding $\\dot{x}_i = x_{i+1}$) and the negated coefficients in the bottom row (encoding the original equation). Its characteristic polynomial is exactly $\\lambda^n + a_{n-1} \\lambda^{n-1} + \\cdots + a_1 \\lambda + a_0$, the polynomial obtained by substituting $\\lambda$ for $D = \\frac{d}{dt}$ in the original differential operator. So the [[eigenvectors|eigenvalues]] of the companion matrix are exactly the roots of the **characteristic equation** of the original ODE.

When eigenvalues are distinct (the case in this chapter), the eigenvalues $\\lambda_1, \\ldots, \\lambda_n$ generate a basis of solutions: for the scalar equation, $\\{e^{\\lambda_1 t}, \\ldots, e^{\\lambda_n t}\\}$ is a basis of the solution space. The general solution is a linear combination $x(t) = c_1 e^{\\lambda_1 t} + \\cdots + c_n e^{\\lambda_n t}$, with constants determined by $n$ initial conditions $x(0), \\dot{x}(0), \\ldots, x^{(n-1)}(0)$.

The vector and scalar perspectives are equivalent. The vector solutions $\\boldsymbol{\\phi}_i(t) = e^{\\lambda_i t} \\mathbf{v}_i$ to $\\dot{\\mathbf{y}} = A \\mathbf{y}$ have first components $e^{\\lambda_i t}$ matching the scalar basis solutions. The first component of $\\mathbf{y}$ is exactly $x$, recovering the original variable. Different applications favor different perspectives: physical models often start scalar (a single position $x$ with derivatives), control theory and signal processing often start vector (a state space with dimensions for each measured quantity), but they describe the same mathematics. The unifying view through eigenvalues and [[basis-solutions|basis solutions]] makes the connection explicit.
    `.trim(),

    definitions: [
      {
        term: 'Companion matrix',
        body: 'The $n \\times n$ matrix associated with a monic polynomial $p(\\lambda) = \\lambda^n + a_{n-1}\\lambda^{n-1} + \\cdots + a_0$, having 1s on the superdiagonal and $-a_0, -a_1, \\ldots, -a_{n-1}$ in the bottom row. Its characteristic polynomial is exactly $p(\\lambda)$.',
      },
      {
        term: 'Characteristic equation (of an ODE)',
        body: 'For a linear constant-coefficient ODE $p(D) x = 0$ with $p(D) = D^n + a_{n-1} D^{n-1} + \\cdots + a_0 I$, the characteristic equation is $p(\\lambda) = 0$. Its roots are the natural exponential rates of decay/growth.',
      },
      {
        term: 'Differential operator $D$',
        body: 'The operator $D = \\frac{d}{dt}$ acting on smooth functions. A polynomial $p(D) = D^n + a_{n-1} D^{n-1} + \\cdots + a_0 I$ is a linear differential operator; the equation $p(D) x = 0$ is the operator form of an $n$-th order ODE.',
      },
      {
        term: 'State vector',
        body: 'For an $n$-th order scalar ODE in $x(t)$, the vector $\\mathbf{y}(t) = (x, \\dot{x}, \\ddot{x}, \\ldots, x^{(n-1)})^T$ stacking the function and its first $n-1$ derivatives. It transforms the scalar equation into the first-order system $\\dot{\\mathbf{y}} = A \\mathbf{y}$ via the companion matrix.',
      },
    ],

    theorems: [
      {
        name: 'Reduction to first-order via companion matrix',
        statement: 'The scalar ODE $p(D) x = 0$ of order $n$ is equivalent to the first-order system $\\dot{\\mathbf{y}} = A \\mathbf{y}$ where $A$ is the companion matrix of $p$ and $\\mathbf{y} = (x, \\dot{x}, \\ldots, x^{(n-1)})^T$.',
        intuition: 'Each derivative becomes a state variable. The system equations $\\dot{x}_i = x_{i+1}$ for $i < n$ are tautologies (definitions of derivatives). The original ODE supplies the last equation $\\dot{x}_n = -a_0 x_1 - \\cdots - a_{n-1} x_n$. The companion matrix encodes both pieces.',
      },
      {
        name: 'Characteristic polynomial of companion matrix',
        statement: 'The characteristic polynomial of the companion matrix of $p(\\lambda) = \\lambda^n + a_{n-1}\\lambda^{n-1} + \\cdots + a_0$ is exactly $p(\\lambda)$.',
        intuition: 'Expanding $\\det(A - \\lambda I)$ along the first column produces a recursive structure that builds up the polynomial $p(\\lambda)$ term by term. The companion matrix is engineered to make this identification work, which is why the eigenvalues of $A$ coincide with the characteristic roots of the ODE.',
      },
      {
        name: 'Exponential ansatz solves scalar ODE',
        statement: 'For $p(D)x = 0$, the function $x(t) = e^{\\lambda t}$ is a solution iff $\\lambda$ is a root of $p(\\lambda) = 0$.',
        intuition: 'Direct computation: $D e^{\\lambda t} = \\lambda e^{\\lambda t}$, $D^k e^{\\lambda t} = \\lambda^k e^{\\lambda t}$, so $p(D) e^{\\lambda t} = p(\\lambda) e^{\\lambda t}$. This vanishes iff $p(\\lambda) = 0$. The roots of the characteristic polynomial pick out the exponential modes.',
      },
    ],

    keyFormulas: [
      'p(D) x = (D^n + a_{n-1} D^{n-1} + \\cdots + a_0 I) x = 0',
      '\\mathbf{y} = (x, \\dot{x}, \\ldots, x^{(n-1)})^T \\;\\Longrightarrow\\; \\dot{\\mathbf{y}} = A \\mathbf{y}',
      'p(\\lambda) = \\det(A - \\lambda I) = \\lambda^n + a_{n-1}\\lambda^{n-1} + \\cdots + a_0',
      'p(\\lambda_i) = 0 \\;\\Longrightarrow\\; e^{\\lambda_i t} \\text{ solves } p(D) x = 0',
    ],
  },

  explore: {
    vizComponent: 'CompanionMatrixViz',
    description: 'Three linked panels for a chosen second-order ODE $\\ddot{x} + \\gamma \\dot{x} + \\omega_0^2 x = 0$: (1) sliders for $\\gamma, \\omega_0$ control the equation; (2) the companion matrix $A$ updates live, with its characteristic polynomial and eigenvalues displayed; (3) a phase plane shows the state trajectory $(x(t), \\dot{x}(t))$ alongside a 1D plot of $x(t)$. The user picks initial conditions $(x_0, \\dot{x}_0)$ by clicking in phase space; the trajectory and time series animate together.',
    misconception: {
      title: '"$n$-th order" is intrinsically harder than first-order',
      body: `
The most common misconception is that higher-order equations require fundamentally new techniques. They do not. Every linear constant-coefficient $n$-th order ODE is equivalent to a first-order $n$-dimensional system via the companion matrix. The "hard" content (eigenvalues, exponential solutions, basis structure) is the same as in first-order systems; only the dimension of the state space changes. Applying eigenvalue methods to the companion matrix recovers the classical "characteristic equation method" you may have seen in calculus, but with the linear-algebraic structure made explicit.

A second confusion: students sometimes write the companion matrix wrong. The 1s go on the **super**diagonal (just above the main diagonal), not the subdiagonal. The coefficients go in the **bottom** row, not the top. The signs are **negated**: if the ODE is $\\ddot{x} + 3 \\dot{x} + 2 x = 0$, the bottom row is $(-2, -3)$, not $(2, 3)$ or $(3, 2)$. Mnemonic: the bottom row encodes the equation $\\dot{x}_n = -a_0 x_1 - a_1 x_2 - \\cdots$, so you copy the coefficients with their sign flipped (because they were on the same side as $\\ddot{x}$ originally) and in the order $a_0, a_1, \\ldots, a_{n-1}$ (constant coefficient first).

A third trap is forgetting that the dimension of the solution space equals the **order** of the ODE, not the number of distinct roots. For $\\ddot{x} - 4\\dot{x} + 4x = 0$, the characteristic polynomial $(\\lambda-2)^2$ has only one distinct root, but the solution space is still 2-dimensional. With repeated roots, the second basis solution is $t e^{\\lambda t}$ (the polynomial factor compensates for the missing eigenvector). This complication belongs to Chapter 8; in this chapter, distinct roots are assumed.

A fourth trap involves initial conditions. An $n$-th order ODE needs $n$ initial conditions: $x(0), \\dot{x}(0), \\ldots, x^{(n-1)}(0)$. Equivalently, the state vector $\\mathbf{y}(0) = (x(0), \\dot{x}(0), \\ldots)^T \\in \\mathbb{R}^n$ specifies the IVP completely. Specifying only $x(0)$ for a second-order equation leaves a 1-parameter family of solutions, not a unique one.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1: Build the companion matrix',
        body: 'Solve $\\ddot{x} + 3 \\dot{x} + 2 x = 0$ with $x(0) = 1$, $\\dot{x}(0) = 0$. Set $\\mathbf{y} = (x, \\dot{x})^T$. The companion matrix is $A = \\begin{pmatrix} 0 & 1 \\\\ -2 & -3 \\end{pmatrix}$ (1s on the superdiagonal; bottom row has $-a_0 = -2, -a_1 = -3$).',
      },
      {
        title: 'Step 2: Find eigenvalues and eigenvectors',
        body: 'Characteristic polynomial: $\\det(A - \\lambda I) = \\lambda^2 + 3\\lambda + 2 = (\\lambda+1)(\\lambda+2)$. Eigenvalues: $\\lambda_1 = -1$, $\\lambda_2 = -2$. Eigenvectors via $(A - \\lambda I)\\mathbf{v} = 0$: for $\\lambda_1 = -1$, $\\mathbf{v}_1 = (1, -1)^T$; for $\\lambda_2 = -2$, $\\mathbf{v}_2 = (1, -2)^T$.',
      },
      {
        title: 'Step 3: Apply initial conditions',
        body: 'Scalar form: $x(t) = c_1 e^{-t} + c_2 e^{-2t}$. From $x(0) = c_1 + c_2 = 1$ and $\\dot{x}(0) = -c_1 - 2c_2 = 0$: solve to get $c_1 = 2$, $c_2 = -1$. Final answer: $x(t) = 2 e^{-t} - e^{-2t}$. Both terms decay, so $x(t) \\to 0$; the slower mode $e^{-t}$ dominates the late-stage behavior.',
      },
    ],

    problems: [
      {
        id: 'P-7.6a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'The third-order ODE $\\dddot{x} + 2 \\ddot{x} - 5 \\dot{x} + 6 x = 0$ converts to a first-order vector system $\\frac{d \\mathbf{y}}{dt} = A \\mathbf{y}$ via the companion-matrix substitution $\\mathbf{y} = (x, \\dot{x}, \\ddot{x})^T$. Which statement about the link is correct?',
        choices: [
          { label: 'A' as const, body: 'The eigenvalues of $A$ are the negatives of the roots of $\\lambda^3 + 2 \\lambda^2 - 5 \\lambda + 6 = 0$.' },
          { label: 'B' as const, body: '$\\text{tr}(A) = 2$ since 2 is the coefficient of $\\ddot{x}$.' },
          { label: 'C' as const, body: 'If $\\lambda$ is an eigenvalue of $A$, then $e^{\\lambda t}$ solves the original scalar ODE.' },
          { label: 'D' as const, body: '$A$ is symmetric for any equation of this form.' },
          { label: 'E' as const, body: 'The characteristic polynomial of $A$ is $\\lambda^3 - 2 \\lambda^2 + 5 \\lambda - 6 = 0$ (signs reversed).' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The eigenvalues of the companion matrix $A$ are exactly the roots of the characteristic polynomial $\\lambda^3 + 2\\lambda^2 - 5\\lambda + 6 = 0$ (NOT their negatives, NOT the reverse signs). For any such root $\\lambda$, the function $x(t) = e^{\\lambda t}$ solves the scalar ODE because the polynomial differential operator $p(D) = D^3 + 2D^2 - 5D + 6 I$ acts on $e^{\\lambda t}$ as $p(\\lambda) e^{\\lambda t} = 0$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The eigenvalues ARE the roots, not their negatives. The companion matrix is built precisely to make this identification work.' },
            { choice: 'B' as const, why: 'The trace of the companion matrix is $-2$ (the negative of the leading sub-coefficient), NOT $+2$. Recall the bottom row is negated.' },
            { choice: 'D' as const, why: 'Companion matrices have a specific non-symmetric structure (1s on the superdiagonal, polynomial coefficients in the last row).' },
            { choice: 'E' as const, why: 'The characteristic polynomial of $A$ matches the ODE coefficients exactly (with the same signs). Reversing signs is wrong.' },
          ],
        },
      },
      {
        id: 'P-7.6b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For the ODE $\\ddot{x} + 3 \\dot{x} + 2 x = 0$ with characteristic roots $-1, -2$, suppose the scalar solution is $x(t) = 3 e^{-t} - 2 e^{-2t}$. The corresponding vector solution $\\mathbf{y}(t) = (x(t), \\dot{x}(t))^T$ is:',
        choices: [
          { label: 'A' as const, body: '$\\begin{pmatrix} 3 e^{-t} - 2 e^{-2t} \\\\ -3 e^{-t} + 4 e^{-2t} \\end{pmatrix}$' },
          { label: 'B' as const, body: '$\\begin{pmatrix} 3 e^{-t} - 2 e^{-2t} \\\\ 3 e^{-t} - 2 e^{-2t} \\end{pmatrix}$' },
          { label: 'C' as const, body: '$\\begin{pmatrix} 3 e^{-t} \\\\ -2 e^{-2t} \\end{pmatrix}$' },
          { label: 'D' as const, body: '$\\begin{pmatrix} -3 e^{-t} + 4 e^{-2t} \\\\ 3 e^{-t} - 2 e^{-2t} \\end{pmatrix}$' },
          { label: 'E' as const, body: 'Cannot be determined without computing $e^{At}$.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'The companion-matrix construction stacks the function and its derivatives. So $\\mathbf{y}(t) = (x(t), \\dot{x}(t))^T$. Differentiate: $\\dot{x}(t) = -3 e^{-t} + 4 e^{-2t}$. Stack to get the vector solution.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Treats both components as $x(t)$, missing that the second slot is $\\dot{x}$.' },
            { choice: 'C' as const, why: 'Splits the two exponential modes into separate components, ignoring how the companion matrix actually couples them.' },
            { choice: 'D' as const, why: 'Swaps the two components of $\\mathbf{y}$.' },
            { choice: 'E' as const, why: '$e^{At}$ is not needed when we already have the scalar solution; just differentiate.' },
          ],
        },
      },
      {
        id: 'P-7.6c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the ODE $\\frac{d^4 x}{dt^4} - 5 \\frac{d^2 x}{dt^2} + 4 x = 0$ with characteristic factorization $(\\lambda - 2)(\\lambda + 2)(\\lambda - 1)(\\lambda + 1) = 0$. Which statement about its solution space is correct?',
        choices: [
          { label: 'A' as const, body: 'The solution space is 4-dimensional with basis $\\{e^{2t}, e^{-2t}, e^t, e^{-t}\\}$.' },
          { label: 'B' as const, body: 'The solution space is 4-dimensional, but any 4 exponential functions form a basis.' },
          { label: 'C' as const, body: 'The solution space dimension equals the number of distinct eigenvalues.' },
          { label: 'D' as const, body: 'The solution requires $c_i > 0$ for boundedness.' },
          { label: 'E' as const, body: 'Solutions are bounded since some characteristic roots are negative.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'For a 4th-order linear homogeneous ODE with constant coefficients, the solution space is always 4-dimensional. With four distinct roots, the four exponentials are linearly independent and span the solution space. The general solution is $x(t) = c_1 e^{2t} + c_2 e^{-2t} + c_3 e^t + c_4 e^{-t}$, and four initial conditions $x(0), x\'(0), x\'\'(0), x\'\'\'(0)$ pin down the four constants uniquely.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Only the specific exponentials at the characteristic roots form a basis. Random exponentials do not solve the ODE.' },
            { choice: 'C' as const, why: 'Dimension equals the ORDER of the equation (counting multiplicity), not just the count of distinct roots. With repeated roots, additional polynomial factors appear.' },
            { choice: 'D' as const, why: 'Sign of $c_i$ has nothing to do with boundedness. Boundedness depends on the signs of the real parts of the eigenvalues.' },
            { choice: 'E' as const, why: 'Some negative roots give decaying modes, but the positive roots ($\\lambda = 1, 2$) give growing modes. Generic solutions are unbounded.' },
          ],
        },
      },
    ],
  },
};
