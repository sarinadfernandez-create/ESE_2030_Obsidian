import type { Concept } from '../types';

export const symmetricSpectra: Concept = {
  id: 'symmetric-spectra',
  unitId: 'ch9',
  number: '9.4',
  title: 'Symmetric Spectra',
  blurb: 'Real symmetric matrices have real eigenvalues, an orthonormal eigenbasis, and an orthogonal diagonalization.',
  tier: 'full',

  learn: {
    overview: `
The Spectral Theorem is the structural high point of classical linear algebra. For a real symmetric matrix $A = A^T$, three remarkable facts hold simultaneously: every [[eigenvectors|eigenvalue]] is real (no complex eigenvalues, ever), eigenvectors for distinct eigenvalues are automatically orthogonal, and the entire vector space admits an [[orthonormal-bases|orthonormal basis]] of eigenvectors. Together these say that every real symmetric matrix is *orthogonally diagonalizable*:
$$A = Q \\Lambda Q^T,$$
where $Q$ is an [[orthogonal-transformations|orthogonal matrix]] (columns form an orthonormal eigenbasis), $Q^{-1} = Q^T$, and $\\Lambda = \\mathrm{diag}(\\lambda_1, \\ldots, \\lambda_n)$ holds the real eigenvalues.

The geometric meaning is unusually clean: a symmetric matrix is a pure scaling operation along $n$ mutually perpendicular axes. There is no rotation mixed in, no shear, no complex twisting. The eigenaxes form a rigid frame, and $A$ acts by stretching or contracting each axis by its eigenvalue. Negative eigenvalues flip the corresponding axis; zero eigenvalues collapse it.

This decoupling makes spectral computations transparent. Given any vector $\\mathbf{x}$, expand it in the orthonormal eigenbasis: $\\mathbf{x} = \\sum_i c_i \\mathbf{q}_i$ where $c_i = \\mathbf{q}_i^T \\mathbf{x}$ (since the basis is orthonormal, coordinates are inner products). Then
$$A\\mathbf{x} = \\sum_i \\lambda_i c_i \\mathbf{q}_i, \\qquad \\|A\\mathbf{x}\\|^2 = \\sum_i \\lambda_i^2 c_i^2.$$
The squared-length formula follows because the $\\mathbf{q}_i$ are orthonormal: cross terms in $\\|\\sum_i \\lambda_i c_i \\mathbf{q}_i\\|^2$ vanish, and squared norms add. This is one of the cleanest applications of the spectral theorem and forms the basis for PCA, the SVD, and [[regularized-least-squares|ridge regression]] energy estimates.

The orthonormal-eigenbasis statement requires a subtle clarification for repeated eigenvalues. The theorem guarantees that an orthonormal eigenbasis *exists*; it does *not* say that every choice of eigenvectors is automatically orthogonal. For an eigenvalue with geometric multiplicity $> 1$, any two linearly independent vectors in the corresponding eigenspace are eigenvectors but need not be perpendicular. One must apply [[gram-schmidt|Gram-Schmidt]] *within* that eigenspace to manufacture an orthonormal pair. Across distinct eigenspaces orthogonality is automatic; within a repeated eigenspace it must be enforced.

The spectral theorem also synthesizes the FTLA in the symmetric case. For symmetric $A$: $\\ker(A) = \\ker(A^T)$ (trivially, since $A = A^T$) and $\\mathrm{im}(A) = \\mathrm{im}(A^T) = \\ker(A)^\\perp$. The four FTLA subspaces collapse to two: the kernel (spanned by eigenvectors for $\\lambda = 0$) and its orthogonal complement, the image (spanned by eigenvectors for nonzero $\\lambda$). This dramatic simplification is one reason symmetric matrices are computationally favored in engineering: every fundamental subspace is described purely by the eigenspaces, and orthogonality between them is automatic.

**Where it lives.** PCA is the spectral decomposition of the covariance matrix (symmetric by construction). The SVD applies the spectral theorem to $A^T A$ and $A A^T$. The Laplacian of an undirected graph is symmetric, giving the entire field of [[spectral-graph-theory|spectral graph theory]]. The Rayleigh quotient $\\mathbf{x}^T A \\mathbf{x} / \\mathbf{x}^T \\mathbf{x}$ is bounded by the smallest and largest eigenvalues of symmetric $A$ — the foundation of variational eigenvalue methods.
    `.trim(),

    definitions: [
      {
        term: 'Symmetric matrix',
        body: 'A square matrix $A$ with $A^T = A$. Equivalently, $a_{ij} = a_{ji}$ for all $i, j$.',
      },
      {
        term: 'Orthogonal matrix',
        body: 'A square matrix $Q$ with $Q^T Q = Q Q^T = I$, equivalently $Q^{-1} = Q^T$. Columns and rows are orthonormal.',
      },
      {
        term: 'Orthogonal diagonalization',
        body: 'A factorization $A = Q \\Lambda Q^T$ where $Q$ is orthogonal and $\\Lambda$ is diagonal. Equivalent to "$A$ has an orthonormal eigenbasis."',
      },
      {
        term: 'Eigenspace',
        body: 'The eigenspace for eigenvalue $\\lambda$ is $E_\\lambda = \\ker(A - \\lambda I)$. Its dimension is the geometric multiplicity of $\\lambda$. For symmetric matrices, geometric multiplicity equals algebraic multiplicity for every eigenvalue.',
      },
    ],

    theorems: [
      {
        name: 'Spectral Theorem (real symmetric case)',
        statement: 'Every real symmetric matrix $A$ has $n$ real eigenvalues (counted with multiplicity) and admits an orthonormal eigenbasis. Equivalently, $A = Q \\Lambda Q^T$ for some orthogonal $Q$ and diagonal $\\Lambda$ with real entries.',
        intuition: 'Symmetry forces a rigid geometric picture: the matrix scales space along $n$ perpendicular axes by real factors. The eigenstructure is completely real, completely diagonalizable, and orthogonal. No rotation, no shear, no defect — just pure axis-aligned scaling once you rotate into the eigenframe.',
      },
      {
        name: 'Orthogonality across distinct eigenvalues',
        statement: 'If $A$ is real symmetric and $A\\mathbf{u} = \\lambda \\mathbf{u}$, $A\\mathbf{v} = \\mu \\mathbf{v}$ with $\\lambda \\neq \\mu$, then $\\mathbf{u}^T \\mathbf{v} = 0$.',
        intuition: 'Compute $\\mathbf{u}^T A \\mathbf{v} = \\mu \\mathbf{u}^T \\mathbf{v}$ in one direction, and $\\mathbf{u}^T A \\mathbf{v} = (A\\mathbf{u})^T \\mathbf{v} = \\lambda \\mathbf{u}^T \\mathbf{v}$ using $A^T = A$. Equating, $(\\lambda - \\mu) \\mathbf{u}^T \\mathbf{v} = 0$; since $\\lambda \\neq \\mu$, the inner product must vanish. This is the *automatic* orthogonality; nothing has to be enforced when eigenvalues differ.',
      },
      {
        name: 'Within-eigenspace orthogonalization',
        statement: 'For an eigenvalue $\\lambda$ with geometric multiplicity $d > 1$, any basis of $E_\\lambda$ can be Gram-Schmidted to an orthonormal basis of $E_\\lambda$. The result is an orthonormal eigenbasis for $A$ when combined with eigenvectors from other eigenspaces.',
        intuition: 'Distinct-eigenvalue orthogonality is automatic, but within a single eigenspace, eigenvectors only need to span the right subspace, not be perpendicular. Gram-Schmidt manufactures perpendicularity inside the eigenspace, and (crucially) the resulting orthonormal vectors are still eigenvectors of $\\lambda$, since any linear combination of $\\lambda$-eigenvectors is itself a $\\lambda$-eigenvector.',
      },
      {
        name: 'Squared-norm formula for symmetric matrices',
        statement: 'If $A = Q\\Lambda Q^T$ and $\\mathbf{x} = \\sum_i c_i \\mathbf{q}_i$ with $c_i = \\mathbf{q}_i^T \\mathbf{x}$, then $\\|A\\mathbf{x}\\|^2 = \\sum_i \\lambda_i^2 c_i^2$.',
        intuition: '$A\\mathbf{x}$ has coordinates $\\lambda_i c_i$ in the orthonormal eigenbasis. Squared length in an orthonormal basis is just the sum of squared coordinates. Cross terms vanish because the basis vectors are mutually perpendicular.',
      },
    ],

    keyFormulas: [
      'A = Q \\Lambda Q^T, \\quad Q^T Q = I',
      'A \\mathbf{q}_i = \\lambda_i \\mathbf{q}_i, \\quad \\mathbf{q}_i^T \\mathbf{q}_j = \\delta_{ij}',
      '\\mathbf{x} = \\sum_i (\\mathbf{q}_i^T \\mathbf{x}) \\mathbf{q}_i',
      '\\|A\\mathbf{x}\\|^2 = \\sum_i \\lambda_i^2 (\\mathbf{q}_i^T \\mathbf{x})^2',
    ],
  },

  explore: {
    vizComponent: 'SymmetricSpectraViz',
    description: 'A 2D viz of a symmetric $2 \\times 2$ matrix acting on the unit circle. The two orthonormal eigenvectors are drawn as fixed perpendicular axes (in the $\\lambda$-color blue and the $\\lambda$-color yellow). The unit circle is shown deforming into an ellipse with axes along the eigendirections, with axis lengths $|\\lambda_1|, |\\lambda_2|$. A coefficient panel shows the user a chosen vector $\\mathbf{x}$ and decomposes it into its eigenbasis coordinates $c_1, c_2$. A repeated-eigenvalue toggle shows the special case $\\lambda_1 = \\lambda_2$, where the unit circle scales to a (possibly flipped) circle and *any* perpendicular pair of axes serves as an eigenbasis.',
    misconception: {
      title: 'Repeated eigenvalues are not automatically orthogonal — and other Spectral-Theorem traps',
      body: `The Spectral Theorem guarantees the *existence* of an orthonormal eigenbasis, not that every choice of eigenvectors is automatically orthogonal. For an eigenvalue with geometric multiplicity $1$ (a "simple" eigenvalue), the eigenvector is unique up to scalar, and orthogonality to eigenvectors of other eigenvalues is automatic. For an eigenvalue with geometric multiplicity $\\geq 2$ (a "repeated" eigenvalue with a multi-dimensional eigenspace), *any two linearly independent vectors in the eigenspace are eigenvectors*, but they need not be perpendicular to each other. To get an orthonormal eigenbasis one must apply Gram-Schmidt within the eigenspace.

Example: take $A = \\mathrm{diag}(5, 3, 3)$. The eigenspace for $\\lambda = 3$ is spanned by $\\mathbf{e}_2, \\mathbf{e}_3$, which happen to be orthogonal, so we are lucky. But the *non-orthogonal* pair $\\mathbf{e}_2, \\mathbf{e}_2 + \\mathbf{e}_3$ also lies in this eigenspace and is also a basis of eigenvectors for $\\lambda = 3$. The Spectral Theorem says we *can* choose an orthonormal basis (e.g., by Gram-Schmidting $\\mathbf{e}_2, \\mathbf{e}_2 + \\mathbf{e}_3$ to recover $\\mathbf{e}_2, \\mathbf{e}_3$), not that any choice works.

A second misconception: thinking a repeated eigenvalue means the matrix is *not* diagonalizable. For symmetric matrices, geometric multiplicity always equals algebraic multiplicity (this is what makes them clean), so repeated eigenvalues never produce defects. A symmetric matrix with eigenvalues $5, 3, 3$ has a 1D eigenspace for $\\lambda = 5$ and a 2D eigenspace for $\\lambda = 3$, and three linearly independent eigenvectors always exist. This is *only* true for symmetric (or more generally, normal) matrices; nonsymmetric matrices with repeated eigenvalues can fail to diagonalize (see [[jordan-form|Jordan form]]).

A third trap: assuming "symmetric" means "positive eigenvalues." Symmetry forces eigenvalues to be *real*, not *positive*. Eigenvalues of a symmetric matrix can be negative, zero, or positive in any combination. The stronger property "positive eigenvalues for symmetric $A$" is exactly the definition of *positive definite*, a separate condition.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: $\\|A\\mathbf{x}\\|^2$ via the spectral decomposition',
        body: 'Let $A$ be a real symmetric $n \\times n$ matrix with eigenvalues $\\lambda_1, \\ldots, \\lambda_n$ and orthonormal eigenvectors $\\mathbf{q}_1, \\ldots, \\mathbf{q}_n$. Write $\\mathbf{x} = c_1 \\mathbf{q}_1 + \\cdots + c_n \\mathbf{q}_n$ with $c_i = \\mathbf{q}_i^T \\mathbf{x}$.',
      },
      {
        title: 'Compute $A\\mathbf{x}$',
        body: 'By linearity and the eigenvector relation $A\\mathbf{q}_i = \\lambda_i \\mathbf{q}_i$: $A\\mathbf{x} = \\sum_i c_i A\\mathbf{q}_i = \\sum_i c_i \\lambda_i \\mathbf{q}_i$. So in the eigenbasis, $A\\mathbf{x}$ has coordinates $(\\lambda_1 c_1, \\ldots, \\lambda_n c_n)$.',
      },
      {
        title: 'Square the norm',
        body: 'Since the $\\mathbf{q}_i$ are orthonormal, the squared norm of a vector is the sum of squared coordinates in this basis: $\\|A\\mathbf{x}\\|^2 = \\sum_i (\\lambda_i c_i)^2 = \\sum_i \\lambda_i^2 c_i^2$. No cross terms; the orthonormality eliminated them. The formula $\\sum_i \\lambda_i^2 c_i^2$ is the clean spectral expression for energy under a symmetric map.',
      },
    ],

    problems: [
      {
        id: 'P-9.4a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Let $A$ be a real symmetric $n \\times n$ matrix with eigenvalues $\\lambda_1, \\ldots, \\lambda_n$ and orthonormal eigenvectors $\\mathbf{q}_1, \\ldots, \\mathbf{q}_n$. For any $\\mathbf{x} \\in \\mathbb{R}^n$, write $\\mathbf{x} = c_1 \\mathbf{q}_1 + \\cdots + c_n \\mathbf{q}_n$ with $c_i = \\mathbf{q}_i^T \\mathbf{x}$. What is $\\|A\\mathbf{x}\\|^2$ in terms of the eigenvalues and coefficients?',
        choices: [
          { label: 'A', body: '$\\lambda_1^2 c_1^2 + \\lambda_2^2 c_2^2 + \\cdots + \\lambda_n^2 c_n^2$' },
          { label: 'B', body: '$(\\lambda_1 c_1 + \\lambda_2 c_2 + \\cdots + \\lambda_n c_n)^2$' },
          { label: 'C', body: '$\\lambda_{\\max}^2 (c_1^2 + c_2^2 + \\cdots + c_n^2)$' },
          { label: 'D', body: '$c_1^2 + c_2^2 + \\cdots + c_n^2$' },
          { label: 'E', body: '$|\\lambda_1 c_1| + |\\lambda_2 c_2| + \\cdots + |\\lambda_n c_n|$' },
        ],
        correctAnswer: 'A',
        solution: {
          explanation: 'Apply $A$: $A\\mathbf{x} = \\sum_i c_i A \\mathbf{q}_i = \\sum_i \\lambda_i c_i \\mathbf{q}_i$. So $A\\mathbf{x}$ has coordinates $(\\lambda_1 c_1, \\ldots, \\lambda_n c_n)$ in the orthonormal eigenbasis. Since the basis is orthonormal, $\\|A\\mathbf{x}\\|^2 = \\sum_i (\\lambda_i c_i)^2 = \\sum_i \\lambda_i^2 c_i^2$. The orthonormality eliminates all cross terms.',
          partialCredit: 'Choice D is $\\|\\mathbf{x}\\|^2$ (no eigenvalues applied), which would be correct if $A = I$ but ignores the action of $A$ on the eigenbasis.',
          trickAnalysis: [
            { choice: 'B', why: 'Squares the sum instead of summing the squares. This is what you would get if you forgot the cross terms cancel due to orthogonality. Cross terms would only cancel after expansion if $\\mathbf{q}_i \\perp \\mathbf{q}_j$ for $i \\neq j$, which is exactly what makes the answer $\\sum_i \\lambda_i^2 c_i^2$, not the squared sum.' },
            { choice: 'C', why: 'Picks the largest eigenvalue as an upper bound. This is correct as an inequality ($\\|A\\mathbf{x}\\|^2 \\leq \\lambda_{\\max}^2 \\|\\mathbf{x}\\|^2$), but is not the exact value. The exact value uses the actual eigenvalues, not just the largest.' },
            { choice: 'D', why: 'This is $\\|\\mathbf{x}\\|^2$, ignoring the action of $A$. Forgets to multiply each coordinate by its eigenvalue.' },
            { choice: 'E', why: 'Replaces squared norm with sum of absolute values. Norms are defined by squared coordinates summed, then square-rooted; $\\|A\\mathbf{x}\\|^2$ is the squared sum, not absolute-value sum.' },
          ],
        },
      },
      {
        id: 'P-9.4b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Consider a network of six computer servers. The graph Laplacian $L = D - A$ (where $D$ is the degree matrix and $A$ is the adjacency matrix) has eigenvalues $\\lambda_1 = 0, \\lambda_2 = 0, \\lambda_3 = 2, \\lambda_4 = 3, \\lambda_5 = 4, \\lambda_6 = 5$. What can be concluded about the network topology?',
        choices: [
          { label: 'A', body: 'The network is fully connected since all servers are represented in the Laplacian.' },
          { label: 'B', body: 'The presence of $\\lambda = 2$ indicates exactly two servers are isolated from the rest.' },
          { label: 'C', body: 'Exactly two eigenvalues equal zero, indicating a computational error since graph Laplacians should have only one zero eigenvalue.' },
          { label: 'D', body: 'The network consists of exactly two separate connected components.' },
          { label: 'E', body: 'The network has six connected components, one for each eigenvalue.' },
        ],
        correctAnswer: 'D',
        solution: {
          explanation: 'A key theorem of spectral graph theory: the number of zero eigenvalues of the graph Laplacian equals the number of connected components of the graph. The Laplacian is real symmetric, so the spectral theorem applies; its kernel is spanned by the indicator vectors of the connected components (each one is in $\\ker(L)$ because $L$ acts by computing the discrete divergence within a component, which is zero on constant vectors). With two zero eigenvalues, there are exactly two connected components.',
          partialCredit: 'Choice C is partial credit in the sense that the student remembers a fact about zero eigenvalues of Laplacians but has the precise statement wrong (one zero per *component*, not one zero total).',
          trickAnalysis: [
            { choice: 'A', why: 'Confuses "all nodes are represented in the matrix" with "all nodes are connected." Every node is a row/column of $L$ regardless of connectivity.' },
            { choice: 'B', why: 'Misinterprets the eigenvalue $\\lambda = 2$. The eigenvalues other than zero do not directly count isolated nodes; they encode finer connectivity (algebraic connectivity, spectral gap). Specifically, an isolated node would actually correspond to a zero eigenvalue, not $\\lambda = 2$.' },
            { choice: 'C', why: 'A fully connected graph has exactly one zero eigenvalue (in the constant-vector direction). Multiple components give multiple zeros. This option confuses "one zero per Laplacian" with the correct "one zero per connected component."' },
            { choice: 'E', why: 'Confuses the total number of eigenvalues (which is always $n$ for an $n \\times n$ matrix) with the number of components. There are always $6$ eigenvalues of a $6 \\times 6$ Laplacian regardless of connectivity.' },
          ],
        },
      },
      {
        id: 'P-9.4c',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Let $A$ be a real *symmetric* $3 \\times 3$ matrix with eigenvalues $\\lambda_1 = 5$, $\\lambda_2 = 3$, $\\lambda_3 = 3$. Using the convention that each eigenvector $\\mathbf{v}_i$ corresponds to $\\lambda_i$, which statement is most correct?',
        choices: [
          { label: 'A', body: 'The eigenspace for $\\lambda = 3$ has dimension $1$, so only one of $\\mathbf{v}_2, \\mathbf{v}_3$ exists.' },
          { label: 'B', body: '$\\mathbf{v}_1$ must be orthogonal to $\\mathbf{v}_2$ and $\\mathbf{v}_3$, but $\\mathbf{v}_2$ and $\\mathbf{v}_3$ need not be orthogonal since they share an eigenvalue.' },
          { label: 'C', body: 'All three eigenvectors exist, but we must apply Gram-Schmidt within the eigenspace for $\\lambda = 3$ to make $\\mathbf{v}_2$ and $\\mathbf{v}_3$ orthogonal.' },
          { label: 'D', body: 'The repeated eigenvalue means $A$ is not diagonalizable, so we cannot find three linearly independent eigenvectors.' },
          { label: 'E', body: 'All three $\\mathbf{v}_i$ exist and are automatically mutually orthogonal.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'Symmetry guarantees geometric multiplicity equals algebraic multiplicity for each eigenvalue, so the eigenspace for $\\lambda = 3$ is 2-dimensional. Inside this 2D eigenspace, *any* pair of linearly independent vectors is a basis of eigenvectors for $\\lambda = 3$, but they need not be perpendicular. Orthogonality across the distinct eigenvalues $5$ and $3$ is automatic ($\\mathbf{v}_1 \\perp \\mathbf{v}_2$ and $\\mathbf{v}_1 \\perp \\mathbf{v}_3$ for any choice). To make $\\mathbf{v}_2 \\perp \\mathbf{v}_3$ within the repeated eigenspace, we apply Gram-Schmidt; this is what the Spectral Theorem guarantees we can always do.',
          partialCredit: 'Choice B is mostly right but misses the Gram-Schmidt construction. It correctly identifies that $\\mathbf{v}_2, \\mathbf{v}_3$ need not be orthogonal *as chosen*, but stops short of saying we can manufacture an orthogonal pair. Choice E is also partial: it has the right final conclusion (orthonormal eigenbasis exists) but skips the construction step, implying orthogonality is automatic when it must be enforced inside the eigenspace.',
          trickAnalysis: [
            { choice: 'A', why: 'False: for symmetric matrices, geometric multiplicity equals algebraic multiplicity. The eigenspace for $\\lambda = 3$ has dimension $2$, not $1$, so both $\\mathbf{v}_2$ and $\\mathbf{v}_3$ can be chosen as linearly independent eigenvectors.' },
            { choice: 'B', why: 'Mostly correct but stops short. $\\mathbf{v}_2, \\mathbf{v}_3$ need not be orthogonal as chosen, but the Spectral Theorem guarantees we can Gram-Schmidt them within the eigenspace to make them orthogonal — which choice C states explicitly.' },
            { choice: 'D', why: 'False: symmetric matrices are always diagonalizable, regardless of repeated eigenvalues. Three linearly independent eigenvectors always exist.' },
            { choice: 'E', why: 'Skips the construction step. Orthogonality is automatic *across* distinct eigenvalues, but *within* a repeated eigenspace it must be enforced via Gram-Schmidt.' },
          ],
        },
      },
    ],
  },
};
