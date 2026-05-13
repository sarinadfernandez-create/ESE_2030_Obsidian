import type { Concept } from '../types';

export const consensus: Concept = {
  id: 'consensus',
  unitId: 'ch9',
  number: '9.5',
  title: 'Consensus & Markov Chains',
  blurb: 'Stochastic matrices have a stationary distribution. Iteration drives every starting distribution to consensus.',
  tier: 'full',

  learn: {
    overview: `
A *stochastic matrix* is the natural matrix-level object for tracking probability flow. In the course's convention, columns sum to $1$: $P = [p_{ij}]$ with $p_{ij} \\geq 0$ and $\\sum_i p_{ij} = 1$. The entry $p_{ij}$ is the probability of transitioning from state $j$ to state $i$. The dynamics is $\\mathbf{x}_{k+1} = P \\mathbf{x}_k$, where $\\mathbf{x}_k$ is the probability distribution at step $k$ (or any vector representing populations or counts).

The column-sum condition has an immediate structural consequence: the row vector $\\mathbf{1}^T = (1, 1, \\ldots, 1)$ satisfies $\\mathbf{1}^T P = \\mathbf{1}^T$, which says $\\mathbf{1}^T$ is a left eigenvector of $P$ with eigenvalue $1$. Since left and right eigenvalues of any matrix coincide, $P$ must have $\\lambda = 1$ as an eigenvalue, with some corresponding right eigenvector $\\mathbf{v}_*$ called the *stationary distribution*: $P\\mathbf{v}_* = \\mathbf{v}_*$. The stationary distribution is what the iteration converges to.

Two facts pin down the long-term behavior. First, every eigenvalue of $P$ has $|\\lambda| \\leq 1$ (this is a general property of stochastic matrices, related to [[perron-frobenius|Perron-Frobenius]]). Second, for *regular* stochastic matrices (irreducible and aperiodic — informally, every state can reach every other state in some number of steps, and there is no cyclic structure), $\\lambda = 1$ is a *simple, strictly dominant* eigenvalue. The other eigenvalues have $|\\lambda| < 1$, so they decay under iteration.

Plug into the [[dominance-convergence|eigencomponent decomposition]]: $\\mathbf{x}_k = c_* \\mathbf{v}_* + \\sum_{i \\neq *} c_i \\lambda_i^k \\mathbf{v}_i$. As $k \\to \\infty$, every non-stationary component decays to zero, leaving only $c_* \\mathbf{v}_*$. The system converges to the stationary distribution, scaled by whatever $c_*$ was set by initial conditions. For column-stochastic $P$, the total mass is conserved: $\\mathbf{1}^T \\mathbf{x}_k = \\mathbf{1}^T \\mathbf{x}_0$ for all $k$. So the limit distribution has the *same total* as the start; the limit is $\\mathbf{v}_*$ normalized to that total.

The geometric content: regardless of where you start in the probability simplex, repeated application of $P$ pulls you toward a unique point in the simplex (the stationary distribution). The pulling is exponentially fast, with rate governed by the second-largest eigenvalue magnitude. This is the *consensus* phenomenon: every starting condition converges to the same final pattern. It is the matrix-level statement that Markov chains forget their initial conditions.

The stationary distribution itself is just the dominant right eigenvector of $P$. To find it, solve $(P - I)\\mathbf{v} = 0$ and normalize. Computing $P^n$ explicitly is *not* required; the limit is encoded entirely in the eigenstructure. This is the conceptual reason eigenvalue methods (rather than direct matrix-power computation) are the right tool for long-term Markov behavior.

**Symmetry exploit.** When the transition matrix has a symmetry — two states that play identical roles, having identical rows *and* identical columns in $P$ — those two states must have equal stationary probabilities. The symmetry argument: there is an automorphism of the chain swapping the two states, which must preserve the (unique) stationary distribution, so the stationary distribution must be invariant under the swap, meaning the two states have the same probability. This is the cleanest symmetry argument in linear algebra: structure of $P$ ⟹ structure of $\\mathbf{v}_*$ without explicit computation.

**Where it lives.** Random walks on graphs (the [[spectral-graph-theory|adjacency-based Markov chain]]), [[pagerank|PageRank]] (the web-graph random walk), population dynamics (Leslie matrices in the stochastic version), opinion dynamics, queueing systems. The Markov chain framework reaches across most of applied probability.
    `.trim(),

    definitions: [
      {
        term: 'Stochastic matrix (column-stochastic)',
        body: 'A nonnegative square matrix $P$ whose columns sum to $1$. Equivalent: $\\mathbf{1}^T P = \\mathbf{1}^T$. The course convention is column-stochastic.',
      },
      {
        term: 'Stationary distribution',
        body: 'A probability distribution $\\mathbf{v}_*$ (entries nonnegative, summing to $1$) satisfying $P \\mathbf{v}_* = \\mathbf{v}_*$. Equivalently, the right eigenvector of $P$ for $\\lambda = 1$, normalized.',
      },
      {
        term: 'Regular Markov chain',
        body: 'A Markov chain whose transition matrix is *regular*: some power $P^k$ has all entries strictly positive. Equivalent (for finite chains) to being irreducible and aperiodic. Guarantees a unique stationary distribution and convergence from any starting distribution.',
      },
      {
        term: 'Mixing rate',
        body: 'The convergence rate to the stationary distribution. Governed by the second-largest eigenvalue magnitude $|\\lambda_2|$: the rate is $|\\lambda_2|^k$ per step. A smaller $|\\lambda_2|$ means faster mixing.',
      },
    ],

    theorems: [
      {
        name: 'Eigenvalue $\\lambda = 1$ always exists',
        statement: 'Every column-stochastic matrix has $1$ as an eigenvalue, with $\\mathbf{1}^T$ as the corresponding left eigenvector.',
        intuition: '$\\mathbf{1}^T P = \\mathbf{1}^T$ is the matrix way of saying "columns of $P$ sum to $1$." That is exactly the eigenvalue equation for $\\mathbf{1}^T$ on the left. Left and right spectra coincide, so $\\lambda = 1$ appears in the spectrum. The corresponding *right* eigenvector is the stationary distribution.',
      },
      {
        name: 'Spectral radius is $1$',
        statement: 'For any (column-)stochastic matrix $P$, every eigenvalue satisfies $|\\lambda| \\leq 1$. So $\\rho(P) = 1$.',
        intuition: 'The simplex of probability distributions is bounded. The matrix $P$ maps the probability simplex into itself, so it cannot stretch any vector beyond the simplex. The simplex sits inside the $\\|\\cdot\\|_1$ unit ball, so $\\|P\\mathbf{x}\\|_1 \\leq \\|\\mathbf{x}\\|_1$. This bounds the eigenvalues by $1$ in magnitude.',
      },
      {
        name: 'Convergence to stationary distribution',
        statement: 'For a regular column-stochastic $P$, $\\lambda = 1$ is simple and strictly dominant. For any starting distribution $\\mathbf{x}_0$, $P^k \\mathbf{x}_0 \\to \\mathbf{v}_*$, the unique stationary distribution scaled to the same total mass as $\\mathbf{x}_0$.',
        intuition: 'Strict dominance of $\\lambda = 1$ collapses every non-stationary eigencomponent to zero. The mass-conservation property ($\\mathbf{1}^T \\mathbf{x}_k = \\mathbf{1}^T \\mathbf{x}_0$) ensures that the limit is $\\mathbf{v}_*$ with the correct total. The rate of convergence is $|\\lambda_2|^k$, governed by the second-largest eigenvalue.',
      },
      {
        name: 'Symmetry forces equal stationary probabilities',
        statement: 'If states $i$ and $j$ have identical rows and identical columns in $P$, then the stationary distribution has $v_{*,i} = v_{*,j}$.',
        intuition: 'The chain is symmetric under swapping states $i$ and $j$. This symmetry must be inherited by the unique stationary distribution. Without doing any computation, the symmetry argument forces the equality of $i$-th and $j$-th stationary probabilities. This is one of the cleanest applications of "structure of $P$ predicts structure of $\\mathbf{v}_*$."',
      },
    ],

    keyFormulas: [
      'P \\mathbf{v}_* = \\mathbf{v}_*, \\quad \\sum_i v_{*,i} = 1',
      '\\mathbf{1}^T P = \\mathbf{1}^T \\text{ (column-stochastic identity)}',
      '\\mathbf{x}_k = P^k \\mathbf{x}_0 \\to \\mathbf{v}_* \\text{ (mass-normalized) as } k \\to \\infty',
      '\\text{mixing rate} = |\\lambda_2|^k',
    ],
  },

  explore: {
    vizComponent: 'ConsensusViz',
    description: 'A 3-state Markov chain on the probability simplex. The user picks a column-stochastic matrix $P$ from presets (sticky, mixing, periodic, near-disconnected) or enters columns directly (they auto-normalize). The viz shows: the 2-simplex (triangle) of probability distributions over 3 states; an animated trajectory starting from a user-chosen point, iterating under $P$ and tracing the convergence to the stationary distribution; the stationary distribution highlighted as a fixed point; the eigenvalues plotted as dots in the complex unit disk with $\\lambda = 1$ specially marked. A "symmetry detector" highlights pairs of states with identical rows/columns and shows that the corresponding stationary entries are equal.',
    misconception: {
      title: 'Mistaking $\\lambda = 1$ for "total population grows," and confusing row-vs-column stochastic',
      body: `The eigenvalue $\\lambda_1 = 1$ for a stochastic matrix is *required* by the column-sum constraint; it has nothing to do with growth. A common mistake is interpreting "$\\lambda_1 = 1$" as the dominant eigenvalue being neutral and concluding either that "total population is preserved" (which *is* true for column-stochastic $P$) *or* that the population "stays the same forever" (which is false; the distribution changes, only the total is conserved). The correct picture: total mass is preserved exactly, while the *distribution* of that mass across states evolves toward the stationary distribution.

A second misconception: thinking the long-term distribution depends on initial conditions for a regular Markov chain. It does *not* — the stationary distribution is unique (up to scaling for total mass). Different starting distributions converge to the *same* stationary direction, just scaled to the appropriate total. The whole point of "consensus" is that the chain forgets where it started.

A third trap: row-stochastic versus column-stochastic confusion. Some textbooks use row-stochastic (rows sum to $1$, $\\mathbf{x}_{k+1}^T = \\mathbf{x}_k^T P$, $P$ acts on the right of row vectors). This course uses column-stochastic ($\\mathbf{x}_{k+1} = P\\mathbf{x}_k$ with $P$ acting on the left of column vectors, columns summing to $1$). The right eigenvector for $\\lambda = 1$ is the stationary distribution in this convention; in the row-stochastic convention it would be a *left* eigenvector. Always check which convention is in use before invoking the formulas.

A fourth subtlety: assuming convergence even when the chain is not regular. A *periodic* chain (e.g., $P = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$) has $\\lambda_1 = 1$ and $\\lambda_2 = -1$, both with magnitude $1$. The iteration cycles between two distributions and does not converge. Regularity (irreducibility + aperiodicity) is what guarantees a strictly dominant $\\lambda = 1$ and hence convergence.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Setup: population dynamics with three age groups',
        body: 'A population is tracked across three age groups (juvenile, adult, senior). The transition matrix $P$ is column-stochastic with eigenvalues $\\lambda_1 = 1, \\lambda_2 = 0.6, \\lambda_3 = -0.2$. The eigenvector for $\\lambda_1 = 1$ is $\\mathbf{v}_1 = (2, 5, 3)^T / 10$.',
      },
      {
        title: 'What does $\\lambda_1 = 1$ tell us?',
        body: 'It tells us $P$ is column-stochastic with a dominant eigenvalue at $1$ (consistent with stochastic structure). The total population is preserved at each step: $\\mathbf{1}^T \\mathbf{x}_k = \\mathbf{1}^T \\mathbf{x}_0$ for all $k$. The other eigenvalues $|\\lambda_2| = 0.6, |\\lambda_3| = 0.2$ are both less than $1$, so non-stationary components decay.',
      },
      {
        title: 'What is the long-term distribution?',
        body: 'The stationary distribution is $\\mathbf{v}_1 = (0.2, 0.5, 0.3)^T$. As $k \\to \\infty$, $\\mathbf{x}_k$ converges to $\\mathbf{v}_1$ scaled to the initial total mass: if the initial total is $N$, the limit is $N \\cdot (0.2, 0.5, 0.3)^T = (0.2N, 0.5N, 0.3N)^T$. The convergence rate is $|\\lambda_2|^k = 0.6^k$.',
      },
    ],

    problems: [
      {
        id: 'P-9.5a',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A population model tracks juveniles, adults, and seniors. The column-stochastic transition matrix $P$ has eigenvalues $\\lambda_1 = 1$, $\\lambda_2 = 0.6$, $\\lambda_3 = -0.2$, with eigenvector for $\\lambda_1 = 1$ given by $\\mathbf{v}_1 = \\frac{1}{10}(2, 5, 3)^T$. Which statement is most accurate about the long-term behavior of $\\mathbf{x}(k) = P^k \\mathbf{x}(0)$?',
        choices: [
          { label: 'A', body: 'As $k \\to \\infty$, the population distribution converges exactly to $\\mathbf{v}_1$.' },
          { label: 'B', body: 'The dominant eigenvalue $\\lambda_1 = 1$ means the total population remains constant over time.' },
          { label: 'C', body: 'The eigenvalue $\\lambda_3 = -0.2$ means the senior population eventually becomes negative.' },
          { label: 'D', body: 'Since $|\\lambda_2| = 0.6 > |\\lambda_3|$, convergence is primarily controlled by the adult age group.' },
          { label: 'E', body: 'As $k \\to \\infty$, all populations decay to zero because $\\lambda_2$ and $\\lambda_3$ are both less than $1$.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'For a column-stochastic matrix, $\\mathbf{1}^T P = \\mathbf{1}^T$, so $\\mathbf{1}^T \\mathbf{x}_k = \\mathbf{1}^T P^k \\mathbf{x}_0 = \\mathbf{1}^T \\mathbf{x}_0$ for all $k$. Total population is exactly preserved. This is the structural content of $\\lambda_1 = 1$ together with column-stochasticity.',
          partialCredit: 'Choice A is close but imprecise: the limit is $\\mathbf{v}_1$ *scaled to the initial total mass*, not $\\mathbf{v}_1$ itself. If the initial total is $N$, the limit is $N \\cdot \\mathbf{v}_1$, not $\\mathbf{v}_1$. The eigenvector $\\mathbf{v}_1$ as given has entries summing to $1$, representing proportions; multiplying by $N$ recovers absolute populations.',
          trickAnalysis: [
            { choice: 'A', why: 'Close but imprecise. The limit is $\\mathbf{v}_1$ *scaled to the initial total mass*, not $\\mathbf{v}_1$ itself.' },
            { choice: 'C', why: 'The sign of an eigenvalue does not by itself make components negative. The eigenvector $\\mathbf{v}_3$ encodes a direction whose contribution to $\\mathbf{x}_k$ is $c_3 (-0.2)^k \\mathbf{v}_3$; this decays to zero regardless of sign. Negative populations would require the *full distribution* to have negative entries, which the stationary structure prevents.' },
            { choice: 'D', why: 'Confuses "controlled by the second eigenvalue" with "controlled by an age group." The eigenvector $\\mathbf{v}_2$ does not correspond to "the adult age group"; it is some linear combination of all three group counts. Eigenvalues and age groups do not map onto each other one-to-one.' },
            { choice: 'E', why: 'Misses that $\\lambda_1 = 1$ is also an eigenvalue, with a $\\lambda^k = 1$ contribution that does not decay. Only the $\\lambda_2$ and $\\lambda_3$ components decay; the $\\lambda_1$ contribution persists and gives the stationary distribution.' },
          ],
        },
      },
      {
        id: 'P-9.5b',
        format: 'multiple-choice',
        difficulty: 2,
        statement: 'A streaming service market with three providers evolves according to the column-stochastic transition matrix $$P = \\begin{pmatrix} 0.7 & 0.1 & 0.2 \\\\ 0.2 & 0.8 & 0.3 \\\\ 0.1 & 0.1 & 0.5 \\end{pmatrix}$$ The current market shares are (40\\%, 30\\%, 30\\%). After many months, what will the market share distribution be?',
        choices: [
          { label: 'A', body: 'Approximately (40\\%, 30\\%, 30\\%), since markets are sticky.' },
          { label: 'B', body: 'Approximately (29\\%, 54\\%, 17\\%), the stationary distribution of $P$.' },
          { label: 'C', body: 'Approximately (33\\%, 33\\%, 33\\%) by symmetry across three providers.' },
          { label: 'D', body: 'Cannot be determined without computing the limit of $P^n$ as $n \\to \\infty$.' },
          { label: 'E', body: 'Need to know the exact dominant eigenvector to determine this.' },
        ],
        correctAnswer: 'B',
        solution: {
          explanation: 'The long-term market share is the stationary distribution: the eigenvector of $P$ for $\\lambda = 1$, normalized to sum to $1$. Solving $(P - I)\\mathbf{v} = 0$ and normalizing gives approximately $v_1 \\approx 29.2\\%$, $v_2 \\approx 54.2\\%$, $v_3 \\approx 16.7\\%$. The limit is independent of the (40\\%, 30\\%, 30\\%) starting condition; that information is irrelevant after the chain mixes.',
          partialCredit: 'Choices D and E are both partially correct in recognizing that the answer is the stationary distribution, but they fail to follow through to compute or recognize it. Specifically, E recognizes the dominant eigenvector is the answer but stops short of producing it.',
          trickAnalysis: [
            { choice: 'A', why: 'Mistakes "the starting condition" for "the long-term limit." Regular Markov chains forget initial conditions; the limit depends only on $P$, not on $\\mathbf{x}_0$ (beyond total mass).' },
            { choice: 'C', why: 'Assumes symmetry among providers that does not exist. The columns of $P$ are different, so the three providers are not interchangeable. Equal shares would require $P$ to be doubly stochastic with full symmetry, which this $P$ is not.' },
            { choice: 'D', why: 'Technically true that computing $P^\\infty$ would give the answer, but the conceptual answer is to find the dominant eigenvector, which is much faster and more illuminating. Treats the eigenvalue method as inaccessible.' },
            { choice: 'E', why: 'Recognizes that the dominant eigenvector is the answer but fails to actually find it. Partial credit for the conceptual framing without execution.' },
          ],
        },
      },
      {
        id: 'P-9.5c',
        format: 'multiple-choice',
        difficulty: 3,
        statement: 'A robot performs a random walk on a network of four rooms connected by doorways. The column-stochastic transition matrix is $$P = \\begin{pmatrix} 0 & 1/3 & 1/3 & 0 \\\\ 1/2 & 0 & 1/3 & 1/2 \\\\ 1/2 & 1/3 & 0 & 1/2 \\\\ 0 & 1/3 & 1/3 & 0 \\end{pmatrix}.$$ The chain is regular, so a unique stationary distribution exists. Note that rooms $1$ and $4$ have identical rows and identical columns. What does this symmetry imply about the long-term behavior?',
        choices: [
          { label: 'A', body: 'Over time, the robot spends the same fraction of time in room $1$ as in room $4$.' },
          { label: 'B', body: 'The stationary distribution has equal entries for rooms $2$ and $3$.' },
          { label: 'C', body: 'At each step, the robot visits rooms $2$ and $3$ with at least $50\\%$ probability combined.' },
          { label: 'D', body: 'Rooms $1$ and $4$ have the same eigenvalue.' },
          { label: 'E', body: 'The robot spends more time in rooms $2$ and $3$ than in rooms $1$ and $4$.' },
        ],
        correctAnswer: 'A',
        solution: {
          explanation: 'Rooms $1$ and $4$ are *exchangeable* in the chain: swapping their labels leaves $P$ unchanged (identical rows means they have the same incoming probabilities from every other state; identical columns means they have the same outgoing probabilities). The unique stationary distribution must be invariant under this swap, which forces $v_{*,1} = v_{*,4}$. The robot spends the same long-run fraction of time in room $1$ as in room $4$. This is the cleanest application of "symmetry in $P$ forces symmetry in $\\mathbf{v}_*$"; no computation of the eigenvector is needed.',
          partialCredit: 'Choice E is plausibly true (the actual stationary distribution does favor rooms 2 and 3) but is a *consequence* of computation, not of the symmetry argument. The clean symmetry statement is about rooms 1 and 4 having equal stationary probability, not about the relative weight of pairs.',
          trickAnalysis: [
            { choice: 'B', why: 'Rooms $2$ and $3$ do not have identical rows or columns in $P$. Column $2$ is $(1/3, 0, 1/3, 1/3)$ but column $3$ is $(1/3, 1/3, 0, 1/3)$ — different. The symmetry argument does not apply between rooms $2$ and $3$.' },
            { choice: 'C', why: 'Mixes up per-step probability with stationary distribution. "Visits with at least 50\\% probability combined" is a claim about transition probabilities, not stationary mass. Not implied by the symmetry.' },
            { choice: 'D', why: 'Confuses "stationary probability of a state" with "eigenvalue of a matrix." States do not have eigenvalues; the matrix $P$ does. The eigenvalues of $P$ are properties of $P$, not properties of individual rooms.' },
            { choice: 'E', why: 'A specific claim about relative weights that requires computation. The symmetry argument alone does not force this; it forces only $v_{*,1} = v_{*,4}$.' },
          ],
        },
      },
    ],
  },
};
