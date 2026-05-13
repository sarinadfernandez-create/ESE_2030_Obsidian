import type { Concept } from '../types';

export const scalingAlgorithms: Concept = {
  id: 'scaling-algorithms',
  unitId: 'ch12',
  number: '12.3',
  title: 'Algorithms for Large-Scale SVD',
  blurb: 'Computing the full SVD costs $O(\\min(m,n)^2 \\max(m,n))$. When $m, n$ are in the millions, iterative methods (power iteration, Lanczos, randomized SVD) compute only the top $k$ singular components at vastly reduced cost.',
  tier: 'full',
  learn: {
    overview: `
The textbook SVD algorithm takes $O(\\min(m, n)^2 \\max(m, n))$ floating-point operations and produces the full $\\Sigma, U, V$. For a $1000 \\times 1000$ matrix this is milliseconds; for a $10^7 \\times 10^7$ matrix it is impossible. Yet most applications only need the **top $k$ singular components** for small $k$. The structural insight is that you can compute only what you need at cost roughly $O(kmn)$ — a savings of orders of magnitude when $k \\ll \\min(m, n)$.

The simplest scalable algorithm is **[[iteration|power iteration]]**. To find $\\sigma_1$ and $\\mathbf{v}_1$, start with a random unit vector $\\mathbf{v}^{(0)}$ and iterate
$$\\mathbf{v}^{(t+1)} = \\frac{A^T A \\mathbf{v}^{(t)}}{\\|A^T A \\mathbf{v}^{(t)}\\|}.$$
Convergence rate depends on $\\sigma_2 / \\sigma_1$: each iteration shrinks the orthogonal component by this factor, so $t \\sim \\log(1/\\epsilon) / \\log(\\sigma_1/\\sigma_2)$ iterations achieve error $\\epsilon$. This is the same convergence analysis as for [[dominance-convergence|dominance and convergence]] in Unit 9.

For the top $k$ components, **orthogonal iteration** is the natural extension. Start with $k$ random orthonormal vectors in $V^{(0)} \\in \\mathbb{R}^{n \\times k}$, iterate $V^{(t+1)} = \\text{QR-factor}(A^T A V^{(t)})$. The QR step keeps iterates orthonormal; without it, all $k$ columns collapse to $\\mathbf{v}_1$. **Lanczos bidiagonalization** is the Krylov-subspace cousin that uses the full history of products to build a low-dimensional projection of $A$.

**Randomized SVD** (Halko-Martinsson-Tropp, 2011): (1) draw random Gaussian $\\Omega \\in \\mathbb{R}^{n \\times (k + p)}$ with $p \\approx 10$; (2) form sketch $Y = A\\Omega$; (3) orthonormalize $Y$ via QR to get $Q$; (4) compute $B = Q^T A$; (5) compute SVD of $B$. Total cost: $O((k+p)mn + (k+p)^2 n)$. With high probability,
$$\\|A - QQ^T A\\|_F \\leq (1 + \\epsilon) \\|A - A_k\\|_F.$$
Randomized SVD revolutionized large-scale data analysis: provable near-optimality with minimal cost.

The unifying theme: replace "compute everything, then truncate" with "compute only what we need, never form the full SVD." Every modern library ships randomized SVD or Lanczos as the default for top-$k$ computation.

A more recent class uses **stochastic gradient descent** directly on $A \\approx UV^T$. The objective is non-convex but SGD often finds global optima, and scales to enormous matrices by processing few entries per step. This underpins [[netflix-prize|recommender systems]] and [[matrix-completion|matrix completion]].
    `.trim(),
    definitions: [
      {
        term: 'Power iteration',
        body: '$\\mathbf{v}^{(t+1)} = A^T A \\mathbf{v}^{(t)} / \\|A^T A \\mathbf{v}^{(t)}\\|$. Converges to $\\mathbf{v}_1$ at rate $(\\sigma_2 / \\sigma_1)^t$.',
      },
      {
        term: 'Orthogonal iteration',
        body: 'Block extension: $V^{(t+1)} = \\text{QR}(A^T A V^{(t)})$. Converges to the top-$k$ right singular subspace.',
      },
      {
        term: 'Krylov subspace',
        body: '$\\mathcal{K}_p(M, \\mathbf{b}) = \\mathrm{span}\\{\\mathbf{b}, M\\mathbf{b}, \\ldots, M^{p-1}\\mathbf{b}\\}$. Lanczos projects $A$ onto a small Krylov subspace.',
      },
      {
        term: 'Randomized SVD',
        body: 'An algorithm computing approximate top-$k$ SVD in $O((k+p) mn)$ time: sketch $Y = A\\Omega$, orthonormalize, compute SVD of $Q^T A$. Provably $(1+\\epsilon)$-optimal.',
      },
      {
        term: 'Convergence rate (spectral gap)',
        body: 'For power iteration, the per-iteration contraction factor is $\\sigma_{k+1}/\\sigma_k$. Large gap means fast convergence; clustered values mean slow.',
      },
    ],
    theorems: [
      {
        name: 'Power iteration convergence',
        statement: 'Let $A$ have singular values $\\sigma_1 > \\sigma_2 \\geq \\cdots \\geq 0$. Power iteration on $A^TA$ produces iterates with $\\sin \\angle(\\mathbf{v}^{(t)}, \\mathbf{v}_1) \\leq \\tan \\angle(\\mathbf{v}^{(0)}, \\mathbf{v}_1) \\cdot (\\sigma_2/\\sigma_1)^{2t}$.',
        intuition: 'Decompose the iterate into $\\mathbf{v}_1$-component and orthogonal. $A^TA$ multiplies $\\mathbf{v}_1$-component by $\\sigma_1^2$ and orthogonal by at most $\\sigma_2^2$. After normalization the orthogonal shrinks by $(\\sigma_2/\\sigma_1)^2$ per iteration.',
      },
      {
        name: 'Randomized SVD error bound',
        statement: 'For Gaussian $\\Omega$ with oversampling $p \\geq 2$, $\\mathbb{E}\\|A - QQ^TA\\|_F \\leq \\sqrt{1 + k/(p-1)} \\cdot \\|A - A_k\\|_F$.',
        intuition: 'Randomized SVD is within a constant factor of optimal; oversampling $p$ controls the gap. With $p = 10, k = 100$, factor $\\approx 3.5$; in practice much closer to optimal.',
      },
      {
        name: 'Cost asymmetry between full and truncated SVD',
        statement: 'Full SVD: $O(\\min(m, n)^2 \\max(m, n))$. Truncated rank-$k$ via randomized methods: $O((k+p) \\cdot mn)$. The ratio $\\min(m,n)/k$ is often $10^3$–$10^6$.',
        intuition: 'Full SVD computes ALL singular values, even discarded ones. Truncated does just enough work for the top $k$. The asymmetry is what makes large-scale low-rank approximation feasible.',
      },
    ],
    keyFormulas: [
      '\\mathbf{v}^{(t+1)} = \\frac{A^T A \\mathbf{v}^{(t)}}{\\|A^T A \\mathbf{v}^{(t)}\\|}',
      '\\text{convergence rate} \\sim (\\sigma_{k+1}/\\sigma_k)^{2t}',
      'Y = A \\Omega, \\quad \\Omega \\in \\mathbb{R}^{n \\times (k + p)} \\text{ Gaussian}',
      '\\text{cost: } O((k + p) \\cdot m n)',
      '\\mathbb{E}\\|A - QQ^TA\\|_F \\leq \\sqrt{1 + k/(p-1)} \\cdot \\|A - A_k\\|_F',
    ],
  },
  explore: {
    vizComponent: 'ScalingAlgorithmsViz',
    description: 'Comparative running of power iteration, randomized SVD, and full SVD. Tracks $\\angle(\\mathbf{v}^{(t)}, \\mathbf{v}_1)$ vs iteration with a $\\sigma_2/\\sigma_1$ slider; animates randomized-SVD sketching pipeline; live FLOPs counters.',
    misconception: {
      title: 'Iterative SVD algorithms are NOT just "approximations" of the full SVD; they exploit structure full SVD does not.',
      body: `Students often picture iterative SVD as a cheap, lossy version of full SVD. This misses the structural point.

First: for a $10^7 \\times 10^7$ matrix there is no full SVD to be inferior to. Iterative methods are not just cheaper — they are the only option.

Second: in many applications $A$ is never materialized. It might be sparse, defined implicitly by a kernel, or a product $A = BC$ where the factors are stored but the product is too large. Iterative methods only need matrix-vector products; full SVD needs the whole matrix in memory.

Third: power iteration convergence depends on $\\sigma_2/\\sigma_1$ — a property of the matrix. Matrices with rapid singular value decay are precisely where low-rank approximation is most useful AND iterative methods are fastest.

Fourth: students sometimes try to compare "power iteration vectors" with "full SVD vectors" expecting bit-for-bit agreement. Both are numerical approximations to the same mathematical object.

Fifth: randomized SVD's randomness is not a weakness. Failure probability is $O(e^{-p})$ in oversampling $p$; with $p = 20$ failure is astronomically unlikely.`,
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Step 1: Set up power iteration on a small matrix',
        body: 'Take $A = \\mathrm{diag}(3, 1)$, so $A^TA = \\mathrm{diag}(9, 1)$. Singular values: $\\sigma_1 = 3, \\sigma_2 = 1$, so $\\sigma_2/\\sigma_1 = 1/3$. Initial: $\\mathbf{v}^{(0)} = (1, 1)^T/\\sqrt{2}$.',
      },
      {
        title: 'Step 2: One iteration',
        body: '$A^TA \\mathbf{v}^{(0)} = (9, 1)^T/\\sqrt{2}$, normalized to $(0.994, 0.110)^T$. Angle to $\\mathbf{v}_1 = \\mathbf{e}_1$ dropped from $45°$ to $\\approx 6.3°$. The $\\mathbf{e}_2$ component shrunk by factor $(1/3)^2 = 1/9$.',
      },
      {
        title: 'Step 3: Convergence rate',
        body: 'To reach $10^{-16}$ precision: $t \\geq 16 / \\log_{10}(9) \\approx 17$ iterations. For $\\sigma_2/\\sigma_1 = 0.99$: $(0.99)^{2t} \\leq 10^{-16}$ requires $t \\approx 1840$. The spectral gap is everything.',
      },
    ],
    problems: [
      {
        id: 'P-12.3a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A scientist runs power iteration on $A^TA$. Matrix $A$ has $\\sigma_1 = 100, \\sigma_2 = 95, \\sigma_3 = 50, \\sigma_4 = 1$. Convergence is slow. What is the diagnosis?',
        choices: [
          { label: 'A', body: 'Power iteration converged to a local optimum; restart with a different initial vector.' },
          { label: 'B', body: 'Per-iteration shrinkage is $(\\sigma_2/\\sigma_1)^2 = 0.9025$. Geometric but slow. Switch to Lanczos or randomized SVD.' },
          { label: 'C', body: '$A^TA$ has clustered top eigenvalues, so $\\mathbf{v}_1$ is mathematically undefined.' },
          { label: 'D', body: 'Power iteration converges to $\\mathbf{v}_2$ instead of $\\mathbf{v}_1$ when the gap is small.' },
          { label: 'E', body: 'Power iteration failed; switch to QR factorization.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Contraction factor is $(\\sigma_2/\\sigma_1)^2 = 0.9025$. To shrink by $10^{-6}$: $\\sim 134$ iterations. Slow but convergent. Lanczos or randomized SVD avoid this dependence.',
          trickAnalysis: [
            { choice: 'A', why: 'Power iteration has no local optima; converges globally from generic start.' },
            { choice: 'C', why: 'Top singular value $100$ is unique, so $\\mathbf{v}_1$ is well-defined. Slow convergence ≠ undefined limit.' },
            { choice: 'D', why: 'Power iteration always converges to the dominant singular vector when $\\sigma_1 > \\sigma_2$ strictly.' },
            { choice: 'E', why: 'QR factorization is a decomposition, not an eigenvector method. (The QR ALGORITHM is different.)' },
          ],
        },
      },
      {
        id: 'P-12.3b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A scientist needs the top-$50$ singular components of a sparse matrix $A \\in \\mathbb{R}^{10^6 \\times 10^6}$ with $10^7$ nonzeros. Which algorithm is most appropriate?',
        choices: [
          { label: 'A', body: 'Full SVD via LAPACK.' },
          { label: 'B', body: 'Randomized SVD with $k = 50, p = 10$.' },
          { label: 'C', body: 'Power iteration with $50$ random starting vectors in parallel.' },
          { label: 'D', body: 'Direct eigendecomposition of $A^TA$, then square roots.' },
          { label: 'E', body: 'No efficient algorithm exists.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Full SVD at this scale is infeasible ($O(10^{18})$ ops). Randomized SVD needs only matrix-vector products (sparse-friendly) plus a small dense SVD: total $\\sim 10^9$ ops. Many orders of magnitude faster.',
          trickAnalysis: [
            { choice: 'A', why: 'Full SVD infeasible at this scale and discards sparsity.' },
            { choice: 'C', why: '50 independent power iterations all converge to the SAME $\\mathbf{v}_1$ unless orthogonalization is added.' },
            { choice: 'D', why: 'Forming $A^TA$ destroys sparsity (product is generally dense), needs $10^{17}$ ops, and squares the condition number.' },
            { choice: 'E', why: 'Iterative algorithms make this feasible.' },
          ],
        },
      },
      {
        id: 'P-12.3c',
        format: 'multiple-choice',
        difficulty: 3,
        statement: 'In randomized SVD with target rank $k$ and oversampling $p$, the error bound is $\\mathbb{E}\\|A - QQ^TA\\|_F \\leq C(k, p) \\cdot \\|A - A_k\\|_F$. What is the effect of increasing $p$ from $5$ to $20$?',
        choices: [
          { label: 'A', body: 'Accuracy improves at the cost of running more iterations of an inner loop.' },
          { label: 'B', body: 'Accuracy improves at the cost of slightly larger matrix-matrix products ($A\\Omega$ is wider).' },
          { label: 'C', body: 'Accuracy stays the same; $p$ only controls failure probability.' },
          { label: 'D', body: 'Accuracy improves AND cost decreases.' },
          { label: 'E', body: 'Accuracy degrades because larger sketches introduce more noise.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: '$C(k, p) = \\sqrt{1 + k/(p-1)}$. Increasing $p$ shrinks $C$. Cost: $\\Omega$ has $k + p$ columns instead of $k$. Modest cost increase, significant accuracy gain.',
          trickAnalysis: [
            { choice: 'A', why: 'Randomized SVD has no inner loop. $\\Omega$ sampled once, $Y$ computed once.' },
            { choice: 'C', why: 'Both expected error AND failure probability depend on $p$.' },
            { choice: 'D', why: 'Larger $p$ INCREASES cost (wider matrix products, larger orthogonalization).' },
            { choice: 'E', why: 'More samples AVERAGE OUT noise rather than add it. Accuracy improves with $p$.' },
          ],
        },
      },
    ],
  },
};
