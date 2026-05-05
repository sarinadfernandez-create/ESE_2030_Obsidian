import type { Concept } from '../types';

export const svm: Concept = {
  id: 'svm',
  unitId: 'ch6',
  number: '6.6.3',
  title: 'Support Vector Machines',
  blurb: 'Classify data by finding the hyperplane that maximizes the margin — a regularized least-squares problem in disguise.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
**Support Vector Machines** (SVMs) are a classification method that finds a hyperplane separating two classes of data with maximum *margin* — the widest possible "buffer" between the classes. Mathematically, this is a [[regularized-least-squares|regularized optimization problem]] in an [[dot-and-inner-products|inner product space]].

For data points $x_1, \\dots, x_n \\in \\mathbb{R}^d$ with labels $y_i \\in \\{+1, -1\\}$, a separating hyperplane is described by a weight vector $w$ and an offset $b$:

$$\\text{predicted class}(x) = \\text{sign}(w \\cdot x + b).$$

The hyperplane is $\\{x : w \\cdot x + b = 0\\}$, and the [[orthogonal-complements|normal vector]] $w$ specifies its orientation. The **margin** is the distance from the hyperplane to the nearest data point, which equals $1 / \\|w\\|$ when the hyperplane is normalized so that $|w \\cdot x_i + b| \\geq 1$ for all $i$.

Maximizing the margin is equivalent to minimizing $\\|w\\|^2$ subject to the constraints $y_i (w \\cdot x_i + b) \\geq 1$ for all $i$. This is a convex quadratic program, and its dual involves only the **inner products** $\\langle x_i, x_j \\rangle$ between data points — never the points themselves directly. This is the **kernel trick**: the inner product can be replaced by any positive-definite kernel function $K(x, y)$, implicitly mapping the data into a higher-dimensional feature space without ever computing the mapping explicitly.

The optimal $w$ turns out to be a linear combination of only the **support vectors** — the data points lying exactly on the margin boundary. All other points (those farther from the hyperplane) have zero coefficient. This is a form of L1-like sparsity arising naturally from the optimization structure.

Modern deep learning has largely supplanted SVMs for most classification tasks, but the geometric ideas remain: classification reduces to finding a separating surface in a feature space chosen for its discriminative geometry. SVMs make this explicit; neural networks do it via learned features.
    `.trim(),

    definitions: [
      {
        term: 'Margin',
        body: 'The distance between a separating hyperplane and the nearest data point. SVMs maximize this distance for robust classification.',
      },
      {
        term: 'Support vectors',
        body: 'The data points lying exactly on the margin boundary of a trained SVM. Determine the hyperplane uniquely; all other points are irrelevant.',
      },
      {
        term: 'Kernel',
        body: 'A function $K(x, y)$ that computes inner products in an implicit higher-dimensional feature space. Allows SVMs to learn nonlinear classification boundaries.',
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
