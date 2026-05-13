import type { Concept } from '../types';

export const pcaPreprocessing: Concept = {
  id: 'pca-preprocessing',
  unitId: 'ch11',
  number: '11.4',
  title: 'PCA Preprocessing',
  blurb: 'PCA is rotationally invariant but not scale invariant. The choice between covariance and correlation PCA is a preprocessing decision that completely changes the answer.',
  tier: 'full',

  learn: {
    overview: `
The math of [[principal-components|PCA]] is a fixed algorithm — diagonalize the [[covariance|covariance matrix]] — but the *answer* depends on how the data was prepared. Two preprocessing decisions sit before the algorithm and determine whether the result is interpretable: centering and scaling. The first is non-negotiable; the second is the single most consequential choice in applied PCA.

*Centering* — subtracting the mean of each column — is what makes $X^T X / (n-1)$ encode covariance rather than raw second moments. Without centering, the first "principal component" is usually just the direction of the mean vector, and the eigendecomposition is dominated by the location of the data cloud rather than its shape. Almost every PCA presentation assumes centered data; when a software package complains about uncentered data or returns a strange first PC, the fix is to subtract column means.

*Scaling* is more interesting because there is no universally correct choice. Covariance PCA works on the centered data directly: $\\Sigma = X^T X / (n-1)$. Correlation PCA works on the standardized data, where each column has been divided by its standard deviation: $\\tilde X = X D^{-1}$ with $D = \\mathrm{diag}(\\sigma_1, \\ldots, \\sigma_d)$, and then $R = \\tilde X^T \\tilde X / (n-1) = D^{-1} \\Sigma D^{-1}$. The two PCAs in general give *different* eigenvectors, different eigenvalues, and different conclusions about which features dominate.

The classical pathology that motivates the choice: when features live on wildly different scales, covariance PCA reports scale instead of structure. Consider sensors measuring temperature in $[180, 220]$°C (range $40$), pressure in $[2000, 2500]$ kPa (range $500$), and flow in $[5, 15]$ mL/min (range $10$). Pressure has roughly $(500/40)^2 \\approx 156$ times the variance of temperature and $(500/10)^2 = 2500$ times the variance of flow, in their native units. Of course the first principal component will point almost entirely in the pressure direction — that is where almost all the variance lives. The principal component might be $\\mathbf{v}_1 \\approx (0.002, 0.998, 0.005)^T$, with pressure overwhelming the others. This is *not* a physical claim about pressure being the dominant variable; it is a numerical fact about pressure being measured in numerically larger units.

Correlation PCA neutralizes this by making every feature unit-variance. After dividing each column by its standard deviation, the diagonal of the correlation matrix is all $1$s, and the off-diagonals encode pairwise correlations. The eigenvectors of $R$ tell you about *patterns of co-variation*, not about which feature happens to have larger numerical scale.

The trade-off cuts both ways. When all features genuinely live on the same scale (pixel intensities in an image, votes across precincts, returns on assets in the same currency), covariance PCA respects the natural variance budget and is preferred. When features measure different physical quantities (kPa vs °C vs mL/min), correlation PCA usually wins. The scree plots can differ dramatically: covariance PCA may show 99% variance in PC1 due to one scale-dominant feature, while correlation PCA may show variance spread across three or four PCs, revealing a higher intrinsic dimensionality that scale was hiding.

A useful heuristic: if you cannot answer the question "does it make sense to add feature 1 and feature 2?" in physical terms, you probably want correlation PCA.
    `.trim(),

    definitions: [
      {
        term: 'Covariance PCA',
        body: 'Diagonalize $\\Sigma = X^T X / (n-1)$ where $X$ is centered. Eigenvalues are variances; PCs are unit-norm eigenvectors. Sensitive to feature scaling.',
      },
      {
        term: 'Correlation PCA',
        body: 'Diagonalize $R = D^{-1} \\Sigma D^{-1}$, equivalently the covariance of the standardized data $\\tilde X = X D^{-1}$. Trace of $R$ is $d$, and the eigenvalues sum to $d$. Scale-invariant.',
      },
      {
        term: 'Standardization',
        body: 'The preprocessing step of centering and then dividing each column by its standard deviation: $\\tilde X_{ij} = (X_{ij} - \\bar X_j) / \\sigma_j$. The columns of $\\tilde X$ each have mean $0$ and variance $1$.',
      },
      {
        term: 'Trace condition',
        body: 'For covariance PCA, $\\sum_k \\lambda_k = \\mathrm{tr}(\\Sigma)$ depends on units. For correlation PCA, $\\sum_k \\lambda_k = \\mathrm{tr}(R) = d$ regardless of original scales.',
      },
    ],

    theorems: [
      {
        name: 'Centering is necessary, not optional',
        statement: 'If $X$ has nonzero column means, then $X^T X / (n-1)$ is not the covariance matrix; it includes a contribution from the means. The first eigenvector of uncentered $X^T X$ is typically aligned with the mean vector, not with the direction of variation.',
        intuition: 'A data cloud shifted far from origin has its $X^T X$ dominated by the offset; the eigendecomposition reports the offset direction as the "largest variance" direction, which is nonsense for analyzing variation.',
      },
      {
        name: 'Covariance PCA is not scale-invariant',
        statement: 'If feature column $X_j$ is rescaled to $c X_j$ for $c > 0$, the entries of $\\Sigma$ involving $X_j$ change: $\\Sigma_{jj} \\to c^2 \\Sigma_{jj}$ and $\\Sigma_{ij} \\to c \\Sigma_{ij}$. The eigenvalues and eigenvectors of $\\Sigma$ generally change.',
        intuition: 'Multiplying one feature by a constant is not an orthogonal transformation; it is a non-uniform stretching. PCA is invariant under orthogonal transformations but not under non-uniform stretching.',
      },
      {
        name: 'Correlation PCA is scale-invariant',
        statement: 'If feature column $X_j$ is rescaled to $c X_j$ for $c > 0$, the correlation matrix $R$ is unchanged. Equivalently, standardizing then running PCA gives the same answer regardless of original scales.',
        intuition: 'Standardization divides out the scale of each feature. After this step, no feature has an artificial advantage from being measured in big numbers.',
      },
    ],

    keyFormulas: [
      '\\Sigma = \\frac{1}{n-1} (X - \\bar X)^T (X - \\bar X)',
      'R = D^{-1} \\Sigma D^{-1}, \\quad D = \\mathrm{diag}(\\sigma_1, \\ldots, \\sigma_d)',
      '\\mathrm{tr}(\\Sigma) = \\sum_j \\mathrm{Var}(X_j), \\quad \\mathrm{tr}(R) = d',
      '\\tilde X = (X - \\bar X) D^{-1}',
    ],
  },

  explore: {
    vizComponent: 'PcaPreprocessingViz',
    description: 'A side-by-side comparison of covariance and correlation PCA on the same dataset. The user picks a "scale imbalance" slider that rescales one feature column by a factor from $0.1$ to $100$. Both PCAs are computed live. As the scale slider moves, the covariance PCs visibly tilt toward the rescaled feature while the correlation PCs stay put.',
    misconception: {
      title: 'Treating covariance PCA as "the default" and forgetting that scale dominates when features have different units',
      body: `The most common applied-PCA error is running covariance PCA on data with heterogeneous units and reading the result as physical fact. A first principal component of $(0.002, 0.998, 0.005)^T$ on temperature-pressure-flow data is a *statement about measurement scale*, not about the underlying chemistry. The student who concludes "pressure is the dominant variable" has been deceived by the units they chose for the recording.

A second error in the opposite direction: applying correlation PCA when the features are already commensurable. If all features are pixel intensities on the same image scale, standardizing to unit variance can throw away meaningful information.

A third error: assuming covariance and correlation PCA give the same answer "with rescaling." They do not. The eigenvectors of $\\Sigma$ and $R$ are different vectors in general, not rescaled versions of each other.

A fourth trap: confusing centering with standardization. Centering is *always* required. Standardization is *optional* and is the covariance-vs-correlation choice.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: covariance PCA on scale-imbalanced data',
        body: 'Three sensors record temperature ($T$ in C°, range 40), pressure ($P$ in kPa, range 500), and flow ($F$ in mL/min, range 10). Sample variances are roughly $\\mathrm{Var}(T) \\approx 100$, $\\mathrm{Var}(P) \\approx 15000$, $\\mathrm{Var}(F) \\approx 6$. Pressure variance is roughly $150 \\times$ larger than temperature variance.',
      },
      {
        title: 'Predict the covariance PC1',
        body: 'Pressure dominates the variance budget by orders of magnitude, so the first PC of $\\Sigma$ will point almost entirely along the pressure axis. A numerical computation yields $\\mathbf{v}_1 \\approx (0.002, 0.998, 0.005)^T$, capturing $\\approx 99\\%$ of variance. This is a units artifact, not physical dominance.',
      },
      {
        title: 'Switch to correlation PCA',
        body: 'Standardizing each column and recomputing: the correlation PCA might give $\\lambda_1 = 1.8, \\lambda_2 = 1.0, \\lambda_3 = 0.2$, revealing two or three meaningful dimensions instead of one scale-dominated one.',
      },
    ],

    problems: [
      {
        id: 'P-11.4a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'An engineer monitors a chemical reactor with three sensors: temperature ($T$, in °C, $[180, 220]$), pressure ($P$, in kPa, $[2000, 2500]$), and flow rate ($F$, in mL/min, $[5, 15]$). Covariance PCA on centered data finds $\\mathbf{v}_1 \\approx (0.002, 0.998, 0.005)^T$. Which statement best explains this result?',
        choices: [
          { label: 'A', body: 'Pressure dominates the first principal component because it has the largest absolute variance, masking potentially important patterns in temperature and flow.' },
          { label: 'B', body: 'The principal component correctly identifies pressure as the most important variable since it has the widest measurement range.' },
          { label: 'C', body: 'This result suggests the three variables are uncorrelated, with pressure varying independently of temperature and flow.' },
          { label: 'D', body: 'The small coefficients for temperature and flow indicate these variables contribute negligible information and can be discarded.' },
          { label: 'E', body: 'Covariance PCA automatically accounts for different measurement scales, so this result reveals genuine physical dominance of pressure variation.' },
        ],
        correctAnswer: 'A',
        solution: {
          explanation: "Pressure's range of $500$ is roughly $12.5 \\times$ temperature's ($40$) and $50 \\times$ flow's ($10$). Variance scales as range-squared. Covariance PCA inherits this scale imbalance; PC1 is forced to align with the highest-variance direction (pressure). The dominance is a *unit artifact*, not a physical statement. The engineer should use correlation PCA or standardize.",
          trickAnalysis: [
            { choice: 'B', why: '"Widest measurement range" describes the data but does not justify calling it "the most important variable." Conflates units with importance.' },
            { choice: 'C', why: 'PC1 says nothing about correlation. The entries are about *variance contribution*, not joint dependence.' },
            { choice: 'D', why: 'Small coefficients in PC1 do not mean negligible information overall. The features may dominate PC2 or PC3.' },
            { choice: 'E', why: 'Exactly backwards. Covariance PCA does *not* account for different scales; that is its key limitation.' },
          ],
        },
      },
      {
        id: 'P-11.4b',
        format: 'multiple-choice',
        difficulty: 3,
        statement: 'A data scientist analyzes six thermodynamic sensors. Cumulative-explained-variance scree plots show: covariance PCA reaches $\\geq 94\\%$ at the first component; correlation PCA rises gradually, reaching $\\sim 60\\%$ at PC1, $\\sim 80\\%$ at PC2, $\\geq 95\\%$ around PC3. Which interpretation is most appropriate?',
        choices: [
          { label: 'A', body: 'Covariance PCA reveals that the process is essentially one-dimensional; the other sensors are redundant.' },
          { label: 'B', body: 'Correlation PCA suggests the process has intrinsic dimension approximately $3$, with scale differences among sensors masking this structure in the covariance analysis.' },
          { label: 'C', body: 'Both analyses agree on low intrinsic dimensionality; correlation PCA is always preferable as it preserves natural units.' },
          { label: 'D', body: 'The correlation PCA result is misleading because standardizing variables inflates the apparent contribution of low-variance sensors.' },
          { label: 'E', body: 'A rank-2 approximation captures over $75\\%$ in both analyses, so the dimensionality choice is identical in practice.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'The two PCAs disagree because the sensors live on different units. Covariance PCA shows $94\\%$ in PC1 because one or two high-scale features dominate — a scale artifact. Correlation PCA standardizes and shows a more gradual rise to $\\sim 95\\%$ at PC3, indicating intrinsic dimensionality of about $3$. The apparent $1$-D structure in covariance PCA was a units artifact.',
          partialCredit: 'Choice E (both reach 75% by rank-2) misses the qualitative difference between the spectra.',
          trickAnalysis: [
            { choice: 'A', why: "Takes covariance PCA's $94\\%$ at face value. It is consistent with one high-scale feature dominating the others." },
            { choice: 'C', why: 'Misstates correlation PCA. Standardization removes units; it does not preserve them.' },
            { choice: 'D', why: 'Inverts the issue. Standardization puts sensors on equal footing; covariance PCA is what suppressed them.' },
            { choice: 'E', why: 'Picks a single shared threshold without examining the spectrum shape.' },
          ],
        },
      },
    ],
  },
};
