import type { Concept } from '../types';

export const lowRankInPractice: Concept = {
  id: 'low-rank-in-practice',
  unitId: 'ch12',
  number: '12.2',
  title: 'Low-Rank Approximation in Practice',
  blurb: 'Choosing the truncation level, reading the singular-value plot, interpreting noise vs signal: the engineering layer between Eckart-Mirsky-Young and a working pipeline.',
  tier: 'full',
  learn: {
    overview: `
The [[optimal-low-rank|Eckart-Mirsky-Young theorem]] tells you which matrix is the best rank-$k$ approximation; it does not tell you which $k$ to pick. In practice the choice of $k$ is the central engineering decision, and several different criteria exist depending on what the low-rank approximation is for. Each criterion reads the **singular value plot** in a different way.

The **elbow criterion** is the most common heuristic: plot the singular values in descending order, look for a "bend" where they transition from a steep decline (signal) to a shallow tail (noise), and truncate at the elbow. The variant **explained-variance criterion** picks the smallest $k$ such that $\\sum_{i \\leq k} \\sigma_i^2 / \\sum_i \\sigma_i^2 \\geq \\tau$ for some threshold $\\tau$ (commonly $0.9, 0.95, 0.99$). This is the same as keeping the smallest $k$ such that the relative Frobenius error falls below $\\sqrt{1 - \\tau}$.

The **noise-thresholding criterion** uses random matrix theory. For $A = A_{\\text{true}} + N$ where $N$ has i.i.d. entries with mean zero and variance $\\sigma_N^2$, the noise contribution to the singular values is bounded by approximately $\\sigma_N \\sqrt{\\max(m, n)}$ — the **Marchenko-Pastur edge**. Singular values exceeding this threshold are signal; those below are noise.

The **MDL / BIC / cross-validation criterion** treats $k$ as a model-selection problem. Hold out a subset of entries, fit the rank-$k$ approximation on the rest, evaluate test error. The minimum-test-error $k$ is the rank that generalizes best.

Beyond choice of $k$, three engineering concerns matter. First, **interpretability**: $U$ and $V$ columns are orthonormal with no preferred sign convention. Second, **centering and scaling**: raw data matrices have row/column means dominating $\\sigma_1$; centering is standard preprocessing for [[principal-components|PCA]]. Third, **handling missing values**: SVD requires a fully observed matrix; [[matrix-completion|matrix completion]] handles missing entries.

The **most important caveat** is that the singular value plot can be misleading. A slow decay means $A$ is genuinely high-rank — it cannot be well-approximated by a low-rank matrix. A rapid decay means $A$ is well-suited to low-rank approximation. Where to draw the line is a domain question.

The geometric interpretation: $A_k$ can be read as a projection. $U_k U_k^T$ is the [[orthogonal-projections|orthogonal projection]] onto $\\mathrm{span}\\{\\mathbf{u}_1, \\ldots, \\mathbf{u}_k\\}$, the best-fit $k$-dimensional subspace. Then $A_k = (U_k U_k^T) A$ is "each column of $A$ projected onto the best-fit subspace." This is exactly the PCA interpretation when $A$'s columns are centered observations.
    `.trim(),
    definitions: [
      {
        term: 'Singular value plot',
        body: 'A chart of $\\sigma_i$ against index $i$. The shape reveals the intrinsic rank structure of $A$.',
      },
      {
        term: 'Elbow criterion',
        body: 'Choose $k$ at the visual "bend" in the singular value plot, where the decay transitions from steep to shallow.',
      },
      {
        term: 'Explained variance ratio',
        body: '$\\sum_{i \\leq k} \\sigma_i^2 / \\sum_i \\sigma_i^2$, the fraction of total Frobenius-squared mass captured by the rank-$k$ approximation.',
      },
      {
        term: 'Noise threshold',
        body: 'A cutoff based on expected noise level. For i.i.d. noise of variance $\\sigma_N^2$, the threshold is approximately $\\sigma_N \\sqrt{\\max(m, n)}$.',
      },
      {
        term: 'Truncated SVD',
        body: 'The rank-$k$ matrix $A_k = U_k \\Sigma_k V_k^T$. Used for compression, denoising, and feature extraction.',
      },
    ],
    theorems: [
      {
        name: 'Truncated SVD as projection',
        statement: 'Let $A$ have SVD $A = U\\Sigma V^T$ and $U_k$ be the first $k$ columns of $U$. Then $A_k = (U_k U_k^T) A = A(V_k V_k^T)$.',
        intuition: '$U_k U_k^T$ is the [[orthogonal-projections|projector]] onto the top-$k$ left singular subspace. Multiplying $A$ on the left replaces each column with its closest approximation in that subspace.',
      },
      {
        name: 'Variance decomposition',
        statement: '$\\|A\\|_F^2 = \\|A_k\\|_F^2 + \\|A - A_k\\|_F^2 = \\sum_{i=1}^k \\sigma_i^2 + \\sum_{i=k+1}^r \\sigma_i^2$.',
        intuition: 'Pythagorean: total squared Frobenius mass splits into captured-by-rank-$k$ plus discarded-tail. The orthogonality of $A_k$ and $A - A_k$ in Frobenius inner product makes this clean.',
      },
      {
        name: 'Effective rank under noise (Weyl)',
        statement: 'Let $A = A_{\\text{true}} + N$ where $A_{\\text{true}}$ has rank $r$. Then $|\\sigma_i(A) - \\sigma_i(A_{\\text{true}})| \\leq \\sigma_1(N)$ for all $i$.',
        intuition: 'Noise perturbs each singular value by at most $\\sigma_1(N)$. True rank-$r$ singular values get bumped slightly; formerly-zero singular values become small but typically not zero. Truncating at level $r$ recovers $A_{\\text{true}}$ approximately.',
      },
    ],
    keyFormulas: [
      'A_k = U_k \\Sigma_k V_k^T = (U_k U_k^T) A',
      '\\text{explained variance ratio} = \\frac{\\sum_{i \\leq k} \\sigma_i^2}{\\sum_{i \\leq r} \\sigma_i^2}',
      '\\|A\\|_F^2 = \\|A_k\\|_F^2 + \\|A - A_k\\|_F^2',
      '\\text{noise threshold} \\approx \\sigma_N \\sqrt{\\max(m, n)}',
      '|\\sigma_i(A + N) - \\sigma_i(A)| \\leq \\|N\\|_{op}',
    ],
  },
  explore: {
    vizComponent: 'LowRankInPracticeViz',
    description: 'Side-by-side viewer for low-rank approximation on three matrices (clean rank-5, rank-5 + noise, real image). Slider for $k$ with $A_k$ alongside the singular value bar chart; cumulative explained-variance plot; noise-floor line from user-input noise variance.',
    misconception: {
      title: 'Choosing $k$ is NOT just "pick the elbow"; the elbow can be ambiguous, misleading, or absent entirely.',
      body: `Three common scenarios make naive elbow-picking fail.

First: when singular values decay smoothly (no clear elbow), visual inspection gives an arbitrary $k$. This is typical of covariance matrices of well-mixed processes, image patches, or data with gradual structure.

Second: when noise has heteroscedastic structure, the singular values of the noise itself form a non-trivial spectrum mimicking real structure. Random-matrix-theory thresholding is needed.

Third: confusing the elbow on the SINGULAR VALUE plot with the elbow on the EXPLAINED VARIANCE plot. The two differ.

A fourth trap: the SVD is computed on $A$ as given, but for [[principal-components|PCA]] the matrix should be CENTERED first. Skipping centering makes the first PC the all-ones direction.

A fifth nuance: "explained variance" suggests discarded components are unimportant, but for [[anomaly-detection|anomaly detection]] the residuals in the orthogonal complement ARE the answer.`,
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Read off singular values and compute total energy',
        body: 'A data matrix $X \\in \\mathbb{R}^{500 \\times 100}$ has top eight singular values $(50, 30, 20, 15, 5, 4, 3, 2)$ and remaining $\\approx 0.5$. Total: $\\|X\\|_F^2 \\approx 4102$.',
      },
      {
        title: 'Step 2: Apply the 95% explained-variance criterion',
        body: 'Target: $\\sum_{i \\leq k} \\sigma_i^2 \\geq 0.95 \\cdot 4102 \\approx 3897$. Running sum: $2500$ (61%), $3400$ (83%), $3800$ (93%), $4025$ (98%). So $k = 4$. Elbow also at $k = 4$ (gap from $15$ to $5$).',
      },
      {
        title: 'Step 3: Estimate the noise threshold',
        body: 'Noise threshold $\\approx 0.5 \\sqrt{500} \\approx 11.2$. Signal singular values $50, 30, 20, 15$ exceed it; $\\sigma_5 = 5, \\sigma_6 = 4$ fall below. All three criteria converge on $k = 4$.',
      },
    ],
    problems: [
      {
        id: 'P-12.2a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A matrix $A \\in \\mathbb{R}^{1000 \\times 200}$ has $\\|A\\|_F^2 = 10{,}000$. The top three singular values squared are $\\sigma_1^2 = 5000, \\sigma_2^2 = 2000, \\sigma_3^2 = 1500$. What is the smallest $k$ such that $A_k$ captures at least 90% of Frobenius energy?',
        choices: [
          { label: 'A', body: '$k = 1$' },
          { label: 'B', body: '$k = 2$' },
          { label: 'C', body: '$k = 3$' },
          { label: 'D', body: '$k = 4$' },
          { label: 'E', body: 'Cannot be determined from the given information.' },
        ],
        correctAnswer: 'E',
        solution: {
          explanation: 'Running totals: $k = 1$ gives $50\\%$; $k = 2$ gives $70\\%$; $k = 3$ gives $85\\%$. Still below 90%. $k = 4$ requires $\\sigma_4^2$, which is unknown. The remaining $1500$ of mass is to be distributed over $197$ singular values, so $\\sigma_4^2$ could be anywhere from $\\approx 7.6$ to $1500$. Whether $k = 4$ reaches 90% cannot be determined.',
          partialCredit: '(D) deserves partial credit: a student assuming the next singular value pushes past 90% picks $k = 4$, the most likely answer in practice but not guaranteed.',
          trickAnalysis: [
            { choice: 'A', why: 'Captures $50\\%$, well below threshold.' },
            { choice: 'B', why: 'Captures $70\\%$, still short.' },
            { choice: 'C', why: 'Captures $85\\%$, still under $90\\%$.' },
            { choice: 'D', why: 'PLAUSIBLE but unverified — the problem does not give enough information to decide.' },
          ],
        },
      },
      {
        id: 'P-12.2b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'An engineer observes a noisy data matrix $A = A_{\\text{signal}} + N$ where $A_{\\text{signal}}$ has true rank $k_0 = 4$ and $N$ has i.i.d. Gaussian entries. Singular values: $\\sigma_1 = 100, \\sigma_2 = 80, \\sigma_3 = 60, \\sigma_4 = 40, \\sigma_5 \\approx 8, \\sigma_6 \\approx 7.8, \\ldots$, with the tail clustering near $8$. Which interpretation is most consistent?',
        choices: [
          { label: 'A', body: 'The matrix has true rank $\\geq 5$, since five singular values are nonzero.' },
          { label: 'B', body: 'The singular values $\\sigma_5, \\sigma_6, \\ldots$ are noise artifacts; $A_4$ recovers $A_{\\text{signal}}$ approximately. Noise level $\\sigma_N \\approx 8 / \\sqrt{\\max(m, n)}$.' },
          { label: 'C', body: 'True rank is $4$, but the noise level cannot be estimated from this data alone.' },
          { label: 'D', body: 'The elbow at $k = 4$ is meaningless because singular values do not drop to zero.' },
          { label: 'E', body: '$A_4$ is not optimal because it ignores the smaller singular values which contain real information.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'The gap between $\\sigma_4 = 40$ and $\\sigma_5 \\approx 8$ is the signature of noise. The four signal singular values stand above the noise floor; the remaining $\\sigma_i$ cluster near a common value $\\approx 8$ (the operator norm of $N$). By Weyl, $\\sigma_1(N) \\approx \\sigma_N \\sqrt{\\max(m, n)}$, so $\\sigma_N \\approx 8/\\sqrt{\\max(m,n)}$.',
          partialCredit: '(C) correctly identifies true rank but incorrectly claims noise level cannot be estimated.',
          trickAnalysis: [
            { choice: 'A', why: 'Confuses "nonzero observed singular value" with "true rank." Numerical singular values are almost never exactly zero with noise.' },
            { choice: 'C', why: 'Right rank, but the clustering of the tail is exactly what allows noise-level estimation.' },
            { choice: 'D', why: 'The elbow IS meaningful precisely because it separates big signal from small noise.' },
            { choice: 'E', why: 'Categorically false. $A_4$ IS optimal over rank-$\\leq 4$ matrices. The smaller values are NOISE; including them makes the approximation worse.' },
          ],
        },
      },
      {
        id: 'P-12.2c',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A data scientist applies low-rank approximation to customer spending profiles across 50 categories (in dollars). The first PC is approximately $(0.998, 0.05, 0.04, \\ldots)$, loading heavily on "groceries." What is the explanation?',
        choices: [
          { label: 'A', body: 'Groceries is genuinely the dominant pattern in customer spending; the PC is correctly identified.' },
          { label: 'B', body: 'The grocery column has much higher variance than other columns. The first PC reflects scale rather than structure. Standardize the columns before recomputing the SVD.' },
          { label: 'C', body: 'The data is too sparse for SVD-based analysis; switch to NMF.' },
          { label: 'D', body: 'The data should be centered but no scaling adjustment is needed because all columns are in dollars.' },
          { label: 'E', body: 'The first PC is correctly computed; discard it as uninformative and use PC2.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'When one column has much larger variance, the SVD/PCA is dominated by that column\'s SCALE, not STRUCTURE. The first PC nearly aligns with the high-variance axis, capturing the trivial fact that groceries varies more in absolute dollars. Remedy: standardize each column.',
          partialCredit: '(D) is half-right (centering is needed) but misses the scaling issue. "Same units" does not mean "same scale."',
          trickAnalysis: [
            { choice: 'A', why: 'Mistakes a scale artifact for a real pattern.' },
            { choice: 'C', why: 'NMF is for non-negativity, not scale. Wrong fix.' },
            { choice: 'D', why: 'Half-correct on centering, wrong on scaling. Scale differs even when units agree.' },
            { choice: 'E', why: 'PC1 captures dominant variance but the wrong KIND of dominance. PC2 would still be contaminated.' },
          ],
        },
      },
    ],
  },
};
