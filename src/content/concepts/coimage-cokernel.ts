import type { Concept } from '../types';

export const coimageCokernel: Concept = {
  id: 'coimage-cokernel',
  unitId: 'ch3',
  number: '3.8',
  title: 'Coimage & Cokernel',
  blurb: 'Two more subspaces, formed by quotienting — completing the four-fold symmetry of a linear transformation.',
  tier: 'full',

  learn: {
    overview: `
Beyond [[image-and-kernel|kernel and image]], a [[linear-transformation-defs|linear transformation]] $T: V \\to W$ has two more associated [[subspaces]] formed by [[quotients|quotient construction]]:

- **Coimage**: $\\text{coim}(T) = V / \\ker(T)$. Lives in the quotient of the domain by the kernel.
- **Cokernel**: $\\text{coker}(T) = W / \\text{im}(T)$. Lives in the quotient of the codomain by the image.

Together, kernel, image, coimage, and cokernel form the **four fundamental subspaces** associated with $T$. The names follow a pattern: kernel/image are the "primary" objects, and coimage/cokernel are their "co-objects" — formed by quotienting rather than by selecting.

**The coimage** $V / \\ker(T)$ measures the "essential" structure of the domain: the part of $V$ that $T$ acts on injectively. Vectors in the same equivalence class of $V / \\ker(T)$ are precisely those that $T$ sends to the same output. So the quotient strips away the redundancy of the kernel and leaves a faithful copy of "what $T$ actually does."

The first isomorphism theorem (which is the algebraic skeleton of the [[fundamental-theorem|Fundamental Theorem of Linear Algebra]]) makes this precise:

$$\\text{coim}(T) = V / \\ker(T) \\cong \\text{im}(T).$$

The isomorphism sends each equivalence class $[v]$ to its image $T(v)$, which is well-defined because vectors in the same class differ by a kernel element. Geometrically: collapse the kernel to a point in $V$, and what remains is in 1-to-1 correspondence with the image of $T$.

**The cokernel** $W / \\text{im}(T)$ measures "what $T$ misses." Two vectors in $W$ are equivalent in the cokernel iff their difference is in $\\text{im}(T)$. So the cokernel collapses to zero everything in the image, leaving only the part of $W$ that $T$ does not reach.

If $T$ is surjective, $\\text{im}(T) = W$ and $\\text{coker}(T) = W / W = \\{0\\}$. Conversely, the cokernel is trivial iff $T$ is surjective. So the cokernel measures the "failure of surjectivity" in the same way that the kernel measures the "failure of injectivity."

For finite-dimensional spaces, dimensions are easy to compute:

- $\\dim(\\text{coim}(T)) = \\dim(V) - \\dim(\\ker(T)) = \\text{rank}(T)$.
- $\\dim(\\text{coker}(T)) = \\dim(W) - \\dim(\\text{im}(T)) = \\dim(W) - \\text{rank}(T)$.

These four dimensions — nullity, rank, rank, "co-rank" — capture the full numerical structure of $T$, and they enter the [[fundamental-theorem|Fundamental Theorem]] as the dimensions of the four fundamental subspaces.

A key warning: the kernel and the cokernel measure different things, in different spaces. They both detect "defects" of $T$, but they are not isomorphic in general. The kernel has dimension $\\text{nullity}(T) = \\dim(V) - \\text{rank}(T)$, and the cokernel has dimension $\\dim(W) - \\text{rank}(T)$ — these agree only when $\\dim(V) = \\dim(W)$, i.e., for square-shaped maps.
    `.trim(),

    definitions: [
      {
        term: 'Coimage',
        body: '$\\text{coim}(T) = V / \\ker(T)$, the quotient of the domain by the kernel. Isomorphic to $\\text{im}(T)$ via the map induced by $T$.',
      },
      {
        term: 'Cokernel',
        body: '$\\text{coker}(T) = W / \\text{im}(T)$, the quotient of the codomain by the image. Trivial iff $T$ is surjective.',
      },
      {
        term: 'Four fundamental subspaces',
        body: 'For a linear $T: V \\to W$: the kernel ($\\subseteq V$), image ($\\subseteq W$), coimage ($V / \\ker(T)$), and cokernel ($W / \\text{im}(T)$). The first two are "selected" subspaces; the last two are "quotient" subspaces.',
      },
    ],

    theorems: [
      {
        name: 'First isomorphism theorem',
        statement: 'For a linear $T: V \\to W$, $\\text{coim}(T) = V / \\ker(T) \\cong \\text{im}(T)$. Explicitly, the map $[v] \\mapsto T(v)$ is a well-defined linear isomorphism.',
        intuition: 'Quotienting by the kernel removes exactly the redundancy of $T$ — what is left maps faithfully to the image. This is the algebraic content that the [[fundamental-theorem|Fundamental Theorem]] geometrizes via orthogonality.',
      },
      {
        name: 'Cokernel and surjectivity',
        statement: '$\\text{coker}(T) = \\{0\\}$ iff $T$ is surjective.',
        intuition: 'The cokernel measures what is "missed" by $T$. If $T$ misses nothing, the quotient $W / \\text{im}(T) = W / W$ is trivial.',
      },
    ],

    keyFormulas: [
      '\\text{coim}(T) = V / \\ker(T)',
      '\\text{coker}(T) = W / \\text{im}(T)',
      '\\text{coim}(T) \\cong \\text{im}(T)',
      '\\dim(\\text{coker}(T)) = \\dim(W) - \\text{rank}(T)',
    ],
  },

  explore: {
    vizComponent: 'CoimageCokernelViz',
    description: 'For a linear map $T: \\mathbb{R}^3 \\to \\mathbb{R}^3$, visualize all four fundamental subspaces: kernel and coimage in the domain ($\\mathbb{R}^3$), image and cokernel in the codomain ($\\mathbb{R}^3$). Drag the matrix entries to see how the subspaces deform — and watch the isomorphism between coimage and image become visible as parallel structures.',
    misconception: {
      title: 'The cokernel is NOT the same as the kernel',
      body: `
Both kernel and cokernel measure "defects" of $T$, but they live in different spaces and capture different defects:

- The **kernel** is in the domain $V$. It contains vectors that $T$ collapses to zero — the "redundancy" of $T$ in the input direction.
- The **cokernel** is a quotient of the codomain $W$. It captures the "missing output directions" of $T$ — what $T$ fails to reach.

For $T: \\mathbb{R}^7 \\to \\mathbb{R}^5$ with rank $4$: the kernel has dimension $7 - 4 = 3$, while the cokernel has dimension $5 - 4 = 1$. These are not even equal in dimension, let alone isomorphic.

A second misconception: thinking the cokernel is a subspace of $W$. It is not. The cokernel is a *quotient* of $W$ — a different vector space whose elements are equivalence classes, not vectors in $W$. The dimension formula $\\dim(\\text{coker}) = \\dim(W) - \\dim(\\text{im}(T))$ counts equivalence classes, not vectors of any kind.

A third trap: confusing the cokernel with the [[orthogonal-complements|orthogonal complement]] $\\text{im}(T)^\\perp$ of the image. These are isomorphic when $W$ has an inner product (the [[geometric-fundamental-theorem|geometric form]] of the Fundamental Theorem makes this precise), but they are conceptually different objects: the orthogonal complement is a subspace of $W$, while the cokernel is a quotient of $W$.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute the cokernel dimension',
        body: 'Let $T: \\mathbb{R}^3 \\to \\mathbb{R}^4$ have rank $2$. The cokernel has dimension $\\dim(\\mathbb{R}^4) - \\text{rank}(T) = 4 - 2 = 2$. So the cokernel is a 2-dimensional quotient space — equivalence classes formed by collapsing the 2-dimensional image to zero in $\\mathbb{R}^4$.',
      },
    ],

    problems: [
      {
        id: 'P-3.8a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $T: V \\to W$ be a linear transformation. Which of the following best describes the cokernel of $T$?',
        choices: [
          { label: 'A' as const, body: 'The subspace of the domain consisting of vectors that $T$ collapses to zero.' },
          { label: 'B' as const, body: 'A quotient space that measures what portion of the codomain $W$ is "missed" by $T$.' },
          { label: 'C' as const, body: 'The subspace of $W$ consisting of all possible outputs $T(v)$.' },
          { label: 'D' as const, body: 'A quotient space formed from the domain by identifying vectors that have the same image.' },
          { label: 'E' as const, body: 'The subspace of $W$ consisting of vectors that cannot be expressed as $T(v)$ for any $v \\in V$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The cokernel is $W / \\text{im}(T)$, the quotient of the codomain by the image. It captures "what $T$ fails to reach" via equivalence classes. If $T$ is surjective, $\\text{im}(T) = W$ and the cokernel is trivial.',
          partialCredit: '(D) earns partial credit — that description correctly applies to the COIMAGE $V / \\ker(T)$, not the cokernel. A student who understands quotient constructions but confuses coimage and cokernel deserves partial credit.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'This describes the KERNEL, not the cokernel.' },
            { choice: 'C' as const, why: 'This describes the IMAGE.' },
            { choice: 'D' as const, why: 'This describes the COIMAGE. Earns partial credit for understanding quotient constructions.' },
            { choice: 'E' as const, why: 'Tempting but wrong: the set of "missed" vectors is NOT a subspace! If $w_1, w_2 \\notin \\text{im}(T)$, their sum $w_1 + w_2$ might be in $\\text{im}(T)$. The cokernel handles this via equivalence classes, not subset selection.' },
          ],
        },
      },
    ],
  },
};
