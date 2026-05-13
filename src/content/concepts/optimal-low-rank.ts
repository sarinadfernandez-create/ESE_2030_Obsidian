import type { Concept } from '../types';

export const optimalLowRank: Concept = {
  id: 'optimal-low-rank',
  unitId: 'ch12',
  number: '12.1',
  title: 'Optimal Low-Rank Approximation',
  blurb: 'The Eckart-Mirsky-Young theorem: truncating the SVD gives the best rank-$k$ approximation to a matrix in both Frobenius and operator norm. The smallest singular values are the noise; the largest are the signal.',
  tier: 'full',
  learn: {
    overview: `
The central theorem of Unit 12 is short, deep, and almost too useful: **truncating the [[svd-form|SVD]] at the top $k$ singular values gives the optimal rank-$k$ approximation to a matrix**. Formally, if $A = U\\Sigma V^T = \\sum_{i=1}^{r} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$ is the SVD, then the rank-$k$ truncation
$$A_k = \\sum_{i=1}^{k} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$$
solves both of the following optimization problems:
$$A_k = \\underset{\\mathrm{rank}(B) \\leq k}{\\arg\\min} \\|A - B\\|_F = \\underset{\\mathrm{rank}(B) \\leq k}{\\arg\\min} \\|A - B\\|_{op}.$$
This is the **Eckart-Mirsky-Young theorem** (1936 for Frobenius, 1960 for operator norm). The remarkable feature is that *the same matrix* $A_k$ is optimal under two genuinely different norms. The approximation errors are the singular values themselves:
$$\\|A - A_k\\|_F = \\sqrt{\\sigma_{k+1}^2 + \\sigma_{k+2}^2 + \\cdots + \\sigma_r^2}, \\qquad \\|A - A_k\\|_{op} = \\sigma_{k+1}.$$
The error in Frobenius norm is the root-sum-of-squares of the discarded singular values; the error in operator norm is just the largest discarded one. Both vanish exactly when $k \\geq r$ (the rank of $A$).

The geometric content is that the [[spheres-ellipsoids|image ellipsoid]] of $A$ has its largest semi-axes carry the most information about $A$'s action; the smallest semi-axes carry the least. Truncating to rank $k$ means collapsing the smallest $r - k$ semi-axes to zero — turning a rank-$r$ ellipsoid into a rank-$k$ ellipsoid that nests inside the original. The discarded semi-axes are the ones $A$ does the least with, so discarding them perturbs the action of $A$ by the smallest possible amount.

Why does the same matrix solve two different optimization problems? Both norms are **[[svd-invariance|unitarily invariant]]**: $\\|UAV^T\\|_F = \\|A\\|_F$ and $\\|UAV^T\\|_{op} = \\|A\\|_{op}$ for orthogonal $U, V$. For any unitarily invariant norm, a deep result of von Neumann says the norm depends *only* on the singular values of the matrix — not on the singular vectors. Once you have a unitarily invariant norm, the problem $\\min_B \\|A - B\\|$ subject to $\\mathrm{rank}(B) \\leq k$ becomes a problem about which singular values to keep, and the answer is always "keep the top $k$." The Frobenius and operator norms are not special; the truncated SVD is optimal for *every* unitarily invariant norm.

The proof of optimality is short and worth understanding. For any rank-$k$ matrix $B$ and the SVD $A = U\\Sigma V^T$, write $\\|A - B\\|_F^2 = \\|U^T(A - B)V\\|_F^2 = \\|\\Sigma - U^TBV\\|_F^2$ by unitary invariance. Let $C = U^TBV$ (rank at most $k$). Then $\\|\\Sigma - C\\|_F^2 = \\sum_{i,j}(\\Sigma_{ij} - C_{ij})^2$, and we want to choose rank-$k$ $C$ minimizing this. The minimum is achieved when $C$ matches the top $k$ diagonal entries of $\\Sigma$ exactly and is zero elsewhere — exactly the truncation. Translating back, $B = UCV^T = A_k$.

The **interpretation as signal-vs-noise** is what makes this theorem so powerful in practice. Suppose $A = A_{\\text{true}} + N$, where $A_{\\text{true}}$ is a clean rank-$k$ matrix and $N$ is "noise" with singular values much smaller than $\\sigma_1(A_{\\text{true}})$. Then the SVD of $A$ produces large singular values approximately equal to those of $A_{\\text{true}}$, plus small ones corresponding to noise. Truncating at level $k$ recovers an approximation of $A_{\\text{true}}$ whose error is controlled by the noise level. This is the foundation of [[principal-components|PCA]] as a denoising procedure, the JPEG-style image-compression schemes that store only the dominant singular components, and the recommender systems that fill in missing entries by assuming low rank.

The theorem has limitations worth noting. The optimum is over ALL rank-$k$ matrices, but in many real problems we want approximations with additional structure: non-negative entries (NMF), sparse entries (sparse PCA), discrete entries (binary low-rank), or specific support patterns ([[matrix-completion|matrix completion]]). These constrained problems are typically NP-hard, and the Eckart-Mirsky-Young theorem only gives a baseline. Modern algorithms (alternating minimization, convex relaxations, gradient methods) all use the truncated SVD as their starting point and modify it to satisfy the extra constraints.
    `.trim(),
    definitions: [
      {
        term: 'Rank-$k$ truncation',
        body: 'For $A$ with SVD $A = \\sum_{i=1}^r \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$, the matrix $A_k = \\sum_{i=1}^k \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$ obtained by keeping only the top $k$ singular components.',
      },
      {
        term: 'Eckart-Mirsky-Young theorem',
        body: 'The statement that $A_k$ minimizes $\\|A - B\\|$ over all rank-$k$ matrices $B$, for any unitarily invariant norm. The errors are $\\|A - A_k\\|_F = (\\sum_{i > k} \\sigma_i^2)^{1/2}$ and $\\|A - A_k\\|_{op} = \\sigma_{k+1}$.',
      },
      {
        term: 'Unitarily invariant norm',
        body: 'A matrix norm satisfying $\\|UAV^T\\| = \\|A\\|$ for all orthogonal $U, V$. Examples: Frobenius, operator, nuclear.',
      },
      {
        term: 'Nuclear norm',
        body: '$\\|A\\|_* = \\sum_i \\sigma_i(A)$. The convex envelope of $\\mathrm{rank}(A)$ on the unit ball of the operator norm.',
      },
      {
        term: 'Spectral decay',
        body: 'The pattern of how rapidly $\\sigma_i$ decreases with $i$. Fast decay means $A$ admits good low-rank approximations.',
      },
    ],
    theorems: [
      {
        name: 'Eckart-Mirsky-Young (Frobenius norm)',
        statement: 'Let $A \\in \\mathbb{R}^{m \\times n}$ have SVD $A = U\\Sigma V^T$ and rank $r$. For any $k \\leq r$, $\\min_{\\mathrm{rank}(B) \\leq k} \\|A - B\\|_F = \\sqrt{\\sum_{i=k+1}^{r} \\sigma_i^2}$, achieved by $A_k$.',
        intuition: 'Use unitary invariance to reduce to a problem about the diagonal $\\Sigma$. Any rank-$k$ approximation has its own "singular values" no larger than those of $A$, and the deficit $\\|A - B\\|_F^2 \\geq \\sum_{i > k} \\sigma_i^2$. Truncation matches this lower bound with equality.',
      },
      {
        name: 'Eckart-Mirsky-Young (operator norm)',
        statement: 'Under the same hypotheses, $\\min_{\\mathrm{rank}(B) \\leq k} \\|A - B\\|_{op} = \\sigma_{k+1}$, also achieved by $A_k$.',
        intuition: 'In operator norm, the error equals the largest singular value the approximation failed to capture — namely $\\sigma_{k+1}$. Both norms are unitarily invariant, so the same truncation optimizes both.',
      },
      {
        name: 'Outer product decomposition',
        statement: 'Every rank-$r$ matrix decomposes as $A = \\sum_{i=1}^{r} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$, a sum of rank-1 matrices. The terms are mutually orthogonal in Frobenius inner product.',
        intuition: 'Each rank-1 piece lives in its own 1D singular subspace. Together they account for $\\|A\\|_F^2 = \\sum \\sigma_i^2$ Pythagoreanly.',
      },
    ],
    keyFormulas: [
      'A_k = \\sum_{i=1}^{k} \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T',
      '\\|A - A_k\\|_F = \\sqrt{\\sigma_{k+1}^2 + \\cdots + \\sigma_r^2}',
      '\\|A - A_k\\|_{op} = \\sigma_{k+1}',
      '\\|A\\|_F^2 = \\|A_k\\|_F^2 + \\|A - A_k\\|_F^2',
      '\\|A\\|_* = \\sigma_1 + \\sigma_2 + \\cdots + \\sigma_r',
    ],
  },
  explore: {
    vizComponent: 'EckartMirskyYoungViz',
    description: 'A $32 \\times 32$ grayscale image $A$ is displayed alongside its rank-$k$ truncation $A_k$, with $k$ controlled by a slider. As $k$ increases, $A_k$ visibly converges to $A$. A side panel shows the bar chart of singular values with the top $k$ highlighted, and live readouts of $\\|A - A_k\\|_F$ and $\\|A - A_k\\|_{op} = \\sigma_{k+1}$.',
    misconception: {
      title: 'Optimality is for Frobenius/operator norms, NOT arbitrary loss functions or constrained rank.',
      body: `Three boundary cases are routinely mishandled.

First: the theorem optimizes over **all rank-$k$ matrices**. It does NOT say the truncated SVD is best under additional structural constraints. If you require non-negative entries, the truncated SVD may have negative entries and is not optimal in this constrained class. Non-negative matrix factorization (NMF) is solved by alternating algorithms, not the SVD. Sparse PCA, binary low-rank, and [[matrix-completion|matrix completion]] all have their own algorithms.

Second: the theorem optimizes for **unitarily invariant norms**. It does NOT say truncation is optimal under arbitrary loss functions. The entrywise $L^1$ norm is not unitarily invariant, and the rank-$k$ minimizer for $L^1$ is generally not the truncated SVD.

Third: students sometimes interpret "discard the smallest singular values" as "discard the smallest entries of $A$." These are very different operations. A matrix with all entries equal to small $\\epsilon$ has a SINGLE large singular value (rank 1). The identity has all singular values equal to $1$ despite being mostly zeros.

Fourth: when $\\sigma_k = \\sigma_{k+1}$ (a tied singular value), the rank-$k$ minimizer is not unique. This matters for randomized SVD and for interpretation in PCA.`,
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Set up the matrix and read off singular values',
        body: 'Let $A$ be rank-$3$ with $\\sigma_1 = 10, \\sigma_2 = 6, \\sigma_3 = 2$. Goal: compute rank-$1$ and rank-$2$ approximation errors.',
      },
      {
        title: 'Step 2: Apply the error formulas',
        body: 'For $k = 1$: $\\|A - A_1\\|_F = \\sqrt{36 + 4} = 2\\sqrt{10} \\approx 6.32$; $\\|A - A_1\\|_{op} = 6$. For $k = 2$: $\\|A - A_2\\|_F = 2$; $\\|A - A_2\\|_{op} = 2$.',
      },
      {
        title: 'Step 3: Compute relative errors',
        body: '$\\|A\\|_F^2 = 100 + 36 + 4 = 140$. Relative Frobenius: rank-$1$ has error $\\sqrt{40/140} \\approx 53\\%$; rank-$2$ has $\\sqrt{4/140} \\approx 17\\%$.',
      },
    ],
    problems: [
      {
        id: 'P-12.1a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A matrix $A \\in \\mathbb{R}^{50 \\times 30}$ has singular values $\\sigma_1 = 100, \\sigma_2 = 40, \\sigma_3 = 10, \\sigma_4 = 2, \\sigma_5 = \\cdots = \\sigma_{30} = 0$. What is the operator-norm error of the best rank-$3$ approximation?',
        choices: [
          { label: 'A', body: '$\\sqrt{4} = 2$' },
          { label: 'B', body: '$2$' },
          { label: 'C', body: '$10$' },
          { label: 'D', body: '$\\sigma_1 - \\sigma_3 = 90$' },
          { label: 'E', body: '$0$, because the rank-$3$ approximation captures all the nonzero structure of $A$.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: '$\\|A - A_3\\|_{op} = \\sigma_{k+1} = \\sigma_4 = 2$. The operator-norm error equals the largest discarded singular value.',
          partialCredit: '(A) is numerically correct but reveals confusion with the Frobenius formula.',
          trickAnalysis: [
            { choice: 'A', why: 'Numerically equal to (B), but $\\sqrt{4}$ comes from Frobenius-style reasoning. The operator-norm formula has no square root.' },
            { choice: 'C', why: 'Returns $\\sigma_3 = 10$ instead of $\\sigma_4 = 2$. Off by one in the truncation index.' },
            { choice: 'D', why: 'Invents a "difference" formula that has no role in Eckart-Mirsky-Young.' },
            { choice: 'E', why: 'Rank of $A$ is $4$, so a rank-$3$ approximation discards $\\sigma_4 = 2$ and has nonzero error.' },
          ],
        },
      },
      {
        id: 'P-12.1b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'For the same matrix $A$ with singular values $100, 40, 10, 2, 0, \\ldots, 0$, what is the Frobenius-norm error of the best rank-$2$ approximation?',
        choices: [
          { label: 'A', body: '$10$' },
          { label: 'B', body: '$\\sqrt{104}$' },
          { label: 'C', body: '$12$' },
          { label: 'D', body: '$2$' },
          { label: 'E', body: '$\\sqrt{144} = 12$' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: '$\\|A - A_2\\|_F = \\sqrt{\\sigma_3^2 + \\sigma_4^2} = \\sqrt{100 + 4} = \\sqrt{104}$. Root-sum-of-squares of ALL discarded singular values.',
          trickAnalysis: [
            { choice: 'A', why: 'Returns $\\sigma_3 = 10$, the operator-norm error. Confuses Frobenius with operator norm.' },
            { choice: 'C', why: 'Sums without squaring: $10 + 2 = 12$. Confuses Frobenius with the nuclear-norm residual.' },
            { choice: 'D', why: 'Returns $\\sigma_4 = 2$, the smallest discarded value.' },
            { choice: 'E', why: 'Computes $(\\sigma_3 + \\sigma_4)^2 = 144$ instead of $\\sigma_3^2 + \\sigma_4^2 = 104$.' },
          ],
        },
      },
      {
        id: 'P-12.1c',
        format: 'multiple-choice',
        difficulty: 3,
        statement: 'A data scientist wants the rank-$10$ approximation $B$ minimizing $\\|A - B\\|_F^2$ subject to all entries of $B$ being non-negative. They compute the SVD and truncate to rank $10$. Which statement is most TRUE?',
        choices: [
          { label: 'A', body: 'The truncated SVD $A_{10}$ is the unique optimal solution.' },
          { label: 'B', body: 'The truncated SVD is optimal because singular vectors of a non-negative matrix are themselves non-negative.' },
          { label: 'C', body: 'The truncated SVD is NOT necessarily optimal under the non-negativity constraint; non-negative matrix factorization solves the constrained problem.' },
          { label: 'D', body: 'The truncated SVD is optimal because non-negativity is preserved by SVD truncation.' },
          { label: 'E', body: 'The problem has no solution because Eckart-Mirsky-Young does not allow constraints on entries.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'Eckart-Mirsky-Young optimizes over ALL rank-$k$ matrices, unconstrained. The truncated SVD generally has both positive and negative entries; under the non-negativity constraint, the true optimum lies in a smaller class and differs from the SVD truncation. NMF solves this via alternating algorithms.',
          trickAnalysis: [
            { choice: 'A', why: 'Misreads "optimal among all rank-$k$" as "optimal under any constraints." Constraints shrink the feasible set and change the optimum.' },
            { choice: 'B', why: 'False premise: singular vectors of a non-negative matrix are NOT automatically non-negative. Only the leading one (Perron-Frobenius).' },
            { choice: 'D', why: 'False. SVD truncation preserves singular structure, not entry signs.' },
            { choice: 'E', why: 'The constrained problem has solutions; Eckart-Mirsky-Young just does not apply.' },
          ],
        },
      },
      {
        id: 'P-12.1d',
        format: 'multiple-choice',
        difficulty: 1,
        statement: 'A matrix $A$ has Frobenius norm $\\|A\\|_F = 20$. The top three singular values are $\\sigma_1 = 18, \\sigma_2 = 8, \\sigma_3 = 4$. What is $\\|A - A_3\\|_F$?',
        choices: [
          { label: 'A', body: 'Cannot be determined without knowing all the singular values of $A$.' },
          { label: 'B', body: '$\\sqrt{16}= 4$' },
          { label: 'C', body: '$\\sqrt{400 - 324 - 64 - 16} = \\sqrt{-4}$, which is impossible — the given data is inconsistent.' },
          { label: 'D', body: '$0$, because the top three singular values dominate.' },
          { label: 'E', body: '$\\sqrt{20^2 - 18^2 - 8^2 - 4^2} = \\sqrt{-4}$.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'Pythagorean: $\\|A\\|_F^2 = \\sum \\sigma_i^2 = 400$, but $324 + 64 + 16 = 404 > 400$. Partial sum cannot exceed total. The data is inconsistent.',
          trickAnalysis: [
            { choice: 'A', why: 'The Pythagorean identity provides enough to deduce inconsistency.' },
            { choice: 'B', why: 'Evaluates as if data were consistent; misses the consistency check.' },
            { choice: 'D', why: 'Asserts dominance gives zero error; ignores both algebra and smaller singular values.' },
            { choice: 'E', why: 'Same computation as (C) but presented as the answer rather than as evidence of inconsistency.' },
          ],
        },
      },
    ],
  },
};
