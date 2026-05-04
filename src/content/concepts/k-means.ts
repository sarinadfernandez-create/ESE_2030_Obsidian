import type { Concept } from '../types';

export const kMeans: Concept = {
  id: 'k-means',
  unitId: 'ch5',
  number: '5.8.1',
  title: 'K-means Clustering',
  blurb: 'Group data points by proximity in inner product space — a geometric algorithm built on distance and orthogonality.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
**K-means clustering** is one of the most widely used unsupervised learning algorithms. Given a set of $n$ data points $x_1, \\dots, x_n$ in $\\mathbb{R}^d$ and a target number of clusters $K$, K-means partitions the points into $K$ groups, each represented by a **centroid** $\\mu_k$, by minimizing the total squared distance from each point to its assigned centroid:

$$\\min_{\\{\\mu_k\\}, \\{C_k\\}} \\sum_{k=1}^{K} \\sum_{x \\in C_k} \\|x - \\mu_k\\|^2.$$

The algorithm proceeds by alternating two steps until convergence: (1) assign each point to the nearest centroid (using Euclidean distance, which is the [[dot-and-inner-products|inner product]]–induced norm), and (2) update each centroid to the mean of the points assigned to it. Each step monotonically decreases the objective, so the algorithm converges (though typically to a local minimum).

The linear-algebra structure underneath is the [[orthogonal-projections|orthogonal projection]] of each data point onto the cluster-mean subspace. The algorithm exploits the fact that the centroid minimizing total squared distance is the *mean* of the cluster — a fact that follows directly from the geometry of inner product spaces: the projection of a set of points onto a single point is the centroid.

K-means is sensitive to the choice of inner product. The standard Euclidean inner product treats all features equally; weighted inner products allow some features to dominate the clustering. Pre-processing data with [[principal-components|PCA]] is common: project onto the top principal components first, then run K-means in the reduced space, where Euclidean distance reflects the dominant variance directions. The whole pipeline is layered linear algebra: inner products define distances, [[orthogonal-projections|projections]] define centroids, and [[change-of-basis|basis changes]] (PCA) reshape the geometry for better clustering.
    `.trim(),

    definitions: [
      {
        term: 'Centroid',
        body: 'For a cluster $C_k = \\{x_{i_1}, \\dots, x_{i_m}\\}$: $\\mu_k = \\frac{1}{m} \\sum_{j=1}^m x_{i_j}$, the mean of the points in the cluster.',
      },
      {
        term: 'K-means objective',
        body: 'Total within-cluster squared distance: $\\sum_k \\sum_{x \\in C_k} \\|x - \\mu_k\\|^2$. The K-means algorithm minimizes this.',
      },
      {
        term: 'Lloyd\'s algorithm',
        body: 'The classical K-means algorithm: alternate between (1) assigning each point to its nearest centroid and (2) updating centroids to cluster means. Converges to a local minimum.',
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
