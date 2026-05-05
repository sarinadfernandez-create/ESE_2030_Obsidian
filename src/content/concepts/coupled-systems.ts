import type { Concept } from '../types';

export const coupledSystems: Concept = {
  id: 'coupled-systems',
  unitId: 'ch7',
  number: '7.2',
  title: 'Coupled First-Order Systems',
  blurb: 'Real systems couple multiple variables. Diagonal systems decouple. The bridge between them is change of basis.',
  tier: 'full',

  learn: {
    overview: `
Real systems rarely evolve in isolation. A predator population depends on its prey; a chemical reactor mixes species that interconvert; the temperatures of adjacent rooms exchange heat. The simplest model of two interacting variables takes the form $\\frac{dx}{dt} = ax + by$, $\\frac{dy}{dt} = cx + dy$. Stacked into a vector equation, this is $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$ with $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$. Unlike the scalar case, no single exponential immediately solves the system; the variables are coupled through the off-diagonal entries of $A$.

Now imagine the matrix were diagonal: $A = \\begin{pmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{pmatrix}$. Then $\\dot{x} = \\lambda_1 x$ and $\\dot{y} = \\lambda_2 y$ are independent scalar ODEs, each solvable by the methods of [[first-order-systems|the previous section]]. The solution is pure exponential growth or decay along each coordinate axis: $x(t) = c_1 e^{\\lambda_1 t}$, $y(t) = c_2 e^{\\lambda_2 t}$. Trivial.

The strategic move is to find a [[change-of-basis|change of basis]] that makes a coupled system look diagonal. If $A$ has $n$ linearly independent [[eigenvectors|eigenvectors]] forming a matrix $V = [\\mathbf{v}_1 | \\cdots | \\mathbf{v}_n]$, then in the eigenbasis $A$ is represented by $\\Lambda = V^{-1} A V$, a diagonal matrix of eigenvalues. The substitution $\\mathbf{y} = V^{-1} \\mathbf{x}$ transforms the system to $\\frac{d\\mathbf{y}}{dt} = \\Lambda \\mathbf{y}$, which decouples into $n$ independent scalar ODEs $\\dot{y}_i = \\lambda_i y_i$. Solve each one (trivial), then transform back: $\\mathbf{x}(t) = V \\mathbf{y}(t)$.

This decoupling-via-eigenbasis is the central idea of [[simple-diagonalization|diagonalization]] for dynamics. It says that every coupled diagonalizable system is, in disguise, a list of independent scalar systems. The coupling lives only in the choice of coordinates; rotate to the right basis and the system simplifies dramatically.

Not every matrix is diagonalizable. When eigenvalues coincide, [[similarity|similar matrices]] may not include a diagonal one (Chapter 8 explores this via Jordan form). When eigenvalues are complex, real diagonalization fails but complex diagonalization still works, with sinusoidal solutions emerging from Euler's formula. This chapter focuses on the cleanest case: $n$ distinct real eigenvalues, where everything works out in $\\mathbb{R}$.
    `.trim(),

    definitions: [
      {
        term: 'Coupled system',
        body: 'A first-order linear system $\\frac{d\\mathbf{x}}{dt} = A \\mathbf{x}$ where $A$ has nonzero off-diagonal entries (in the working basis), so the components of $\\mathbf{x}$ depend on each other.',
      },
      {
        term: 'Decoupled (diagonal) system',
        body: 'A first-order system where $A$ is diagonal, $A = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$. The components evolve independently: $\\dot{x}_i = \\lambda_i x_i$ for each $i$, with solutions $x_i(t) = x_i(0) e^{\\lambda_i t}$.',
      },
      {
        term: 'Eigenbasis (modal) coordinates',
        body: 'Coordinates $\\mathbf{y} = V^{-1} \\mathbf{x}$ where $V$ has the eigenvectors of $A$ as columns. In these coordinates, the system becomes diagonal: $\\frac{d\\mathbf{y}}{dt} = \\Lambda \\mathbf{y}$.',
      },
    ],

    theorems: [
      {
        name: 'Diagonalization decouples',
        statement: 'If $A = V \\Lambda V^{-1}$ is diagonalizable, then $\\frac{d\\mathbf{x}}{dt} = A\\mathbf{x}$ becomes $\\frac{d\\mathbf{y}}{dt} = \\Lambda \\mathbf{y}$ under the substitution $\\mathbf{y} = V^{-1} \\mathbf{x}$.',
        intuition: 'Differentiating $\\mathbf{y} = V^{-1} \\mathbf{x}$ gives $\\dot{\\mathbf{y}} = V^{-1} \\dot{\\mathbf{x}} = V^{-1} A \\mathbf{x} = V^{-1} A V \\mathbf{y} = \\Lambda \\mathbf{y}$. The matrix $V^{-1}$ is constant, so it pulls through the derivative cleanly. The eigenbasis is exactly the coordinate system in which the dynamics are simplest.',
      },
      {
        name: 'Modal solution',
        statement: 'If $A$ is diagonalizable with eigenpairs $(\\lambda_i, \\mathbf{v}_i)$ and $\\mathbf{x}_0 = \\sum_i c_i \\mathbf{v}_i$, then $\\mathbf{x}(t) = \\sum_i c_i e^{\\lambda_i t} \\mathbf{v}_i$.',
        intuition: 'Each eigenvector contributes a "mode" that evolves at its own rate $e^{\\lambda_i t}$. The full solution superposes these modes. The coefficients $c_i$ are the eigenbasis coordinates of the initial condition; they say how much of each mode the initial state contains.',
      },
      {
        name: 'Conservation laws from zero eigenvalues',
        statement: 'If $0$ is an eigenvalue of $A$ with eigenvector $\\mathbf{w}$ in $\\ker(A^T)$, then $\\mathbf{w}^T \\mathbf{x}(t)$ is constant along every solution trajectory.',
        intuition: 'If $A^T \\mathbf{w} = \\mathbf{0}$, then $\\frac{d}{dt}(\\mathbf{w}^T \\mathbf{x}) = \\mathbf{w}^T A \\mathbf{x} = (A^T \\mathbf{w})^T \\mathbf{x} = 0$. Zero eigenvalues correspond to conserved quantities. In a chemical reaction network, conservation of mass; in a closed thermal system, conservation of energy.',
      },
    ],

    keyFormulas: [
      'A = V \\Lambda V^{-1} \\;\\Longrightarrow\\; \\dot{\\mathbf{y}} = \\Lambda \\mathbf{y} \\text{ where } \\mathbf{y} = V^{-1} \\mathbf{x}',
      '\\mathbf{x}(t) = \\sum_{i=1}^n c_i e^{\\lambda_i t} \\mathbf{v}_i \\text{ with } \\mathbf{x}_0 = \\sum_i c_i \\mathbf{v}_i',
      '\\mathbf{x}(t) = V e^{\\Lambda t} V^{-1} \\mathbf{x}_0',
    ],
  },

  explore: {
    vizComponent: 'CoupledDecouplingViz',
    description: 'Side-by-side phase planes. Left panel shows the coupled system $\\dot{\\mathbf{x}} = A\\mathbf{x}$ in standard coordinates with curving trajectories; right panel shows the same dynamics in eigenbasis coordinates $\\dot{\\mathbf{y}} = \\Lambda \\mathbf{y}$ where trajectories are pure horizontal/vertical exponential decays/growths. A slider rotates a "coordinate frame" overlay between the two views, visualizing the change of basis. The user can drag initial conditions in either panel and see the trajectory in both.',
    misconception: {
      title: '"Coupled" means inherent complexity, not coordinate choice',
      body: `
The most common misconception is that some systems are intrinsically more complicated than others because the variables "depend on each other." This perspective treats coupling as a property of the system. It is not. Coupling is a property of the coordinate system you happen to use. The same dynamics, written in a different basis, can look fully coupled or fully decoupled. Diagonalizability is exactly the question of whether a basis exists in which the coupling vanishes entirely.

A second confusion is to apply diagonalization in the wrong direction. Students sometimes write $\\dot{\\mathbf{y}} = V^{-1} \\Lambda V \\mathbf{y}$ instead of $\\dot{\\mathbf{y}} = \\Lambda \\mathbf{y}$, mixing up which side $V$ and $V^{-1}$ go on. The clean way to remember it: starting from $\\dot{\\mathbf{x}} = A \\mathbf{x}$, substitute $\\mathbf{x} = V \\mathbf{y}$ (so $\\mathbf{y}$ is in the new coordinates). Then $V \\dot{\\mathbf{y}} = A V \\mathbf{y}$, hence $\\dot{\\mathbf{y}} = V^{-1} A V \\mathbf{y} = \\Lambda \\mathbf{y}$. The $V^{-1}$ multiplies on the left because that is what you do to isolate $\\dot{\\mathbf{y}}$.

A third trap: assuming all coupled systems are diagonalizable. Diagonalizability requires $n$ linearly independent eigenvectors, which fails when geometric multiplicity is less than algebraic multiplicity. Repeated eigenvalues are warning signs (though not a death sentence: identity matrices are diagonalizable with repeated eigenvalues; defective matrices are not). When diagonalization fails, you need [[jordan-form|Jordan canonical form]] from Chapter 8. For the systems studied in this chapter, the assumption of distinct real eigenvalues guarantees diagonalizability and avoids this complication.

Finally: a decoupled system in eigenbasis coordinates does not mean the original variables are independent. The original $x_1$ and $x_2$ are still linked through the change-of-basis matrix $V$. If $\\mathbf{v}_1 = (1,1)^T$ and $\\mathbf{v}_2 = (1,-1)^T$, then the modal solutions $y_1(t), y_2(t)$ are independent, but $x_1(t) = y_1(t) + y_2(t)$ and $x_2(t) = y_1(t) - y_2(t)$ are linear combinations of the same modes.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1: Diagonalize',
        body: 'Solve $\\dot{\\mathbf{x}} = A\\mathbf{x}$ with $A = \\begin{pmatrix} -1 & 2 \\\\ 2 & -1 \\end{pmatrix}$, $\\mathbf{x}(0) = (1, 0)^T$. Eigenvalues: characteristic polynomial $(-1-\\lambda)^2 - 4 = 0$, so $\\lambda = -1 \\pm 2$, giving $\\lambda_1 = 1$, $\\lambda_2 = -3$. Eigenvectors: $\\mathbf{v}_1 = (1,1)^T$ for $\\lambda_1 = 1$; $\\mathbf{v}_2 = (1,-1)^T$ for $\\lambda_2 = -3$.',
      },
      {
        title: 'Step 2: Switch to modal coordinates',
        body: 'Set $V = \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$, so $V^{-1} = \\frac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$. The modal coordinates of $\\mathbf{x}_0 = (1,0)^T$ are $V^{-1} \\mathbf{x}_0 = (1/2, 1/2)^T$. So in modal coordinates: $y_1(0) = 1/2$, $y_2(0) = 1/2$.',
      },
      {
        title: 'Step 3: Evolve and transform back',
        body: 'In modal coordinates: $y_1(t) = (1/2) e^{t}$, $y_2(t) = (1/2) e^{-3t}$. Transform back: $\\mathbf{x}(t) = V \\mathbf{y}(t) = (1/2) e^{t} (1,1)^T + (1/2) e^{-3t} (1,-1)^T$. Components: $x_1(t) = \\frac{1}{2}(e^t + e^{-3t})$, $x_2(t) = \\frac{1}{2}(e^t - e^{-3t})$. The growing mode dominates as $t \\to \\infty$; trajectory aligns with $\\mathbf{v}_1$.',
      },
    ],

    problems: [
      {
        id: 'P-7.2a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A coupled system $\\frac{d \\mathbf{x}}{dt} = A \\mathbf{x}$ becomes decoupled when expressed in which basis?',
        choices: [
          { label: 'A' as const, body: 'The standard basis.' },
          { label: 'B' as const, body: 'Any orthonormal basis.' },
          { label: 'C' as const, body: 'The eigenbasis of $A$ (assuming $A$ is diagonalizable).' },
          { label: 'D' as const, body: 'A basis of unit vectors.' },
          { label: 'E' as const, body: 'No basis decouples a coupled system.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'In the eigenbasis $V = [\\mathbf{v}_1 \\,|\\, \\cdots \\,|\\, \\mathbf{v}_n]$, the matrix $A$ becomes diagonal: $V^{-1} A V = \\Lambda$. Setting $\\mathbf{y} = V^{-1} \\mathbf{x}$ gives $\\frac{d \\mathbf{y}}{dt} = \\Lambda \\mathbf{y}$, which is $n$ independent scalar ODEs $\\dot{y}_i = \\lambda_i y_i$. Solve them separately, then transform back.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The standard basis is generally not the eigenbasis. The coupling in the standard basis is exactly what we are trying to remove.' },
            { choice: 'B' as const, why: 'Orthonormality alone does not diagonalize $A$. You need the basis to consist of eigenvectors. (For symmetric $A$, the eigenbasis CAN be chosen orthonormal, which combines both properties.)' },
            { choice: 'D' as const, why: 'Unit vectors do nothing special. The directions matter, not the lengths.' },
            { choice: 'E' as const, why: 'Diagonalizable matrices DO decouple in the eigenbasis. This is the entire reason eigenvectors matter for ODEs.' },
          ],
        },
      },
      {
        id: 'P-7.2b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A $2 \\times 2$ matrix $A$ has eigenvalues $\\lambda_1 = 3$, $\\lambda_2 = 1/2$ with eigenvectors $\\mathbf{v}_1 = (1,1)^T$, $\\mathbf{v}_2 = (1,-1)^T$. As $k \\to \\infty$, the matrix $A^k$ exhibits which behavior?',
        choices: [
          { label: 'A' as const, body: '$A^k \\to 0$ since the average eigenvalue is less than 2.' },
          { label: 'B' as const, body: '$A^k$ grows because $\\lambda_1 > 1$, with the dominant direction $\\mathbf{v}_1$.' },
          { label: 'C' as const, body: '$\\frac{1}{3^k} A^k$ approaches a rank-1 projection onto $\\text{span}(\\mathbf{v}_1)$.' },
          { label: 'D' as const, body: 'Both B and C.' },
          { label: 'E' as const, body: '$A^k$ oscillates because the eigenvalues have different magnitudes.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'Diagonalize: $A^k = V \\Lambda^k V^{-1}$ with $\\Lambda^k = \\text{diag}(3^k, (1/2)^k)$. Since $|3| > |1/2|$, the $3^k$ term dominates as $k \\to \\infty$, so $A^k$ grows along $\\mathbf{v}_1$. Normalizing by $3^k$: $\\frac{1}{3^k} A^k = V \\, \\text{diag}(1, (1/6)^k) \\, V^{-1} \\to V \\, \\text{diag}(1, 0) \\, V^{-1}$, the rank-1 projection onto $\\text{span}(\\mathbf{v}_1)$ along $\\mathbf{v}_2$. Both descriptions are valid.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Averages of eigenvalues do not predict matrix-power behavior. The DOMINANT eigenvalue (largest in absolute value) determines growth.' },
            { choice: 'B' as const, why: 'True on its own, but (C) is also true and complementary. They describe the same phenomenon.' },
            { choice: 'C' as const, why: 'True on its own, but (B) is also true.' },
            { choice: 'E' as const, why: 'Different magnitudes do NOT cause oscillation; oscillation comes from negative real or complex eigenvalues. Here both eigenvalues are positive reals.' },
          ],
        },
      },
    ],
  },
};
