import type { Concept } from '../types';

export const imageSegmentation: Concept = {
  id: 'image-segmentation',
  unitId: 'ch5',
  number: '5.8.2',
  title: 'Image Segmentation',
  blurb: 'Partition an image into meaningful regions using inner-product-based similarity and spectral clustering.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
**Image segmentation** is the problem of partitioning an image into meaningful regions — separating foreground from background, isolating objects, identifying tissue types in medical scans. Many segmentation algorithms reduce to linear algebra problems involving [[dot-and-inner-products|inner products]] and [[orthogonal-projections|projections]].

A foundational approach is **spectral clustering**, which builds a graph over pixels with edge weights $w_{ij}$ encoding similarity — typically a function of color difference, spatial distance, or learned features. The graph's [[graph-topology|Laplacian matrix]] $L = D - W$ (degree minus adjacency) is symmetric positive semi-definite, and its eigenvectors corresponding to the smallest eigenvalues provide a low-dimensional embedding in which connected regions of the image cluster together. Running [[k-means|K-means]] in the embedding space yields the segmentation.

The mathematical principle: regions of the image with high internal similarity and low cross-region similarity correspond to small eigenvalues of $L$, with eigenvectors that are nearly constant within each region. Projecting the pixels onto the first few non-trivial eigenvectors compresses the image's geometric structure into a low-dimensional [[orthonormal-bases|orthonormal basis]], where the clusters are easy to identify.

Modern deep learning has largely replaced classical spectral methods for natural image segmentation, but the linear-algebra heritage remains: convolutional layers are repeated [[linear-transformation-defs|linear transformations]] alternating with nonlinearities, and the architecture's effectiveness is rooted in the same intuitions about basis change, projection, and orthogonality that drive spectral methods.
    `.trim(),

    definitions: [
      {
        term: 'Graph Laplacian',
        body: 'For a weighted graph with adjacency matrix $W$ and degree matrix $D$: $L = D - W$. Symmetric positive semi-definite, with eigenvalues encoding the graph\'s connectivity structure.',
      },
      {
        term: 'Spectral embedding',
        body: 'A low-dimensional representation of graph nodes obtained by projecting onto the eigenvectors of the Laplacian corresponding to the smallest nonzero eigenvalues.',
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
