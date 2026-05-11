import type { Concept } from '../types';

export const repeatedEigenvalues: Concept = {
  id: 'repeated-eigenvalues',
  unitId: 'ch8',
  number: '8.2',
  title: 'Repeated Eigenvalues',
  blurb: 'When an eigenvalue repeats, the eigenspace may be smaller than its multiplicity. The geometric-algebraic gap is the source of nondiagonalizability.',
  tier: 'full',

  learn: {
    overview: `
The clean theory of [[simple-diagonalization|simple diagonalization]] assumes distinct eigenvalues. When eigenvalues repeat, two things can happen, and they look identical on paper until you check the eigenspaces. Either the repeated eigenvalue has a "full" eigenspace (matching its algebraic multiplicity), in which case the matrix is still diagonalizable and nothing dramatic occurs; or the eigenspace is "deficient" (smaller than the multiplicity), in which case diagonalization fails and the matrix needs a [[jordan-form|Jordan block]] to be brought to canonical form.

Two numbers govern this. The **algebraic multiplicity** of $\\lambda$ is its multiplicity as a root of the characteristic polynomial $\\det(A - \\lambda I)$. The **geometric multiplicity** of $\\lambda$ is $\\dim \\ker(A - \\lambda I)$, the dimension of the eigenspace. Geometric multiplicity is always at least 1 (every eigenvalue has at least one eigenvector) and at most the algebraic multiplicity. When they are equal for every eigenvalue, the matrix is diagonalizable. When geometric multiplicity is strictly less than algebraic multiplicity for any eigenvalue, the matrix is not diagonalizable.

A concrete example clarifies. The matrix $\\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix} = 2I$ has $\\lambda = 2$ with algebraic multiplicity 2. The eigenspace $\\ker(A - 2I) = \\ker(0) = \\mathbb{R}^2$ has dimension 2, so geometric multiplicity is also 2. Diagonalizable (trivially: it is already diagonal, and every vector is an eigenvector). Contrast: $\\begin{bmatrix} 2 & 1 \\\\ 0 & 2 \\end{bmatrix}$ also has $\\lambda = 2$ with algebraic multiplicity 2, but $\\ker(A - 2I) = \\ker\\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}$ is the span of $\\mathbf{e}_1$ only — a 1-dimensional eigenspace, geometric multiplicity 1. Not diagonalizable. The two matrices have the same characteristic polynomial $(\\lambda - 2)^2$ and the same eigenvalues; they differ only in how the eigenvalue is "filled in" geometrically.

For continuous dynamical systems $\\dot{\\mathbf{x}} = A\\mathbf{x}$, the deficiency in the eigenspace manifests as **polynomial-times-exponential** solutions. If $\\lambda$ has algebraic multiplicity $k$ and geometric multiplicity less than $k$, the [[basis-solutions|basis of solutions]] associated with $\\lambda$ includes terms $e^{\\lambda t}, te^{\\lambda t}, t^2 e^{\\lambda t}, \\ldots$ up to the size of the largest Jordan block. The $te^{\\lambda t}$ and higher polynomial factors are precisely what diagonalization misses. For the [[higher-order-equations|higher-order ODE]] $(\\frac{d}{dt} - \\lambda)^k x = 0$ the solution space is exactly $\\mathrm{span}\\{e^{\\lambda t}, te^{\\lambda t}, \\ldots, t^{k-1}e^{\\lambda t}\\}$, and the underlying companion matrix has a single Jordan block of size $k$ — the maximally deficient case.

A common scenario where repeated eigenvalues appear naturally is the [[higher-order-equations|critically damped]] regime of a second-order oscillator $m\\ddot x + c\\dot x + kx = 0$ when $c^2 = 4mk$. The companion matrix has a repeated real eigenvalue $\\lambda = -c/(2m)$ with geometric multiplicity 1 (a single Jordan block of size 2). The basis solutions are $e^{\\lambda t}$ and $te^{\\lambda t}$, and "critical damping" describes the fastest return to equilibrium without oscillation. Push the damping any higher and you cross into overdamping (two distinct real eigenvalues, no polynomial term); push any lower and you cross into underdamping ([[complex-eigenvalues|complex eigenvalues]], oscillation). The repeated-eigenvalue case is a measure-zero boundary, but it is where the qualitative behavior changes.

The [[rank-and-nullity|rank-nullity theorem]] gives a quick computational check: geometric multiplicity of $\\lambda$ equals $n - \\mathrm{rank}(A - \\lambda I)$. So checking whether a repeated eigenvalue creates a Jordan block reduces to computing the rank of $A - \\lambda I$ and comparing it to $n -$ (algebraic multiplicity).
    `.trim(),

    definitions: [
      {
        term: 'Algebraic multiplicity',
        body: 'The multiplicity of $\\lambda$ as a root of the characteristic polynomial $\\det(A - \\lambda I)$. For an $n \\times n$ matrix, the algebraic multiplicities of all (complex) eigenvalues sum to $n$.',
      },
      {
        term: 'Geometric multiplicity',
        body: 'The dimension $\\dim \\ker(A - \\lambda I)$ of the eigenspace for $\\lambda$. Always at least 1 (each eigenvalue has at least one eigenvector) and at most the algebraic multiplicity.',
      },
      {
        term: 'Defective eigenvalue',
        body: 'An eigenvalue whose geometric multiplicity is strictly less than its algebraic multiplicity. The presence of any defective eigenvalue makes the matrix nondiagonalizable.',
      },
      {
        term: 'Eigenspace',
        body: '$E_\\lambda = \\ker(A - \\lambda I)$, the subspace of all eigenvectors of $A$ with eigenvalue $\\lambda$ (together with the zero vector). Always a [[subspaces|subspace]] because it is a kernel.',
      },
    ],

    theorems: [
      {
        name: 'Multiplicity inequality',
        statement: 'For any eigenvalue $\\lambda$ of any square matrix, $1 \\leq \\dim \\ker(A - \\lambda I) \\leq \\text{algebraic multiplicity of } \\lambda$.',
        intuition: 'The lower bound is trivial: if $\\lambda$ is an eigenvalue, there is at least one eigenvector by definition. The upper bound is the deep statement: the eigenspace can never be "larger" than the algebraic multiplicity allows. A proof goes via block-upper-triangular forms — once you choose a basis for the eigenspace, completing it to a basis for the whole space brings the matrix to a form where the algebraic multiplicity is visible.',
      },
      {
        name: 'Diagonalizability criterion',
        statement: 'A matrix $A$ is diagonalizable over $\\mathbb{C}$ if and only if for every eigenvalue $\\lambda$, the geometric multiplicity equals the algebraic multiplicity.',
        intuition: 'Diagonalizability means the eigenvectors span the whole space. Each eigenspace contributes at most its dimension (= geometric multiplicity) of independent eigenvectors. The total dimension you can collect is $\\sum_\\lambda \\dim E_\\lambda$. For this to equal $n$, each eigenspace must be "as big as possible," matching its algebraic multiplicity (since the algebraic multiplicities already sum to $n$).',
      },
      {
        name: 'Distinct eigenvalues are sufficient',
        statement: 'If an $n \\times n$ matrix has $n$ distinct eigenvalues, it is diagonalizable.',
        intuition: 'Distinct eigenvalues automatically have algebraic multiplicity 1 each, so geometric multiplicity is forced to be 1 (sandwiched between 1 and the algebraic multiplicity). Eigenvectors from distinct eigenvalues are independent. So $n$ independent eigenvectors emerge, spanning the space. Distinctness is sufficient but not necessary — $2I$ has repeated eigenvalues yet is trivially diagonalizable.',
      },
    ],

    keyFormulas: [
      '\\text{algebraic multiplicity}(\\lambda) = \\text{mult. as root of } \\det(A - \\lambda I)',
      '\\text{geometric multiplicity}(\\lambda) = \\dim \\ker(A - \\lambda I) = n - \\text{rank}(A - \\lambda I)',
      '1 \\leq \\text{geom. mult.} \\leq \\text{alg. mult.}',
      '\\text{Solutions for defective } \\lambda: e^{\\lambda t}, te^{\\lambda t}, t^2 e^{\\lambda t}, \\ldots',
    ],
  },

  explore: {
    vizComponent: 'RepeatedEigenvalueViz',
    description: 'Two matrices sit side-by-side: $2I$ on the left, $\\begin{bmatrix} 2 & 1 \\\\ 0 & 2 \\end{bmatrix}$ on the right. Both have characteristic polynomial $(\\lambda - 2)^2$, so eigenvalues match. The viz shows the action of each on a grid of vectors over time, animating $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$. The left grid scales uniformly. The right grid shears as it scales — the visual signature of a Jordan block. A slider for $t$ scrubs time; a toggle reveals the eigenspaces ($\\mathbb{R}^2$ vs span of $\\mathbf{e}_1$).',
    misconception: {
      title: 'Repeated eigenvalues do not by themselves make a matrix nondiagonalizable.',
      body: `Many students absorb the rule "distinct eigenvalues = diagonalizable" and incorrectly invert it to "repeated eigenvalues = nondiagonalizable." This is wrong. The identity matrix $I$ has eigenvalue $1$ with algebraic multiplicity $n$ and is trivially diagonalizable. More generally, $\\lambda I$ for any $\\lambda$ is diagonalizable for the same reason. Repeated eigenvalues are a NECESSARY condition for nondiagonalizability (a matrix with all distinct eigenvalues is always diagonalizable) but not a SUFFICIENT one. What matters is whether the eigenspace is "full enough."

The correct check: for each repeated eigenvalue, compute the geometric multiplicity $\\dim \\ker(A - \\lambda I)$ and compare it to the algebraic multiplicity. If they match for every eigenvalue, the matrix is diagonalizable. If geometric multiplicity is strictly less than algebraic multiplicity for any eigenvalue, the matrix is defective and needs a Jordan form.

A second misconception is reading "geometric multiplicity 2" as "two independent eigenvectors for the same eigenvalue that produce two independent basis solutions $e^{\\lambda t}\\mathbf{v}_1$ and $e^{\\lambda t}\\mathbf{v}_2$." Sometimes students claim these are "the same exponential" so only one basis solution survives. False. Two independent eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$ for the same eigenvalue $\\lambda$ produce two genuinely independent vector-valued solutions $e^{\\lambda t}\\mathbf{v}_1$ and $e^{\\lambda t}\\mathbf{v}_2$. They share the scalar factor $e^{\\lambda t}$ but point in different directions, so they are not multiples of each other in the [[vector-space-examples|space of vector-valued functions]].

A third trap is confusing the polynomial-times-exponential solutions $te^{\\lambda t}, t^2 e^{\\lambda t}$ that appear in the defective case with [[basis-solutions|the standard basis solutions]] of the non-defective case. These polynomial terms appear ONLY when the eigenspace is deficient. If $\\lambda$ has geometric multiplicity equal to algebraic multiplicity, all basis solutions are pure exponentials $e^{\\lambda t}\\mathbf{v}_i$ for the independent eigenvectors $\\mathbf{v}_i$; no $t$ factor anywhere. The $t$ factors come from the Jordan block structure, not the repeated eigenvalue alone.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1 — set up the matrix and find eigenvalues',
        body: 'Take $A = \\begin{bmatrix} 3 & 1 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 3 \\end{bmatrix}$. The characteristic polynomial is $\\det(A - \\lambda I) = (3 - \\lambda)^3$, so $\\lambda = 3$ with algebraic multiplicity 3.',
      },
      {
        title: 'Step 2 — compute the geometric multiplicity',
        body: 'Form $A - 3I = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}$. This matrix has rank 1 (one nonzero row), so $\\dim \\ker(A - 3I) = 3 - 1 = 2$. Geometric multiplicity is 2.',
      },
      {
        title: 'Step 3 — diagnose diagonalizability',
        body: 'Algebraic multiplicity 3, geometric multiplicity 2 — they do NOT match. So $A$ is defective; it cannot be diagonalized. Its Jordan form has one $2 \\times 2$ Jordan block (for the deficiency of $3 - 2 = 1$ eigenvector) and one $1 \\times 1$ block, both with eigenvalue 3. The solution space for $\\dot{\\mathbf{x}} = A\\mathbf{x}$ includes the term $te^{3t}\\mathbf{w}$ for some generalized eigenvector $\\mathbf{w}$.',
      },
    ],

    problems: [
      {
        id: 'P-8.2a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A $5 \\times 5$ matrix $A$ has characteristic polynomial $p(\\lambda) = (\\lambda - 2)^3(\\lambda + 1)^2$. Suppose $\\dim \\ker(A - 2I) = 2$ and $\\dim \\ker(A + I) = 2$. What can you conclude about $A$?',
        choices: [
          { label: 'A' as const, body: '$A$ is diagonalizable.' },
          { label: 'B' as const, body: '$A$ is not diagonalizable.' },
          { label: 'C' as const, body: '$A$ has Jordan blocks of size at least 2.' },
          { label: 'D' as const, body: 'The matrix $A - 2I$ has rank 2.' },
          { label: 'E' as const, body: 'Both (B) and (C).' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'Algebraic multiplicities: 3 for $\\lambda = 2$, 2 for $\\lambda = -1$ (total 5, matching the matrix size). Geometric multiplicities: 2 for $\\lambda = 2$, 2 for $\\lambda = -1$. For $\\lambda = 2$, geometric (2) < algebraic (3), so $A$ is NOT diagonalizable — confirming (B). The deficiency of $3 - 2 = 1$ at $\\lambda = 2$ means the Jordan form has TWO blocks for $\\lambda = 2$ summing to size 3 with one chain longer than length 1, so one block must be size $\\geq 2$. For $\\lambda = -1$, geometric equals algebraic, so its blocks are all size 1. Hence at least one Jordan block of size $\\geq 2$ exists — confirming (C). Both (B) and (C) are correct; (E) captures both.',
          partialCredit: 'B or C individually (each is a correct partial answer; (E) recognizes that both characterizations are simultaneously true and are inseparable).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Geometric multiplicity 2 < algebraic multiplicity 3 at $\\lambda = 2$, so $A$ is defective and NOT diagonalizable. Confusing "two independent eigenvectors" with "fully diagonalizable" — but you would need three at $\\lambda = 2$.' },
            { choice: 'B' as const, why: 'TRUE but incomplete. The question asks what can be concluded, and (C) is also a valid conclusion. (E) captures both.' },
            { choice: 'C' as const, why: 'TRUE but incomplete. Same as (B) — captures one valid conclusion but misses the other.' },
            { choice: 'D' as const, why: 'WRONG rank count. If $\\dim \\ker(A - 2I) = 2$, then $\\mathrm{rank}(A - 2I) = 5 - 2 = 3$, not 2. Confuses $\\dim \\ker$ with rank.' },
          ],
        },
      },
      {
        id: 'P-8.2b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'The general solution to a third-order linear ODE is $x(t) = c_1 e^{-2t} + c_2 e^{3t} + c_3 t e^{3t}$. What does this tell you about the companion matrix $C$?',
        choices: [
          { label: 'A' as const, body: '$C$ has three distinct eigenvalues.' },
          { label: 'B' as const, body: '$C$ has eigenvalue $\\lambda = 3$ with algebraic multiplicity 2 and a 2-dimensional eigenspace.' },
          { label: 'C' as const, body: '$C$ has eigenvalue $\\lambda = 3$ with algebraic multiplicity 2 and a 1-dimensional eigenspace.' },
          { label: 'D' as const, body: '$C$ has eigenvalue $\\lambda = 3$ with a 2-dimensional eigenspace, but only one basis solution because the other eigenvector produces the same exponential.' },
          { label: 'E' as const, body: 'None of the above can be concluded.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The presence of $te^{3t}$ in the basis is the unmistakable signature of a Jordan block: a polynomial-times-exponential term appears for $\\lambda$ exactly when $\\lambda$ has geometric multiplicity less than algebraic multiplicity. So $\\lambda = 3$ has algebraic multiplicity 2 (the $e^{3t}$ and $te^{3t}$ together account for a 2D solution subspace) and geometric multiplicity 1 (only one eigenvector — if there were two, no $te^{3t}$ term would be needed). The third basis function $e^{-2t}$ corresponds to a separate eigenvalue $\\lambda = -2$ with multiplicity 1.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'WRONG count. Eigenvalues are $-2$ and $3$ (only two distinct values), with $3$ repeated. The $te^{3t}$ term reveals the repetition.' },
            { choice: 'B' as const, why: 'WRONG eigenspace dimension. A 2-dimensional eigenspace would mean two independent eigenvectors at $\\lambda = 3$, giving basis $e^{3t}\\mathbf{v}_1$ and $e^{3t}\\mathbf{v}_2$ with NO $t$ factor. The $te^{3t}$ rules this out.' },
            { choice: 'D' as const, why: 'False premise: two independent eigenvectors for the same eigenvalue produce two GENUINELY INDEPENDENT vector-valued basis solutions, not "the same exponential." Confuses scalar shape with vector independence.' },
            { choice: 'E' as const, why: 'The basis encodes complete information about eigenvalue structure. (C) is a fully justified conclusion.' },
          ],
        },
      },
      {
        id: 'P-8.2c',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Which of the following $3 \\times 3$ matrices is NOT diagonalizable?',
        choices: [
          { label: 'A' as const, body: '$\\begin{bmatrix} 5 & 0 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & 5 \\end{bmatrix}$' },
          { label: 'B' as const, body: '$\\begin{bmatrix} 5 & 1 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & 5 \\end{bmatrix}$' },
          { label: 'C' as const, body: '$\\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 3 \\end{bmatrix}$' },
          { label: 'D' as const, body: '$\\begin{bmatrix} 5 & 0 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & 7 \\end{bmatrix}$' },
          { label: 'E' as const, body: '$\\begin{bmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 2 \\end{bmatrix}$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Check each. (A) is $5I$, every vector is an eigenvector; algebraic = geometric = 3. Diagonalizable. (B) has $\\lambda = 5$ with algebraic multiplicity 3. Computing $A - 5I = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}$, rank 1, so $\\dim \\ker = 2$ — geometric multiplicity 2 < algebraic 3. Defective, NOT diagonalizable. (C) has three distinct eigenvalues — automatically diagonalizable (already diagonal). (D) has $\\lambda = 5$ (alg. mult. 2, geom. mult. 2 since it is already block diagonal) and $\\lambda = 7$ (alg. mult. 1) — diagonalizable. (E) has block structure: the upper-left $2 \\times 2$ rotation block has complex eigenvalues $\\pm i$, plus the real eigenvalue 2 — diagonalizable over $\\mathbb{C}$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Diagonalizable. $5I$ has every vector as an eigenvector; the repeated eigenvalue does NOT prevent diagonalization when the eigenspace is full.' },
            { choice: 'C' as const, why: 'Diagonalizable. Distinct eigenvalues always force diagonalizability; this matrix is in fact already diagonal.' },
            { choice: 'D' as const, why: 'Diagonalizable. Already diagonal; geometric multiplicities trivially match algebraic multiplicities.' },
            { choice: 'E' as const, why: 'Diagonalizable over $\\mathbb{C}$. Complex eigenvalues do not prevent diagonalization (the issue is defectiveness, not complexity).' },
          ],
        },
      },
    ],
  },
};
