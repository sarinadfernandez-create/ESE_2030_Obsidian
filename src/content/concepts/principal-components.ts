import type { Concept } from '../types';

export const principalComponents: Concept = {
  id: 'principal-components',
  unitId: 'ch11',
  number: '11.2',
  title: 'Principal Components',
  blurb: 'Eigenvectors of the covariance matrix are the orthogonal directions of maximum variance. Their eigenvalues are exactly those variances.',
  tier: 'full',

  learn: {
    overview: `
*Principal Component Analysis* is the [[symmetric-spectra|spectral theorem]] applied to the [[covariance|covariance matrix]] $\\Sigma = \\frac{1}{n-1} X^T X$. Because $\\Sigma$ is symmetric positive semidefinite, it has an orthonormal eigenbasis $\\mathbf{q}_1, \\ldots, \\mathbf{q}_d$ with nonnegative eigenvalues $\\lambda_1 \\geq \\lambda_2 \\geq \\cdots \\geq \\lambda_d \\geq 0$. The eigenvectors are the *principal components* (or *loadings*); the eigenvalues are the *variances along those directions*. Together they give a coordinate system, aligned to the data, in which the features are decorrelated.

The single most important interpretive fact: $\\lambda_k = \\mathrm{Var}(X \\mathbf{q}_k)$. Project the centered data onto $\\mathbf{q}_k$ to get a $1$-dimensional vector of *scores* $X \\mathbf{q}_k \\in \\mathbb{R}^n$; the variance of these scores is $\\lambda_k$. The first principal component is the direction of *maximum* variance; the second is the direction of maximum variance orthogonal to the first; and so on. Each $\\lambda_k$ literally measures how much variance lives along the $k$-th principal axis, in the same units as the input features (squared).

The total variance in the dataset is conserved: $\\sum_i \\mathrm{Var}(X_i) = \\mathrm{tr}(\\Sigma) = \\sum_k \\lambda_k$. So the *fraction* of total variance captured by the first $k$ components is $(\\lambda_1 + \\cdots + \\lambda_k) / \\sum_j \\lambda_j$. This proportion is the standard yardstick for "how good is a rank-$k$ approximation": a scree plot of $\\lambda_k$ versus $k$ shows whether the data has clear low-dimensional structure (a few large eigenvalues then a sharp drop) or is genuinely high-dimensional (gradually decreasing eigenvalues with no break).

There is a clean connection to the [[svd-form|SVD]]. If $X = U \\Sigma_{\\mathrm{svd}} V^T$ is the singular value decomposition of the centered $X$, then the right singular vectors $\\mathbf{v}_k$ are the principal components, and the singular values satisfy $\\sigma_k^2 = (n-1) \\lambda_k$. So $\\lambda_k = \\sigma_k^2 / (n-1)$: the eigenvalues of the covariance are the *squared singular values*, scaled by the sample-size correction. The eigenvectors of $X^T X$ (which appear in problems where the $\\frac{1}{n-1}$ factor is absorbed) are identical to those of $\\Sigma$; they just have eigenvalues $\\sigma_k^2$ instead of $\\sigma_k^2 / (n-1)$.

Geometrically, the map $T(\\mathbf{v}) = X \\mathbf{v}$ from $\\mathbb{R}^d$ to $\\mathbb{R}^n$ sends the unit sphere to an ellipsoid whose semi-axes have lengths equal to the singular values $\\sigma_k = \\sqrt{\\lambda_k (n-1)}$. The directions of the semi-axes are the [[spheres-ellipsoids|right singular vectors]] $\\mathbf{v}_k$, which are also the principal components. The *ratio* of semi-axes is $\\sigma_1 : \\sigma_2 : \\cdots = \\sqrt{\\lambda_1} : \\sqrt{\\lambda_2} : \\cdots$, while the *ratio* of PC variances is $\\lambda_1 : \\lambda_2 : \\cdots = \\sigma_1^2 : \\sigma_2^2 : \\cdots$. These are different ratios because variances scale as squared lengths. A 4:2:1 ellipsoid has variance ratios 16:4:1.

Interpreting the principal components themselves requires reading their entries. Each $\\mathbf{q}_k \\in \\mathbb{R}^d$ is a unit vector in feature space, and its entries tell you which features participate in that mode of variation. A first PC like $\\mathbf{q}_1 = (1,1,1,1)/2$ on four bridge sensors means all four sensors move together — uniform translation. A second PC like $\\mathbf{q}_2 = (1,0,0,-1)/\\sqrt{2}$ means the first and fourth sensors are anti-correlated and the middle two are silent — an asymmetric end-rocking mode. Physical or domain interpretation of PCs is one of the main payoffs of the technique, but only when the data has been [[pca-preprocessing|preprocessed]] to make the features comparable.
    `.trim(),

    definitions: [
      {
        term: 'Principal components (PCs)',
        body: 'The orthonormal eigenvectors $\\mathbf{q}_1, \\ldots, \\mathbf{q}_d$ of the covariance matrix $\\Sigma$, ordered by decreasing eigenvalue $\\lambda_1 \\geq \\lambda_2 \\geq \\cdots$. Each $\\mathbf{q}_k$ is a unit vector in feature space $\\mathbb{R}^d$.',
      },
      {
        term: 'Score on the $k$-th PC',
        body: 'The vector $X \\mathbf{q}_k \\in \\mathbb{R}^n$, the projection of the centered data onto the $k$-th principal axis. Its variance is exactly $\\lambda_k$. Different observations get different scores; the spread of those scores along $\\mathbf{q}_k$ is $\\sqrt{\\lambda_k}$ (a standard deviation).',
      },
      {
        term: 'Explained variance ratio',
        body: 'The fraction $\\lambda_k / \\sum_j \\lambda_j$ measures the proportion of total variance carried by the $k$-th PC. Cumulative explained variance is $(\\lambda_1 + \\cdots + \\lambda_k) / \\sum_j \\lambda_j$.',
      },
      {
        term: 'Scree plot',
        body: 'A plot of $\\lambda_k$ (or cumulative explained variance) versus the index $k$. A sharp "elbow" indicates a natural cutoff for low-dimensional structure; a gradual decay indicates no clear intrinsic dimensionality.',
      },
      {
        term: 'Intrinsic dimensionality',
        body: 'The effective number of principal components needed to explain a target fraction (commonly 90% or 95%) of total variance. A dataset with steep $\\lambda$-decay has low intrinsic dimensionality; a dataset with flat decay has high intrinsic dimensionality.',
      },
    ],

    theorems: [
      {
        name: 'Variance along a unit direction',
        statement: 'For any unit vector $\\mathbf{u} \\in \\mathbb{R}^d$, the variance of the score $X \\mathbf{u}$ is $\\mathbf{u}^T \\Sigma \\mathbf{u}$.',
        intuition: 'The variance of a linear combination of features is a quadratic form in the coefficients. The covariance matrix is the kernel of that quadratic form. The principal components are the *unit-norm* directions that extremize $\\mathbf{u}^T \\Sigma \\mathbf{u}$; the maximum is $\\lambda_1$, achieved at $\\mathbf{u} = \\mathbf{q}_1$.',
      },
      {
        name: 'Maximum-variance characterization',
        statement: 'The first PC $\\mathbf{q}_1$ maximizes $\\mathbf{u}^T \\Sigma \\mathbf{u}$ over all unit $\\mathbf{u}$. The $k$-th PC $\\mathbf{q}_k$ maximizes $\\mathbf{u}^T \\Sigma \\mathbf{u}$ subject to $\\|\\mathbf{u}\\| = 1$ and $\\mathbf{u} \\perp \\mathbf{q}_1, \\ldots, \\mathbf{q}_{k-1}$. The maximum value is $\\lambda_k$.',
        intuition: 'PCA is a greedy maximization. The first PC grabs the direction of largest variance; the second PC grabs the largest variance left over, orthogonal to the first; and so on.',
      },
      {
        name: 'Total variance is the trace',
        statement: '$\\sum_i \\mathrm{Var}(X_i) = \\mathrm{tr}(\\Sigma) = \\sum_k \\lambda_k$.',
        intuition: 'The trace of a symmetric matrix equals the sum of its eigenvalues. The total variance summed across original features equals the total variance summed across principal components. The eigendecomposition does not create or destroy variance; it only redistributes it across a different basis.',
      },
      {
        name: 'PCA via SVD of $X$',
        statement: 'For centered $X$ with SVD $X = U \\Sigma_{\\mathrm{svd}} V^T$, the right singular vectors are the principal components ($\\mathbf{q}_k = \\mathbf{v}_k$) and the eigenvalues of $\\Sigma$ are $\\lambda_k = \\sigma_k^2 / (n-1)$.',
        intuition: 'The SVD is the more general object: it decomposes $X$ itself, not just $X^T X$. Computing PCA from the SVD is numerically preferable to forming $X^T X$ (which can be ill-conditioned).',
      },
    ],

    keyFormulas: [
      '\\Sigma \\mathbf{q}_k = \\lambda_k \\mathbf{q}_k, \\quad \\lambda_1 \\geq \\lambda_2 \\geq \\cdots \\geq \\lambda_d \\geq 0',
      '\\mathrm{Var}(X \\mathbf{u}) = \\mathbf{u}^T \\Sigma \\mathbf{u}',
      '\\text{cumulative explained variance} = \\frac{\\lambda_1 + \\cdots + \\lambda_k}{\\lambda_1 + \\cdots + \\lambda_d}',
      '\\sigma_k^2 = (n-1) \\lambda_k',
    ],
  },

  explore: {
    vizComponent: 'PrincipalComponentsViz',
    description: 'A 2D centered data cloud with the two principal-axis directions overlaid as orthogonal arrows (length $\\sqrt{\\lambda_1}$ and $\\sqrt{\\lambda_2}$ respectively, scaled to fit). The user can reshape the cloud by dragging an "elongation" slider and a "rotation" slider, and the principal components update in real time. A second panel shows the projected scores $X \\mathbf{q}_1$ and $X \\mathbf{q}_2$ as 1D histograms; their spreads are visibly $\\sqrt{\\lambda_1}$ and $\\sqrt{\\lambda_2}$. A third panel shows the scree plot. The cumulative explained variance ratio is displayed numerically.',
    misconception: {
      title: 'Confusing singular values with eigenvalues of $\\Sigma$, and reading PC entries as feature importance',
      body: `Two patterns of error dominate.

First: confusing the *singular values* $\\sigma_k$ of the data matrix $X$ with the *eigenvalues* $\\lambda_k$ of the covariance matrix $\\Sigma$. These are related but not equal: $\\sigma_k^2 = (n-1) \\lambda_k$, so the singular values are roughly the *square roots* of the variances (times $\\sqrt{n-1}$). Geometrically, $\\sigma_k$ is the *length* of the $k$-th semi-axis of the data ellipsoid (a standard deviation, in units of the features); $\\lambda_k$ is the *squared* length (a variance, in squared units). If the data ellipsoid has semi-axes in ratio $4:2:1$, the principal-component variances have ratio $16:4:1$.

Second: interpreting the entries of a single PC as "feature importances" in an absolute sense. A PC $\\mathbf{q}_1 = (0.002, 0.998, 0.005)^T$ does *not* mean feature 2 is intrinsically the most important; it means feature 2 dominates *this particular variance direction*. If feature 2 happens to have a much larger scale, it will dominate the covariance just because its values are bigger numbers. This is the central reason why [[pca-preprocessing|standardization or correlation PCA]] is often necessary before interpretation.

A third, subtler trap: assuming that two datasets with the *same total variance* have the same low-dimensional structure. Two datasets can both have $\\sum_k \\lambda_k = 100$, but one with $\\lambda = (90, 7, 2, 1, 0)$ has clean 1D structure while another with $\\lambda = (25, 22, 20, 18, 15)$ has no usable low-dimensional approximation. The total variance is not the right summary; the *decay pattern* is.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: from eigenvalues to explained variance',
        body: 'Suppose $\\Sigma \\in \\mathbb{R}^{4 \\times 4}$ has eigenvalues $\\lambda_1 = 36, \\lambda_2 = 9, \\lambda_3 = 4, \\lambda_4 = 1$. Total variance is $36 + 9 + 4 + 1 = 50$. The first PC captures $36/50 = 72\\%$; the first two together capture $90\\%$; the first three capture $98\\%$.',
      },
      {
        title: 'Interpret the eigenvectors',
        body: 'If the data come from four sensors $(N\\text{-anchor}, N\\text{-midspan}, S\\text{-midspan}, S\\text{-anchor})$ and $\\mathbf{q}_1 = (1,1,1,1)/2$, this PC represents uniform motion. $\\mathbf{q}_2 = (1,0,0,-1)/\\sqrt{2}$ is an end-rocking mode. $\\mathbf{q}_3 = (0,1,-1,0)/\\sqrt{2}$ is a midspan-torsion mode.',
      },
      {
        title: 'Convert PC variances to ellipsoid semi-axes',
        body: 'If the data lives in a $100$-point ellipsoid with PC variances $36, 9, 4, 1$, the corresponding singular values are $\\sigma_k = \\sqrt{99 \\lambda_k}$. Ratios: $\\sigma_1 : \\sigma_2 : \\sigma_3 : \\sigma_4 = 6 : 3 : 2 : 1$. Variance ratios: $36 : 9 : 4 : 1$. Length ratios and variance ratios differ because variances are squared lengths.',
      },
    ],

    problems: [
      {
        id: 'P-11.2a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Four vibration sensors measure vertical displacement (in mm) on a suspension bridge at locations: North anchor, North midspan, South midspan, South anchor. After centering, covariance PCA reveals eigenvectors and eigenvalues of $X^T X$:\n$$\\mathbf{v}_1 = \\frac{1}{2}\\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\\\ 1 \\end{pmatrix}, \\quad \\mathbf{v}_2 = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ -1 \\end{pmatrix}, \\quad \\mathbf{v}_3 = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 0 \\\\ 1 \\\\ -1 \\\\ 0 \\end{pmatrix}$$\nwith eigenvalues $\\lambda_1 = 36$, $\\lambda_2 = 9$, $\\lambda_3 = 4$, $\\lambda_4 = 1$. Which interpretation is most consistent with these results?',
        choices: [
          { label: 'A', body: '$\\mathbf{v}_1$ represents uniform vertical motion of the entire bridge, capturing $72\\%$ of the variance.' },
          { label: 'B', body: '$\\mathbf{v}_2$ represents anti-symmetric end motion where the anchors move oppositely, while midspan points remain stationary.' },
          { label: 'C', body: '$\\mathbf{v}_3$ represents antisymmetric bending where the two midspan points move in opposite directions while anchors remain fixed.' },
          { label: 'D', body: 'All of the above (A, B, and C) are correct interpretations of the principal components.' },
          { label: 'E', body: 'None of the above.' },
        ],
        correctAnswer: 'D',
        solution: {
          explanation: 'Each statement holds. (A): $\\mathbf{v}_1$ has all entries equal and positive — uniform motion; variance share $36/50 = 72\\%$. (B): $\\mathbf{v}_2$ nonzero only at anchors with opposite signs — anchors oppose, midspans still. (C): $\\mathbf{v}_3$ supported on midspans with opposite signs — midspans oppose, anchors fixed. The three modes together account for $98\\%$ of total variance.',
          partialCredit: 'Choices A, B, and C are each individually correct. A student who picks one in isolation has read the eigenvectors correctly but missed that all three statements coexist.',
          trickAnalysis: [
            { choice: 'A', why: 'Correct in isolation but incomplete. Verified the first PC and stopped.' },
            { choice: 'B', why: 'Correct in isolation but incomplete. Same pattern.' },
            { choice: 'C', why: 'Correct in isolation but incomplete. Same pattern.' },
            { choice: 'E', why: 'Rejects all three interpretations. The match here is exact.' },
          ],
        },
      },
      {
        id: 'P-11.2b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Two centered data matrices are analyzed via covariance PCA. **Dataset A**: $X_A \\in \\mathbb{R}^{200 \\times 10}$ has nonzero singular values $\\sigma_1 = 24, \\sigma_2 = 22, \\sigma_3 = 20, \\sigma_4 = 18, \\sigma_5 = 16, \\ldots$ (slowly decreasing). **Dataset B**: $X_B \\in \\mathbb{R}^{200 \\times 10}$ has nonzero singular values $\\sigma_1 = 50, \\sigma_2 = 25, \\sigma_3 = 8, \\sigma_4 = 3, \\sigma_5 = 1, \\ldots$ Which statement best characterizes the difference?',
        choices: [
          { label: 'A', body: 'Dataset A has clearer low-dimensional structure.' },
          { label: 'B', body: 'Dataset B has clearer low-dimensional structure.' },
          { label: 'C', body: 'Dataset A is better for dimensionality reduction because it has higher total variance.' },
          { label: 'D', body: 'Both datasets have similar intrinsic dimensionality since all singular values are positive.' },
          { label: 'E', body: 'Dataset B should have been handled via correlation PCA instead.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Low-dimensional structure means a few singular values dominate the rest. For Dataset B, PC1 alone captures $\\approx 78\\%$ and the first two $\\approx 98\\%$; there is a clear elbow after $\\sigma_2$. For Dataset A, the first five singular values are all comparable; no clear elbow. Dataset B has clearer low-dimensional structure.',
          trickAnalysis: [
            { choice: 'A', why: 'Inverts the relationship between gap size and low-dimensional structure. A *gradual* decay means high intrinsic dimensionality.' },
            { choice: 'C', why: 'Confuses total variance with low-dimensional structure. More total variance with no concentration is precisely the opposite of low-dimensional structure.' },
            { choice: 'D', why: 'Treats positivity of singular values as equivalent to intrinsic dimensionality. The *concentration* of variance into a few PCs is what determines effective dimensionality.' },
            { choice: 'E', why: 'Irrelevant. Correlation vs covariance PCA is a preprocessing decision; it does not determine whether the data has low-dimensional structure.' },
          ],
        },
      },
      {
        id: 'P-11.2c',
        format: 'multiple-choice',
        difficulty: 3,
        statement: 'A centered data matrix $X \\in \\mathbb{R}^{100 \\times 3}$ represents 100 observations of three variables. The matrix $X^T X$ has eigenvalues $\\lambda_1 = 1600, \\lambda_2 = 400, \\lambda_3 = 100$. Consider $T: \\mathbb{R}^3 \\to \\mathbb{R}^{100}$ defined by $T(\\mathbf{v}) = X \\mathbf{v}$, which maps the unit sphere in $\\mathbb{R}^3$ to an ellipsoid in $\\mathbb{R}^{100}$. Which statement correctly relates the SVD geometry to the PCA variance structure?',
        choices: [
          { label: 'A', body: 'The ellipsoid has semi-axis lengths $1600, 400, 100$, which equal the variances along the three PC directions.' },
          { label: 'B', body: 'The ellipsoid has semi-axis lengths $40, 20, 10$, which equal the variances along the three PC directions.' },
          { label: 'C', body: 'The ellipsoid has semi-axis lengths in ratio $4:2:1$, while the principal-component variances have ratio $16:4:1$.' },
          { label: 'D', body: 'The ellipsoid has semi-axis lengths in ratio $4:2:1$, and the PC variances have the same ratio $4:2:1$.' },
          { label: 'E', body: 'The ellipsoid lies in a $3$-dimensional subspace of $\\mathbb{R}^{100}$, but the semi-axis lengths and PC variances are unrelated quantities.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'Semi-axes of the image ellipsoid are singular values $\\sigma_k = \\sqrt{\\lambda_k}$ where $\\lambda_k$ are eigenvalues of $X^T X$. So $\\sigma_1 = 40, \\sigma_2 = 20, \\sigma_3 = 10$, ratio $4:2:1$. PC variances are $\\lambda_k$ (or $\\lambda_k/(n-1)$, same ratios): $1600:400:100 = 16:4:1$. Lengths and variances scale as the singular values and their squares.',
          partialCredit: 'Choice B gets the singular values right but conflates them with variances.',
          trickAnalysis: [
            { choice: 'A', why: 'Confuses eigenvalues of $X^T X$ with lengths. Eigenvalues are *squared* lengths (variances).' },
            { choice: 'B', why: 'Right lengths but identifies them with variances. The lengths are $40, 20, 10$; the variances are $1600, 400, 100$.' },
            { choice: 'D', why: 'Forgets that variance is squared length. If lengths are $4:2:1$, variances are $16:4:1$.' },
            { choice: 'E', why: 'False: lengths and variances are related precisely by $\\lambda_k = \\sigma_k^2$.' },
          ],
        },
      },
    ],
  },
};
