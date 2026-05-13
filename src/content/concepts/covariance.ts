import type { Concept } from '../types';

export const covariance: Concept = {
  id: 'covariance',
  unitId: 'ch11',
  number: '11.1',
  title: 'Covariance & Correlation',
  blurb: 'The geometry of joint variation: how the covariance matrix encodes pairwise dependence as an inner product on centered data.',
  tier: 'full',

  learn: {
    overview: `
A *centered data matrix* $X \\in \\mathbb{R}^{n \\times d}$ has $n$ observations of $d$ features, with column means subtracted so each feature has mean zero. The columns are vectors in $\\mathbb{R}^n$, and the [[dot-and-inner-products|standard inner product]] on $\\mathbb{R}^n$ does double duty: it measures both variance and covariance.

The variance of feature $i$ is $\\mathrm{Var}(X_i) = \\frac{1}{n-1} \\langle X_i, X_i \\rangle = \\frac{1}{n-1} \\|X_i\\|^2$. The covariance of features $i$ and $j$ is $\\mathrm{Cov}(X_i, X_j) = \\frac{1}{n-1} \\langle X_i, X_j \\rangle$. Both arise from the *same* inner product, applied to the same centered column vectors. Packaging this into a matrix gives
$$\\Sigma = \\frac{1}{n-1} X^T X,$$
the *covariance matrix*. Its $(i,j)$ entry is $\\mathrm{Cov}(X_i, X_j)$. The diagonal is variances; the off-diagonal is covariances. The matrix $\\Sigma$ is always symmetric and positive semidefinite, since $X^T X$ is.

This is the conceptual hinge: the covariance matrix is literally a [[dot-and-inner-products|Gram matrix]] of the centered feature vectors. Every fact about Gram matrices applies to $\\Sigma$. It is diagonalizable by [[gram-schmidt|an orthonormal basis]] of its eigenvectors (this is exactly the [[symmetric-spectra|spectral theorem]] for symmetric matrices), with nonnegative eigenvalues, and these eigenvectors are the principal components.

The *correlation matrix* $R$ standardizes covariance by dividing by the geometric mean of variances:
$$R_{ij} = \\frac{\\mathrm{Cov}(X_i, X_j)}{\\sqrt{\\mathrm{Var}(X_i) \\mathrm{Var}(X_j)}} = \\frac{\\langle X_i, X_j \\rangle}{\\|X_i\\| \\|X_j\\|}.$$
The right-hand side is exactly the *cosine* of the [[angles-and-orthogonality|angle between $X_i$ and $X_j$]] as vectors in $\\mathbb{R}^n$. So $R_{ij} = \\cos(\\theta_{ij})$, where $\\theta_{ij}$ is the angle between the centered feature columns. Correlation is geometry: $r = 1$ means the centered features point in the same direction; $r = -1$ means antiparallel; $r = 0$ means perpendicular (uncorrelated).

This identification of correlation with cosine is the cleanest geometric statement about feature dependence. If two centered features have correlation $0.3$, their column vectors in $\\mathbb{R}^n$ subtend an angle of $\\arccos(0.3) \\approx 72.5^\\circ$. If correlation is $-0.7$, the angle is $\\arccos(-0.7) \\approx 134^\\circ$. Pairs with $|r| \\leq 0.5$ are within $30^\\circ$ of being orthogonal; the smaller $|r|$ is, the more nearly perpendicular the features are as vectors.

The covariance and correlation matrices each launch a different version of [[principal-components|PCA]]: covariance PCA diagonalizes $\\Sigma$; correlation PCA diagonalizes $R$ (equivalent to first standardizing each column to unit variance, then diagonalizing the resulting covariance). The choice between them is a [[pca-preprocessing|preprocessing decision]] that completely changes the answer when features live on different scales.
    `.trim(),

    definitions: [
      {
        term: 'Centered data matrix',
        body: 'A data matrix $X \\in \\mathbb{R}^{n \\times d}$ with column means subtracted. Each column has mean zero in $\\mathbb{R}^n$. Centering is required for $X^T X$ to encode covariance rather than raw second moments.',
      },
      {
        term: 'Covariance matrix',
        body: 'For a centered $X$, the covariance matrix is $\\Sigma = \\frac{1}{n-1} X^T X \\in \\mathbb{R}^{d \\times d}$. It is symmetric and positive semidefinite; its $(i,j)$ entry is $\\mathrm{Cov}(X_i, X_j)$.',
      },
      {
        term: 'Correlation matrix',
        body: 'The correlation matrix $R \\in \\mathbb{R}^{d \\times d}$ has $R_{ij} = \\mathrm{Cov}(X_i, X_j) / \\sqrt{\\mathrm{Var}(X_i) \\mathrm{Var}(X_j)}$. Diagonal entries are $1$; off-diagonals are Pearson correlations.',
      },
      {
        term: 'Correlation as cosine',
        body: 'For centered columns $X_i, X_j$, the correlation is exactly $R_{ij} = \\cos(\\theta_{ij})$, where $\\theta_{ij}$ is the angle between the column vectors in $\\mathbb{R}^n$ under the standard inner product. Uncorrelated means perpendicular.',
      },
      {
        term: 'Positive semidefinite',
        body: 'A symmetric matrix $M$ is PSD iff $\\mathbf{v}^T M \\mathbf{v} \\geq 0$ for all $\\mathbf{v}$, iff all its eigenvalues are nonnegative. Both $\\Sigma$ and $R$ are always PSD because they are Gram matrices of real vectors.',
      },
    ],

    theorems: [
      {
        name: 'Covariance matrix as a Gram matrix',
        statement: 'For a centered data matrix $X$, the covariance matrix $\\Sigma = \\frac{1}{n-1} X^T X$ is the Gram matrix of the centered feature columns under the standard inner product on $\\mathbb{R}^n$, scaled by $\\frac{1}{n-1}$.',
        intuition: 'Every entry of $\\Sigma$ is an inner product of two centered feature columns. The diagonal entries are $\\|X_i\\|^2 / (n-1) = $ variance; the off-diagonals are $\\langle X_i, X_j \\rangle / (n-1) = $ covariance. There is no separate machinery: covariance is just inner products, packaged. This is why every theorem about symmetric PSD matrices applies to $\\Sigma$.',
      },
      {
        name: 'Spectral theorem applies to $\\Sigma$',
        statement: 'The covariance matrix $\\Sigma$ has an orthonormal eigenbasis $\\{\\mathbf{q}_1, \\ldots, \\mathbf{q}_d\\}$ with nonnegative eigenvalues $\\lambda_1 \\geq \\lambda_2 \\geq \\cdots \\geq \\lambda_d \\geq 0$. Equivalently, $\\Sigma = Q \\Lambda Q^T$ with $Q$ orthogonal.',
        intuition: 'Symmetric matrices are diagonalizable by an orthonormal basis. Since $\\Sigma$ is symmetric and PSD, the eigenvalues are real and nonnegative. The eigenvectors are the principal components, the eigenvalues are the variances along those directions, and the orthogonal decomposition is exactly the spectral decomposition.',
      },
      {
        name: 'Correlation matrix is rescaled covariance',
        statement: 'If $D = \\mathrm{diag}(\\sqrt{\\mathrm{Var}(X_1)}, \\ldots, \\sqrt{\\mathrm{Var}(X_d)})$ is the diagonal matrix of feature standard deviations, then $R = D^{-1} \\Sigma D^{-1}$.',
        intuition: 'Correlation is covariance after each feature has been scaled to unit variance. Working with $R$ is equivalent to first dividing each column of $X$ by its standard deviation (a standardization preprocessing step), then computing the covariance matrix of the standardized data. This makes the units of all features dimensionless and comparable.',
      },
    ],

    keyFormulas: [
      '\\Sigma = \\frac{1}{n-1} X^T X',
      'R_{ij} = \\frac{\\mathrm{Cov}(X_i, X_j)}{\\sqrt{\\mathrm{Var}(X_i) \\mathrm{Var}(X_j)}} = \\cos(\\theta_{ij})',
      '\\Sigma = Q \\Lambda Q^T \\quad (\\text{spectral form, } Q \\text{ orthogonal})',
      'R = D^{-1} \\Sigma D^{-1} \\quad \\text{with } D = \\mathrm{diag}(\\sigma_1, \\ldots, \\sigma_d)',
    ],
  },

  explore: {
    vizComponent: 'CovarianceCorrelationViz',
    description: 'A 2D scatter plot of centered data with two features, alongside both the covariance matrix $\\Sigma$ and the correlation matrix $R$ shown as heatmaps. The user can drag the data points to reshape the cloud; $\\Sigma$ and $R$ update in real time. A second mode lets the user rescale feature 1 (multiply column by a slider value), which changes $\\Sigma$ dramatically but leaves $R$ invariant — the geometric demonstration that correlation is scale-free. The angle between feature column vectors is annotated in degrees and matches $\\arccos(R_{12})$ at all times.',
    misconception: {
      title: 'Treating uncorrelated as independent, and forgetting that covariance has units',
      body: `Two distinct misconceptions sit on either side of the covariance / correlation distinction.

First: assuming "uncorrelated" means "independent." Correlation only measures *linear* dependence. Two features can be perfectly determined by each other yet have correlation $0$ — for example, $X_2 = X_1^2$ on data symmetric about zero gives $\\mathrm{Cov}(X_1, X_2) = 0$ even though $X_2$ is a deterministic function of $X_1$. The covariance and correlation matrices encode the *linear* structure of joint variation, which is precisely what PCA can recover. Nonlinear dependence is invisible to $\\Sigma$ and requires [[beyond-linear-pca|kernel methods or autoencoders]] to detect.

Second: treating covariance values as scale-free. The covariance $\\mathrm{Cov}(X_1, X_2)$ has units equal to the product of the units of $X_1$ and $X_2$. If $X_1$ is temperature in Celsius and $X_2$ is pressure in kPa, $\\mathrm{Cov}(X_1, X_2)$ has units of $\\mathrm{C \\cdot kPa}$, and converting $X_1$ to Fahrenheit multiplies the covariance by $9/5$. The numerical value of covariance is not interpretable on its own; only relative comparisons within a single unit system, or normalized via correlation, carry meaning. Students who report "the covariance is large, so the variables are strongly related" are usually responding to the choice of units, not to the actual statistical structure.

A subtler trap: confusing the covariance matrix $\\Sigma \\in \\mathbb{R}^{d \\times d}$ (one entry per pair of *features*) with the Gram matrix $X X^T \\in \\mathbb{R}^{n \\times n}$ (one entry per pair of *observations*). Both arise from a centered data matrix; both are PSD; but they live in different spaces and have different eigenvalues (related by the SVD: nonzero eigenvalues are the same, and these are $\\sigma_i^2$ where $\\sigma_i$ are the singular values of $X$). When a problem asks about "principal components," it almost always wants eigenvectors of $\\Sigma$ (the $d \\times d$ feature covariance), not eigenvectors of $X X^T$ (the $n \\times n$ observation Gram matrix).`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: convert a correlation to an angle',
        body: 'Suppose two centered features $X_1, X_2$ have $\\mathrm{Cov}(X_1, X_2) = 6$, $\\mathrm{Var}(X_1) = 4$, $\\mathrm{Var}(X_2) = 25$. Then $\\mathrm{Corr}(X_1, X_2) = 6 / \\sqrt{4 \\cdot 25} = 6/10 = 0.6$. Equivalently, the angle between the column vectors $X_1, X_2 \\in \\mathbb{R}^n$ is $\\theta_{12} = \\arccos(0.6) \\approx 53.1^\\circ$.',
      },
      {
        title: 'Read off pairs within $30^\\circ$ of orthogonal',
        body: '"Within $30^\\circ$ of orthogonal" means the angle lies in $[60^\\circ, 120^\\circ]$, equivalently $|\\cos(\\theta)| \\leq 0.5$, equivalently $|r| \\leq 0.5$. To find such pairs in a correlation matrix, scan the off-diagonal entries for $|R_{ij}| \\leq 0.5$. Pairs with $|R_{ij}| > 0.5$ are sharper than $60^\\circ$ (more aligned or more anti-aligned).',
      },
      {
        title: 'Why $\\Sigma$ is not enough by itself',
        body: 'The correlation $r = 0.6$ in this example tells you the features are moderately aligned, regardless of units. But the covariance value $6$ depends on the units chosen for $X_1$ and $X_2$ — rescale one of them and $\\mathrm{Cov}$ rescales too. Reporting raw covariance for cross-feature comparison is unit-dependent and rarely the right summary. Reporting correlation gives a dimensionless angle.',
      },
    ],

    problems: [
      {
        id: 'P-11.1a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Four feature vectors $(X_1, X_2, X_3, X_4)$ are extracted from centered sensor data. The covariance and correlation matrices are:\n$$\\Sigma = \\begin{bmatrix} 4 & 3 & -4.2 & 6.4 \\\\ 3 & 25 & -6 & -12 \\\\ -4.2 & -6 & 9 & 1.2 \\\\ 6.4 & -12 & 1.2 & 16 \\end{bmatrix}, \\quad R = \\begin{bmatrix} 1.0 & 0.3 & -0.7 & 0.8 \\\\ 0.3 & 1.0 & -0.4 & -0.6 \\\\ -0.7 & -0.4 & 1.0 & 0.1 \\\\ 0.8 & -0.6 & 0.1 & 1.0 \\end{bmatrix}.$$\nWhich pairs of feature vectors have directions within $30^\\circ$ of being orthogonal?',
        choices: [
          { label: 'A', body: '$(X_1, X_3)$ and $(X_2, X_4)$' },
          { label: 'B', body: '$(X_1, X_2)$ and $(X_3, X_4)$' },
          { label: 'C', body: '$(X_2, X_3)$ only' },
          { label: 'D', body: '$(X_1, X_3)$, $(X_2, X_3)$, and $(X_2, X_4)$' },
          { label: 'E', body: '$(X_1, X_2)$, $(X_2, X_3)$, and $(X_3, X_4)$' },
        ],
        correctAnswer: 'E',
        solution: {
          explanation: 'For centered feature vectors, $R_{ij} = \\cos(\\theta_{ij})$. Being within $30^\\circ$ of orthogonal means the angle lies in $[60^\\circ, 120^\\circ]$, equivalently $|R_{ij}| \\leq \\cos(60^\\circ) = 0.5$. Scanning the off-diagonal entries of $R$: $R_{12} = 0.3$ (yes), $R_{13} = -0.7$ (no), $R_{14} = 0.8$ (no), $R_{23} = -0.4$ (yes), $R_{24} = -0.6$ (no), $R_{34} = 0.1$ (yes). The qualifying pairs are $(X_1, X_2)$, $(X_2, X_3)$, and $(X_3, X_4)$.',
          partialCredit: 'Choice D is the right approach but misreads two entries: it picks $(X_1, X_3)$ at $|{-0.7}|$ (which fails the threshold) instead of $(X_3, X_4)$ at $|0.1|$ (which passes), and includes $(X_2, X_4)$ at $|{-0.6}|$ which fails.',
          trickAnalysis: [
            { choice: 'A', why: 'Reads the covariance matrix $\\Sigma$ instead of $R$. Covariance has units; correlation does not. Picking based on $\\Sigma$ entries confuses raw covariance magnitude with correlation.' },
            { choice: 'B', why: 'Picks pairs where the correlation is closest to $\\pm 1$ (the most aligned), inverting the question.' },
            { choice: 'C', why: 'Picks only what looks like the single most-orthogonal pair. Too restrictive; also misidentifies the pair: $R_{34} = 0.1$ has smaller magnitude.' },
            { choice: 'D', why: 'Right framework, wrong arithmetic. Misreads $|R_{13}| = 0.7$ and $|R_{24}| = 0.6$ as passing, and misses $R_{34} = 0.1$.' },
          ],
        },
      },
      {
        id: 'P-11.1b',
        format: 'multiple-choice',
        difficulty: 1,
        statement: 'A centered data matrix $X \\in \\mathbb{R}^{100 \\times 3}$ has column $X_1$ measured in meters and column $X_2$ measured in kilograms. An analyst doubles all entries of $X_1$ (so it is now in half-meter units). Which statement is correct?',
        choices: [
          { label: 'A', body: 'Both $\\mathrm{Cov}(X_1, X_2)$ and $\\mathrm{Corr}(X_1, X_2)$ double.' },
          { label: 'B', body: '$\\mathrm{Cov}(X_1, X_2)$ doubles; $\\mathrm{Corr}(X_1, X_2)$ is unchanged.' },
          { label: 'C', body: '$\\mathrm{Cov}(X_1, X_2)$ is unchanged; $\\mathrm{Corr}(X_1, X_2)$ doubles.' },
          { label: 'D', body: 'Both $\\mathrm{Cov}(X_1, X_2)$ and $\\mathrm{Corr}(X_1, X_2)$ are unchanged.' },
          { label: 'E', body: 'The covariance and correlation matrices both rescale, but in different ways depending on $X_2$.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Covariance is bilinear: $\\mathrm{Cov}(c X_1, X_2) = c \\cdot \\mathrm{Cov}(X_1, X_2)$. So doubling $X_1$ doubles the covariance. The correlation $\\mathrm{Corr}(X_1, X_2) = \\mathrm{Cov}(X_1, X_2) / (\\sigma_1 \\sigma_2)$ also has $\\sigma_1$ doubled, so the factor of $2$ cancels. Correlation is scale-invariant; it depends only on the *direction* of the centered feature vectors.',
          trickAnalysis: [
            { choice: 'A', why: 'Treats correlation as a rescaling of covariance. Correlation is scale-invariant — that is the whole reason it is more useful than covariance for cross-feature comparison.' },
            { choice: 'C', why: 'Inverted: gets which one is scale-free wrong. Covariance carries units; correlation does not.' },
            { choice: 'D', why: 'Treats both as scale-invariant. Only correlation is.' },
            { choice: 'E', why: 'Overcomplicates. The rescaling rule is uniform regardless of the other column.' },
          ],
        },
      },
    ],
  },
};
