import type { Concept } from '../types';

export const firstOrderSystems: Concept = {
  id: 'first-order-systems',
  unitId: 'ch7',
  number: '7.1',
  title: 'First-Order Systems',
  blurb: 'Linear ODEs as linear operators: solutions form a vector space, and exponentials are the natural basis.',
  tier: 'full',

  learn: {
    overview: `
The simplest differential equation is also the most revealing. Consider $\\frac{dx}{dt} = \\lambda x$. Calculus gives the solution $x(t) = x_0 e^{\\lambda t}$, where $x_0$ is the initial value. The character of $\\lambda$ controls everything: positive $\\lambda$ gives exponential growth, negative gives decay, zero gives a constant.

What looks like a calculus fact is actually the seed of a deep linear-algebraic structure. The operator $L = \\frac{d}{dt} - \\lambda I$ acts linearly on the space of differentiable functions, and the solution set is exactly the [[image-and-kernel|kernel]] of $L$. Kernels of linear operators are subspaces; that is the structural reason solutions of a linear homogeneous ODE form a [[vector-space-axioms|vector space]]. The exponential $e^{\\lambda t}$ is a basis for the one-dimensional solution space.

This perspective scales. The vector equation $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$ in $\\mathbb{R}^n$ defines a linear operator $L = \\frac{d}{dt} - A$ acting on smooth vector-valued functions. The solution space is its kernel. The dimension of that kernel turns out to be exactly $n$: the same as the matrix size, regardless of the eigenstructure of $A$. Initial conditions $\\mathbf{x}(0) = \\mathbf{x}_0$ pin down a unique element of this $n$-dimensional space.

The qualitative behavior is governed by the eigenvalues of $A$. Real negative eigenvalues yield decaying modes; real positive eigenvalues yield growing modes; zero eigenvalues give conserved quantities (equilibria). When the eigenvalues are real and distinct (the case throughout this chapter), the [[basis-solutions|basis solutions]] are $e^{\\lambda_i t} \\mathbf{v}_i$ where $\\mathbf{v}_i$ is an [[eigenvectors|eigenvector]] for $\\lambda_i$. Every solution is a linear combination of these basis solutions.

The unifying notation is the [[matrix-exponentials|matrix exponential]] $e^{At}$, which generalizes the scalar $e^{\\lambda t}$ to operators. The IVP solution then takes the closed form $\\mathbf{x}(t) = e^{At} \\mathbf{x}_0$, an exact analog of the scalar case. Computing $e^{At}$ efficiently requires [[simple-diagonalization|diagonalization]] when available, leading to the development that occupies the rest of this unit. [[coupled-systems|Coupled systems]], [[higher-order-equations|higher-order equations]], and the [[basis-solutions|fundamental basis theorem]] all flow from this single starting point.
    `.trim(),

    definitions: [
      {
        term: 'First-order linear system',
        body: 'A differential equation $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$ where $A$ is a fixed $n \\times n$ matrix and $\\mathbf{x}(t) \\in \\mathbb{R}^n$ is a vector-valued function of time.',
      },
      {
        term: 'Initial value problem (IVP)',
        body: 'A first-order system $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$ together with a specified value $\\mathbf{x}(0) = \\mathbf{x}_0$. Existence and uniqueness theorems guarantee a unique solution $\\mathbf{x}(t)$ defined for all $t \\in \\mathbb{R}$.',
      },
      {
        term: 'Equilibrium solution',
        body: 'A constant solution $\\mathbf{x}(t) = \\mathbf{x}^*$, satisfied iff $A \\mathbf{x}^* = \\mathbf{0}$. The trivial equilibrium $\\mathbf{x}^* = \\mathbf{0}$ exists for every linear system; nontrivial equilibria exist iff $\\ker(A) \\neq \\{\\mathbf{0}\\}$.',
      },
      {
        term: 'Solution space',
        body: 'The set of all functions $\\mathbf{x}: \\mathbb{R} \\to \\mathbb{R}^n$ satisfying $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$. It is the kernel of the linear operator $L = \\frac{d}{dt} - A$ acting on $C^\\infty(\\mathbb{R}, \\mathbb{R}^n)$, hence a subspace.',
      },
    ],

    theorems: [
      {
        name: 'Solutions form a vector space',
        statement: 'The set of solutions to $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$ is a subspace of $C^\\infty(\\mathbb{R}, \\mathbb{R}^n)$ of dimension $n$.',
        intuition: 'The differential operator $L = \\frac{d}{dt} - A$ is linear: $L(c_1 \\mathbf{x}_1 + c_2 \\mathbf{x}_2) = c_1 L\\mathbf{x}_1 + c_2 L\\mathbf{x}_2$. The solution set is its kernel, and kernels of linear maps are subspaces. Dimension equals $n$ because initial conditions $\\mathbf{x}(0) \\in \\mathbb{R}^n$ parametrize solutions bijectively.',
      },
      {
        name: 'Existence and uniqueness',
        statement: 'For any $\\mathbf{x}_0 \\in \\mathbb{R}^n$, there exists a unique solution $\\mathbf{x}: \\mathbb{R} \\to \\mathbb{R}^n$ to the IVP $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$, $\\mathbf{x}(0) = \\mathbf{x}_0$.',
        intuition: 'The right-hand side $A\\mathbf{x}$ is Lipschitz (with constant $\\|A\\|$), so the standard ODE existence theorem applies globally. Linearity then upgrades local existence to global: solutions never blow up in finite time because their growth is bounded by $\\|e^{At}\\| \\|\\mathbf{x}_0\\|$.',
      },
      {
        name: 'Scalar fundamental solution',
        statement: 'The unique solution of $\\frac{dx}{dt} = \\lambda x$, $x(0) = x_0$ is $x(t) = x_0 e^{\\lambda t}$.',
        intuition: 'This is the prototype the entire chapter generalizes. The character of $\\lambda$ (sign, magnitude) determines whether solutions grow, decay, or stay constant. The eigenvalues of $A$ in the matrix case play the same role for each eigendirection.',
      },
    ],

    keyFormulas: [
      '\\frac{dx}{dt} = \\lambda x \\;\\Longrightarrow\\; x(t) = x_0 e^{\\lambda t}',
      '\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x},\\; \\mathbf{x}(0) = \\mathbf{x}_0 \\;\\Longrightarrow\\; \\mathbf{x}(t) = e^{At} \\mathbf{x}_0',
      'L = \\frac{d}{dt} - A : C^\\infty(\\mathbb{R}, \\mathbb{R}^n) \\to C^\\infty(\\mathbb{R}, \\mathbb{R}^n) \\text{ is linear}',
      '\\dim(\\ker L) = n',
    ],
  },

  explore: {
    vizComponent: 'FirstOrderFlowViz',
    description: 'Interactive 2D phase plane. The user picks a $2 \\times 2$ matrix $A$ from a menu of presets (decaying node, growing node, saddle, center) or sets eigenvalues directly. Initial conditions are placed by clicking; the viz draws the resulting trajectory $\\mathbf{x}(t) = e^{At} \\mathbf{x}_0$ as a streamline. Eigenvector directions are shown as faint axes, and the user can drag a single initial condition along its trajectory to see how time evolution decomposes along eigendirections.',
    misconception: {
      title: 'The solution to $\\dot{\\mathbf{x}} = A\\mathbf{x}$ is "$\\mathbf{x}(t) = A^t \\mathbf{x}_0$"',
      body: `
This is the most common starter confusion, and it usually comes from confusing two different mental models. Discrete dynamical systems (Markov chains, iterated maps) take the form $\\mathbf{x}_{k+1} = A \\mathbf{x}_k$, with solutions $\\mathbf{x}_k = A^k \\mathbf{x}_0$ for integer $k$. Continuous-time linear ODEs $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$ have solutions $\\mathbf{x}(t) = e^{At} \\mathbf{x}_0$, where $t$ is a real number, not an integer. The matrix $A^t$ is not even defined for non-integer $t$ in any natural way; what generalizes the scalar exponential to matrices is the power series $e^{At} = \\sum_{k=0}^{\\infty} \\frac{(At)^k}{k!}$, not the matrix power.

A second confusion is to think the solution space lives in $\\mathbb{R}^n$. It does not. The solution space is a space of functions $\\mathbf{x}: \\mathbb{R} \\to \\mathbb{R}^n$, a subspace of the (infinite-dimensional) function space $C^\\infty(\\mathbb{R}, \\mathbb{R}^n)$. What is $n$-dimensional is the parameterization by initial conditions: each $\\mathbf{x}_0 \\in \\mathbb{R}^n$ gives a distinct solution, and the map $\\mathbf{x}_0 \\mapsto \\mathbf{x}(\\cdot)$ is a vector space isomorphism. Once you internalize this, the connection to [[bases|bases]] and [[basis-solutions|basis solutions]] becomes clear: an initial condition is just a coordinate vector relative to the basis of fundamental solutions.

A third trap involves stability. Students often guess stability from the entries of $A$ rather than from its eigenvalues. The matrix $A = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$ has all entries small, but its eigenvalues are $\\pm i$, giving undamped oscillation rather than decay. The matrix $A = \\begin{pmatrix} 100 & 0 \\\\ 0 & -200 \\end{pmatrix}$ has huge entries, but the second eigenvalue is large and negative, giving fast decay along that direction. Always read stability from eigenvalue real parts, not from matrix entries.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1: Identify the eigenstructure',
        body: 'Solve the IVP $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$ with $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$ and $\\mathbf{x}(0) = (3, 1)^T$. Characteristic polynomial: $(1-\\lambda)^2 - 4 = \\lambda^2 - 2\\lambda - 3 = (\\lambda - 3)(\\lambda + 1)$. Eigenvalues: $\\lambda_1 = 3$, $\\lambda_2 = -1$. Eigenvectors: $\\mathbf{v}_1 = (1, 1)^T$ for $\\lambda_1 = 3$, $\\mathbf{v}_2 = (1, -1)^T$ for $\\lambda_2 = -1$.',
      },
      {
        title: 'Step 2: Decompose the initial condition',
        body: 'Express $\\mathbf{x}_0 = (3, 1)^T$ in the eigenbasis. Solve $c_1 (1,1)^T + c_2 (1,-1)^T = (3, 1)^T$: $c_1 + c_2 = 3$, $c_1 - c_2 = 1$, giving $c_1 = 2$, $c_2 = 1$. So $\\mathbf{x}_0 = 2 \\mathbf{v}_1 + \\mathbf{v}_2$.',
      },
      {
        title: 'Step 3: Evolve each eigencomponent and recombine',
        body: 'Each eigencomponent evolves by its own scalar exponential: $\\mathbf{x}(t) = 2 e^{3t} \\mathbf{v}_1 + e^{-t} \\mathbf{v}_2 = 2 e^{3t} (1,1)^T + e^{-t} (1,-1)^T$. The first component grows like $e^{3t}$; the second decays like $e^{-t}$. As $t \\to \\infty$, the trajectory aligns with the dominant eigenvector $\\mathbf{v}_1$.',
      },
    ],

    problems: [
      {
        id: 'P-7.1a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider $\\frac{d \\mathbf{x}}{dt} = A \\mathbf{x}$ where $A$ is $2 \\times 2$ with distinct real eigenvalues $\\lambda_1 = -2$ and $\\lambda_2 = -5$. Which describes the long-term behavior of solutions?',
        choices: [
          { label: 'A' as const, body: 'All solutions approach the eigenvector for $\\lambda_1 = -2$ since it is "less negative."' },
          { label: 'B' as const, body: 'All solutions decay to zero, with the $\\lambda_2$ component decaying faster.' },
          { label: 'C' as const, body: 'Solutions grow without bound because $\\lambda_1 + \\lambda_2 < 0$.' },
          { label: 'D' as const, body: 'Solutions oscillate with decreasing amplitude.' },
          { label: 'E' as const, body: 'Behavior depends on $\\mathbf{x}(0)$ and cannot be characterized.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The general solution is $\\mathbf{x}(t) = c_1 e^{-2t} \\mathbf{v}_1 + c_2 e^{-5t} \\mathbf{v}_2$. Both exponential factors decay, so $\\mathbf{x}(t) \\to \\mathbf{0}$. The $\\lambda_2 = -5$ component decays faster, so for large $t$ the solution is dominated by $c_1 e^{-2t} \\mathbf{v}_1$ before that too vanishes.',
          partialCredit: 'Choice A captures the dominant direction (the slowest-decaying mode shapes the late-stage behavior) but misses that solutions ultimately approach $\\mathbf{0}$, not a fixed eigenvector. Worth partial credit.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Captures the dominant direction but misses that solutions ultimately go to $\\mathbf{0}$, not to a fixed eigenvector.' },
            { choice: 'C' as const, why: 'Sign confusion: negative eigenvalues mean DECAY, not growth. The "sum of eigenvalues" idea pulled from determinants does not predict growth/decay; the eigenvalue signs do.' },
            { choice: 'D' as const, why: 'Real eigenvalues give pure exponential behavior. Oscillation requires complex eigenvalues.' },
            { choice: 'E' as const, why: 'The qualitative behavior (decay to zero) is the same for every initial condition. Only the rate constants $c_1, c_2$ depend on $\\mathbf{x}(0)$.' },
          ],
        },
      },
      {
        id: 'P-7.1b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Why is the solution space of $\\frac{d \\mathbf{x}}{dt} = A \\mathbf{x}$ a subspace of $C^\\infty(\\mathbb{R}, \\mathbb{R}^n)$?',
        choices: [
          { label: 'A' as const, body: 'Because every solution has the form $e^{At} \\mathbf{x}_0$.' },
          { label: 'B' as const, body: 'Because the differential operator $\\frac{d}{dt} - A$ is linear, so its kernel is a subspace.' },
          { label: 'C' as const, body: 'Because solutions decay to zero.' },
          { label: 'D' as const, body: 'Because the system has $n$ linearly independent solutions.' },
          { label: 'E' as const, body: 'Because $\\mathbf{x}(t) = \\mathbf{0}$ is always a solution.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The solution set is the kernel of the linear operator $L = \\frac{d}{dt} - A$ acting on smooth functions. Kernels of linear operators are always subspaces; this is the structural reason. The "linear differential operator" view unifies all linear ODEs under the same vector-space lens used for matrix kernels.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Describes the form of solutions but not why the set is closed under sums and scalar multiples. The form is a consequence of linearity.' },
            { choice: 'C' as const, why: 'False in general (eigenvalues with positive real part give growing solutions). And even if true, decay does not imply subspace structure.' },
            { choice: 'D' as const, why: 'True, but a consequence of the subspace structure, not its cause.' },
            { choice: 'E' as const, why: 'Necessary (subspaces contain $\\mathbf{0}$) but not sufficient. Closure under linear combinations is what makes the structure work.' },
          ],
        },
      },
      {
        id: 'P-7.1c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For the IVP $\\frac{d \\mathbf{x}}{dt} = A \\mathbf{x}$, $\\mathbf{x}(0) = \\mathbf{x}_0$, the unique solution is $\\mathbf{x}(t) = e^{At} \\mathbf{x}_0$. If $A$ is diagonalizable with $A = V \\Lambda V^{-1}$, this can be rewritten as:',
        choices: [
          { label: 'A' as const, body: '$\\mathbf{x}(t) = V e^{\\Lambda t} V^{-1} \\mathbf{x}_0$' },
          { label: 'B' as const, body: '$\\mathbf{x}(t) = e^{\\Lambda t} \\mathbf{x}_0$' },
          { label: 'C' as const, body: '$\\mathbf{x}(t) = V \\Lambda^t V^{-1} \\mathbf{x}_0$' },
          { label: 'D' as const, body: '$\\mathbf{x}(t) = (V \\Lambda V^{-1})^t \\mathbf{x}_0$' },
          { label: 'E' as const, body: '$\\mathbf{x}(t) = e^{V \\Lambda V^{-1}} \\cdot t \\cdot \\mathbf{x}_0$' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'For diagonalizable $A = V \\Lambda V^{-1}$, the matrix exponential satisfies $e^{At} = V e^{\\Lambda t} V^{-1}$. This works because powers of $A$ pull through the similarity: $A^k = V \\Lambda^k V^{-1}$, and the exponential is a power series. Computing $e^{\\Lambda t}$ is trivial since $\\Lambda$ is diagonal: $e^{\\Lambda t} = \\text{diag}(e^{\\lambda_1 t}, \\ldots, e^{\\lambda_n t})$.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Drops the change-of-basis factors $V$ and $V^{-1}$. This would only be correct if $\\mathbf{x}_0$ were already in eigencoordinates.' },
            { choice: 'C' as const, why: 'Substitutes $\\Lambda^t$ for $e^{\\Lambda t}$. These are only equal when $t$ is an integer (matrix power vs matrix exponential).' },
            { choice: 'D' as const, why: 'Treats matrix exponential as if it were a power; mixes operations.' },
            { choice: 'E' as const, why: 'Uses $t$ as a scalar multiplier outside the matrix exponential, but the time enters inside: $e^{At}$, not $e^A \\cdot t$.' },
          ],
        },
      },
    ],
  },
};
