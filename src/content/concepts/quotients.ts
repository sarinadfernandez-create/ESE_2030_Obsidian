import type { Concept } from '../types';

export const quotients: Concept = {
  id: 'quotients',
  unitId: 'ch3',
  number: '3.7',
  title: 'Quotient Spaces',
  blurb: 'Collapse a subspace to a single point and study what remains.',
  tier: 'full',

  learn: {
    overview: `
Given a vector space $V$ and a [[subspaces|subspace]] $U \\subseteq V$, the **quotient space** $V / U$ is what you get by treating every element of $U$ as if it were the zero vector. More precisely, two vectors $v_1, v_2 \\in V$ are declared equivalent if $v_1 - v_2 \\in U$, and $V / U$ consists of the **equivalence classes** $[v] = v + U = \\{v + u : u \\in U\\}$.

This construction is at first deeply abstract, but it is one of the most useful tools in higher linear algebra. It captures the idea of "remembering only what is independent of $U$" — collapsing $U$ to a single point and studying the structure that remains.

The quotient $V / U$ is itself a vector space, with operations inherited in the natural way:
$$[v_1] + [v_2] = [v_1 + v_2], \\quad c \\cdot [v] = [c v].$$

You have to check that these operations are well-defined — that the result of adding or scaling depends on the equivalence class, not the specific representative chosen. The check works precisely because $U$ is a subspace.

The quotient space's dimension is given by $\\dim(V / U) = \\dim(V) - \\dim(U)$. This makes intuitive sense: collapsing a $\\dim(U)$-dimensional subspace removes $\\dim(U)$ degrees of freedom from $V$.

Quotient spaces appear naturally in two main settings:

**Quotient by a subspace of the domain.** If $T: V \\to W$ is linear, the quotient $V / \\ker(T)$ is the **[[coimage-cokernel|coimage]]** of $T$. There is a natural [[injective-surjective|isomorphism]] $V / \\ker(T) \\cong \\text{im}(T)$ — sending each equivalence class $[v]$ to $T(v)$. This is well-defined because if $v_1$ and $v_2$ differ by a kernel element, they have the same image. The isomorphism is part of the [[fundamental-theorem|Fundamental Theorem]].

**Quotient by a subspace of the codomain.** If $T: V \\to W$ is linear, the quotient $W / \\text{im}(T)$ is the **[[coimage-cokernel|cokernel]]** of $T$. It captures "what $T$ misses" in the codomain.

A useful concrete example: take $V = \\mathbb{R}^2$ and $U = $ the $x$-axis. Then $V / U$ has dimension $1$, and equivalence classes are horizontal lines (parallel to $U$). Each equivalence class is identified by its $y$-coordinate, so $V / U \\cong \\mathbb{R}$.

For the abstract definition to feel less abstract, here is the philosophical point: a quotient is an answer to the question "what would it look like if I declared the elements of $U$ negligible?" The result is a new vector space where everything in $U$ has been merged with $0$. This is constantly used in mathematics to study aspects of $V$ that are "modulo $U$" — invariant under shifting by elements of $U$.
    `.trim(),

    definitions: [
      {
        term: 'Equivalence class',
        body: 'For a subspace $U \\subseteq V$ and a vector $v \\in V$: $[v] = v + U = \\{v + u : u \\in U\\}$. Two vectors are equivalent ($v_1 \\sim v_2$) iff $v_1 - v_2 \\in U$.',
      },
      {
        term: 'Quotient space',
        body: '$V / U$ = the set of all equivalence classes $[v]$, equipped with the operations $[v_1] + [v_2] = [v_1 + v_2]$ and $c \\cdot [v] = [c v]$. Itself a vector space.',
      },
      {
        term: 'Quotient map',
        body: 'The natural linear surjection $\\pi: V \\to V/U$ defined by $\\pi(v) = [v]$. Has kernel $U$.',
      },
    ],

    theorems: [
      {
        name: 'Quotient is a vector space',
        statement: 'For a subspace $U \\subseteq V$, the operations on $V / U$ are well-defined and satisfy all eight [[vector-space-axioms|vector space axioms]].',
        intuition: 'Well-definedness is the only nontrivial check — it requires that "shifting by $U$" does not affect the result of operations. This works exactly because $U$ is closed under addition and scalar multiplication.',
      },
      {
        name: 'Dimension of the quotient',
        statement: '$\\dim(V / U) = \\dim(V) - \\dim(U)$ when $V$ is finite-dimensional.',
        intuition: 'Pick a basis of $U$ and extend to a basis of $V$. The "extending" basis vectors descend to a basis of $V / U$, with size $\\dim(V) - \\dim(U)$.',
      },
      {
        name: 'First isomorphism theorem',
        statement: 'For a linear $T: V \\to W$, the quotient $V / \\ker(T)$ is isomorphic to $\\text{im}(T)$. The isomorphism is induced by sending $[v] \\mapsto T(v)$.',
        intuition: 'Collapsing the kernel to a point removes precisely the "redundancy" of $T$ — what is left is in bijection with $T$\'s output. This is the formal statement of "$T$ acts faithfully on $V / \\ker(T)$."',
      },
    ],

    keyFormulas: [
      '[v] = v + U = \\{v + u : u \\in U\\}',
      'V / U = \\{[v] : v \\in V\\}',
      '\\dim(V/U) = \\dim(V) - \\dim(U)',
      'V / \\ker(T) \\cong \\text{im}(T)',
    ],
  },

  explore: {
    vizComponent: 'QuotientViz',
    description: 'Pick $V = \\mathbb{R}^2$ and a 1-dimensional subspace $U$ (a line through origin). The viz shows how each point of $\\mathbb{R}^2$ belongs to one equivalence class — a line parallel to $U$. Slide a representative around to see different equivalence classes selected. The quotient space $\\mathbb{R}^2 / U$ is parameterized by these parallel lines, identifying the geometric structure of the quotient.',
    misconception: {
      title: 'A quotient space is NOT just "vectors not in $U$"',
      body: `
A common misreading: thinking $V / U$ consists of the vectors in $V$ that are not in $U$. This is wrong on multiple levels.

First, "vectors not in $U$" is not even a vector space — it does not contain the zero vector, and it is not closed under addition (sums of two non-$U$ vectors might land in $U$).

Second, $V / U$ is not a subset of $V$ at all. It is a different vector space whose elements are *equivalence classes* — sets of vectors that differ by elements of $U$. Each equivalence class is a coset of $U$ in $V$, looking like $v + U$ for some $v$.

A second misconception: thinking the quotient depends on choosing a representative. It does not. Different representatives of the same equivalence class give the same equivalence class — that is the whole point of working modulo $U$. The notation $[v]$ emphasizes this: the equivalence class is the object, not the specific $v$ that named it.

A third trap: confusing $V / U$ with the [[orthogonal-complements|orthogonal complement]] $U^\\perp$. The orthogonal complement is a subspace of $V$, defined using an inner product. The quotient is a separate vector space, defined without an inner product. They are different objects, although for finite-dimensional inner product spaces, $U^\\perp \\cong V / U$ via projection.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute a quotient in $\\mathcal{P}_3$',
        body: 'Let $V = \\mathcal{P}_3$ and $U = \\text{span}\\{x^2, x^3\\}$. The quotient $V / U$ has dimension $\\dim(\\mathcal{P}_3) - \\dim(U) = 4 - 2 = 2$. Each equivalence class has the form $[a + b x + c x^2 + d x^3] = [a + b x]$ since $c x^2 + d x^3 \\in U$ and so disappears. So $V / U \\cong \\mathcal{P}_1$, with the constant and linear coefficients as a basis.',
      },
    ],

    problems: [
      {
        id: 'P-3.7a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Given a subspace $W \\subseteq V$, the quotient space $V / W$ consists of:',
        choices: [
          { label: 'A' as const, body: 'All vectors in $V$ that are not in $W$.' },
          { label: 'B' as const, body: 'All vectors orthogonal to $W$.' },
          { label: 'C' as const, body: 'Equivalence classes of the form $v + W = \\{v + w : w \\in W\\}$.' },
          { label: 'D' as const, body: 'The intersection $V \\cap W$.' },
          { label: 'E' as const, body: '"Vectors in $V$ divided by vectors in $W$" in some literal sense.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The quotient $V / W$ consists of cosets (equivalence classes) of $W$ in $V$: each element is a set of the form $v + W$. Two vectors are in the same equivalence class iff their difference lies in $W$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Not a vector space — does not contain $0$, not closed under addition. The quotient must be a vector space.' },
            { choice: 'B' as const, why: 'Orthogonal complements require an [[dot-and-inner-products|inner product]]; quotient spaces do not. They are different concepts.' },
            { choice: 'D' as const, why: '$V \\cap W = W$ (since $W \\subseteq V$) — that is just $W$ itself, not the quotient.' },
            { choice: 'E' as const, why: '"Division" in the quotient notation is metaphorical — referring to the equivalence-class construction, not literal division.' },
          ],
        },
      },
      {
        id: 'P-3.7b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the linear transformation $T: \\mathcal{P}_3 \\to \\mathbb{R}^2$ defined by $T(p) = \\begin{pmatrix} p(0) \\\\ p\'(0) \\end{pmatrix}$. The quotient space $\\mathcal{P}_3 / \\ker(T)$ has what dimension?',
        choices: [
          { label: 'A' as const, body: '$1$' },
          { label: 'B' as const, body: '$2$' },
          { label: 'C' as const, body: '$3$' },
          { label: 'D' as const, body: '$4$' },
          { label: 'E' as const, body: '$0$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: '$\\ker(T)$ consists of polynomials with $p(0) = 0$ and $p\'(0) = 0$, i.e., polynomials of the form $a x^2 + b x^3$. So $\\dim(\\ker(T)) = 2$. By the dimension formula for quotients: $\\dim(\\mathcal{P}_3 / \\ker(T)) = 4 - 2 = 2$. By the [[fundamental-theorem|first isomorphism theorem]], this also equals $\\dim(\\text{im}(T)) = \\dim(\\mathbb{R}^2) = 2$ ✓ (since $T$ is surjective onto $\\mathbb{R}^2$).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Miscounts the kernel.' },
            { choice: 'C' as const, why: 'Adds dimensions instead of subtracting; or computes $4 - 1 = 3$.' },
            { choice: 'D' as const, why: 'This is $\\dim(\\mathcal{P}_3)$, not the quotient.' },
            { choice: 'E' as const, why: 'Would mean $T$ is injective; but the kernel here is 2-dimensional, so $T$ is far from injective.' },
          ],
        },
      },
    ],
  },
};
