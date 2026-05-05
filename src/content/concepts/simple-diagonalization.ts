import type { Concept } from '../types';

export const simpleDiagonalization: Concept = {
  id: 'simple-diagonalization',
  unitId: 'ch7',
  number: '7.4',
  title: 'Simple Diagonalization',
  blurb: 'When n distinct eigenvalues exist, eigenvectors form a basis and the matrix takes its simplest form: diagonal.',
  tier: 'full',

  learn: {
    overview: `
A matrix is most transparent when it acts diagonally. A diagonal matrix scales each coordinate axis by an independent factor, with no mixing. Computing powers, exponentials, and steady-state behavior reduces to elementary scalar arithmetic. The question of [[similarity|similarity]] becomes: which matrices are similar to a diagonal matrix? When such a similarity exists, we say the matrix is **diagonalizable**, and the process of finding it is **diagonalization**.

The mechanism is straightforward when the eigenstructure is rich enough. If $A$ has $n$ linearly independent [[eigenvectors|eigenvectors]] $\\mathbf{v}_1, \\ldots, \\mathbf{v}_n$ with corresponding eigenvalues $\\lambda_1, \\ldots, \\lambda_n$, then assembling them as columns of $V = [\\mathbf{v}_1 | \\cdots | \\mathbf{v}_n]$ packages all $n$ eigenvalue equations $A \\mathbf{v}_i = \\lambda_i \\mathbf{v}_i$ into the single matrix equation $A V = V \\Lambda$ where $\\Lambda = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$. Linear independence of the eigenvectors makes $V$ invertible, and the diagonalization is $V^{-1} A V = \\Lambda$, equivalently $A = V \\Lambda V^{-1}$.

A clean sufficient condition for diagonalizability: $n$ distinct real eigenvalues. The argument is that eigenvectors associated with distinct eigenvalues are automatically linearly independent (a small inductive proof, given in the textbook). With $n$ such eigenvalues in an $n \\times n$ matrix, you have $n$ independent eigenvectors, hence a [[bases|basis]] for $\\mathbb{R}^n$, hence a diagonalization. This is the "simple" case of the section title; the full picture (including repeated and complex eigenvalues) develops in Chapter 8.

Diagonalization is more than a computational trick. It is a [[change-of-basis|change of basis]] revealing the matrix's true geometric character, stripped of the artifacts imposed by an arbitrary coordinate choice. The columns of $V$ define the eigenbasis; in those coordinates, the [[matrix-representations|matrix representation]] of the underlying linear transformation is diagonal. [[similarity|Similar matrices]] all describe the same transformation in different bases; diagonal form is the simplest representative when one exists.

Two consequences are immediate and powerful. **Matrix powers**: $A^k = V \\Lambda^k V^{-1}$, so computing $A^k$ reduces to computing $\\Lambda^k$ (just raise diagonal entries to the $k$th power) plus two matrix multiplications. **Matrix exponentials**: $e^{At} = V e^{\\Lambda t} V^{-1}$ where $e^{\\Lambda t} = \\text{diag}(e^{\\lambda_1 t}, \\ldots, e^{\\lambda_n t})$. The latter is the engine of the [[matrix-exponentials|next section]] and the key to solving linear ODE systems explicitly. Trace and determinant also acquire eigenvalue formulas: $\\text{tr}(A) = \\sum \\lambda_i$ and $\\det(A) = \\prod \\lambda_i$.
    `.trim(),

    definitions: [
      {
        term: 'Diagonalizable matrix',
        body: 'An $n \\times n$ matrix $A$ is diagonalizable if there exists an invertible matrix $V$ and a diagonal matrix $\\Lambda$ such that $A = V \\Lambda V^{-1}$. Equivalently, $A$ has $n$ linearly independent eigenvectors.',
      },
      {
        term: 'Eigenbasis',
        body: 'A basis of $\\mathbb{R}^n$ consisting of eigenvectors of $A$. It exists iff $A$ is diagonalizable. The eigenbasis is the natural coordinate system in which $A$ acts by simple scaling.',
      },
      {
        term: 'Algebraic vs geometric multiplicity',
        body: 'The algebraic multiplicity of an eigenvalue $\\lambda$ is its multiplicity as a root of the characteristic polynomial. The geometric multiplicity is $\\dim \\ker(A - \\lambda I)$. A matrix is diagonalizable iff geometric multiplicity equals algebraic multiplicity for every eigenvalue.',
      },
      {
        term: 'Spectrum',
        body: 'The set of eigenvalues of $A$, denoted $\\sigma(A)$. Counted with algebraic multiplicity, it has exactly $n$ elements (over $\\mathbb{C}$); without multiplicity it has at most $n$.',
      },
    ],

    theorems: [
      {
        name: 'Distinct eigenvalues imply diagonalizability',
        statement: 'If $A$ is $n \\times n$ with $n$ distinct (real or complex) eigenvalues, then $A$ is diagonalizable.',
        intuition: 'Eigenvectors associated with distinct eigenvalues are linearly independent (different scaling factors prevent collapse). With $n$ distinct eigenvalues you get $n$ independent eigenvectors, which form a basis. The converse fails: matrices with repeated eigenvalues can still be diagonalizable (e.g., the identity), but only if the geometric multiplicity of each repeated eigenvalue matches its algebraic multiplicity.',
      },
      {
        name: 'Powers via diagonalization',
        statement: 'If $A = V \\Lambda V^{-1}$ is diagonalizable, then $A^k = V \\Lambda^k V^{-1}$ for every nonnegative integer $k$.',
        intuition: 'The factors $V V^{-1} = I$ telescope: $A^2 = V \\Lambda V^{-1} V \\Lambda V^{-1} = V \\Lambda^2 V^{-1}$, and so on. This converts an expensive computation (multiplying $A$ by itself $k$ times) into a trivial one (raising scalars on the diagonal to the $k$th power).',
      },
      {
        name: 'Eigenvalue invariants',
        statement: 'For diagonalizable $A$, $\\text{tr}(A) = \\sum_i \\lambda_i$ and $\\det(A) = \\prod_i \\lambda_i$. These formulas hold for any square matrix, with eigenvalues counted by algebraic multiplicity.',
        intuition: 'In the eigenbasis, $A$ becomes $\\Lambda = \\text{diag}(\\lambda_i)$ whose trace and determinant are visibly the sum and product. Trace and determinant are similarity-invariants, so the formulas hold in the original basis too. These give powerful sanity checks on eigenvalue computations.',
      },
    ],

    keyFormulas: [
      'A V = V \\Lambda \\;\\Longleftrightarrow\\; A = V \\Lambda V^{-1}',
      'A^k = V \\Lambda^k V^{-1}',
      '\\text{tr}(A) = \\lambda_1 + \\cdots + \\lambda_n',
      '\\det(A) = \\lambda_1 \\cdots \\lambda_n',
    ],
  },

  explore: {
    vizComponent: 'DiagonalizationViz',
    description: 'Three linked panels visualizing the same $2 \\times 2$ transformation: (1) the unit circle and its image under $A$ in the standard basis; (2) the eigenbasis grid (parallelogram tiling spanned by $\\mathbf{v}_1, \\mathbf{v}_2$); (3) the diagonal action $\\Lambda$ on the unit circle in eigencoordinates. The user picks $A$ from presets or sliders. The viz highlights how the same transformation looks like a complex skew in standard coordinates but pure axis scaling in eigencoordinates.',
    misconception: {
      title: '"Distinct eigenvalues" and "diagonalizable" are not the same condition',
      body: `
Distinct eigenvalues imply diagonalizability, but the converse is false. The identity matrix $I$ has only one eigenvalue (1) repeated $n$ times, but it is already diagonal, hence trivially diagonalizable. A matrix is diagonalizable when geometric multiplicity equals algebraic multiplicity for every eigenvalue, which is automatic when all eigenvalues are distinct (algebraic multiplicity 1 forces geometric multiplicity 1) but can also occur for repeated eigenvalues if the eigenspace is large enough.

Conversely, the matrix $\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ has eigenvalue 0 with algebraic multiplicity 2 but geometric multiplicity 1 (only $(1,0)^T$ is an eigenvector). It is not diagonalizable. Such defective matrices require [[jordan-form|Jordan canonical form]] from Chapter 8.

A second confusion: students sometimes write the diagonalization with the $V$ and $V^{-1}$ on the wrong sides. The correct statement is $A = V \\Lambda V^{-1}$, with $V$ on the LEFT and $V^{-1}$ on the RIGHT. To remember which is which: think about what $V$ does. The columns of $V$ are eigenvectors expressed in the original basis, so $V$ converts eigenbasis coordinates into original coordinates. To apply $A$ in the original basis: first convert input to eigenbasis ($V^{-1}$), then apply diagonal scaling ($\\Lambda$), then convert back ($V$). Reading right-to-left: $V \\Lambda V^{-1}$.

A third trap involves the order of eigenvectors and eigenvalues. The columns of $V$ must align with the diagonal entries of $\\Lambda$: if $\\mathbf{v}_1$ is the first column of $V$, then $\\lambda_1$ must be the first diagonal entry of $\\Lambda$. Reordering one without the other is a common error. The relationship is $A V = V \\Lambda$, which becomes $A \\mathbf{v}_i = \\lambda_i \\mathbf{v}_i$ when read column-by-column.

Finally: complex eigenvalues with real $A$. A real matrix can have complex eigenvalues that come in conjugate pairs $a \\pm bi$. Diagonalization is then over $\\mathbb{C}$, not $\\mathbb{R}$. Real diagonalization fails, but the matrix is "block-diagonalizable" with $2 \\times 2$ rotation-scaling blocks (Chapter 8). For this section, the assumption is $n$ distinct real eigenvalues, where everything works in $\\mathbb{R}$.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1: Find eigenvalues',
        body: 'Diagonalize $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$. Characteristic polynomial: $\\det(A - \\lambda I) = (4-\\lambda)(3-\\lambda) - 2 = \\lambda^2 - 7\\lambda + 10 = (\\lambda - 5)(\\lambda - 2)$. Eigenvalues: $\\lambda_1 = 5$, $\\lambda_2 = 2$ (distinct, so $A$ is diagonalizable).',
      },
      {
        title: 'Step 2: Find eigenvectors',
        body: 'For $\\lambda_1 = 5$: $(A - 5I)\\mathbf{v} = 0$ gives $\\begin{pmatrix} -1 & 1 \\\\ 2 & -2 \\end{pmatrix} \\mathbf{v} = 0$, so $\\mathbf{v}_1 = (1, 1)^T$. For $\\lambda_2 = 2$: $(A - 2I)\\mathbf{v} = 0$ gives $\\begin{pmatrix} 2 & 1 \\\\ 2 & 1 \\end{pmatrix} \\mathbf{v} = 0$, so $\\mathbf{v}_2 = (1, -2)^T$.',
      },
      {
        title: 'Step 3: Assemble and verify',
        body: 'Set $V = \\begin{pmatrix} 1 & 1 \\\\ 1 & -2 \\end{pmatrix}$, $\\Lambda = \\begin{pmatrix} 5 & 0 \\\\ 0 & 2 \\end{pmatrix}$. Compute $V^{-1} = \\frac{1}{-3}\\begin{pmatrix} -2 & -1 \\\\ -1 & 1 \\end{pmatrix} = \\frac{1}{3}\\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$. Sanity check: $\\text{tr}(A) = 7 = 5 + 2 = \\text{tr}(\\Lambda)$, $\\det(A) = 10 = 5 \\cdot 2 = \\det(\\Lambda)$.',
      },
    ],

    problems: [
      {
        id: 'P-7.4a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'A $3 \\times 3$ matrix $A$ has eigenvalues $\\lambda_1 = 2, \\lambda_2 = -1, \\lambda_3 = 4$. Which statement must be true?',
        choices: [
          { label: 'A' as const, body: '$\\det(A) = 5$ and $\\text{tr}(A) = 5$.' },
          { label: 'B' as const, body: '$\\det(A) = -8$ and $\\text{tr}(A) = 5$.' },
          { label: 'C' as const, body: '$\\det(A) = 5$ and $\\text{tr}(A) = 7$.' },
          { label: 'D' as const, body: '$A$ is diagonalizable and invertible.' },
          { label: 'E' as const, body: 'Both B and D.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'Determinant equals the PRODUCT of eigenvalues (with multiplicity): $2 \\cdot (-1) \\cdot 4 = -8$. Trace equals their SUM: $2 + (-1) + 4 = 5$. With three distinct eigenvalues for a $3 \\times 3$ matrix, the eigenvectors are automatically linearly independent, so $A$ is diagonalizable. None of the eigenvalues is zero, so $A$ is invertible.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Computes $\\det$ as the SUM of eigenvalues instead of the product.' },
            { choice: 'B' as const, why: 'Correct numerical values, but incomplete. (D) is also true; (E) combines them.' },
            { choice: 'C' as const, why: 'Computes $\\text{tr}$ as the product instead of the sum.' },
            { choice: 'D' as const, why: 'True but incomplete; the determinant/trace facts also hold.' },
          ],
        },
      },
      {
        id: 'P-7.4b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A $4 \\times 4$ matrix $A$ has eigenvalues $\\lambda_1 = 3, \\lambda_2 = -2, \\lambda_3 = 5$, with $\\lambda_4$ unknown. If $\\det(A) = 60$, what is $\\lambda_4$?',
        choices: [
          { label: 'A' as const, body: '2' },
          { label: 'B' as const, body: '$-2$' },
          { label: 'C' as const, body: '6' },
          { label: 'D' as const, body: '$-6$' },
          { label: 'E' as const, body: '4' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: '$\\det(A) = \\lambda_1 \\lambda_2 \\lambda_3 \\lambda_4 = 3 \\cdot (-2) \\cdot 5 \\cdot \\lambda_4 = -30 \\lambda_4 = 60$. So $\\lambda_4 = -2$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Sign error: solves $30 \\lambda_4 = 60$ instead of $-30 \\lambda_4 = 60$.' },
            { choice: 'C' as const, why: 'Uses trace instead of determinant somewhere; or solves $10 \\lambda_4 = 60$.' },
            { choice: 'D' as const, why: 'Drops the negative sign on $\\lambda_2$ in the product.' },
            { choice: 'E' as const, why: 'Confuses with a different relationship (perhaps $4! = 24$ or pattern-matching).' },
          ],
        },
      },
      {
        id: 'P-7.4c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A $2 \\times 2$ matrix $A$ has eigenvalues $\\lambda_1 = 2, \\lambda_2 = -1$. What are the eigenvalues of $A^3$?',
        choices: [
          { label: 'A' as const, body: '$8, -1$' },
          { label: 'B' as const, body: '$6, -3$' },
          { label: 'C' as const, body: '$2, -1$' },
          { label: 'D' as const, body: '$8, 1$' },
          { label: 'E' as const, body: '$\\sqrt[3]{2}, \\sqrt[3]{-1}$' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'If $A \\mathbf{v} = \\lambda \\mathbf{v}$, then $A^3 \\mathbf{v} = A^2 (A \\mathbf{v}) = A^2 (\\lambda \\mathbf{v}) = \\lambda^3 \\mathbf{v}$. So eigenvalues cube: $\\lambda_1^3 = 8, \\lambda_2^3 = -1$. Eigenvectors are unchanged.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Multiplies by 3 instead of cubing: $\\lambda \\to 3\\lambda$. This is the rule for $3A$, not $A^3$.' },
            { choice: 'C' as const, why: 'Eigenvalues unchanged. This is what happens to eigenVECTORS, not eigenvalues.' },
            { choice: 'D' as const, why: '$|-1|^3 = 1$ but the sign matters. $(-1)^3 = -1$, not $+1$.' },
            { choice: 'E' as const, why: 'Reverses the operation, taking cube roots. This would describe eigenvalues of $A^{1/3}$.' },
          ],
        },
      },
    ],
  },
};
