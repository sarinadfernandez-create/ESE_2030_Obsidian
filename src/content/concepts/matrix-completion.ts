import type { Concept } from '../types';

export const matrixCompletion: Concept = {
  id: 'matrix-completion',
  unitId: 'ch12',
  number: '12.4',
  title: 'Matrix Completion',
  blurb: 'Given only some entries of a matrix, recover the rest under the assumption that the matrix is low-rank. Solved by alternating minimization on a low-rank factorization, or by convex nuclear-norm relaxation.',
  tier: 'full',
  learn: {
    overview: `
The matrix completion problem is the central computational challenge of recommender systems. A matrix $M \\in \\mathbb{R}^{m \\times n}$ has rank approximately $k$, but only entries in a subset $\\Omega \\subset \\{1, \\ldots, m\\} \\times \\{1, \\ldots, n\\}$ are observed. Reconstruct all of $M$.

The naive approach — fill missing with zeros and run [[svd-form|SVD]] — works poorly because the result is not actually low-rank, and SVD has no mechanism to trust observed entries while inventing the rest. Two principled approaches dominate.

**Alternating minimization** parameterizes $M = UV^T$ with $U \\in \\mathbb{R}^{m \\times k}, V \\in \\mathbb{R}^{n \\times k}$ and minimizes squared error on observed entries:
$$\\min_{U, V} \\sum_{(i,j) \\in \\Omega} (M_{ij} - (UV^T)_{ij})^2.$$
Not jointly convex in $(U, V)$, but convex in each when the other is fixed: with $V$ fixed, the problem for $U$ becomes $m$ independent [[least-squares|least-squares problems]]. Alternate: fix $V$, solve for $U$; fix $U$, solve for $V$. Repeat. The Netflix Prize systems used this approach.

**Nuclear-norm minimization** is the convex relaxation:
$$\\min_X \\|X\\|_* \\quad \\text{subject to } X_{ij} = M_{ij}, (i, j) \\in \\Omega.$$
The nuclear norm $\\|X\\|_* = \\sum_i \\sigma_i(X)$ is the convex envelope of $\\mathrm{rank}(X)$. Candès-Recht (2009): under incoherence and uniform sampling, nuclear-norm minimization **exactly recovers** $M$ with high probability when $|\\Omega| \\geq O(k(m + n) \\log^2 \\max(m, n))$.

Alternating minimization is fast and scales but is non-convex. Nuclear-norm is convex (global optimum) but slower. **Soft-impute** is a popular hybrid.

The **fundamental subtlety**: not every low-rank matrix can be recovered. If $\\Omega$ misses an entire row, no algorithm can recover that row. If $M = \\mathbf{e}_1 \\mathbf{e}_1^T$ (rank 1, single nonzero entry), it is invisible to most sampling patterns. The **incoherence** condition requires singular vectors of $M$ to be "spread out" relative to the standard basis. Recommender systems and image inpainting satisfy it empirically; pathological sparse matrices do not.

Matrix completion is **transductive learning** with strong structural assumptions. The low-rank assumption replaces the i.i.d. assumption of classical ML. Test and training entries belong to the same matrix.
    `.trim(),
    definitions: [
      {
        term: 'Observed entries',
        body: 'The subset $\\Omega$ of (row, column) indices whose values $M_{ij}$ are known. The problem: fill in $M_{ij}$ for $(i, j) \\notin \\Omega$.',
      },
      {
        term: 'Alternating minimization',
        body: 'Parameterize $M \\approx UV^T$ and alternately solve for $U$ (with $V$ fixed) and $V$ (with $U$ fixed) via [[least-squares|least squares]]. Scales but non-convex.',
      },
      {
        term: 'Nuclear-norm minimization',
        body: 'Convex: $\\min_X \\|X\\|_*$ subject to $X_{ij} = M_{ij}$ on $\\Omega$. Provably recovers low-rank $M$ under incoherence.',
      },
      {
        term: 'Incoherence condition',
        body: '$\\max_i \\|U_M^T \\mathbf{e}_i\\|^2 \\leq \\mu k / m$. Requires singular vectors of $M$ to be "spread out" relative to the standard basis.',
      },
      {
        term: 'Sample complexity',
        body: 'For a rank-$k$ matrix in $\\mathbb{R}^{m \\times n}$, nuclear-norm minimization achieves $|\\Omega| = O(k(m + n) \\log^2 \\max(m, n))$.',
      },
    ],
    theorems: [
      {
        name: 'Candès-Recht exact recovery',
        statement: 'Let $M$ have rank $k$ and satisfy incoherence with parameter $\\mu$. If $\\Omega$ is uniformly random with $|\\Omega| \\geq C \\mu^2 k (m + n) \\log^2(\\max(m, n))$, then with high probability nuclear-norm minimization recovers $M$ exactly.',
        intuition: 'A rank-$k$ matrix has $\\sim k(m + n - k)$ degrees of freedom. Information in $|\\Omega| \\sim k(m+n)$ observed entries is just enough to determine them. EXACT recovery (zero error) is possible — not just approximate — when the underlying matrix is genuinely low-rank.',
      },
      {
        name: 'Alternating-minimization local convergence',
        statement: 'Alternating minimization initialized close to $(U^*, V^*)$ converges geometrically to a global optimum. Initialization via partial SVD of the zero-filled matrix typically suffices.',
        intuition: 'Biconvex objective: convex in each variable separately. Recent theory shows the loss landscape is "benign" under incoherence — all local minima are global.',
      },
      {
        name: 'Nuclear norm as rank relaxation',
        statement: 'For matrices in the operator-norm unit ball, the convex envelope of rank is the nuclear norm $\\|X\\|_* = \\sum \\sigma_i$.',
        intuition: 'Rank is integer-valued, not convex-amenable. Nuclear norm is the tightest convex lower bound. The matrix version of $\\|x\\|_1$ vs $\\|x\\|_0$.',
      },
    ],
    keyFormulas: [
      '\\min_X \\|X\\|_* \\text{ s.t. } X_{ij} = M_{ij}, \\, (i,j) \\in \\Omega',
      '\\min_{U, V} \\sum_{(i,j) \\in \\Omega} (M_{ij} - (UV^T)_{ij})^2',
      '\\|X\\|_* = \\sum_i \\sigma_i(X)',
      '|\\Omega| \\gtrsim k(m + n) \\log^2 \\max(m, n)',
      'U_{i,:} \\leftarrow \\arg\\min_{\\mathbf{u}} \\sum_{j : (i,j) \\in \\Omega} (M_{ij} - \\mathbf{u}^T V_{j,:})^2',
    ],
  },
  explore: {
    vizComponent: 'MatrixCompletionViz',
    description: 'A $20 \\times 20$ rank-3 matrix displayed as a heatmap with observation-fraction slider $p$. Two side panels run alternating minimization and nuclear-norm soft-impute; reconstruction-error plot vs iteration; rank slider for under/overfit; phase-transition mode plots recovery error vs $|\\Omega|/(k(m+n))$.',
    misconception: {
      title: 'Filling missing entries with zeros and running SVD is NOT a valid matrix completion approach.',
      body: `Three structural reasons the naive zero-fill + SVD fails.

First: zero-filling changes the rank. Original $M$ may be rank $k = 5$, but the zero-filled matrix has full rank. SVD on it returns a different low-rank approximation than the true $M$.

Second: SVD has no mechanism to "trust" observed entries more than artificial zeros. The Frobenius objective penalizes errors uniformly. A low-rank fit balances against the fake zeros and does neither well.

Third: zero-filling is biased toward small values. Movie ratings averaging 4 stars pulled toward zero systematically underestimate.

A second misconception: that matrix completion works from any sampling pattern. The Candès-Recht theorem requires low rank, incoherence, AND random sampling. None can be dropped.

A third: that alternating minimization always finds the global optimum. Non-convex; can have local minima. Empirically benign under incoherence.

A fourth: that the rank parameter $k$ can be chosen freely. $k$ is the most important hyperparameter; cross-validation on held-out observed entries is standard.`,
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Set up alternating minimization',
        body: 'True $M = \\mathbf{u}\\mathbf{v}^T$ with $\\mathbf{u} = (1, 2, 3)^T, \\mathbf{v} = (4, 5, 6)^T$. Observe $\\Omega = \\{(1,1), (1,2), (2,1), (2,3), (3,2), (3,3)\\}$ with values $4, 5, 8, 12, 15, 18$. Fit rank $k = 1$. Initialize $V = (1, 1, 1)^T$.',
      },
      {
        title: 'Step 2: Solve for $U$ with $V$ fixed',
        body: 'Each row of $U$ via least-squares. Row 1: $\\min (4 - u_1)^2 + (5 - u_1)^2 \\Rightarrow u_1 = 4.5$. Row 2: $u_2 = 10$. Row 3: $u_3 = 16.5$.',
      },
      {
        title: 'Step 3: Solve for $V$, iterate',
        body: 'With $U = (4.5, 10, 16.5)^T$, solve each $V_j$ via least-squares. Iterate; converges in a few rounds (up to sign/scale ambiguity). Predictions on unobserved entries should match $6, 10, 12$.',
      },
    ],
    problems: [
      {
        id: 'P-12.4a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A recommender system has $M \\in \\mathbb{R}^{10^6 \\times 10^5}$ with $|\\Omega| \\approx 3 \\times 10^7$ ratings (about $0.03\\%$ of entries). Target rank $k = 50$. Can matrix completion succeed?',
        choices: [
          { label: 'A', body: 'The fraction ($0.03\\%$) is too small; matrix completion will fail.' },
          { label: 'B', body: 'Compare $|\\Omega|$ to $k(m + n) = 5.5 \\times 10^7$. Since $|\\Omega| = 3 \\times 10^7 < 5.5 \\times 10^7$, recovery is borderline.' },
          { label: 'C', body: 'Matrix completion always succeeds when $|\\Omega| > 0$.' },
          { label: 'D', body: 'The fraction is irrelevant; $30$ million observations is plenty.' },
          { label: 'E', body: 'Matrix completion requires a fully observed row for each user.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Sample-complexity threshold: $\\sim k(m + n)$ entries. Here $k(m+n) = 5.5 \\times 10^7$; observed $3 \\times 10^7$ is below but in the same order. Recovery possible if data is well-conditioned.',
          trickAnalysis: [
            { choice: 'A', why: 'Confuses low fraction with low absolute count. $30$M observations is large; the fraction alone is not the right measure.' },
            { choice: 'C', why: 'False. Below $|\\Omega| \\sim k(m+n)$, recovery is information-theoretically impossible.' },
            { choice: 'D', why: 'Half right (absolute matters) but does not compare to the threshold.' },
            { choice: 'E', why: 'False. Matrix completion does NOT require any user to have a fully observed row.' },
          ],
        },
      },
      {
        id: 'P-12.4b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A naive engineer fills missing entries with zeros, runs SVD, truncates to rank $k$. The reconstruction is poor. Why?',
        choices: [
          { label: 'A', body: 'SVD is numerically unstable on sparse matrices.' },
          { label: 'B', body: 'Zero-filling changes the matrix rank, and SVD has no mechanism to trust observed entries more than artificial zeros. The Frobenius objective splits fitting capacity between real and fake entries.' },
          { label: 'C', body: 'SVD requires square matrices.' },
          { label: 'D', body: 'Zero-filling introduces non-Gaussian noise violating SVD assumptions.' },
          { label: 'E', body: 'Truncation discards too much information; increasing $k$ would help.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'SVD optimizes Frobenius uniformly across all entries. After zero-filling, SVD fits the artificial zeros as well as the genuine values. The result is a low-rank fit to the zero-filled matrix, NOT the true $M$.',
          trickAnalysis: [
            { choice: 'A', why: 'SVD is numerically stable on sparse matrices (Lanczos and randomized methods handle this). Failure is structural, not numerical.' },
            { choice: 'C', why: 'SVD works on any rectangular matrix. Confuses SVD with eigendecomposition.' },
            { choice: 'D', why: 'SVD makes no noise assumptions. It is a deterministic factorization.' },
            { choice: 'E', why: 'Increasing $k$ would fit the zero-filled matrix MORE accurately including the zeros, making reconstruction WORSE.' },
          ],
        },
      },
      {
        id: 'P-12.4c',
        format: 'multiple-choice',
        difficulty: 3,
        statement: 'Which condition of the Candès-Recht theorem fails for $M = \\mathbf{e}_1 \\mathbf{e}_1^T \\in \\mathbb{R}^{1000 \\times 1000}$ (single nonzero entry)?',
        choices: [
          { label: 'A', body: 'Low-rank condition.' },
          { label: 'B', body: 'Random-sampling condition.' },
          { label: 'C', body: 'Incoherence condition: singular vectors are concentrated entirely on the first standard basis direction.' },
          { label: 'D', body: 'Convexity condition.' },
          { label: 'E', body: 'Boundedness condition.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: '$M = \\mathbf{e}_1 \\mathbf{e}_1^T$ has $\\mathbf{u}_1 = \\mathbf{v}_1 = \\mathbf{e}_1$, maximally concentrated on a single coordinate. Incoherence parameter $\\mu$ becomes as large as $m = 1000$, far exceeding the assumption. Sampling that one entry is essential, but random sampling misses it almost surely.',
          trickAnalysis: [
            { choice: 'A', why: 'Low-rank IS satisfied (rank 1). Low rank alone is insufficient; incoherence is also required.' },
            { choice: 'B', why: 'Random-sampling is about how $\\Omega$ is chosen, not the matrix dimensions.' },
            { choice: 'D', why: 'Nuclear-norm minimization is ALWAYS convex. Failure here is about incoherence.' },
            { choice: 'E', why: 'Candès-Recht has no boundedness requirement; it is scale-invariant.' },
          ],
        },
      },
    ],
  },
};
