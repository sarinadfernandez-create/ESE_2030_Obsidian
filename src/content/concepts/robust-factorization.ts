import type { Concept } from '../types';

export const robustFactorization: Concept = {
  id: 'robust-factorization',
  unitId: 'ch12',
  number: '12.5',
  title: 'Robust Low-Rank Factorization',
  blurb: 'Real data is contaminated by outliers, missing entries, and gross errors. Robust methods separate signal (low-rank) from corruption (sparse) by minimizing a sum of nuclear and $L^1$ norms.',
  tier: 'full',
  learn: {
    overview: `
The [[principal-components|PCA]] and [[svd-form|SVD]] machinery is sensitive to outliers. A single grossly wrong data entry can rotate principal components into nonsense. The Frobenius objective penalizes squared errors: an outlier of $100$ contributes $10{,}000$ to the loss, dwarfing moderately-correct entries. SVD-based methods "use up" their fitting capacity on the worst data points.

**Robust PCA** (Candès-Li-Ma-Wright, 2009) is the fix. Assume
$$M = L + S,$$
where $L$ is low-rank (the "true signal") and $S$ is sparse (the "gross corruption"). Recover both via **Principal Component Pursuit** (PCP):
$$\\min_{L, S} \\|L\\|_* + \\lambda \\|S\\|_1 \\quad \\text{subject to } L + S = M.$$
$\\|L\\|_* = \\sum_i \\sigma_i(L)$ is the [[matrix-completion|nuclear norm]] (relaxation of rank). $\\|S\\|_1 = \\sum_{i,j} |S_{ij}|$ is entrywise $L^1$ (relaxation of $\\|S\\|_0$, count of nonzeros). Under incoherence and randomness-of-support, PCP recovers $L$ and $S$ exactly with high probability, with the universal $\\lambda = 1/\\sqrt{\\max(m, n)}$ requiring no tuning.

The structure parallels matrix completion but is more general. Matrix completion takes corruption LOCATIONS as known and asks for $L$ alone; robust PCA takes locations as unknown and infers both $L$ and $S$.

**Foreground-background separation in video** is canonical. A surveillance video has each column as a vectorized frame. Static background is approximately constant — low rank. Moving foreground is sparse — most pixels are background. PCP produces clean separation.

**Collaborative filtering with gross errors**: most ratings are authentic but spam corrupts the data. Robust matrix completion combines both frameworks.

**Anomaly detection** in network traffic or industrial sensors: normal operation is governed by few dominant modes (low rank); anomalies are localized in time and device (sparse). PCP isolates the sparse anomaly component. This is the engine behind [[anomaly-detection|anomaly detection]].

The **conceptual significance**: robust factorization replaces $L^2$ residuals with $L^1$. Under $L^2$, a single outlier of $r$ contributes $r^2$ (quadratic, outliers dominate). Under $L^1$, the same outlier contributes $|r|$ (linear, moderate). Adding $\\|L\\|_*$ provides low-rank prior. Nuclear $+$ $L^1$ yields convex optimization with exact recovery.
    `.trim(),
    definitions: [
      {
        term: 'Robust PCA / Principal Component Pursuit',
        body: 'Recover low-rank $L$ and sparse $S$ from $M = L + S$ via $\\min \\|L\\|_* + \\lambda \\|S\\|_1$.',
      },
      {
        term: '$L^1$ norm (entrywise)',
        body: '$\\|S\\|_1 = \\sum_{i,j} |S_{ij}|$. Convex relaxation of $\\|S\\|_0$. Promotes sparsity.',
      },
      {
        term: 'Soft-thresholding operator',
        body: '$\\mathcal{S}_\\tau(x) = \\mathrm{sign}(x) \\max(|x| - \\tau, 0)$. The proximal operator of $\\|\\cdot\\|_1$.',
      },
      {
        term: 'Singular value thresholding',
        body: '$\\mathcal{D}_\\tau(X) = U \\mathcal{S}_\\tau(\\Sigma) V^T$. The proximal operator of the nuclear norm.',
      },
      {
        term: 'Incoherence (for PCP)',
        body: 'Singular vectors of $L$ spread out relative to standard basis; support of $S$ uniformly random.',
      },
    ],
    theorems: [
      {
        name: 'Candès-Li-Ma-Wright exact recovery',
        statement: 'Let $M = L^* + S^*$ where $L^*$ has rank $r$, satisfies incoherence with parameter $\\mu$, and $S^*$ has at most $\\rho mn$ nonzero entries with uniformly random support. There exist universal constants such that PCP with $\\lambda = 1/\\sqrt{\\max(m, n)}$ recovers $(L^*, S^*)$ exactly with high probability.',
        intuition: 'Rank-$r$ matrix plus $\\rho mn$-sparse matrix have $r(m+n-r) + \\rho mn$ degrees of freedom. The $mn$ entries of $M$ provide enough constraints. The "no tuning" feature of universal $\\lambda$ is striking.',
      },
      {
        name: 'Soft-thresholding solves $L^1$ proximal',
        statement: '$\\arg\\min_\\mathbf{x} \\frac{1}{2}\\|\\mathbf{x} - \\mathbf{y}\\|_2^2 + \\tau \\|\\mathbf{x}\\|_1 = \\mathcal{S}_\\tau(\\mathbf{y})$.',
        intuition: 'Each entry decouples. Differentiating with subgradient at $0$ gives soft-thresholding. This is why $L^1$ "shrinks small entries to zero."',
      },
      {
        name: 'Singular value thresholding solves nuclear proximal',
        statement: '$\\arg\\min_X \\frac{1}{2}\\|X - Y\\|_F^2 + \\tau \\|X\\|_* = U \\mathcal{S}_\\tau(\\Sigma) V^T$.',
        intuition: 'By unitary invariance, optimization reduces to per-singular-value problems. Solution: shrink each $\\Sigma_{ii}$ by $\\tau$, zeroing small ones. The matrix-valued shrinkage acts on the SPECTRUM.',
      },
    ],
    keyFormulas: [
      '\\min_{L, S} \\|L\\|_* + \\lambda \\|S\\|_1 \\text{ s.t. } L + S = M',
      '\\lambda = 1 / \\sqrt{\\max(m, n)}',
      '\\mathcal{S}_\\tau(x) = \\mathrm{sign}(x) \\max(|x| - \\tau, 0)',
      '\\mathcal{D}_\\tau(X) = U \\mathcal{S}_\\tau(\\Sigma) V^T',
      '\\|L\\|_* + \\lambda \\|S\\|_1 \\text{ are convex envelopes of rank and } \\|\\cdot\\|_0',
    ],
  },
  explore: {
    vizComponent: 'RobustPCAViz',
    description: 'A simulated $50 \\times 100$ video matrix (background rank-1 + sparse foreground). Three panels: $M$, recovered $L$, recovered $S$. Slider for $\\lambda$; second mode for noisy-image denoising; third mode steps through ADMM iterations.',
    misconception: {
      title: 'Robust PCA is NOT just "PCA with outlier rejection"; it solves a different optimization problem.',
      body: `Five common misconceptions.

First: students think robust PCA = run PCA then discard worst-fitting points. That has the chicken-and-egg problem: PCA is corrupted by outliers, so the "worst-fitting points" are not the actual outliers. Robust PCA jointly identifies low-rank structure AND sparse corruption.

Second: norm choice matters. $L^2$ penalizes squared residuals (quadratic, outliers dominate). $L^1$ penalizes absolute residuals (linear, robust). $L^1$ has closed-form proximal (soft-thresholding) making optimization tractable.

Third: robust PCA cannot recover ANY corruption pattern. The theorem requires $S$ sparse AND randomly distributed. Dense corruption is regular-PCA territory; concentrated corruption can fail.

Fourth: $\\lambda$ is NOT a tunable hyperparameter. The universal $\\lambda = 1/\\sqrt{\\max(m, n)}$ works for all problems satisfying the assumptions.

Fifth: PCP recovers the EXACT $L^*$ — not an approximation. This is rare for statistical recovery methods.`,
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Set up a small foreground-background example',
        body: 'True background $L^* = 5 \\cdot \\mathbf{1}\\mathbf{1}^T$ ($3 \\times 3$, all entries $5$, rank 1). Foreground $S^* = 10 \\cdot \\mathbf{e}_2 \\mathbf{e}_2^T$ (single bright pixel at $(2,2)$). Observed $M = L^* + S^*$ has $M_{22} = 15$.',
      },
      {
        title: 'Step 2: Apply naive low-rank approximation and observe failure',
        body: 'SVD of $M$ has $\\sigma_1 \\approx 16.7$ (dominant) and $\\sigma_2 \\approx 6.5$. Top singular vectors rotate AWAY from the all-ones direction due to the outlier. Rank-1 approximation $\\neq L^*$.',
      },
      {
        title: 'Step 3: Apply PCP with universal $\\lambda$',
        body: '$\\lambda = 1/\\sqrt{3} \\approx 0.577$. ADMM: alternate singular-value thresholding on $L$ and entrywise soft-thresholding on $S$, with dual update. Converges: $L \\to 5 \\cdot \\mathbf{1}\\mathbf{1}^T$, $S \\to 10 \\mathbf{e}_2 \\mathbf{e}_2^T$. Exact decomposition.',
      },
    ],
    problems: [
      {
        id: 'P-12.5a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Why does Robust PCA use $L^1$ norm on $S$ rather than Frobenius?',
        choices: [
          { label: 'A', body: '$L^1$ is faster to compute.' },
          { label: 'B', body: '$L^1$ is the convex relaxation of $\\|S\\|_0$ (count of nonzeros), promoting SPARSE solutions. Frobenius shrinks all entries proportionally, never producing exact zeros.' },
          { label: 'C', body: '$L^1$ is non-convex, allowing escape from local minima.' },
          { label: 'D', body: '$L^1$ is required by the Candès-Recht theorem.' },
          { label: 'E', body: '$L^1$ and Frobenius are equivalent for this problem.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: '$L^1$ is the convex envelope of $\\|S\\|_0$. Its proximal operator (soft-thresholding) zeros out small entries. Frobenius shrinks every entry uniformly, never producing exact zeros. For Robust PCA to identify clean vs corrupted entries, sparsity is essential.',
          trickAnalysis: [
            { choice: 'A', why: 'Both are $O(mn)$ to compute.' },
            { choice: 'C', why: '$L^1$ is CONVEX, not non-convex.' },
            { choice: 'D', why: 'Candès-Recht is about matrix completion, not robust PCA. The relevant theorem is Candès-Li-Ma-Wright.' },
            { choice: 'E', why: 'Categorically false. They give different optimal decompositions.' },
          ],
        },
      },
      {
        id: 'P-12.5b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'In a video surveillance application, frames are stacked as columns of $M$. Background is constant; foreground is sparse moving objects. After PCP $M = L + S$, what do you expect?',
        choices: [
          { label: 'A', body: '$L$ contains foreground; $S$ contains background.' },
          { label: 'B', body: '$L$ contains background (rank-1, constant across columns); $S$ contains foreground (sparse, only moving-object pixels nonzero).' },
          { label: 'C', body: '$L$ contains noise; $S$ contains both background and foreground.' },
          { label: 'D', body: 'Both $L$ and $S$ contain mixtures; clean separation requires post-processing.' },
          { label: 'E', body: 'The decomposition fails because video does not satisfy incoherence.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Background is approximately rank-1 (constant across frames) — captured by $L$. Foreground occupies few pixels per frame — captured by $S$ as sparse. PCP cleanly separates them.',
          trickAnalysis: [
            { choice: 'A', why: 'Reverses the assignment. Foreground is sparse; background is low-rank.' },
            { choice: 'C', why: 'PCP has no separate noise component.' },
            { choice: 'D', why: 'Empirically and theoretically, PCP gives clean separation without post-processing.' },
            { choice: 'E', why: 'Video data satisfies incoherence reasonably well.' },
          ],
        },
      },
      {
        id: 'P-12.5c',
        format: 'multiple-choice',
        difficulty: 3,
        statement: 'PCP is solved by alternating between $L$-update, $S$-update, and dual update. Which closed-form operator updates $L$?',
        choices: [
          { label: 'A', body: 'Entrywise soft-thresholding $L \\leftarrow \\mathcal{S}_\\tau(M - S)$.' },
          { label: 'B', body: 'Singular value thresholding $L \\leftarrow \\mathcal{D}_\\tau(M - S)$: SVD, soft-threshold singular values, multiply back.' },
          { label: 'C', body: 'Projection onto the rank-$k$ matrix manifold.' },
          { label: 'D', body: 'Least-squares solve $L \\leftarrow (M - S)(VV^T)$.' },
          { label: 'E', body: 'Solving a quadratic program.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Nuclear-norm proximal operator is singular value thresholding. $L$-update minimizes $\\frac{1}{2}\\|L - (M-S)\\|_F^2 + \\tau\\|L\\|_*$; closed form $L = \\mathcal{D}_\\tau(M-S)$.',
          trickAnalysis: [
            { choice: 'A', why: 'Entrywise soft-thresholding is the proximal for $L^1$ ($S$-update), not nuclear norm.' },
            { choice: 'C', why: 'Rank-projection (truncation to fixed $k$) is non-convex (HARD thresholding). PCP uses SOFT nuclear-norm relaxation.' },
            { choice: 'D', why: 'Robust PCA does not factorize $L = UV^T$ explicitly; works with $L$ directly via SVD.' },
            { choice: 'E', why: 'Nuclear and $L^1$ norms are not quadratic; closed-form proximal operators avoid the QP.' },
          ],
        },
      },
    ],
  },
};
