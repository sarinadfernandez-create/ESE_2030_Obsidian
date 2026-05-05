import type { Concept } from '../types';

export const matrixExponentials: Concept = {
  id: 'matrix-exponentials',
  unitId: 'ch7',
  number: '7.5',
  title: 'Matrix Exponentials',
  blurb: 'The operator generalizing scalar exponentials to matrices, defined by power series, computed via diagonalization.',
  tier: 'full',

  learn: {
    overview: `
The scalar exponential $e^{\\lambda t}$ solves the scalar ODE $\\dot{x} = \\lambda x$. The matrix exponential $e^{At}$ plays the same role for the vector ODE $\\dot{\\mathbf{x}} = A \\mathbf{x}$. Defining it requires a leap from scalar to operator: there is no "$e$ raised to a matrix" in the elementary sense, so we generalize via the power series.

The defining series is $e^A = \\sum_{k=0}^{\\infty} \\frac{A^k}{k!} = I + A + \\frac{A^2}{2!} + \\frac{A^3}{3!} + \\cdots$, an absolutely convergent series for any square matrix $A$. Every term is a matrix; the partial sums converge entrywise. The result is again a square matrix the same size as $A$. This is the structural analog of the scalar Taylor series for $e^x$, except the powers are now matrix products.

The matrix exponential inherits many (but not all) properties of the scalar version. It is always invertible, with $(e^A)^{-1} = e^{-A}$, because $A$ and $-A$ commute. Its determinant is $\\det(e^A) = e^{\\text{tr}(A)}$, never zero. It satisfies the time derivative $\\frac{d}{dt} e^{At} = A e^{At} = e^{At} A$, the property that makes $\\mathbf{x}(t) = e^{At} \\mathbf{x}_0$ solve the linear ODE. It satisfies the one-parameter group law $e^{A(s+t)} = e^{As} e^{At}$, which says solutions composed in time are equivalent to a single longer evolution.

The crucial property the matrix exponential does NOT inherit: $e^{A+B} = e^A e^B$ holds in general only when $A$ and $B$ commute. For non-commuting matrices, $e^{A+B}$ is NOT equal to $e^A e^B$ (in general); the correction is captured by the [[BCH-formula|Baker-Campbell-Hausdorff formula]]. This is the chief difference between scalar and matrix exponentials, and a frequent source of error.

Direct computation from the series is rarely practical. Instead, exploit structure. For diagonal $A = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$, the exponential is $e^{At} = \\text{diag}(e^{\\lambda_1 t}, \\ldots, e^{\\lambda_n t})$, computable componentwise. For [[simple-diagonalization|diagonalizable]] $A = V \\Lambda V^{-1}$, conjugation pulls through the series: $e^{At} = V e^{\\Lambda t} V^{-1}$. Eigenvalues control the qualitative behavior of solutions: eigenvalues with negative real parts give decaying modes, positive real parts give growing modes, and (in Chapter 8) imaginary parts give oscillation. The matrix exponential is the bridge from algebraic structure (eigenvalues) to dynamic behavior (growth, decay, oscillation), making it the central object for solving linear ODE systems.
    `.trim(),

    definitions: [
      {
        term: 'Matrix exponential',
        body: 'For a square matrix $A$, the matrix exponential is $e^A = \\sum_{k=0}^{\\infty} \\frac{A^k}{k!}$, an absolutely convergent series. The matrix $e^{At}$ as a function of $t$ is the unique solution to $\\frac{d}{dt} M(t) = A M(t)$ with $M(0) = I$.',
      },
      {
        term: 'One-parameter group',
        body: 'The family $\\{e^{At}\\}_{t \\in \\mathbb{R}}$ is a one-parameter group: $e^{A(s+t)} = e^{As} e^{At}$ for all $s, t$, with $e^{A \\cdot 0} = I$ and $(e^{At})^{-1} = e^{-At}$.',
      },
      {
        term: 'Fundamental matrix',
        body: 'A matrix $\\Phi(t)$ whose columns form a basis for the solution space of $\\dot{\\mathbf{x}} = A\\mathbf{x}$. The matrix exponential $e^{At}$ is the fundamental matrix normalized so that $\\Phi(0) = I$; the general solution is then $\\mathbf{x}(t) = \\Phi(t) \\mathbf{x}_0$.',
      },
    ],

    theorems: [
      {
        name: 'Matrix exponential solves the IVP',
        statement: 'The unique solution to $\\frac{d\\mathbf{x}}{dt} = A\\mathbf{x}$, $\\mathbf{x}(0) = \\mathbf{x}_0$ is $\\mathbf{x}(t) = e^{At} \\mathbf{x}_0$.',
        intuition: 'Differentiate the series term-by-term: $\\frac{d}{dt}\\sum_k \\frac{(At)^k}{k!} \\mathbf{x}_0 = \\sum_k \\frac{k A^k t^{k-1}}{k!} \\mathbf{x}_0 = A \\sum_j \\frac{(At)^j}{j!} \\mathbf{x}_0 = A e^{At} \\mathbf{x}_0$. The initial value matches because $e^{A \\cdot 0} = I$. Uniqueness comes from the existence-uniqueness theorem.',
      },
      {
        name: 'Diagonalizable case',
        statement: 'If $A = V \\Lambda V^{-1}$ is diagonalizable, then $e^{At} = V e^{\\Lambda t} V^{-1}$ where $e^{\\Lambda t} = \\text{diag}(e^{\\lambda_1 t}, \\ldots, e^{\\lambda_n t})$.',
        intuition: 'Powers pull through similarity: $A^k = V \\Lambda^k V^{-1}$. Substituting into the series and factoring $V, V^{-1}$ outside the sum gives the identity. The $V V^{-1}$ pairs telescope, leaving the eigenvalue series for each diagonal entry, which is just the scalar exponential.',
      },
      {
        name: 'Determinant identity',
        statement: 'For any square matrix $A$, $\\det(e^A) = e^{\\text{tr}(A)}$.',
        intuition: 'In the eigenbasis, $A$ becomes diagonal with eigenvalues $\\lambda_i$; the trace is $\\sum \\lambda_i$, and $\\det(e^\\Lambda) = \\prod e^{\\lambda_i} = e^{\\sum \\lambda_i} = e^{\\text{tr}(\\Lambda)}$. Trace and determinant are similarity-invariants, so the formula holds for any $A$. A consequence: $e^{At}$ is invertible for all $t$ since the right side is positive.',
      },
      {
        name: 'Non-commuting matrices break $e^{A+B} = e^A e^B$',
        statement: 'If $AB \\neq BA$, then in general $e^{A+B} \\neq e^A e^B$. The product formula holds when $A$ and $B$ commute.',
        intuition: 'Expanding $e^A e^B$ via series and matching with $e^{A+B}$ requires shuffling factors of $A$ and $B$ past each other, which only succeeds when they commute. The mismatch starts at order 2: $\\frac{(A+B)^2}{2} = \\frac{A^2 + AB + BA + B^2}{2}$ vs. $\\frac{A^2}{2} + AB + \\frac{B^2}{2}$ from $e^A e^B$, which agree only when $AB = BA$.',
      },
    ],

    keyFormulas: [
      'e^A = \\sum_{k=0}^{\\infty} \\frac{A^k}{k!}',
      'A = V\\Lambda V^{-1} \\;\\Longrightarrow\\; e^{At} = V e^{\\Lambda t} V^{-1}',
      '\\frac{d}{dt} e^{At} = A e^{At}, \\quad e^{A \\cdot 0} = I',
      '(e^A)^{-1} = e^{-A}, \\quad \\det(e^A) = e^{\\text{tr}(A)}',
      'e^{A(s+t)} = e^{As} e^{At}',
    ],
  },

  explore: {
    vizComponent: 'MatrixExponentialFlowViz',
    description: 'A 2D phase plane with a draggable initial condition $\\mathbf{x}_0$. The viz traces the flow $\\mathbf{x}(t) = e^{At} \\mathbf{x}_0$ as $t$ varies via a slider. A side panel shows the eigenstructure of $A$ and animates the same flow in eigencoordinates, where it reduces to two independent scalar exponentials. The user picks $A$ from presets (stable node, saddle, degenerate node) or sets eigenvalues directly. A "snapshot" toggle overlays multiple time steps to visualize the full trajectory at once.',
    misconception: {
      title: 'The matrix exponential is computed by exponentiating each entry',
      body: `
This is the most catastrophic misconception in the entire chapter. The matrix exponential of $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ is NOT $\\begin{pmatrix} e^a & e^b \\\\ e^c & e^d \\end{pmatrix}$. The matrix exponential is defined by the power series, not by entrywise exponentiation. The two operations agree only for diagonal matrices, where the off-diagonal terms vanish in every power. For non-diagonal matrices, entrywise exponentiation gives nonsense that does not even satisfy basic identities like $e^A e^{-A} = I$.

The right computational mental model: diagonalize first, then exponentiate the eigenvalues, then transform back. For $A = V \\Lambda V^{-1}$: compute $\\Lambda$ (a diagonal matrix of eigenvalues); compute $e^{\\Lambda t}$ (entrywise exponentiation IS valid here, because $\\Lambda$ is diagonal); compute $e^{At} = V e^{\\Lambda t} V^{-1}$. The change-of-basis factors $V, V^{-1}$ cannot be skipped.

A second confusion: $e^{A+B} = e^A e^B$ in general. This identity is true for scalars and for commuting matrices, but FALSE in general. The matrices $A = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ and $B = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$ do not commute (compute $AB$ and $BA$), and $e^{A+B}, e^A e^B$, and $e^B e^A$ are three different matrices. Pay attention to commutation before splitting exponentials.

A third subtle issue: the matrix $e^A$ is invertible even when $A$ is singular. Singular $A$ has 0 as an eigenvalue, but the eigenvalue of $e^A$ is $e^0 = 1$, which is not zero. So $\\det(e^A) = e^{\\text{tr}(A)}$ is positive regardless of whether $A$ is singular. This is the algebraic reason solutions to $\\dot{\\mathbf{x}} = A\\mathbf{x}$ are uniquely determined by initial conditions: the propagator $e^{At}$ is always invertible, so the map $\\mathbf{x}_0 \\mapsto \\mathbf{x}(t)$ is a bijection on $\\mathbb{R}^n$ for every $t$.

A fourth pitfall: confusing the time derivative $\\frac{d}{dt} e^{At} = A e^{At}$ with $\\frac{d}{dt} e^{At} = A$ (treating $e^{At}$ as if it were $At$). The derivative of $e^{At}$ is $A e^{At}$, NOT $A$. This is exactly the relationship that makes $e^{At} \\mathbf{x}_0$ solve the ODE: when you differentiate, you get back $A$ times the original, satisfying $\\dot{\\mathbf{x}} = A \\mathbf{x}$.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1: Diagonalize',
        body: 'Compute $e^{At}$ for $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 2 \\end{pmatrix}$. Eigenvalues from $\\det(A - \\lambda I) = (1-\\lambda)(2-\\lambda) = 0$: $\\lambda_1 = 1$, $\\lambda_2 = 2$. Eigenvectors: $\\mathbf{v}_1 = (1, 0)^T$ for $\\lambda_1$; $(A - 2I)\\mathbf{v} = 0$ gives $\\mathbf{v}_2 = (1, 1)^T$ for $\\lambda_2$. Set $V = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$, $V^{-1} = \\begin{pmatrix} 1 & -1 \\\\ 0 & 1 \\end{pmatrix}$.',
      },
      {
        title: 'Step 2: Exponentiate the diagonal',
        body: '$e^{\\Lambda t} = \\begin{pmatrix} e^t & 0 \\\\ 0 & e^{2t} \\end{pmatrix}$. This step is trivial because $\\Lambda$ is diagonal; entrywise exponentiation works for diagonal matrices.',
      },
      {
        title: 'Step 3: Reassemble',
        body: '$e^{At} = V e^{\\Lambda t} V^{-1} = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} e^t & 0 \\\\ 0 & e^{2t} \\end{pmatrix} \\begin{pmatrix} 1 & -1 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} e^t & e^{2t} - e^t \\\\ 0 & e^{2t} \\end{pmatrix}$. Check: at $t = 0$ this gives $I$ ✓. Differentiate and verify $\\frac{d}{dt} e^{At} = A e^{At}$ ✓.',
      },
    ],

    problems: [
      {
        id: 'P-7.5a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $A$ be a singular $n \\times n$ matrix ($\\det A = 0$). Which statement about $e^A$ is correct?',
        choices: [
          { label: 'A' as const, body: '$e^A$ is also singular, since the exponential preserves singularity.' },
          { label: 'B' as const, body: '$e^A$ is invertible with $(e^A)^{-1} = e^{-A}$.' },
          { label: 'C' as const, body: '$e^A = I$.' },
          { label: 'D' as const, body: '$\\det(e^A) = 0$ since $\\det(A) = 0$.' },
          { label: 'E' as const, body: 'Whether $e^A$ is invertible depends on the entries of $A$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The matrix exponential is ALWAYS invertible, regardless of $A$. From the power series, $A$ and $-A$ commute, so $e^A e^{-A} = e^{A - A} = e^0 = I$. Hence $(e^A)^{-1} = e^{-A}$. Even better: $\\det(e^A) = e^{\\text{tr}(A)} > 0$ for any real $A$, so $e^A$ never has zero determinant.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The exponential FIXES singularity rather than preserving it. Singular $A$ has zero eigenvalues, but $e^A$ has eigenvalues $e^0 = 1$, which are nonzero.' },
            { choice: 'C' as const, why: 'Only true when $A = 0$. A general singular matrix has $e^A \\neq I$.' },
            { choice: 'D' as const, why: 'Confuses the formula $\\det(e^A) = e^{\\text{tr}(A)}$ with $\\det(e^A) = e^{\\det A}$. The trace appears in the determinant of an exponential, not the determinant.' },
            { choice: 'E' as const, why: 'Invertibility of $e^A$ is universal, not entry-dependent.' },
          ],
        },
      },
      {
        id: 'P-7.5b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For an $n \\times n$ matrix $A$, which property of $e^{At}$ holds for all real $t$?',
        choices: [
          { label: 'A' as const, body: '$e^{At}$ is symmetric for all $t$.' },
          { label: 'B' as const, body: '$e^{A(t+s)} = e^{At} e^{As}$ for all $s, t$.' },
          { label: 'C' as const, body: '$e^{At}$ is orthogonal.' },
          { label: 'D' as const, body: '$\\det(e^{At}) = t \\cdot \\det(A)$.' },
          { label: 'E' as const, body: '$\\frac{d}{dt} e^{At} = A$, independent of $t$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Since $At$ and $As$ commute (both are scalar multiples of $A$), the exponential satisfies the group law $e^{At} e^{As} = e^{A(t+s)}$. This is exactly what makes $\\{e^{At}\\}_{t \\in \\mathbb{R}}$ a one-parameter group: composition in $t$ corresponds to addition.',
          trickAnalysis: [
            { choice: 'A' as const, why: '$e^{At}$ is symmetric only when $A$ is symmetric (since $(e^{At})^T = e^{A^T t}$).' },
            { choice: 'C' as const, why: '$e^{At}$ is orthogonal only when $A$ is skew-symmetric ($A^T = -A$).' },
            { choice: 'D' as const, why: 'Confuses determinant rule. Correct: $\\det(e^{At}) = e^{t \\cdot \\text{tr}(A)}$, not $t \\cdot \\det(A)$.' },
            { choice: 'E' as const, why: 'Correct derivative is $\\frac{d}{dt} e^{At} = A e^{At}$, which DOES depend on $t$ through $e^{At}$.' },
          ],
        },
      },
      {
        id: 'P-7.5c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $A$ have eigenvalues $\\lambda_1 = 2, \\lambda_2 = -1$ with eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$. Which describes $e^{At}$?',
        choices: [
          { label: 'A' as const, body: '$e^{At} = e^{2t} I + e^{-t} I$.' },
          { label: 'B' as const, body: '$e^{At} = V \\, \\text{diag}(e^{2t}, e^{-t}) \\, V^{-1}$ where $V = [\\mathbf{v}_1 \\,|\\, \\mathbf{v}_2]$.' },
          { label: 'C' as const, body: '$e^{At}$ has eigenvalues $e^{2t}, e^{-t}$ but different eigenvectors than $A$.' },
          { label: 'D' as const, body: '$e^{At} = \\text{diag}(e^{2t}, e^{-t})$ since $A$ is diagonalizable.' },
          { label: 'E' as const, body: '$e^{At}$ cannot be written without computing the entries of $A$ explicitly.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'For diagonalizable $A = V \\Lambda V^{-1}$, the matrix exponential is $e^{At} = V e^{\\Lambda t} V^{-1}$ with $e^{\\Lambda t} = \\text{diag}(e^{\\lambda_i t})$. The eigenvectors of $e^{At}$ are the SAME as those of $A$: if $A \\mathbf{v} = \\lambda \\mathbf{v}$, then $A^k \\mathbf{v} = \\lambda^k \\mathbf{v}$ for any power, hence the exponential power series gives $e^{At} \\mathbf{v} = e^{\\lambda t} \\mathbf{v}$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Adds exponentials of eigenvalues with $I$ factors. This is not how matrix exponentials of diagonalizable matrices work.' },
            { choice: 'C' as const, why: 'Eigenvectors are PRESERVED under matrix exponentiation. If $A \\mathbf{v} = \\lambda \\mathbf{v}$, then $e^{At} \\mathbf{v} = e^{\\lambda t} \\mathbf{v}$.' },
            { choice: 'D' as const, why: 'Confuses $e^{At}$ with $e^{\\Lambda t}$. They are equal only if $A$ is already diagonal in the working basis.' },
            { choice: 'E' as const, why: 'The eigenvalues and eigenvectors fully determine $e^{At}$; entries of $A$ are not needed.' },
          ],
        },
      },
    ],
  },
};
