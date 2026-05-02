import type { Concept } from '../types';

export const linearTransformationExamples: Concept = {
  id: 'linear-transformation-examples',
  unitId: 'ch3',
  number: '3.3',
  title: 'Linear Transformation Examples',
  blurb: 'A field guide to linear transformations beyond matrices: differentiation, integration, evaluation, and more.',
  tier: 'full',

  learn: {
    overview: `
The [[linear-transformation-defs|definition of linearity]] is general enough to apply to many transformations that don't look like matrix multiplication at first glance. This section catalogs the most important examples so you can recognize linearity in unfamiliar settings.

**Matrix transformations.** Every $m \\times n$ matrix $A$ defines a linear transformation $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ by $T(x) = Ax$. Conversely, every linear transformation between finite-dimensional spaces can be represented as matrix multiplication once [[bases]] are chosen. This is the [[matrix-representations|matrix representation]] correspondence: linear transformations and matrices are two views of the same underlying object.

**Differentiation.** The map $D: \\mathcal{P}_n \\to \\mathcal{P}_{n-1}$ defined by $D(p) = p'$ is linear: $(p + q)' = p' + q'$ and $(c p)' = c p'$. More generally, on any function space where differentiation is well-defined, $D$ is a linear operator. This is the structural reason why [[linear-differential-equations|linear differential equations]] have solution spaces that are vector spaces.

**Integration.** The definite integral $I: C([a, b]) \\to \\mathbb{R}$ defined by $I(f) = \\int_a^b f(t) \\, dt$ is linear, by linearity of the integral. The indefinite integral $I: \\mathcal{P}_n \\to \\mathcal{P}_{n+1}$ (with a fixed constant of integration to make it well-defined) is also linear.

**Evaluation.** For a function space, the map $E_a: V \\to \\mathbb{R}$ defined by $E_a(f) = f(a)$ — evaluation at a fixed point $a$ — is a linear functional. This is what makes "the value of a polynomial at a point" a coordinate-like quantity in [[bases]] like the [[bases|Lagrange basis]].

**Multiplication by a fixed function.** The map $M_g: V \\to V$ defined by $M_g(f) = g \\cdot f$ is linear in $f$ (for fixed $g$). This includes "multiplication by $x$" sending $\\mathcal{P}_n$ to $\\mathcal{P}_{n+1}$, and pointwise multiplication by a fixed signal in signal processing.

**Convolution.** For appropriately defined function or signal spaces, convolution with a fixed kernel is a linear transformation. This is the linear-algebra explanation of why [[engineering-signals|filters in signal processing]] are linear time-invariant operators.

**Coordinate maps.** Given a [[bases|basis]] $\\mathcal{B}$ of $V$, the [[coordinates|coordinate map]] $\\phi_\\mathcal{B}: V \\to \\mathbb{R}^n$ that sends each vector to its coordinate vector is itself a linear transformation. In fact, it is a linear [[injective-surjective|isomorphism]] — every finite-dimensional vector space is isomorphic to $\\mathbb{R}^n$ via this map.

A non-example to keep in mind: **squaring a matrix**, $F(A) = A^2$, is not linear, even though $F(0) = 0$. The check that catches it is homogeneity: $F(cA) = c^2 A^2 \\neq c A^2$. Many "natural-looking" operations on matrices and functions fail to be linear in this way; the two axioms remain the reliable test.
    `.trim(),

    definitions: [
      {
        term: 'Differentiation operator',
        body: 'The map $D: V \\to V$ on a space of differentiable functions, sending each function to its derivative. Linear by linearity of differentiation.',
      },
      {
        term: 'Integration operator',
        body: 'The map $I: V \\to \\mathbb{R}$ (or $V \\to V$) sending each function to its definite or indefinite integral. Linear by linearity of integration.',
      },
      {
        term: 'Evaluation functional',
        body: 'For a fixed point $a$, the map $E_a: V \\to \\mathbb{R}$ sending each function to its value at $a$. A linear functional on the function space.',
      },
      {
        term: 'Coordinate map',
        body: 'For a basis $\\mathcal{B}$ of a vector space $V$, the linear isomorphism $\\phi_\\mathcal{B}: V \\to \\mathbb{R}^n$ sending each vector to its coordinate vector $[v]_\\mathcal{B}$.',
      },
    ],

    theorems: [
      {
        name: 'Compositions of linear transformations are linear',
        statement: 'If $S: U \\to V$ and $T: V \\to W$ are both linear, then so is $T \\circ S: U \\to W$.',
        intuition: 'Apply linearity twice: $(T \\circ S)(u_1 + u_2) = T(S(u_1) + S(u_2)) = T(S(u_1)) + T(S(u_2))$, and similarly for scalar multiplication. The structural payoff: complex linear maps can be built up from simpler pieces.',
      },
      {
        name: 'Linear combinations of linear transformations are linear',
        statement: 'If $S, T: V \\to W$ are linear and $a, b$ are scalars, then $aS + bT$ (defined pointwise by $(aS + bT)(v) = a S(v) + b T(v)$) is linear.',
        intuition: 'The space of linear transformations from $V$ to $W$, denoted $\\mathcal{L}(V, W)$, is itself a vector space. This is what makes "differential operators" like $D^2 - 3D + 2I$ well-defined linear operators on function spaces.',
      },
    ],

    keyFormulas: [
      'D(p) = p\' \\quad \\text{(differentiation)}',
      'I(f) = \\int_a^b f(t) \\, dt \\quad \\text{(integration)}',
      'E_a(f) = f(a) \\quad \\text{(evaluation)}',
      'T \\circ S \\text{ linear if } T, S \\text{ both linear}',
    ],
  },

  explore: {
    vizComponent: 'LinearTransformGallery',
    description: 'Cycle through six examples of linear transformations: matrix multiplication, differentiation on $\\mathcal{P}_3$, integration on $\\mathcal{P}_2$, evaluation at a point, multiplication by $x$, and the cumulative-sum lower triangular transform. For each, the viz tests linearity against random inputs and shows that both axioms hold.',
    misconception: {
      title: 'Many "natural" operations on matrices and functions are NOT linear',
      body: `
The most commonly mistaken non-examples:

**Matrix squaring**, $F(A) = A^2$, is nonlinear despite preserving zero. The product introduces quadratic behavior.

**Determinant**, $\\det: \\mathbb{R}^{n \\times n} \\to \\mathbb{R}$, is nonlinear. It is multiplicative ($\\det(AB) = \\det(A) \\det(B)$) but not additive ($\\det(A + B) \\neq \\det(A) + \\det(B)$ in general).

**Trace**, $\\text{tr}: \\mathbb{R}^{n \\times n} \\to \\mathbb{R}$, IS linear. The trace is the sum of diagonal entries, which is a linear functional.

**Transposition**, $T(A) = A^T$, IS linear. The transpose preserves sums and scalar multiples.

**Inverse**, $A \\mapsto A^{-1}$ (on the open subset of invertible matrices), is nonlinear. $(A + B)^{-1} \\neq A^{-1} + B^{-1}$ in general.

The reliable check remains the two linearity axioms. When in doubt, plug in two specific inputs and verify $T(u + v) = T(u) + T(v)$ and $T(c v) = c T(v)$ — failure of either rules out linearity.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify that differentiation $D: \\mathcal{P}_3 \\to \\mathcal{P}_2$ is linear',
        body: 'Take $p, q \\in \\mathcal{P}_3$ and a scalar $c$. By the rules of calculus: $D(p + q) = (p + q)\' = p\' + q\' = D(p) + D(q)$. ✓ And $D(c p) = (c p)\' = c p\' = c D(p)$. ✓ Both axioms hold.',
      },
      {
        title: 'Show that $F(A) = A^2$ is not linear',
        body: 'Pick $A = I$ and $c = 2$. Then $F(2I) = (2I)^2 = 4 I$, but $2 F(I) = 2 I$. The two are unequal, so homogeneity fails. ✗ Note that $F(0) = 0$, so the simplest test passes — you must check the actual axioms.',
      },
    ],

    problems: [
      {
        id: 'P-3.3a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Define $T: \\mathcal{P}_2 \\to \\mathbb{R}^2$ by $T(p) = \\begin{pmatrix} p(0) \\\\ p(1) - p(0) \\end{pmatrix}$. Which statement is TRUE?',
        choices: [
          { label: 'A' as const, body: '$T$ is not linear because evaluation at a point is not a linear operation.' },
          { label: 'B' as const, body: '$T$ is a linear transformation with $\\dim(\\ker(T)) = 1$.' },
          { label: 'C' as const, body: '$T$ is a linear transformation with $\\dim(\\ker(T)) = 2$.' },
          { label: 'D' as const, body: '$T$ is linear and injective.' },
          { label: 'E' as const, body: '$T$ is not linear because the codomain has smaller dimension than the domain.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: '$T$ is linear because both $p \\mapsto p(0)$ and $p \\mapsto p(1) - p(0)$ are linear (linear combinations of evaluation functionals are linear). For the kernel: $p(x) = a + bx + cx^2$ is in $\\ker(T)$ iff $p(0) = a = 0$ and $p(1) - p(0) = b + c = 0$. So $a = 0, c = -b$, giving $\\ker(T) = \\{b x - b x^2 : b \\in \\mathbb{R}\\} = \\text{span}\\{x - x^2\\}$, which is 1-dimensional.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Evaluation is linear: $(p + q)(0) = p(0) + q(0)$, $(c p)(0) = c \\cdot p(0)$.' },
            { choice: 'C' as const, why: 'Miscounts free parameters in the kernel.' },
            { choice: 'D' as const, why: 'By [[rank-and-nullity|rank-nullity]], $\\dim(\\ker(T)) = \\dim(\\mathcal{P}_2) - \\dim(\\text{im}(T)) \\geq 3 - 2 = 1$, so $T$ is not injective.' },
            { choice: 'E' as const, why: 'Dimension mismatch does not preclude linearity. Many linear transformations have unequal-dimensional domain and codomain.' },
          ],
        },
      },
      {
        id: 'P-3.3b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider differentiation as a linear transformation: $S: \\mathcal{P}_5 \\to \\mathcal{P}_5$ and $T: \\mathcal{P}_5 \\to \\mathcal{P}_4$, both defined by $p \\mapsto p\'$. Which statement is TRUE?',
        choices: [
          { label: 'A' as const, body: '$S$ is surjective.' },
          { label: 'B' as const, body: '$T$ is injective.' },
          { label: 'C' as const, body: '$S$ and $T$ have kernels of different dimensions.' },
          { label: 'D' as const, body: '$T$ is surjective but $S$ is not.' },
          { label: 'E' as const, body: '$S$ and $T$ are both isomorphisms because differentiation has integration as an inverse.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'The image of differentiation on $\\mathcal{P}_5$ is $\\mathcal{P}_4$ (derivatives of degree-$5$ polynomials have degree at most $4$). For $S: \\mathcal{P}_5 \\to \\mathcal{P}_5$, the image is $\\mathcal{P}_4 \\subsetneq \\mathcal{P}_5$, so $S$ is NOT surjective ($x^5$ has no preimage in $\\mathcal{P}_5$). For $T: \\mathcal{P}_5 \\to \\mathcal{P}_4$, the image is $\\mathcal{P}_4$, equal to the codomain, so $T$ IS surjective. Surjectivity depends on the codomain, not just the rule.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The image of $S$ is $\\mathcal{P}_4 \\subsetneq \\mathcal{P}_5$. $x^5$ is not the derivative of any polynomial of degree $\\leq 5$.' },
            { choice: 'B' as const, why: '$p(x) = x$ and $q(x) = x + 7$ have $p\' = q\' = 1$, so $T$ sends both to the same output. Differentiation has the constants in its kernel — never injective on a polynomial space.' },
            { choice: 'C' as const, why: 'Both have the same kernel — the constant polynomials, $\\dim = 1$. The kernel depends only on the rule, not the codomain.' },
            { choice: 'E' as const, why: 'Differentiation is NOT invertible on polynomial spaces. Integration is a right inverse only ($\\frac{d}{dx} \\int p = p$), not a true inverse, because $\\int p\'$ recovers $p$ only up to a constant. The kernel is nontrivial, so neither $S$ nor $T$ is an isomorphism.' },
          ],
        },
      },
    ],
  },
};
