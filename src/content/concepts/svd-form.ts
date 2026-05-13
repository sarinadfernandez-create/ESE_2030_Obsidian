import type { Concept } from '../types';

export const svdForm: Concept = {
  id: 'svd-form',
  unitId: 'ch10',
  number: '10.3',
  title: 'The SVD Form',
  blurb: 'Every real matrix factors as $A = U\\Sigma V^T$, where $U$ and $V$ are orthogonal and $\\Sigma$ is a non-negative diagonal. This is the closest a matrix gets to having a "canonical form."',
  tier: 'full',
  learn: {
    overview: `
The **singular value decomposition** of a matrix $A \\in \\mathbb{R}^{m \\times n}$ is the factorization
$$A = U \\Sigma V^T,$$
where $U \\in \\mathbb{R}^{m \\times m}$ and $V \\in \\mathbb{R}^{n \\times n}$ are [[orthogonal-transformations|orthogonal matrices]], and $\\Sigma \\in \\mathbb{R}^{m \\times n}$ is "diagonal" (its only nonzero entries are $\\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq \\sigma_r > 0$ on positions $\\Sigma_{ii}$ for $i = 1, \\ldots, r$, where $r = \\mathrm{rank}(A)$). Every real matrix has an SVD; no constraints on shape, rank, symmetry, or invertibility are needed. This makes SVD the single most general matrix factorization in linear algebra.

The factorization decomposes the action of $A$ into three sequential pieces. Read right to left: $V^T$ takes the input from standard coordinates into the basis of [[spheres-ellipsoids|right singular vectors]] $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_n\\}$ (an orthonormal basis of $\\mathbb{R}^n$). $\\Sigma$ scales each of the first $r$ basis vectors by the corresponding $\\sigma_i$ and zeros out the remaining $n - r$ basis directions (sending them into the kernel of $A$). $U$ takes the result from the $\\{\\mathbf{u}_1, \\ldots, \\mathbf{u}_m\\}$ basis (an orthonormal basis of $\\mathbb{R}^m$) into standard coordinates of $\\mathbb{R}^m$. So $A$ acts as "rotate the input into a canonical basis, stretch each axis by a non-negative factor (possibly zero), rotate the output." This is the cleanest possible statement of "what every linear map looks like."

The **fundamental subspaces** appear immediately from the SVD. Partition the columns of $V$ into the first $r$ and the last $n - r$: the first $r$ columns $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_r\\}$ form an orthonormal basis for the [[coimage-cokernel|coimage]] $\\mathrm{coim}(A) = \\ker(A)^\\perp = \\mathrm{im}(A^T)$, while the last $n - r$ columns $\\{\\mathbf{v}_{r+1}, \\ldots, \\mathbf{v}_n\\}$ form an orthonormal basis for the [[image-and-kernel|kernel]] $\\ker(A)$. Similarly for $U$: the first $r$ columns $\\{\\mathbf{u}_1, \\ldots, \\mathbf{u}_r\\}$ form an orthonormal basis for the [[image-and-kernel|image]] $\\mathrm{im}(A)$, and the last $m - r$ columns $\\{\\mathbf{u}_{r+1}, \\ldots, \\mathbf{u}_m\\}$ form an orthonormal basis for the [[orthogonal-complements|cokernel]] $\\mathrm{coker}(A) = \\mathrm{im}(A)^\\perp = \\ker(A^T)$. The SVD therefore presents the [[fundamental-theorem|Fundamental Theorem of Linear Algebra]] as a single matrix equation: the four fundamental subspaces are exactly the four blocks of the column-partitioned $U$ and $V$.

This view also makes the [[fundamental-theorem|natural isomorphism]] $\\mathrm{coim}(A) \\cong \\mathrm{im}(A)$ explicit. The map $A: \\mathrm{coim}(A) \\to \\mathrm{im}(A)$, restricted to those subspaces, sends $\\mathbf{v}_i \\mapsto \\sigma_i \\mathbf{u}_i$ for $i = 1, \\ldots, r$. This is a [[orthogonal-transformations|stretching isomorphism]]: an invertible linear map between two equal-dimensional inner product spaces, scaled by the diagonal $\\Sigma_r = \\mathrm{diag}(\\sigma_1, \\ldots, \\sigma_r)$. The FTLA says these two subspaces are abstractly isomorphic; the SVD specifies *the* isomorphism, with explicit scaling factors. This is the deepest fact in the unit.

The SVD is **almost unique**. The singular values $\\sigma_1 \\geq \\cdots \\geq \\sigma_r > 0$ are completely unique. The columns of $U$ and $V$ are unique when the singular values are distinct (up to a simultaneous sign flip in matched columns $\\mathbf{u}_i$ and $\\mathbf{v}_i$). When singular values repeat — say $\\sigma_i = \\sigma_{i+1}$ — there is freedom to rotate within the corresponding 2D singular subspace, just as repeated eigenvalues create freedom in the choice of eigenbasis. The zero-singular-value columns ($i > r$) have freedom across all of $\\ker(A)$ and $\\ker(A^T)$, since any orthonormal basis of these kernels works.

The SVD also handles non-square and rank-deficient matrices gracefully. For a fat matrix ($m < n$), $\\Sigma$ has $m$ possible singular value positions, of which $r = \\mathrm{rank}(A) \\leq m$ are nonzero. For a tall matrix ($m > n$), the reverse. The "thin" or "economy" SVD trims away the zero rows/columns and the corresponding orthogonal complements: $A = U_r \\Sigma_r V_r^T$ where $U_r \\in \\mathbb{R}^{m \\times r}$, $V_r \\in \\mathbb{R}^{n \\times r}$ have orthonormal columns (but are not square), and $\\Sigma_r \\in \\mathbb{R}^{r \\times r}$ is diagonal with positive entries. The thin SVD has only $r(m + n - r) + r$ scalar parameters vs $m \\cdot n$ for the original matrix — a real compression when $r \\ll m, n$.

The most computationally important consequence of the SVD is the **pseudoinverse**. The Moore-Penrose pseudoinverse of $A$ is $A^\\dagger = V \\Sigma^\\dagger U^T$, where $\\Sigma^\\dagger \\in \\mathbb{R}^{n \\times m}$ is obtained from $\\Sigma$ by transposing and replacing each nonzero $\\sigma_i$ with $1/\\sigma_i$ (zeros stay zero). This $A^\\dagger$ is the unique matrix solving four "Penrose conditions" that generalize the inverse. When $A$ is invertible, $A^\\dagger = A^{-1}$. When $A$ has full column rank, $A^\\dagger = (A^TA)^{-1}A^T$ — the [[least-squares|least-squares pseudoinverse]] from Unit 6. The SVD-based formula generalizes both to any matrix whatsoever, and it is the most stable way to compute the pseudoinverse numerically.
    `.trim(),
    definitions: [
      {
        term: 'Singular value decomposition',
        body: 'A factorization $A = U \\Sigma V^T$ of any real $m \\times n$ matrix, with $U \\in \\mathbb{R}^{m \\times m}$ orthogonal, $V \\in \\mathbb{R}^{n \\times n}$ orthogonal, and $\\Sigma \\in \\mathbb{R}^{m \\times n}$ diagonal with $\\Sigma_{ii} = \\sigma_i \\geq 0$ in descending order.',
      },
      {
        term: 'Thin (economy) SVD',
        body: 'The truncated factorization $A = U_r \\Sigma_r V_r^T$ where $r = \\mathrm{rank}(A)$ and $U_r, V_r, \\Sigma_r$ keep only the first $r$ columns / first $r$ singular values. Stores the same information using fewer parameters.',
      },
      {
        term: 'Outer product expansion',
        body: 'Equivalent form of SVD: $A = \\sum_{i=1}^{r} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$. Expresses $A$ as a sum of rank-1 matrices, weighted by the singular values. The basis for low-rank approximation.',
      },
      {
        term: 'Pseudoinverse (via SVD)',
        body: '$A^\\dagger = V \\Sigma^\\dagger U^T$, where $\\Sigma^\\dagger$ has the nonzero $\\sigma_i$\'s inverted and transposed shape: $(\\Sigma^\\dagger)_{ii} = 1/\\sigma_i$ for $i \\leq r$, all other entries zero.',
      },
      {
        term: 'Singular subspace',
        body: 'For a repeated singular value $\\sigma$, the subspace of left (resp. right) singular vectors associated with $\\sigma$. Any orthonormal basis of this subspace works; the columns of $U$ (resp. $V$) within this block are non-unique.',
      },
    ],
    theorems: [
      {
        name: 'Existence of SVD',
        statement: 'Every matrix $A \\in \\mathbb{R}^{m \\times n}$ admits a singular value decomposition. The singular values are uniquely determined; the singular vectors are unique up to sign (when singular values are distinct) and up to orthogonal rotations within singular subspaces (when they repeat).',
        intuition: 'Existence follows from the spectral theorem applied to $A^TA$ (symmetric PSD, hence orthogonally diagonalizable with non-negative eigenvalues). Let $A^TA = V\\Lambda V^T$. Define $\\sigma_i = \\sqrt{\\lambda_i}$ and $\\mathbf{u}_i = A\\mathbf{v}_i/\\sigma_i$ for $\\sigma_i > 0$. The vectors $\\mathbf{u}_i$ are orthonormal because $\\mathbf{u}_i^T \\mathbf{u}_j = \\mathbf{v}_i^T A^T A \\mathbf{v}_j / (\\sigma_i \\sigma_j) = \\sigma_j^2 \\delta_{ij}/(\\sigma_i \\sigma_j) = \\delta_{ij}$. Extend $\\{\\mathbf{u}_1, \\ldots, \\mathbf{u}_r\\}$ to an orthonormal basis of $\\mathbb{R}^m$ to get $U$. The factorization $A = U\\Sigma V^T$ then holds by construction.',
      },
      {
        name: 'Fundamental subspaces from SVD',
        statement: 'For $A = U\\Sigma V^T$ with rank $r$: $\\mathrm{im}(A) = \\mathrm{span}\\{\\mathbf{u}_1, \\ldots, \\mathbf{u}_r\\}$, $\\ker(A^T) = \\mathrm{span}\\{\\mathbf{u}_{r+1}, \\ldots, \\mathbf{u}_m\\}$, $\\mathrm{coim}(A) = \\mathrm{im}(A^T) = \\mathrm{span}\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_r\\}$, $\\ker(A) = \\mathrm{span}\\{\\mathbf{v}_{r+1}, \\ldots, \\mathbf{v}_n\\}$.',
        intuition: 'The first $r$ columns of $V$ are the directions on which $A$ acts non-trivially (mapping each to a nonzero scalar multiple of $\\mathbf{u}_i$), so they span $\\mathrm{coim}(A)$. The last $n - r$ columns are mapped to zero by $\\Sigma$, so they span $\\ker(A)$. Symmetrically for $U$ and $A^T$. This is the FTLA, written explicitly: the SVD gives orthonormal bases for all four fundamental subspaces simultaneously.',
      },
      {
        name: 'SVD reveals the natural isomorphism',
        statement: 'The restriction of $A$ to its coimage is an isomorphism onto its image. In the SVD bases, this isomorphism is given by $A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i$ for $i = 1, \\ldots, r$, and the linear map $\\mathrm{coim}(A) \\to \\mathrm{im}(A)$ has matrix $\\mathrm{diag}(\\sigma_1, \\ldots, \\sigma_r)$.',
        intuition: 'The [[fundamental-theorem|FTLA]] says $\\mathrm{coim}(A) \\cong \\mathrm{im}(A)$ abstractly. The SVD makes this concrete: pair $\\mathbf{v}_i$ with $\\mathbf{u}_i$ for each $i \\leq r$, and scale by $\\sigma_i$. The isomorphism is not just any isomorphism; it is the one $A$ itself implements, and its scaling factors are the singular values. The geometric content: $A$ takes the unit sphere in $\\mathrm{coim}(A)$ to an ellipsoid in $\\mathrm{im}(A)$.',
      },
      {
        name: 'Pseudoinverse via SVD',
        statement: 'For $A = U\\Sigma V^T$ with rank $r$, the Moore-Penrose pseudoinverse is $A^\\dagger = V\\Sigma^\\dagger U^T$, where $\\Sigma^\\dagger$ has shape $n \\times m$ with $(\\Sigma^\\dagger)_{ii} = 1/\\sigma_i$ for $i \\leq r$ and zeros elsewhere.',
        intuition: 'On $\\mathrm{coim}(A)$, $A$ is an invertible scaling by $\\sigma_i$. The pseudoinverse inverts this scaling by $1/\\sigma_i$. On $\\ker(A)$ (where $A$ kills everything), $A^\\dagger$ also kills (it cannot recover information that was destroyed). The SVD formula encodes both behaviors: invert on the rank-$r$ block, zero out the rest. When $A$ is invertible ($r = n = m$), this matches $A^{-1}$ exactly. When $A$ has full column rank, $A^\\dagger = (A^TA)^{-1}A^T$, the [[least-squares|least-squares formula]] of Unit 6.',
      },
    ],
    keyFormulas: [
      'A = U \\Sigma V^T = \\sum_{i=1}^{r} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T',
      'A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i, \\quad A^T\\mathbf{u}_i = \\sigma_i \\mathbf{v}_i',
      'A^T A = V\\Sigma^T\\Sigma V^T, \\quad AA^T = U\\Sigma\\Sigma^T U^T',
      'A^\\dagger = V\\Sigma^\\dagger U^T, \\quad (\\Sigma^\\dagger)_{ii} = 1/\\sigma_i \\text{ for } i \\leq r',
      '\\|A\\|_F^2 = \\sum \\sigma_i^2, \\quad \\|A\\|_{op} = \\sigma_1',
    ],
  },
  explore: {
    vizComponent: 'SVDStructureViz',
    description: 'Animation of $A = U\\Sigma V^T$ acting on the unit circle in $\\mathbb{R}^2$, playing out as three steps with pauses between. Frame 1: unit circle, original basis. Frame 2: apply $V^T$ (rotation in domain), basis rotates to align with right singular vectors. Frame 3: apply $\\Sigma$ (stretch), circle becomes axis-aligned ellipse. Frame 4: apply $U$ (rotation in codomain), ellipse rotates to its final position. Side panel: live display of $U, \\Sigma, V$ as $2 \\times 2$ blocks with values updating as the user edits $A$. A toggle reveals the four fundamental subspaces ($\\ker A$, $\\mathrm{im}\\, A$, etc.) as colored regions when $A$ is rank-deficient.',
    misconception: {
      title: 'The singular values are NOT the eigenvalues of $A$, and the singular vectors are NOT eigenvectors of $A$.',
      body: `The most common error in the unit is the conflation of eigenvalue concepts with singular value concepts. They are different objects answering different questions.

Eigenvalues solve $A\\mathbf{x} = \\lambda \\mathbf{x}$: when does $A$ act as scalar multiplication? Answer requires the same vector space on both sides, so $A$ must be square. Answer can be complex (and often is) for real $A$. Singular values solve $A\\mathbf{v} = \\sigma \\mathbf{u}$ with $\\mathbf{v}, \\mathbf{u}$ unit vectors and $\\sigma \\geq 0$: which directions are most stretched, and by how much? Answer makes sense for any $A$, of any shape, and is always real and non-negative. Eigenvalues describe diagonalizability in a fixed coordinate system; singular values describe action in two different orthonormal coordinate systems (one in domain, one in codomain).

Concrete consequence: for a $2 \\times 2$ rotation by 90°, eigenvalues are $\\pm i$ (complex, no real eigenvectors). Singular values are $1, 1$ (the matrix preserves all lengths). Same matrix, totally different "spectra." For a Jordan block $\\begin{bmatrix} 2 & 1 \\\\ 0 & 2 \\end{bmatrix}$, eigenvalue is $2$ (repeated, geometric multiplicity 1). Singular values are roots of $\\det(\\Sigma^2 - \\lambda I) = 0$ where $\\Sigma^2 = A^TA = \\begin{bmatrix} 4 & 2 \\\\ 2 & 5 \\end{bmatrix}$: $\\sigma_1^2, \\sigma_2^2 = (9 \\pm \\sqrt{17})/2$, giving $\\sigma_1 \\approx 2.56, \\sigma_2 \\approx 0.78$. Same matrix, different (and unrelated) numerical "spectra."

A second misconception: that the SVD is just the [[similarity|similarity diagonalization]] $A = V\\Lambda V^{-1}$ with a different name. They are different. SVD uses TWO orthogonal matrices ($U$ on the left, $V^T$ on the right); similarity uses one matrix $V$ and its inverse. SVD's middle factor is non-negative diagonal; similarity's middle factor is the diagonal of eigenvalues (which can be negative or complex). SVD exists for every matrix; similarity diagonalization fails for defective matrices. The two factorizations only coincide when $A$ is symmetric positive semi-definite.

A third misconception: that $U$ and $V$ are unique. They are not. When singular values repeat, $U$ and $V$ have freedom to rotate within the corresponding singular subspace. When singular values are zero (rank-deficient $A$), the corresponding columns of $U$ and $V$ can be ANY orthonormal basis of the relevant kernel. The singular VALUES are unique; the singular VECTORS are unique only up to these (well-understood) freedoms.

A fourth misconception: that the SVD of $A^T$ is "the SVD of $A$ transposed in some structural way." The correct fact is that if $A = U\\Sigma V^T$, then $A^T = V\\Sigma^T U^T$. The roles of $U$ and $V$ swap. The singular values stay the same.`.trim(),
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Set up and compute $A^TA$',
        body: 'Find the SVD of $A = \\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}$. Step 1: compute $A^TA = \\begin{bmatrix} 1 & 0 \\\\ 1 & 1 \\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix} = \\begin{bmatrix} 1 & 1 \\\\ 1 & 2 \\end{bmatrix}$.',
      },
      {
        title: 'Step 2: Diagonalize $A^TA$ to get $V$ and $\\Sigma$',
        body: 'Characteristic polynomial of $A^TA$: $\\lambda^2 - 3\\lambda + 1 = 0$, so $\\lambda = (3 \\pm \\sqrt{5})/2$. Singular values: $\\sigma_1 = \\sqrt{(3+\\sqrt{5})/2} \\approx 1.618$, $\\sigma_2 = \\sqrt{(3-\\sqrt{5})/2} \\approx 0.618$. (These are $\\varphi$ and $1/\\varphi$, the golden ratio.) Right singular vectors $\\mathbf{v}_1, \\mathbf{v}_2$: solve $(A^TA - \\lambda I)\\mathbf{v} = 0$ for each $\\lambda$, normalize to unit length. The columns of $V$ are these unit eigenvectors of $A^TA$.',
      },
      {
        title: 'Step 3: Compute $U$ via $\\mathbf{u}_i = A\\mathbf{v}_i/\\sigma_i$',
        body: 'For each $i$, $\\mathbf{u}_i = A\\mathbf{v}_i/\\sigma_i$. This automatically gives orthonormal $\\mathbf{u}_i$ because $A^TA \\mathbf{v}_j = \\sigma_j^2 \\mathbf{v}_j$ implies $\\mathbf{u}_i^T\\mathbf{u}_j = (A\\mathbf{v}_i)^T(A\\mathbf{v}_j)/(\\sigma_i \\sigma_j) = \\delta_{ij}$. Sanity check: $U\\Sigma V^T$ should reconstruct $A$. Also, $\\det(A) = 1$ and $\\sigma_1 \\sigma_2 = \\sqrt{(9 - 5)/4} = \\sqrt{1} = 1$ ✓ (product of singular values equals $|\\det(A)|$ for square matrices).',
      },
    ],
    problems: [
      {
        id: 'P-10.3a',
        format: 'multiple-choice',
        difficulty: 1,
        statement: 'A matrix $A \\in \\mathbb{R}^{100 \\times 50}$ represents measurements where rows are observations and columns are features. The SVD $A = U\\Sigma V^T$ reveals that only the first 10 singular values are nonzero: $\\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq \\sigma_{10} > 0$ and $\\sigma_{11} = \\cdots = \\sigma_{50} = 0$. Which statement is most TRUE?',
        choices: [
          { label: 'A', body: 'The first 10 right singular vectors $\\mathbf{v}_1, \\ldots, \\mathbf{v}_{10}$ span the image of $A$, capturing the 10 most important patterns in the observations.' },
          { label: 'B', body: 'The first 10 left singular vectors $\\mathbf{u}_1, \\ldots, \\mathbf{u}_{10}$ span a 10-dimensional subspace of feature space where all data variation occurs.' },
          { label: 'C', body: 'The right singular vectors $\\mathbf{v}_{11}, \\ldots, \\mathbf{v}_{50}$ form an orthonormal basis for $\\ker(A)$, representing 40 redundant feature combinations.' },
          { label: 'D', body: 'The left singular vectors $\\mathbf{u}_{11}, \\ldots, \\mathbf{u}_{100}$ span $\\ker(A^T)$, representing observation directions that have no correlation with any features.' },
          { label: 'E', body: 'Both (C) and (D) are correct.' },
        ],
        correctAnswer: 'E',
        solution: {
          explanation: 'Rank of $A$ is 10 (number of nonzero singular values). By the SVD fundamental-subspaces theorem: $\\{\\mathbf{v}_{11}, \\ldots, \\mathbf{v}_{50}\\}$ (40 vectors, corresponding to zero singular values in $V$) is an orthonormal basis for $\\ker(A)$ — that\'s (C). Similarly, $\\{\\mathbf{u}_{11}, \\ldots, \\mathbf{u}_{100}\\}$ (90 vectors in $U$) is an orthonormal basis for $\\ker(A^T) = \\mathrm{coker}(A)$ — that\'s (D). Both are correct; (E) captures both.',
          partialCredit: '(C) or (D) individually deserves partial credit — each is a correct statement, but the question asks for the most TRUE single choice, and (E) is the genuinely complete one.',
          trickAnalysis: [
            { choice: 'A', why: 'WRONG correspondence. $\\mathbf{v}_1, \\ldots, \\mathbf{v}_{10}$ span $\\mathrm{coim}(A) = \\ker(A)^\\perp \\subset \\mathbb{R}^{50}$, NOT $\\mathrm{im}(A) \\subset \\mathbb{R}^{100}$. The image is spanned by $\\mathbf{u}_i$, not $\\mathbf{v}_i$. Confuses domain (where $\\mathbf{v}$ lives) with codomain (where $\\mathbf{u}$ lives).' },
            { choice: 'B', why: 'WRONG space. $\\mathbf{u}_1, \\ldots, \\mathbf{u}_{10}$ live in $\\mathbb{R}^{100}$ (observation space, the codomain), not in $\\mathbb{R}^{50}$ (feature space, the domain). The statement also incorrectly calls observation space "feature space."' },
            { choice: 'C', why: 'CORRECT but incomplete. The question asks for the most true single statement; (C) is correct but (D) is also correct, and (E) captures both.' },
            { choice: 'D', why: 'CORRECT but incomplete. Same as (C).' },
          ],
        },
      },
      {
        id: 'P-10.3b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A matrix $A \\in \\mathbb{R}^{7 \\times 5}$ has rank $3$ with SVD $A = U\\Sigma V^T$. Which choice yields an orthonormal basis for the coimage $\\mathrm{coim}(A) = \\ker(A)^\\perp$?',
        choices: [
          { label: 'A', body: 'Right singular vectors $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3, \\mathbf{v}_4, \\mathbf{v}_5\\}$.' },
          { label: 'B', body: 'Left singular vectors $\\{\\mathbf{u}_1, \\mathbf{u}_2, \\mathbf{u}_3\\}$.' },
          { label: 'C', body: 'Right singular vectors $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$.' },
          { label: 'D', body: 'Left singular vectors $\\{\\mathbf{u}_4, \\mathbf{u}_5, \\mathbf{u}_6, \\mathbf{u}_7\\}$.' },
          { label: 'E', body: 'Right singular vectors $\\{\\mathbf{v}_4, \\mathbf{v}_5\\}$.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'For rank $r = 3$: $\\mathrm{coim}(A) = \\ker(A)^\\perp$ is spanned by the first $r$ right singular vectors, $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$. These live in $\\mathbb{R}^5$ (domain) and are orthonormal by SVD construction. They span the 3D subspace of the domain on which $A$ acts non-trivially, mapping $\\mathbf{v}_i \\mapsto \\sigma_i \\mathbf{u}_i$ for $i = 1, 2, 3$.',
          trickAnalysis: [
            { choice: 'A', why: 'All five $\\mathbf{v}_i$ span all of $\\mathbb{R}^5 = \\mathrm{coim}(A) \\oplus \\ker(A)$, not just $\\mathrm{coim}(A)$. Includes the kernel-spanning vectors $\\mathbf{v}_4, \\mathbf{v}_5$.' },
            { choice: 'B', why: 'WRONG subspace. $\\{\\mathbf{u}_1, \\mathbf{u}_2, \\mathbf{u}_3\\}$ spans $\\mathrm{im}(A) \\subset \\mathbb{R}^7$, the CODOMAIN side. The coimage lives in the domain. Confuses coimage with image.' },
            { choice: 'D', why: 'WRONG subspace. $\\{\\mathbf{u}_4, \\ldots, \\mathbf{u}_7\\}$ spans $\\mathrm{coker}(A) = \\mathrm{im}(A)^\\perp \\subset \\mathbb{R}^7$. Confuses coimage (in the domain) with cokernel (in the codomain).' },
            { choice: 'E', why: 'WRONG side of the split. $\\{\\mathbf{v}_4, \\mathbf{v}_5\\}$ spans $\\ker(A)$, the orthogonal complement of the coimage. Off by exactly the right vs zero singular value distinction.' },
          ],
        },
      },
      {
        id: 'P-10.3c',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A matrix $A \\in \\mathbb{R}^{4 \\times 3}$ has SVD $A = U\\Sigma V^T$ where $U \\in \\mathbb{R}^{4 \\times 4}$, $V \\in \\mathbb{R}^{3 \\times 3}$ are orthogonal, and $$\\Sigma = \\begin{bmatrix} 5 & 0 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix} \\in \\mathbb{R}^{4 \\times 3}.$$ What is the pseudoinverse $A^\\dagger$?',
        choices: [
          { label: 'A', body: '$A^\\dagger = U\\Sigma^{-1} V^T$ where $\\Sigma^{-1}$ has $1/5, 1/2$ on the diagonal but the zero singular values give undefined entries.' },
          { label: 'B', body: '$A^\\dagger = V\\Sigma^T U^T$ where $\\Sigma^T = \\begin{bmatrix} 5 & 0 & 0 & 0 \\\\ 0 & 2 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}$' },
          { label: 'C', body: '$A^\\dagger = V\\Sigma^\\dagger U^T$ where $\\Sigma^\\dagger = \\begin{bmatrix} 1/5 & 0 & 0 & 0 \\\\ 0 & 1/2 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}$' },
          { label: 'D', body: '$A^\\dagger = U^T\\Sigma^\\dagger V$ where $\\Sigma^\\dagger = \\begin{bmatrix} 1/5 & 0 & 0 & 0 \\\\ 0 & 1/2 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\end{bmatrix}$' },
          { label: 'E', body: '$A^\\dagger = V\\Sigma^\\dagger U^T$ where $\\Sigma^\\dagger = \\begin{bmatrix} 1/5 & 0 & 0 \\\\ 0 & 1/2 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}$' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: '$A^\\dagger = V\\Sigma^\\dagger U^T$. Two requirements on $\\Sigma^\\dagger$: (1) it has shape $n \\times m = 3 \\times 4$ (transposed shape of $\\Sigma$), and (2) it has nonzero singular values inverted, zero singular values left as zero. So $\\Sigma^\\dagger$ is $3 \\times 4$ with $1/5, 1/2, 0$ on the diagonal. Choice (C) has BOTH the right shape ($3 \\times 4$) AND the right entries. Verify dimensions: $A^\\dagger \\in \\mathbb{R}^{3 \\times 4}$, which matches $V \\in \\mathbb{R}^{3 \\times 3}$ times $\\Sigma^\\dagger \\in \\mathbb{R}^{3 \\times 4}$ times $U^T \\in \\mathbb{R}^{4 \\times 4}$. ✓',
          partialCredit: '(E) deserves partial credit: it has the correct entries on the diagonal, but the shape is wrong ($4 \\times 3$, the same as $\\Sigma$, not transposed). The student understood "invert nonzero singular values" but forgot the shape-transpose step.',
          trickAnalysis: [
            { choice: 'A', why: 'Two errors. (1) $\\Sigma$ is not invertible (it has zero singular values), so $\\Sigma^{-1}$ does not exist. (2) Even if it did, the formula has $U$ on the LEFT, but the pseudoinverse formula swaps to $V$ on the left.' },
            { choice: 'B', why: 'Replaces $\\Sigma^\\dagger$ with $\\Sigma^T$ — uses the transposed singular values instead of inverted ones. This is not the pseudoinverse; it would give a matrix scaled by $\\sigma_i$ instead of $1/\\sigma_i$.' },
            { choice: 'D', why: 'Wrong factor positions: $U^T$ on the left, $V$ on the right. The correct formula is $V \\Sigma^\\dagger U^T$, which is the SVD with the orthogonal factors swapped AND the singular values inverted.' },
            { choice: 'E', why: 'CORRECT entries but WRONG shape. $\\Sigma^\\dagger$ must be $n \\times m = 3 \\times 4$, but the choice shows $4 \\times 3$ (same shape as $\\Sigma$). The shape transpose is essential: it makes $A^\\dagger$ map $\\mathbb{R}^m \\to \\mathbb{R}^n$, in the reverse direction of $A$.' },
          ],
        },
      },
      {
        id: 'P-10.3d',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A machine learning engineer wants to store a compressed representation of matrix $A \\in \\mathbb{R}^{500 \\times 300}$ using its rank-$k$ SVD approximation $A_k = \\sum_{i=1}^k \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$. To store $A_k$, they save: $k$ singular values, $k$ left singular vectors $\\mathbf{u}_i \\in \\mathbb{R}^{500}$, and $k$ right singular vectors $\\mathbf{v}_i \\in \\mathbb{R}^{300}$. How many total scalar values must be stored, and at what $k$ does the storage equal the original matrix?',
        choices: [
          { label: 'A', body: '$k(500 + 300 + 1)$ values; storage equals original when $k = 500$.' },
          { label: 'B', body: '$k(500 + 300 + 1)$ values; storage equals original when $k = 300$.' },
          { label: 'C', body: '$k(500 + 300)$ values; storage equals original when $k \\approx 187$.' },
          { label: 'D', body: '$k(500 \\cdot 300)$ values; storage never equals original since SVD is always compressed.' },
          { label: 'E', body: '$k(500 + 300 + 1)$ values; storage equals original when $k \\approx 187$.' },
        ],
        correctAnswer: 'E',
        solution: {
          explanation: 'Storage for $A_k$: $500k$ entries in the $k$ left singular vectors, $300k$ entries in the $k$ right singular vectors, $k$ singular values. Total: $k(500 + 300 + 1) = 801k$. Original matrix: $500 \\times 300 = 150{,}000$ entries. Break-even: $801k = 150{,}000$, so $k = 150{,}000 / 801 \\approx 187.27$. Choice (E) is correct. Beyond $k \\approx 187$, the rank-$k$ SVD takes more space than the original; below it, storage is compressed.',
          trickAnalysis: [
            { choice: 'A', why: 'Right formula, wrong break-even. $k = 500$ would store $500 \\cdot 801 = 400{,}500$ values — much more than the original $150{,}000$. The break-even is well below $500$.' },
            { choice: 'B', why: 'Right formula, wrong break-even. $k = 300$ stores $300 \\cdot 801 = 240{,}300$ values — still more than the original. The break-even is below $300$.' },
            { choice: 'C', why: 'Forgets to count singular values. The $k$ singular values cost $k$ extra scalars on top of the singular vectors. With this formula, break-even would be $k = 150{,}000/800 = 187.5$, which is close but the formula is wrong.' },
            { choice: 'D', why: 'Wildly wrong formula. The cost is linear in $k$, not multiplicative in matrix dimensions. SVD-based storage is compressed precisely when $k$ is small enough.' },
          ],
        },
      },
      {
        id: 'P-10.3e',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'The SVD $A = U\\Sigma V^T$ reveals that $A$ acts as an isomorphism (scaled by singular values) between certain fundamental subspaces. For matrix $A \\in \\mathbb{R}^{m \\times n}$ with rank $r$, which statement is most TRUE?',
        choices: [
          { label: 'A', body: '$A$ maps $\\ker(A)$ isomorphically onto $\\ker(A^T)$ by the relationship $A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i$ for $i > r$.' },
          { label: 'B', body: '$A$ maps $\\mathrm{coim}(A)$ isomorphically onto $\\mathrm{im}(A)$, with isomorphism given by scaling: $A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i$ for $i \\leq r$.' },
          { label: 'C', body: '$A$ maps $\\mathbb{R}^n$ isomorphically onto $\\mathbb{R}^m$ whenever $m = n$, regardless of rank.' },
          { label: 'D', body: '$A$ maps both $\\ker(A)$ and $\\mathrm{coim}(A)$ isomorphically onto $\\mathrm{im}(A)$, explaining why $\\dim(\\ker A) + \\dim(\\mathrm{coim}\\, A) = \\dim(\\mathrm{im}\\, A)$.' },
          { label: 'E', body: 'The restriction of $A$ to $\\ker(A)$ is an isomorphism onto $\\ker(A^T)$ because both have dimension $n - r$.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'The natural isomorphism from the [[fundamental-theorem|FTLA]] is $\\mathrm{coim}(A) \\cong \\mathrm{im}(A)$, both of dimension $r$. SVD realizes this isomorphism explicitly: $A$ sends $\\mathbf{v}_i \\in \\mathrm{coim}(A)$ to $\\sigma_i \\mathbf{u}_i \\in \\mathrm{im}(A)$ for $i = 1, \\ldots, r$. Both $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_r\\}$ and $\\{\\mathbf{u}_1, \\ldots, \\mathbf{u}_r\\}$ are orthonormal bases of their respective subspaces, and $A$ acts diagonally on these bases with positive scaling factors. (B) is correct.',
          trickAnalysis: [
            { choice: 'A', why: '$A$ maps $\\ker(A)$ to $\\{\\mathbf{0}\\}$, not isomorphically to anything. The formula $A\\mathbf{v}_i = \\sigma_i \\mathbf{u}_i$ for $i > r$ gives $\\sigma_i = 0$, so $A\\mathbf{v}_i = \\mathbf{0}$ — far from an isomorphism. The kernel is exactly what fails to map isomorphically.' },
            { choice: 'C', why: 'Categorical error. Square matrices need not be isomorphisms. $\\begin{bmatrix} 1 & 1 \\\\ 1 & 1 \\end{bmatrix}$ is $2 \\times 2$ with rank $1$ — not invertible, not an isomorphism on $\\mathbb{R}^2$. Invertibility requires full rank, not just $m = n$.' },
            { choice: 'D', why: 'Dimensions wrong. The correct count is $\\dim(\\ker A) + \\dim(\\mathrm{coim}\\, A) = (n - r) + r = n$, not $\\dim(\\mathrm{im}\\, A) = r$. Confuses rank-nullity with the "two restrictions to the same image" claim, which is doubly false.' },
            { choice: 'E', why: '$A$ acts as ZERO on $\\ker(A)$, not as an isomorphism onto $\\ker(A^T)$. The two kernels have the same dimension ($n - r$ and $m - r$ are not generally equal anyway), but $A$ does not connect them as an isomorphism.' },
          ],
        },
      },
    ],
  },
};
