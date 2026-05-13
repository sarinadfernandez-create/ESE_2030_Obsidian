import type { Concept } from '../types';

export const pcaOptimality: Concept = {
  id: 'pca-optimality',
  unitId: 'ch11',
  number: '11.3',
  title: 'PCA Optimality',
  blurb: 'The principal components are the unique solution to two optimization problems at once: maximum variance, and minimum reconstruction error.',
  tier: 'full',

  learn: {
    overview: `
[[principal-components|Principal Component Analysis]] is special among dimensionality-reduction techniques because it solves two seemingly unrelated optimization problems with the *same answer*. The first problem is variance maximization: find the orthonormal directions that capture as much variance as possible. The second is reconstruction-error minimization: find the rank-$k$ subspace whose [[orthogonal-projections|orthogonal projection]] of the data has smallest squared error. These are not two interpretations of the same setup; they are two distinct geometric problems whose optima coincide on the principal components. This double optimality is what makes PCA the canonical linear method, not just one of many.

The variance-maximization characterization is the cleanest. Among all unit vectors $\\mathbf{u} \\in \\mathbb{R}^d$, the variance $\\mathbf{u}^T \\Sigma \\mathbf{u}$ is maximized at $\\mathbf{u} = \\mathbf{q}_1$ (the top eigenvector of $\\Sigma$), with maximum $\\lambda_1$. Among unit vectors orthogonal to $\\mathbf{q}_1$, the variance is maximized at $\\mathbf{q}_2$, with maximum $\\lambda_2$. And so on. The principal components are the *Lagrange-multiplier critical points* of variance under the unit-norm constraint, which are exactly the eigenvectors of the covariance matrix. The constraint chain forces orthogonality at each step.

The reconstruction-error characterization is dual. Among all $k$-dimensional subspaces $W \\subset \\mathbb{R}^d$, the one that minimizes $\\sum_i \\|\\mathbf{x}_i - \\Pi_W(\\mathbf{x}_i)\\|^2$ (the sum of squared distances from data points to their orthogonal projections) is exactly $W = \\mathrm{span}(\\mathbf{q}_1, \\ldots, \\mathbf{q}_k)$. The minimum squared error is $\\sum_{j > k} \\lambda_j$ — the total variance discarded by dropping the trailing components. This is the Eckart-Young theorem in its PCA disguise: rank-$k$ projection onto the top principal components is the best rank-$k$ linear approximation of the data, in [[least-squares|Frobenius / least-squares norm]].

The deepest invariance fact: PCA is *invariant under rotations of feature space*. If $X$ is replaced by $Y = X Q$ for some orthogonal $Q \\in \\mathbb{R}^{d \\times d}$, the singular values of $Y$ are identical to those of $X$ (since $Y^T Y = Q^T X^T X Q$ is similar to $X^T X$). The principal components transform as $\\mathbf{w}_k = Q^T \\mathbf{v}_k$: the rotation propagates from feature space into PC space. Total variance is preserved; the explained-variance proportions are preserved; the *content* of the PCA is rotation-invariant. The only thing that changes is the coordinate expression of the answer.

This invariance is conceptually significant because it tells you what PCA is actually computing: an intrinsic geometric structure of the data cloud (its principal axes), not a representation that depends on which features you chose to record. As long as a coordinate system is related to the original by an orthogonal transformation, the PCA is the *same analysis* expressed in new coordinates. By contrast, non-orthogonal transformations (rescaling individual features, mixing features unevenly) change the analysis substantively — which is exactly why [[pca-preprocessing|standardization]] matters before applying PCA: it is a non-orthogonal transformation that changes the answer.

The optimality is exclusive to *linear* dimensionality reduction. For nonlinear data — points on a curved manifold, clusters arranged in a circle, features related by squaring or trigonometric functions — the linear best-fit subspace can be a bad summary. The double-optimality of PCA holds inside the world of linear subspaces, and that world has limits; recognizing those limits is the entry to [[beyond-linear-pca|nonlinear methods]].
    `.trim(),

    definitions: [
      {
        term: 'Variance-maximization formulation',
        body: 'Find unit $\\mathbf{u}_1$ maximizing $\\mathbf{u}^T \\Sigma \\mathbf{u}$; then find unit $\\mathbf{u}_2$ orthogonal to $\\mathbf{u}_1$ maximizing the same form; and so on. The optimal $\\mathbf{u}_k$ is $\\mathbf{q}_k$, the $k$-th eigenvector of $\\Sigma$.',
      },
      {
        term: 'Reconstruction-error minimization',
        body: 'Find a $k$-dimensional subspace $W \\subset \\mathbb{R}^d$ minimizing $\\sum_i \\|\\mathbf{x}_i - \\Pi_W(\\mathbf{x}_i)\\|^2$, where $\\Pi_W$ is orthogonal projection onto $W$. The minimizer is $W^* = \\mathrm{span}(\\mathbf{q}_1, \\ldots, \\mathbf{q}_k)$.',
      },
      {
        term: 'Eckart-Young theorem (PCA form)',
        body: 'The best rank-$k$ approximation of $X$ in the Frobenius norm is $X_k = U_k \\Sigma_k V_k^T$, formed from the top-$k$ singular triples. Equivalently, projecting the data onto the top $k$ principal components minimizes total squared reconstruction error.',
      },
      {
        term: 'Rotational invariance',
        body: 'For any orthogonal $Q$, the PCA of $Y = X Q$ has the same singular values as the PCA of $X$. The principal components transform as $\\mathbf{w}_k = Q^T \\mathbf{v}_k$ and the explained-variance ratios are preserved.',
      },
    ],

    theorems: [
      {
        name: 'Double optimality of PCA',
        statement: 'The orthonormal basis $\\{\\mathbf{q}_1, \\ldots, \\mathbf{q}_k\\}$ maximizes the sum of variances $\\sum_{j=1}^k \\mathbf{q}_j^T \\Sigma \\mathbf{q}_j$ over all orthonormal $k$-tuples, *and* simultaneously minimizes $\\sum_i \\|\\mathbf{x}_i - \\Pi_W(\\mathbf{x}_i)\\|^2$ over all $k$-dimensional subspaces $W$.',
        intuition: 'Total variance is conserved by orthogonal projection: variance captured by $W$ plus variance lost in the residual equals the total. So maximizing the captured variance is the same as minimizing the residual. The two optimization problems are mirror images, and their optimum is the same set of vectors.',
      },
      {
        name: 'Rotational invariance of PCA',
        statement: 'If $Y = X Q$ for orthogonal $Q \\in \\mathbb{R}^{d \\times d}$, then $Y^T Y$ has the same eigenvalues as $X^T X$, and the eigenvectors satisfy $\\mathbf{w}_k = Q^T \\mathbf{v}_k$. The singular values $\\sigma_k$, total variance, and explained-variance ratios are identical.',
        intuition: 'Multiplying $X$ on the right by an orthogonal matrix is a rotation of feature space. The intrinsic geometry of the data cloud does not depend on which orthogonal frame you record it in. PCA reports the same answer, just expressed in the new coordinate system.',
      },
      {
        name: 'Truncation error formula',
        statement: 'The squared error of approximating the data by its projection onto the top $k$ PCs is exactly $\\sum_{j=k+1}^d \\lambda_j$, the sum of discarded eigenvalues.',
        intuition: 'Each PC captures variance $\\lambda_k$. Total variance is the sum. Variance captured by the first $k$ is $\\lambda_1 + \\cdots + \\lambda_k$; variance left over (squared reconstruction error) is $\\lambda_{k+1} + \\cdots + \\lambda_d$.',
      },
    ],

    keyFormulas: [
      '\\max_{\\|\\mathbf{u}\\| = 1} \\mathbf{u}^T \\Sigma \\mathbf{u} = \\lambda_1, \\quad \\text{achieved at } \\mathbf{u} = \\mathbf{q}_1',
      '\\min_W \\sum_i \\|\\mathbf{x}_i - \\Pi_W(\\mathbf{x}_i)\\|^2 = \\sum_{j > k} \\lambda_j',
      'Y = XQ \\implies \\mathbf{w}_k = Q^T \\mathbf{v}_k, \\quad \\sigma_k(Y) = \\sigma_k(X)',
      '\\|X - X_k\\|_F^2 = \\sum_{j > k} \\sigma_j^2',
    ],
  },

  explore: {
    vizComponent: 'PcaOptimalityViz',
    description: 'A 2D centered data cloud with two visible candidate fitting lines: the user-rotatable "trial" line and the actual top PC. The viz simultaneously displays variance captured by the trial line ($\\mathbf{u}^T \\Sigma \\mathbf{u}$) and total squared residual. As the user rotates the trial line, both quantities change in opposite directions — the variance captured peaks at the PC direction precisely when the residual hits its minimum. A second mode applies an orthogonal rotation $Q$ to the feature axes and shows that the singular values stay fixed while the eigenvectors rotate.',
    misconception: {
      title: 'Treating PCA as variance-maximization OR residual-minimization, instead of recognizing they are the same problem',
      body: `A common error is to apply PCA in one framing and then doubt the answer in the other framing. A student tasked with "find the line through the data that minimizes squared distance to points" sometimes second-guesses the PCA answer because it does not look like an [[least-squares|ordinary least squares]] regression. This confusion comes from conflating two different residuals.

In linear regression, the residual is *vertical* (the error in the response variable). The best line minimizes squared vertical distances. In PCA, the residual is *perpendicular* to the fitting line (the error in any direction). The PCA line minimizes perpendicular squared distances, which is symmetric in the two variables. That symmetric residual is what links variance maximization (capture as much spread as possible along a direction) with reconstruction minimization (lose as little as possible perpendicular to it). The conservation identity is $\\text{captured} + \\text{lost} = \\text{total}$.

A second, more subtle error: assuming PCA is the *only* dimensionality-reduction technique that has this kind of optimality. The double-optimality is specific to the *linear, orthogonal* setting. If the constraint is relaxed to "any $k$-dimensional manifold," PCA's linear subspace can be far from optimal.

The third trap: misidentifying rotational invariance with scale invariance. PCA is invariant under orthogonal transformations of feature space, but *not* under coordinate rescalings (multiplying one feature by a constant). The latter is a [[pca-preprocessing|preprocessing choice]] that changes the answer.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: rotate feature space by $Q$',
        body: 'Suppose $X \\in \\mathbb{R}^{100 \\times 6}$ has singular values $\\sigma_1 = 20, \\sigma_2 = 15, \\sigma_3 = 8, \\sigma_4 = 5, \\sigma_5 = 2, \\sigma_6 = 1$ and principal components $\\mathbf{v}_1, \\ldots, \\mathbf{v}_6$. An analyst forms $Y = X Q$ for some orthogonal $Q \\in \\mathbb{R}^{6 \\times 6}$.',
      },
      {
        title: 'Compute the new singular values and PCs',
        body: 'Since $Y^T Y = Q^T X^T X Q$ is similar to $X^T X$ via the orthogonal $Q$, the eigenvalues are identical: singular values of $Y$ are still $\\{20, 15, 8, 5, 2, 1\\}$. Computing: $Y^T Y (Q^T \\mathbf{v}_k) = Q^T X^T X \\mathbf{v}_k = \\sigma_k^2 Q^T \\mathbf{v}_k$. So new PCs are $\\mathbf{w}_k = Q^T \\mathbf{v}_k$.',
      },
      {
        title: 'Interpret',
        body: 'Total variance, explained-variance ratios, and rank are all unchanged. Only the *coordinate representation* of the PCs changes. The intrinsic geometry of the data cloud is unchanged.',
      },
    ],

    problems: [
      {
        id: 'P-11.3a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Two analysts work with the same centered data matrix $X \\in \\mathbb{R}^{100 \\times 6}$ with singular values $\\sigma_1 = 20, \\sigma_2 = 15, \\sigma_3 = 8, \\sigma_4 = 5, \\sigma_5 = 2, \\sigma_6 = 1$. Analyst A performs PCA directly on $X$. Analyst B first applies an orthogonal transformation $Q$ to get $Y = XQ$, then performs PCA on $Y$. How do their results compare?',
        choices: [
          { label: 'A', body: "Analyst B's principal components are related to Analyst A's by $\\mathbf{w}_k = Q^T \\mathbf{v}_k$, where $\\mathbf{v}_k$ are A's principal components." },
          { label: 'B', body: 'Both analysts obtain identical singular values, but their principal-component directions differ.' },
          { label: 'C', body: "Analyst A's results are superior because applying $Q$ distorts the covariance structure of the data." },
          { label: 'D', body: 'The analyses are equivalent only if $Q$ is a rotation (determinant $+1$), not if $Q$ includes a reflection (determinant $-1$).' },
          { label: 'E', body: 'Both analyses capture the same total variance and same variance proportions, but the *ordering* of principal components may differ.' },
        ],
        correctAnswer: 'A',
        solution: {
          explanation: 'Multiplying $X$ on the right by orthogonal $Q$ gives $Y^T Y = Q^T X^T X Q$, similar to $X^T X$. If $X^T X \\mathbf{v}_k = \\sigma_k^2 \\mathbf{v}_k$, then $Y^T Y (Q^T \\mathbf{v}_k) = \\sigma_k^2 (Q^T \\mathbf{v}_k)$. So $\\mathbf{w}_k = Q^T \\mathbf{v}_k$.',
          partialCredit: 'Choice B captures the singular-value invariance but does not specify the relationship between the directions.',
          trickAnalysis: [
            { choice: 'B', why: 'Partial truth: same singular values and different PCs. But the relationship is *exactly* $\\mathbf{w}_k = Q^T \\mathbf{v}_k$.' },
            { choice: 'C', why: 'Reverses cause and effect. Orthogonal $Q$ re-expresses the structure in new coordinates, not distorts it.' },
            { choice: 'D', why: 'False distinction. PCA invariance holds for both rotations and reflections.' },
            { choice: 'E', why: 'False: orthogonal transformations preserve eigenvalue values, so the ordering is preserved.' },
          ],
        },
      },
      {
        id: 'P-11.3b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A centered dataset has PC variances $\\lambda_1 = 80, \\lambda_2 = 15, \\lambda_3 = 4, \\lambda_4 = 1$. An analyst projects every observation onto the top-2 principal components and reconstructs the data. What is the total squared reconstruction error?',
        choices: [
          { label: 'A', body: '$\\lambda_1 + \\lambda_2 = 95$' },
          { label: 'B', body: '$\\lambda_3 + \\lambda_4 = 5$' },
          { label: 'C', body: '$\\lambda_3^2 + \\lambda_4^2 = 17$' },
          { label: 'D', body: '$\\sqrt{\\lambda_3 + \\lambda_4} = \\sqrt{5}$' },
          { label: 'E', body: 'The reconstruction error cannot be determined from the eigenvalues alone.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Projecting onto the top $k$ PCs incurs squared reconstruction error equal to the sum of discarded eigenvalues: $\\sum_{j > k} \\lambda_j$. With $k = 2$, the discarded sum is $\\lambda_3 + \\lambda_4 = 4 + 1 = 5$.',
          partialCredit: 'Choice A is the *retained* variance. The student inverted the question.',
          trickAnalysis: [
            { choice: 'A', why: 'Computes variance *captured*, not variance *lost*.' },
            { choice: 'C', why: 'Squares the eigenvalues unnecessarily.' },
            { choice: 'D', why: 'Takes the square root of the right answer. The question asked for "total squared error."' },
            { choice: 'E', why: 'False: the formula depends only on the eigenvalues.' },
          ],
        },
      },
    ],
  },
};
