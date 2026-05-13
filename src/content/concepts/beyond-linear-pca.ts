import type { Concept } from '../types';

export const beyondLinearPca: Concept = {
  id: 'beyond-linear-pca',
  unitId: 'ch11',
  number: '11.6',
  title: 'Beyond Linear PCA',
  blurb: 'PCA finds the best linear subspace. When the data lives on a curved manifold or has nonlinear dependence, the linear answer can miss everything.',
  tier: 'full',

  learn: {
    overview: `
[[principal-components|PCA]] is the canonical *linear* dimensionality-reduction technique. Its [[pca-optimality|double optimality]] — maximum variance, minimum reconstruction error — holds within the world of linear subspaces. Outside that world, the linear answer can be uninformative or misleading.

The simplest demonstration of PCA's failure mode is data that lies on a curve. Consider points sampled from $y = x^2$ for $x \\in [-1, 1]$, then centered. The data has one *intrinsic* coordinate, so its intrinsic dimensionality is $1$. But the linear PCA covariance matrix has *two* nonzero eigenvalues, because the data ellipsoid in 2D is a horizontal blob — the linear best-fit line is the $x$-axis itself, but the perpendicular variance (in $y$) is still present, and the linear analysis cannot tell that the $y$ values are *functionally determined* by the $x$ values.

A more striking example is data sampled from a circle of radius $r$ in 2D. The intrinsic dimensionality is $1$ (a single angular coordinate), but no linear $1$-dimensional subspace captures it. PCA on circle data gives $\\lambda_1 = \\lambda_2 = r^2/2$ — variance exactly split between the two PCs.

The phenomenon generalizes to any *curved manifold* embedded in feature space. The classical example is the "Swiss roll": data sampled from a 2D sheet rolled into a 3D spiral. The intrinsic dimensionality is $2$, but PCA reports a 3D ellipsoid with comparable variance in all three directions. *Manifold learning* methods (Isomap, locally linear embedding, t-SNE, UMAP) take over from PCA on such curved surfaces. They reconstruct intrinsic distances along the manifold rather than Euclidean distances in the ambient space.

The conceptual upgrade with the cleanest mathematical content is *kernel PCA*. Lift the data into a high-dimensional feature space $\\phi(\\mathbf{x}) \\in \\mathbb{R}^D$ via a nonlinear map $\\phi$, then run ordinary linear PCA on the lifted features. For example, $\\phi(x, y) = (x, y, x^2, y^2, xy)$ lifts the parabolic curve $y = x^2$ into a *line* in the lifted space. The "kernel trick" avoids computing $\\phi$ explicitly by working only with the inner-product matrix $K_{ij} = k(\\mathbf{x}_i, \\mathbf{x}_j)$.

The other major nonlinear extension is the *autoencoder*: a neural network trained to compress data through a low-dimensional bottleneck and then reconstruct it. When $E$ and $D$ are linear with no activation functions, the autoencoder recovers the PCA solution exactly. Nonlinear autoencoders can compress curved manifolds that no linear subspace can capture.

The takeaway is not that PCA is wrong. PCA is *optimal* for what it does. Recognizing the failure mode is the prerequisite for reaching for kernel methods, manifold learning, or autoencoders.
    `.trim(),

    definitions: [
      {
        term: 'Intrinsic dimensionality',
        body: 'The minimum number of coordinates needed to parameterize the data, regardless of how it is embedded. A circle has intrinsic dimension $1$; a sphere surface has intrinsic dimension $2$.',
      },
      {
        term: 'Nonlinear dependence',
        body: 'A relationship between two features that is functional but not linear. Example: $X_2 = X_1^2$. Covariance can be zero even though $X_2$ is completely determined by $X_1$.',
      },
      {
        term: 'Kernel PCA',
        body: 'PCA performed on data implicitly mapped into a high-dimensional feature space via a nonlinear feature map $\\phi$. Computed via the kernel matrix $K_{ij} = k(\\mathbf{x}_i, \\mathbf{x}_j)$ without forming $\\phi$ explicitly.',
      },
      {
        term: 'Manifold',
        body: 'A subset of $\\mathbb{R}^d$ that is locally homeomorphic to a Euclidean space of lower dimension. The Swiss roll is a 2-manifold in $\\mathbb{R}^3$.',
      },
      {
        term: 'Autoencoder',
        body: 'A neural network of the form $\\mathbf{x} \\mapsto E(\\mathbf{x}) \\mapsto D(E(\\mathbf{x})) \\approx \\mathbf{x}$ with a low-dimensional bottleneck. Linear autoencoders reduce to PCA.',
      },
    ],

    theorems: [
      {
        name: 'Linear PCA fails on curved manifolds',
        statement: 'If data lies on a curved $k$-dimensional manifold embedded in $\\mathbb{R}^d$, the covariance matrix can have more than $k$ nonzero eigenvalues. PCA reports an apparent dimensionality $\\geq k$, often much larger.',
        intuition: 'Linear subspaces are flat. A curved manifold cannot be enclosed in a flat subspace of the same dimension; the curvature spills variance into perpendicular directions.',
      },
      {
        name: 'Zero covariance does not imply independence',
        statement: 'Two features $X_1, X_2$ can satisfy $\\mathrm{Cov}(X_1, X_2) = 0$ yet have $X_2 = f(X_1)$ for a deterministic function $f$. Linear PCA cannot detect the dependence.',
        intuition: 'Covariance is sensitive only to linear relationships. $X_2 = X_1^2$ is symmetric in sign, so positive and negative covariance contributions cancel. Kernel PCA with a polynomial kernel sees the dependence.',
      },
      {
        name: 'Linear autoencoder is PCA',
        statement: 'A linear autoencoder with encoder $E(\\mathbf{x}) = W_E \\mathbf{x}$ and decoder $D(\\mathbf{z}) = W_D \\mathbf{z}$, trained to minimize reconstruction error, recovers the top-$k$ principal components when the bottleneck has dimension $k$.',
        intuition: 'The autoencoder objective is the same reconstruction error minimized by PCA. With linear $W_E, W_D$ and no activation, the optimum is rank-$k$ projection onto the top PCs.',
      },
    ],

    keyFormulas: [
      'K_{ij} = k(\\mathbf{x}_i, \\mathbf{x}_j) = \\langle \\phi(\\mathbf{x}_i), \\phi(\\mathbf{x}_j) \\rangle',
      'k_{\\mathrm{poly}}(\\mathbf{x}, \\mathbf{y}) = (1 + \\mathbf{x}^T \\mathbf{y})^p',
      'k_{\\mathrm{rbf}}(\\mathbf{x}, \\mathbf{y}) = \\exp(-\\|\\mathbf{x} - \\mathbf{y}\\|^2 / 2\\sigma^2)',
      '\\text{linear autoencoder optimum: } W_D W_E = \\Pi_k',
    ],
  },

  explore: {
    vizComponent: 'BeyondLinearPcaViz',
    description: 'A 2D playground with three preset nonlinear datasets: parabola, unit circle, two concentric circles. For each preset, the viz overlays the linear PCA eigenvectors and shows the resulting projection onto PC1, demonstrating that the projection collapses the structure. A toggle switches to "kernel PCA" mode with a polynomial kernel and shows that the lifted analysis correctly separates the clusters and unfolds the curves.',
    misconception: {
      title: 'Treating linear PCA as universally applicable, and reading "two nonzero eigenvalues" as "data is 2D"',
      body: `Two errors recur when applying PCA to nonlinear data.

First: assuming that the number of nonzero eigenvalues equals the intrinsic dimensionality. This is true for *linearly embedded* data but false in general. A circle of radius $r$ in $\\mathbb{R}^2$ has intrinsic dimension $1$ but two equal nonzero PCA eigenvalues. The data is genuinely $1$-dimensional with a *nonlinear* embedding.

Second: assuming that zero correlation implies independence. The covariance matrix records only *linear* dependence. Two features deterministically related by an even function can have zero covariance despite being perfectly dependent.

A third trap: applying PCA to clustered data. PCA's "best subspace" is best for *variance* preservation, not for cluster discrimination. Discriminant analysis (LDA) or Gaussian mixture models are better suited when the goal is cluster separation.

The bigger picture: PCA's failure modes are a feature, not a bug. They tell you that the data does not have clean linear low-dimensional structure. The right response is to reach for the next class of tools.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: 2D data on a parabola',
        body: "Consider data $(x_i, x_i^2)$ for $x_i$ uniform on $[-1, 1]$, then centered. Mean of $x$ is $0$; mean of $x^2$ is $1/3$. Centered data: $(x_i, x_i^2 - 1/3)$. Compute: $\\mathrm{Var}(x) = 1/3$, $\\mathrm{Var}(x^2 - 1/3) \\approx 0.089$, $\\mathrm{Cov}(x, x^2 - 1/3) = \\mathbb{E}[x^3] = 0$ by symmetry.",
      },
      {
        title: 'Compute the covariance matrix',
        body: '$\\Sigma = \\mathrm{diag}(1/3, 0.089)$. Already diagonal. PCs are $\\mathbf{q}_1 = (1, 0)^T, \\mathbf{q}_2 = (0, 1)^T$ with eigenvalues $1/3$ and $0.089$. PC1 captures $79\\%$; PC2 captures $21\\%$.',
      },
      {
        title: 'Interpret the failure',
        body: 'The intrinsic dimensionality is $1$, but PCA reports two nonzero eigenvalues with no clear gap. Linear PCA cannot detect the nonlinear functional relationship $y = x^2$. Kernel PCA with a polynomial kernel would recover the true $1$-D structure.',
      },
    ],

    problems: [
      {
        id: 'P-11.6a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: "A centered dataset consists of points $(x_i, x_i^2 - 1/3)$ for $x_i$ uniform on $[-1, 1]$. Linear covariance PCA yields two principal components with nonzero eigenvalues $\\lambda_1 = 1/3, \\lambda_2 \\approx 0.089$. The covariance $\\mathrm{Cov}(X_1, X_2)$ is exactly $0$. What is the correct interpretation?",
        choices: [
          { label: 'A', body: 'The two features are independent, as confirmed by the zero covariance and the diagonal $\\Sigma$.' },
          { label: 'B', body: "The data's intrinsic dimensionality is $1$ even though linear PCA reports two nonzero eigenvalues; the parabolic relationship is invisible to linear methods." },
          { label: 'C', body: 'The data is genuinely $2$-dimensional because both eigenvalues are positive.' },
          { label: 'D', body: 'PCA has failed numerically; the eigenvalues should have been computed using a different convention.' },
          { label: 'E', body: 'The first PC is exactly correct, capturing $79\\%$ of variance; the second PC is noise.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'The data is parameterized by a single coordinate $x$, so intrinsic dimensionality is $1$. The relationship $y = x^2$ is deterministic, yet $\\mathrm{Cov}(X, X^2) = \\mathbb{E}[X^3] = 0$ by symmetry. Linear PCA sees the features as uncorrelated and reports two nonzero eigenvalues. Kernel PCA with a polynomial-of-degree-$2$ kernel would correctly detect the $1$-D structure.',
          trickAnalysis: [
            { choice: 'A', why: "Confuses 'uncorrelated' with 'independent.' Zero covariance reflects zero *linear* dependence only." },
            { choice: 'C', why: "Treats 'two nonzero eigenvalues' as evidence of $2$-D structure. This is true for linearly embedded data but fails for curved manifolds." },
            { choice: 'D', why: 'No numerical failure: PCA computed the correct linear answer. The limitation is conceptual.' },
            { choice: 'E', why: "Treats $\\lambda_2$ as noise. It is a real component of variance from the parabolic curvature." },
          ],
        },
      },
      {
        id: 'P-11.6b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A dataset consists of $300$ points sampled (with small noise) from a Swiss-roll surface — a 2-dimensional sheet rolled into a spiral in $\\mathbb{R}^3$. Covariance PCA yields eigenvalues $\\lambda_1 \\approx 25, \\lambda_2 \\approx 22, \\lambda_3 \\approx 4$. What is the most appropriate conclusion?',
        choices: [
          { label: 'A', body: 'The data is approximately $2$-dimensional, and PC1 / PC2 give a faithful low-dimensional embedding.' },
          { label: 'B', body: 'The data is fully $3$-dimensional, since all three eigenvalues are nonzero.' },
          { label: 'C', body: 'The intrinsic dimensionality is $2$ but the manifold is curved, so the linear PC1 / PC2 projection scrambles the data; a manifold-learning method would unfold it.' },
          { label: 'D', body: 'PCA has failed because the data is too noisy.' },
          { label: 'E', body: 'PC3 should be retained because $\\lambda_3 = 4$ is above the Kaiser threshold for covariance PCA.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: "A Swiss roll is intrinsically $2$-dimensional but curved in 3D. Linear PCA sees the embedded structure: $\\lambda_3 = 4$ is the thickness direction. Projecting onto PC1 / PC2 *flattens* the spiral; points from far apart on the sheet end up near each other. Manifold-learning methods (Isomap, LLE, UMAP) use geodesic distances along the sheet to unfold it.",
          partialCredit: 'Choice A captures the dimensionality count but misses the qualitative failure of the linear projection on curved data.',
          trickAnalysis: [
            { choice: 'A', why: 'Reads the eigenvalue gap correctly but ignores that the linear projection scrambles a curved manifold.' },
            { choice: 'B', why: 'A clear gap to $\\lambda_3$ indicates PC3 captures noise or curvature thickness, not a true third intrinsic dimension.' },
            { choice: 'D', why: 'Misattributes the failure to noise. The issue is geometric: the manifold is curved.' },
            { choice: 'E', why: "Misapplies the Kaiser threshold. Kaiser ($\\lambda > 1$) is for *correlation* PCA, not covariance PCA." },
          ],
        },
      },
    ],
  },
};
