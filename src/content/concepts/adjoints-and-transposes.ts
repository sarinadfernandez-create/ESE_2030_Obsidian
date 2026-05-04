import type { Concept } from '../types';

export const adjointsAndTransposes: Concept = {
  id: 'adjoints-and-transposes',
  unitId: 'ch5',
  number: '5.5',
  title: 'Adjoints & Transposes',
  blurb: 'The "moved across the inner product" version of a linear transformation.',
  tier: 'full',

  learn: {
    overview: `
Given a [[linear-transformation-defs|linear transformation]] $T: V \\to W$ between two [[dot-and-inner-products|inner product spaces]], the **adjoint** of $T$ is a unique linear transformation $T^*: W \\to V$ characterized by the equation

$$\\langle T(v), w \\rangle_W = \\langle v, T^*(w) \\rangle_V \\quad \\text{for all } v \\in V, w \\in W.$$

The adjoint "moves $T$ across the inner product." Whatever $T$ does in the codomain inner product, $T^*$ achieves the equivalent thing in the domain inner product. The Riesz representation theorem guarantees that for each fixed $w \\in W$, the linear functional $v \\mapsto \\langle T(v), w \\rangle$ is uniquely represented by some vector in $V$ — and that vector is $T^*(w)$.

**For matrices in standard coordinates**, the adjoint is just the transpose. If $T(x) = Ax$ for a matrix $A \\in \\mathbb{R}^{m \\times n}$, then $T^*(y) = A^T y$ for $y \\in \\mathbb{R}^m$. The defining property $\\langle T(x), y \\rangle = \\langle x, T^*(y) \\rangle$ becomes $\\langle Ax, y \\rangle = \\langle x, A^T y \\rangle$, which is the standard identity $(Ax)^T y = x^T A^T y$. So in [[orthonormal-bases|standard coordinates]], adjoint and transpose are the same. In non-orthonormal bases or non-standard inner products, they differ — the adjoint accounts for the inner product structure, while the transpose is purely a matrix operation.

The adjoint has several important properties:

- **Domain and codomain swap**: $T: V \\to W$ has adjoint $T^*: W \\to V$. The directions are reversed.
- **Double adjoint**: $(T^*)^* = T$. Taking the adjoint twice recovers the original.
- **Linearity in $T$**: $(c S + d T)^* = c S^* + d T^*$.
- **Composition reverses order**: $(T \\circ S)^* = S^* \\circ T^*$. Same pattern as transpose: $(AB)^T = B^T A^T$.
- **Adjoint of inverse**: If $T$ is invertible, $(T^{-1})^* = (T^*)^{-1}$.

A central application: a linear transformation $T: V \\to V$ is called **self-adjoint** if $T^* = T$. For matrices in standard coordinates, this is the same as **symmetric** ($A^T = A$). Self-adjoint operators are extremely well-behaved: they have real eigenvalues, an orthonormal basis of eigenvectors, and they appear throughout physics and statistics (covariance matrices, Hamiltonians, projections). The [[principal-components|spectral theorem]] is the deep result that every self-adjoint operator is diagonalizable in an orthonormal basis.

The adjoint also provides the link between the [[image-and-kernel|image and kernel]] of $T$ and those of $T^*$. The four fundamental subspaces of $T$ relate via:

- $\\ker(T^*) = \\text{im}(T)^\\perp$ (the "left null space" of $A$, in matrix terms).
- $\\text{im}(T^*) = \\ker(T)^\\perp$ (the "row space" of $A$, in matrix terms).

These identities are the [[geometric-fundamental-theorem|geometric form]] of the Fundamental Theorem of Linear Algebra, and they explain why row space and column space are mirror images of each other under transposition. They are also the foundation of [[least-squares|least-squares]] and the [[svd-form|SVD]].

A subtle point: the matrix-of-the-adjoint depends on the bases chosen. In an orthonormal basis, the matrix of $T^*$ is the transpose of the matrix of $T$. In a general basis, the relationship is $[T^*]_\\mathcal{B} = G^{-1} [T]_\\mathcal{B}^T G$, where $G$ is the [[dot-and-inner-products|Gram matrix]] of the basis. So "adjoint = transpose" holds only in orthonormal bases — the simplest case, and the one used most often in practice.
    `.trim(),

    definitions: [
      {
        term: 'Adjoint',
        body: 'For a linear $T: V \\to W$ between inner product spaces, the adjoint $T^*: W \\to V$ is the unique linear map satisfying $\\langle T(v), w \\rangle_W = \\langle v, T^*(w) \\rangle_V$ for all $v \\in V, w \\in W$.',
      },
      {
        term: 'Transpose',
        body: 'For a matrix $A \\in \\mathbb{R}^{m \\times n}$: the matrix $A^T \\in \\mathbb{R}^{n \\times m}$ with entries $(A^T)_{ij} = A_{ji}$. Equal to the matrix of the adjoint in standard orthonormal coordinates.',
      },
      {
        term: 'Self-adjoint',
        body: 'A linear $T: V \\to V$ with $T^* = T$. For real matrices in standard coordinates: equivalent to symmetric ($A^T = A$).',
      },
    ],

    theorems: [
      {
        name: 'Existence and uniqueness of adjoint',
        statement: 'For a linear $T: V \\to W$ between finite-dimensional inner product spaces, the adjoint $T^*$ exists and is unique.',
        intuition: 'For each $w \\in W$, the map $v \\mapsto \\langle T(v), w \\rangle$ is a linear functional on $V$. The Riesz representation theorem says every such functional is represented by a unique vector in $V$ — and we call that vector $T^*(w)$.',
      },
      {
        name: 'Adjoint = transpose in standard orthonormal coordinates',
        statement: 'If $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ is given by $T(x) = Ax$ with the standard dot product on both sides, then $T^*(y) = A^T y$.',
        intuition: 'The defining property $\\langle Ax, y \\rangle = \\langle x, T^*(y) \\rangle$ is $(Ax)^T y = x^T A^T y$, which holds for $T^*(y) = A^T y$. In a non-orthonormal basis or non-standard inner product, the matrix of the adjoint differs from the transpose.',
      },
      {
        name: 'Composition reverses adjoint',
        statement: '$(T \\circ S)^* = S^* \\circ T^*$.',
        intuition: 'Adjoint takes "do $S$, then $T$" and turns it into "undo $T$ across the inner product, then undo $S$." Mirrors the transpose identity $(AB)^T = B^T A^T$.',
      },
      {
        name: 'Image and kernel via adjoint',
        statement: 'For a linear $T: V \\to W$ between finite-dimensional inner product spaces: $\\ker(T^*) = \\text{im}(T)^\\perp$ and $\\text{im}(T^*) = \\ker(T)^\\perp$.',
        intuition: 'The image of $T$ and the kernel of $T^*$ are orthogonal complements in $W$. Similarly, the image of $T^*$ and the kernel of $T$ are orthogonal complements in $V$. This is the [[geometric-fundamental-theorem|geometric form of the Fundamental Theorem]].',
      },
    ],

    keyFormulas: [
      '\\langle T(v), w \\rangle = \\langle v, T^*(w) \\rangle',
      '(A x)^T y = x^T (A^T y) \\quad \\text{(standard coordinates)}',
      '(T^*)^* = T',
      '(T \\circ S)^* = S^* \\circ T^*',
      '\\ker(T^*) = \\text{im}(T)^\\perp',
    ],
  },

  explore: {
    vizComponent: 'AdjointViz',
    description: 'Pick a linear $T: \\mathbb{R}^2 \\to \\mathbb{R}^3$ via a $3 \\times 2$ matrix. The viz shows $T$ acting on $\\mathbb{R}^2$ and the adjoint $T^*$ acting on $\\mathbb{R}^3$, with the four fundamental subspaces highlighted in both. Drag the matrix entries to see how the kernel and image of $T$ deform alongside the kernel and image of $T^*$, with the orthogonality $\\ker(T^*) = \\text{im}(T)^\\perp$ remaining visible.',
    misconception: {
      title: 'The adjoint equals the transpose only in orthonormal bases',
      body: `
A persistent oversimplification is treating "adjoint" and "transpose" as synonyms. They coincide only in [[orthonormal-bases|orthonormal bases]] under the standard inner product. In other settings, the adjoint accounts for the inner product structure, while the transpose is a coordinate-free matrix operation.

For example, with the weighted inner product $\\langle u, v \\rangle_M = u^T M v$ on $\\mathbb{R}^n$ (where $M$ is symmetric positive definite), the adjoint of $T(x) = Ax$ is given by $T^*(y) = M^{-1} A^T M y$. Only when $M = I$ does this collapse to the transpose. The matrix $M$ records the inner product structure; the adjoint must account for it.

A second misconception: confusing the adjoint with the inverse. The adjoint $T^*$ exists for any linear transformation between inner product spaces, regardless of whether $T$ is invertible. The inverse $T^{-1}$ exists only when $T$ is bijective. They coincide only for [[orthogonal-transformations|orthogonal transformations]], where $T^* = T^{-1}$ — a defining property of orthogonal/unitary operators, not a general fact.

A third trap: confusing the adjoint with the **pseudoinverse**. The pseudoinverse $T^\\dagger$ is the "best inverse" in the least-squares sense and equals $(A^T A)^{-1} A^T$ for full-column-rank matrices. The adjoint $T^*$ is just the inner-product-respecting transpose. They are different objects: the pseudoinverse minimizes $\\|Ax - b\\|$, while the adjoint preserves inner products.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify the defining property of the adjoint',
        body: 'For $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ and the standard dot product on $\\mathbb{R}^2$: claim $A^T = \\begin{pmatrix} 1 & 0 \\\\ 2 & 3 \\end{pmatrix}$ is the adjoint. Verify by picking $x = (1, 1)^T$ and $y = (1, 0)^T$: $\\langle Ax, y \\rangle = \\langle (3, 3)^T, (1, 0)^T \\rangle = 3$; $\\langle x, A^T y \\rangle = \\langle (1, 1)^T, (1, 2)^T \\rangle = 1 + 2 = 3$. ✓',
      },
    ],

    problems: [
      {
        id: 'P-5.5a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $T: V \\to V$ be a linear transformation on a finite-dimensional inner product space, with adjoint $T^*$. Which property characterizes the adjoint?',
        choices: [
          { label: 'A' as const, body: '$T^* = T^{-1}$ whenever $T$ is invertible.' },
          { label: 'B' as const, body: '$T^*$ is the transpose of the matrix representation of $T$ in any basis.' },
          { label: 'C' as const, body: '$(T^*)^* = -T$ for all linear transformations $T$.' },
          { label: 'D' as const, body: '$T^*$ exists only when $T$ preserves the inner product.' },
          { label: 'E' as const, body: '$\\langle T(v), w \\rangle = \\langle v, T^*(w) \\rangle$ for all $v, w \\in V$.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'The defining property of the adjoint is exactly the equation $\\langle T(v), w \\rangle = \\langle v, T^*(w) \\rangle$, holding for all $v$ and $w$. This is the characterization, and the existence of a unique $T^*$ satisfying it is guaranteed by the Riesz representation theorem.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses adjoint with inverse. They are equal only for [[orthogonal-transformations|orthogonal transformations]], a special class. Most invertible transformations have $T^* \\neq T^{-1}$.' },
            { choice: 'B' as const, why: 'Only true in orthonormal bases. In a general basis, $[T^*] \\neq [T]^T$ — the discrepancy involves the Gram matrix of the basis.' },
            { choice: 'C' as const, why: '$(T^*)^* = T$, with NO sign change. Taking adjoint twice recovers the original.' },
            { choice: 'D' as const, why: 'Adjoint exists for ALL linear transformations on finite-dimensional inner product spaces. Inner-product preservation is a separate condition (the orthogonal-transformation condition).' },
          ],
        },
      },
      {
        id: 'P-5.5b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $T: \\mathbb{R}^3 \\to \\mathbb{R}^2$ be defined by $T(x_1, x_2, x_3) = (x_1 + 2 x_3, x_2 - x_3)$, with the standard dot product on both spaces. Which statement about the adjoint $T^*$ is true?',
        choices: [
          { label: 'A' as const, body: '$T^*: \\mathbb{R}^2 \\to \\mathbb{R}^3$ is surjective.' },
          { label: 'B' as const, body: '$T^*: \\mathbb{R}^3 \\to \\mathbb{R}^2$ and has the same kernel as $T$.' },
          { label: 'C' as const, body: '$\\text{im}(T^*) = \\ker(T)$.' },
          { label: 'D' as const, body: '$T^*: \\mathbb{R}^2 \\to \\mathbb{R}^3$ is injective.' },
          { label: 'E' as const, body: '$T^*$ does not exist because $T$ is not invertible.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'The matrix of $T$ is $A = \\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 1 & -1 \\end{pmatrix}$, so the matrix of $T^*$ is $A^T = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 2 & -1 \\end{pmatrix}$, mapping $\\mathbb{R}^2 \\to \\mathbb{R}^3$. This $3 \\times 2$ matrix has rank $2$ (its two columns are linearly independent — the first two rows form $I_2$), so $T^*$ is injective.',
          partialCredit: '(C) earns partial credit. The student recognizes the [[geometric-fundamental-theorem|FTLA-related identity]] but states it incorrectly: the correct identity is $\\text{im}(T^*) = \\ker(T)^\\perp$ (orthogonal complement, not equality). Here $\\ker(T)$ is 1-dimensional and $\\text{im}(T^*)$ is 2-dimensional in $\\mathbb{R}^3$ — orthogonal complements, not equal.',
          trickAnalysis: [
            { choice: 'A' as const, why: '$T^*$ maps into $\\mathbb{R}^3$ with a 2-dimensional image, so it misses a 1-dimensional piece — not surjective.' },
            { choice: 'B' as const, why: 'Two errors: (i) reverses the domain and codomain — $T^*: \\mathbb{R}^2 \\to \\mathbb{R}^3$, not the other way; (ii) the kernels are different. $\\ker(T)$ is 1-dimensional in $\\mathbb{R}^3$; $\\ker(T^*)$ is $\\{0\\}$ in $\\mathbb{R}^2$.' },
            { choice: 'C' as const, why: 'Off by a complement. Earns partial credit.' },
            { choice: 'E' as const, why: 'Adjoints exist for all linear maps between inner product spaces. Invertibility is irrelevant.' },
          ],
        },
      },
      {
        id: 'P-5.5c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A linear transformation $T: V \\to V$ on an inner product space is called self-adjoint if $T^* = T$. For such a transformation, which statement must be TRUE?',
        choices: [
          { label: 'A' as const, body: '$T$ is invertible.' },
          { label: 'B' as const, body: '$\\langle T(v), w \\rangle = \\langle v, T(w) \\rangle$ for all $v, w \\in V$.' },
          { label: 'C' as const, body: '$T$ preserves inner products: $\\langle T(v), T(w) \\rangle = \\langle v, w \\rangle$.' },
          { label: 'D' as const, body: '$T^2 = I$ (the identity transformation).' },
          { label: 'E' as const, body: '$T$ maps every vector to its orthogonal projection onto some subspace.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Self-adjointness means $T^* = T$. Plugging into the defining property of the adjoint: $\\langle T(v), w \\rangle = \\langle v, T^*(w) \\rangle = \\langle v, T(w) \\rangle$. So $T$ "moves freely" from one side of the inner product to the other.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Self-adjoint operators can be singular. The orthogonal projection onto a proper subspace is self-adjoint but has a nontrivial kernel.' },
            { choice: 'C' as const, why: 'Inner-product preservation is the [[orthogonal-transformations|orthogonal-transformation]] condition: $T^* T = I$, NOT $T^* = T$. These are different.' },
            { choice: 'D' as const, why: '$T^2 = I$ would make $T$ an involution — a special case (e.g., reflection), not the general case of self-adjoint.' },
            { choice: 'E' as const, why: 'Some self-adjoint operators are projections, but not all. Self-adjointness is a broader condition.' },
          ],
        },
      },
    ],
  },
};
