import type { Concept } from '../types';

export const svdInvariance: Concept = {
  id: 'svd-invariance',
  unitId: 'ch10',
  number: '10.4',
  title: 'SVD Invariance and Structure',
  blurb: 'How the SVD transforms under operations on $A$: transpose, scaling, multiplication by orthogonal matrices. These invariances make the singular values the "intrinsic content" of a linear map.',
  tier: 'full',
  learn: {
    overview: `
The singular values of $A$ are not coordinates; they are *intrinsic*. Choose any orthonormal basis in the domain or codomain (or both), and the singular values stay the same. This is the precise sense in which the [[svd-form|SVD]] captures "the geometry of $A$" independent of any coordinate choices. The transformations under which singular values stay fixed are exactly the transformations that don't change the underlying geometric content of $A$ — and seeing what these are gives a clearer picture of what singular values measure.

The cleanest invariance is **unitary invariance**: if $P \\in \\mathbb{R}^{m \\times m}$ and $Q \\in \\mathbb{R}^{n \\times n}$ are orthogonal, then $PAQ^T$ has the same singular values as $A$. The proof is immediate from the SVD: if $A = U\\Sigma V^T$, then $PAQ^T = (PU)\\Sigma(QV)^T$, and $PU, QV$ are still orthogonal (products of orthogonals). The singular values $\\sigma_i$ are unchanged; the singular vectors are rotated by $P$ and $Q$ respectively. Consequence: $\\|A\\|_F$, $\\|A\\|_{op}$, $\\mathrm{rank}(A)$, and any function of the singular values are unitarily invariant.

The **transpose invariance**: $A$ and $A^T$ have the same nonzero singular values. The full SVD of $A = U\\Sigma V^T$ gives $A^T = V\\Sigma^T U^T$ — the roles of $U$ and $V$ swap, and $\\Sigma^T$ has the same nonzero diagonal entries as $\\Sigma$ (just in a different ambient shape). So $A$ and $A^T$ are SVD-mirror-images. The singular values are the same, the left singular vectors of $A$ become the right singular vectors of $A^T$, and vice versa. This is the underlying reason for the basic and surprising identity $\\mathrm{rank}(A) = \\mathrm{rank}(A^T)$ from Unit 3 — both equal the number of nonzero singular values, and both share that number.

The **scaling rule**: if $c > 0$, then $cA$ has singular values $c\\sigma_i$, with the same singular vectors as $A$. For $c < 0$, the singular values become $|c|\\sigma_i$ (always non-negative) and the singular vectors absorb the sign in a sign-flip pattern. For $c = 0$, every singular value vanishes (since $0 \\cdot A$ has rank $0$).

The **eigenvalue-singular-value relationship** is more subtle. For a symmetric matrix $A$ with eigendecomposition $A = Q\\Lambda Q^T$, the singular values are $|\\lambda_i|$ — the absolute values, sorted in descending order. For a general matrix, the only general inequality is $|\\lambda_i| \\leq \\sigma_1$ for every eigenvalue $\\lambda_i$ (the spectral radius is bounded by the operator norm). Beyond that, eigenvalues and singular values can differ arbitrarily for non-normal matrices. The closest comparison is for [[orthogonal-transformations|orthogonal matrices]] $Q$: all singular values are $1$ (since $Q^TQ = I$ has eigenvalues all $1$, so singular values of $Q$ are all $\\sqrt{1} = 1$). Yet the eigenvalues of $Q$ lie on the complex unit circle and can be anywhere there — orthogonal matrices have constant singular spectrum but a rich eigenvalue spectrum.

This last fact is worth dwelling on. An orthogonal matrix $Q$ has SVD $Q = Q \\cdot I \\cdot I^T = I \\cdot I \\cdot Q^T = U \\cdot I \\cdot V^T$ for many choices of $U, V$ with $UV^T = Q$. The SVD of an orthogonal matrix is therefore *highly non-unique* — every $\\sigma_i = 1$ means every direction is "equally stretched," and any orthonormal basis works as the singular vectors. This is the analog of "the eigenvectors of $cI$ are arbitrary" in the SVD world: when all singular values coincide, all orthonormal bases become valid singular bases.

The **submultiplicativity** of singular values under matrix product: $\\sigma_1(AB) \\leq \\sigma_1(A) \\sigma_1(B)$ for all compatible $A, B$. This is the matrix version of $|ab| \\leq |a||b|$ for scalars and underlies operator-norm theory. Equality holds only in very specific cases. More generally, $\\sigma_k(AB) \\leq \\sigma_k(A)\\sigma_1(B)$ and $\\sigma_k(AB) \\leq \\sigma_1(A)\\sigma_k(B)$.

The most consequential invariance for practice is for **products with orthogonal matrices**, because it underlies the [[svd-form|pseudoinverse]] construction, the orthogonal Procrustes problem, and the PCA story. Whenever a procedure involves "rotate, do something, rotate back," the singular values of the underlying matrix never change. Singular values are therefore the right invariant for any property that should not depend on the choice of coordinate frame in domain or codomain — robust to rotations, sensitive to genuine deformation.
    `.trim(),
    definitions: [
      {
        term: 'Unitary invariance',
        body: 'The property that singular values (and functions of them, like Frobenius norm and operator norm) are unchanged under left or right multiplication by orthogonal matrices: $\\sigma_i(PAQ^T) = \\sigma_i(A)$ when $P, Q$ are orthogonal.',
      },
      {
        term: 'Spectral radius',
        body: '$\\rho(A) = \\max_i |\\lambda_i(A)|$, the largest modulus of any eigenvalue. For general matrices, $\\rho(A) \\leq \\sigma_1(A)$, with equality for [[adjoints-and-transposes|normal]] matrices.',
      },
      {
        term: 'Submultiplicativity',
        body: 'The inequality $\\sigma_1(AB) \\leq \\sigma_1(A)\\sigma_1(B)$, equivalently $\\|AB\\|_{op} \\leq \\|A\\|_{op}\\|B\\|_{op}$. The operator norm is a sub-multiplicative norm on matrices.',
      },
      {
        term: 'Singular spectrum',
        body: 'The multiset of singular values $\\{\\sigma_1, \\sigma_2, \\ldots\\}$ (with repetition allowed). The intrinsic invariant of $A$ under unitary transformations; it determines $\\|A\\|_F, \\|A\\|_{op}, \\mathrm{rank}(A)$, and other unitarily invariant quantities.',
      },
    ],
    theorems: [
      {
        name: 'Unitary invariance of singular values',
        statement: 'For orthogonal $P \\in \\mathbb{R}^{m \\times m}$ and $Q \\in \\mathbb{R}^{n \\times n}$, the matrix $PAQ^T$ has the same singular values as $A$, and its singular vectors are obtained by rotating: $\\mathbf{u}_i \\to P\\mathbf{u}_i$, $\\mathbf{v}_i \\to Q\\mathbf{v}_i$.',
        intuition: 'If $A = U\\Sigma V^T$, then $PAQ^T = (PU)\\Sigma(QV)^T$, where $PU$ and $QV$ are both products of orthogonals (hence orthogonal). This is a valid SVD for $PAQ^T$, with the same $\\Sigma$. Geometrically: rotating the input or output basis does not change the shape of the image ellipsoid, only its position in the codomain.',
      },
      {
        name: 'Transpose preserves singular values',
        statement: 'If $A = U\\Sigma V^T$, then $A^T = V\\Sigma^T U^T$, and $\\Sigma^T$ has the same nonzero diagonal entries as $\\Sigma$. So $A$ and $A^T$ have the same nonzero singular values.',
        intuition: 'Transposing a matrix swaps domain and codomain, which swaps left and right singular vectors. The singular VALUES are intrinsic and stay fixed. This is why $\\mathrm{rank}(A) = \\mathrm{rank}(A^T)$: both equal the number of nonzero singular values, which is the same number. The clean SVD perspective renders the rank-equals-row-rank theorem trivial.',
      },
      {
        name: 'Singular values of orthogonal matrices',
        statement: 'For any orthogonal $Q$, every singular value equals $1$. Conversely, if all singular values of a square matrix equal $1$, the matrix is orthogonal.',
        intuition: '$Q^TQ = I$ has eigenvalues all $1$, so $\\sigma_i(Q) = \\sqrt{1} = 1$ for every $i$. Conversely, if $\\Sigma = I$ in $Q = U\\Sigma V^T$, then $Q = UV^T$ — a product of orthogonals, hence orthogonal. The SVD of an orthogonal matrix is therefore highly non-unique: any decomposition $Q = UV^T$ with $U, V$ orthogonal works, since $\\Sigma = I$ is fixed.',
      },
      {
        name: 'Singular values vs eigenvalues',
        statement: 'For symmetric $A$ with eigenvalues $\\lambda_1, \\ldots, \\lambda_n$, the singular values are $|\\lambda_1|, \\ldots, |\\lambda_n|$ in descending order. For general $A$, only the spectral-radius bound $|\\lambda_i| \\leq \\sigma_1$ holds; eigenvalues and singular values can otherwise differ arbitrarily.',
        intuition: 'For symmetric $A = Q\\Lambda Q^T$, $A^TA = Q\\Lambda^2 Q^T$, so $\\sigma_i^2 = \\lambda_i^2$, giving $\\sigma_i = |\\lambda_i|$. For non-normal $A$, the eigenvectors of $A^TA$ are different from the eigenvectors of $A$, and there is no algebraic relationship between $\\sigma_i$ and $|\\lambda_i|$ beyond the spectral-radius bound (which follows from $|\\lambda| = \\|A\\mathbf{v}\\|/\\|\\mathbf{v}\\| \\leq \\sigma_1$ when $\\mathbf{v}$ is an eigenvector).',
      },
    ],
    keyFormulas: [
      '\\sigma_i(PAQ^T) = \\sigma_i(A) \\text{ for orthogonal } P, Q',
      '\\sigma_i(A^T) = \\sigma_i(A)',
      '\\sigma_i(cA) = |c|\\sigma_i(A)',
      'A \\text{ symmetric: } \\sigma_i(A) = |\\lambda_i(A)|',
      'A \\text{ orthogonal: } \\sigma_i = 1 \\text{ for all } i',
      '\\sigma_1(AB) \\leq \\sigma_1(A) \\sigma_1(B)',
    ],
  },
  explore: {
    vizComponent: 'SVDInvarianceViz',
    description: 'A user-controlled $2 \\times 2$ matrix $A$ has its singular values displayed alongside the singular values of four transformed versions: $A^T$, $cA$ (slider for $c$), $PAQ^T$ (with sliders for rotation angles in $P$ and $Q$), and $A^2$. The viz emphasizes which transformations leave singular values invariant (transpose, orthogonal rotations) and which scale them ($cA$ scales by $|c|$; $A^2$ squares singular values when $A$ is symmetric, but does something else in general). A separate "orthogonal mode" shows that an orthogonal matrix always has $\\Sigma = I$, with the image ellipse remaining the unit circle no matter how $U, V$ are chosen.',
    misconception: {
      title: 'The SVD of $A$ is NOT determined by writing down ANY $U\\Sigma V^T$ that multiplies to $A$.',
      body: `A common student attempt: "Write $A$ as orthogonal times diagonal times orthogonal in any way that works." This fails because such factorizations are highly non-unique, and almost all of them are NOT the SVD. The SVD requires the middle factor $\\Sigma$ to have its diagonal entries non-negative and in descending order. Without that constraint, the factorization is not "the SVD"; it's just *a* product.

Concrete failure: $A = \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix}$ (rotation by $-90°$). Note that $A = A \\cdot I \\cdot I^T$ is a valid product of "orthogonal, diagonal, orthogonal" — but with $\\Sigma = I$, this IS the SVD ($\\sigma_1 = \\sigma_2 = 1$). On the other hand, $A = I \\cdot \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix} \\cdot \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}^T$ is also a valid product of "orthogonal, diagonal, orthogonal" — but the middle factor has a negative entry, so it is NOT a valid $\\Sigma$. This product is just a similarity or coordinate identity, not the SVD.

A second confusion: students compute the SVD of a $2 \\times 2$ rotation matrix and get $\\Sigma = \\mathrm{diag}(3/2, 1/2)$ or something with non-unit entries. This indicates a computational error somewhere — the SVD of any orthogonal matrix has $\\Sigma = I$. Common cause: misidentifying which eigenvectors of $A^TA$ correspond to which singular value, or omitting normalization in the construction of $U$ from $V$.

A third confusion: ordering. The SVD requires $\\sigma_1 \\geq \\sigma_2 \\geq \\cdots$ (descending). A student who computes the eigenvalues of $A^TA$ as $\\{1/4, 9/4\\}$ might write $\\Sigma = \\mathrm{diag}(1/2, 3/2)$ — but this violates the descending-order convention. The correct $\\Sigma = \\mathrm{diag}(3/2, 1/2)$, with the corresponding columns of $U$ and $V$ also reordered. Drop the convention and the SVD is no longer well-defined.

A fourth confusion: that the SVD is invariant under transformations that should change it. Scaling $A$ by 2 DOES change the SVD (the singular values double). Adding a constant to $A$ DOES change the SVD (no nice rule). Only the "rotational" operations (left or right multiplication by orthogonals, transposition) leave singular VALUES fixed — and even then they rotate the singular VECTORS.`.trim(),
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Identify the action from the figure',
        body: 'A figure shows a unit circle in $\\mathbb{R}^2$ being transformed by $A$ into an ellipse. The right singular vectors are marked: $\\mathbf{v}_1$ along the line $y = x$ (at 45°) and $\\mathbf{v}_2$ along $y = -x$ (at 135°). The image ellipse has semi-axes of length $3/2$ along the direction $(1, 1)/\\sqrt{2}$ and $1/2$ along $(1, -1)/\\sqrt{2}$. Goal: determine $U, \\Sigma, V$.',
      },
      {
        title: 'Step 2: Read off $V$ from preimage axes and $\\Sigma$ from semi-axis lengths',
        body: 'Right singular vectors $\\mathbf{v}_1 = (1, 1)/\\sqrt{2}$, $\\mathbf{v}_2 = (-1, 1)/\\sqrt{2}$ (perpendicular, unit length). Note: $\\mathbf{v}_2$ is rotated $90°$ CCW from $\\mathbf{v}_1$ so that $V$ is orthogonal with positive determinant. So $V = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\end{bmatrix}$. Singular values: $\\sigma_1 = 3/2$, $\\sigma_2 = 1/2$, giving $\\Sigma = \\mathrm{diag}(3/2, 1/2)$.',
      },
      {
        title: 'Step 3: Determine $U$ from $\\mathbf{u}_i = A\\mathbf{v}_i/\\sigma_i$',
        body: 'The image semi-axes give $\\mathbf{u}_1 = (1, 1)/\\sqrt{2}$ and $\\mathbf{u}_2 = (1, -1)/\\sqrt{2}$ (the direction the image basis points to). So $U = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}$. Verify orthogonality of $U$: rows and columns unit-length and orthogonal ✓. The factorization $A = U\\Sigma V^T$ now reconstructs $A$ from the picture. Common error: getting the sign convention of $\\mathbf{u}_2$ wrong, which flips one singular vector and either gives $\\det(U) = -1$ or breaks the relation $A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i$. The picture itself dictates the correct sign.',
      },
    ],
    problems: [
      {
        id: 'P-10.4a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'What can be said about the SVD of an orthogonal matrix $Q \\in \\mathbb{R}^{n \\times n}$?',
        choices: [
          { label: 'A', body: 'All singular values equal $1$, so $Q = U\\Sigma V^T$ where $\\Sigma = I$, meaning $Q = UV^T$ is a product of two orthogonal matrices.' },
          { label: 'B', body: 'The singular values depend on the specific matrix $Q$; for example, a rotation matrix has different singular values than a reflection matrix.' },
          { label: 'C', body: 'All singular values equal $1$, but the SVD is unique because $U$ and $V$ are determined by $Q$.' },
          { label: 'D', body: 'Orthogonal matrices do not have a uniquely defined SVD because they preserve lengths, which contradicts the stretching interpretation of singular values.' },
          { label: 'E', body: 'The largest singular value is $1$, but the others can be less than $1$ depending on how much $Q$ compresses certain directions.' },
        ],
        correctAnswer: 'A',
        solution: {
          explanation: 'Singular values of $Q$ are $\\sqrt{\\lambda_i(Q^TQ)} = \\sqrt{\\lambda_i(I)} = 1$ for all $i$. So $\\Sigma = I$, and the SVD $Q = U \\cdot I \\cdot V^T = UV^T$ exhibits $Q$ as a product of two orthogonal matrices. (A) captures this correctly. The SVD is indeed non-unique here (since all singular values coincide, any orthonormal singular basis works), but this is a separate fact (B) does not state and is not what (D) asserts about the SVD being "undefined."',
          trickAnalysis: [
            { choice: 'B', why: 'Rotations and reflections are BOTH orthogonal; their singular values are ALL $1$. The distinction is in the determinant ($+1$ vs $-1$), which is preserved in $\\det(UV^T)$, not in the singular values.' },
            { choice: 'C', why: 'Singular values are correct ($1$ for all $i$), but the SVD of an orthogonal matrix is NOT unique. With $\\Sigma = I$, every orthonormal $V$ can serve as right singular vectors, and $U$ is then determined by $U = QV$. So there is an $n^2$-dimensional family of valid SVDs (one for each orthogonal $V$).' },
            { choice: 'D', why: 'Length preservation EXACTLY matches "all singular values equal 1" — there is no contradiction. Singular values measure stretch; a value of $1$ means no stretch, which is precisely what length-preservation says. The SVD is well-defined, just non-unique.' },
            { choice: 'E', why: 'Orthogonal matrices preserve length on ALL directions, not just the largest one. So every singular value is exactly $1$, not "less than 1 in some directions."' },
          ],
        },
      },
      {
        id: 'P-10.4b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Let $A \\in \\mathbb{R}^{n \\times n}$ be symmetric with eigendecomposition $A = Q\\Lambda Q^T$ where $\\Lambda = \\mathrm{diag}(4, -2, 1)$. What is the SVD $A = U\\Sigma V^T$?',
        choices: [
          { label: 'A', body: '$U = V = Q$, $\\Sigma = \\Lambda = \\mathrm{diag}(4, -2, 1)$.' },
          { label: 'B', body: '$U = V = Q$, $\\Sigma = \\mathrm{diag}(4, 2, 1)$, with columns of $Q$ reordered as $\\mathbf{q}_1, \\mathbf{q}_2, \\mathbf{q}_3$.' },
          { label: 'C', body: '$U = Q \\cdot \\mathrm{diag}(1, -1, 1)$, $V = Q$, $\\Sigma = \\mathrm{diag}(4, 2, 1)$.' },
          { label: 'D', body: '$U = V = Q$ with no modifications, $\\Sigma = \\mathrm{diag}(16, 4, 1)$.' },
          { label: 'E', body: 'The SVD cannot be constructed from the spectral decomposition without further computation.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'For symmetric $A$, singular values are $|\\lambda_i| = 4, 2, 1$. The singular vectors are the eigenvectors of $A$, BUT signs need adjustment for the negative eigenvalue. Specifically: $A\\mathbf{q}_2 = -2\\mathbf{q}_2$, which we want to write as $\\sigma_2 \\mathbf{u}_2 = 2\\mathbf{u}_2$ — so $\\mathbf{u}_2 = -\\mathbf{q}_2$, while $\\mathbf{v}_2 = \\mathbf{q}_2$. The columns of $U$ where $\\lambda_i < 0$ get a sign flip; the columns of $V$ stay as $Q$\'s columns. (C) captures this: $U = Q \\cdot \\mathrm{diag}(1, -1, 1)$ (flip second column), $V = Q$, $\\Sigma = \\mathrm{diag}(4, 2, 1) = |\\Lambda|$.',
          partialCredit: '(B) deserves partial credit: it gets $\\Sigma = |\\Lambda|$ correct, but it does not handle the sign flip needed on $U$ for the negative eigenvalue. The student understood "absolute value of eigenvalues" but missed how the sign is absorbed into $U$.',
          trickAnalysis: [
            { choice: 'A', why: 'Two errors. (1) $\\Sigma$ must have non-negative entries, but $\\mathrm{diag}(4, -2, 1)$ has a negative entry. (2) Choosing $U = V$ for symmetric $A$ works only when eigenvalues are non-negative.' },
            { choice: 'B', why: 'Almost right but misses the sign absorption. Setting $U = V = Q$ with $\\Sigma = \\mathrm{diag}(4, 2, 1)$ gives $U\\Sigma V^T = Q \\mathrm{diag}(4, 2, 1) Q^T \\neq A$ — this is $|A|$ (the absolute-value matrix), not $A$. The $-2$ eigenvalue must enter SOMEWHERE as a sign, and that "somewhere" is in $U$.' },
            { choice: 'D', why: 'Squares the eigenvalues to get singular values. Wrong formula: $\\sigma_i = |\\lambda_i|$, not $\\lambda_i^2$. Forgets the square root.' },
            { choice: 'E', why: 'The SVD is FULLY determined by the spectral decomposition for symmetric matrices. (C) is the explicit construction.' },
          ],
        },
      },
      {
        id: 'P-10.4c',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'The figure shows the structure of the full SVD $A = U\\Sigma V^T$ for a matrix $A \\in \\mathbb{R}^{12 \\times 5}$. Filled circles represent nonzero singular values; empty circles represent zero singular values. Suppose the diagonal of $\\Sigma$ shows $3$ filled circles and $2$ empty circles. Which statement is most TRUE?',
        choices: [
          { label: 'A', body: '$\\dim(\\ker A) = 9$.' },
          { label: 'B', body: 'The first three columns of $V$ form an orthonormal basis for $\\mathrm{im}(A)$.' },
          { label: 'C', body: 'The last $9$ columns of $U$ form an orthonormal basis for the codomain of $A$.' },
          { label: 'D', body: 'The last two columns of $V$ form an orthonormal basis for $\\ker(A)$.' },
          { label: 'E', body: 'The rank of $A$ equals $5$.' },
        ],
        correctAnswer: 'D',
        solution: {
          explanation: '$\\Sigma$ has only $\\min(m, n) = 5$ possible singular value positions (the diagonal). Three nonzero (filled) and two zero (empty) means $\\mathrm{rank}(A) = 3$. By the SVD fundamental-subspaces theorem, $\\ker(A) \\subset \\mathbb{R}^5$ has dimension $5 - 3 = 2$, with orthonormal basis the LAST TWO columns of $V$ (the ones corresponding to zero singular values). (D) is correct.',
          trickAnalysis: [
            { choice: 'A', why: '$\\dim(\\ker A) = 5 - 3 = 2$, not $9$. Confuses $\\dim(\\ker A) \\subset \\mathbb{R}^5$ (the domain) with $\\dim(\\ker A^T) \\subset \\mathbb{R}^{12}$ (the codomain, which has dimension $12 - 3 = 9$). The numbers $2$ and $9$ are easy to swap if the student forgets which space the kernel lives in.' },
            { choice: 'B', why: 'WRONG correspondence. $\\mathrm{im}(A) \\subset \\mathbb{R}^{12}$ (codomain), spanned by the first three columns of $U$, NOT $V$. Confuses $U$ and $V$.' },
            { choice: 'C', why: 'The last $9$ columns of $U$ form a basis for $\\ker(A^T) = \\mathrm{coker}(A)$ (an orthogonal complement IN the codomain $\\mathbb{R}^{12}$, dimension $9$), not "the codomain" itself (which is all of $\\mathbb{R}^{12}$, dimension $12$). Confuses cokernel with codomain.' },
            { choice: 'E', why: 'Rank equals the NUMBER of nonzero singular values, which is $3$ (three filled circles), not $5$. Confuses "number of diagonal positions" with "rank."' },
          ],
        },
      },
    ],
  },
};
