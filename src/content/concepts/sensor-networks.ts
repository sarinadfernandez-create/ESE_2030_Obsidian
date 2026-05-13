import type { Concept } from '../types';

export const sensorNetworks: Concept = {
  id: 'sensor-networks',
  unitId: 'ch10',
  number: '10.5.2',
  title: 'Sensor Networks and Localization',
  blurb: 'SVD recovers absolute positions of sensors from pairwise distance measurements via multidimensional scaling.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A common problem in wireless sensor networks, robotics, and molecular biology is **localization from pairwise distances**: $n$ nodes are deployed in $\\mathbb{R}^d$ (typically $d = 2$ or $3$), and you can measure or estimate the distance $d_{ij}$ between any two nodes (perhaps via signal strength, time-of-flight, or chemical assay), but you cannot directly observe positions. The goal is to recover the absolute coordinates of all nodes from the $n \\times n$ distance matrix $D$ with entries $D_{ij} = d_{ij}^2$.

The standard solution is **classical multidimensional scaling** (MDS), and the linear-algebra core is an [[svd-form|SVD]] (or equivalently an eigendecomposition of a symmetric matrix). Form the **Gram matrix** $G = -\\frac{1}{2}JDJ$, where $J = I - \\frac{1}{n}\\mathbf{1}\\mathbf{1}^T$ is the centering matrix. If the distances came from a genuine Euclidean configuration $X \\in \\mathbb{R}^{n \\times d}$, then $G = XX^T$ exactly. Compute the eigendecomposition $G = Q\\Lambda Q^T$ (which equals the SVD since $G$ is symmetric PSD), and the recovered positions are $X = Q\\Lambda^{1/2}$, restricted to the top $d$ eigenvalues.

Sensor networks often violate the "exact Euclidean" assumption: distance measurements are noisy, some pairs cannot communicate (creating missing entries), and obstacles can cause non-line-of-sight bias. The SVD-based MDS handles noise naturally: take only the top $d$ singular values of $G$ to project onto a $d$-dimensional approximation, which is the optimal Frobenius-norm fit. The remaining small singular values quantify the deviation from a perfect Euclidean embedding and can flag bad measurements. For missing entries, an iterative method (matrix completion via repeated SVD truncation) is the workhorse approach. The recovery is unique only up to rigid motion (rotation, reflection, translation), since distances are invariant under those — this is why one or two anchor nodes with known positions are typically added to fix the coordinate frame.
    `.trim(),
    definitions: [
      {
        term: 'Distance matrix',
        body: 'A symmetric matrix $D \\in \\mathbb{R}^{n \\times n}$ with $D_{ij}$ equal to the squared distance between nodes $i$ and $j$ (and $D_{ii} = 0$). The input to multidimensional scaling.',
      },
      {
        term: 'Gram matrix',
        body: 'The symmetric matrix $G = -\\frac{1}{2}JDJ$ with $J = I - \\frac{1}{n}\\mathbf{1}\\mathbf{1}^T$. When $D$ comes from a Euclidean configuration $X$, $G = XX^T$ (after centering).',
      },
      {
        term: 'Classical MDS',
        body: 'The algorithm: form the Gram matrix from squared distances, compute its top-$d$ eigendecomposition, and read off positions as $X = Q_d \\Lambda_d^{1/2}$. Recovers absolute coordinates up to rigid motion.',
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
