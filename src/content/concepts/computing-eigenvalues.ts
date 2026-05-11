import type { Concept } from '../types';

export const computingEigenvalues: Concept = {
  id: 'computing-eigenvalues',
  unitId: 'ch8',
  number: '8.5',
  title: 'Computing Eigenvalues',
  blurb: 'How software actually finds eigenvalues: the QR algorithm, which iteratively similarity-transforms the matrix into block upper triangular form.',
  tier: 'full',

  learn: {
    overview: `
Computing eigenvalues by hand from the [[eigenvectors|characteristic polynomial]] is feasible for small matrices but fails for large ones. Abel\'s theorem guarantees there is no general algebraic formula for roots of polynomials of degree five or higher; for a $100 \\times 100$ matrix, no exact root-finder exists. Every practical computation of eigenvalues uses **iterative similarity transformations** that converge to a structured form where eigenvalues are easy to read off.

The dominant algorithm is the **QR algorithm**. Starting from $A_0 = A$, each iteration computes the [[qr-decomposition|QR decomposition]] $A_k = Q_k R_k$ and then forms $A_{k+1} = R_k Q_k$ — reversing the order of multiplication. The key observation: since $R_k = Q_k^T A_k$ (because $Q_k$ is orthogonal), we have $A_{k+1} = R_k Q_k = Q_k^T A_k Q_k$, which is a [[similarity|similarity transformation]] of $A_k$. Eigenvalues are preserved across iterations. The algorithm produces a sequence of similar matrices $A_0, A_1, A_2, \\ldots$ all having the same eigenvalues, and under broad conditions the sequence converges to a structured form from which eigenvalues are immediate.

For matrices with **distinct real eigenvalues**, the QR algorithm converges to an upper triangular matrix (the **Schur form**), with eigenvalues on the diagonal in order of decreasing magnitude. When the matrix is real but has **complex conjugate eigenvalue pairs**, real arithmetic cannot produce a purely triangular matrix (complex eigenvalues are not real numbers). Instead, the algorithm converges to **block upper triangular** form: $1 \\times 1$ blocks on the diagonal for real eigenvalues, and $2 \\times 2$ blocks for each complex conjugate pair. The eigenvalues of each $2 \\times 2$ block are exactly the complex pair. **Repeated eigenvalues** with associated [[jordan-form|Jordan structure]] still converge, but slowly, and the limiting form is the **real Schur form** — block upper triangular but possibly retaining nonzero superdiagonal entries (the block does not split further).

The Schur form is the practical analog of the Jordan form. It has the same eigenvalues on the diagonal (or in the $2 \\times 2$ blocks for complex pairs), it is achieved by a real orthogonal similarity, and it is numerically stable to compute (orthogonal transformations preserve norms). The Jordan form, by contrast, is theoretically clean but numerically ill-conditioned: arbitrarily small perturbations can change the Jordan structure dramatically (e.g., a single Jordan block $J_n(\\lambda)$ can split into $n$ distinct eigenvalues under a perturbation of size $\\epsilon$, with perturbed eigenvalues $\\lambda + \\epsilon^{1/n} \\zeta^k$ where $\\zeta$ is an $n$-th root of unity).

The algorithm has practical refinements that make it efficient: a preliminary **Hessenberg reduction** brings $A$ to upper Hessenberg form (zeros below the first subdiagonal) using orthogonal similarities, drastically cheapening each QR iteration; **shift strategies** like the Wilkinson shift accelerate convergence by replacing $A_k$ with $A_k - \\sigma I$ at each step, choosing $\\sigma$ to mimic the Rayleigh quotient near a target eigenvalue. The "vanilla" QR algorithm presented in textbooks is the conceptual core; production implementations are more sophisticated, but they all rest on the same idea: iterate similarity transformations toward triangular form.

A different perspective: the QR algorithm is implicitly **power iteration** applied to all eigenvectors at once. The columns of the orthogonal matrix $Q^{(k)} = Q_0 Q_1 \\cdots Q_{k-1}$ converge to the eigenvectors of $A$ (in order of decreasing magnitude), and the columns automatically stay orthogonal because of the QR factorization at each step. This is why the convergence to upper triangular form makes sense — the eigenvectors are being "discovered" one by one, and once you have the eigenvectors as an orthogonal frame, the matrix in that basis is upper triangular.

In ESE 2030 the QR algorithm is treated as a conceptual object: students should understand that (a) it is a similarity transformation that preserves eigenvalues, (b) it converges to upper (block) triangular form, (c) the reversed multiplication $A_{k+1} = R_k Q_k$ is what generates the similarity, and (d) it does NOT generally converge to a Jordan form for non-diagonalizable matrices — only to the Schur form. The algorithm is not implemented by hand; the focus is on its structural properties.
    `.trim(),

    definitions: [
      {
        term: 'QR algorithm',
        body: 'The iteration $A_{k+1} = R_k Q_k$ where $A_k = Q_k R_k$ is the [[qr-decomposition|QR decomposition]] of $A_k$. Each step is a similarity transformation, $A_{k+1} = Q_k^T A_k Q_k$, preserving eigenvalues.',
      },
      {
        term: 'Schur form',
        body: 'An upper triangular matrix $T$ similar to $A$ via orthogonal similarity: $A = Q T Q^T$. Eigenvalues of $A$ sit on the diagonal of $T$. For complex eigenvalues, $T$ is over $\\mathbb{C}$.',
      },
      {
        term: 'Real Schur form',
        body: 'A block upper triangular matrix $T$ over $\\mathbb{R}$ similar to $A$ via real orthogonal similarity, with $1 \\times 1$ blocks for real eigenvalues and $2 \\times 2$ blocks for complex conjugate pairs on the diagonal.',
      },
      {
        term: 'Hessenberg form',
        body: 'A matrix that is "almost upper triangular": all entries below the first subdiagonal are zero. Every matrix is similar (via orthogonal transformation) to a Hessenberg form. The QR algorithm preserves Hessenberg form, and Hessenberg matrices admit fast ($O(n^2)$ vs $O(n^3)$) QR iterations.',
      },
    ],

    theorems: [
      {
        name: 'Similarity preservation',
        statement: 'In the QR algorithm, $A_{k+1} = Q_k^T A_k Q_k$, so $A_{k+1}$ and $A_k$ are similar. By induction, all iterates $A_0, A_1, \\ldots$ share the same eigenvalues, [[rank-and-conditioning|rank]], trace, determinant, characteristic polynomial, and Jordan structure.',
        intuition: 'The reversed multiplication is exactly the trick. From $A_k = Q_k R_k$ comes $R_k = Q_k^T A_k$; substituting into $A_{k+1} = R_k Q_k$ gives $A_{k+1} = Q_k^T A_k Q_k$. The transposed orthogonal matrix on the left and the orthogonal matrix on the right is the canonical orthogonal similarity. Without the reversal, $Q_k R_k = A_k$ — no progress.',
      },
      {
        name: 'Convergence to (real) Schur form',
        statement: 'Under generic conditions, the QR algorithm applied to a real matrix $A$ produces a sequence $A_k$ converging to a real Schur form: block upper triangular with $1 \\times 1$ blocks for real eigenvalues and $2 \\times 2$ blocks for each complex conjugate pair.',
        intuition: 'The QR iteration is equivalent to subspace iteration on the standard basis. Subspaces spanned by the leading $k$ columns converge to the invariant subspaces of $A$ in order of decreasing eigenvalue magnitude. Once the basis aligns with the invariant subspaces, the matrix in that basis must be block upper triangular: vectors in invariant subspaces stay there. Complex eigenvalues prevent further splitting because no $1 \\times 1$ real block can capture a complex eigenvalue.',
      },
      {
        name: 'No convergence to Jordan form',
        statement: 'The QR algorithm does NOT converge to the Jordan canonical form for defective matrices. The limit is the (real) Schur form, which retains nonzero superdiagonal entries when [[jordan-form|Jordan blocks of size > 1]] are present.',
        intuition: 'Jordan form is not orthogonally similar to a general matrix — it requires a non-orthogonal change of basis (the generalized eigenvectors are typically not orthogonal). Orthogonal similarities preserve more than eigenvalues: they preserve norms and angles, which the Jordan form would violate. So orthogonal iteration can at best reach the Schur form, where eigenvalues sit on the diagonal but the matrix is still "above triangular" with nonzero upper-diagonal entries encoding the geometry of the eigenvectors.',
      },
    ],

    keyFormulas: [
      'A_k = Q_k R_k \\quad \\text{(QR decomposition)}',
      'A_{k+1} = R_k Q_k = Q_k^T A_k Q_k',
      'A_k \\to T \\quad \\text{(real Schur form, block upper triangular)}',
      'A = Q T Q^T \\quad \\text{(Schur decomposition)}',
    ],
  },

  explore: {
    vizComponent: 'QRAlgorithmViz',
    description: 'Start with a $4 \\times 4$ matrix $A$ with eigenvalues $3, 1, 1+2i, 1-2i$. The viz runs the QR algorithm interactively: each "Step" button click computes one iteration $A_k \\to A_{k+1}$, displaying the new matrix with a heatmap (subdiagonal entries fade toward zero as iterations proceed; the $2 \\times 2$ block for the complex pair persists). A "Run 10" button runs ten iterations at once. A side panel shows the eigenvalues (constant across iterations) and the matrix norm of the off-block-diagonal entries (decreasing toward zero), confirming convergence to real Schur form. A toggle shows the implicit orthogonal frame $Q^{(k)}$ converging to the invariant-subspace basis.',
    misconception: {
      title: 'The QR algorithm reverses the multiplication ($R Q$, not $Q R$) — and that reversal IS the algorithm.',
      body: `Many students remember "QR algorithm" but mis-state the iteration as $A_{k+1} = Q_k R_k$ — which is just $A_k$ again. The whole point is the REVERSED multiplication $A_{k+1} = R_k Q_k$. From the QR decomposition $A_k = Q_k R_k$ we can solve $R_k = Q_k^T A_k$, so $A_{k+1} = R_k Q_k = Q_k^T A_k Q_k$, an orthogonal similarity. The eigenvalues are preserved exactly, by construction.

A second misconception: assuming the QR algorithm converges to the Jordan canonical form. It does not, and cannot for orthogonal similarities. The Jordan form requires non-orthogonal changes of basis (the generalized eigenvectors are typically non-orthogonal). The QR algorithm uses ONLY orthogonal similarities, so its limit must be reachable by orthogonal transformations — that limit is the (real) Schur form. For defective matrices, the Schur form has nonzero superdiagonal entries that "look like" Jordan structure but are NOT in canonical Jordan form — they retain the geometry of the eigenvectors as captured by the orthogonal frame.

A third trap is assuming the algorithm fails for complex or repeated eigenvalues. It does not fail — but the convergence is qualified. For complex conjugate pairs, the algorithm converges to a real block triangular form with $2 \\times 2$ blocks on the diagonal (one per conjugate pair). The $2 \\times 2$ block does not split further because no orthogonal similarity over $\\mathbb{R}$ can diagonalize a complex pair into real entries. For repeated eigenvalues with Jordan structure, the algorithm converges but slowly; the limit is the real Schur form with nonzero upper-diagonal entries inside blocks of repeated eigenvalues.

A fourth issue: forgetting that real Schur form is the practical canonical form, not the diagonal form. For a real matrix $A$ with eigenvalues $3, 3, 1+2i, 1-2i, -1$, the QR algorithm produces a block upper triangular matrix with three $1 \\times 1$ diagonal blocks (for $3, 3, -1$) and one $2 \\times 2$ block (for the complex pair). Even if the two repeated 3's share an eigenvector and the matrix is defective, this is still the limiting form — the Jordan structure is hidden inside the upper triangular part above the repeated entries.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1 — start with a simple example',
        body: 'Let $A_0 = \\begin{bmatrix} 2 & 1 \\\\ 0 & 3 \\end{bmatrix}$. This matrix is already upper triangular with eigenvalues 2 and 3 on the diagonal — but watch what the QR algorithm does anyway.',
      },
      {
        title: 'Step 2 — compute the QR decomposition',
        body: 'For an upper triangular matrix with nonzero diagonal entries that is already in Schur form, the QR decomposition is trivially $Q_0 = I$ and $R_0 = A_0$.',
      },
      {
        title: 'Step 3 — form $A_1 = R_0 Q_0$',
        body: 'Reversed multiplication: $A_1 = R_0 Q_0 = A_0 \\cdot I = A_0$. The matrix is unchanged — already in Schur form (eigenvalues on the diagonal of an upper triangular matrix). For a triangular starting matrix, the QR algorithm has already converged. For a generic matrix, convergence takes many iterations and the off-diagonal entries shrink toward zero (or toward the $2 \\times 2$ block structure for complex eigenvalues).',
      },
    ],

    problems: [
      {
        id: 'P-8.5a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'In the QR algorithm, given $A_k$, we compute $A_k = Q_k R_k$ and then form $A_{k+1} = R_k Q_k$ (reversed order). Why is the reversed multiplication essential?',
        choices: [
          { label: 'A' as const, body: '$R_k Q_k$ is upper triangular while $Q_k R_k$ is not, allowing eigenvalues to appear on the diagonal.' },
          { label: 'B' as const, body: '$R_k Q_k$ uses the fact that matrix multiplication is not commutative to generate new matrices.' },
          { label: 'C' as const, body: '$Q_k R_k = A_k$ would just return the original matrix, making no progress toward convergence.' },
          { label: 'D' as const, body: '$R_k Q_k$ is similar to $A_k$ via $A_{k+1} = Q_k^T A_k Q_k$, preserving eigenvalues across iterations.' },
          { label: 'E' as const, body: '$R_k Q_k$ is symmetric when $A_k$ is symmetric, while $Q_k R_k$ may not be.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'Two observations chain to the answer. First, $Q_k R_k = A_k$ exactly (that is the definition of QR decomposition), so multiplying in the original order would just recover $A_k$ — no progress. Second, the REVERSED multiplication $A_{k+1} = R_k Q_k$ can be rewritten using $R_k = Q_k^T A_k$ (since $Q_k$ is orthogonal): $A_{k+1} = Q_k^T A_k Q_k$, an orthogonal similarity transformation. Similarity preserves eigenvalues, so the QR algorithm generates a sequence of matrices with identical eigenvalues. The orthogonal similarity is what makes the algorithm reach the Schur form rather than diverging. (C) is a true statement but only the first half of the reason; (D) captures the COMPLETE reason — the similarity structure is the deep mechanism.',
          partialCredit: 'C (recognizes the "no progress otherwise" aspect, which is true but incomplete — does not explain why the reversed multiplication WORKS).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Backwards. $R_k$ is upper triangular and $Q_k$ is orthogonal; $R_k Q_k$ is NEITHER upper triangular nor of any special shape in general. The Schur form emerges only asymptotically.' },
            { choice: 'B' as const, why: 'Non-commutativity is a fact but not a REASON. Reversing multiplication for the sake of reversing it does not explain convergence.' },
            { choice: 'C' as const, why: 'TRUE but incomplete. Captures why $Q_k R_k$ would fail, but does not explain why $R_k Q_k$ works (the similarity argument).' },
            { choice: 'E' as const, why: 'False. $Q_k R_k$ is ALWAYS the original $A_k$, which is symmetric iff $A_k$ is symmetric. $R_k Q_k$ is symmetric iff $A_{k+1}$ is symmetric, and orthogonal similarities preserve symmetry, so the iteration preserves symmetry of the matrix. Both forms behave the same way with respect to symmetry.' },
          ],
        },
      },
      {
        id: 'P-8.5b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A real $5 \\times 5$ matrix $A$ has eigenvalues $\\lambda_{1,2} = 3$ (with shared eigenvector — defective), $\\lambda_{3,4} = 1 \\pm 2i$, and $\\lambda_5 = -1$. When the QR algorithm is applied repeatedly, what is the structure of the limiting form?',
        choices: [
          { label: 'A' as const, body: 'Diagonal with entries $3, 3, -1$ and two complex entries.' },
          { label: 'B' as const, body: 'Jordan canonical form with appropriate Jordan blocks.' },
          { label: 'C' as const, body: 'Upper triangular with all five eigenvalues on the diagonal.' },
          { label: 'D' as const, body: 'Block upper triangular: three $1 \\times 1$ blocks and one $2 \\times 2$ block.' },
          { label: 'E' as const, body: 'The algorithm cannot converge due to the repeated eigenvalue.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'The QR algorithm uses only ORTHOGONAL similarity transformations and converges to the **real Schur form** for real matrices. The real Schur form is block upper triangular with $1 \\times 1$ blocks for real eigenvalues (here: 3, 3, $-1$) and $2 \\times 2$ blocks for each complex conjugate pair (here: $1 \\pm 2i$). So the limit has three $1 \\times 1$ blocks and one $2 \\times 2$ block. The defective structure of the repeated eigenvalue $\\lambda = 3$ does NOT prevent convergence — it just means the two $1 \\times 1$ blocks for $\\lambda = 3$ are adjacent in the limiting matrix with a nonzero upper-diagonal entry between them, encoding the Jordan structure inside the Schur form.',
          partialCredit: 'C (correctly identifies upper triangular but misses that real arithmetic forces $2 \\times 2$ blocks for complex pairs).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Diagonal form would require the matrix to be diagonalizable, which it is NOT (eigenvalue 3 is defective). And complex eigenvalues cannot sit on a real diagonal — they must be encoded in $2 \\times 2$ blocks for real Schur form.' },
            { choice: 'B' as const, why: 'The QR algorithm does NOT converge to Jordan form. Jordan form requires non-orthogonal change of basis (generalized eigenvectors are typically non-orthogonal); orthogonal similarities can only reach Schur form.' },
            { choice: 'C' as const, why: 'Would be correct if working over $\\mathbb{C}$, but for real arithmetic the complex pair $1 \\pm 2i$ must be encoded as a $2 \\times 2$ block, not as two complex entries.' },
            { choice: 'E' as const, why: 'False. The algorithm converges (perhaps slowly, but it converges) even for defective matrices. The defective structure is reflected in the off-diagonal entries of the Schur form, not in non-convergence.' },
          ],
        },
      },
      {
        id: 'P-8.5c',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'A third-order linear ODE $\\frac{d^3 x}{dt^3} - 4 \\frac{d^2 x}{dt^2} + 5 \\frac{dx}{dt} - 2x = 0$ is converted to a first-order system $\\frac{d\\mathbf{v}}{dt} = C \\mathbf{v}$ with $\\mathbf{v} = (x, \\dot x, \\ddot x)^T$ and $C$ the $3 \\times 3$ companion matrix. Which statement correctly relates the ODE to $C$?',
        choices: [
          { label: 'A' as const, body: 'The eigenvalues of $C$ are $-4, 5, -2$ from the ODE coefficients.' },
          { label: 'B' as const, body: 'The trace of $C$ equals $-4 + 5 + (-2) = -1$.' },
          { label: 'C' as const, body: 'The characteristic polynomial of $C$ is $\\lambda^3 - 4\\lambda^2 + 5\\lambda - 2 = 0$.' },
          { label: 'D' as const, body: 'Matrix $C$ must be symmetric because the ODE has real coefficients.' },
          { label: 'E' as const, body: 'The solution spaces of the ODE and matrix system have different dimensions.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'For the higher-order linear ODE $\\frac{d^n x}{dt^n} + a_{n-1} \\frac{d^{n-1} x}{dt^{n-1}} + \\cdots + a_0 x = 0$, the companion matrix $C$ has characteristic polynomial $\\lambda^n + a_{n-1} \\lambda^{n-1} + \\cdots + a_0 = 0$ — exactly the ODE\'s characteristic equation with $\\frac{d}{dt}$ replaced by $\\lambda$. For the given ODE, this is $\\lambda^3 - 4 \\lambda^2 + 5 \\lambda - 2 = 0$. The eigenvalues of $C$ are the roots of this polynomial — NOT the coefficients themselves.',
          partialCredit: 'A (incorrect but reveals partial understanding: associates eigenvalues with the ODE but reads them off as coefficients rather than as polynomial roots).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses coefficients of the ODE with the eigenvalues. The eigenvalues are the ROOTS of the characteristic polynomial, which the coefficients determine but are not equal to.' },
            { choice: 'B' as const, why: 'Trace equals sum of eigenvalues. For this ODE, the characteristic polynomial is $\\lambda^3 - 4\\lambda^2 + 5\\lambda - 2 = 0$, so by Vieta\'s, the sum of roots is $4$ (NOT $-1$). Trace = $4$.' },
            { choice: 'D' as const, why: 'Companion matrices are NEVER symmetric (except in trivial cases). They are upper Hessenberg with $-a_i$ in the last row.' },
            { choice: 'E' as const, why: 'The two solution spaces are isomorphic — by construction, the higher-order ODE is converted to a first-order system precisely so that solutions correspond.' },
          ],
        },
      },
    ],
  },
};
