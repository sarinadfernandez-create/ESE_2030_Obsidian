import type { Concept } from '../types';

export const statisticalSignificance: Concept = {
  id: 'statistical-significance',
  unitId: 'ch11',
  number: '11.5',
  title: 'Statistical Significance of PCs',
  blurb: 'Not every principal component reflects real structure. Distinguishing signal eigenvalues from noise eigenvalues is what separates a PCA report from a meaningful one.',
  tier: 'full',

  learn: {
    overview: `
PCA always returns $\\min(n, d)$ principal components, even if the data has no real structure. Random noise produces nonzero eigenvalues by chance, and a scree plot of pure noise looks like a gradually declining curve. The practical question — and a question that the [[principal-components|spectral decomposition]] alone does not answer — is which of the eigenvalues are *signal* and which are *noise*.

The *spectral gap* view: a real low-rank signal produces a few large eigenvalues followed by a sharp drop, while noise eigenvalues are spread roughly uniformly across the remaining components. An "elbow" in the scree plot marks the transition. PCs above the elbow are taken as signal; PCs below are treated as noise. This is the qualitative version of rank choice, and it works when the signal is strong enough to produce a visible gap.

The *random-matrix view*: if the data were pure noise (each entry an independent Gaussian sample), the empirical singular values would still follow a predictable distribution — the *Marchenko-Pastur distribution* in the simplest case. Noise eigenvalues live in a known range; eigenvalues outside that range can be attributed to signal with statistical confidence.

Three practical consequences. First, the number of PCs to retain is not the number of nonzero eigenvalues; it is the number significantly above noise. Second, *sample-size dependence* matters. With $n$ small, even genuine low-rank signal can be obscured by random fluctuation. Third, a *single dominant eigenvalue is not always a sign of clean low-dimensional structure* — it can indicate the [[pca-preprocessing|scale-dominance pathology]] or the presence of a single outlier.

Two simple but principled rules of thumb appear in practice:

- *Kaiser criterion* (for correlation PCA): retain PCs with $\\lambda_k > 1$.
- *Elbow / scree*: retain PCs up to the first sharp drop in $\\lambda_k$.

Both are heuristics, not theorems, and they often disagree. In serious applications they are supplemented by cross-validation, bootstrap stability analysis, or a domain-specific criterion (e.g., reaching 90% cumulative variance).
    `.trim(),

    definitions: [
      {
        term: 'Signal eigenvalue',
        body: 'An eigenvalue of $\\Sigma$ that reflects real low-dimensional structure. Signal eigenvalues are typically large and clearly separated from a noise floor of smaller eigenvalues.',
      },
      {
        term: 'Noise eigenvalue',
        body: 'An eigenvalue produced by finite-sample random fluctuation, even when the underlying signal has no variation in that direction. Pure-noise data still yields nonzero eigenvalues across all PCs.',
      },
      {
        term: 'Spectral gap',
        body: 'The ratio or difference between consecutive eigenvalues $\\lambda_k$ and $\\lambda_{k+1}$. A large gap at position $k$ suggests the first $k$ PCs capture signal and the rest are noise.',
      },
      {
        term: 'Kaiser criterion',
        body: 'A heuristic for correlation PCA: retain components with $\\lambda_k > 1$. Since the trace of $R$ equals $d$, the average eigenvalue is $1$; the criterion asks for above-average components.',
      },
      {
        term: 'Bootstrap stability',
        body: 'A more principled test: resample the data with replacement many times, recompute PCs, and check whether the directions are stable across resamples.',
      },
    ],

    theorems: [
      {
        name: 'PCA on pure noise still produces nonzero eigenvalues',
        statement: 'If $X \\in \\mathbb{R}^{n \\times d}$ has independent zero-mean entries with $n > d$, then all eigenvalues of $\\Sigma$ are positive almost surely. The eigenvalues follow a known distribution depending on the noise variance and the aspect ratio $d/n$.',
        intuition: 'Random data has no preferred direction, but a finite sample still picks up apparent variance in every direction. The "noise floor" of the scree plot is not zero; it is a positive distribution.',
      },
      {
        name: 'Spectral gap signals dimensionality',
        statement: 'If the data is a rank-$k$ signal plus noise, the top $k$ eigenvalues of $\\Sigma$ are typically separated from the lower $d - k$ eigenvalues by a clear gap.',
        intuition: 'Signal concentrates variance in $k$ directions; noise spreads variance evenly. The boundary shows up as a discontinuity in the scree plot.',
      },
      {
        name: 'Trace conservation under standardization',
        statement: 'For correlation PCA, $\\sum_k \\lambda_k = \\mathrm{tr}(R) = d$. The average eigenvalue is $1$, so the Kaiser criterion asks for above-average components.',
        intuition: 'Standardization redistributes variance equally across features; the total is $d$ by construction.',
      },
    ],

    keyFormulas: [
      '\\text{Kaiser criterion: retain PC } k \\text{ if } \\lambda_k > 1',
      '\\text{Spectral gap: } \\frac{\\lambda_k}{\\lambda_{k+1}} \\gg 1 \\text{ marks an elbow at } k',
      '\\text{Cumulative: retain until } \\frac{\\sum_{j \\leq k} \\lambda_j}{\\sum_j \\lambda_j} \\geq 0.9',
      '\\mathrm{tr}(R) = d',
    ],
  },

  explore: {
    vizComponent: 'StatisticalSignificanceViz',
    description: "A scree plot generator that lets the user choose 'true rank' $k$ and 'noise level' $\\sigma$. The viz simulates synthetic data of rank $k$ plus Gaussian noise and shows the resulting eigenvalues. Three threshold lines are overlaid: Kaiser ($\\lambda = 1$), elbow, and a noise-floor band. A second mode replays the same synthetic dataset across $30$ bootstrap resamples and shows PC direction stability.",
    misconception: {
      title: 'Treating all nonzero eigenvalues as meaningful, and chasing the elbow without checking sample size',
      body: `Two errors recur. First: assuming every nonzero eigenvalue reflects signal. PCA returns $\\min(n,d)$ eigenvalues, almost always positive even when the data has no underlying structure. A scree plot of pure white noise looks like a gradually decreasing curve, and a naive reader might draw an elbow somewhere in the middle. The right comparison is the eigenvalue *relative to the noise floor*, not relative to zero.

The second error: applying the spectral-gap rule without thinking about sample size. With $n$ comparable to $d$, noise-induced eigenvalues are large enough to hide a real but weak signal entirely.

A third trap: the Kaiser criterion ($\\lambda > 1$) is sometimes applied to *covariance PCA*, where eigenvalues are in original variance units and $1$ has no special meaning. The threshold $\\lambda = 1$ is meaningful only for correlation PCA.

The bigger picture: significance in PCA is not a single number. It is a property the analyst has to interpret using a scree plot, sample-size check, bootstrap, and domain knowledge.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: scree plot with a clear gap',
        body: 'A correlation PCA on $d = 8$ features yields eigenvalues $\\lambda = (4.2, 2.1, 1.4, 0.4, 0.3, 0.3, 0.2, 0.1)$. Cumulative variance is $52.5\\%$ at PC1, $78.8\\%$ at PC2, $96.3\\%$ at PC3.',
      },
      {
        title: 'Apply three criteria',
        body: "Kaiser ($\\lambda > 1$): retain PC1, PC2, PC3. Elbow: drop from $1.4$ to $0.4$ between PC3 and PC4, elbow at $k = 3$. 90\\% cumulative: reached at PC3. All three agree: retain $3$ PCs.",
      },
      {
        title: 'Compare with a noisier spectrum',
        body: 'If instead $\\lambda = (1.6, 1.3, 1.2, 1.1, 0.9, 0.8, 0.7, 0.4)$: Kaiser retains PC1-4; elbow unclear; 90\\% cumulative at PC6. The three criteria disagree — this is where statistical judgment is required.',
      },
    ],

    problems: [
      {
        id: 'P-11.5a',
        format: 'multiple-choice',
        difficulty: 1,
        statement: 'A correlation PCA on $d = 6$ features yields eigenvalues $\\lambda_1 = 3.0, \\lambda_2 = 1.5, \\lambda_3 = 0.8, \\lambda_4 = 0.4, \\lambda_5 = 0.2, \\lambda_6 = 0.1$. Applying the Kaiser criterion ($\\lambda > 1$), which PCs are retained?',
        choices: [
          { label: 'A', body: 'PC1 only.' },
          { label: 'B', body: 'PC1 and PC2.' },
          { label: 'C', body: 'PC1, PC2, and PC3.' },
          { label: 'D', body: 'All six PCs, since all eigenvalues are positive.' },
          { label: 'E', body: 'PCs cannot be retained without consulting the cumulative-variance threshold.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Kaiser retains components with $\\lambda_k > 1$. $\\lambda_1 = 3.0 > 1$ (retain), $\\lambda_2 = 1.5 > 1$ (retain), $\\lambda_3 = 0.8 < 1$ (discard), and subsequent are smaller. PCs $1$ and $2$ retained.',
          trickAnalysis: [
            { choice: 'A', why: "Picks only the most-dominant PC. Kaiser picks all above the threshold; $\\lambda_2 = 1.5$ is comfortably above $1$." },
            { choice: 'C', why: "Includes PC3 with $\\lambda_3 = 0.8$, below the threshold." },
            { choice: 'D', why: "Confuses 'positive eigenvalue' with 'retained PC.'" },
            { choice: 'E', why: 'False premise. Kaiser is a stand-alone criterion.' },
          ],
        },
      },
      {
        id: 'P-11.5b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Three datasets of the same dimensions are analyzed by covariance PCA. Their normalized eigenvalues are: **I**: $(0.5, 0.2, 0.15, 0.10, 0.05)$. **II**: $(0.21, 0.20, 0.20, 0.20, 0.19)$. **III**: $(0.88, 0.06, 0.03, 0.02, 0.01)$. Which dataset most likely consists of pure noise?',
        choices: [
          { label: 'A', body: 'Dataset I, because the eigenvalues decrease gradually.' },
          { label: 'B', body: 'Dataset II, because the eigenvalues are nearly uniform.' },
          { label: 'C', body: 'Dataset III, because one PC captures almost all the variance.' },
          { label: 'D', body: 'All three are equally likely to be noise.' },
          { label: 'E', body: 'None of them; nonzero eigenvalues imply real structure.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Pure noise spreads variance roughly uniformly across all PCs because no direction is preferred. The flat spectrum in Dataset II ($0.19$ to $0.21$ across all five PCs) is the signature of noise. Dataset III has a single dominant PC indicating clear $1$-D signal. Dataset I has gradual decay (mixed signal+noise).',
          trickAnalysis: [
            { choice: 'A', why: 'Gradual decay is *not* the signature of pure noise; it suggests mixed signal-and-noise structure.' },
            { choice: 'C', why: 'A single dominant PC is exactly the *opposite* of noise — it indicates clear $1$-D structure.' },
            { choice: 'D', why: 'False. The spectra have qualitatively different shapes.' },
            { choice: 'E', why: 'False premise. Random data always produces nonzero eigenvalues.' },
          ],
        },
      },
    ],
  },
};
