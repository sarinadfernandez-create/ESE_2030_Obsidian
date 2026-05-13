import type { Concept } from '../types';

export const tensors: Concept = {
  id: 'tensors',
  unitId: 'ch10',
  number: '10.5.3',
  title: 'Tensor Decompositions',
  blurb: 'SVD generalizes to higher-order arrays (tensors), but uniqueness, optimality, and computational tractability change in subtle ways.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A **tensor** is a multi-way generalization of a matrix: a matrix $A \\in \\mathbb{R}^{m \\times n}$ is a 2-way array, while a tensor $\\mathcal{T} \\in \\mathbb{R}^{n_1 \\times n_2 \\times n_3 \\times \\cdots}$ is a $k$-way array for any $k \\geq 3$. Real-world examples are common: a color video is a 4-tensor (time $\\times$ height $\\times$ width $\\times$ RGB channel); a recommendation dataset is a 3-tensor (user $\\times$ item $\\times$ context); a brain MRI is a 3-tensor (x $\\times$ y $\\times$ z). The natural question is whether the [[svd-form|SVD]] generalizes — and the answer, perhaps surprisingly, is that several generalizations exist, all with different trade-offs.

The **higher-order SVD** (HOSVD, Tucker decomposition) writes $\\mathcal{T} = \\mathcal{C} \\times_1 U^{(1)} \\times_2 U^{(2)} \\times_3 U^{(3)} \\cdots$, where each $U^{(i)}$ is orthogonal (analogous to $U$ and $V$ in SVD) and $\\mathcal{C}$ is a "core tensor" generalizing the singular-value diagonal $\\Sigma$. Unlike the matrix SVD, $\\mathcal{C}$ is not diagonal — it has cross-terms between different modes. The HOSVD is computed by unfolding the tensor along each mode and running an ordinary SVD on each unfolding. It is a useful approximation but does NOT enjoy the Eckart-Mirsky-Young optimality of the 2D SVD: truncating the HOSVD does not give the best rank-$r$ approximation in general, only a "good enough" one.

The **CP decomposition** (CANDECOMP/PARAFAC) writes $\\mathcal{T} = \\sum_{i=1}^{r} \\sigma_i \\, \\mathbf{u}_i^{(1)} \\otimes \\mathbf{u}_i^{(2)} \\otimes \\cdots$, a sum of "rank-1" outer products. This is the more direct analog of the SVD's outer-product expansion $A = \\sum \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$. The CP decomposition can be UNIQUE under mild non-degeneracy conditions (unlike Tucker), which makes it the natural choice when "tensor components" should be interpretable as physical sources or signals (chemometrics, blind source separation, neural network compression). The trade-off: computing the CP decomposition is NP-hard in general, and approximate algorithms (like alternating least squares) can have multiple local optima.

The unifying lesson is that **tensors are not matrices and the SVD does not extend losslessly**. The matrix SVD has three properties that almost never coexist in higher dimensions: existence (always), uniqueness (up to known freedoms), and optimal low-rank truncation. For $k \\geq 3$ way arrays, you generally choose at most two of these. This is one reason matrix problems are computationally well-behaved while tensor problems often require heuristics — and it is why modern deep learning, which is fundamentally tensor-based, has developed entirely separate algorithmic machinery (gradient descent in parameter space, not closed-form factorizations).
    `.trim(),
    definitions: [
      {
        term: 'Tensor',
        body: 'A multi-dimensional array $\\mathcal{T} \\in \\mathbb{R}^{n_1 \\times n_2 \\times \\cdots \\times n_k}$ for $k \\geq 1$. Vectors are 1-tensors; matrices are 2-tensors; higher-order tensors are 3-tensors and beyond.',
      },
      {
        term: 'Tucker decomposition (HOSVD)',
        body: 'A factorization $\\mathcal{T} = \\mathcal{C} \\times_1 U^{(1)} \\times_2 U^{(2)} \\cdots \\times_k U^{(k)}$ with each $U^{(i)}$ orthogonal and $\\mathcal{C}$ a "core tensor." The most direct generalization of the matrix SVD; lacks optimal low-rank truncation.',
      },
      {
        term: 'CP decomposition',
        body: 'A factorization $\\mathcal{T} = \\sum_{i=1}^{r} \\sigma_i \\, \\mathbf{u}_i^{(1)} \\otimes \\cdots \\otimes \\mathbf{u}_i^{(k)}$ as a sum of rank-1 outer products. The natural "outer product" generalization of SVD; can be unique but is NP-hard to compute.',
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
