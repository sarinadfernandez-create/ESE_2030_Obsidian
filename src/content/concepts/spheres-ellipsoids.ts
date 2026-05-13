import type { Concept } from '../types';

export const spheresEllipsoids: Concept = {
  id: 'spheres-ellipsoids',
  unitId: 'ch10',
  number: '10.1',
  title: 'Spheres and Ellipsoids',
  blurb: 'Every linear map sends the unit sphere to an ellipsoid. The semi-axes of that ellipsoid are the singular values; the directions of the semi-axes are the left singular vectors.',
  tier: 'full',
  learn: {
    overview: `
The geometric question that motivates the [[svd-form|singular value decomposition]] is the simplest one possible: where does a [[linear-transformation-defs|linear map]] send the unit sphere? For an invertible $A: \\mathbb{R}^n \\to \\mathbb{R}^n$, the image of the unit sphere $\\{\\mathbf{x} : \\|\\mathbf{x}\\| = 1\\}$ is always an ellipsoid. For a general $A: \\mathbb{R}^n \\to \\mathbb{R}^m$ with rank $r$, the image is an $r$-dimensional ellipsoid sitting inside $\\mathbb{R}^m$. The shape of that ellipsoid contains everything you need to know about $A$ up to choice of orthonormal coordinates.

Why is the image an ellipsoid? The unit sphere is the level set $\\mathbf{x}^T \\mathbf{x} = 1$. Under $A$, points $\\mathbf{x}$ on the sphere become points $\\mathbf{y} = A\\mathbf{x}$. If $A$ is invertible, then $\\mathbf{x} = A^{-1}\\mathbf{y}$, so the constraint becomes $(A^{-1}\\mathbf{y})^T(A^{-1}\\mathbf{y}) = \\mathbf{y}^T (A^{-T} A^{-1}) \\mathbf{y} = 1$. The matrix $A^{-T}A^{-1} = (AA^T)^{-1}$ is symmetric and positive definite, and any quadratic form $\\mathbf{y}^T M \\mathbf{y} = 1$ with $M$ symmetric positive definite is an ellipsoid. Its principal axes are the [[eigenvectors|eigenvectors]] of $M$, and its semi-axis lengths are $1/\\sqrt{\\lambda_i(M)}$. Working backwards, the semi-axes of the image ellipsoid are eigenvectors of $AA^T$ with semi-axis lengths $\\sqrt{\\lambda_i(AA^T)}$. These eigenvalues are the squares of the **singular values** $\\sigma_i$.

The same picture works without invertibility. The unit ball maps to an $r$-dimensional solid ellipsoid in $\\mathbb{R}^m$ where $r = \\mathrm{rank}(A)$. The $r$ nonzero semi-axis lengths are the nonzero singular values $\\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq \\sigma_r > 0$, with $\\sigma_i = \\sqrt{\\lambda_i(A^TA)} = \\sqrt{\\lambda_i(AA^T)}$ (the two products $A^TA$ and $AA^T$ have the same nonzero eigenvalues, just in different ambient spaces). The directions of the semi-axes are the **left singular vectors** $\\mathbf{u}_1, \\ldots, \\mathbf{u}_r$ — eigenvectors of $AA^T$, living in the codomain $\\mathbb{R}^m$. Their preimages on the unit sphere are the **right singular vectors** $\\mathbf{v}_1, \\ldots, \\mathbf{v}_r$ — eigenvectors of $A^TA$, living in the domain $\\mathbb{R}^n$. They are linked by the fundamental relation $A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i$: each right singular vector gets sent to its matching left singular vector, scaled by the corresponding singular value.

This picture instantly settles a confusion that plagues introductory linear algebra. [[eigenvectors|Eigenvalues]] describe a matrix's action on its own invariant subspaces (when those exist), but they only work when domain equals codomain, and they can be complex even for real matrices. Singular values describe a matrix's action on the unit sphere — a question that always makes sense, for any $A \\in \\mathbb{R}^{m \\times n}$, with any rank, with any shape, and the answer is always a list of non-negative real numbers. The geometric interpretation is universal in a way the eigenvalue picture cannot be.

The link between the two pictures is exact for symmetric matrices and revealing in general. For a [[adjoints-and-transposes|symmetric]] $A$ with [[symmetric-spectra|spectral decomposition]] $A = Q\\Lambda Q^T$, the singular values are $|\\lambda_i|$ — the absolute values of the eigenvalues. The sign of each eigenvalue corresponds to whether the action on that eigendirection preserves orientation or reflects. For a general (non-symmetric) $A$, eigenvalues and singular values have no algebraic relationship beyond the inequality $|\\lambda_i| \\leq \\sigma_1$ (the spectral radius is bounded by the operator norm); a matrix can have eigenvalue zero and large singular values, or eigenvalue 1 and singular values stretching from $10^{-6}$ to $10^6$.

The semi-axes also give the operator norm and the Frobenius norm for free. The **operator norm** $\\|A\\|_{op} = \\max_{\\|\\mathbf{x}\\|=1} \\|A\\mathbf{x}\\|$ is the longest semi-axis: $\\sigma_1$. The **Frobenius norm** $\\|A\\|_F = \\sqrt{\\sum_{i,j} a_{ij}^2}$ equals $\\sqrt{\\sum_i \\sigma_i^2}$: the root-sum-of-squares of all the semi-axis lengths. Geometric size $=$ singular-value size, by the cleanest possible identity. This sets up the entire low-rank approximation story of Unit 12 — replacing $A$ by a smaller-rank matrix means truncating the smallest semi-axes of the ellipsoid.
    `.trim(),
    definitions: [
      {
        term: 'Singular value',
        body: 'A non-negative real number $\\sigma_i = \\sqrt{\\lambda_i(A^TA)} = \\sqrt{\\lambda_i(AA^T)}$ representing the length of the $i$-th semi-axis of the image ellipsoid $A(S^{n-1})$ in $\\mathbb{R}^m$. By convention, $\\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq 0$.',
      },
      {
        term: 'Left singular vector',
        body: 'A unit eigenvector $\\mathbf{u}_i \\in \\mathbb{R}^m$ of $AA^T$ with eigenvalue $\\sigma_i^2$. Geometrically, the direction of the $i$-th semi-axis of the image ellipsoid.',
      },
      {
        term: 'Right singular vector',
        body: 'A unit eigenvector $\\mathbf{v}_i \\in \\mathbb{R}^n$ of $A^TA$ with eigenvalue $\\sigma_i^2$. Geometrically, the preimage on the unit sphere of the $i$-th semi-axis: $A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i$.',
      },
      {
        term: 'Operator norm',
        body: '$\\|A\\|_{op} = \\max_{\\|\\mathbf{x}\\| = 1}\\|A\\mathbf{x}\\| = \\sigma_1$. The longest semi-axis of the image ellipsoid; the maximum stretch $A$ applies to any unit vector.',
      },
      {
        term: 'Frobenius norm',
        body: '$\\|A\\|_F = \\sqrt{\\sum_{i,j} a_{ij}^2} = \\sqrt{\\sum_i \\sigma_i^2}$. The root-sum-of-squares of the matrix entries, equivalently the root-sum-of-squares of the singular values.',
      },
    ],
    theorems: [
      {
        name: 'Sphere to ellipsoid',
        statement: 'For any $A \\in \\mathbb{R}^{m \\times n}$ of rank $r$, the image $A(S^{n-1})$ of the unit sphere is an $r$-dimensional ellipsoid in $\\mathbb{R}^m$ whose semi-axes have lengths $\\sigma_1 \\geq \\cdots \\geq \\sigma_r > 0$, the nonzero singular values of $A$, in the directions of the left singular vectors $\\mathbf{u}_1, \\ldots, \\mathbf{u}_r$.',
        intuition: 'A linear map can never bend the sphere; the constraint $\\mathbf{x}^T\\mathbf{x} = 1$ becomes another quadratic form $\\mathbf{y}^T M \\mathbf{y} = 1$ on the image, and every such quadratic form (with $M$ symmetric positive semi-definite) is an ellipsoid. The semi-axes diagonalize $M = AA^T$, so they are eigenvectors of $AA^T$ and their lengths are the square roots of its eigenvalues. The square root is the source of constant arithmetic errors: $\\sigma_i \\neq \\lambda_i$, even for symmetric matrices.',
      },
      {
        name: 'Singular values vs eigenvalues for symmetric matrices',
        statement: 'If $A = A^T$ has eigenvalues $\\lambda_1, \\ldots, \\lambda_n$, then the singular values of $A$ are $|\\lambda_1|, \\ldots, |\\lambda_n|$, sorted in descending order.',
        intuition: 'For symmetric $A$, $A^TA = A^2$, whose eigenvalues are $\\lambda_i^2$. Taking the positive square root gives $|\\lambda_i|$. Signs are lost: $-3$ and $3$ both contribute singular value $3$. For non-symmetric $A$, no such relationship holds — eigenvalues need not even be real, and singular values are determined by $A^TA$, not by $A$ alone.',
      },
      {
        name: 'Frobenius norm from singular values',
        statement: '$\\|A\\|_F^2 = \\sum_{i,j} a_{ij}^2 = \\mathrm{tr}(A^TA) = \\sum_i \\sigma_i^2$.',
        intuition: 'The Frobenius norm is unitarily invariant: multiplying $A$ by orthogonal matrices on either side cannot change the sum of squared entries. So $\\|A\\|_F = \\|U^T A V\\|_F = \\|\\Sigma\\|_F$, and the latter is just the root-sum-of-squares of the singular values on the diagonal. This identity is the bridge from algebraic "matrix size" to geometric "ellipsoid size," and it is the cornerstone of optimal low-rank approximation.',
      },
    ],
    keyFormulas: [
      '\\sigma_i = \\sqrt{\\lambda_i(A^TA)} = \\sqrt{\\lambda_i(AA^T)}',
      'A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i',
      '\\|A\\|_{op} = \\sigma_1',
      '\\|A\\|_F = \\sqrt{\\sigma_1^2 + \\sigma_2^2 + \\cdots + \\sigma_r^2}',
      '\\mathrm{rank}(A) = \\#\\{\\sigma_i > 0\\}',
    ],
  },
  explore: {
    vizComponent: 'SphereToEllipsoidViz',
    description: 'Left panel: unit circle in $\\mathbb{R}^2$ (or unit sphere in 3D mode) with two highlighted orthonormal directions $\\mathbf{v}_1, \\mathbf{v}_2$. Right panel: the image ellipse (or ellipsoid) under a user-controlled matrix $A$, with semi-axes $\\sigma_1\\mathbf{u}_1, \\sigma_2\\mathbf{u}_2$ rendered as colored arrows. As the user edits $A$ via sliders, the ellipse morphs continuously and the four numbers $\\sigma_1, \\sigma_2, \\angle\\mathbf{u}_1, \\angle\\mathbf{v}_1$ update in real time. A "rank drop" mode reduces $A$ to rank 1 and shows the ellipse collapsing to a line segment.',
    misconception: {
      title: 'The semi-axes of the image ellipsoid are NOT the eigenvalues of $A$, and the directions are NOT the eigenvectors of $A$.',
      body: `Students who have just finished the eigenvalue chapters reach for eigenvalues whenever they see "diagonalizing transformation" and reach for eigenvectors whenever they see "principal directions." Both are wrong here. The semi-axis lengths are $\\sigma_i = \\sqrt{\\lambda_i(A^TA)}$ — the square root, of the eigenvalues of a different matrix. The directions are $\\mathbf{u}_i$, eigenvectors of $AA^T$, not of $A$.

Three concrete consequences. (1) For a $2 \\times 2$ matrix with eigenvalues $9$ and $4$ but no useful symmetry, the semi-axes are NOT $9$ and $4$, NOT $3$ and $2$, and the principal directions are NOT the eigenvectors of $A$. They are eigenvectors of $A^TA$, and the semi-axes are square roots of its eigenvalues. (2) For a rotation matrix, every eigenvalue has modulus 1, but so does every singular value (the image of the unit circle is the unit circle itself — a degenerate "ellipse" with $\\sigma_1 = \\sigma_2 = 1$). The eigenvalues are $e^{\\pm i\\theta}$, complex; the singular values are $1, 1$, real. Same matrix, very different "spectra." (3) For the rank-deficient matrix $A = \\begin{bmatrix} 1 & 1 \\\\ 1 & 1 \\end{bmatrix}$, the eigenvalues are $2$ and $0$ — useful for diagonalizing the matrix, useless for describing the image ellipse, which collapses to a line segment of length $2$ along the diagonal. The singular values are $2$ and $0$; the lone nonzero singular value $2$ is the length of the collapsed segment.

A second misconception: that the semi-axis lengths of the image ellipse are the SQUARES of the singular values, because $\\lambda_i(A^TA) = \\sigma_i^2$ and the eigenvalues of $A^TA$ feel "primary." They are not primary; they live in the algebraic statement $A^TA \\mathbf{v}_i = \\sigma_i^2 \\mathbf{v}_i$, while the geometric statement $A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i$ has the square root already taken. The semi-axes of the image of the unit sphere have length $\\sigma_i$, not $\\sigma_i^2$. Forgetting the square root and reporting $\\sigma_i^2$ is one of the highest-frequency errors in the course.`.trim(),
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Set up the matrix and identify what we need',
        body: 'Consider $A = \\begin{bmatrix} 3 & 0 \\\\ 4 & 5 \\end{bmatrix}$. Goal: find the semi-axes of $A(S^1)$, the image of the unit circle. We need singular values (semi-axis lengths) and left singular vectors (semi-axis directions). Both come from $AA^T$.',
      },
      {
        title: 'Step 2: Compute $AA^T$ and its eigenvalues',
        body: '$AA^T = \\begin{bmatrix} 3 & 0 \\\\ 4 & 5 \\end{bmatrix}\\begin{bmatrix} 3 & 4 \\\\ 0 & 5 \\end{bmatrix} = \\begin{bmatrix} 9 & 12 \\\\ 12 & 41 \\end{bmatrix}$. Trace $= 50$, determinant $= 9 \\cdot 41 - 144 = 369 - 144 = 225$. The eigenvalues solve $\\lambda^2 - 50\\lambda + 225 = 0$, giving $\\lambda = 25 \\pm 20$, so $\\lambda_1 = 45$, $\\lambda_2 = 5$.',
      },
      {
        title: 'Step 3: Take square roots and report semi-axes',
        body: 'Singular values: $\\sigma_1 = \\sqrt{45} = 3\\sqrt{5} \\approx 6.71$, $\\sigma_2 = \\sqrt{5} \\approx 2.24$. The image of the unit circle is an ellipse with semi-axes of these lengths. Note $\\det(A) = 15$, and indeed $\\sigma_1 \\sigma_2 = 3\\sqrt{5} \\cdot \\sqrt{5} = 15$: the product of singular values equals $|\\det(A)|$ for any square matrix. Operator norm $\\|A\\|_{op} = 3\\sqrt{5}$. Frobenius norm $\\|A\\|_F = \\sqrt{45 + 5} = \\sqrt{50} = 5\\sqrt{2}$, which also equals $\\sqrt{9 + 16 + 0 + 25} = \\sqrt{50}$ from the entries directly.',
      },
    ],
    problems: [
      {
        id: 'P-10.1a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A linear transformation $A \\in \\mathbb{R}^{3 \\times 2}$ maps the unit circle in $\\mathbb{R}^2$ to an ellipse in $\\mathbb{R}^3$. The matrix $A^TA$ has eigenvalues $\\lambda_1 = 9$ and $\\lambda_2 = 4$ with corresponding orthonormal eigenvectors $\\mathbf{v}_1$ and $\\mathbf{v}_2$. Which statement correctly describes the geometric action of $A$?',
        choices: [
          { label: 'A', body: 'The ellipse in $\\mathbb{R}^3$ has semi-axis lengths $9$ and $4$, aligned with the directions $\\mathbf{v}_1$ and $\\mathbf{v}_2$.' },
          { label: 'B', body: 'The ellipse in $\\mathbb{R}^3$ has semi-axis lengths $3$ and $2$, and the input directions $\\mathbf{v}_1$ and $\\mathbf{v}_2$ are mapped to these semi-axes.' },
          { label: 'C', body: 'The ellipse lies in a 2-dimensional subspace of $\\mathbb{R}^3$, with semi-axis lengths $\\sqrt{9} = 3$ and $\\sqrt{4} = 2$.' },
          { label: 'D', body: 'The transformation stretches the direction $\\mathbf{v}_1$ by factor $9$ and $\\mathbf{v}_2$ by factor $4$, producing an ellipse with area $36\\pi$.' },
          { label: 'E', body: 'The eigenvalues of $A$ determine the semi-axis lengths, which are $9$ and $4$.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'Semi-axis lengths are $\\sigma_i = \\sqrt{\\lambda_i(A^TA)}$, so $\\sigma_1 = 3$ and $\\sigma_2 = 2$. The image of the unit circle is a 2D ellipse — a 2-dimensional figure living inside the 3-dimensional codomain $\\mathbb{R}^3$. The plane it lies in is $\\mathrm{im}(A)$, spanned by the left singular vectors $\\mathbf{u}_1, \\mathbf{u}_2$. Choice (C) is correct: it correctly takes the square root and correctly identifies the ellipse as lying in a 2D subspace of the 3D codomain.',
          partialCredit: '(B) deserves partial credit: it gets the semi-axis lengths $3$ and $2$ right (correctly taking the square root), but it says $\\mathbf{v}_1, \\mathbf{v}_2$ ARE the semi-axes, when they are only the preimages of the semi-axes. The semi-axes themselves live in $\\mathbb{R}^3$ and are the left singular vectors $A\\mathbf{v}_i / \\sigma_i$.',
          trickAnalysis: [
            { choice: 'A', why: 'Forgets the square root. Semi-axis lengths are $\\sigma_i$, not $\\sigma_i^2 = \\lambda_i(A^TA)$. This is the single most common error in the unit. Also wrong about directions: $\\mathbf{v}_1, \\mathbf{v}_2 \\in \\mathbb{R}^2$ are not the semi-axes of an ellipse in $\\mathbb{R}^3$.' },
            { choice: 'B', why: 'Correct lengths but wrong directions. $\\mathbf{v}_1, \\mathbf{v}_2$ live in the DOMAIN $\\mathbb{R}^2$; the semi-axes of the image ellipse live in the CODOMAIN $\\mathbb{R}^3$ as left singular vectors $\\mathbf{u}_i = A\\mathbf{v}_i / \\sigma_i$.' },
            { choice: 'D', why: 'Forgets the square root (same error as A) and quotes the area of an ellipse using wrong semi-axes. Correct area is $\\pi \\sigma_1 \\sigma_2 = 6\\pi$.' },
            { choice: 'E', why: 'Eigenvalues of $A$ are undefined: $A$ is $3 \\times 2$, non-square, so it has no eigenvalues at all. Confuses eigenvalues of $A$ (which do not exist here) with eigenvalues of $A^TA$ (which do).' },
          ],
        },
      },
      {
        id: 'P-10.1b',
        format: 'multiple-choice',
        difficulty: 1,
        statement: 'A matrix $A \\in \\mathbb{R}^{4 \\times 3}$ has singular values $\\sigma_1 = 6$, $\\sigma_2 = 3$, $\\sigma_3 = 2$. What is the Frobenius norm $\\|A\\|_F$?',
        choices: [
          { label: 'A', body: '$11$' },
          { label: 'B', body: '$49$' },
          { label: 'C', body: '$7$' },
          { label: 'D', body: '$\\sqrt{11}$' },
          { label: 'E', body: 'Not enough information to determine $\\|A\\|_F$.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: '$\\|A\\|_F = \\sqrt{\\sigma_1^2 + \\sigma_2^2 + \\sigma_3^2} = \\sqrt{36 + 9 + 4} = \\sqrt{49} = 7$. The Frobenius norm is the root-sum-of-squares of the singular values, equivalently the root-sum-of-squares of the entries of $A$.',
          trickAnalysis: [
            { choice: 'A', why: 'Sums the singular values without squaring: $6 + 3 + 2 = 11$. Confuses $\\|A\\|_F$ with the nuclear norm $\\|A\\|_* = \\sum \\sigma_i$ (which is a real but different norm).' },
            { choice: 'B', why: 'Computes $\\sigma_1^2 + \\sigma_2^2 + \\sigma_3^2 = 49$ but forgets the square root. This is $\\|A\\|_F^2$, not $\\|A\\|_F$.' },
            { choice: 'D', why: 'Takes the square root of the sum (not the sum of squares): $\\sqrt{11}$. Confuses two distinct quantities.' },
            { choice: 'E', why: 'The singular values alone determine the Frobenius norm completely — that is the content of the identity $\\|A\\|_F^2 = \\sum \\sigma_i^2$. No further information about $U$ or $V$ is needed.' },
          ],
        },
      },
      {
        id: 'P-10.1c',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A $3 \\times 3$ matrix $A$ has eigenvalues $\\lambda_1 = 5$, $\\lambda_2 = -3$, $\\lambda_3 = 1$. Which statement about the singular values of $A$ is most TRUE?',
        choices: [
          { label: 'A', body: 'The singular values are $5, 3, 1$.' },
          { label: 'B', body: 'The singular values are $25, 9, 1$.' },
          { label: 'C', body: 'The singular values are $\\sqrt{5}, \\sqrt{3}, 1$.' },
          { label: 'D', body: 'The singular values cannot be determined from eigenvalues alone.' },
          { label: 'E', body: 'The singular values of a square matrix always equal its eigenvalues.' },
        ],
        correctAnswer: 'D',
        solution: {
          explanation: 'For a general (non-symmetric) matrix, eigenvalues and singular values are unrelated except for the inequality $|\\lambda_i| \\leq \\sigma_1$ (spectral radius $\\leq$ operator norm). The same eigenvalue list is compatible with very different singular-value profiles: $\\mathrm{diag}(5, -3, 1)$ has singular values $5, 3, 1$ (since it is symmetric), but a non-symmetric matrix like $\\begin{bmatrix} 5 & 100 & 0 \\\\ 0 & -3 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$ has the same eigenvalues but very different singular values (the large off-diagonal entry inflates $\\sigma_1$). Without knowing $A$ itself (e.g., whether it is symmetric or normal), singular values cannot be inferred from eigenvalues.',
          partialCredit: '(A) deserves partial credit: it gives the correct answer for the SPECIAL CASE when $A$ is symmetric (or more generally, normal). For symmetric $A$, $\\sigma_i = |\\lambda_i|$. The student who picks (A) has correctly identified the symmetric-matrix rule but missed the "general matrix" qualifier in the question.',
          trickAnalysis: [
            { choice: 'A', why: 'True only for symmetric (or normal) matrices, where $\\sigma_i = |\\lambda_i|$. The problem says "a $3 \\times 3$ matrix $A$" with no symmetry assumption; in general the singular values can differ from $|\\lambda_i|$.' },
            { choice: 'B', why: 'Confuses singular values with $\\lambda_i^2$ (the eigenvalues of $A^TA$ only when $A$ is symmetric and applied twice). Forgets the square root in $\\sigma_i = \\sqrt{\\lambda_i(A^TA)}$.' },
            { choice: 'C', why: 'Mistakenly takes the square root of eigenvalues OF $A$, not of $A^TA$. Also gives no value for $-3$ (square root undefined in $\\mathbb{R}$), revealing the formula is misapplied.' },
            { choice: 'E', why: 'Categorically false. Singular values are non-negative; eigenvalues can be negative or complex. Even for symmetric matrices, $\\sigma_i = |\\lambda_i|$ involves the absolute value.' },
          ],
        },
      },
      {
        id: 'P-10.1d',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A matrix $A \\in \\mathbb{R}^{m \\times n}$ has singular values $\\sigma_1 = 5$, $\\sigma_2 = 3$, $\\sigma_3 = 1$, and $\\sigma_k = 0$ for $k > 3$. Which of the following statements is most TRUE?',
        choices: [
          { label: 'A', body: 'Matrix $2A$ has singular values $10, 6, 2$, with all others zero, but they should be reordered as $2, 6, 10$ to maintain the SVD convention.' },
          { label: 'B', body: 'Matrix $A^T$ has singular values $\\sigma_1 = 1, \\sigma_2 = 3, \\sigma_3 = 5$, with all others zero.' },
          { label: 'C', body: 'Matrix $A^TA$ has eigenvalues $25, 9, 1$, with the remaining eigenvalues zero.' },
          { label: 'D', body: 'The Frobenius norm satisfies $\\|A\\|_F = \\sigma_1 + \\sigma_2 + \\sigma_3 = 9$.' },
          { label: 'E', body: 'Matrices $A^TA$ and $AA^T$ have different nonzero eigenvalues.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'The defining identity is $\\sigma_i = \\sqrt{\\lambda_i(A^TA)}$, equivalently $\\lambda_i(A^TA) = \\sigma_i^2$. So eigenvalues of $A^TA$ are $25, 9, 1, 0, 0, \\ldots$. Choice (C) is exactly this statement. The other choices each fail in a specific way: (A) and (B) get the SVD ordering convention wrong, (D) confuses Frobenius norm with the nuclear norm $\\sum \\sigma_i$ (the correct $\\|A\\|_F = \\sqrt{25+9+1} = \\sqrt{35}$), and (E) is categorically false since $A^TA$ and $AA^T$ have identical nonzero spectra.',
          trickAnalysis: [
            { choice: 'A', why: 'Scaling by $c > 0$ scales singular values by $c$ (so $10, 6, 2$ is correct). But the SVD convention is descending order, and $10 \\geq 6 \\geq 2$ already satisfies that — no reordering needed. The distractor invents a "reorder to ascending" rule that does not exist.' },
            { choice: 'B', why: '$A^T$ has the SAME singular values as $A$ (the nonzero eigenvalues of $(A^T)^T A^T = AA^T$ equal those of $A^TA$). So singular values of $A^T$ are still $5, 3, 1$, in descending order. The distractor reverses the order, which violates the SVD convention.' },
            { choice: 'D', why: 'Confuses Frobenius norm with the nuclear norm $\\|A\\|_* = \\sum_i \\sigma_i$. The Frobenius norm is $\\|A\\|_F = \\sqrt{\\sum_i \\sigma_i^2} = \\sqrt{35}$, not $9$. Same misconception tested by P-10.1b choice (A).' },
            { choice: 'E', why: '$A^TA$ and $AA^T$ have the SAME nonzero eigenvalues (with the same multiplicities), even though they have different sizes. This is a fundamental SVD fact and the reason the singular values are unambiguous. Stating they are different is categorically wrong.' },
          ],
        },
      },
    ],
  },
};
