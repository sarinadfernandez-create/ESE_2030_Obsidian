import type { Concept } from '../types';

export const dotAndInnerProducts: Concept = {
  id: 'dot-and-inner-products',
  unitId: 'ch5',
  number: '5.1',
  title: 'Dot & Inner Products',
  blurb: 'Generalize the dot product to any vector space — and unlock geometry beyond $\\mathbb{R}^n$.',
  tier: 'full',

  learn: {
    overview: `
The standard **dot product** in $\\mathbb{R}^n$, $u \\cdot v = \\sum_i u_i v_i$, is what makes Euclidean geometry work. It defines the length of a vector ($\\|v\\| = \\sqrt{v \\cdot v}$), the angle between two vectors ($\\cos\\theta = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$), and the test for [[angles-and-orthogonality|orthogonality]] ($u \\cdot v = 0$). Without the dot product, $\\mathbb{R}^n$ is just a coordinate space; with it, $\\mathbb{R}^n$ becomes Euclidean geometry.

An **inner product** on a [[vector-space-axioms|vector space]] $V$ generalizes the dot product to any vector space — including [[vector-space-examples|polynomial spaces, function spaces, matrix spaces]]. An inner product is a function $\\langle \\cdot, \\cdot \\rangle: V \\times V \\to \\mathbb{R}$ satisfying three axioms:

1. **Symmetry**: $\\langle u, v \\rangle = \\langle v, u \\rangle$.
2. **Bilinearity**: $\\langle a u_1 + b u_2, v \\rangle = a \\langle u_1, v \\rangle + b \\langle u_2, v \\rangle$ (and similarly in the second argument by symmetry).
3. **Positive definiteness**: $\\langle v, v \\rangle \\geq 0$ for all $v$, with equality iff $v = 0$.

Once you have an inner product on $V$, you have a notion of length ($\\|v\\| = \\sqrt{\\langle v, v \\rangle}$), angle ($\\cos\\theta = \\langle u, v \\rangle / (\\|u\\| \\|v\\|)$), and orthogonality ($u \\perp v \\iff \\langle u, v \\rangle = 0$). All the geometric tools of Euclidean space transfer to $V$.

Standard examples of inner products:

- **Dot product on $\\mathbb{R}^n$**: $\\langle u, v \\rangle = u \\cdot v = \\sum u_i v_i$.
- **Weighted inner product**: $\\langle u, v \\rangle_M = u^T M v$ for a [[similarity|symmetric positive-definite]] matrix $M$. Generalizes the dot product by weighting some directions more than others.
- **$L^2$ inner product on $C([a, b])$**: $\\langle f, g \\rangle = \\int_a^b f(t) g(t) \\, dt$. Makes function spaces into [[engineering-signals|inner product spaces]] for signal processing.
- **Frobenius inner product on matrices**: $\\langle A, B \\rangle_F = \\text{tr}(A^T B) = \\sum_{i, j} a_{ij} b_{ij}$. Makes matrix space into an inner product space, useful for matrix factorization and machine learning.

A critical caveat: not every symmetric bilinear function is an inner product. Positive definiteness is the strict requirement that distinguishes "inner products" from "indefinite forms." A symmetric bilinear form that fails positive definiteness gives some vectors a "negative length squared" — geometrically inconsistent — and so does not define a geometry.

For a weighted inner product $\\langle u, v \\rangle_M = u^T M v$, the matrix $M$ must be symmetric ($M^T = M$) for the form to be symmetric, and positive definite ($v^T M v > 0$ for all $v \\neq 0$) for the form to be a valid inner product. Positive definiteness is equivalent to: all eigenvalues of $M$ are positive, all leading principal minors are positive (Sylvester's criterion), or $M = A^T A$ for some matrix $A$ with linearly independent columns.

The choice of inner product on $V$ is an additional structure beyond the vector space itself. Different inner products give different geometries on the same vector space — different notions of "length" and "angle." Two vectors that are orthogonal under one inner product can be non-orthogonal under another. This freedom is exploited in many applications: data analysis weights different features differently; physics weights different coordinates by physical units; signal processing weights frequencies according to perceptual relevance.
    `.trim(),

    definitions: [
      {
        term: 'Dot product',
        body: 'In $\\mathbb{R}^n$: $u \\cdot v = \\sum_i u_i v_i$. The standard inner product on Euclidean space.',
      },
      {
        term: 'Inner product',
        body: 'A function $\\langle \\cdot, \\cdot \\rangle: V \\times V \\to \\mathbb{R}$ on a vector space $V$ satisfying symmetry, bilinearity, and positive definiteness.',
      },
      {
        term: 'Inner product space',
        body: 'A vector space $V$ together with a chosen inner product $\\langle \\cdot, \\cdot \\rangle$.',
      },
      {
        term: 'Norm induced by an inner product',
        body: '$\\|v\\| = \\sqrt{\\langle v, v \\rangle}$. Always nonnegative; zero only when $v = 0$.',
      },
      {
        term: 'Weighted inner product',
        body: '$\\langle u, v \\rangle_M = u^T M v$ for a symmetric positive-definite matrix $M$. Reduces to the standard dot product when $M = I$.',
      },
      {
        term: 'Frobenius inner product',
        body: 'On $\\mathbb{R}^{m \\times n}$: $\\langle A, B \\rangle_F = \\text{tr}(A^T B) = \\sum_{i, j} a_{ij} b_{ij}$. The dot product applied to matrices laid out as $mn$-dimensional vectors.',
      },
    ],

    theorems: [
      {
        name: 'Inner product axioms imply norm properties',
        statement: 'For any inner product on $V$: (i) $\\|c v\\| = |c| \\|v\\|$ (homogeneity), (ii) $\\|v\\| \\geq 0$ with equality iff $v = 0$ (positivity), (iii) $\\|u + v\\| \\leq \\|u\\| + \\|v\\|$ (triangle inequality).',
        intuition: 'These three properties make the induced norm a genuine measure of length, satisfying everyday geometric intuition. The triangle inequality follows from the Cauchy-Schwarz inequality (5.2).',
      },
      {
        name: 'Positive definiteness criterion for $u^T M v$',
        statement: 'For a symmetric matrix $M$, the form $\\langle u, v \\rangle_M = u^T M v$ is an inner product on $\\mathbb{R}^n$ iff $M$ is positive definite, equivalent to: all eigenvalues of $M$ are positive.',
        intuition: 'A positive-definite matrix has all positive eigenvalues, which means that for any nonzero $v$, $v^T M v > 0$. This is precisely the positive definiteness condition for the form.',
      },
    ],

    keyFormulas: [
      'u \\cdot v = \\sum_i u_i v_i',
      '\\langle u, v \\rangle_M = u^T M v',
      '\\langle f, g \\rangle = \\int_a^b f(t) g(t) \\, dt',
      '\\langle A, B \\rangle_F = \\text{tr}(A^T B)',
      '\\|v\\| = \\sqrt{\\langle v, v \\rangle}',
    ],
  },

  explore: {
    vizComponent: 'InnerProductViz',
    description: 'Place two vectors $u, v$ in $\\mathbb{R}^2$ and choose an inner product: standard dot product, or a weighted inner product with adjustable matrix $M$. The viz shows the inner product value, the lengths $\\|u\\|, \\|v\\|$, and the angle. Watch how changing $M$ deforms the implied geometry — circles become ellipses, "perpendicular" rotates to a different angle.',
    misconception: {
      title: 'Not every symmetric bilinear form is an inner product — positive definiteness is the strict requirement',
      body: `
A common error: forgetting to check positive definiteness when verifying that a proposed function is an inner product. Symmetry and bilinearity are easier to verify but not sufficient.

A specific example: on $\\mathbb{R}^2$, the form $\\langle u, v \\rangle = u_1 v_1 - u_2 v_2$ is symmetric and bilinear. But $\\langle (0, 1), (0, 1) \\rangle = -1 < 0$, so it fails positive definiteness. This form is NOT an inner product. (It is the Lorentzian form from special relativity — useful for spacetime geometry, not Euclidean geometry.)

For weighted inner products $u^T M v$, the matrix $M$ must be both symmetric (for symmetry of the form) and positive definite (for positive definiteness). Symmetric matrices that are not positive definite — having one or more negative eigenvalues — yield indefinite forms, which do not define geometries.

A second misconception: thinking the standard dot product is the "right" inner product on $\\mathbb{R}^n$, with all others being some kind of approximation. Many problems benefit from non-standard inner products. Statistics weighted-likelihood inner products give "Mahalanobis distance" by accounting for variable correlation. Physics inner products on configuration spaces respect physical units. Different inner products are different *geometric structures* on the same vector space.

A third trap: confusing $\\langle u, v \\rangle = 0$ (orthogonality, a single-number statement) with $u \\cdot v = 0$ in some specific inner product. Two vectors can be orthogonal under one inner product but not another — orthogonality depends on the chosen inner product, not just on the vectors.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Test positive definiteness of a weighted inner product',
        body: 'Consider $\\langle u, v \\rangle_M = u^T M v$ on $\\mathbb{R}^2$ with $M = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$. $M$ is symmetric. Check positive definiteness via Sylvester: top-left $1 \\times 1$ minor is $2 > 0$ ✓; full determinant is $2 \\cdot 3 - 1 \\cdot 1 = 5 > 0$ ✓. Both leading principal minors positive, so $M$ is positive definite, and $\\langle \\cdot, \\cdot \\rangle_M$ is a valid inner product.',
      },
    ],

    problems: [
      {
        id: 'P-5.1a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Which of the following defines a valid inner product on $\\mathbb{R}^2$?',
        choices: [
          { label: 'A' as const, body: '$\\langle u, v \\rangle = u_1 v_1 - u_2 v_2$' },
          { label: 'B' as const, body: '$\\langle u, v \\rangle = u_1 v_2 + u_2 v_1$' },
          { label: 'C' as const, body: '$\\langle u, v \\rangle = 2 u_1 v_1 + u_1 v_2 + u_2 v_1 + 3 u_2 v_2$' },
          { label: 'D' as const, body: '$\\langle u, v \\rangle = (u_1 + u_2)(v_1 + v_2)$' },
          { label: 'E' as const, body: '$\\langle u, v \\rangle = u_1 v_1 + u_2 v_2 + 1$' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: '(C) corresponds to $\\langle u, v \\rangle = u^T M v$ with $M = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$. This is symmetric (so the form is symmetric) and positive definite ($\\det(M) = 5 > 0$ and the top-left entry $2 > 0$, satisfying Sylvester\'s criterion). All three inner product axioms hold.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Symmetric and bilinear, but fails positive definiteness: $\\langle (0, 1), (0, 1) \\rangle = -1 < 0$.' },
            { choice: 'B' as const, why: 'Symmetric and bilinear, but fails positive definiteness: $\\langle (1, 0), (1, 0) \\rangle = 0$ for a nonzero vector.' },
            { choice: 'D' as const, why: 'Symmetric and bilinear, but fails positive definiteness: $\\langle (1, -1), (1, -1) \\rangle = (1 + (-1))^2 = 0$ for the nonzero vector $(1, -1)$. (This is a rank-1 form.)' },
            { choice: 'E' as const, why: 'Fails $\\langle 0, 0 \\rangle = 0$ (it gives $1$) and also fails linearity.' },
          ],
        },
      },
      {
        id: 'P-5.1b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider a proposed inner product on $\\mathbb{R}^2$ defined by $\\langle u, v \\rangle = u_1 v_1 + 2 u_1 v_2 + 2 u_2 v_1 + k u_2 v_2$. Which condition on $k$ ensures this satisfies the inner product axioms?',
        choices: [
          { label: 'A' as const, body: '$k \\neq -5$' },
          { label: 'B' as const, body: '$k > -5$' },
          { label: 'C' as const, body: '$k > 0$' },
          { label: 'D' as const, body: '$k > 4$' },
          { label: 'E' as const, body: 'Any real value of $k$ works.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'The form corresponds to $u^T M v$ with $M = \\begin{pmatrix} 1 & 2 \\\\ 2 & k \\end{pmatrix}$, which is symmetric. For positive definiteness via Sylvester: top-left minor $1 > 0$ ✓, full determinant $k - 4 > 0$, so $k > 4$.',
          partialCredit: '(C) earns partial credit — recognizing that some positivity is needed but not finding the precise threshold.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Misunderstands: positive definiteness requires strict positivity, not just nonzero.' },
            { choice: 'B' as const, why: 'Only ensures $\\langle (1, 1), (1, 1) \\rangle = 5 + k > 0$, but does not check vectors like $(1, -1)$ or $(2, -1)$.' },
            { choice: 'C' as const, why: 'Recognizes positivity is needed but uses too weak a threshold. Earns partial credit.' },
            { choice: 'E' as const, why: 'Definitely false — for $k = 0$, the form fails on $(1, -2)$: $\\langle (1, -2), (1, -2) \\rangle = 1 - 4 - 4 + 0 = -7 < 0$.' },
          ],
        },
      },
      {
        id: 'P-5.1c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'In $\\mathbb{R}^2$, consider the weighted inner product $\\langle u, v \\rangle_M = u^T M v$ with $M = \\begin{pmatrix} 3 & 1 \\\\ 1 & 4 \\end{pmatrix}$. Let $a = (1, -2)^T$ and $b = (2, 1)^T$. Which statement is correct?',
        choices: [
          { label: 'A' as const, body: '$a$ and $b$ are orthogonal under both the standard dot product and $\\langle \\cdot, \\cdot \\rangle_M$.' },
          { label: 'B' as const, body: '$a$ and $b$ are orthogonal under $\\langle \\cdot, \\cdot \\rangle_M$ but not under the standard dot product.' },
          { label: 'C' as const, body: '$a$ and $b$ are orthogonal under the standard dot product but not under $\\langle \\cdot, \\cdot \\rangle_M$.' },
          { label: 'D' as const, body: '$a$ and $b$ are not orthogonal under either inner product, but $\\|a\\|_M = \\|a\\|$.' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'Standard dot product: $a \\cdot b = (1)(2) + (-2)(1) = 0$. So $a \\perp b$ in the standard inner product.\n\nWeighted: compute $M b = (3 \\cdot 2 + 1 \\cdot 1, 1 \\cdot 2 + 4 \\cdot 1)^T = (7, 6)^T$. Then $\\langle a, b \\rangle_M = a^T M b = (1)(7) + (-2)(6) = 7 - 12 = -5 \\neq 0$. So $a$ and $b$ are NOT $M$-orthogonal.\n\nThe lesson: orthogonality depends on the choice of inner product. Vectors perpendicular in standard geometry need not be perpendicular in weighted geometry.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Assumes orthogonality under one inner product implies orthogonality under all — false in general.' },
            { choice: 'B' as const, why: 'Reverses the conclusion: gets the standard and weighted computations backward.' },
            { choice: 'D' as const, why: 'Contradicts the calculation. Also: $\\|a\\| = \\sqrt{5}$ while $\\|a\\|_M = \\sqrt{a^T M a} = \\sqrt{3 + 2 \\cdot 1 \\cdot (-2) + 16} = \\sqrt{15}$, so the norms differ.' },
            { choice: 'E' as const, why: '(C) is correct.' },
          ],
        },
      },
      {
        id: 'P-5.1d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the vector space $\\mathbb{R}^{m \\times n}$ equipped with the Frobenius inner product $\\langle A, B \\rangle_F = \\text{tr}(A^T B)$. Which of the following is TRUE?',
        choices: [
          { label: 'A' as const, body: 'For square matrices, $\\|A\\|_F = \\sqrt{\\text{tr}(A^2)}$.' },
          { label: 'B' as const, body: '$\\langle A, B \\rangle_F = 0$ if and only if $A^T B = 0$.' },
          { label: 'C' as const, body: '$\\langle A, B \\rangle_F = \\sum_{i, j} a_{ij} b_{ij}$.' },
          { label: 'D' as const, body: 'This satisfies the inner product axioms only for square matrices.' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'Expanding the trace: $\\text{tr}(A^T B) = \\sum_{j=1}^n \\sum_{i=1}^m a_{ij} b_{ij}$, the standard dot product applied to the $mn$ entries of $A$ and $B$ laid out as vectors. The Frobenius inner product "vectorizes" matrices and applies the ordinary dot product — so all the machinery of inner product spaces applies to matrices.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses $\\text{tr}(A^2)$ with $\\|A\\|_F^2$. The trace sums diagonal entries of $A^2$, while $\\|A\\|_F^2 = \\text{tr}(A^T A)$ involves all entries. Counterexample: $A = \\begin{pmatrix} 0 & 3 \\\\ 0 & 0 \\end{pmatrix}$ has $\\text{tr}(A^2) = 0$ but $\\|A\\|_F^2 = 9$.' },
            { choice: 'B' as const, why: '$A^T B = 0$ (matrix zero) is far stronger than $\\text{tr}(A^T B) = 0$ (scalar zero). The trace can be zero without the product being zero — many off-diagonal entries can cancel.' },
            { choice: 'D' as const, why: 'The Frobenius inner product requires only that $A$ and $B$ have the same dimensions, not that they be square.' },
            { choice: 'E' as const, why: '(C) is correct.' },
          ],
        },
      },
    ],
  },
};
