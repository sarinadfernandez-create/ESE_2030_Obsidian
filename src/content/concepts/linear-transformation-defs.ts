import type { Concept } from '../types';

export const linearTransformationDefs: Concept = {
  id: 'linear-transformation-defs',
  unitId: 'ch3',
  number: '3.2',
  title: 'Linear Transformations: Definitions',
  blurb: 'The two-axiom definition that turns "transformation" into "linear transformation."',
  tier: 'full',

  learn: {
    overview: `
A function $T: V \\to W$ between [[vector-space-axioms|vector spaces]] is called a **linear transformation** (or linear map) if it preserves the two basic vector space operations: addition and scalar multiplication. Concretely, two axioms must hold:

1. **Additivity**: $T(u + v) = T(u) + T(v)$ for all $u, v \\in V$.
2. **Homogeneity**: $T(cv) = c T(v)$ for all $v \\in V$ and all scalars $c$.

These two together can be combined into a single condition: $T$ is linear if and only if $T(c u + d v) = c T(u) + d T(v)$ for all $u, v \\in V$ and all scalars $c, d$. This is the **preservation of linear combinations**, and it is the most useful form of the definition in proofs.

Two immediate consequences follow from the axioms. First, every linear transformation must satisfy $T(0_V) = 0_W$ — the zero of the domain maps to the zero of the codomain. (Setting $c = 0$ in homogeneity gives $T(0) = T(0 \\cdot v) = 0 \\cdot T(v) = 0$.) This is why translations are not linear: they shift the origin. Second, every linear transformation preserves the negative: $T(-v) = -T(v)$.

Linear transformations are the most important class of functions in this course. They include [[euclidean-transformations|the geometric transformations]] of the previous section, [[gaussian-elimination|elementary matrix operations]] from Unit 1, [[linear-transformation-examples|differentiation and integration]] of functions, and the abstract linear maps that arise in [[image-and-kernel|kernels and images]] and [[fundamental-theorem|the Fundamental Theorem]]. The definition is broad enough to cover all these cases under one structural umbrella.

The reason the definition is exactly these two axioms is that they are the *minimum* needed to make linear-algebra reasoning work. Once you know $T$ is linear, you know it is determined by its action on a [[bases|basis]] — pick any basis $\\{b_1, \\dots, b_n\\}$ of $V$, specify $T(b_i)$ for each $i$, and the action of $T$ on every other vector follows by linearity. This is why a finite-dimensional linear transformation can be encoded compactly as a [[matrix-representations|matrix]]: the matrix records exactly the images of basis vectors.

A non-obvious consequence: linear transformations between finite-dimensional spaces are *automatically* "smooth" in any reasonable analytic sense. They are continuous, differentiable, and Lipschitz. This is one of many reasons linearity is the universal first-line approximation in applied mathematics — when a complicated nonlinear system is hard to analyze, taking its linear approximation (its derivative, in some sense) often makes it tractable.

Linearity also composes well: the composition of two linear transformations is itself linear, and the [[image-and-kernel|kernel]] and image of a composition relate to the kernels and images of the components in predictable ways. This compositional structure is what lets us factor complex transformations into simpler pieces — a strategy that runs throughout the course in [[lu-decomposition|LU decomposition]], [[qr-decomposition|QR]], [[svd-form|SVD]], and beyond.
    `.trim(),

    definitions: [
      {
        term: 'Linear transformation',
        body: 'A function $T: V \\to W$ between vector spaces satisfying $T(u + v) = T(u) + T(v)$ and $T(cv) = c T(v)$ for all $u, v \\in V$ and all scalars $c$.',
      },
      {
        term: 'Additivity',
        body: 'The first linearity axiom: $T(u + v) = T(u) + T(v)$.',
      },
      {
        term: 'Homogeneity',
        body: 'The second linearity axiom: $T(cv) = c T(v)$ for any scalar $c$. Equivalently, $T$ commutes with scaling.',
      },
      {
        term: 'Linear functional',
        body: 'A linear transformation whose codomain is the scalar field $\\mathbb{R}$. Examples: $f \\mapsto f(0)$ on a function space, or $\\sum_i v_i$ on $\\mathbb{R}^n$.',
      },
    ],

    theorems: [
      {
        name: 'Combined linearity condition',
        statement: 'A function $T: V \\to W$ is linear if and only if $T(c_1 v_1 + c_2 v_2) = c_1 T(v_1) + c_2 T(v_2)$ for all $v_1, v_2 \\in V$ and scalars $c_1, c_2$.',
        intuition: 'The combined condition encodes both axioms at once. Setting $c_1 = c_2 = 1$ gives additivity; setting $c_2 = 0$ gives homogeneity. By induction, any linear combination is preserved: $T(\\sum c_i v_i) = \\sum c_i T(v_i)$.',
      },
      {
        name: 'Linear transformations send zero to zero',
        statement: 'If $T: V \\to W$ is linear, then $T(0_V) = 0_W$.',
        intuition: '$T(0) = T(0 \\cdot v) = 0 \\cdot T(v) = 0$ by homogeneity. Equivalently, $T(0) = T(0 + 0) = T(0) + T(0)$ by additivity, which forces $T(0) = 0$. This is the simplest linearity check — a function violating $T(0) = 0$ cannot be linear.',
      },
      {
        name: 'Linear transformations are determined by their action on a basis',
        statement: 'If $\\{b_1, \\dots, b_n\\}$ is a [[bases|basis]] of $V$ and $w_1, \\dots, w_n$ are arbitrary vectors in $W$, there exists a unique linear transformation $T: V \\to W$ with $T(b_i) = w_i$ for each $i$.',
        intuition: 'Every $v \\in V$ has a unique expansion $v = \\sum c_i b_i$, and linearity forces $T(v) = \\sum c_i w_i$. So the basis values determine $T$ everywhere. This freedom — choosing $w_i$ for each $b_i$ independently — is exactly what makes [[matrix-representations|matrix representations]] work.',
      },
    ],

    keyFormulas: [
      'T(u + v) = T(u) + T(v)',
      'T(cv) = c T(v)',
      'T(c_1 v_1 + c_2 v_2) = c_1 T(v_1) + c_2 T(v_2)',
      'T(0_V) = 0_W',
    ],
  },

  explore: {
    vizComponent: 'LinearityChecker',
    description: 'Pick a candidate transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ from a list of expressions — some linear, some not. The viz tests both linearity axioms with concrete inputs and reports pass or fail with the specific failure point. Try $T(x, y) = (x + y, xy)$ to see homogeneity fail; try $T(x, y) = (x + 1, y)$ to see $T(0) \\neq 0$ catch the impostor.',
    misconception: {
      title: 'A linear function of a vector is not the same as a "linear function" in the calculus sense',
      body: `
A common confusion: thinking that "linear" means "graphs as a straight line," as in calculus where $y = mx + b$ is called a linear function. In linear algebra, $y = mx + b$ is **affine**, not linear, because it doesn't pass through the origin (unless $b = 0$).

Specifically, a single-variable function $f(x) = mx + b$ satisfies $f(c \\cdot x) = m c x + b$, but $c \\cdot f(x) = c(mx + b) = c m x + c b$. These are equal only when $c b = b$ for all $c$, which forces $b = 0$. So only $f(x) = mx$ (no constant term) is linear in the linear-algebra sense.

This distinction matters because the linear-algebra theory of linear transformations is much richer when "passes through origin" is built into the definition. Translations, [[image-and-kernel|null spaces]], [[bases]], and so on all assume the zero-preserving property.

A second misconception: thinking that "linear" means "doesn't have any squared or higher-power terms." That heuristic catches some non-linear transformations but misses others. The function $T(x, y) = (xy, 0)$ has no squared terms but is non-linear because of the *product* term — products of variables are also nonlinear. The reliable check is the two axioms, not surface inspection of the formula.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify $T(x, y) = (2x - y, x + 3y)$ is linear',
        body: 'Test additivity: $T(u + v) = T((u_1 + v_1, u_2 + v_2)) = (2(u_1 + v_1) - (u_2 + v_2), (u_1 + v_1) + 3(u_2 + v_2))$. Expand and rearrange: this equals $(2u_1 - u_2, u_1 + 3 u_2) + (2v_1 - v_2, v_1 + 3 v_2) = T(u) + T(v)$. ✓ Test homogeneity: $T(cv) = (2 c v_1 - c v_2, c v_1 + 3 c v_2) = c (2 v_1 - v_2, v_1 + 3 v_2) = c T(v)$. ✓ Linear.',
      },
      {
        title: 'Show $T(x, y) = (|x|, y)$ is NOT linear',
        body: 'Test homogeneity with $c = -1$, $v = (1, 0)$: $T(-1 \\cdot (1, 0)) = T(-1, 0) = (|-1|, 0) = (1, 0)$. But $-1 \\cdot T(1, 0) = -1 \\cdot (1, 0) = (-1, 0)$. These are unequal, so homogeneity fails. ✗',
      },
    ],

    problems: [
      {
        id: 'P-3.2a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Which of the following is NOT a linear transformation?',
        choices: [
          { label: 'A' as const, body: '$T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ defined by $T(x, y) = (y, x)$.' },
          { label: 'B' as const, body: '$S: \\mathcal{P}_2 \\to \\mathbb{R}$ defined by $S(p) = p(1)$.' },
          { label: 'C' as const, body: '$R: \\mathcal{P}_2 \\to \\mathcal{P}_3$ defined by $R(p)(x) = x \\cdot p(x)$.' },
          { label: 'D' as const, body: '$F: \\mathbb{R}^{2 \\times 2} \\to \\mathbb{R}^{2 \\times 2}$ defined by $F(A) = A^2$.' },
          { label: 'E' as const, body: '$G: \\mathbb{R}^3 \\to \\mathbb{R}^3$ defined by $G(x, y, z) = (x, x + y, x + y + z)$.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: '$F(A) = A^2$ fails homogeneity: $F(c A) = (c A)^2 = c^2 A^2 \\neq c A^2 = c F(A)$ when $c \\neq 0, 1$. It also fails additivity in general: $F(A + B) = (A + B)^2 = A^2 + AB + BA + B^2 \\neq A^2 + B^2 = F(A) + F(B)$ unless $A$ and $B$ commute. A subtle point: $F(0) = 0^2 = 0$, so the simplest linearity check ($T(0) = 0$) does NOT catch this failure.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Coordinate swap. Linear: $T(u + v) = (u_2 + v_2, u_1 + v_1) = (u_2, u_1) + (v_2, v_1) = T(u) + T(v)$. Matrix: $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$.' },
            { choice: 'B' as const, why: 'Evaluation at a point IS linear: $(p + q)(1) = p(1) + q(1)$ and $(cp)(1) = c \\cdot p(1)$.' },
            { choice: 'C' as const, why: 'Multiplication by $x$ is linear in $p$: $R(p + q)(x) = x(p + q)(x) = x p(x) + x q(x) = R(p)(x) + R(q)(x)$.' },
            { choice: 'E' as const, why: 'A "cumulative-sum" pattern — represented by the lower triangular matrix $\\begin{pmatrix} 1 & 0 & 0 \\\\ 1 & 1 & 0 \\\\ 1 & 1 & 1 \\end{pmatrix}$. Linear.' },
          ],
        },
      },
      {
        id: 'P-3.2b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'If $T: V \\to W$ is a linear transformation, which of the following must be true?',
        choices: [
          { label: 'A' as const, body: '$T$ is injective.' },
          { label: 'B' as const, body: '$T(0_V) = 0_W$.' },
          { label: 'C' as const, body: '$T$ is surjective.' },
          { label: 'D' as const, body: '$\\dim(V) = \\dim(W)$.' },
          { label: 'E' as const, body: '$T$ is invertible.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Every linear transformation sends the zero of the domain to the zero of the codomain. Apply homogeneity with $c = 0$: $T(0) = T(0 \\cdot v) = 0 \\cdot T(v) = 0_W$. None of the other properties are guaranteed by linearity alone — they are additional conditions on top.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Many linear transformations are not injective — for example, the zero map $T(v) = 0$ is linear but maps everything to zero.' },
            { choice: 'C' as const, why: 'Surjectivity is a separate property. $T: \\mathbb{R}^2 \\to \\mathbb{R}^3$, $T(x, y) = (x, y, 0)$ is linear but not surjective.' },
            { choice: 'D' as const, why: 'Domains and codomains of linear transformations can have different dimensions.' },
            { choice: 'E' as const, why: 'Invertibility requires both injectivity and surjectivity, neither of which is guaranteed by linearity alone.' },
          ],
        },
      },
    ],
  },
};
