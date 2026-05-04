import type { Concept } from '../types';

export const qrDecomposition: Concept = {
  id: 'qr-decomposition',
  unitId: 'ch5',
  number: '5.7',
  title: 'QR Decomposition',
  blurb: 'Every invertible matrix factors as orthogonal × upper triangular — and the columns of $Q$ come from Gram-Schmidt.',
  tier: 'full',

  learn: {
    overview: `
The **QR decomposition** factors an $n \\times n$ invertible matrix $A$ as

$$A = Q R,$$

where $Q$ is an [[orthogonal-transformations|orthogonal matrix]] and $R$ is an upper triangular matrix. This factorization is the matrix-algebraic packaging of [[gram-schmidt|Gram-Schmidt orthogonalization]] applied to the columns of $A$.

The construction: apply Gram-Schmidt to the columns $a_1, a_2, \\dots, a_n$ of $A$ to produce orthonormal vectors $q_1, q_2, \\dots, q_n$ with $\\text{span}\\{q_1, \\dots, q_j\\} = \\text{span}\\{a_1, \\dots, a_j\\}$ for each $j$. The columns $q_j$ become the columns of $Q$. Each $a_j$ can be expressed as a linear combination of $q_1, \\dots, q_j$ (only earlier $q$'s, by Gram-Schmidt), with coefficients $r_{ij} = \\langle a_j, q_i \\rangle$ for $i \\leq j$. These coefficients populate the upper-triangular matrix $R$:

$$a_j = \\sum_{i=1}^{j} r_{ij} q_i, \\quad r_{ij} = \\langle a_j, q_i \\rangle.$$

The condition $i \\leq j$ ensures $R$ is upper triangular — entries $r_{ij}$ with $i > j$ are zero by Gram-Schmidt.

For invertible $A$, the QR decomposition with the additional constraint that $R$ has positive diagonal entries is **unique**. Without this constraint, there is a sign ambiguity for each column, but pinning down the diagonal sign of $R$ removes it.

Applications of QR are extensive:

**Solving linear systems.** To solve $A x = b$, write $QR x = b$, then $R x = Q^T b$ (since $Q^{-1} = Q^T$). The right-hand side $Q^T b$ is a single matrix-vector product, and $R x = Q^T b$ is upper triangular, so it is solved by back substitution. Total cost: $O(n^2)$ per system after the initial $O(n^3)$ factorization. This is competitive with [[lu-decomposition|LU decomposition]] for solving systems repeatedly.

**[[least-squares|Least squares]].** For an overdetermined system $A x = b$ with $A$ tall (more rows than columns) and full column rank, $A = Q R$ with $Q$ having orthonormal columns and $R$ square upper triangular. The least-squares solution is $\\hat{x} = R^{-1} Q^T b$, found by back substitution on $R \\hat{x} = Q^T b$. This is the most numerically stable way to compute least-squares solutions.

**Eigenvalues via QR iteration.** The QR algorithm — repeatedly factoring $A_k = Q_k R_k$ and forming $A_{k+1} = R_k Q_k$ — converges to a triangular matrix whose diagonal contains the eigenvalues of the original $A$. This is one of the workhorse algorithms of numerical linear algebra.

**Singularity detection.** The diagonal entries of $R$ tell you about $A$'s [[rank-and-conditioning|conditioning]]: $A$ is singular iff some $r_{ii} = 0$, and small diagonal entries of $R$ indicate near-singular $A$.

QR is the algebraic shadow of [[gram-schmidt|Gram-Schmidt]]. Every Gram-Schmidt computation produces a QR factorization implicitly; every QR factorization can be computed by Gram-Schmidt (or more numerically stable variants like Householder reflections or Givens rotations). The relationship is so tight that "doing Gram-Schmidt" and "computing the QR decomposition" are essentially the same operation, viewed from two angles.

A subtle but important point: the *standard* construction of QR via Gram-Schmidt is numerically unstable — accumulated roundoff causes the computed $Q$ to drift from orthogonality. In practice, **Householder reflections** or **modified Gram-Schmidt** are used instead, both of which produce more accurate $Q$'s in floating-point arithmetic. The mathematical content (factor $A$ as orthogonal × triangular) is the same; only the algorithm differs.
    `.trim(),

    definitions: [
      {
        term: 'QR decomposition',
        body: 'For a matrix $A \\in \\mathbb{R}^{n \\times n}$ (or $\\mathbb{R}^{m \\times n}$ with $m \\geq n$): the factorization $A = Q R$ where $Q$ has orthonormal columns and $R$ is upper triangular.',
      },
      {
        term: 'Reduced (or "thin") QR',
        body: 'For an $m \\times n$ matrix $A$ with $m \\geq n$ and full column rank: the factorization $A = Q_1 R_1$ where $Q_1$ is $m \\times n$ with orthonormal columns and $R_1$ is $n \\times n$ upper triangular.',
      },
      {
        term: 'Full QR',
        body: 'The "completed" version of reduced QR: $A = Q R$ where $Q$ is $m \\times m$ orthogonal and $R$ is $m \\times n$ with the bottom $m - n$ rows zero.',
      },
    ],

    theorems: [
      {
        name: 'Existence and uniqueness of QR',
        statement: 'Every invertible $n \\times n$ matrix $A$ has a QR decomposition $A = Q R$ with $Q$ orthogonal and $R$ upper triangular. The decomposition is unique if we require the diagonal entries of $R$ to be positive.',
        intuition: 'Existence comes from applying Gram-Schmidt to the columns of $A$. Uniqueness with positive-diagonal $R$ comes from removing the sign ambiguity at each Gram-Schmidt step.',
      },
      {
        name: 'QR-based linear system solving',
        statement: 'For an invertible $A = QR$, the system $A x = b$ is equivalent to $R x = Q^T b$, which is upper triangular and solved by back substitution.',
        intuition: 'Multiply $Ax = QRx = b$ by $Q^T$ on the left to get $Rx = Q^T b$. Since $Q^T b$ is a single matrix-vector product (cheap) and $R$ is triangular (back substitution), the system is solved in $O(n^2)$ after the $O(n^3)$ factorization.',
      },
      {
        name: 'Singularity through R',
        statement: 'For a square matrix $A$ with QR decomposition $A = Q R$: $A$ is invertible iff $R$ has all nonzero diagonal entries. Equivalently, $A$ is singular iff some $r_{ii} = 0$.',
        intuition: '$\\det(A) = \\det(Q) \\det(R) = \\pm \\det(R) = \\pm \\prod r_{ii}$. So $A$ is invertible iff every $r_{ii} \\neq 0$.',
      },
    ],

    keyFormulas: [
      'A = Q R',
      'Q^T Q = I',
      'r_{ij} = \\langle a_j, q_i \\rangle \\quad (i \\leq j)',
      'A x = b \\implies R x = Q^T b',
    ],
  },

  explore: {
    vizComponent: 'QRDecompositionViz',
    description: 'Pick a $3 \\times 3$ matrix $A$ and watch the QR decomposition computed step-by-step via Gram-Schmidt: each column $a_j$ gets orthogonalized against the previous $q_i$\'s, normalized to produce $q_j$, with the orthogonalization coefficients populating the corresponding column of $R$. The viz also verifies $A = QR$ at the end and shows $Q^T Q = I$.',
    misconception: {
      title: 'QR exists for any matrix; the *unique* version requires positive diagonal $R$',
      body: `
A common error is thinking QR fails to exist for singular or rank-deficient matrices. It does exist — the diagonal of $R$ just contains zeros where the corresponding Gram-Schmidt step produced a zero vector (because the column was already in the span of the earlier ones). The decomposition is no longer unique in that case (there are multiple choices for $q_j$ when $r_{jj} = 0$), and it provides direct evidence of singularity.

A second misconception: confusing "$Q$ is orthogonal" with "$Q$ is symmetric" or "$Q = Q^T$." Orthogonal means $Q^T Q = I$, which is generally a different condition than symmetry. An orthogonal matrix can be far from symmetric — $R_{90°}$ rotation is orthogonal but very much not symmetric. The transpose of an orthogonal matrix is its *inverse*, not the matrix itself.

A third trap: thinking that $Q$ in the QR decomposition is simply the matrix of normalized columns of $A$. This would be the result of "normalize each column without orthogonalizing" — which gives a matrix with unit-length columns but not orthogonal columns. The Gram-Schmidt procedure includes a critical projection-subtraction step: each new column gets its component along previous $q$'s subtracted before normalization. Without this step, the columns of $Q$ are merely normalized, not orthonormal.

A fourth misconception: writing $A^{-1} = R^{-1} Q^{-1} = R^{-1} Q$ "since $Q$ is orthogonal." Almost — but the correct expression is $A^{-1} = R^{-1} Q^T$, since $Q^{-1} = Q^T$ (not $Q^{-1} = Q$, which would mean $Q^2 = I$ — a special case, not general).
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute QR of a $2 \\times 2$ matrix',
        body: 'For $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ with columns $a_1 = (1, 0)^T$ and $a_2 = (2, 3)^T$. Apply Gram-Schmidt: $q_1 = a_1 / \\|a_1\\| = (1, 0)^T$ (already unit-length). Then $r_{11} = \\|a_1\\| = 1$ and $r_{12} = \\langle a_2, q_1 \\rangle = 2$.',
      },
      {
        title: 'Continue Gram-Schmidt',
        body: 'Subtract the projection: $a_2 - r_{12} q_1 = (2, 3)^T - 2 (1, 0)^T = (0, 3)^T$. Then $q_2 = (0, 3)^T / 3 = (0, 1)^T$ and $r_{22} = 3$. So $Q = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = I$ and $R = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix} = A$. Verify: $QR = I \\cdot A = A$. ✓ (This is a degenerate case where $A$ was already upper triangular with orthogonal columns.)',
      },
    ],

    problems: [
      {
        id: 'P-5.7a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A matrix $A \\in \\mathbb{R}^{3 \\times 3}$ has QR decomposition $A = Q R$ where $Q$ is orthogonal and $R$ is upper triangular. If $R$ has a zero on its diagonal, what can we conclude about $A$?',
        choices: [
          { label: 'A' as const, body: '$A$ must be the zero matrix.' },
          { label: 'B' as const, body: '$A$ is not invertible.' },
          { label: 'C' as const, body: '$A$ has orthogonal columns.' },
          { label: 'D' as const, body: 'The QR decomposition does not exist.' },
          { label: 'E' as const, body: '$A$ is symmetric.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Since $A = QR$ and $Q$ is invertible (orthogonal, with $\\det Q = \\pm 1 \\neq 0$), $A$ is singular iff $R$ is singular. $R$ is upper triangular, so $\\det(R) = \\prod r_{ii}$. A zero on the diagonal makes $\\det(R) = 0$, hence $\\det(A) = 0$, hence $A$ is not invertible.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Singular does not mean zero. A singular matrix can have many nonzero entries — it just has determinant zero. For example, $\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$ is singular but not zero.' },
            { choice: 'C' as const, why: 'Confuses properties of $Q$ with properties of $A$. The orthogonality belongs to the factor $Q$, not to $A$.' },
            { choice: 'D' as const, why: 'QR exists even for singular matrices — singularity manifests as zero diagonal entries in $R$, not as failure of the decomposition.' },
            { choice: 'E' as const, why: 'A zero on $R$\'s diagonal tells us about singularity, not symmetry. These are unrelated properties.' },
          ],
        },
      },
      {
        id: 'P-5.7b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the QR decomposition $A = Q R$ of an invertible $n \\times n$ matrix $A$, where $Q$ is orthogonal and $R$ is upper triangular. If we require the diagonal entries of $R$ to be positive, then:',
        choices: [
          { label: 'A' as const, body: 'The decomposition may not exist.' },
          { label: 'B' as const, body: 'The decomposition exists but may not be unique.' },
          { label: 'C' as const, body: 'The decomposition exists and is unique.' },
          { label: 'D' as const, body: '$Q$ must equal $A$ and $R$ must be the identity.' },
          { label: 'E' as const, body: '$R$ must be orthogonal as well.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'For an invertible $A$, the QR decomposition with positive-diagonal $R$ is unique. The Gram-Schmidt construction produces a $Q$ and $R$, and the sign ambiguity in each Gram-Schmidt step is resolved by requiring $r_{jj} > 0$. Without this constraint, signs can be flipped column-by-column.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'QR exists for all matrices (with the appropriate generalization for non-square matrices). For invertible square matrices, the decomposition is straightforward.' },
            { choice: 'B' as const, why: 'Without the positive-diagonal requirement, the decomposition is not unique. Adding the constraint pins down a unique decomposition.' },
            { choice: 'D' as const, why: 'This would be true only if $A$ were already orthogonal. For general invertible $A$, $Q \\neq A$ and $R \\neq I$.' },
            { choice: 'E' as const, why: '$R$ is upper triangular, not orthogonal in general. Orthogonal triangular matrices are diagonal with $\\pm 1$ entries — a very restrictive class.' },
          ],
        },
      },
      {
        id: 'P-5.7c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $A$ be an $n \\times n$ invertible matrix with columns $a_1, \\dots, a_n$, and let $A = Q R$ be its QR decomposition. Which statement best describes the relationship between Gram-Schmidt and QR?',
        choices: [
          { label: 'A' as const, body: 'The columns of $Q$ are obtained by normalizing the columns of $A$; $R$ records the original norms.' },
          { label: 'B' as const, body: 'The columns of $Q$ are the Gram-Schmidt orthonormalization of $a_1, \\dots, a_n$; the entry $r_{ij}$ of $R$ is $\\langle a_j, q_i \\rangle$ for $i \\leq j$.' },
          { label: 'C' as const, body: 'The columns of $R$ are the Gram-Schmidt orthonormalization of $a_1, \\dots, a_n$; $Q$ records the change of basis.' },
          { label: 'D' as const, body: 'Gram-Schmidt produces $Q$; the matrix $R = Q^T A$ is diagonal with the norms $\\|a_i\\|$ on the diagonal.' },
          { label: 'E' as const, body: 'Gram-Schmidt and QR solve different problems: Gram-Schmidt orthogonalizes vectors while QR factors a matrix.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Gram-Schmidt applied to $a_1, \\dots, a_n$ produces orthonormal $q_1, \\dots, q_n$ — which become the columns of $Q$. Each $a_j$ is a linear combination of $q_1, \\dots, q_j$ (only earlier $q$\'s appear, by the staircase nature of Gram-Schmidt), so $a_j = \\sum_{i=1}^{j} r_{ij} q_i$ with $r_{ij} = \\langle a_j, q_i \\rangle$. This gives the upper-triangular $R$ exactly.',
          partialCredit: '(D) earns partial credit. The formula $R = Q^T A$ is correct (multiply $A = QR$ by $Q^T$ on the left), but $R$ is upper triangular, NOT diagonal. The student understands the algebraic relationship but the structural property of $R$ is misstated.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Normalizing columns without orthogonalizing does not produce an orthogonal matrix. The projection-subtraction step is the heart of Gram-Schmidt and the source of orthogonality.' },
            { choice: 'C' as const, why: 'Reverses the roles of $Q$ and $R$. The orthogonal columns are in $Q$, not $R$.' },
            { choice: 'D' as const, why: 'The formula is correct but $R$ is upper triangular, not diagonal. Earns partial credit.' },
            { choice: 'E' as const, why: 'Gram-Schmidt and QR are the same procedure viewed differently. QR is the matrix packaging of Gram-Schmidt.' },
          ],
        },
      },
      {
        id: 'P-5.7d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'An $n \\times n$ invertible matrix $A$ has QR decomposition $A = Q R$. Using this factorization, the system $A x = b$ reduces to:',
        choices: [
          { label: 'A' as const, body: 'Solving the lower triangular system $R^T x = Q b$.' },
          { label: 'B' as const, body: 'Solving the upper triangular system $R x = Q b$.' },
          { label: 'C' as const, body: 'Computing $x = R^T Q^T b$.' },
          { label: 'D' as const, body: 'Computing $x = Q R^{-1} b$.' },
          { label: 'E' as const, body: 'Solving the upper triangular system $R x = Q^T b$.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'From $QR x = b$, multiply both sides on the left by $Q^T$. Since $Q$ is orthogonal, $Q^T Q = I$, giving $Rx = Q^T b$. The right-hand side $Q^T b$ is a cheap matrix-vector product, and $R$ is upper triangular, so the system is solved by back substitution.',
          partialCredit: '(B) earns partial credit. The student correctly identifies the upper-triangular structure but uses $Q$ instead of $Q^T$ on the right. This shows understanding of the triangular form but not full internalization of $Q^{-1} = Q^T$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Transposes the wrong factor. The lower-triangular system would be $R^T x = $ something, but the correct flip uses $Q^T$, not $R^T$.' },
            { choice: 'B' as const, why: 'Uses $Q$ instead of $Q^T$. Earns partial credit.' },
            { choice: 'C' as const, why: '$R^T Q^T = (Q R)^T = A^T$, so this gives $A^T b$, not $A^{-1} b$. Confuses transpose with inverse.' },
            { choice: 'D' as const, why: '$A^{-1} = R^{-1} Q^T$ (products invert in reverse order: $(QR)^{-1} = R^{-1} Q^{-1} = R^{-1} Q^T$). The proposed $Q R^{-1}$ has $Q$ in the wrong place. Also, explicitly computing $R^{-1}$ defeats the purpose of using QR for stable triangular solves.' },
          ],
        },
      },
    ],
  },
};
