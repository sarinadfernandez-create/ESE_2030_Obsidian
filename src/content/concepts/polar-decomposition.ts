import type { Concept } from '../types';

export const polarDecomposition: Concept = {
  id: 'polar-decomposition',
  unitId: 'ch10',
  number: '10.2',
  title: 'Polar Decomposition',
  blurb: 'Every square matrix factors as a rotation times a symmetric stretch: $A = QS$. The polar decomposition is the matrix version of writing a complex number in polar form.',
  tier: 'full',
  learn: {
    overview: `
For a nonzero complex number $z = x + iy$, the polar form $z = re^{i\\theta}$ separates magnitude $r = |z|$ from phase $e^{i\\theta}$ on the unit circle. The matrix version says exactly the same thing for square matrices: every $A \\in \\mathbb{R}^{n \\times n}$ factors as
$$A = QS,$$
where $Q$ is an [[orthogonal-transformations|orthogonal matrix]] (the "phase") and $S$ is a symmetric [[symmetric-spectra|positive semi-definite matrix]] (the "magnitude"). When $A$ is invertible, $S$ is positive definite and the decomposition is unique; when $A$ is singular, $Q$ has a remaining ambiguity in the kernel of $A$.

The geometric content is that any linear map factors into "stretch, then rotate." Apply $S$ first: it takes the unit sphere to an ellipsoid aligned with the eigenvectors of $S$, with semi-axes equal to the eigenvalues of $S$ (which are non-negative and equal the singular values of $A$). Then apply $Q$: it rotates that ellipsoid into its final position. The decomposition makes precise the otherwise vague claim that "every linear map is a rotation composed with a stretch." It is also the cleanest bridge between [[svd-form|SVD]] and the spectral theory of [[adjoints-and-transposes|symmetric matrices]]: writing $A = U\\Sigma V^T$ and inserting $V^T V = I$ in the middle gives $A = (UV^T)(V\\Sigma V^T)$. The first factor $Q = UV^T$ is a product of orthogonals (hence orthogonal); the second factor $S = V\\Sigma V^T$ is symmetric positive semi-definite by inspection (it has the same eigenvalues as $\\Sigma$, namely the singular values).

There is also a *left* polar decomposition $A = S'Q'$ with the stretch on the left. Setting $A = U\\Sigma V^T$ and inserting $UU^T$ instead gives $A = (U\\Sigma U^T)(UV^T) = S' Q'$ with $S' = U\\Sigma U^T$ and $Q' = UV^T$. The orthogonal factor is the *same* $Q' = Q = UV^T$ in both cases. The two stretches differ: $S$ lives in the domain frame ($V$-coordinates), $S'$ in the codomain frame ($U$-coordinates), and $S' = QSQ^T$ — they are conjugate by the rotation $Q$. The eigenvalues of $S$ and $S'$ are identical and equal the singular values of $A$.

Connections to the rest of linear algebra are direct. $S = \\sqrt{A^TA}$ is the **unique positive semi-definite square root** of $A^TA$. (Every PSD matrix has a unique PSD square root, defined by $\\sqrt{Q\\Lambda Q^T} = Q\\sqrt{\\Lambda}Q^T$ — take the non-negative square root of each eigenvalue.) When $A$ is invertible, $Q = AS^{-1} = A(A^TA)^{-1/2}$. When $A$ itself is symmetric and PSD, $A = A \\cdot I$ is already a polar decomposition with $Q = I$. When $A$ is orthogonal, $A = A \\cdot I$ again works but with $Q = A$ and $S = I$ — pure rotation, no stretching. The polar decomposition therefore quantifies how far $A$ is from being orthogonal: $S - I$ measures the deviation from a pure rotation.

The polar decomposition has a striking application: the **closest orthogonal matrix** to a given matrix $A$ (in Frobenius norm) is the orthogonal factor $Q = UV^T$ from the SVD. If you have a noisy measurement of what should be a rotation (e.g., an estimated camera pose, a learned alignment matrix, an animation rig that has drifted), the standard repair operation is "SVD-and-throw-away-the-singular-values": compute $A = U\\Sigma V^T$ and replace $A$ with $UV^T$. This is the orthogonal Procrustes problem solution. The proof is a direct consequence of unitary invariance of the Frobenius norm and the SVD: among all orthogonal $R$, the one minimizing $\\|A - R\\|_F$ is $UV^T$, because $\\|A - R\\|_F^2 = \\sum(\\sigma_i - 1)^2 + \\text{positive remainder}$ which is minimized when the remainder vanishes.

Beyond the practical applications, the polar decomposition is the natural bridge between [[svd-form|SVD]] and PCA. The PSD factor $S = V\\Sigma V^T$ is the matrix whose eigenvalues are the singular values of $A$ and whose eigenvectors are the right singular vectors. This means computing the singular values is the same problem as diagonalizing $A^TA$ (which is $S^2$), and the right singular vectors are the principal directions of variation when $A$ is interpreted as data. This will be the central fact of Unit 11.
    `.trim(),
    definitions: [
      {
        term: 'Polar decomposition (right)',
        body: 'A factorization $A = QS$ with $Q$ orthogonal and $S$ symmetric positive semi-definite. Exists for every $A \\in \\mathbb{R}^{n \\times n}$; unique when $A$ is invertible.',
      },
      {
        term: 'Polar decomposition (left)',
        body: 'A factorization $A = S\'Q$ with $Q$ the same orthogonal factor as the right polar decomposition and $S\' = QSQ^T$ symmetric positive semi-definite.',
      },
      {
        term: 'Positive semi-definite square root',
        body: 'For a symmetric PSD matrix $M = Q\\Lambda Q^T$, the unique symmetric PSD matrix $\\sqrt{M} = Q\\sqrt{\\Lambda}Q^T$ satisfying $(\\sqrt{M})^2 = M$. Constructed by taking non-negative square roots of eigenvalues.',
      },
      {
        term: 'Closest orthogonal matrix',
        body: 'For invertible $A$ with SVD $A = U\\Sigma V^T$, the orthogonal matrix $Q = UV^T$ minimizes $\\|A - R\\|_F$ over all orthogonal $R$. Equal to the orthogonal factor in the polar decomposition.',
      },
    ],
    theorems: [
      {
        name: 'Existence and uniqueness of polar decomposition',
        statement: 'Every square matrix $A$ admits a polar decomposition $A = QS$ with $Q$ orthogonal and $S$ symmetric positive semi-definite. If $A$ is invertible, $S$ is positive definite and the decomposition is unique.',
        intuition: 'Construct from the [[svd-form|SVD]]: $A = U\\Sigma V^T = (UV^T)(V\\Sigma V^T)$. The first factor $Q = UV^T$ is orthogonal (product of orthogonals); the second factor $S = V\\Sigma V^T$ is symmetric PSD (it is $V$ conjugating the non-negative diagonal $\\Sigma$). Uniqueness when $A$ is invertible: $A^TA = S^TQ^TQS = S^2$, and a positive definite matrix has a unique positive definite square root, so $S$ is forced. Then $Q = AS^{-1}$ is forced. When $A$ is singular, $S$ is still unique but $Q$ has freedom on the kernel of $A$.',
      },
      {
        name: 'Orthogonal Procrustes',
        statement: 'For $A \\in \\mathbb{R}^{n \\times n}$ with SVD $A = U\\Sigma V^T$, the orthogonal matrix $R$ minimizing $\\|A - R\\|_F$ is $R = UV^T$, the orthogonal factor of the polar decomposition.',
        intuition: 'Frobenius norm is unitarily invariant: $\\|A - R\\|_F = \\|U^T(A - R)V\\|_F = \\|\\Sigma - U^TRV\\|_F$. Let $W = U^TRV$ (still orthogonal). Minimize $\\|\\Sigma - W\\|_F^2 = \\sum(\\sigma_i - w_{ii})^2 + (\\text{off-diagonal terms})$. Since $W$ is orthogonal, $\\sum w_{ii}^2 \\leq n$, and $\\sum_i \\sigma_i w_{ii}$ is maximized when $W = I$ (taking diagonal entries to be 1, all others zero). So $U^TRV = I$, hence $R = UV^T$.',
      },
      {
        name: 'Polar vs SVD',
        statement: 'The polar decomposition $A = QS$ and the SVD $A = U\\Sigma V^T$ are related by $Q = UV^T$ and $S = V\\Sigma V^T$. The eigenvalues of $S$ equal the singular values of $A$; the eigenvectors of $S$ equal the right singular vectors of $A$.',
        intuition: 'Polar decomposition compresses the SVD into a "rotation $\\times$ stretch" pair. The two factorizations contain the same information, but SVD separates the rotation into two halves (one in the domain, one in the codomain), while the polar form bundles them into a single rotation. SVD is therefore the canonical theoretical object; polar is the canonical applied object (closest orthogonal, square root, smooth interpolation between rotations).',
      },
    ],
    keyFormulas: [
      'A = QS, \\quad Q \\text{ orthogonal}, \\quad S = S^T \\succeq 0',
      'S = \\sqrt{A^TA} = V\\Sigma V^T',
      'Q = UV^T = A(A^TA)^{-1/2} \\text{ when } A \\text{ is invertible}',
      'A = S\'Q, \\quad S\' = U\\Sigma U^T = QSQ^T',
      '\\text{argmin}_{R \\text{ orth.}} \\|A - R\\|_F = UV^T',
    ],
  },
  explore: {
    vizComponent: 'PolarDecompositionViz',
    description: 'A user-controlled $2 \\times 2$ matrix $A$ is decomposed live into $Q$ and $S$. Three panels animate side-by-side: starting unit square (domain), after stretching by $S$ (intermediate ellipse aligned with eigenvectors of $S$), after rotating by $Q$ (final image). A toggle compares with the SVD\'s three-step decomposition $V^T \\to \\Sigma \\to U$. A separate "Procrustes" mode adds a slider that smoothly interpolates $A$ toward its closest orthogonal $Q$ by morphing $S$ to $I$.',
    misconception: {
      title: 'The polar decomposition is NOT the SVD, even though they contain the same information.',
      body: `Students often see the formula $A = (UV^T)(V\\Sigma V^T)$ and treat polar as a notational variant of SVD. The factorizations are equivalent in content (one determines the other) but very different in form, and they answer different questions.

The first confusion: polar has TWO factors ($QS$); SVD has THREE ($U\\Sigma V^T$). The polar decomposition collapses the SVD's two orthogonal factors into a single one by absorbing $V^T$ into the stretch. This is a real loss of information at the level of structure: SVD tells you the orientation in the domain ($V$) AND the orientation in the codomain ($U$) AND the singular values ($\\Sigma$) separately; polar gives you one rotation ($Q = UV^T$, the composite) and one symmetric stretch ($S = V\\Sigma V^T$, which encodes $V$ and $\\Sigma$ together).

The second confusion: students try to compute the polar decomposition by setting $Q = U$ and $S = \\Sigma V^T$. This is wrong. $\\Sigma V^T$ is not symmetric, not PSD, and not the polar stretch factor. The correct identity is $S = V\\Sigma V^T$ (a conjugation), and it requires $V$ on BOTH sides.

The third confusion: students assume the polar decomposition is unique always. It is unique when $A$ is invertible, where $S = \\sqrt{A^TA}$ uniquely determines $Q$. When $A$ is singular, $S$ is still uniquely determined as $\\sqrt{A^TA}$ (the PSD square root is always unique), but $Q$ can be rotated arbitrarily on the kernel of $A$ — the orthogonal factor is not unique in that case. This is the analog of "$0 = 0 \\cdot e^{i\\theta}$ for any $\\theta$" in complex polar form.

A fourth confusion: students assume the closest orthogonal matrix to $A$ is found by orthonormalizing the columns of $A$ via Gram-Schmidt. It is not. Gram-Schmidt gives ONE orthogonal matrix, but not the closest. The closest is $UV^T$ from the SVD. Gram-Schmidt and SVD-based orthogonalization agree when $A$ is already close to orthogonal but diverge for matrices far from orthogonality.`.trim(),
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Set up and compute $A^TA$',
        body: 'Find the polar decomposition $A = QS$ of $A = \\begin{bmatrix} 0 & 2 \\\\ -2 & 0 \\end{bmatrix}$ (a 90° rotation scaled by 2). Compute $A^TA = \\begin{bmatrix} 0 & -2 \\\\ 2 & 0 \\end{bmatrix}\\begin{bmatrix} 0 & 2 \\\\ -2 & 0 \\end{bmatrix} = \\begin{bmatrix} 4 & 0 \\\\ 0 & 4 \\end{bmatrix} = 4I$.',
      },
      {
        title: 'Step 2: Compute $S = \\sqrt{A^TA}$',
        body: '$\\sqrt{4I} = 2I$, since $(2I)^2 = 4I$ and $2I$ is symmetric positive definite. So $S = 2I = \\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix}$.',
      },
      {
        title: 'Step 3: Solve $Q = AS^{-1}$',
        body: '$S^{-1} = \\frac{1}{2}I$, so $Q = A \\cdot \\frac{1}{2}I = \\frac{1}{2}A = \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix}$. Verify: $Q$ is orthogonal (its columns are unit-length and orthogonal), and $QS = \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix}\\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix} = \\begin{bmatrix} 0 & 2 \\\\ -2 & 0 \\end{bmatrix} = A$. ✓ Geometrically: $A$ is rotation by $-90°$ scaled by $2$; the polar decomposition correctly factors this as "scale by 2, then rotate by $-90°$."',
      },
    ],
    problems: [
      {
        id: 'P-10.2a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Let $A \\in \\mathbb{R}^{n \\times n}$ be invertible with SVD $A = U\\Sigma V^T$. What is the polar decomposition $A = QS$?',
        choices: [
          { label: 'A', body: '$Q = U$, $S = \\Sigma V^T$.' },
          { label: 'B', body: '$Q = UV^T$, $S = V\\Sigma V^T$.' },
          { label: 'C', body: '$Q = V$, $S = U\\Sigma U^T$.' },
          { label: 'D', body: '$Q = U V$, $S = \\Sigma$.' },
          { label: 'E', body: '$Q = U\\Sigma$, $S = V^T$.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Insert $V^TV = I$ between the SVD factors: $A = U\\Sigma V^T = (U V^T)(V \\Sigma V^T)$. The first factor $Q = UV^T$ is orthogonal (product of orthogonals). The second factor $S = V\\Sigma V^T$ is symmetric positive definite when $A$ is invertible: it has eigenvalues $\\sigma_i > 0$ (since invertibility implies no zero singular values) with eigenvectors equal to the columns of $V$. (B) is correct.',
          trickAnalysis: [
            { choice: 'A', why: '$\\Sigma V^T$ is not symmetric (in general $V \\neq V^T$), so $S = \\Sigma V^T$ violates the requirement that the stretch factor be symmetric. This is the most common student "first guess" because it looks like a natural split.' },
            { choice: 'C', why: 'Swaps $U$ and $V$. $V$ alone is not the right rotation: $V$ rotates the domain, $U$ rotates the codomain, and the polar Q must combine both as $UV^T$. Also $U\\Sigma U^T$ is the LEFT polar stretch $S\'$, not the right polar stretch $S$.' },
            { choice: 'D', why: '$UV$ is not a valid product in general (dimensions $m \\times m$ times $n \\times n$ do not match unless $m = n$, and even then $UV \\neq UV^T$). Also $\\Sigma$ alone is not symmetric in shape for non-square $A$. The polar S must be symmetric.' },
            { choice: 'E', why: '$U\\Sigma$ is not orthogonal (it scales by singular values), and $V^T$ alone is not symmetric. Both factors fail the polar decomposition requirements simultaneously.' },
          ],
        },
      },
      {
        id: 'P-10.2b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A robotics engineer measures a noisy rotation matrix $A = \\begin{bmatrix} 1.01 & -0.05 \\\\ 0.03 & 0.98 \\end{bmatrix}$ from sensor data. To "snap" $A$ to the closest true rotation matrix (closest orthogonal matrix in Frobenius norm), what is the correct procedure?',
        choices: [
          { label: 'A', body: 'Apply Gram-Schmidt orthonormalization to the columns of $A$.' },
          { label: 'B', body: 'Compute the SVD $A = U\\Sigma V^T$ and return $A_{\\text{snap}} = U\\Sigma V^T$ with $\\Sigma$ unchanged.' },
          { label: 'C', body: 'Compute the SVD $A = U\\Sigma V^T$ and return $A_{\\text{snap}} = UV^T$.' },
          { label: 'D', body: 'Normalize each column of $A$ to unit length, then return that matrix.' },
          { label: 'E', body: 'Compute $A_{\\text{snap}} = (A + A^T)/2$, the symmetric part of $A$.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'The orthogonal Procrustes theorem: among all orthogonal $R$, the one minimizing $\\|A - R\\|_F$ is $R = UV^T$ where $A = U\\Sigma V^T$ is the SVD. Equivalently, $R$ is the orthogonal factor of the polar decomposition $A = QS$. The procedure: SVD, replace all singular values with 1 (which is what "$UV^T$" computes — it removes $\\Sigma$). This is exactly what (C) describes.',
          partialCredit: '(A) deserves partial credit: Gram-Schmidt does produce AN orthogonal matrix with the same column span, and for matrices very close to orthogonal it produces something near the right answer. But it is not the OPTIMAL orthogonal approximation in Frobenius norm.',
          trickAnalysis: [
            { choice: 'A', why: 'Gram-Schmidt produces an orthogonal matrix whose columns span the same subspace as $A$\'s columns, but it depends on column ORDER and is not the closest orthogonal matrix to $A$. The closest orthogonal matrix is order-independent (it depends only on $A$, not on a column ordering).' },
            { choice: 'B', why: 'Returns $A$ itself unchanged. The SVD is just a factorization; reassembling the factors recovers $A$. This does nothing.' },
            { choice: 'D', why: 'Produces a matrix with unit columns but those columns are not orthogonal in general. The result is not orthogonal (and not even close to a rotation unless the columns happened to be near-orthogonal to begin with).' },
            { choice: 'E', why: 'Returns the symmetric part of $A$, which is symmetric, not orthogonal. Wrong target structure entirely. Symmetric matrices and rotations are different objects.' },
          ],
        },
      },
      {
        id: 'P-10.2c',
        format: 'multiple-choice',
        difficulty: 3,
        statement: 'Let $A = QS$ be the polar decomposition of an invertible $A \\in \\mathbb{R}^{n \\times n}$. Which statement is most TRUE?',
        choices: [
          { label: 'A', body: '$Q$ is unique, but $S$ is unique only up to sign of each diagonal entry in its diagonalization.' },
          { label: 'B', body: 'The eigenvalues of $S$ equal the singular values of $A$, and the eigenvectors of $S$ equal the right singular vectors of $A$.' },
          { label: 'C', body: 'The eigenvalues of $Q$ equal the singular values of $A$, while $S = I$.' },
          { label: 'D', body: 'If $A$ is symmetric, then $A = S$ and $Q = I$ regardless of sign of the eigenvalues.' },
          { label: 'E', body: '$S$ commutes with $Q$ for every invertible matrix $A$.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'From $S = V\\Sigma V^T$: this is the spectral decomposition of $S$ (which is symmetric PSD). The eigenvalues are the diagonal entries of $\\Sigma$, which are the singular values of $A$. The eigenvectors are the columns of $V$, which are the right singular vectors of $A$. Choice (B) states exactly this fact. The polar stretch factor IS the right-singular structure of $A$, in spectral form.',
          trickAnalysis: [
            { choice: 'A', why: 'Both $Q$ and $S$ are unique when $A$ is invertible. $S$ is the unique PSD square root of $A^TA$ (PSD square roots are unique on PSD matrices). There is no sign ambiguity in $S$ — PSD means non-negative eigenvalues, no sign choices.' },
            { choice: 'C', why: 'Categorically false. $Q$ is orthogonal so its eigenvalues are on the unit circle (modulus 1), not singular values of $A$. And $S = I$ only when $A$ is orthogonal — not in general.' },
            { choice: 'D', why: 'Partially correct (if $A$ is symmetric PSD, then $A = A$ is its own polar decomposition with $Q = I$). But for symmetric $A$ with negative eigenvalues, $S = \\sqrt{A^TA} = |A|$ (eigenvalues are $|\\lambda_i|$), and $Q$ flips signs on negative-eigenvalue eigenspaces — so $Q \\neq I$. The "regardless of sign" qualifier makes the choice wrong.' },
            { choice: 'E', why: '$Q$ and $S$ commute only when $A$ is normal ($AA^T = A^TA$). For generic invertible $A$, $Q$ and $S$ do not commute, which is exactly why the "rotation, then stretch" picture is geometrically nontrivial.' },
          ],
        },
      },
    ],
  },
};
