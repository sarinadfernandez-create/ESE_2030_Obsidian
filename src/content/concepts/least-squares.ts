import type { Concept } from '../types';

export const leastSquares: Concept = {
  id: 'least-squares',
  unitId: 'ch6',
  number: '6.4',
  title: 'Least Squares',
  blurb: 'When $Ax = b$ has no exact solution, find the $x$ minimizing $\\|Ax - b\\|$.',
  tier: 'full',

  learn: {
    overview: `
The system $Ax = b$ for $A \\in \\mathbb{R}^{m \\times n}$ might have:
- A unique solution (when $A$ is square and invertible),
- Infinitely many solutions (when $A$ has nontrivial kernel and $b \\in \\text{im}(A)$),
- **No solution at all** (when $b \\notin \\text{im}(A)$).

The third case is common in practice — overdetermined systems with more equations than unknowns ($m > n$), arising in data fitting, regression, signal processing, and almost any "fit a model to messy data" problem. Even though no $x$ exactly satisfies $Ax = b$, we can find the *best approximation*: the $x$ that minimizes the residual $\\|Ax - b\\|$.

This is the **least-squares problem**:

$$\\hat{x} = \\arg\\min_{x \\in \\mathbb{R}^n} \\|Ax - b\\|^2.$$

The squared norm makes the optimization smooth (no absolute values), and the result is a quadratic optimization problem with a closed-form solution.

**Geometric solution.** The set $\\{Ax : x \\in \\mathbb{R}^n\\}$ is exactly the [[image-and-kernel|column space]] $\\text{im}(A)$ — the subspace of $\\mathbb{R}^m$ reachable by $A$. So minimizing $\\|Ax - b\\|$ over all $x$ is the same as minimizing $\\|y - b\\|$ over all $y$ in $\\text{im}(A)$. By the [[orthogonal-projections|best-approximation theorem]], the minimum is achieved when $y$ is the [[orthogonal-projections|orthogonal projection]] of $b$ onto $\\text{im}(A)$:

$$y^* = \\Pi_{\\text{im}(A)}(b).$$

So the least-squares solution $\\hat{x}$ is any $x$ with $A \\hat{x} = y^* = \\Pi_{\\text{im}(A)}(b)$. The residual $r = b - A\\hat{x}$ lies in $\\text{im}(A)^\\perp = \\ker(A^T)$ (the [[geometric-fundamental-theorem|left null space]]).

**Normal equations.** The condition $r \\in \\ker(A^T)$ becomes $A^T r = 0$, i.e.,

$$A^T (b - A\\hat{x}) = 0 \\quad \\Longleftrightarrow \\quad A^T A \\hat{x} = A^T b.$$

This is the **normal equations** — a square linear system in $\\hat{x}$. When $A$ has full column rank (rank $n$), $A^T A$ is invertible, and the solution is

$$\\hat{x} = (A^T A)^{-1} A^T b.$$

The matrix $A^\\dagger = (A^T A)^{-1} A^T$ is the **[[svd-form|pseudoinverse]]** (or Moore-Penrose pseudoinverse) of $A$ for full-column-rank tall matrices.

**Why "least squares"?** The objective $\\|Ax - b\\|^2 = \\sum_i (a_i^T x - b_i)^2$ is the sum of squared residuals — the sum of squared "errors" between the predicted $a_i^T x$ and the observed $b_i$. Minimizing this is the linear-algebra version of fitting a line / plane / hyperplane to data so that the *squared* errors are as small as possible.

**Connection to QR.** When $A = Q R$ with $Q$ having orthonormal columns and $R$ upper triangular (the [[qr-decomposition|reduced QR decomposition]]), the normal equations simplify dramatically. $A^T A = R^T Q^T Q R = R^T R$, and $A^T b = R^T Q^T b$, so the normal equations become $R^T R \\hat{x} = R^T Q^T b$, equivalently $R \\hat{x} = Q^T b$ (since $R^T$ is invertible). This is an upper-triangular system solved by back substitution. **Computing least squares via QR is more numerically stable than computing via the normal equations directly** — the normal-equations approach can amplify roundoff error when $A^T A$ is ill-conditioned.

**Statistical interpretation.** If $b = Ax + \\varepsilon$ with $\\varepsilon$ being independent zero-mean Gaussian noise, then $\\hat{x} = (A^T A)^{-1} A^T b$ is the **maximum likelihood estimator** of $x$. This is one of the deep reasons least squares is the canonical fitting procedure in statistics — it's optimal under a Gaussian-noise assumption, and approximately optimal under many weaker conditions.

**When $A$ does NOT have full column rank.** If $\\text{rank}(A) < n$, the normal equations $A^T A \\hat{x} = A^T b$ have multiple solutions (the kernel of $A^T A$ equals the kernel of $A$, which is nontrivial). The least-squares "solution" is no longer unique. The conventional choice is the **minimum-norm least-squares solution** — among all $x$ that minimize $\\|Ax - b\\|$, pick the one with smallest $\\|x\\|$. This is given by the [[svd-form|SVD-based pseudoinverse]], which handles the rank-deficient case automatically.
    `.trim(),

    definitions: [
      {
        term: 'Least-squares solution',
        body: 'For an overdetermined system $A x = b$: the vector $\\hat{x}$ minimizing $\\|A x - b\\|^2$. Found by solving the normal equations $A^T A \\hat{x} = A^T b$.',
      },
      {
        term: 'Normal equations',
        body: '$A^T A \\hat{x} = A^T b$. The square linear system whose solutions are exactly the least-squares solutions of $Ax = b$.',
      },
      {
        term: 'Residual',
        body: 'For a least-squares solution: $r = b - A\\hat{x}$. Lies in $\\ker(A^T)$ (the left null space).',
      },
      {
        term: 'Pseudoinverse',
        body: 'For a full-column-rank tall matrix $A$: $A^\\dagger = (A^T A)^{-1} A^T$. The matrix that gives $\\hat{x} = A^\\dagger b$ as the least-squares solution.',
      },
    ],

    theorems: [
      {
        name: 'Existence of least-squares solution',
        statement: 'For any $A \\in \\mathbb{R}^{m \\times n}$ and $b \\in \\mathbb{R}^m$, the least-squares problem $\\min_x \\|Ax - b\\|$ has at least one solution. The solution is unique iff $A$ has full column rank.',
        intuition: 'The minimum exists because $\\|Ax - b\\|^2$ is a continuous function bounded below, and the minimum is achieved at any $x$ with $Ax = \\Pi_{\\text{im}(A)}(b)$. Uniqueness fails when $\\ker(A) \\neq \\{0\\}$ — adding any kernel vector to $\\hat{x}$ gives another minimizer.',
      },
      {
        name: 'Normal equations characterize least-squares solutions',
        statement: '$\\hat{x}$ minimizes $\\|Ax - b\\|^2$ if and only if $A^T A \\hat{x} = A^T b$.',
        intuition: 'The minimum is where the gradient $\\nabla_x \\|Ax - b\\|^2 = 2 A^T (Ax - b)$ vanishes. Equivalently, the residual $r = b - A\\hat{x}$ is in $\\ker(A^T)$ (the left null space, the perpendicular direction to $\\text{im}(A)$).',
      },
      {
        name: 'Pseudoinverse for full-column-rank case',
        statement: 'If $A \\in \\mathbb{R}^{m \\times n}$ has full column rank ($\\text{rank}(A) = n$), then $A^T A$ is invertible, and $\\hat{x} = (A^T A)^{-1} A^T b$ is the unique least-squares solution.',
        intuition: 'Full column rank guarantees $\\ker(A) = \\{0\\}$, which makes $A^T A$ symmetric positive definite (hence invertible). The formula then directly inverts the normal equations.',
      },
    ],

    keyFormulas: [
      '\\hat{x} = \\arg\\min_x \\|Ax - b\\|^2',
      'A^T A \\hat{x} = A^T b',
      '\\hat{x} = (A^T A)^{-1} A^T b \\quad (\\text{full column rank})',
      'r = b - A\\hat{x} \\in \\ker(A^T)',
    ],
  },

  explore: {
    vizComponent: 'LeastSquaresViz',
    description: 'A 2D scatter plot with adjustable data points (drag to move). The least-squares line $y = mx + c$ is rendered live, along with the residuals (vertical drops from each point to the line). The residual sum-of-squares is displayed and updates in real time as you move points. Toggle to compare with the geometric picture: $b$ projected onto the column space of $A$ (the "design matrix").',
    misconception: {
      title: 'The "best $x$" minimizes the SQUARED residual, not the absolute residual',
      body: `
The least-squares objective is $\\|Ax - b\\|^2 = \\sum_i (a_i^T x - b_i)^2$ — the sum of *squared* residuals. This is a different problem than minimizing the sum of absolute residuals $\\sum_i |a_i^T x - b_i|$ ("least absolute deviations") or the maximum residual $\\max_i |a_i^T x - b_i|$ ("Chebyshev approximation").

The squared objective has two key advantages:
1. **Smoothness**: $|x|$ is not differentiable at $0$; $x^2$ is. So least-squares has a clean closed-form solution via the normal equations, while least-absolute-deviations requires linear programming.
2. **Statistical**: under Gaussian noise, least-squares is the maximum likelihood estimator. No other choice has this exact statistical justification.

But the squared objective also has a downside: it's sensitive to outliers. A single big-residual point contributes its squared error, which can dominate the optimization. Robust regression methods (Huber loss, least absolute deviations) trade off some statistical efficiency for outlier robustness.

A second misconception: thinking that least-squares "fits the data exactly" when there are enough equations. It does not. Even with $n$ equations and $n$ unknowns, the system can have no exact solution if the equations are inconsistent (e.g., $x = 1, x = 2$ — both equations, no $x$ satisfies both). Least-squares always gives an answer even when no exact solution exists.

A third trap: thinking that the normal equations are always the right way to solve least-squares. They are mathematically correct but numerically unstable when $A$ is ill-conditioned (when its columns are nearly linearly dependent). Forming $A^T A$ squares the condition number — small input errors get amplified. The QR-based approach $R \\hat{x} = Q^T b$ avoids this and is the standard method in numerical libraries.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Fit a line to three data points',
        body: 'Fit $y = mx + c$ to $(1, 2), (2, 3), (3, 5)$. Set up: $A = \\begin{pmatrix} 1 & 1 \\\\ 2 & 1 \\\\ 3 & 1 \\end{pmatrix}$, $x = \\begin{pmatrix} m \\\\ c \\end{pmatrix}$, $b = \\begin{pmatrix} 2 \\\\ 3 \\\\ 5 \\end{pmatrix}$. The system $Ax = b$ has no exact solution (three equations, two unknowns, points not collinear).',
      },
      {
        title: 'Solve the normal equations',
        body: 'Compute $A^T A = \\begin{pmatrix} 14 & 6 \\\\ 6 & 3 \\end{pmatrix}$ and $A^T b = \\begin{pmatrix} 23 \\\\ 10 \\end{pmatrix}$. Solve $\\begin{pmatrix} 14 & 6 \\\\ 6 & 3 \\end{pmatrix} \\begin{pmatrix} m \\\\ c \\end{pmatrix} = \\begin{pmatrix} 23 \\\\ 10 \\end{pmatrix}$. Determinant: $42 - 36 = 6$. Solution: $m = (23 \\cdot 3 - 6 \\cdot 10) / 6 = 9/6 = 1.5$; $c = (14 \\cdot 10 - 6 \\cdot 23) / 6 = 2/6 = 1/3$. Best-fit line: $y = 1.5 x + 0.33$.',
      },
    ],

    problems: [
      {
        id: 'P-6.4a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $A$ be an $m \\times n$ matrix with $m > n$ and $\\text{rank}(A) = n$ (full column rank). The pseudoinverse is $A^\\dagger = (A^T A)^{-1} A^T$. Which of the following is TRUE?',
        choices: [
          { label: 'A' as const, body: '$A^\\dagger A = I_m$, so $A^\\dagger$ is a right inverse of $A$.' },
          { label: 'B' as const, body: '$A^\\dagger$ is an $n \\times m$ matrix, and $A^\\dagger A = I_n$.' },
          { label: 'C' as const, body: '$(A^T A)^{-1}$ does not exist because $A$ is not square.' },
          { label: 'D' as const, body: '$A^\\dagger b$ solves $A x = b$ exactly for every $b \\in \\mathbb{R}^m$.' },
          { label: 'E' as const, body: '$A^\\dagger = A^{-1}$ after discarding the extra rows of $A$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Since $A$ is $m \\times n$, $A^T$ is $n \\times m$, so $A^T A$ is $n \\times n$. Full column rank guarantees $A^T A$ is invertible, so $(A^T A)^{-1}$ exists and is $n \\times n$. Thus $A^\\dagger = (A^T A)^{-1} A^T$ is $n \\times m$. Computing $A^\\dagger A = (A^T A)^{-1} (A^T A) = I_n$: the pseudoinverse is a *left* inverse of $A$.',
          partialCredit: '(A) earns partial credit. The student correctly recognizes that $A^\\dagger$ is a one-sided inverse yielding the identity, but confuses left with right. Note also the dimension mismatch: $A^\\dagger A$ is $n \\times n$, so it cannot equal $I_m$ (which is $m \\times m$).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses left vs. right inverse. $A^\\dagger A = I_n$ (left inverse), not $A A^\\dagger = I_m$ (which is generally false unless $m = n$). Earns partial credit.' },
            { choice: 'C' as const, why: '$A^T A$ is $n \\times n$ (not $m \\times m$). Full column rank of $A$ guarantees it is invertible. Students who worry that $A^T A$ might be defective because $A$ is not square have not tracked dimensions.' },
            { choice: 'D' as const, why: '$Ax = b$ is overdetermined ($m > n$). Exact solutions exist only when $b \\in \\text{im}(A)$. For general $b$, $A^\\dagger b$ gives the least-squares solution minimizing $\\|Ax - b\\|$, not an exact solution.' },
            { choice: 'E' as const, why: 'There is no valid operation of "discarding extra rows to produce an inverse." The pseudoinverse accounts for the rectangular shape through the Gram matrix $A^T A$, not by truncation.' },
          ],
        },
      },
      {
        id: 'P-6.4b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $T: V \\to W$ be a linear transformation between inner product spaces (not necessarily injective or surjective). Given $b \\in W$, which description of $T^\\dagger b$ (the pseudoinverse applied to $b$) is correct?',
        choices: [
          { label: 'A' as const, body: 'Project $b$ onto $(\\text{im} T)^\\perp$, then apply $T^{-1}$ to the result.' },
          { label: 'B' as const, body: 'Project $b$ onto $\\text{im}(T)$; then map the projection back to the unique preimage in $(\\ker T)^\\perp$ via the invertible restriction $T|_{(\\ker T)^\\perp}$.' },
          { label: 'C' as const, body: 'Apply the adjoint $T^*$ to $b$; the adjoint always inverts $T$ on $\\text{im}(T)$.' },
          { label: 'D' as const, body: 'Project $b$ onto $\\ker(T^*)$, then solve $T x = b$ in that subspace.' },
          { label: 'E' as const, body: 'Find any solution to $T x = b$, then project $x$ onto $\\ker(T)$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The restriction of $T$ to $(\\ker T)^\\perp$ is an isomorphism onto $\\text{im}(T)$. The pseudoinverse exploits this in two steps: (1) project $b$ onto $\\text{im}(T)$, discarding the component in $(\\text{im} T)^\\perp = \\ker(T^*)$; (2) apply the inverse of the restricted map $T|_{(\\ker T)^\\perp}$ to pull the projected vector back to the unique preimage in $(\\ker T)^\\perp$. This yields the minimum-norm least-squares solution: "minimum norm" because the output lives in $(\\ker T)^\\perp$, and "least squares" because the input is the closest point in $\\text{im}(T)$ to $b$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Projecting onto $(\\text{im} T)^\\perp$ gives the part of $b$ that $T$ cannot reach — there is no preimage to find there. Also, $T^{-1}$ need not exist.' },
            { choice: 'C' as const, why: '$T^*$ maps $W \\to V$ and sends $\\text{im}(T)$ to $(\\ker T)^\\perp$, but it does NOT invert $T$ — it distorts magnitudes. Students who half-remember the role of $A^T$ in $A^\\dagger = (A^T A)^{-1} A^T$ and attribute the inversion entirely to the adjoint pick this.' },
            { choice: 'D' as const, why: '$\\ker(T^*) = (\\text{im} T)^\\perp$ — exactly the component of $b$ with no preimage under $T$. The opposite of what the pseudoinverse needs.' },
            { choice: 'E' as const, why: 'Projecting a solution onto $\\ker(T)$ gives the component that $T$ sends to zero — opposite of the minimum-norm idea. The pseudoinverse produces a vector in $(\\ker T)^\\perp$, NOT $\\ker(T)$.' },
          ],
        },
      },
      {
        id: 'P-6.4c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For an overdetermined system $A x = b$ with $A \\in \\mathbb{R}^{m \\times n}$ ($m > n$) and full column rank, the least-squares residual $r = b - A\\hat{x}$ satisfies which property?',
        choices: [
          { label: 'A' as const, body: '$r = 0$' },
          { label: 'B' as const, body: '$r$ is orthogonal to every column of $A$' },
          { label: 'C' as const, body: '$r$ is in the column space of $A$' },
          { label: 'D' as const, body: '$r = b$' },
          { label: 'E' as const, body: '$r$ is orthogonal to the null space of $A$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The least-squares residual lies in $\\ker(A^T)$ (the left null space of $A$), which equals $\\text{im}(A)^\\perp$ — the orthogonal complement of the column space. So $r$ is orthogonal to every column of $A$, equivalently $A^T r = 0$.',
          trickAnalysis: [
            { choice: 'A' as const, why: '$r = 0$ only when $b \\in \\text{im}(A)$ (i.e., when $Ax = b$ has an exact solution). For generic overdetermined systems, $r \\neq 0$.' },
            { choice: 'C' as const, why: 'The residual is orthogonal to $\\text{im}(A)$, NOT in it. If $r$ were in the column space, it could be subtracted to get an exact solution — but that\'s exactly the case $r = 0$.' },
            { choice: 'D' as const, why: 'Would mean $A\\hat{x} = 0$, i.e., $\\hat{x} \\in \\ker(A)$. For full-column-rank $A$, $\\ker(A) = \\{0\\}$ and $\\hat{x} = 0$ minimizes $\\|Ax - b\\|^2$ only if $A^T b = 0$ — a degenerate case.' },
            { choice: 'E' as const, why: 'For full-column-rank $A$, $\\ker(A) = \\{0\\}$, so "orthogonal to $\\ker(A)$" means "orthogonal to $\\{0\\}$" — trivially true for every vector, not a useful characterization.' },
          ],
        },
      },
    ],
  },
};
