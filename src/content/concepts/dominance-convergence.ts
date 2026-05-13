import type { Concept } from '../types';

export const dominanceConvergence: Concept = {
  id: 'dominance-convergence',
  unitId: 'ch9',
  number: '9.2',
  title: 'Dominance & Convergence',
  blurb: 'When one eigenvalue beats all others in magnitude, iteration aligns with its eigenvector.',
  tier: 'full',

  learn: {
    overview: `
The eigencomponent decomposition $\\mathbf{x}_k = \\sum_i c_i \\lambda_i^k \\mathbf{v}_i$ from [[iteration|linear iteration]] hides a beautiful asymptotic structure: when one eigenvalue strictly dominates the others in magnitude, that single eigencomponent eventually swallows the rest. This is the engine behind the power method, the structural backbone of Markov chains, and the conceptual content of "long-term behavior."

Suppose $|\\lambda_1| > |\\lambda_2| \\geq |\\lambda_3| \\geq \\cdots \\geq |\\lambda_n|$, and suppose the starting vector has $c_1 \\neq 0$ in the eigenbasis. Then
$$\\mathbf{x}_k = c_1 \\lambda_1^k \\mathbf{v}_1 + c_2 \\lambda_2^k \\mathbf{v}_2 + \\cdots = c_1 \\lambda_1^k \\left[ \\mathbf{v}_1 + \\frac{c_2}{c_1} \\left( \\frac{\\lambda_2}{\\lambda_1} \\right)^k \\mathbf{v}_2 + \\cdots \\right].$$
The bracketed term has the dominant piece $\\mathbf{v}_1$ plus correction terms decaying as $(\\lambda_2/\\lambda_1)^k$. Since $|\\lambda_2/\\lambda_1| < 1$, those corrections vanish. The direction of $\\mathbf{x}_k$ converges to $\\pm \\mathbf{v}_1$ (with sign depending on $\\mathrm{sign}(\\lambda_1^k c_1)$).

The convergence rate is governed entirely by the *eigenvalue ratio* $|\\lambda_2/\\lambda_1|$. A smaller ratio means faster convergence: the second eigencomponent dies off faster. Two matrices with eigenvalues $\\{10, 9, 1\\}$ vs $\\{10, 2, 1\\}$ illustrate this clearly. Both have dominant eigenvalue $10$, but the first has ratio $9/10 = 0.9$ and the second has ratio $2/10 = 0.2$. After $k$ steps, the correction in the first matrix has shrunk by a factor of $0.9^k$ (slowly), while in the second it has shrunk by $0.2^k$ (rapidly). Power iteration on the second matrix converges roughly $\\log(0.9)/\\log(0.2) \\approx 6.5$ times faster per step.

This setup *requires* a strict dominance — a unique largest-magnitude eigenvalue. When two eigenvalues tie in magnitude (such as a complex-conjugate pair $a \\pm bi$ both having magnitude $\\sqrt{a^2 + b^2}$, or a sign-flipped pair $r$ and $-r$), the iterates don't settle on a single direction; they rotate or oscillate in the plane spanned by both dominant eigenvectors. This is why generic real matrices with complex eigenvalues do not exhibit simple direction-convergence: the dominant complex pair generates spiral or rotation behavior in 2D.

The *power method* exploits this directly: normalize $\\mathbf{x}_k$ at each step (divide by $\\|\\mathbf{x}_k\\|$ or by the largest entry) to get a sequence that converges to a unit eigenvector for the dominant eigenvalue. This is the simplest numerical algorithm for computing eigenvectors and underpins [[pagerank|PageRank]] and many scaling-stage eigenvalue computations. The same convergence rate $|\\lambda_2/\\lambda_1|$ controls how many iterations are needed for a desired accuracy.

The deeper picture: when $A$ is [[perron-frobenius|positive in every entry]], the Perron-Frobenius theorem *guarantees* a unique real dominant eigenvalue with a positive eigenvector, which is why long-term behavior of population models, Markov chains, and PageRank-style iterations is always well-defined and converges to a recognizable equilibrium. When $A$ is [[symmetric-spectra|symmetric]], all eigenvalues are real and the dominant one is unambiguously the largest (or most negative, in magnitude).
    `.trim(),

    definitions: [
      {
        term: 'Dominant eigenvalue',
        body: 'An eigenvalue $\\lambda_1$ of $A$ is *dominant* if $|\\lambda_1| > |\\lambda_i|$ for all other eigenvalues $\\lambda_i$. Strict inequality. If two eigenvalues tie in magnitude, neither is dominant in this sense.',
      },
      {
        term: 'Convergence ratio',
        body: 'When $\\lambda_1$ is dominant, the *convergence ratio* of power iteration is $r = |\\lambda_2 / \\lambda_1|$, where $\\lambda_2$ is the second-largest magnitude eigenvalue. Smaller $r$ means faster convergence.',
      },
      {
        term: 'Power method',
        body: 'The iterative algorithm $\\mathbf{x}_{k+1} = A \\mathbf{x}_k / \\|A \\mathbf{x}_k\\|$. When $A$ has a unique dominant eigenvalue, $\\mathbf{x}_k$ converges to a unit eigenvector $\\mathbf{v}_1$, and the Rayleigh quotient $\\mathbf{x}_k^T A \\mathbf{x}_k$ converges to $\\lambda_1$.',
      },
      {
        term: 'Generic initial condition',
        body: 'A starting vector $\\mathbf{x}_0$ with nonzero component along every eigenvector. For randomly chosen $\\mathbf{x}_0$, this holds with probability $1$. Special starting vectors with $c_1 = 0$ fail the dominance argument.',
      },
    ],

    theorems: [
      {
        name: 'Direction convergence under strict dominance',
        statement: 'If $A$ is diagonalizable with strict dominance $|\\lambda_1| > |\\lambda_2| \\geq \\cdots$, and $c_1 \\neq 0$, then $\\mathbf{x}_k / \\|\\mathbf{x}_k\\| \\to \\pm \\mathbf{v}_1 / \\|\\mathbf{v}_1\\|$.',
        intuition: 'The dominant eigencomponent grows fastest, so its share of the total length goes to $1$. After normalization, every other component has been driven to zero relative to it. The $\\pm$ comes from the sign of $\\lambda_1^k$ at the current step, which may flip if $\\lambda_1 < 0$.',
      },
      {
        name: 'Rate of convergence',
        statement: 'Under the conditions of the previous theorem, the angular distance from $\\mathbf{x}_k$ to the line spanned by $\\mathbf{v}_1$ shrinks like $|\\lambda_2/\\lambda_1|^k$.',
        intuition: 'The leading correction term is $(\\lambda_2/\\lambda_1)^k \\cdot \\mathbf{v}_2$. After many steps this correction is tiny; the smaller $|\\lambda_2/\\lambda_1|$ is, the faster it dies. A spectral gap (large gap between $|\\lambda_1|$ and $|\\lambda_2|$) gives rapid convergence; a small gap gives slow, almost-cant-tell-its-converging behavior.',
      },
      {
        name: 'Ties prevent convergence',
        statement: 'If two distinct eigenvalues share the maximum magnitude, $\\mathbf{x}_k / \\|\\mathbf{x}_k\\|$ generically does not converge.',
        intuition: 'A complex-conjugate pair at the top of the spectrum produces spiral behavior in the 2D eigenspace they span. A real pair $\\pm r$ produces sign-alternating oscillation in a plane. In either case, the iterate cycles among directions rather than settling. The power method literally cannot converge under tie conditions; one must use shifts or other tricks.',
      },
    ],

    keyFormulas: [
      '\\mathbf{x}_k = c_1 \\lambda_1^k \\mathbf{v}_1 \\left[ 1 + O\\!\\left( \\left| \\frac{\\lambda_2}{\\lambda_1} \\right|^k \\right) \\right]',
      '\\text{convergence ratio} = r = \\left| \\frac{\\lambda_2}{\\lambda_1} \\right|',
      '\\mathbf{x}_{k+1} = \\frac{A \\mathbf{x}_k}{\\|A \\mathbf{x}_k\\|} \\quad \\text{(power method)}',
      '\\lambda_1 \\approx \\mathbf{x}_k^T A \\mathbf{x}_k \\quad \\text{(Rayleigh quotient, once converged)}',
    ],
  },

  explore: {
    vizComponent: 'DominanceConvergenceViz',
    description: 'A side-by-side 2D playground comparing power iteration on two user-chosen matrices. The user can drag the eigenvalue ratio slider (which controls $\\lambda_2/\\lambda_1$ while keeping $\\lambda_1$ fixed) and watch the angular convergence to $\\mathbf{v}_1$ in real time. A log-scale plot tracks $\\sin(\\theta_k)$ where $\\theta_k$ is the angle between $\\mathbf{x}_k$ and the dominant eigenline. A "tie" mode forces $|\\lambda_1| = |\\lambda_2|$ and shows the resulting non-convergence (spiral or oscillation).',
    misconception: {
      title: 'Confusing "dominant eigenvalue exists" with "power iteration converges" — and assuming any starting vector works',
      body: `Convergence of the power method requires *three* conditions, and students routinely forget at least one. First, the matrix must be diagonalizable (or at least the dominant eigenspace must capture enough structure — for non-diagonalizable cases see [[jordan-form|Jordan form]]). Second, there must be a *strict* spectral gap: $|\\lambda_1| > |\\lambda_2|$. A repeated dominant eigenvalue (say $\\lambda_1 = \\lambda_2 = 5$) is fine if those eigenvectors span a 2D dominant eigenspace; the iterate converges to *some* direction in that plane depending on $\\mathbf{x}_0$. But a *complex pair* tied in magnitude produces rotation, not convergence. Third, the initial condition must have $c_1 \\neq 0$ in the eigenexpansion. If $\\mathbf{x}_0$ happens to land exactly in $\\mathrm{span}\\{\\mathbf{v}_2, \\ldots, \\mathbf{v}_n\\}$ — for instance, by being orthogonal to $\\mathbf{v}_1$ in a symmetric matrix — the power method converges to the dominant eigenvector of the *restricted* problem, namely $\\mathbf{v}_2$.

A second misconception: confusing "the dominant eigenvalue determines the rate" with "the dominant eigenvalue determines the convergence ratio." The *rate* of decay of the residual error is governed by $|\\lambda_2/\\lambda_1|$, not by $|\\lambda_1|$ alone. Two matrices with the same dominant eigenvalue can have wildly different power-method speeds: $\\{10, 9, 1\\}$ vs $\\{10, 2, 1\\}$ converge at ratios $0.9$ and $0.2$ respectively. A spectral gap close to $1$ means barely-distinguishable dominance and painfully slow convergence.

A third trap: assuming convergence of $\\mathbf{x}_k$ itself rather than its direction. When $|\\lambda_1| > 1$, $\\mathbf{x}_k$ blows up in magnitude; when $|\\lambda_1| < 1$, it shrinks to zero. The *direction* $\\mathbf{x}_k/\\|\\mathbf{x}_k\\|$ is what converges. This is why the power method always includes a normalization step.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: comparing convergence rates of two matrices',
        body: 'Matrix $A$ has eigenvalues $10, 9, 1$. Matrix $B$ has eigenvalues $10, 2, 1$. Both have dominant eigenvalue $\\lambda_1 = 10$. We want to know which matrix the power method converges on faster.',
      },
      {
        title: 'Compute the convergence ratios',
        body: 'For $A$: $r_A = |\\lambda_2 / \\lambda_1| = 9/10 = 0.9$. For $B$: $r_B = 2/10 = 0.2$. Smaller is faster.',
      },
      {
        title: 'Interpret',
        body: 'Matrix $B$ converges much faster. To shrink the residual error by a factor of $100$, matrix $A$ needs about $\\log(0.01)/\\log(0.9) \\approx 44$ iterations; matrix $B$ needs about $\\log(0.01)/\\log(0.2) \\approx 2.9$, so $3$ iterations. The dominant eigenvalue is identical, but the spectral *gap* differs by a factor of $4.5$, leading to dramatic differences in speed. This is why a large spectral gap is so prized in numerical eigenvalue computations.',
      },
    ],

    problems: [
      {
        id: 'P-9.2a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A matrix $B$ has eigenvalues $\\lambda_1 = 3$, $\\lambda_2 = -4$, $\\lambda_3 = 0$, and $\\lambda_{4,5} = 1 \\pm 2i$. Which eigenvalue is dominant for analyzing the convergence behavior of the power iteration $\\mathbf{x}_k = B^k \\mathbf{x}_0$?',
        choices: [
          { label: 'A', body: '$\\lambda_1 = 3$' },
          { label: 'B', body: '$\\lambda_2 = -4$' },
          { label: 'C', body: '$\\lambda_3 = 0$' },
          { label: 'D', body: '$\\lambda_{4,5} = 1 \\pm 2i$' },
          { label: 'E', body: 'There is not necessarily a dominant eigenvalue' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'Magnitudes: $|\\lambda_1| = 3$, $|\\lambda_2| = 4$, $|\\lambda_3| = 0$, $|\\lambda_{4,5}| = \\sqrt{1 + 4} = \\sqrt{5} \\approx 2.24$. The maximum is $|\\lambda_2| = 4$, so $\\lambda_2 = -4$ is dominant. The negative sign means each step of the power iteration along $\\mathbf{v}_2$ multiplies by $-4$, producing sign-alternating growth of magnitude $4^k$. Without normalization the iterate blows up; with normalization the direction $\\mathbf{x}_k / \\|\\mathbf{x}_k\\|$ converges to $\\pm \\mathbf{v}_2$, with sign flipping each step.',
          partialCredit: 'Choice D recognizes that complex eigenvalues are real participants in the spectrum and have well-defined magnitudes, but undervalues the negative real eigenvalue. The correct hierarchy by magnitude is $4 > 3 > \\sqrt{5} > 0$.',
          trickAnalysis: [
            { choice: 'A', why: 'Treats "dominant" as "largest positive value" rather than "largest magnitude." A common reflex when negative eigenvalues are present.' },
            { choice: 'C', why: '$\\lambda = 0$ contributes nothing to iteration ($0^k = 0$); it is the most-decayed eigencomponent, not the most-dominant.' },
            { choice: 'D', why: 'The complex pair has magnitude $\\sqrt{5} \\approx 2.24$, which is smaller than $4$. Often picked by students who think complex eigenvalues automatically dominate or who confuse the magnitude of $1 + 2i$ with the larger value $5$ (which is $|1 + 2i|^2$).' },
            { choice: 'E', why: 'A dominant eigenvalue exists here: $-4$ has strictly larger magnitude than every other eigenvalue. "No dominant eigenvalue" would apply only if two eigenvalues tied in magnitude at the top.' },
          ],
        },
      },
      {
        id: 'P-9.2b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A $3 \\times 3$ matrix $A$ has eigenvalues $\\lambda_1 = 0.6$, $\\lambda_2 = -0.8$, $\\lambda_3 = 0.4$, with corresponding linearly independent eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3$. Consider $\\mathbf{x}_k = A^k \\mathbf{x}_0$ where $\\mathbf{x}_0 = 2\\mathbf{v}_1 + 3\\mathbf{v}_2 + 5\\mathbf{v}_3$. Which statement best describes the long-term behavior of $\\mathbf{x}_k$ as $k \\to \\infty$?',
        choices: [
          { label: 'A', body: 'The sequence converges to zero monotonically.' },
          { label: 'B', body: 'The sequence converges toward the direction of $\\mathbf{v}_1$, since $\\lambda_1$ is dominant.' },
          { label: 'C', body: 'The sequence grows without bound due to positive eigenvalues.' },
          { label: 'D', body: 'The sequence converges to zero, aligning along $\\mathbf{v}_2$ with oscillating sign.' },
          { label: 'E', body: 'All eigenvalues are real and distinct, so each eigencomponent of $\\mathbf{x}_k$ acts independently of the others.' },
        ],
        correctAnswer: 'D',
        solution: {
          explanation: 'All $|\\lambda_i| < 1$, so $\\mathbf{x}_k \\to \\mathbf{0}$. The dominant *magnitude* is $|\\lambda_2| = 0.8$, achieved by $\\lambda_2 = -0.8$. The eigencomponents decay as $\\lambda_i^k$: $\\lambda_1^k = 0.6^k$ (positive, decaying), $\\lambda_2^k = (-0.8)^k$ (oscillating sign, decaying slowest), $\\lambda_3^k = 0.4^k$ (positive, decaying fastest). The $\\mathbf{v}_2$ component dominates the other components in size for large $k$ (decays slowest), so the iterate approaches $\\mathbf{0}$ aligned along the $\\mathbf{v}_2$ direction, flipping sign each step due to the negative eigenvalue.',
          partialCredit: 'Choice E is a true statement about decoupled dynamics under diagonalization, but it does not directly answer the question about long-term behavior; it sidesteps the question rather than addressing it.',
          trickAnalysis: [
            { choice: 'A', why: 'Misses sign oscillation. The negative dominant eigenvalue produces sign-flipping at every step; convergence to zero happens but is not monotonic.' },
            { choice: 'B', why: 'Picks the largest *positive* eigenvalue rather than the largest *magnitude*. Misidentifies the dominant eigencomponent.' },
            { choice: 'C', why: 'All $|\\lambda_i| < 1$, so the iteration *decays*, it does not grow. The sign of an eigenvalue does not affect whether the iteration grows or decays; only $|\\lambda|$ does.' },
            { choice: 'E', why: 'A true side fact about diagonalizability, but it does not describe the long-term behavior. Surface-credible but conceptually evasive.' },
          ],
        },
      },
      {
        id: 'P-9.2c',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Two diagonalizable matrices have the following eigenvalue structures. Matrix $A$: eigenvalues $10, 9, 1$. Matrix $B$: eigenvalues $10, 2, 1$. The power method is applied to each with a generic initial condition (nonzero component along every eigenvector). Which statement about convergence rates is most accurate?',
        choices: [
          { label: 'A', body: 'Both converge at the same rate.' },
          { label: 'B', body: 'Matrix $A$ converges faster.' },
          { label: 'C', body: 'Matrix $B$ converges faster.' },
          { label: 'D', body: 'The convergence rate depends on the initial condition, not on the eigenvalues.' },
          { label: 'E', body: 'The power method depends on Perron-Frobenius positivity and may not apply here.' },
        ],
        correctAnswer: 'C',
        solution: {
          explanation: 'The convergence ratio of the power method is $r = |\\lambda_2 / \\lambda_1|$. For matrix $A$: $r_A = 9/10 = 0.9$. For matrix $B$: $r_B = 2/10 = 0.2$. Matrix $B$ has a much smaller ratio, so its non-dominant eigencomponents decay much faster relative to the dominant one. After $k$ steps, the relative error in $A$ has shrunk by $0.9^k$, while in $B$ it has shrunk by $0.2^k$. To shrink the error by a factor of $100$: matrix $A$ needs $\\sim 44$ iterations, matrix $B$ needs $\\sim 3$. The dominant eigenvalue is the same ($10$); only the *gap* differs, and the gap is what controls speed.',
          trickAnalysis: [
            { choice: 'A', why: 'Confuses "same dominant eigenvalue" with "same convergence rate." The dominant eigenvalue determines the long-term direction, but the ratio to the second-largest determines how fast you get there.' },
            { choice: 'B', why: 'Reverses the comparison. Larger second eigenvalue means slower convergence; matrix $A$ has $\\lambda_2 = 9$ (close to $\\lambda_1 = 10$), which is the slow case.' },
            { choice: 'D', why: 'Initial conditions affect only the constants in the eigenexpansion, not the convergence rate. As long as $c_1 \\neq 0$, the rate is $|\\lambda_2 / \\lambda_1|$ regardless of $\\mathbf{x}_0$.' },
            { choice: 'E', why: 'Perron-Frobenius is sufficient but not necessary for power-method convergence. The power method works whenever there is a strict dominant eigenvalue, whether or not the matrix has positive entries.' },
          ],
        },
      },
    ],
  },
};
