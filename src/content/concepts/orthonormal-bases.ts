import type { Concept } from '../types';

export const orthonormalBases: Concept = {
  id: 'orthonormal-bases',
  unitId: 'ch5',
  number: '5.3',
  title: 'Orthonormal Bases',
  blurb: 'The most useful basis: pairwise orthogonal, unit-length, and computationally magical.',
  tier: 'full',

  learn: {
    overview: `
An **orthonormal basis** is a [[bases|basis]] $\\mathcal{Q} = \\{q_1, \\dots, q_n\\}$ for an inner product space $V$ that is both [[angles-and-orthogonality|orthogonal]] (pairwise orthogonal: $\\langle q_i, q_j \\rangle = 0$ for $i \\neq j$) and **normalized** (each $q_i$ has unit length: $\\|q_i\\| = 1$). These two conditions can be summarized as $\\langle q_i, q_j \\rangle = \\delta_{ij}$, where $\\delta_{ij}$ is the Kronecker delta.

Orthonormal bases are computationally magical. Working in an orthonormal basis turns several otherwise-painful linear-algebra computations into single inner-product evaluations:

**Coordinates are inner products.** For any vector $v \\in V$, the coordinate of $v$ with respect to $q_i$ is simply $\\langle v, q_i \\rangle$. That is:

$$v = \\sum_{i=1}^{n} \\langle v, q_i \\rangle q_i.$$

No system of equations. No matrix inversion. To find the $i$-th [[coordinates|coordinate]] of $v$, just take the inner product with $q_i$. This is the **Fourier coefficient formula**, and it is the fundamental reason orthonormal bases are central to applied mathematics.

**Norms are easy.** By **Parseval's identity**:

$$\\|v\\|^2 = \\sum_{i=1}^{n} |\\langle v, q_i \\rangle|^2 = \\sum_{i=1}^{n} c_i^2,$$

where $c_i$ are the coordinates of $v$ in the orthonormal basis. The norm of $v$ is the same as the norm of its coordinate vector — the basis acts isometrically. This generalizes the Pythagorean theorem to any number of orthogonal directions.

**Inner products are easy too.** For $u = \\sum a_i q_i$ and $v = \\sum b_i q_i$:

$$\\langle u, v \\rangle = \\sum_{i=1}^{n} a_i b_i.$$

The inner product in the orthonormal basis reduces to the standard dot product of the coordinate vectors. Again the orthonormal basis acts as an isometric isomorphism between $V$ and $\\mathbb{R}^n$ — it preserves not just the vector space structure but also the geometry.

For these reasons, orthonormal bases are the preferred basis for nearly every inner-product-space computation. The remaining question is constructive: given an arbitrary basis, how do we produce an orthonormal one with the same span? The answer is [[gram-schmidt|Gram-Schmidt orthogonalization]], the subject of section 5.4 (the flagship).

A non-obvious feature: orthonormal bases exist in any finite-dimensional inner product space, by Gram-Schmidt. But they also exist in many infinite-dimensional settings — Fourier series exhibit an orthonormal basis of $L^2$ functions on a bounded interval; orthonormal polynomials (Legendre, Chebyshev, Hermite) exist on various intervals with various weights; wavelets give orthonormal bases of multiscale function spaces. The general principle that orthonormal bases simplify computations carries over to these infinite-dimensional cases, with the sums being replaced by integrals or infinite series.

In matrix form, an orthonormal basis $\\{q_1, \\dots, q_n\\}$ of $\\mathbb{R}^n$ can be packaged as the columns of a square matrix $Q$. The orthonormality condition becomes $Q^T Q = I$, which (for a square $Q$) also implies $Q Q^T = I$ — the rows are orthonormal too. Such a $Q$ is called an **[[orthogonal-transformations|orthogonal matrix]]**. So "orthonormal basis" and "orthogonal matrix" are two views of the same object.
    `.trim(),

    definitions: [
      {
        term: 'Orthonormal set',
        body: 'A set $\\{q_1, \\dots, q_k\\}$ in an inner product space is orthonormal if $\\langle q_i, q_j \\rangle = \\delta_{ij}$ — pairwise orthogonal and each unit-length.',
      },
      {
        term: 'Orthonormal basis',
        body: 'An orthonormal set that is also a [[bases|basis]] for $V$. Has exactly $\\dim(V)$ elements.',
      },
      {
        term: 'Fourier coefficient',
        body: 'For an orthonormal basis $\\{q_i\\}$ and a vector $v$: the coordinate $c_i = \\langle v, q_i \\rangle$. Generalizes the classical Fourier coefficients in the trigonometric basis.',
      },
    ],

    theorems: [
      {
        name: 'Coordinates in an orthonormal basis are inner products',
        statement: 'If $\\{q_1, \\dots, q_n\\}$ is an orthonormal basis of $V$ and $v \\in V$, then $v = \\sum_{i=1}^n \\langle v, q_i \\rangle q_i$.',
        intuition: 'Write $v = \\sum c_j q_j$ for some unknown coefficients. Take the inner product of both sides with $q_i$: $\\langle v, q_i \\rangle = \\sum c_j \\langle q_j, q_i \\rangle = c_i$, since orthonormality kills all terms except $j = i$.',
      },
      {
        name: 'Parseval\'s identity',
        statement: 'For an orthonormal basis $\\{q_i\\}$ and any $v \\in V$: $\\|v\\|^2 = \\sum_{i=1}^{n} |\\langle v, q_i \\rangle|^2$.',
        intuition: 'Expanding $\\|v\\|^2 = \\langle v, v \\rangle = \\sum_{i, j} c_i c_j \\langle q_i, q_j \\rangle$ and using orthonormality kills the cross terms, leaving $\\sum c_i^2$. The norm in coordinates is the standard Euclidean norm, regardless of the original space.',
      },
      {
        name: 'Inner products in an orthonormal basis',
        statement: 'For $u = \\sum a_i q_i$ and $v = \\sum b_i q_i$ in an orthonormal basis: $\\langle u, v \\rangle = \\sum a_i b_i$.',
        intuition: 'Same expansion as Parseval, with two different coefficients. Cross terms vanish, leaving the dot product of the coefficient vectors. The inner product is preserved under the coordinate map.',
      },
    ],

    keyFormulas: [
      '\\langle q_i, q_j \\rangle = \\delta_{ij}',
      'v = \\sum_{i=1}^n \\langle v, q_i \\rangle q_i',
      '\\|v\\|^2 = \\sum_{i=1}^n |\\langle v, q_i \\rangle|^2 \\quad \\text{(Parseval)}',
      '\\langle u, v \\rangle = \\sum_{i=1}^n a_i b_i',
    ],
  },

  explore: {
    vizComponent: 'OrthonormalBasisViz',
    description: 'Pick an orthonormal basis of $\\mathbb{R}^2$ — the standard basis, a rotated basis, or a custom one. The viz shows a vector and computes its coordinates in two ways: by solving a linear system, and by taking inner products with the basis vectors. The two methods agree, demonstrating the Fourier-coefficient formula. Try changing the basis to non-orthonormal (just orthogonal, or just normalized) to see how the inner-product formula breaks.',
    misconception: {
      title: 'The inner-product formula for coordinates requires BOTH orthogonality AND normalization',
      body: `
A common error is using the formula $c_i = \\langle v, q_i \\rangle$ when the basis is orthogonal but not normalized. The corrected formula in that case is $c_i = \\langle v, q_i \\rangle / \\|q_i\\|^2$, with the denominator $\\|q_i\\|^2$ accounting for the basis vector's length.

The reasoning: if $q_i$ is not unit-length, then $\\langle q_i, q_i \\rangle = \\|q_i\\|^2$, not $1$. Repeating the derivation $\\langle v, q_i \\rangle = \\sum c_j \\langle q_j, q_i \\rangle = c_i \\|q_i\\|^2$, so $c_i = \\langle v, q_i \\rangle / \\|q_i\\|^2$. The simpler formula is recovered exactly when $\\|q_i\\| = 1$.

This is why the *normalization* part of "orthonormal" matters. Orthogonality alone gets you cross-term cancellation; normalization gets you the clean $c_i = \\langle v, q_i \\rangle$ formula without correction factors.

A second misconception: thinking Parseval's identity holds for any basis. It does not — only for orthonormal bases. For a general basis, the norm of a vector is *not* the sum of squares of its coordinates: cross terms involving inner products of basis vectors enter the formula.

A third trap: confusing the coordinates of $v$ in an orthonormal basis with the coordinates of $v$ in the standard basis. They are the same vector $v$ in both, but the two coordinate vectors are generally different. A vector with standard-basis coordinates $(3, 4)$ has different coordinates in a rotated orthonormal basis — though Parseval guarantees that the norm $\\sqrt{3^2 + 4^2} = 5$ is the same in both.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Apply Parseval to compute a norm from coordinates',
        body: 'Let $\\mathcal{Q} = \\{q_1, q_2, q_3\\}$ be an orthonormal basis of $\\mathbb{R}^3$, and suppose $v$ has $\\langle v, q_1 \\rangle = 4$, $\\langle v, q_2 \\rangle = -1$, $\\langle v, q_3 \\rangle = 3$. By Parseval, $\\|v\\|^2 = 4^2 + (-1)^2 + 3^2 = 16 + 1 + 9 = 26$. So $\\|v\\| = \\sqrt{26}$. The basis-specific information $q_1, q_2, q_3$ is unnecessary — only the orthonormality matters.',
      },
    ],

    problems: [
      {
        id: 'P-5.3a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $\\mathcal{B} = \\{q_1, q_2, q_3\\}$ be an orthonormal basis for $\\mathbb{R}^3$ with the standard inner product. For any vector $v \\in \\mathbb{R}^3$, how can we find the coordinate of $v$ with respect to $q_2$?',
        choices: [
          { label: 'A' as const, body: 'Solve a $3 \\times 3$ linear system $Q c = v$ where $Q = [q_1 \\, | \\, q_2 \\, | \\, q_3]$ and read off the second component of $c$.' },
          { label: 'B' as const, body: 'Compute $\\langle v, q_2 \\rangle$.' },
          { label: 'C' as const, body: 'Compute $\\langle q_2, v \\rangle / \\|q_2\\|^2$.' },
          { label: 'D' as const, body: 'Find the second component of $Q^{-1} v$ where $Q = [q_1 \\, | \\, q_2 \\, | \\, q_3]$.' },
          { label: 'E' as const, body: 'It cannot be determined without knowing the specific vectors.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'For an orthonormal basis, coordinates are simply inner products with the basis vectors: $c_i = \\langle v, q_i \\rangle$. So the coordinate of $v$ with respect to $q_2$ is $\\langle v, q_2 \\rangle$ — a single inner product computation, no linear system needed.',
          partialCredit: '(D) earns partial credit. It is technically correct but unnecessarily complicated. For an orthonormal $Q$, $Q^{-1} = Q^T$, and $(Q^T v)_2 = q_2^T v = \\langle v, q_2 \\rangle$ — the same answer the simpler way.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Solving a linear system works for any basis but is wasteful for orthonormal bases. Orthonormality eliminates the need.' },
            { choice: 'C' as const, why: 'Correct for orthogonal bases that are NOT normalized (the $\\|q_2\\|^2$ correction factor). For an orthonormal basis, $\\|q_2\\|^2 = 1$, so the formula reduces to (B). Including the unnecessary denominator suggests not-quite-internalizing the normalization.' },
            { choice: 'D' as const, why: 'Equivalent to (B) but indirect. Earns partial credit.' },
            { choice: 'E' as const, why: 'Misses the key advantage of orthonormal bases: coordinates can be computed directly from inner products, with no need for the specific vectors.' },
          ],
        },
      },
      {
        id: 'P-5.3b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $\\mathcal{B} = \\{q_1, q_2, q_3\\}$ be an orthonormal basis for $\\mathbb{R}^3$. Suppose $v \\in \\mathbb{R}^3$ satisfies $\\langle v, q_1 \\rangle = 4$, $\\langle v, q_2 \\rangle = -1$, $\\langle v, q_3 \\rangle = 3$. What is $\\|v\\|^2$?',
        choices: [
          { label: 'A' as const, body: '$26$' },
          { label: 'B' as const, body: '$16$' },
          { label: 'C' as const, body: '$6$' },
          { label: 'D' as const, body: '$36$' },
          { label: 'E' as const, body: 'Cannot be determined without knowing the specific basis vectors $q_i$.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Since $\\mathcal{B}$ is orthonormal, the coordinates of $v$ are $(4, -1, 3)^T$, and by Parseval\'s identity, $\\|v\\|^2 = 4^2 + (-1)^2 + 3^2 = 16 + 1 + 9 = 26$.',
          partialCredit: '(D) earns partial credit. It computes $(4 + (-1) + 3)^2 = 6^2 = 36$ — "squares the sum instead of summing the squares." The procedure is understood; the order of operations is not.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Squares only the largest coordinate, missing the contribution of the other two.' },
            { choice: 'C' as const, why: 'Adds the coordinates: $4 + (-1) + 3 = 6$. This is the sum, not the norm. The norm formula squares each term first.' },
            { choice: 'D' as const, why: 'Squares the sum $4 + (-1) + 3 = 6$, getting $36$. Almost right but with the operations in the wrong order. Earns partial credit.' },
            { choice: 'E' as const, why: 'Misses the key advantage of orthonormal bases: the norm can be read off from the coordinates via Parseval, regardless of which orthonormal basis is used.' },
          ],
        },
      },
      {
        id: 'P-5.3c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For a basis $\\{v_1, v_2, v_3\\}$ that is **orthogonal but not orthonormal** (the basis vectors are pairwise perpendicular but not unit-length), which formula correctly computes the coordinate $c_i$ of a vector $v$ with respect to $v_i$?',
        choices: [
          { label: 'A' as const, body: '$c_i = \\langle v, v_i \\rangle$' },
          { label: 'B' as const, body: '$c_i = \\langle v, v_i \\rangle / \\|v_i\\|^2$' },
          { label: 'C' as const, body: '$c_i = \\langle v, v_i \\rangle / \\|v_i\\|$' },
          { label: 'D' as const, body: '$c_i = \\|v\\| \\cos\\theta_i$, where $\\theta_i$ is the angle between $v$ and $v_i$.' },
          { label: 'E' as const, body: 'Coordinates cannot be computed via inner products for non-orthonormal bases.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'For an orthogonal but not orthonormal basis: $v = \\sum c_j v_j$. Take the inner product with $v_i$: $\\langle v, v_i \\rangle = \\sum c_j \\langle v_j, v_i \\rangle = c_i \\|v_i\\|^2$, since the cross terms vanish but $\\langle v_i, v_i \\rangle = \\|v_i\\|^2 \\neq 1$. So $c_i = \\langle v, v_i \\rangle / \\|v_i\\|^2$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'This is the orthonormal-basis formula. For non-normalized bases, you need the $\\|v_i\\|^2$ correction.' },
            { choice: 'C' as const, why: 'Off by one factor of $\\|v_i\\|$. The correct denominator is $\\|v_i\\|^2$, not $\\|v_i\\|$.' },
            { choice: 'D' as const, why: 'A geometric formula that is correct for unit vectors $v_i$ but does not generalize to non-unit basis vectors. Equivalent to (A) when $v_i$ is unit-length.' },
            { choice: 'E' as const, why: 'Coordinates can be computed via inner products for any orthogonal basis — just with a $\\|v_i\\|^2$ correction factor.' },
          ],
        },
      },
    ],
  },
};
