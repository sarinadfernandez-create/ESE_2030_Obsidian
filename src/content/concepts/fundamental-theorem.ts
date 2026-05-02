import type { Concept } from '../types';

export const fundamentalTheorem: Concept = {
  id: 'fundamental-theorem',
  unitId: 'ch3',
  number: '3.9',
  title: 'Fundamental Theorem of Linear Algebra',
  blurb: 'The decomposition that organizes everything: domain splits into kernel + coimage; codomain splits into image + cokernel.',
  tier: 'full',

  learn: {
    overview: `
The **Fundamental Theorem of Linear Algebra** is the structural backbone of this course — the result that ties together [[image-and-kernel|kernels, images]], [[coimage-cokernel|coimages, cokernels]], and [[rank-and-nullity|rank-nullity]] into a single coherent decomposition. It comes in two versions: the **algebraic form** (this section) and the [[geometric-fundamental-theorem|geometric form]] in Unit 6, which adds [[orthogonal-complements|orthogonality]] to the mix.

For a [[linear-transformation-defs|linear transformation]] $T: V \\to W$ between finite-dimensional vector spaces, the algebraic form states three things:

1. **$V \\cong \\ker(T) \\oplus \\text{coim}(T)$**: the domain is a [[subspaces|direct sum]] of the kernel and the coimage.
2. **$W \\cong \\text{im}(T) \\oplus \\text{coker}(T)$**: the codomain is a direct sum of the image and the cokernel.
3. **$\\text{coim}(T) \\cong \\text{im}(T)$**: the coimage and image are isomorphic.

These three statements are the structural skeleton. From them, every numerical fact about $T$ flows:

- Taking dimensions in (1): $\\dim(V) = \\text{nullity}(T) + \\text{rank}(T)$. This is **rank-nullity**.
- Taking dimensions in (2): $\\dim(W) = \\text{rank}(T) + \\dim(\\text{coker}(T))$.
- Taking dimensions in (3): $\\dim(\\text{coim}(T)) = \\dim(\\text{im}(T)) = \\text{rank}(T)$.

The picture: $T$ sends the domain $V$ to the codomain $W$. It collapses the kernel to zero. The coimage (the "useful part" of the domain) is mapped isomorphically onto the image (the "reached part" of the codomain). The cokernel sits in $W$ as the part that $T$ misses.

This decomposition is the algebraic story. Each piece has a name, a role, and a dimension, and they fit together according to the theorem. In matrix terms, the four pieces correspond to the four fundamental subspaces of an $m \\times n$ matrix $A$: the null space $\\subseteq \\mathbb{R}^n$, the column space $\\subseteq \\mathbb{R}^m$, the row space $\\subseteq \\mathbb{R}^n$ (which is $\\cong$ to the coimage), and the left null space $\\subseteq \\mathbb{R}^m$ (which is $\\cong$ to the cokernel).

The Fundamental Theorem is more than bookkeeping. It says the action of any linear transformation, no matter how complicated, decomposes into an isomorphism on a "core" subspace plus the trivial action on the rest. This is the foundation for virtually every structural theorem about linear transformations: the [[svd-form|SVD]] makes the isomorphism diagonal in suitable bases; [[simple-diagonalization|diagonalization]] applies it when $V = W$ and the transformation has a basis of [[eigenvectors]]; [[least-squares|least squares]] uses the geometric refinement.

The deeper philosophical point: the Fundamental Theorem implies that every linear transformation is, after collapsing kernel and ignoring cokernel, an *isomorphism*. The "complicated" behaviors of linear maps — non-injectivity, non-surjectivity — are accounted for by the kernel and cokernel, leaving an isomorphism between the coimage and image at the core. This is why so many linear-algebra arguments reduce to "study the isomorphism."
    `.trim(),

    definitions: [
      {
        term: 'Direct sum',
        body: 'For subspaces $U, W$ of $V$ with $U \\cap W = \\{0\\}$ and $U + W = V$: $V = U \\oplus W$. Every vector $v \\in V$ decomposes uniquely as $v = u + w$ with $u \\in U, w \\in W$.',
      },
      {
        term: 'Four fundamental subspaces',
        body: 'For a linear $T: V \\to W$: the kernel, image, coimage, and cokernel. They fit together via the Fundamental Theorem.',
      },
    ],

    theorems: [
      {
        name: 'Fundamental Theorem of Linear Algebra (algebraic form)',
        statement: 'For a linear $T: V \\to W$ between finite-dimensional vector spaces:\n\n(i) $V \\cong \\ker(T) \\oplus \\text{coim}(T)$.\n\n(ii) $W \\cong \\text{im}(T) \\oplus \\text{coker}(T)$.\n\n(iii) $\\text{coim}(T) \\cong \\text{im}(T)$.\n\n(iv) (Rank-nullity) $\\dim(V) = \\dim(\\ker(T)) + \\dim(\\text{im}(T))$.',
        intuition: 'The full structural picture: $V$ decomposes into "what gets killed" (kernel) and "what acts injectively" (coimage). $W$ decomposes into "what gets reached" (image) and "what gets missed" (cokernel). The coimage and image are isomorphic via $T$ itself, restricted to the coimage.',
      },
      {
        name: 'Rank-nullity from the FTLA',
        statement: '$\\dim(V) = \\text{rank}(T) + \\text{nullity}(T)$.',
        intuition: 'Take dimensions in $V \\cong \\ker(T) \\oplus \\text{coim}(T)$ and use $\\dim(\\text{coim}(T)) = \\text{rank}(T)$. The version most often quoted in [[rank-and-nullity|rank-nullity]] is this consequence.',
      },
    ],

    keyFormulas: [
      'V \\cong \\ker(T) \\oplus \\text{coim}(T)',
      'W \\cong \\text{im}(T) \\oplus \\text{coker}(T)',
      '\\text{coim}(T) \\cong \\text{im}(T)',
      '\\dim(V) = \\text{nullity}(T) + \\text{rank}(T)',
    ],
  },

  explore: {
    vizComponent: 'FundamentalTheoremViz',
    description: 'For a linear $T: \\mathbb{R}^3 \\to \\mathbb{R}^3$, visualize the full decomposition: domain split into kernel + coimage, codomain split into image + cokernel, and the isomorphism connecting coimage and image. Vary the matrix to see the four pieces resize while preserving the structural relationships.',
    misconception: {
      title: 'Coimage and image have equal DIMENSION but live in DIFFERENT spaces',
      body: `
A common misreading of "coimage $\\cong$ image" is to think they are the same subspace, just renamed. They are not. The coimage is a quotient of $V$ (the domain), while the image is a subspace of $W$ (the codomain). They are different vector spaces; the isomorphism is a *correspondence* between them, not an identification.

The relationship is parallel to the way $\\mathbb{R}^4$ and $\\mathbb{R}^{2 \\times 2}$ are isomorphic: same dimension, same linear-algebra structure, but the elements are different kinds of objects. For coimage and image: same dimension equal to $\\text{rank}(T)$, but coimage elements are equivalence classes in $V$ while image elements are vectors in $W$.

A second misconception: thinking that the FTLA guarantees $\\dim(V) = \\dim(W)$. It does not. The FTLA says nothing about how $\\dim(V)$ and $\\dim(W)$ relate — they can be very different. What it says is that *within* each space, there is a clean decomposition.

A third trap: applying the FTLA to non-linear transformations. The theorem is fundamentally about *linear* transformations and depends on linearity at every step. For non-linear maps, none of the structural decompositions hold (kernels and images need not even be subspaces).
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Apply the FTLA dimensions to a specific case',
        body: 'For $T: V \\to W$ with $\\dim(V) = 7$, $\\dim(W) = 5$, and $\\dim(\\ker(T)) = 3$: by the FTLA, $\\text{rank}(T) = \\dim(V) - \\dim(\\ker(T)) = 7 - 3 = 4$. Then $\\dim(\\text{coim}(T)) = 4$ (matches), and $\\dim(\\text{coker}(T)) = \\dim(W) - \\text{rank}(T) = 5 - 4 = 1$. The four dimensions are $(3, 4, 4, 1)$.',
      },
    ],

    problems: [
      {
        id: 'P-3.9a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $T: V \\to W$ be a linear transformation with $\\dim(V) = 7$ and $\\dim(W) = 5$. Suppose $\\dim(\\ker(T)) = 3$. According to the Fundamental Theorem of Linear Algebra, which statement is TRUE?',
        choices: [
          { label: 'A' as const, body: '$\\ker(T) \\cong \\text{coker}(T)$, since both measure "what $T$ misses."' },
          { label: 'B' as const, body: '$\\text{coim}(T) \\cong \\text{im}(T)$, with $\\dim(\\text{coim}(T)) = \\dim(\\text{im}(T)) = 4$.' },
          { label: 'C' as const, body: '$V \\cong W$ — every linear transformation induces an isomorphism between domain and codomain.' },
          { label: 'D' as const, body: '$\\ker(T) \\cong \\text{im}(T)$ since the dimensions must add up to $\\dim(V)$.' },
          { label: 'E' as const, body: '$\\text{coker}(T)$ has dimension $3$ because it is isomorphic to $\\ker(T)$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'By the FTLA, $\\text{coim}(T) \\cong \\text{im}(T)$. Both have dimension equal to $\\text{rank}(T) = \\dim(V) - \\dim(\\ker(T)) = 7 - 3 = 4$. The isomorphism is induced by $T$ itself, sending $[v] \\in V / \\ker(T)$ to $T(v) \\in \\text{im}(T)$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Kernel and cokernel both measure "defects" but in different spaces and with different dimensions. Kernel has dimension $3$; cokernel has dimension $\\dim(W) - \\text{rank}(T) = 5 - 4 = 1$.' },
            { choice: 'C' as const, why: 'False. $\\dim(V) = 7 \\neq 5 = \\dim(W)$, so they are not isomorphic.' },
            { choice: 'D' as const, why: 'Rank-nullity says nullity + rank = $\\dim(V)$, but nullity = 3 and rank = 4 — they do not even have equal dimension, let alone isomorphic.' },
            { choice: 'E' as const, why: 'The cokernel has dimension $\\dim(W) - \\text{rank}(T) = 5 - 4 = 1$, not $3$. Kernel and cokernel are generally NOT isomorphic.' },
          ],
        },
      },
    ],
  },
};
