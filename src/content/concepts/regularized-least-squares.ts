import type { Concept } from '../types';

export const regularizedLeastSquares: Concept = {
  id: 'regularized-least-squares',
  unitId: 'ch6',
  number: '6.5',
  title: 'Regularized Least Squares',
  blurb: 'When least squares overfits or fails, add a penalty term to keep $x$ small.',
  tier: 'full',

  learn: {
    overview: `
[[least-squares|Ordinary least squares]] minimizes $\\|Ax - b\\|^2$. But there are situations where this is problematic:

- $A$ is rank-deficient or nearly so — $A^T A$ is singular or ill-conditioned, and the normal equations either have no unique solution or amplify roundoff error.
- The number of features exceeds the number of data points ($n > m$) — $A$ is "wide," and there are infinitely many exact solutions, none preferred.
- The data is noisy and the model is flexible — least-squares overfits, capturing noise rather than signal.

**Regularization** adds a penalty term to the objective, biasing the solution toward "small" $x$:

$$\\hat{x}_\\lambda = \\arg\\min_{x} \\|Ax - b\\|^2 + \\lambda \\|x\\|^2,$$

where $\\lambda > 0$ is the **regularization parameter**. This is **Tikhonov regularization**, also called **ridge regression** in statistics.

The objective is still smooth and quadratic, so it has a closed-form solution via modified normal equations:

$$\\nabla_x [\\|Ax - b\\|^2 + \\lambda \\|x\\|^2] = 2 A^T(Ax - b) + 2\\lambda x = 0$$
$$(A^T A + \\lambda I) \\hat{x}_\\lambda = A^T b$$
$$\\hat{x}_\\lambda = (A^T A + \\lambda I)^{-1} A^T b.$$

**The regularized normal equations** $(A^T A + \\lambda I) \\hat{x} = A^T b$ are always solvable, regardless of $A$'s rank: $A^T A$ is positive semi-definite, $\\lambda I$ adds $\\lambda > 0$ to every eigenvalue, and the result is positive definite (hence invertible). This is the structural fix for rank-deficiency.

**Geometric interpretation.** The penalty $\\lambda \\|x\\|^2$ shrinks the solution toward zero. As $\\lambda \\to 0$, we recover ordinary least squares. As $\\lambda \\to \\infty$, $\\hat{x}_\\lambda \\to 0$. Intermediate $\\lambda$ values trade off "fit" (small $\\|Ax - b\\|^2$) against "smallness" ($\\|x\\|$ small).

**Statistical interpretation.** Under a Gaussian-noise model with a Gaussian prior $x \\sim \\mathcal{N}(0, \\sigma^2 / \\lambda \\cdot I)$, regularized least squares is the **maximum a posteriori (MAP) estimator** of $x$. Larger $\\lambda$ corresponds to a tighter prior — stronger belief that $x$ is small. This is the Bayesian foundation of regularization.

**Choosing $\\lambda$.** The regularization parameter is a hyperparameter that must be selected, typically via:
- **Cross-validation**: split the data, try multiple $\\lambda$ values, pick the one that generalizes best to held-out data.
- **L-curve method**: plot $\\|x\\|$ vs $\\|Ax - b\\|$ as $\\lambda$ varies; pick the "corner" of the L-shape.
- **Discrepancy principle**: pick $\\lambda$ so $\\|A\\hat{x}_\\lambda - b\\|$ matches the known noise level.
- **Generalized cross-validation (GCV)**: a closed-form approximation to leave-one-out cross-validation.

**Variants of regularization.** Different penalty terms produce different solution properties:
- **L2 / Tikhonov / ridge** ($\\|x\\|^2$): shrinks all coefficients toward zero, smoothly. Closed-form solution.
- **L1 / lasso** ($\\|x\\|_1 = \\sum |x_i|$): promotes *sparsity* — many coefficients become exactly zero. Used for feature selection. No closed-form; requires iterative optimization.
- **Elastic net** ($\\alpha \\|x\\|_1 + (1-\\alpha) \\|x\\|^2$): combines L1 and L2, balancing sparsity and stability.
- **Generalized Tikhonov** ($\\|L x\\|^2$ for some matrix $L$): penalizes specific structure (e.g., $L$ = derivative matrix penalizes non-smoothness).

The L2 case (Tikhonov / ridge) is the most analytically tractable and the foundation of the rest. It's also the most direct fix for the rank-deficiency / ill-conditioning issues of ordinary least-squares.

**Regularization in modern ML.** Almost every modern machine learning method incorporates some form of regularization, often implicitly:
- Neural networks: weight decay (literal L2 regularization), dropout, early stopping.
- Random forests: tree depth limits, minimum samples per leaf.
- Support vector machines ([[svm|SVM]]): the margin maximization is a form of regularization.
- Deep learning: batch normalization, data augmentation — implicit regularizers.

The general principle: pure error minimization tends to overfit; adding structural constraints or penalties improves generalization.
    `.trim(),

    definitions: [
      {
        term: 'Tikhonov regularization (ridge regression)',
        body: 'The least-squares variant minimizing $\\|Ax - b\\|^2 + \\lambda \\|x\\|^2$ for some $\\lambda > 0$. Closed-form solution: $\\hat{x}_\\lambda = (A^T A + \\lambda I)^{-1} A^T b$.',
      },
      {
        term: 'Regularization parameter',
        body: 'The scalar $\\lambda > 0$ controlling the strength of the penalty. Small $\\lambda$ → close to ordinary least-squares; large $\\lambda$ → shrinks $\\hat{x}$ toward zero.',
      },
      {
        term: 'L1 regularization (lasso)',
        body: 'The least-squares variant minimizing $\\|Ax - b\\|^2 + \\lambda \\|x\\|_1$. Promotes sparsity: many coefficients become exactly zero.',
      },
    ],

    theorems: [
      {
        name: 'Closed-form ridge solution',
        statement: 'For $\\lambda > 0$ and any matrix $A$, the regularized least-squares problem $\\min_x \\|Ax - b\\|^2 + \\lambda \\|x\\|^2$ has a unique solution $\\hat{x}_\\lambda = (A^T A + \\lambda I)^{-1} A^T b$.',
        intuition: '$A^T A$ is symmetric positive semi-definite, with all eigenvalues $\\geq 0$. Adding $\\lambda I$ shifts every eigenvalue by $\\lambda > 0$, making them all strictly positive. The result is symmetric positive definite, hence invertible.',
      },
      {
        name: 'Limit as $\\lambda \\to 0$ and $\\lambda \\to \\infty$',
        statement: 'As $\\lambda \\to 0^+$, $\\hat{x}_\\lambda$ converges to the minimum-norm least-squares solution. As $\\lambda \\to \\infty$, $\\hat{x}_\\lambda \\to 0$.',
        intuition: 'Small $\\lambda$ recovers ordinary least squares (with the regularization handling rank-deficiency by selecting the minimum-norm solution). Large $\\lambda$ overweights the penalty, driving $\\hat{x}$ to the origin.',
      },
    ],

    keyFormulas: [
      '\\hat{x}_\\lambda = \\arg\\min_x \\|Ax - b\\|^2 + \\lambda \\|x\\|^2',
      '(A^T A + \\lambda I) \\hat{x}_\\lambda = A^T b',
      '\\hat{x}_\\lambda = (A^T A + \\lambda I)^{-1} A^T b',
    ],
  },

  explore: {
    vizComponent: 'RegularizedLeastSquaresViz',
    description: 'A 2D scatter plot with adjustable noise level and a polynomial-fitting model. The user picks a polynomial degree (e.g., $5$) and adjusts $\\lambda$ via slider. With $\\lambda = 0$ (no regularization), the curve overfits the noisy data — wiggling sharply between data points. As $\\lambda$ increases, the curve smooths out, eventually flattening to zero. The viz shows the L-curve (log $\\|x\\|$ vs log $\\|Ax - b\\|$) as $\\lambda$ varies, with the "corner" highlighted.',
    misconception: {
      title: 'The regularization parameter $\\lambda$ is NOT optimized to zero — picking $\\lambda$ is a separate problem',
      body: `
A common misconception: thinking that $\\lambda$ should be optimized along with $x$ to minimize the objective. It cannot — increasing $\\lambda$ always increases the regularized objective $\\|Ax - b\\|^2 + \\lambda \\|x\\|^2$ for any fixed $x$. So the "optimal $\\lambda$" by direct optimization is $\\lambda = 0$, which defeats the purpose.

Picking $\\lambda$ is a **model selection** problem, not an optimization problem within the same objective. You need an *external* criterion: cross-validation, L-curve, discrepancy principle, etc. These criteria use information beyond the training data — held-out data, noise level estimates, prior knowledge about $\\|x\\|$.

A second misconception: thinking that L1 (lasso) regularization is always better than L2 (ridge) because "sparsity is good." Sparsity is not always desirable. L2 regularization is more stable, has a closed-form solution, and works well when all features are weakly informative. L1 is appropriate when you have reason to believe the true $x$ is sparse — only a few coefficients are nonzero. Choosing between them is a modeling decision, not a universal preference.

A third trap: thinking that regularization "always helps." It can hurt: with too much regularization, the model is too biased and underfits. The error vs. $\\lambda$ curve is U-shaped — there's an optimal $\\lambda^*$ where the bias-variance tradeoff is balanced, with both smaller and larger $\\lambda$ giving worse models. Cross-validation finds this optimal point empirically.

A fourth misconception: thinking regularization is only needed when $A$ is singular. It's also valuable for *well-conditioned* $A$ when the data is noisy. Even when ordinary least squares has a unique solution, regularization can give a model that generalizes better to new data — the bias-variance tradeoff favors moderate regularization in noisy settings.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Set up a ridge regression problem',
        body: 'Suppose $A = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1.001 \\\\ 1 & 1 \\end{pmatrix}$ and $b = (1, 2, 3)^T$. The columns of $A$ are nearly linearly dependent — $A^T A$ has a tiny eigenvalue, making ordinary least squares numerically unstable. Compute $A^T A = \\begin{pmatrix} 3 & 3.001 \\\\ 3.001 & 3.002001 \\end{pmatrix}$, which has determinant $\\approx 10^{-6}$ — extremely small.',
      },
      {
        title: 'Add ridge penalty',
        body: 'With $\\lambda = 0.01$: $A^T A + \\lambda I = \\begin{pmatrix} 3.01 & 3.001 \\\\ 3.001 & 3.012001 \\end{pmatrix}$, with determinant $\\approx 0.069$ — much more numerically stable. Solving gives a stable $\\hat{x}_\\lambda$, even though ordinary least squares would amplify roundoff catastrophically.',
      },
    ],

    problems: [
      {
        id: 'P-6.5a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For the regularized least-squares problem $\\min_x \\|Ax - b\\|^2 + \\lambda \\|x\\|^2$ with $\\lambda > 0$, which statement is TRUE?',
        choices: [
          { label: 'A' as const, body: 'The solution is unique only when $A$ has full column rank.' },
          { label: 'B' as const, body: 'The solution is unique for any $A$ and $\\lambda > 0$.' },
          { label: 'C' as const, body: 'As $\\lambda \\to \\infty$, $\\hat{x}_\\lambda$ approaches the ordinary least-squares solution.' },
          { label: 'D' as const, body: 'The regularized normal equations are $(A^T A) \\hat{x}_\\lambda = A^T b + \\lambda x$.' },
          { label: 'E' as const, body: 'Regularization makes the residual $b - A\\hat{x}_\\lambda$ smaller than the unregularized residual.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'For any $A$ and $\\lambda > 0$, the matrix $A^T A + \\lambda I$ is symmetric positive definite (eigenvalues of $A^T A$ are $\\geq 0$; adding $\\lambda I$ shifts them to $\\geq \\lambda > 0$). So $(A^T A + \\lambda I)^{-1}$ exists, and the solution $\\hat{x}_\\lambda = (A^T A + \\lambda I)^{-1} A^T b$ is unique. This holds even when $A$ is rank-deficient — that\'s the structural advantage of regularization.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Regularization fixes the rank-deficiency issue. Even rank-deficient $A$ gives a unique regularized solution.' },
            { choice: 'C' as const, why: 'As $\\lambda \\to \\infty$, $\\hat{x}_\\lambda \\to 0$, NOT to the unregularized solution. The unregularized solution is the limit as $\\lambda \\to 0^+$.' },
            { choice: 'D' as const, why: 'The correct normal equations are $(A^T A + \\lambda I) \\hat{x}_\\lambda = A^T b$. The proposed equation has $\\lambda x$ on the right side — incoherent (treats $x$ as a parameter on the wrong side).' },
            { choice: 'E' as const, why: 'Regularization makes the residual $b - A\\hat{x}_\\lambda$ LARGER than the unregularized residual. The whole point is to trade off some fit for stability — accepting a larger residual to get a smaller $\\hat{x}_\\lambda$.' },
          ],
        },
      },
      {
        id: 'P-6.5b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A statistician is fitting a linear model with 50 features and 100 data points. The data has substantial noise. Which justification for using regularized least-squares is MOST appropriate?',
        choices: [
          { label: 'A' as const, body: 'The matrix $A^T A$ is singular, so ordinary least-squares has no solution.' },
          { label: 'B' as const, body: 'Regularization gives a unique solution where ordinary least-squares does not.' },
          { label: 'C' as const, body: 'Regularization improves prediction accuracy on new data by reducing overfitting, even though ordinary least-squares has a unique solution here.' },
          { label: 'D' as const, body: 'Regularization makes the residual smaller, improving the fit.' },
          { label: 'E' as const, body: 'Regularization is required by statistical theory whenever the number of features exceeds 30.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'With 100 data points and 50 features, the design matrix $A$ is tall ($100 \\times 50$). If the features are linearly independent (the typical case), $A^T A$ is invertible and ordinary least-squares has a unique solution. So (A) and (B) are wrong. Regularization here serves a *statistical* purpose: it reduces variance (overfitting to noise) at the cost of introducing some bias. The bias-variance tradeoff favors moderate regularization in noisy settings, even when the system is well-determined.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'With $m = 100, n = 50$, $A^T A$ is generically invertible — unless the features are exactly collinear, which is unusual in practice.' },
            { choice: 'B' as const, why: 'Same issue. The unregularized solution exists and is unique here.' },
            { choice: 'D' as const, why: 'Regularization makes the training residual LARGER, not smaller. The benefit is on test data — the regularized model generalizes better.' },
            { choice: 'E' as const, why: 'There is no such rule. The decision to regularize depends on noise level, model complexity, and the bias-variance tradeoff — not a hard cutoff at 30 features.' },
          ],
        },
      },
    ],
  },
};
