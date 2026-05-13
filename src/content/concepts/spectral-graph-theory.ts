import type { Concept } from '../types';

export const spectralGraphTheory: Concept = {
  id: 'spectral-graph-theory',
  unitId: 'ch9',
  number: '9.6.1',
  title: 'Spectral Graph Theory',
  blurb: 'Eigenvalues of graph matrices encode connectivity, clustering, and flow.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A graph can be encoded as a symmetric matrix in two canonical ways: the *adjacency matrix* $A$ ($a_{ij} = 1$ if edge $i$-$j$, else $0$) and the *Laplacian* $L = D - A$ (where $D$ is the diagonal matrix of vertex degrees). Both are symmetric, so the [[symmetric-spectra|spectral theorem]] applies, and the eigenvalues are real. The remarkable observation, which launches the entire field of *spectral graph theory*, is that those eigenvalues encode structural properties of the graph: connectivity, the number of components, clustering tendency, expansion, mixing time of random walks, bipartiteness.

The cleanest statement is about the Laplacian: the multiplicity of $\\lambda = 0$ as an eigenvalue of $L$ equals the number of connected components of the graph. Six servers split into two clusters with no edges between them produces a Laplacian with two zero eigenvalues. Six fully interconnected servers produce a Laplacian with exactly one zero eigenvalue. The second-smallest eigenvalue (the *algebraic connectivity* or *Fiedler value*) measures how strongly connected the graph is; small Fiedler values flag near-bottlenecks.

Spectral methods are now standard for graph partitioning (cut a graph into balanced pieces by thresholding the Fiedler vector), clustering (use top eigenvectors as low-dimensional coordinates for nodes), and network ranking. The [[consensus|random walk]] on a graph is a Markov chain whose mixing time is controlled by the Laplacian's eigenvalues, tying spectral graph theory directly to the [[dominance-convergence|convergence-rate]] machinery of the rest of this unit.
    `.trim(),

    definitions: [
      {
        term: 'Graph Laplacian',
        body: 'For an undirected graph with adjacency matrix $A$ and degree matrix $D$, the Laplacian is $L = D - A$. It is symmetric, positive semidefinite, and singular (with $\\mathbf{1}$ in its kernel).',
      },
      {
        term: 'Algebraic connectivity',
        body: 'The second-smallest eigenvalue $\\lambda_2$ of the Laplacian. Equals $0$ iff the graph is disconnected; otherwise small values flag near-bottlenecks. Sometimes called the Fiedler value.',
      },
      {
        term: 'Number of components from spectrum',
        body: 'For an undirected graph, the multiplicity of $0$ as an eigenvalue of $L$ equals the number of connected components.',
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
