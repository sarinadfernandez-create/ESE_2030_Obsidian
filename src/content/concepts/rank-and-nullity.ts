import type { Concept } from '../types';

export const rankAndNullity: Concept = {
  id: 'rank-and-nullity',
  unitId: 'ch3',
  number: '3.6',
  title: 'Rank & Nullity',
  blurb: 'The two numbers attached to a linear transformation — and the theorem that ties them together.',
  tier: 'full',

  learn: {
    overview: `
For a [[linear-transformation-defs|linear transformation]] $T: V \\to W$ between finite-dimensional vector spaces, two key numerical invariants are:

- **Rank**: $\\text{rank}(T) = \\dim(\\text{im}(T))$ — the dimension of the [[image-and-kernel|image]].
- **Nullity**: $\\text{nullity}(T) = \\dim(\\ker(T))$ — the dimension of the [[image-and-kernel|kernel]].

These two numbers are not independent — they are linked by one of the central theorems of linear algebra:

> **Rank-nullity theorem:** $\\text{rank}(T) + \\text{nullity}(T) = \\dim(V)$.

In words: the dimensions of the kernel and image sum to the dimension of the domain. This is a *coordinate-free* statement, true regardless of how $T$ is represented. For a matrix transformation $T(x) = Ax$ where $A$ is $m \\times n$, it specializes to: number of columns ($n$) = rank + nullity.

Why this theorem holds: pick a [[bases|basis]] of $\\ker(T)$, extend it to a basis of $V$. The "extended part" has size $\\dim(V) - \\text{nullity}(T)$, and you can show it maps to a basis of $\\text{im}(T)$. So $\\dim(\\text{im}(T)) = \\dim(V) - \\text{nullity}(T)$, which rearranges to the theorem.

This single theorem is the source of an enormous amount of useful information:

- **Dimension constraints on injectivity and surjectivity.** $T$ is injective iff $\\text{nullity}(T) = 0$ iff $\\text{rank}(T) = \\dim(V)$. $T$ is surjective iff $\\text{rank}(T) = \\dim(W)$. Combining: $T$ can be injective only if $\\dim(V) \\leq \\dim(W)$ (because rank cannot exceed $\\dim(W)$); $T$ can be surjective only if $\\dim(V) \\geq \\dim(W)$ (because nullity cannot be negative).

- **Square matrices have a single threshold.** For $T: V \\to V$ with $\\dim(V) = n$, rank-nullity says $\\text{rank}(T) + \\text{nullity}(T) = n$. Injectivity ($\\text{nullity} = 0$) is equivalent to surjectivity ($\\text{rank} = n$), which is equivalent to invertibility — all controlled by whether $\\text{rank}(T) = n$.

- **The "free variables" count from [[row-reduction|row reduction]] is the nullity.** When you row-reduce $A$ to RREF and identify pivot columns, the count of non-pivot columns equals $n - \\text{rank}(A) = \\text{nullity}(A)$.

- **Determining the kernel size from the image, and vice versa.** Knowing one tells you the other: $\\text{nullity}(T) = \\dim(V) - \\text{rank}(T)$.

The rank itself has multiple equivalent definitions: (i) the dimension of the image, (ii) the number of pivots in [[row-reduction|RREF]], (iii) the number of linearly independent columns, (iv) the number of linearly independent rows ([[rank-and-conditioning|row rank = column rank]]), and (v) the number of nonzero singular values in the [[svd-form|SVD]]. All five give the same number.
    `.trim(),

    definitions: [
      {
        term: 'Rank',
        body: 'For a linear $T: V \\to W$: $\\text{rank}(T) = \\dim(\\text{im}(T))$. For a matrix $A$: equal to the number of pivots in RREF, equal to the number of linearly independent columns or rows.',
      },
      {
        term: 'Nullity',
        body: 'For a linear $T: V \\to W$: $\\text{nullity}(T) = \\dim(\\ker(T))$. The number of linearly independent vectors in the null space.',
      },
      {
        term: 'Full rank',
        body: 'A linear transformation has full rank if $\\text{rank}(T) = \\min(\\dim(V), \\dim(W))$. For a square matrix, equivalent to invertibility.',
      },
    ],

    theorems: [
      {
        name: 'Rank-nullity theorem',
        statement: 'For a linear transformation $T: V \\to W$ with $\\dim(V) = n$ finite, $\\text{rank}(T) + \\text{nullity}(T) = n$.',
        intuition: 'Pick a basis of $\\ker(T)$ and extend to a basis of $V$. The extending vectors map to linearly independent vectors that span $\\text{im}(T)$ — so they form a basis of the image. The basis sizes add up to $\\dim(V)$.',
      },
      {
        name: 'Invertibility characterized by rank',
        statement: 'For a square linear $T: V \\to V$ with $\\dim(V) = n$ finite: $T$ is invertible iff $\\text{rank}(T) = n$ iff $\\text{nullity}(T) = 0$.',
        intuition: 'These are equivalent restatements of the same fact (full rank). The triangle of conditions {invertible, injective, surjective} collapses to a single condition for square maps.',
      },
    ],

    keyFormulas: [
      '\\text{rank}(T) + \\text{nullity}(T) = \\dim(V)',
      '\\text{rank}(T) = \\dim(\\text{im}(T))',
      '\\text{nullity}(T) = \\dim(\\ker(T))',
    ],
  },

  explore: {
    vizComponent: 'RankNullityViz',
    description: 'Pick a matrix $A$ and watch the rank and nullity update as you change its entries. The viz shows both side-by-side along with the rank-nullity sum (always equal to the number of columns), making the conservation law visible. Try driving the rank to zero (by setting $A$ to zero) or to its maximum (by setting $A$ to a generic invertible matrix).',
    misconception: {
      title: 'Rank-nullity uses the dimension of the DOMAIN, not the codomain',
      body: `
A common error is writing $\\text{rank}(T) + \\text{nullity}(T) = \\dim(W)$ — using the codomain's dimension instead of the domain's. The correct version uses $\\dim(V)$, the domain.

The reason is structural: the rank counts the dimension of the image (a subspace of $W$), but the nullity counts the dimension of the kernel (a subspace of $V$). Both pieces ultimately come from "what $T$ does to the domain" — the image is what $T$ produces from $V$, and the kernel is what $T$ collapses *from* $V$. So the conservation law is about $V$.

A second misconception: confusing rank with the number of rows or columns. Rank can be at most $\\min(\\text{rows}, \\text{columns})$, but it can be lower. A $5 \\times 5$ matrix has rank between $0$ and $5$; the actual rank depends on how independent the rows/columns are.

A third trap: thinking that "$T$ has full rank" is a stronger condition than it is. Full rank means the rank equals the smaller of the two dimensions, $\\min(\\dim(V), \\dim(W))$. For a square map, this is equivalent to invertibility. For a non-square map, full rank is the best you can hope for, but it is not invertibility — a tall full-rank matrix is injective but not surjective; a wide full-rank matrix is surjective but not injective.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Apply rank-nullity to a $3 \\times 5$ matrix',
        body: 'Suppose $A$ is $3 \\times 5$ with rank $3$. By rank-nullity (using domain dimension $5$): $\\text{nullity}(A) = 5 - 3 = 2$. So $\\dim(\\ker(A)) = 2$, and the homogeneous system $Ax = 0$ has a 2-parameter family of solutions.',
      },
      {
        title: 'Use rank-nullity in reverse',
        body: 'Suppose $T: \\mathcal{P}_4 \\to \\mathbb{R}^3$ has $\\dim(\\ker(T)) = 3$. The domain $\\mathcal{P}_4$ has dimension $5$, so $\\text{rank}(T) = 5 - 3 = 2$. The image of $T$ is therefore a 2-dimensional subspace of $\\mathbb{R}^3$ — a plane through the origin in $\\mathbb{R}^3$. $T$ is not surjective.',
      },
    ],

    problems: [
      {
        id: 'P-3.6a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'For a linear transformation $T: V \\to W$ with $\\dim(V) = n$ finite, the Fundamental Theorem (rank-nullity) implies that:',
        choices: [
          { label: 'A' as const, body: '$\\dim(\\ker(T)) + \\dim(\\text{im}(T)) = n$.' },
          { label: 'B' as const, body: '$\\dim(\\ker(T)) \\times \\dim(\\text{im}(T)) = n$.' },
          { label: 'C' as const, body: '$\\dim(\\ker(T)) - \\dim(\\text{im}(T)) = 0$.' },
          { label: 'D' as const, body: '$\\dim(\\ker(T)) = \\dim(\\text{im}(T))$.' },
          { label: 'E' as const, body: '$\\dim(\\ker(T)) + \\dim(\\text{im}(T)) = \\dim(W)$.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Rank-nullity states that the dimensions of the kernel and image sum to the dimension of the *domain*: $\\dim(\\ker(T)) + \\dim(\\text{im}(T)) = \\dim(V) = n$.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'The relationship is additive, not multiplicative. (Multiplication would give nonsense even in simple cases — for the identity on $\\mathbb{R}^n$, nullity $= 0$ and rank $= n$, with product $0$, not $n$.)' },
            { choice: 'C' as const, why: 'Would mean nullity equals rank — only true in special symmetric cases (e.g., $\\dim(V) = 2 \\cdot \\text{rank}(T)$).' },
            { choice: 'D' as const, why: 'Same issue as (C). The kernel and image dimensions are generally different.' },
            { choice: 'E' as const, why: 'Uses the codomain dimension. The correct version uses the domain.' },
          ],
        },
      },
      {
        id: 'P-3.6b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'The rank of a linear transformation $T: V \\to W$ is defined as:',
        choices: [
          { label: 'A' as const, body: '$\\dim(\\ker(T))$.' },
          { label: 'B' as const, body: '$\\dim(V)$.' },
          { label: 'C' as const, body: '$\\dim(W)$.' },
          { label: 'D' as const, body: '$\\dim(\\text{im}(T))$.' },
          { label: 'E' as const, body: 'The number of nonzero eigenvalues of $T$.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'Rank is by definition the dimension of the image: $\\text{rank}(T) = \\dim(\\text{im}(T))$. For a matrix, this equals the dimension of the column space.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'This defines nullity, not rank.' },
            { choice: 'B' as const, why: 'Domain dimension is unrelated to rank in general.' },
            { choice: 'C' as const, why: 'Codomain dimension is the upper bound on rank, not the rank itself.' },
            { choice: 'E' as const, why: 'Eigenvalues are defined for endomorphisms (square maps), and even then "number of nonzero eigenvalues" is a different concept than rank.' },
          ],
        },
      },
    ],
  },
};
