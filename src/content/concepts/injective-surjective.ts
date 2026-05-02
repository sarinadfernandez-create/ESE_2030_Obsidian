import type { Concept } from '../types';

export const injectiveSurjective: Concept = {
  id: 'injective-surjective',
  unitId: 'ch3',
  number: '3.4',
  title: 'Injective, Surjective, & Isomorphisms',
  blurb: 'When a linear map can be undone — and the dimension constraints that decide which kinds of "undoing" are possible.',
  tier: 'full',

  learn: {
    overview: `
A [[linear-transformation-defs|linear transformation]] $T: V \\to W$ can have three independent properties relating to invertibility:

- **Injective** (one-to-one): different inputs produce different outputs. Equivalently, $T(u) = T(v)$ implies $u = v$.
- **Surjective** (onto): every $w \\in W$ is the image of some $v \\in V$. Equivalently, $\\text{im}(T) = W$.
- **Isomorphism** (bijective): both injective and surjective.

For *linear* transformations specifically, these properties have very clean reformulations in terms of the [[image-and-kernel|kernel and image]]:

- $T$ is injective $\\iff \\ker(T) = \\{0\\}$.
- $T$ is surjective $\\iff \\text{im}(T) = W$.
- $T$ is an isomorphism $\\iff \\ker(T) = \\{0\\}$ AND $\\text{im}(T) = W$.

The kernel characterization of injectivity is the workhorse: instead of checking that distinct inputs yield distinct outputs (a comparison of pairs), you only need to check that the only input mapping to zero is zero itself. The proof: $T(u) = T(v) \\Leftrightarrow T(u - v) = 0 \\Leftrightarrow u - v \\in \\ker(T)$. If $\\ker(T) = \\{0\\}$, then $u = v$.

For finite-dimensional spaces, dimensions decide a lot. By [[rank-and-nullity|rank-nullity]]: $\\dim(\\ker(T)) + \\dim(\\text{im}(T)) = \\dim(V)$. So:

- If $\\dim(V) > \\dim(W)$: surjectivity is possible, but **injectivity is impossible** (the kernel must have dimension $\\geq \\dim(V) - \\dim(W) > 0$).
- If $\\dim(V) < \\dim(W)$: injectivity is possible, but **surjectivity is impossible** ($\\dim(\\text{im}(T)) \\leq \\dim(V) < \\dim(W)$).
- If $\\dim(V) = \\dim(W)$ (finite-dimensional): injective $\\iff$ surjective $\\iff$ isomorphism. Once one holds, the other follows automatically.

This last fact — that for square-shaped maps, injectivity and surjectivity are equivalent — is what makes [[inverses|invertibility of square matrices]] a single concept. For non-square shapes, injectivity and surjectivity are genuinely different properties.

**Isomorphism between vector spaces.** Two vector spaces $V$ and $W$ are **isomorphic**, written $V \\cong W$, if there exists an isomorphism $T: V \\to W$. For finite-dimensional spaces over the same field, the criterion for isomorphism is breathtakingly simple: $V \\cong W \\iff \\dim(V) = \\dim(W)$. Same dimension means isomorphic, period. This is why $\\mathbb{R}^4 \\cong \\mathbb{R}^{2 \\times 2} \\cong \\mathcal{P}_3$ — all are 4-dimensional, regardless of how different their elements look.

Two vector spaces being isomorphic means they have the *same linear-algebra structure*. They might look totally different (matrices vs. polynomials vs. tuples), but every linear-algebra theorem true of one is true of the other. This is why the abstract theory pays off — the same theorems apply to all the different concrete examples [[vector-space-examples|surveyed earlier]].
    `.trim(),

    definitions: [
      {
        term: 'Injective (one-to-one)',
        body: 'A function $T$ is injective if $T(u) = T(v) \\Rightarrow u = v$. For linear $T$: equivalent to $\\ker(T) = \\{0\\}$.',
      },
      {
        term: 'Surjective (onto)',
        body: 'A function $T: V \\to W$ is surjective if every $w \\in W$ has a preimage $v \\in V$ with $T(v) = w$. Equivalently, $\\text{im}(T) = W$.',
      },
      {
        term: 'Isomorphism',
        body: 'A linear transformation that is both injective and surjective. Equivalently, a linear bijection. The inverse $T^{-1}$ is also linear.',
      },
      {
        term: 'Isomorphic vector spaces',
        body: 'Two vector spaces $V$ and $W$ are isomorphic ($V \\cong W$) if an isomorphism between them exists. For finite-dimensional spaces: $V \\cong W \\iff \\dim(V) = \\dim(W)$.',
      },
    ],

    theorems: [
      {
        name: 'Injectivity criterion via kernel',
        statement: 'A linear transformation $T: V \\to W$ is injective if and only if $\\ker(T) = \\{0\\}$.',
        intuition: 'Distinct inputs $u \\neq v$ produce equal outputs iff $u - v \\in \\ker(T)$ is a nonzero kernel vector. So injectivity (no such collisions) is equivalent to a trivial kernel.',
      },
      {
        name: 'Dimension constraints on injectivity and surjectivity',
        statement: 'For a linear $T: V \\to W$ between finite-dimensional spaces: (i) if $\\dim(V) > \\dim(W)$, $T$ cannot be injective; (ii) if $\\dim(V) < \\dim(W)$, $T$ cannot be surjective; (iii) if $\\dim(V) = \\dim(W)$, $T$ is injective iff surjective iff an isomorphism.',
        intuition: 'Squeezing a higher-dimensional space into a lower-dimensional one forces collisions ([[image-and-kernel|nontrivial kernel]]). Spreading a lower-dimensional space into a higher-dimensional one cannot fill the codomain. Equal dimensions allow both, with the two properties locked together.',
      },
      {
        name: 'Isomorphism criterion for finite-dimensional spaces',
        statement: 'Two finite-dimensional vector spaces $V$ and $W$ are isomorphic if and only if $\\dim(V) = \\dim(W)$.',
        intuition: 'Pick bases of equal size and define the isomorphism by mapping basis vectors to basis vectors. Conversely, an isomorphism preserves bases (it sends a basis to a basis), so the dimensions must match. Dimension is the unique invariant of finite-dimensional vector spaces up to isomorphism.',
      },
    ],

    keyFormulas: [
      'T \\text{ injective} \\iff \\ker(T) = \\{0\\}',
      'T \\text{ surjective} \\iff \\text{im}(T) = W',
      'V \\cong W \\iff \\dim(V) = \\dim(W) \\quad \\text{(finite-dim)}',
    ],
  },

  explore: {
    vizComponent: 'InjectiveSurjectiveViz',
    description: 'Pick a matrix $A$ representing a linear map $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ with various $(n, m)$ shapes. The viz computes rank and nullity, then reports whether $T$ is injective, surjective, both, or neither — and shows specific witnesses (a kernel vector that breaks injectivity, a codomain vector with no preimage that breaks surjectivity).',
    misconception: {
      title: 'Equal dimensions do not automatically make a linear map an isomorphism',
      body: `
A common error: thinking that any linear map between two equal-dimensional spaces is automatically an isomorphism. It is not. The linear map $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ given by $T(x, y) = (x, 0)$ has equal-dimensional domain and codomain, but it is neither injective (anything in the second coordinate is collapsed) nor surjective (only outputs of the form $(x, 0)$ are reachable).

The correct statement: for a linear map between equal-dimensional finite-dimensional spaces, injectivity and surjectivity are equivalent — but at least one of them must hold for $T$ to be an isomorphism. Many maps between equal-dimensional spaces have neither property.

A second misconception: thinking that "isomorphic" means "the same." Isomorphic vector spaces have the same linear-algebra structure, but they can be made of completely different objects. $\\mathbb{R}^4$ (tuples of numbers) is isomorphic to $\\mathbb{R}^{2 \\times 2}$ (matrices), but a tuple is not a matrix. The isomorphism is a *correspondence*, not an identification.

A third trap: confusing the concept of "isomorphism" between two different spaces with "automorphism" — a linear map from a space to itself that is also an isomorphism. Every space has the identity automorphism; the interesting automorphisms (like rotations or [[change-of-basis|change-of-basis transformations]]) preserve the structure while permuting the elements.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Test injectivity by computing the kernel',
        body: 'For $T: \\mathbb{R}^3 \\to \\mathbb{R}^2$, $T(x, y, z) = (x + y, x + z)$: solve $T(v) = 0$. The system $x + y = 0, x + z = 0$ has solutions $y = -x, z = -x$, parameterized by $x$. The kernel is the line $\\text{span}\\{(1, -1, -1)\\}$, which is 1-dimensional. Since $\\ker(T) \\neq \\{0\\}$, $T$ is NOT injective.',
      },
      {
        title: 'Test surjectivity by checking the image',
        body: 'The image of $T$ from above is the column space of $\\begin{pmatrix} 1 & 1 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix}$. This matrix has rank $2$ (its first two columns are linearly independent), so $\\dim(\\text{im}(T)) = 2 = \\dim(\\mathbb{R}^2)$. So $T$ IS surjective.',
      },
    ],

    problems: [
      {
        id: 'P-3.4a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'A linear transformation $T: V \\to W$ is injective if and only if:',
        choices: [
          { label: 'A' as const, body: '$T(v) = 0$ has a unique solution.' },
          { label: 'B' as const, body: '$\\ker(T) = \\{0\\}$.' },
          { label: 'C' as const, body: '$\\text{im}(T) = W$.' },
          { label: 'D' as const, body: 'Every vector in $W$ has a preimage.' },
          { label: 'E' as const, body: '$\\dim(V) = \\dim(W)$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Injectivity for a linear map is equivalent to having a trivial kernel: $\\ker(T) = \\{0\\}$. The proof: $T(u) = T(v) \\iff T(u - v) = 0 \\iff u - v \\in \\ker(T)$. So distinct inputs collide iff there is a nonzero kernel vector.',
          partialCredit: '(A) earns partial credit. $T(v) = 0$ always has $v = 0$ as a solution; "unique solution" means $v = 0$ is the only one, which is exactly $\\ker(T) = \\{0\\}$. The phrasing is correct but more cumbersome than (B).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Verbose but correct in spirit. Earns partial credit.' },
            { choice: 'C' as const, why: 'This defines surjectivity, not injectivity.' },
            { choice: 'D' as const, why: 'Also defines surjectivity.' },
            { choice: 'E' as const, why: 'Equal dimensions are necessary for an isomorphism but not sufficient for injectivity. A linear map between equal-dimensional spaces can still have a nontrivial kernel.' },
          ],
        },
      },
      {
        id: 'P-3.4b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For $T: \\mathbb{R}^3 \\to \\mathbb{R}^4$ to be surjective, what would need to be true?',
        choices: [
          { label: 'A' as const, body: '$\\dim(\\ker(T)) = 0$.' },
          { label: 'B' as const, body: '$\\dim(\\text{im}(T)) = 4$.' },
          { label: 'C' as const, body: '$\\dim(\\text{im}(T)) = 3$.' },
          { label: 'D' as const, body: 'This is impossible — no map from $\\mathbb{R}^3$ can be onto $\\mathbb{R}^4$.' },
          { label: 'E' as const, body: '$T$ is represented by a $3 \\times 4$ matrix.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: '$\\dim(\\text{im}(T)) \\leq \\dim(V) = 3 < 4 = \\dim(W)$, so $T$ cannot reach every vector in $\\mathbb{R}^4$. Surjectivity is impossible whenever the domain has smaller dimension than the codomain.',
          trickAnalysis: [
            { choice: 'A' as const, why: '$\\dim(\\ker(T)) = 0$ is the condition for INJECTIVITY, not surjectivity. And the question is about surjectivity.' },
            { choice: 'B' as const, why: 'Would be the right condition if it were achievable, but $\\dim(\\text{im}(T)) \\leq 3 < 4$, making this unreachable.' },
            { choice: 'C' as const, why: 'Matches the domain dimension and would correspond to injectivity, but the question asks about surjectivity.' },
            { choice: 'E' as const, why: 'Wrong matrix shape: $T: \\mathbb{R}^3 \\to \\mathbb{R}^4$ is represented by a $4 \\times 3$ matrix (rows = codomain, columns = domain).' },
          ],
        },
      },
      {
        id: 'P-3.4c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $T: V \\to W$ be a linear transformation between finite-dimensional vector spaces with $\\dim(V) = 4$ and $\\dim(W) = 6$. Which statement is correct?',
        choices: [
          { label: 'A' as const, body: '$T$ can be surjective but not injective.' },
          { label: 'B' as const, body: '$T$ can be injective but not surjective.' },
          { label: 'C' as const, body: '$T$ can be both injective and surjective (an isomorphism).' },
          { label: 'D' as const, body: '$T$ cannot be injective because $\\dim(\\ker(T)) \\geq 2$ by rank-nullity.' },
          { label: 'E' as const, body: '$T$ must be injective because there is "room" in $W$ for all of $V$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'By rank-nullity, $\\dim(\\ker(T)) + \\dim(\\text{im}(T)) = \\dim(V) = 4$. For injectivity, $\\dim(\\ker(T)) = 0$, giving $\\dim(\\text{im}(T)) = 4$ — achievable since $\\dim(\\text{im}(T)) \\leq \\min(4, 6) = 4$. For surjectivity, $\\dim(\\text{im}(T)) = 6$ — but $\\dim(\\text{im}(T)) \\leq 4 < 6$, so impossible.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Reverses the constraints. Surjectivity is impossible (domain is too small); injectivity is possible.' },
            { choice: 'C' as const, why: 'An isomorphism requires $\\dim(V) = \\dim(W)$. Here they differ.' },
            { choice: 'D' as const, why: 'Rank-nullity gives $\\dim(\\ker(T)) = 4 - \\text{rank}(T)$. The rank can be as high as $4$, giving $\\dim(\\ker) = 0$ and injectivity.' },
            { choice: 'E' as const, why: 'Having "room" permits injectivity but does not force it. The map $T(v) = 0$ is linear with $\\dim(V) = 4 < 6$ but has a 4-dimensional kernel.' },
          ],
        },
      },
      {
        id: 'P-3.4d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Two finite-dimensional vector spaces $V$ and $W$ are isomorphic if and only if:',
        choices: [
          { label: 'A' as const, body: 'They have the same number of elements.' },
          { label: 'B' as const, body: '$\\dim(V) = \\dim(W)$.' },
          { label: 'C' as const, body: 'There exists any linear map $T: V \\to W$.' },
          { label: 'D' as const, body: '$V \\subseteq W$ or $W \\subseteq V$.' },
          { label: 'E' as const, body: 'They have the same basis.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Two finite-dimensional vector spaces over the same field are isomorphic if and only if they have the same dimension. The isomorphism can be built basis-to-basis: pick a basis of size $n$ for each space, send the $i$-th basis vector of $V$ to the $i$-th basis vector of $W$, and extend linearly.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Vector spaces over $\\mathbb{R}$ are infinite as sets (uncountably so), so "same number of elements" is meaningless or always true.' },
            { choice: 'C' as const, why: 'A linear map need not be invertible. $T = 0$ is always a linear map, but it is rarely an isomorphism.' },
            { choice: 'D' as const, why: 'Subset relationship is unrelated to isomorphism. $\\mathbb{R}^2$ and $\\mathcal{P}_1$ are isomorphic but neither is contained in the other.' },
            { choice: 'E' as const, why: 'Different vector spaces have different bases (a basis of $\\mathbb{R}^2$ is two vectors in $\\mathbb{R}^2$; a basis of $\\mathcal{P}_1$ is two polynomials). Bases are space-specific.' },
          ],
        },
      },
    ],
  },
};
