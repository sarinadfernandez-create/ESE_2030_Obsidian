import type { Concept } from '../types';

export const matrixRepresentations: Concept = {
  id: 'matrix-representations',
  unitId: 'ch4',
  number: '4.4',
  title: 'Matrix Representations of Linear Transformations',
  blurb: 'Every linear transformation between finite-dimensional spaces is a matrix — once you choose bases for the domain and codomain.',
  tier: 'full',

  learn: {
    overview: `
A [[linear-transformation-defs|linear transformation]] $T: V \\to W$ between finite-dimensional vector spaces, together with chosen [[bases|bases]] $\\mathcal{B}$ for $V$ and $\\mathcal{C}$ for $W$, can be represented as a single matrix $[T]_\\mathcal{B}^\\mathcal{C}$. This matrix encodes the entire action of $T$, and once you have it, applying $T$ to a vector reduces to multiplying the coordinate vector.

The construction: the $j$-th column of $[T]_\\mathcal{B}^\\mathcal{C}$ is $[T(b_j)]_\\mathcal{C}$ — the image of the $j$-th basis vector of $\\mathcal{B}$, expressed in $\\mathcal{C}$-coordinates. The full matrix records "what $T$ does to each basis vector," which is enough information to determine $T$ everywhere by linearity.

The key formula:

$$[T(v)]_\\mathcal{C} = [T]_\\mathcal{B}^\\mathcal{C} \\, [v]_\\mathcal{B}.$$

Read as: the coordinates of $T(v)$ in the codomain basis equal the matrix times the coordinates of $v$ in the domain basis. This is the algebraic content of "matrix multiplication is function composition" — applying a linear transformation, when both sides are coordinatized, becomes multiplying a matrix by a vector.

If $V = W$ and $\\mathcal{B} = \\mathcal{C}$ (the same basis used for input and output, which is natural for transformations from a space to itself), the matrix is written more compactly as $[T]_\\mathcal{B}$. This is the case of greatest interest in [[similarity|similar matrices]], [[eigenvectors|eigenvalues]], and [[simple-diagonalization|diagonalization]].

Composition of linear transformations corresponds exactly to matrix multiplication. If $S: V \\to V$ and $T: V \\to V$ are linear, both represented in basis $\\mathcal{B}$, then $T \\circ S$ is represented by $[T]_\\mathcal{B} \\, [S]_\\mathcal{B}$. The order is the same as for matrix multiplication: rightmost operation applied first.

A central observation: **the same linear transformation has different matrix representations in different bases**. If $\\mathcal{B}$ and $\\mathcal{B}'$ are two bases of $V$, the matrices $[T]_\\mathcal{B}$ and $[T]_{\\mathcal{B}'}$ are generally different. The change-of-basis formula relates them:

$$[T]_{\\mathcal{B}'} = P^{-1} [T]_\\mathcal{B} P,$$

where $P$ is the [[change-of-basis|change-of-basis matrix]] from $\\mathcal{B}'$ to $\\mathcal{B}$. This is the relation of [[similarity|similar matrices]], and it is what makes the choice of basis meaningful: by picking the right basis, we can sometimes make the matrix dramatically simpler (diagonal, triangular, sparse).

For non-square cases — different bases for the domain and codomain — the change-of-basis formula generalizes to $[T]_{\\mathcal{B}'}^{\\mathcal{C}'} = Q^{-1} [T]_\\mathcal{B}^\\mathcal{C} P$, where $P$ is the change of basis on the domain side and $Q$ on the codomain side. The square case ($V = W$, $\\mathcal{B} = \\mathcal{C}$) collapses this to similarity.

This perspective unifies a lot of seemingly disparate phenomena. Why are eigenvalues the same regardless of basis? Because they are intrinsic invariants of the transformation, preserved under similarity. Why does the [[svd-form|SVD]] reveal the "right" basis? Because it picks bases for $V$ and $W$ that make $[T]$ as simple as possible (diagonal). Why is [[lu-decomposition|LU decomposition]] basis-relative? Because it factors a specific matrix representation, not the abstract transformation.
    `.trim(),

    definitions: [
      {
        term: 'Matrix representation',
        body: 'For a linear $T: V \\to W$ and bases $\\mathcal{B}$ of $V$, $\\mathcal{C}$ of $W$: the matrix $[T]_\\mathcal{B}^\\mathcal{C}$ whose $j$-th column is $[T(b_j)]_\\mathcal{C}$.',
      },
      {
        term: 'Endomorphism',
        body: 'A linear transformation from a vector space to itself, $T: V \\to V$. Has a single matrix $[T]_\\mathcal{B}$ when the same basis is used on both sides.',
      },
    ],

    theorems: [
      {
        name: 'Action by matrix multiplication',
        statement: 'For a linear $T: V \\to W$ and bases $\\mathcal{B}, \\mathcal{C}$: $[T(v)]_\\mathcal{C} = [T]_\\mathcal{B}^\\mathcal{C} \\, [v]_\\mathcal{B}$ for every $v \\in V$.',
        intuition: 'The matrix multiplication faithfully represents the linear transformation in coordinates. This is what allows abstract linear-algebra problems to be solved by ordinary matrix algebra.',
      },
      {
        name: 'Composition is matrix multiplication',
        statement: 'For linear $S: U \\to V$ and $T: V \\to W$ with bases $\\mathcal{A}, \\mathcal{B}, \\mathcal{C}$: $[T \\circ S]_\\mathcal{A}^\\mathcal{C} = [T]_\\mathcal{B}^\\mathcal{C} \\, [S]_\\mathcal{A}^\\mathcal{B}$.',
        intuition: 'Composition of functions corresponds to multiplication of matrices, in the same order. This is the structural reason matrix multiplication is non-commutative — function composition is non-commutative.',
      },
      {
        name: 'Change of basis on a transformation',
        statement: 'For a linear $T: V \\to V$ and two bases $\\mathcal{B}, \\mathcal{B}\'$ of $V$: $[T]_{\\mathcal{B}\'} = P^{-1} [T]_\\mathcal{B} P$, where $P$ is the change-of-basis matrix from $\\mathcal{B}\'$ to $\\mathcal{B}$.',
        intuition: 'To apply $T$ in $\\mathcal{B}\'$-coordinates: convert to $\\mathcal{B}$-coordinates ($P$), apply $T$ in $\\mathcal{B}$ ($[T]_\\mathcal{B}$), convert back to $\\mathcal{B}\'$-coordinates ($P^{-1}$). This formula is the [[similarity|similarity transformation]].',
      },
    ],

    keyFormulas: [
      '\\text{column } j \\text{ of } [T]_\\mathcal{B}^\\mathcal{C} = [T(b_j)]_\\mathcal{C}',
      '[T(v)]_\\mathcal{C} = [T]_\\mathcal{B}^\\mathcal{C} \\, [v]_\\mathcal{B}',
      '[T \\circ S] = [T] \\, [S]',
      '[T]_{\\mathcal{B}\'} = P^{-1} [T]_\\mathcal{B} P',
    ],
  },

  explore: {
    vizComponent: 'MatrixRepresentationViz',
    description: 'Pick a linear transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ (rotation, shear, projection, etc.) and watch its matrix representation change as you switch bases. The viz shows the same transformation in three side-by-side displays: the standard basis, a rotated basis, and a basis of $T$\'s eigenvectors (when they exist) — illustrating how the matrix becomes diagonal in the eigenbasis.',
    misconception: {
      title: 'A linear transformation has many matrix representations — one per choice of basis',
      body: `
A common conceptual error is treating "the matrix of $T$" as if it were a single object. There is no such thing. Each pair of bases (one for the domain, one for the codomain) gives a different matrix representation. The transformation $T$ is intrinsic; the matrix is basis-relative.

This is parallel to the [[coordinates|coordinates]] story: the vector is intrinsic, the coordinate vector is basis-relative. Same conceptual point, applied one level up.

Two students computing $T$'s matrix in two different bases will get two different matrices — not because one of them made a mistake, but because they chose different bases. The matrices are related by [[similarity|similarity]]: $M_2 = P^{-1} M_1 P$ for the appropriate change-of-basis $P$.

A second misconception: thinking that the matrix entries individually have intrinsic meaning. They generally do not. The trace and determinant are intrinsic (preserved under similarity), but the $(1, 1)$ entry — or any specific entry — depends on the basis. A matrix with integer entries in one basis can have irrational entries in another. The integer-entry property is a coordinate-dependent feature, not an intrinsic one.

A third trap: applying the change-of-basis formula in the wrong direction. The formula $[T]_{\\mathcal{B}\'} = P^{-1} [T]_\\mathcal{B} P$ uses $P$ as the change of basis FROM the new basis $\\mathcal{B}\'$ TO the old basis $\\mathcal{B}$. Reversing this direction gives $P^{-1}$ in the wrong slot. Always sanity-check by computing a small example or tracking what each $P$ does to a known vector.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute a matrix representation for an abstract transformation',
        body: 'Let $T: \\mathcal{P}_1 \\to \\mathcal{P}_2$ be defined by $T(p)(x) = x p(x) + p\'(x)$. Using standard bases $\\{1, x\\}$ for $\\mathcal{P}_1$ and $\\{1, x, x^2\\}$ for $\\mathcal{P}_2$.',
      },
      {
        title: 'Apply $T$ to each basis vector',
        body: '$T(1) = x \\cdot 1 + (1)\' = x + 0 = x$. In $\\{1, x, x^2\\}$ coordinates: $(0, 1, 0)^T$. $T(x) = x \\cdot x + (x)\' = x^2 + 1$. In $\\{1, x, x^2\\}$ coordinates: $(1, 0, 1)^T$.',
      },
      {
        title: 'Stack as columns',
        body: 'The matrix has these two coordinate vectors as its columns: $[T] = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$. This is a $3 \\times 2$ matrix — the codomain has dim $3$ (rows), the domain has dim $2$ (columns).',
      },
    ],

    problems: [
      {
        id: 'P-4.4a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $T: \\mathcal{P}_1 \\to \\mathcal{P}_2$ be the linear transformation $T(p(x)) = x p(x) + p\'(x)$. Using the standard bases $\\{1, x\\}$ for $\\mathcal{P}_1$ and $\\{1, x, x^2\\}$ for $\\mathcal{P}_2$, what is the matrix representation of $T$?',
        choices: [
          { label: 'A' as const, body: '$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$' },
          { label: 'B' as const, body: '$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$\\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$' },
          { label: 'D' as const, body: '$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$' },
          { label: 'E' as const, body: '$\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Apply $T$ to each basis vector. $T(1) = x \\cdot 1 + 0 = x$, with $\\{1, x, x^2\\}$ coordinates $(0, 1, 0)^T$. $T(x) = x \\cdot x + 1 = x^2 + 1$, with coordinates $(1, 0, 1)^T$. The matrix has these as columns: $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Computes $T(1) = 1$ and $T(x) = x$ — forgetting both the $x \\cdot p(x)$ multiplication and the derivative.' },
            { choice: 'C' as const, why: 'Transposes the columns or omits a term — for example, treating $T(1) = 0$.' },
            { choice: 'D' as const, why: 'Wrong dimensions. The output space $\\mathcal{P}_2$ is 3-dimensional, so the matrix must have 3 rows, not 2.' },
            { choice: 'E' as const, why: 'Computational error in applying the transformation rule.' },
          ],
        },
      },
      {
        id: 'P-4.4b',
        format: 'multiple-choice' as const,
        difficulty: 3,
        statement: 'Let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ and $S: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be linear transformations with matrix representations (in the standard basis) $[T] = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ and $[S] = \\begin{pmatrix} 2 & 0 \\\\ 1 & -1 \\end{pmatrix}$. In a new basis $\\mathcal{B} = \\left\\{ \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} \\right\\}$, what is the matrix representation of the composition $S \\circ T$?',
        choices: [
          { label: 'A' as const, body: '$\\begin{pmatrix} 4 & 4 \\\\ 1 & -5 \\end{pmatrix}$' },
          { label: 'B' as const, body: '$\\begin{pmatrix} 2 & 8 \\\\ -1 & 5 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$\\begin{pmatrix} 3 & 7 \\\\ -1 & 1 \\end{pmatrix}$' },
          { label: 'D' as const, body: '$\\begin{pmatrix} 8 & -2 \\\\ 10 & -2 \\end{pmatrix}$' },
          { label: 'E' as const, body: 'The composition cannot be determined without more information.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'First compute the standard-basis matrix of $S \\circ T$: $[S \\circ T] = [S] [T] = \\begin{pmatrix} 2 & 0 \\\\ 1 & -1 \\end{pmatrix} \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix} = \\begin{pmatrix} 2 & 4 \\\\ 1 & -1 \\end{pmatrix}$.\n\nThe change-of-basis matrix from $\\mathcal{B}$ to standard is $P = \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$, with $P^{-1} = \\frac{1}{-2} \\begin{pmatrix} -1 & -1 \\\\ -1 & 1 \\end{pmatrix} = \\frac{1}{2} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$.\n\nThen $[S \\circ T]_\\mathcal{B} = P^{-1} [S \\circ T] P = \\frac{1}{2} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix} \\begin{pmatrix} 2 & 4 \\\\ 1 & -1 \\end{pmatrix} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix} = \\begin{pmatrix} 2 & 8 \\\\ -1 & 5 \\end{pmatrix}$.',
          partialCredit: '(A) earns partial credit — that is the standard-basis representation of $S \\circ T$, computed correctly, but without changing basis.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Computes $[S \\circ T]$ in the standard basis correctly but fails to convert to the $\\mathcal{B}$-basis. Earns partial credit.' },
            { choice: 'C' as const, why: 'Computes $T \\circ S$ instead of $S \\circ T$ — wrong order of composition.' },
            { choice: 'D' as const, why: 'Algebra error in the change-of-basis computation, possibly using $P$ where $P^{-1}$ should be used.' },
            { choice: 'E' as const, why: 'Sufficient information IS provided — the basis $\\mathcal{B}$ and the matrices in the standard basis are both given.' },
          ],
        },
      },
      {
        id: 'P-4.4c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $T: V \\to V$ be a linear transformation on an $n$-dimensional vector space ($n \\geq 3$), and let $\\mathcal{B} = \\{b_1, \\dots, b_n\\}$ be a basis for $V$. The matrix representation $[T]_\\mathcal{B}$ has its third column equal to the zero vector. Which conclusion follows?',
        choices: [
          { label: 'A' as const, body: '$\\text{coker}(T)$ contains $b_3$.' },
          { label: 'B' as const, body: '$\\text{im}(T)$ does not contain $b_3$.' },
          { label: 'C' as const, body: '$\\ker(T)$ contains $b_3$.' },
          { label: 'D' as const, body: '$\\text{rank}(T) = n - 1$.' },
          { label: 'E' as const, body: 'None of the above must be true.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The $j$-th column of $[T]_\\mathcal{B}$ records $[T(b_j)]_\\mathcal{B}$. If the third column is the zero vector, then $[T(b_3)]_\\mathcal{B} = 0$, which means $T(b_3) = 0$. Therefore $b_3 \\in \\ker(T)$, and $T$ is not injective.',
          partialCredit: '(D) earns partial credit. The rank is reduced by the zero column, but it could be less than $n - 1$ if other columns are also linearly dependent.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses kernel with cokernel. $b_3 \\in \\ker(T)$ (in the domain), not in the cokernel (which is a quotient of the codomain).' },
            { choice: 'B' as const, why: 'Confuses the column space of $[T]_\\mathcal{B}$ with $\\text{im}(T)$. Other columns can have nonzero third components, meaning $b_3$ may appear in some $T(b_j)$ for $j \\neq 3$, putting $b_3 \\in \\text{im}(T)$.' },
            { choice: 'D' as const, why: 'Overstates: a single zero column gives $\\text{rank} \\leq n - 1$, not necessarily $= n - 1$. Earns partial credit.' },
            { choice: 'E' as const, why: '(C) does follow.' },
          ],
        },
      },
    ],
  },
};
