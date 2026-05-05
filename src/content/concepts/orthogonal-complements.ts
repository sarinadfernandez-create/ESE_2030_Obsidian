import type { Concept } from '../types';

export const orthogonalComplements: Concept = {
  id: 'orthogonal-complements',
  unitId: 'ch6',
  number: '6.1',
  title: 'Orthogonal Complements',
  blurb: 'Every subspace has a perpendicular partner — and together they fill the whole space.',
  tier: 'full',

  learn: {
    overview: `
Given a [[subspaces|subspace]] $W$ of an [[dot-and-inner-products|inner product space]] $V$, the **orthogonal complement** of $W$ is

$$W^\\perp = \\{v \\in V : \\langle v, w \\rangle = 0 \\text{ for all } w \\in W\\}.$$

In words: $W^\\perp$ is the set of vectors that are perpendicular to *every* vector in $W$. The complement is itself a subspace of $V$ — it contains zero, is closed under addition, and is closed under scalar multiplication, all by linearity of the inner product.

The interplay between $W$ and $W^\\perp$ is the structural backbone of inner-product-space geometry. Three key facts capture this:

**Direct sum decomposition.** For finite-dimensional $V$:

$$V = W \\oplus W^\\perp.$$

Every vector $v \\in V$ decomposes *uniquely* as $v = w + w^\\perp$ with $w \\in W$ and $w^\\perp \\in W^\\perp$. The decomposition is unique because $W \\cap W^\\perp = \\{0\\}$: any vector orthogonal to itself satisfies $\\langle v, v \\rangle = 0$, which forces $v = 0$ by positive definiteness of the inner product.

**Dimensions add.** $\\dim(W) + \\dim(W^\\perp) = \\dim(V)$. This follows from the direct sum decomposition.

**Double complement.** $(W^\\perp)^\\perp = W$. Taking the orthogonal complement twice recovers the original subspace. This is a useful proof tool: to show two subspaces are equal, sometimes the easiest approach is to show their complements are equal.

The orthogonal complement is the *geometric* version of complement — distinct from the [[quotients|quotient]] $V / W$, which is the *algebraic* complement. For finite-dimensional inner product spaces, the two are isomorphic via projection ($W^\\perp \\cong V / W$), but conceptually they are different objects: $W^\\perp$ is a subspace inside $V$, while $V / W$ is a quotient space whose elements are equivalence classes.

**Computing the orthogonal complement.** For a subspace $W \\subseteq \\mathbb{R}^n$ with basis $\\{w_1, \\dots, w_k\\}$:

$$W^\\perp = \\{v \\in \\mathbb{R}^n : w_i \\cdot v = 0 \\text{ for } i = 1, \\dots, k\\}.$$

This is the [[image-and-kernel|null space]] of the matrix whose rows are $w_1, \\dots, w_k$. So $W^\\perp$ can be computed by [[row-reduction|row reduction]] of the basis matrix and reading off the null space.

**Special case: orthogonal complement of a hyperplane.** If $W$ is a hyperplane (a $(n-1)$-dimensional subspace) in $\\mathbb{R}^n$, then $W^\\perp$ is one-dimensional — a single line through origin perpendicular to $W$. The basis vector of $W^\\perp$ is the **normal vector** of the hyperplane. This is the linear-algebra version of the geometric concept of "normal to a plane."

**Special case: orthogonal complement of a single vector.** $\\{v\\}^\\perp$ — the orthogonal complement of the span of one vector $v$ — is the hyperplane through origin perpendicular to $v$. This is the basic geometric building block: every hyperplane has a unique direction perpendicular to it, and that direction is the basis of the orthogonal complement.

**Connection to the [[fundamental-theorem|Fundamental Theorem]].** The orthogonal complement is the bridge between the algebraic FTLA (Unit 3) and the [[geometric-fundamental-theorem|geometric FTLA]] (Section 6.3). The four fundamental subspaces pair up via orthogonal complement: the [[image-and-kernel|kernel]] is orthogonal to the [[coimage-cokernel|coimage]] (which equals the row space, the image of the [[adjoints-and-transposes|adjoint]]); the image is orthogonal to the cokernel (the left null space). These orthogonal-complement pairings are what make the FTLA *geometric* rather than just algebraic.
    `.trim(),

    definitions: [
      {
        term: 'Orthogonal complement',
        body: 'For a subspace $W$ of an inner product space $V$: $W^\\perp = \\{v \\in V : \\langle v, w \\rangle = 0 \\text{ for all } w \\in W\\}$. A subspace of $V$.',
      },
      {
        term: 'Direct sum',
        body: 'For subspaces $U, W$ of $V$ with $U \\cap W = \\{0\\}$ and $U + W = V$: write $V = U \\oplus W$. Every $v \\in V$ has a unique decomposition $v = u + w$ with $u \\in U, w \\in W$.',
      },
      {
        term: 'Normal vector',
        body: 'For a hyperplane $W$ through origin in $\\mathbb{R}^n$: any nonzero vector in $W^\\perp$ (which is 1-dimensional). Specifies the hyperplane uniquely up to scaling.',
      },
    ],

    theorems: [
      {
        name: 'Orthogonal decomposition theorem',
        statement: 'For a finite-dimensional inner product space $V$ and subspace $W$: $V = W \\oplus W^\\perp$. That is, every $v \\in V$ has a unique decomposition $v = w + w^\\perp$ with $w \\in W$ and $w^\\perp \\in W^\\perp$.',
        intuition: 'The decomposition is the [[orthogonal-projections|orthogonal projection]] of $v$ onto $W$ (giving $w$) plus the leftover (giving $w^\\perp$). Uniqueness comes from $W \\cap W^\\perp = \\{0\\}$: a vector in both is orthogonal to itself, hence zero.',
      },
      {
        name: 'Dimension formula',
        statement: '$\\dim(W) + \\dim(W^\\perp) = \\dim(V)$.',
        intuition: 'A direct consequence of the direct sum decomposition $V = W \\oplus W^\\perp$. The two complementary subspaces partition the dimensions of $V$.',
      },
      {
        name: 'Double complement',
        statement: '$(W^\\perp)^\\perp = W$ for any subspace $W$ of a finite-dimensional inner product space.',
        intuition: 'Taking the orthogonal complement is an involution on subspaces of $V$. Geometrically, the perpendicular of the perpendicular comes back to the original subspace.',
      },
      {
        name: 'Trivial intersection',
        statement: '$W \\cap W^\\perp = \\{0\\}$.',
        intuition: 'A vector in both $W$ and $W^\\perp$ is orthogonal to itself, so $\\langle v, v \\rangle = 0$, forcing $v = 0$ by positive definiteness.',
      },
    ],

    keyFormulas: [
      'W^\\perp = \\{v : \\langle v, w \\rangle = 0 \\text{ for all } w \\in W\\}',
      'V = W \\oplus W^\\perp',
      '\\dim(W^\\perp) = \\dim(V) - \\dim(W)',
      '(W^\\perp)^\\perp = W',
    ],
  },

  explore: {
    vizComponent: 'OrthogonalComplementViz',
    description: 'In $\\mathbb{R}^3$, pick a subspace $W$ — a line through origin or a plane through origin — and watch its orthogonal complement $W^\\perp$ render alongside it. The viz shows how every vector in $\\mathbb{R}^3$ decomposes uniquely into a $W$ component plus a $W^\\perp$ component, and how the dimensions add to $3$.',
    misconception: {
      title: 'The orthogonal complement of $W$ is NOT "the vectors not in $W$"',
      body: `
A common error: thinking $W^\\perp$ is the set of vectors NOT in $W$. It is not. The complement-by-set-difference $V \\setminus W$ is not even a subspace (it doesn't contain zero), and it includes many vectors that are not perpendicular to $W$.

$W^\\perp$ is the *perpendicular* complement — vectors orthogonal to every element of $W$. Most vectors in $V$ are neither in $W$ nor in $W^\\perp$; they have nonzero components in both. The decomposition $V = W \\oplus W^\\perp$ doesn't say "$V$ is the union of $W$ and $W^\\perp$"; it says "every vector in $V$ uniquely decomposes into a $W$ part and a $W^\\perp$ part."

A second misconception: thinking that $W^\\perp$ depends only on $W$ as an abstract subspace. It does not — $W^\\perp$ depends on the inner product. Two different inner products on the same vector space give two different orthogonal complements for the same $W$, because "perpendicular" is inner-product-relative. This is the same point as in 5.1: orthogonality depends on the chosen inner product.

A third trap: confusing $W^\\perp$ (a subspace of $V$) with the [[quotients|quotient]] $V/W$ (a different vector space, whose elements are equivalence classes of vectors in $V$). They are isomorphic via projection — the isomorphism is $v + W \\mapsto $ (projection of $v$ onto $W^\\perp$) — but they are different kinds of objects. $W^\\perp$ lives inside $V$; $V/W$ does not.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute the orthogonal complement of a line in $\\mathbb{R}^3$',
        body: 'Let $W = \\text{span}\\{(1, 2, -1)\\}$ in $\\mathbb{R}^3$. Then $W^\\perp = \\{v \\in \\mathbb{R}^3 : v \\cdot (1, 2, -1) = 0\\} = \\{(x, y, z) : x + 2y - z = 0\\}$.',
      },
      {
        title: 'Find a basis for $W^\\perp$',
        body: 'Solve $x + 2y - z = 0$: free variables $y, z$, with $x = -2y + z$. Parameterize: $v = y(-2, 1, 0) + z(1, 0, 1)$. Basis for $W^\\perp$: $\\{(-2, 1, 0), (1, 0, 1)\\}$. Verify: each is orthogonal to $(1, 2, -1)$. ✓ Dimensions check: $\\dim(W) + \\dim(W^\\perp) = 1 + 2 = 3 = \\dim(\\mathbb{R}^3)$. ✓',
      },
    ],

    problems: [
      {
        id: 'P-6.1a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $W$ be a 3-dimensional subspace of $\\mathbb{R}^7$. What is $\\dim(W^\\perp)$?',
        choices: [
          { label: 'A' as const, body: '$3$' },
          { label: 'B' as const, body: '$4$' },
          { label: 'C' as const, body: '$7$' },
          { label: 'D' as const, body: '$10$' },
          { label: 'E' as const, body: 'Cannot be determined without more information about $W$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'By the dimension formula, $\\dim(W) + \\dim(W^\\perp) = \\dim(V)$. Here $\\dim(\\mathbb{R}^7) = 7$ and $\\dim(W) = 3$, so $\\dim(W^\\perp) = 4$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses the complement\'s dimension with $W$\'s dimension. They are equal only when $\\dim(V) = 2 \\dim(W)$, not in general.' },
            { choice: 'C' as const, why: 'This is $\\dim(V)$, not $\\dim(W^\\perp)$. The complement is a strict subspace of $V$ unless $W = \\{0\\}$.' },
            { choice: 'D' as const, why: 'Adds the dimensions instead of subtracting. The formula uses $\\dim(V) - \\dim(W)$.' },
            { choice: 'E' as const, why: 'The formula gives the dimension uniquely from $\\dim(W)$ and $\\dim(V)$. The specific subspace $W$ is irrelevant.' },
          ],
        },
      },
      {
        id: 'P-6.1b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider $W < \\mathbb{R}^7$ with $\\dim W = 3$. Which statement about $W^\\perp$ is TRUE?',
        choices: [
          { label: 'A' as const, body: '$\\mathbb{R}^7 = W \\oplus W^\\perp$' },
          { label: 'B' as const, body: '$W \\cap W^\\perp = W$' },
          { label: 'C' as const, body: '$\\dim(W^\\perp) = 3$' },
          { label: 'D' as const, body: '$\\dim((W^\\perp)^\\perp) = 4$' },
          { label: 'E' as const, body: '$W$ and $W^\\perp$ do not intersect.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'The orthogonal decomposition theorem guarantees $\\mathbb{R}^7 = W \\oplus W^\\perp$. Every vector in $\\mathbb{R}^7$ decomposes uniquely into a $W$ component and a $W^\\perp$ component, with the two components orthogonal.',
          partialCredit: '(C) earns partial credit. The student correctly engages with computing $\\dim(W^\\perp)$ but applies the wrong formula — assuming $\\dim(W^\\perp) = \\dim(W)$ rather than $\\dim(V) - \\dim(W)$. Shows awareness that the complement has a computable dimension.',
          trickAnalysis: [
            { choice: 'B' as const, why: '$W \\cap W^\\perp = \\{0\\}$, not $W$. A nonzero vector cannot be orthogonal to itself.' },
            { choice: 'C' as const, why: 'Off by formula: $\\dim(W^\\perp) = 7 - 3 = 4$, not $3$. Earns partial credit.' },
            { choice: 'D' as const, why: 'Double complement satisfies $(W^\\perp)^\\perp = W$, so $\\dim((W^\\perp)^\\perp) = \\dim(W) = 3$, not $4$. Students who think taking $\\perp$ twice gives something new pick this.' },
            { choice: 'E' as const, why: '$W$ and $W^\\perp$ DO intersect — at the zero vector. Every subspace contains zero, so the intersection is at least $\\{0\\}$.' },
          ],
        },
      },
      {
        id: 'P-6.1c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'In $\\mathbb{R}^4$, let $W = \\text{span}\\{(1, 1, 0, 0), (0, 0, 1, 1)\\}$. Which vector is in $W^\\perp$?',
        choices: [
          { label: 'A' as const, body: '$(1, 1, 1, 1)$' },
          { label: 'B' as const, body: '$(1, -1, 1, -1)$' },
          { label: 'C' as const, body: '$(2, 2, 0, 0)$' },
          { label: 'D' as const, body: '$(1, 0, 0, 1)$' },
          { label: 'E' as const, body: '$(1, 0, -1, 0)$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'A vector $v$ is in $W^\\perp$ iff it is orthogonal to every basis vector of $W$. Test (B) $v = (1, -1, 1, -1)$: $v \\cdot (1, 1, 0, 0) = 1 - 1 = 0$ ✓, $v \\cdot (0, 0, 1, 1) = 1 - 1 = 0$ ✓. So $v \\in W^\\perp$.',
          trickAnalysis: [
            { choice: 'A' as const, why: '$(1, 1, 1, 1) \\cdot (1, 1, 0, 0) = 2 \\neq 0$. Not perpendicular to the first basis vector.' },
            { choice: 'C' as const, why: 'This is in $W$ itself (twice the first basis vector), not in $W^\\perp$.' },
            { choice: 'D' as const, why: '$(1, 0, 0, 1) \\cdot (1, 1, 0, 0) = 1 \\neq 0$. Not perpendicular.' },
            { choice: 'E' as const, why: '$(1, 0, -1, 0) \\cdot (1, 1, 0, 0) = 1 \\neq 0$. Not perpendicular to the first basis vector.' },
          ],
        },
      },
    ],
  },
};
