import type { Concept } from '../types';

export const iteration: Concept = {
  id: 'iteration',
  unitId: 'ch9',
  number: '9.1',
  title: 'Linear Iteration',
  blurb: 'Repeated application of a linear map. The long-term behavior is governed by the spectrum.',
  tier: 'full',

  learn: {
    overview: `
A *linear iterative system* is the simplest dynamical system one can write down: pick a square matrix $A$, pick a starting vector $\\mathbf{x}_0$, and define $\\mathbf{x}_{k+1} = A \\mathbf{x}_k$. Everything that follows from a single rule like this — population dynamics, the random walk on a graph, the power method, Markov chains — sits under one umbrella. The whole subject is about *what happens as $k$ grows*.

The closed form is immediate: $\\mathbf{x}_k = A^k \\mathbf{x}_0$. The question is what $A^k$ does to a generic vector for large $k$. Computing $A^k$ directly is hopeless beyond tiny matrices, but the [[eigenvectors|eigenvectors]] of $A$ make the problem trivial: if $A \\mathbf{v}_i = \\lambda_i \\mathbf{v}_i$, then $A^k \\mathbf{v}_i = \\lambda_i^k \\mathbf{v}_i$. The geometric content is that *eigenvectors are the invariant directions of iteration*, and the eigenvalues are the per-step scaling factors along those directions.

When $A$ is [[simple-diagonalization|diagonalizable]] with eigenbasis $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_n\\}$, expand $\\mathbf{x}_0 = c_1 \\mathbf{v}_1 + \\cdots + c_n \\mathbf{v}_n$. Then
$$\\mathbf{x}_k = c_1 \\lambda_1^k \\mathbf{v}_1 + c_2 \\lambda_2^k \\mathbf{v}_2 + \\cdots + c_n \\lambda_n^k \\mathbf{v}_n.$$
Each eigencomponent evolves *independently*. The future is just the sum of $n$ decoupled scalar iterations $c_i \\lambda_i^k$. Whether the whole thing grows, shrinks, oscillates, or stabilizes depends entirely on whether each $|\\lambda_i|$ is bigger than, less than, or equal to $1$.

The single number that captures the worst-case (largest) growth rate is the *spectral radius*
$$\\rho(A) = \\max_i |\\lambda_i|.$$
This is taken over *all* eigenvalues, real and complex. For a complex eigenvalue $\\lambda = a + bi$, the magnitude is $|\\lambda| = \\sqrt{a^2 + b^2}$. A real eigenvalue of $-3$ has magnitude $3$, so it dominates a complex pair $1 \\pm 2i$ which has magnitude $\\sqrt{5} \\approx 2.24$. Sign and complex phase determine *whether* the iteration oscillates; only magnitude determines whether it grows or decays.

The spectral radius is the dividing line: if $\\rho(A) < 1$, every iteration decays to zero; if $\\rho(A) > 1$, generic initial conditions blow up; if $\\rho(A) = 1$, the behavior on that boundary is delicate and depends on whether the dominant eigenvalue is real, complex, or repeated. This last case is exactly the Markov chain regime, where the dominant eigenvalue is $1$ and the iteration drives every starting distribution toward a single fixed [[consensus|stationary distribution]].

The dichotomy between "shrinks" and "grows" is the conceptual entry point. Refining "grows" into "grows in a specific direction with a specific rate" is the subject of [[dominance-convergence|dominance and convergence]]; the special structure when $A$ has positive entries is [[perron-frobenius|Perron-Frobenius]]; the special structure when $A$ is symmetric is the [[symmetric-spectra|spectral theorem]].
    `.trim(),

    definitions: [
      {
        term: 'Linear iterative system',
        body: 'A discrete-time dynamical system of the form $\\mathbf{x}_{k+1} = A \\mathbf{x}_k$ for some fixed square matrix $A$. The closed-form solution is $\\mathbf{x}_k = A^k \\mathbf{x}_0$.',
      },
      {
        term: 'Spectral radius',
        body: 'The spectral radius of $A$ is $\\rho(A) = \\max_i |\\lambda_i|$, where the maximum is over all eigenvalues of $A$, including complex ones. For complex $\\lambda = a + bi$, $|\\lambda| = \\sqrt{a^2 + b^2}$.',
      },
      {
        term: 'Eigencomponent decomposition',
        body: 'When $A$ is diagonalizable, expanding $\\mathbf{x}_0$ in the eigenbasis as $\\mathbf{x}_0 = \\sum_i c_i \\mathbf{v}_i$ gives $\\mathbf{x}_k = \\sum_i c_i \\lambda_i^k \\mathbf{v}_i$. Each eigencomponent evolves independently.',
      },
      {
        term: 'Stable iteration',
        body: 'An iteration $\\mathbf{x}_{k+1} = A \\mathbf{x}_k$ is *stable* (every starting point decays to zero) iff $\\rho(A) < 1$. This is the discrete-time analog of all eigenvalues having negative real part.',
      },
    ],

    theorems: [
      {
        name: 'Diagonal form of iteration',
        statement: 'If $A = V \\Lambda V^{-1}$ with $\\Lambda = \\mathrm{diag}(\\lambda_1, \\ldots, \\lambda_n)$, then $A^k = V \\Lambda^k V^{-1}$ where $\\Lambda^k = \\mathrm{diag}(\\lambda_1^k, \\ldots, \\lambda_n^k)$.',
        intuition: 'Diagonalization rewrites the iteration in coordinates where $A$ acts independently on each axis. In those coordinates raising to the $k$-th power is trivial: each coordinate gets multiplied by its eigenvalue $k$ times. Undoing the coordinate change ($V$ on the left) reassembles the answer in standard coordinates. The whole subject of long-term behavior reduces to "what does $\\lambda^k$ do" run $n$ times in parallel.',
      },
      {
        name: 'Spectral radius governs stability',
        statement: 'For any matrix $A$: $A^k \\to 0$ entrywise iff $\\rho(A) < 1$. If $\\rho(A) > 1$, then $\\|A^k\\| \\to \\infty$.',
        intuition: 'Every component of $\\mathbf{x}_k$ is bounded above by $C \\cdot \\rho(A)^k$ for some constant $C$ depending on initial data. If the dominant scaling factor is below $1$, exponential decay wins. If it exceeds $1$, exponential growth wins. The borderline case $\\rho(A) = 1$ is exactly where stationary distributions live.',
      },
      {
        name: 'Magnitude, not sign or phase, sets growth',
        statement: 'The growth rate of $|\\lambda^k|$ depends only on $|\\lambda|$. Sign flips and complex phase produce oscillation, not growth.',
        intuition: 'A real eigenvalue $-2$ and a complex pair $1.9 \\pm 0.5i$ (with magnitude $\\approx 1.96$) both grow at roughly the same rate. The first oscillates between positive and negative sign at every step; the second rotates around the origin in the complex plane. Both blow up. When comparing eigenvalues for dominance, never compare real parts alone; compare *moduli*.',
      },
    ],

    keyFormulas: [
      'A^k \\mathbf{x}_0 = \\sum_i c_i \\lambda_i^k \\mathbf{v}_i \\quad \\text{when } \\mathbf{x}_0 = \\sum_i c_i \\mathbf{v}_i',
      '\\rho(A) = \\max_i |\\lambda_i|',
      '|\\lambda|^k \\text{ grows} \\iff |\\lambda| > 1; \\quad |\\lambda|^k \\text{ decays} \\iff |\\lambda| < 1',
      '\\Lambda^k = \\mathrm{diag}(\\lambda_1^k, \\ldots, \\lambda_n^k)',
    ],
  },

  explore: {
    vizComponent: 'IterationViz',
    description: 'A 2D iteration playground. The user picks a $2 \\times 2$ matrix $A$ from presets (contraction, rotation-and-scale, saddle, Markov, identity-rotation) or by entering entries; the viz shows the eigenvectors as fixed rays from the origin, then animates a chosen starting vector $\\mathbf{x}_0$ through iterations $\\mathbf{x}_0, \\mathbf{x}_1 = A\\mathbf{x}_0, \\mathbf{x}_2 = A^2 \\mathbf{x}_0, \\ldots$ The eigenvalues display below with their magnitudes highlighted, and a sidebar tracks $\\|\\mathbf{x}_k\\|$ on a log scale. Reduced motion replaces the animation with discrete dots placed at each iterate.',
    misconception: {
      title: 'Confusing "dominant by real part" with "dominant by magnitude" — and the sign-versus-magnitude trap',
      body: `The single biggest source of error in iteration problems is mixing up *magnitude* with *value*. A matrix with eigenvalues $\\lambda_1 = 3$ and $\\lambda_2 = -4$ has dominant eigenvalue $\\lambda_2 = -4$, because $|-4| = 4 > 3 = |3|$, even though many students instinctively pick $\\lambda_1 = 3$ as "the bigger one." The negative sign produces sign-alternating oscillation in the dominant component but does not reduce its growth rate. The same trap appears with complex eigenvalues: a real eigenvalue $\\lambda = -3$ dominates a complex pair $\\lambda = 1 \\pm 2i$ (magnitude $\\sqrt{5} \\approx 2.24$), again counterintuitively.

A second trap: assuming that if all eigenvalues are less than $1$ in *value*, the iteration decays. Eigenvalues $\\lambda_1 = 0.6, \\lambda_2 = -0.8, \\lambda_3 = 0.4$ are all less than $1$ in value but $|\\lambda_2| = 0.8$ is the dominant magnitude. The iteration decays (since $\\rho(A) = 0.8 < 1$), but it decays *along the direction $\\mathbf{v}_2$ with oscillating sign*, not monotonically toward the origin. The eigencomponent attached to $\\mathbf{v}_2$ flips sign at every step.

A third trap: assuming the eigenvalue with the largest *absolute value* is always strictly larger than the others. When there is a *tie* in magnitude (such as a complex-conjugate pair, or a real-and-its-negative pair like $3$ and $-3$), there is no single dominant eigenvalue and the long-term behavior involves both. The power method only converges to a single direction when there is a *unique* dominant eigenvalue in magnitude; ties produce circulating, not converging, behavior. The clean Perron-Frobenius statement — guaranteed unique real positive dominant eigenvalue — is precisely what makes positive matrices special.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: compute the spectral radius from a mixed spectrum',
        body: 'A $4 \\times 4$ matrix has eigenvalues $\\lambda_1 = 2$, $\\lambda_2 = -3$, $\\lambda_3 = 1 + 2i$, $\\lambda_4 = 1 - 2i$. To find $\\rho(A)$ we need the largest magnitude, not the largest value. Magnitudes are $|2| = 2$, $|-3| = 3$, $|1 + 2i| = \\sqrt{1^2 + 2^2} = \\sqrt{5} \\approx 2.236$, $|1 - 2i| = \\sqrt{5}$.',
      },
      {
        title: 'Take the max',
        body: 'The maximum is $3$, achieved by $\\lambda_2 = -3$. So $\\rho(A) = 3$. The dominant eigenvalue is $\\lambda_2$, which is real and negative, so iteration along $\\mathbf{v}_2$ grows by a factor of $3$ at every step *and* flips sign at every step. The complex pair contributes a slower rotation at radius $\\sqrt{5}^k$, dominated by $\\mathbf{v}_2$.',
      },
      {
        title: 'Interpret',
        body: 'Since $\\rho(A) = 3 > 1$, a generic initial vector blows up. The growth direction is $\\mathbf{v}_2$, with sign reversal each step. If we modified $A$ by dividing by $3$, the new spectral radius would be $1$, and the iteration would settle into oscillatory neutral behavior on a 2D surface (one direction sign-flipping, the other rotating). Dividing by anything larger than $3$ would produce decay.',
      },
    ],

    problems: [
      {
        id: 'P-9.1a',
        format: 'multiple-choice',
        difficulty: 1,
        statement: 'A $4 \\times 4$ matrix $A$ has eigenvalues $\\lambda_1 = 2$, $\\lambda_2 = -3$, $\\lambda_3 = 1 + 2i$, $\\lambda_4 = 1 - 2i$. What is the spectral radius $\\rho(A)$?',
        choices: [
          { label: 'A', body: '$\\rho(A) = \\sqrt{3}$' },
          { label: 'B', body: '$\\rho(A) = 3$' },
          { label: 'C', body: '$\\rho(A) = \\sqrt{5}$' },
          { label: 'D', body: '$\\rho(A) = 5$' },
          { label: 'E', body: 'None of the above' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'The spectral radius is $\\rho(A) = \\max_i |\\lambda_i|$. Computing magnitudes: $|\\lambda_1| = 2$, $|\\lambda_2| = |-3| = 3$, $|\\lambda_3| = |1 + 2i| = \\sqrt{1 + 4} = \\sqrt{5}$, $|\\lambda_4| = \\sqrt{5}$. The maximum is $3$, achieved by $\\lambda_2$. So $\\rho(A) = 3$, and the dominant eigenvalue is the negative real $-3$.',
          trickAnalysis: [
            { choice: 'A', why: 'Confuses magnitude of $-3$ with $\\sqrt{3}$. The magnitude of a real number is its absolute value, not its square root.' },
            { choice: 'C', why: 'Picks the magnitude of the complex pair, $|1 \\pm 2i| = \\sqrt{5} \\approx 2.24$. This is the second-largest magnitude, but $3 > \\sqrt{5}$.' },
            { choice: 'D', why: 'Computes $|1 + 2i|^2 = 5$ instead of $|1 + 2i| = \\sqrt{5}$. Forgets to take the square root in the modulus formula.' },
            { choice: 'E', why: 'Hedges. Option B is correct; one of the visible options is always the spectral radius when the eigenvalues are given.' },
          ],
        },
      },
      {
        id: 'P-9.1b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'Let $A$ be a real $3 \\times 3$ matrix with eigenvalues $\\lambda_1 = 0.9$, $\\lambda_2 = -1.1$, $\\lambda_3 = 0.5$. Which statement best describes the long-term behavior of $\\mathbf{x}_k = A^k \\mathbf{x}_0$ for a generic $\\mathbf{x}_0$?',
        choices: [
          { label: 'A', body: 'The iteration decays to $\\mathbf{0}$ since all eigenvalues are less than $1$ in value.' },
          { label: 'B', body: 'The iteration grows along $\\mathbf{v}_2$ with alternating sign.' },
          { label: 'C', body: 'The iteration grows along $\\mathbf{v}_1$ since $\\lambda_1 > 0$.' },
          { label: 'D', body: 'The iteration oscillates with bounded amplitude.' },
          { label: 'E', body: 'The iteration cannot be analyzed without the eigenvectors.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'The spectral radius is $\\rho(A) = \\max(|0.9|, |-1.1|, |0.5|) = 1.1 > 1$, so the iteration grows. The dominant eigenvalue is $\\lambda_2 = -1.1$ with magnitude $1.1$. Along $\\mathbf{v}_2$ the iterate is multiplied by $-1.1$ each step, producing $|1.1|^k$ growth in magnitude and alternating sign. The components along $\\mathbf{v}_1$ and $\\mathbf{v}_3$ decay (since $|0.9|, |0.5| < 1$).',
          trickAnalysis: [
            { choice: 'A', why: 'Compares *values* instead of *magnitudes*. The eigenvalue $-1.1$ has value less than $1$ but magnitude $1.1 > 1$, so it dominates growth.' },
            { choice: 'C', why: 'Picks the largest positive eigenvalue, ignoring magnitudes of negative ones. $|0.9| < |-1.1|$, so $\\lambda_1$ is not dominant.' },
            { choice: 'D', why: 'Confuses oscillation in sign (which does happen) with bounded amplitude. The amplitude grows like $1.1^k$, not bounded.' },
            { choice: 'E', why: 'False. Generic initial conditions have $c_2 \\neq 0$ in the eigenexpansion; the dominant eigencomponent then determines the leading behavior without needing specific eigenvector coordinates.' },
          ],
        },
      },
    ],
  },
};
