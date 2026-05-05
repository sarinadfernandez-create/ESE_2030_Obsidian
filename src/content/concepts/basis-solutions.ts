import type { Concept } from '../types';

export const basisSolutions: Concept = {
  id: 'basis-solutions',
  unitId: 'ch7',
  number: '7.7',
  title: 'Basis Solutions',
  blurb: 'The solution space of a linear ODE has dimension equal to the order; eigenvalues generate a natural basis.',
  tier: 'full',

  learn: {
    overview: `
The solution space of a linear homogeneous ODE is a [[vector-space-axioms|vector space]]. This unifying observation, applied across [[first-order-systems|first-order systems]] and [[higher-order-equations|higher-order scalar equations]], is what allows the eigenvalue machinery developed in this chapter to produce explicit closed-form solutions. The construction of a [[bases|basis]] for that solution space, and the corresponding general solution as a linear combination, is the culmination of the chapter.

For the first-order system $\\dot{\\mathbf{x}} = A \\mathbf{x}$ in $\\mathbb{R}^n$, when $A$ is diagonalizable with eigenpairs $(\\lambda_i, \\mathbf{v}_i)$, a basis for the solution space is $\\{e^{\\lambda_i t} \\mathbf{v}_i\\}_{i=1}^n$. Each basis solution is a vector-valued function: an exponential time factor times a fixed direction in $\\mathbb{R}^n$. The general solution is $\\mathbf{x}(t) = \\sum_{i=1}^n c_i e^{\\lambda_i t} \\mathbf{v}_i$, with constants $c_i$ determined by the initial condition $\\mathbf{x}(0) = \\sum_i c_i \\mathbf{v}_i$ (the eigenbasis coordinates of $\\mathbf{x}_0$).

For the scalar equation $p(D) x = 0$ of order $n$, when the characteristic polynomial $p(\\lambda)$ has $n$ distinct roots $\\lambda_1, \\ldots, \\lambda_n$, a basis for the solution space is $\\{e^{\\lambda_i t}\\}_{i=1}^n$. Each basis solution is a scalar-valued function: a pure exponential. The general solution is $x(t) = \\sum_{i=1}^n c_i e^{\\lambda_i t}$, with $n$ constants pinned down by $n$ initial conditions $x(0), \\dot{x}(0), \\ldots, x^{(n-1)}(0)$.

Linear independence in both cases follows from a Vandermonde-style argument. For the system, the eigenvectors $\\mathbf{v}_i$ are linearly independent (eigenvectors for distinct eigenvalues always are), forcing the products $e^{\\lambda_i t} \\mathbf{v}_i$ to be independent. For the scalar equation, suppose $\\sum c_i e^{\\lambda_i t} = 0$ for all $t$; differentiating $k$ times gives $\\sum c_i \\lambda_i^k e^{\\lambda_i t} = 0$. This is a Vandermonde linear system in $c_i$, with nonzero determinant when the $\\lambda_i$ are distinct, so all $c_i = 0$.

The two perspectives (vector and scalar) are isomorphic when the scalar equation is converted to a system via the [[higher-order-equations|companion matrix]]. The first component of each vector basis solution $\\boldsymbol{\\phi}_i(t) = e^{\\lambda_i t} \\mathbf{v}_i$ is exactly the scalar basis solution $\\phi_i(t) = e^{\\lambda_i t}$. Different applications favor different forms: physical models are often most natural as scalar equations, while control theory and signal processing prefer the system form. Both are exposed by the same eigenvalue analysis. This unity is the central content of the **fundamental basis theorem** for linear ODEs.

Foreshadowing: when eigenvalues coincide, both forms acquire **polynomial factors** multiplying exponentials. The basis solutions become $\\{e^{\\lambda t}, t e^{\\lambda t}, t^2 e^{\\lambda t}, \\ldots\\}$ for a repeated eigenvalue. When eigenvalues are complex, real-valued basis solutions involve sines and cosines. These extensions are the content of [[jordan-form|Chapter 8]].
    `.trim(),

    definitions: [
      {
        term: 'Basis solution',
        body: 'An element of a basis for the solution space of a linear homogeneous ODE. For diagonalizable $A$ with eigenpairs $(\\lambda_i, \\mathbf{v}_i)$, the vector basis solutions are $\\boldsymbol{\\phi}_i(t) = e^{\\lambda_i t} \\mathbf{v}_i$; the scalar basis solutions of $p(D) x = 0$ are $\\phi_i(t) = e^{\\lambda_i t}$ for distinct roots $\\lambda_i$.',
      },
      {
        term: 'General solution',
        body: 'A representation of every solution as a linear combination of basis solutions. For $\\dot{\\mathbf{x}} = A\\mathbf{x}$ with diagonalizable $A$, $\\mathbf{x}(t) = \\sum_i c_i e^{\\lambda_i t} \\mathbf{v}_i$; for $p(D) x = 0$ with distinct roots, $x(t) = \\sum_i c_i e^{\\lambda_i t}$. The constants $c_i$ are determined by initial conditions.',
      },
      {
        term: 'Solution space',
        body: 'The set of all solutions to a linear homogeneous ODE. By linearity of the differential operator, this set is a vector subspace of $C^\\infty$. Its dimension is $n$ for an $n$-th order scalar equation or an $n$-dimensional first-order system.',
      },
      {
        term: 'Affine solution set (inhomogeneous case)',
        body: 'For an inhomogeneous equation $L x = f$ with $f \\neq 0$, the solution set is NOT a subspace (it does not contain 0). It has the form $\\{x_p + x_h : x_h \\in \\ker L\\}$ where $x_p$ is any particular solution. This is an affine subspace: a translate of the homogeneous solution space.',
      },
    ],

    theorems: [
      {
        name: 'Fundamental basis theorem',
        statement: 'Let $A$ be diagonalizable with distinct eigenvalues $\\lambda_1, \\ldots, \\lambda_n$ and eigenvectors $\\mathbf{v}_1, \\ldots, \\mathbf{v}_n$. (1) For the system $\\dot{\\mathbf{x}} = A\\mathbf{x}$, the functions $\\boldsymbol{\\phi}_i(t) = e^{\\lambda_i t} \\mathbf{v}_i$ form a basis for the solution space. (2) For the scalar ODE $p(D) x = 0$ with characteristic polynomial $p(\\lambda) = \\prod (\\lambda - \\lambda_i)$, the functions $\\phi_i(t) = e^{\\lambda_i t}$ form a basis for the solution space.',
        intuition: 'Each eigenvalue contributes one basis solution, and the basis solutions are linearly independent (Vandermonde argument). Together they span the $n$-dimensional solution space. Initial conditions select a specific solution by fixing the linear combination coefficients.',
      },
      {
        name: 'Linear independence via Vandermonde',
        statement: 'If $\\lambda_1, \\ldots, \\lambda_n$ are distinct, then $\\{e^{\\lambda_i t}\\}_{i=1}^n$ is linearly independent over $\\mathbb{R}$.',
        intuition: 'Suppose $\\sum c_i e^{\\lambda_i t} = 0$ for all $t$. Differentiating $k$ times for $k = 0, 1, \\ldots, n-1$ produces $n$ equations $\\sum c_i \\lambda_i^k e^{\\lambda_i t} = 0$. At any fixed $t = t_0$, this is a linear system whose coefficient matrix is the Vandermonde matrix $[\\lambda_i^k]$. Distinct $\\lambda_i$ give nonzero determinant, forcing $c_i = 0$.',
      },
      {
        name: 'Initial conditions determine the solution uniquely',
        statement: 'For $\\dot{\\mathbf{x}} = A\\mathbf{x}$, the initial value $\\mathbf{x}(0) \\in \\mathbb{R}^n$ uniquely determines the constants $c_i$. For $p(D)x = 0$ of order $n$, the values $x(0), \\dot{x}(0), \\ldots, x^{(n-1)}(0)$ uniquely determine the $c_i$.',
        intuition: 'The map $(c_1, \\ldots, c_n) \\mapsto \\text{solution}$ is linear and bijective onto the solution space. Solving for $c_i$ amounts to changing basis from $\\{\\boldsymbol{\\phi}_i\\}$ to the standard basis at $t = 0$, which is invertible because the basis solutions are linearly independent.',
      },
    ],

    keyFormulas: [
      '\\mathbf{x}(t) = \\sum_{i=1}^n c_i e^{\\lambda_i t} \\mathbf{v}_i \\quad (\\text{system, diagonalizable } A)',
      'x(t) = \\sum_{i=1}^n c_i e^{\\lambda_i t} \\quad (\\text{scalar, distinct roots})',
      '\\dim(\\text{solution space}) = n',
      '\\mathbf{x}(t) = e^{At} \\mathbf{x}_0 \\;\\Longleftrightarrow\\; \\mathbf{x}(t) = \\sum_i c_i e^{\\lambda_i t} \\mathbf{v}_i \\text{ with } c_i \\text{ from } \\mathbf{x}_0 = \\sum_i c_i \\mathbf{v}_i',
    ],
  },

  explore: {
    vizComponent: 'BasisSolutionsViz',
    description: 'A 2D phase plane displays the trajectory of a 2-dimensional linear system $\\dot{\\mathbf{x}} = A\\mathbf{x}$, decomposed visually into its two basis solutions. The user picks $A$ from presets; the viz shows the eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$ as colored axes, and the basis solutions $e^{\\lambda_i t} \\mathbf{v}_i$ as separate animated curves. A draggable initial condition $\\mathbf{x}_0$ has its eigenbasis decomposition $c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2$ shown explicitly; the resulting trajectory is the sum of the two animated basis solutions, scaled by $c_1, c_2$.',
    misconception: {
      title: '"Solving the ODE" means finding one solution, not a basis',
      body: `
Students often write down a single particular solution to a linear homogeneous ODE and consider the problem solved. It is not. The general solution is a linear combination of basis solutions, parametrized by free constants. Without the constants, you have not described every possible behavior, only one. The point of a basis is that it spans every possibility: any solution of the ODE can be written uniquely as a linear combination of basis solutions.

A second confusion is to mistake the homogeneous and inhomogeneous cases. The homogeneous equation $L x = 0$ has a solution space (a subspace, containing 0). The inhomogeneous equation $L x = f$ with $f \\neq 0$ does NOT have a subspace as its solution set: 0 is not a solution, and sums of solutions give $L(x_1 + x_2) = 2f \\neq f$. The structure is **affine**: solutions form a translate of the homogeneous solution space by any particular solution. General solution: $x = x_p + x_h$ where $x_p$ is fixed and $x_h$ ranges over the homogeneous solution space. Forgetting either piece is a common error.

A third trap involves the dimension. The solution space of an $n$-th order scalar equation is exactly $n$-dimensional, regardless of how many distinct characteristic roots there are. Students sometimes count the number of distinct exponentials and conclude the solution space is smaller than $n$. With repeated roots, the missing basis elements take the form $t^k e^{\\lambda t}$; the dimension still equals $n$. (This case is covered in Chapter 8.)

A fourth subtlety: complex eigenvalues. A real matrix $A$ can have complex eigenvalues $a \\pm bi$, and the corresponding "basis solutions" $e^{(a+bi)t} \\mathbf{v}, e^{(a-bi)t} \\bar{\\mathbf{v}}$ are complex-valued. Real-valued basis solutions are obtained by taking real and imaginary parts: $e^{at} \\cos(bt) \\, \\text{Re}(\\mathbf{v}) - e^{at} \\sin(bt) \\, \\text{Im}(\\mathbf{v})$, etc. The dimension of the real solution space is still $n$, but two complex eigenvalues contribute two real basis solutions involving sines and cosines rather than two real exponentials. (This too is the topic of Chapter 8.)
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1: Find the eigenstructure',
        body: 'Find the general solution of $\\dot{\\mathbf{x}} = A\\mathbf{x}$ for $A = \\begin{pmatrix} 0 & 1 \\\\ -2 & 3 \\end{pmatrix}$. Characteristic polynomial: $\\det(A - \\lambda I) = \\lambda^2 - 3\\lambda + 2 = (\\lambda - 1)(\\lambda - 2)$. Eigenvalues: $\\lambda_1 = 1$, $\\lambda_2 = 2$. Eigenvectors: $\\mathbf{v}_1 = (1, 1)^T$ for $\\lambda_1$; $\\mathbf{v}_2 = (1, 2)^T$ for $\\lambda_2$.',
      },
      {
        title: 'Step 2: Write the basis solutions',
        body: 'The two basis solutions are $\\boldsymbol{\\phi}_1(t) = e^{t} \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$ and $\\boldsymbol{\\phi}_2(t) = e^{2t} \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$. They are linearly independent (different exponential rates AND different eigenvectors).',
      },
      {
        title: 'Step 3: Form the general solution',
        body: 'General solution: $\\mathbf{x}(t) = c_1 e^{t} (1,1)^T + c_2 e^{2t} (1,2)^T$. The two free constants $c_1, c_2$ parametrize all solutions; specifying $\\mathbf{x}(0) = (a, b)^T$ gives $c_1 + c_2 = a$ and $c_1 + 2 c_2 = b$, solving to $c_1 = 2a - b$, $c_2 = b - a$.',
      },
    ],

    problems: [
      {
        id: 'P-7.7a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the differential equation $\\ddot{x} + 3 \\dot{x} + 2 x = 0$. Let $S$ denote the set of all solutions. Why is $S$ a vector space?',
        choices: [
          { label: 'A' as const, body: 'Because every solution has the form $c_1 e^{-t} + c_2 e^{-2t}$.' },
          { label: 'B' as const, body: 'Because the differential operator $D^2 + 3D + 2I$ is linear, so its kernel is a subspace.' },
          { label: 'C' as const, body: 'Because the equation has exactly two linearly independent solutions.' },
          { label: 'D' as const, body: 'Because all solutions decay to zero.' },
          { label: 'E' as const, body: 'Because $x(t) = 0$ is a solution.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The solution set is the kernel of the linear operator $L = D^2 + 3D + 2I$. Linearity gives closure: if $L x_1 = L x_2 = 0$, then $L(c_1 x_1 + c_2 x_2) = c_1 L x_1 + c_2 L x_2 = 0$. The kernel of any linear operator is a subspace; this is the structural reason behind solution-space behavior for ALL linear homogeneous ODEs.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Describes what solutions LOOK LIKE, but does not explain the closure properties. The form is a consequence of linearity, not the cause.' },
            { choice: 'C' as const, why: 'The dimension is a consequence of the subspace structure, not its cause.' },
            { choice: 'D' as const, why: 'A property of THIS particular equation, not the general subspace reason. Solutions to $\\ddot{x} - x = 0$ do not all decay, but the solution space is still a subspace.' },
            { choice: 'E' as const, why: 'Necessary but not sufficient. Subspaces require closure under sums and scalar multiples, not just containing $\\mathbf{0}$.' },
          ],
        },
      },
      {
        id: 'P-7.7b',
        format: 'multiple-choice' as const,
        difficulty: 3,
        statement: 'Consider the NON-homogeneous ODE $\\ddot{x} + 4 x = \\sin t$. Let $T$ be the solution set. Which statement is correct?',
        choices: [
          { label: 'A' as const, body: '$T$ is a subspace of $C^\\infty(\\mathbb{R})$ because the operator is still linear.' },
          { label: 'B' as const, body: '$T$ is a subspace because solutions have the form $x_h + x_p$.' },
          { label: 'C' as const, body: '$T$ is not a subspace; it lacks the zero function and fails closure.' },
          { label: 'D' as const, body: '$T$ is an affine subspace: a translate of the homogeneous solution space by any particular solution.' },
          { label: 'E' as const, body: 'Both C and D.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: '$T$ is not a subspace: $0 \\notin T$ (since $\\ddot{0} + 4 \\cdot 0 = 0 \\neq \\sin t$), and if $x_1, x_2 \\in T$ then $L(x_1 + x_2) = 2 \\sin t \\neq \\sin t$. But $T$ has the form $x_p + S_h$ where $x_p$ is any particular solution and $S_h$ is the homogeneous solution space. This is an affine subspace: a translate of a vector subspace.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Linearity of the operator gives a subspace for the kernel (homogeneous solutions), but not for the inhomogeneous problem.' },
            { choice: 'B' as const, why: 'Identifies the right structure ($x_h + x_p$) but mislabels it. This is affine, not linear.' },
            { choice: 'C' as const, why: 'Correct on its own but incomplete; the affine structure (D) is also true and important.' },
            { choice: 'D' as const, why: 'Correct on its own but incomplete; the failure of subspace structure (C) is also part of the picture.' },
          ],
        },
      },
      {
        id: 'P-7.7c',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Consider the ODE $\\frac{d^3 x}{dt^3} + 6 \\frac{d^2 x}{dt^2} + 5 x = 0$. What is the dimension of its solution space?',
        choices: [
          { label: 'A' as const, body: '1' },
          { label: 'B' as const, body: '2' },
          { label: 'C' as const, body: '3' },
          { label: 'D' as const, body: '5' },
          { label: 'E' as const, body: '6' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The dimension of the solution space of an $n$-th order linear homogeneous ODE with constant coefficients is exactly $n$, regardless of whether the characteristic roots are distinct, repeated, real, or complex. This is a third-order equation, so the dimension is 3.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Picks up the count of independent variables (just $t$), which is unrelated.' },
            { choice: 'B' as const, why: 'Off-by-one; perhaps confused with the count of derivative orders below the highest.' },
            { choice: 'D' as const, why: 'Reads the constant term coefficient, which is unrelated to dimension.' },
            { choice: 'E' as const, why: 'Sums or multiplies coefficients (5+1 or 6); not a meaningful operation for solution space dimension.' },
          ],
        },
      },
    ],
  },
};
