import type { Concept } from '../types';

export const pagerank: Concept = {
  id: 'pagerank',
  unitId: 'ch9',
  number: '9.6.2',
  title: 'PageRank',
  blurb: 'A web-scale dominant eigenvector computation: importance is the stationary distribution of a random surfer.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
PageRank is the original algorithm behind Google's web ranking, and it is essentially the [[consensus|stationary distribution]] of a [[perron-frobenius|Perron-Frobenius]] matrix derived from the web's link structure. Each web page is a node; each hyperlink is a directed edge. Build the column-stochastic matrix $P$ where $p_{ij} = 1/\\deg^+(j)$ if page $j$ links to page $i$, encoding "if a surfer is at $j$, they pick a random outgoing link with uniform probability." The PageRank vector is the dominant eigenvector of $P$ for $\\lambda = 1$.

Two issues prevent vanilla $P$ from satisfying Perron-Frobenius directly: dangling nodes (pages with no outgoing links) and reducibility (disconnected components of the web). Both are fixed by the *Google trick*: replace $P$ with $\\tilde{P} = \\alpha P + (1 - \\alpha) \\frac{1}{n} \\mathbf{1}\\mathbf{1}^T$ for some $\\alpha \\in (0, 1)$ (Google originally used $\\alpha = 0.85$). The added term is a "teleport" probability: at each step the surfer either follows a link (with probability $\\alpha$) or jumps to a uniformly random page (with probability $1 - \\alpha$). This makes $\\tilde{P}$ strictly positive, so [[perron-frobenius|Perron-Frobenius]] guarantees a unique positive dominant eigenvector. That eigenvector is the PageRank: importance scores for every page on the web.

In practice the PageRank vector is computed via [[dominance-convergence|power iteration]] on $\\tilde{P}$. The convergence rate is roughly $\\alpha^k$, since $\\alpha$ becomes the second-largest eigenvalue after teleport regularization. With $\\alpha = 0.85$ and tolerance $10^{-6}$, convergence takes about $\\log(10^{-6}) / \\log(0.85) \\approx 85$ iterations — fast enough to recompute over a web-scale matrix.
    `.trim(),

    definitions: [
      {
        term: 'PageRank vector',
        body: 'The dominant right eigenvector of the teleport-regularized link matrix $\\tilde{P} = \\alpha P + (1 - \\alpha) \\frac{1}{n} \\mathbf{1}\\mathbf{1}^T$, normalized to sum to $1$. Entries are importance scores for each page.',
      },
      {
        term: 'Damping factor',
        body: 'The parameter $\\alpha \\in (0, 1)$ controlling how often the surfer follows a real link versus teleports. Originally $\\alpha = 0.85$. Smaller $\\alpha$ ⟹ faster convergence but less faith in the actual link structure.',
      },
      {
        term: 'Power iteration for PageRank',
        body: 'Repeatedly apply $\\tilde{P}$ to a uniform initial distribution until convergence. The convergence rate is $\\alpha^k$, set by the teleport parameter. About $50$-$100$ iterations suffice for web-scale tolerance.',
      },
    ],
    theorems: [],
  },

  explore: {
    vizComponent: null,
    description: 'No interactive visualization for this application.',
    misconception: { title: '', body: '' },
  },

  practice: {
    workedExample: [],
    problems: [],
  },
};
