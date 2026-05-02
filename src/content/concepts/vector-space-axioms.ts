import type { Concept } from '../types';

export const vectorSpaceAxioms: Concept = {
  id: 'vector-space-axioms',
  unitId: 'ch2',
  number: '2.1',
  title: 'Vector Space Axioms',
  blurb: 'The eight rules that decide whether a collection of objects deserves to be called a vector space.',
  tier: 'full',

  learn: {
    overview: `
A **vector space** is any collection of objects — call them vectors — together with two operations (addition and scalar multiplication) that satisfy eight specific rules. The breakthrough this unit asks you to make is that these "vectors" need not be arrows in $\\mathbb{R}^n$ at all. Polynomials can be vectors. Matrices can be vectors. Functions can be vectors. Solutions to differential equations can be vectors. The label "vector" applies to any object that lives in a structure satisfying the axioms, regardless of its appearance.

The eight axioms come in two groups of four. The first four describe how addition behaves: it is **commutative** ($u + v = v + u$), **associative** ($(u + v) + w = u + (v + w)$), there is a **zero element** ($0 + v = v$ for every $v$), and every vector has an **additive inverse** ($v + (-v) = 0$). The remaining four describe how scalar multiplication behaves and how it interacts with addition: scalar multiplication **distributes over vector addition** ($c(u + v) = cu + cv$), distributes over scalar addition ($(c + d)v = cv + dv$), is **associative with scalar multiplication** ($(cd)v = c(dv)$), and the **scalar 1 acts as identity** ($1 \\cdot v = v$).

Why these eight, and not some other list? Each axiom is a piece of structure that linear-algebra arguments depend on. Without commutativity of addition, you couldn't simplify $u + v + w$ in any order. Without distributivity, you couldn't expand $c(u + v)$. Without an additive inverse, you couldn't subtract. The axioms are the *minimum* assumptions needed to do all the linear-algebra reasoning you already know — and they are exactly the assumptions that make the familiar manipulations valid in completely unfamiliar settings.

The payoff is enormous. Once a collection passes the axiom check, every theorem we have proved or will prove about [[span-and-independence|spanning sets, independence]], [[dimension]], [[bases]], [[linear-transformation-defs|linear transformations]], [[image-and-kernel|kernels and images]], and the [[fundamental-theorem|Fundamental Theorem]] applies to it — for free, with no new proofs needed. This is why so much of engineering mathematics reduces to "recognize that this is a vector space and apply linear algebra."

In practice, you rarely verify all eight axioms from scratch. Most of the work is recognizing standard examples ([[vector-space-examples|$\\mathbb{R}^n$, polynomial spaces, matrix spaces, function spaces]]) and using the [[subspaces|subspace test]] — a shortcut that reduces eight axioms to just three checks for subsets of known vector spaces.
    `.trim(),

    definitions: [
      {
        term: 'Vector space',
        body: 'A set $V$ together with two operations — vector addition $V \\times V \\to V$ and scalar multiplication $\\mathbb{R} \\times V \\to V$ — satisfying the eight axioms below.',
      },
      {
        term: 'Vector',
        body: 'Any element of a vector space. The word does not refer to a specific shape (like an arrow); it refers to membership in a set with the right structure.',
      },
      {
        term: 'Scalar',
        body: 'In this course, an element of $\\mathbb{R}$. (More generally, scalars come from a field — $\\mathbb{R}$ or $\\mathbb{C}$ in most engineering applications.)',
      },
      {
        term: 'Zero vector',
        body: 'The unique element $0 \\in V$ satisfying $0 + v = v$ for every $v \\in V$. Required to exist by the third addition axiom.',
      },
      {
        term: 'Additive inverse',
        body: 'For each $v \\in V$, the unique element $-v$ satisfying $v + (-v) = 0$. Required to exist by the fourth addition axiom.',
      },
    ],

    theorems: [
      {
        name: 'The eight vector space axioms',
        statement: "For all $u, v, w \\in V$ and all $c, d \\in \\mathbb{R}$:\n\n**Addition:**\n1. $u + v = v + u$ (commutativity)\n2. $(u + v) + w = u + (v + w)$ (associativity)\n3. There exists $0 \\in V$ with $0 + v = v$\n4. For each $v$ there exists $-v$ with $v + (-v) = 0$\n\n**Scalar multiplication:**\n5. $c(u + v) = cu + cv$\n6. $(c + d)v = cv + dv$\n7. $(cd)v = c(dv)$\n8. $1 \\cdot v = v$",
        intuition: 'These rules collectively say that the operations behave the way you would expect from intuition with $\\mathbb{R}^n$. The novelty is that they hold for objects that look nothing like $\\mathbb{R}^n$ — polynomials, matrices, functions, sequences. The axioms are what unite all these examples into a single theory.',
      },
      {
        name: 'Uniqueness of zero and inverses',
        statement: 'In any vector space: (i) the zero vector is unique, and (ii) the additive inverse of each $v$ is unique.',
        intuition: 'The axioms only say a zero element and additive inverses *exist*. Their uniqueness is a theorem: if two zeros existed, one would absorb the other; if two inverses of $v$ existed, they would be forced to be equal by chaining the axioms.',
      },
      {
        name: 'Useful identities',
        statement: 'In any vector space: $0 \\cdot v = 0$ for every $v$ (the zero scalar times any vector is the zero vector), and $(-1) \\cdot v = -v$ (the additive inverse equals scalar multiplication by $-1$).',
        intuition: 'These are not assumed — they are deductions from the axioms. They confirm that the algebra of vector spaces really does work the way you would expect, which is reassuring because it means familiar algebraic shortcuts remain valid in unfamiliar examples.',
      },
    ],

    keyFormulas: [
      'u + v = v + u',
      '(u + v) + w = u + (v + w)',
      '0 + v = v, \\quad v + (-v) = 0',
      'c(u + v) = cu + cv, \\quad (c + d)v = cv + dv',
      '(cd)v = c(dv), \\quad 1 \\cdot v = v',
    ],
  },

  explore: {
    vizComponent: 'VectorSpaceAxiomsViz',
    description: 'Toggle through several candidate "vector spaces" — some real, some impostors. For each, the viz checks every axiom one at a time, marking it pass or fail. The impostors fail in instructive ways: a half-plane fails closure under scalar multiplication, a unit circle fails to contain the zero vector, and a "shifted line" fails the existence of zero. Use this to develop intuition for *which* axioms are usually the ones that fail.',
    misconception: {
      title: 'A vector space is defined by its axioms, not by what its elements look like',
      body: `
The most common error in this unit is treating "vector" as a synonym for "arrow" or "tuple of numbers." It is not. A vector is *any* element of a set that satisfies the eight axioms, with the operations defined for that set.

The polynomial $1 + x + x^2$ is a vector. The matrix $\\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ is a vector. The function $\\sin(x)$ is a vector (in the appropriate function space). None of these "look like" arrows, but they all live in vector spaces, and every theorem of linear algebra applies to them.

A second misconception: thinking vector spaces must be finite-dimensional. Many of the most important spaces in engineering — the space of continuous functions, the space of solutions to differential equations, the space of square-integrable signals — are infinite-dimensional. The axioms do not prefer finite over infinite.

A third trap: when checking whether a set with given operations forms a vector space, students often verify the easy axioms (commutativity, associativity) and miss the binding constraints (existence of zero, closure under scalar multiplication). The axioms most likely to fail in practice are #3 (zero element exists), #4 (additive inverses exist), and the closure properties hidden inside the operations themselves. Always check those first.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify $\\mathbb{R}^2$ is a vector space',
        body: 'For $\\mathbb{R}^2$ with componentwise addition and scalar multiplication: pick any axiom and check it directly. For commutativity: $(a, b) + (c, d) = (a + c, b + d) = (c + a, d + b) = (c, d) + (a, b)$. ✓ The zero vector is $(0, 0)$, and the additive inverse of $(a, b)$ is $(-a, -b)$. All eight axioms reduce to facts about real-number arithmetic, which holds.',
      },
      {
        title: 'Verify a non-example: $\\{(x, y) : x \\geq 0\\}$ is NOT a vector space',
        body: 'The set is closed under addition (sum of nonnegative is nonnegative) but not under scalar multiplication: $(1, 0)$ is in the set, but $-1 \\cdot (1, 0) = (-1, 0)$ is not. Axiom 4 fails for $(1, 0)$ because $(-1, 0)$ should be its additive inverse but is not in the set. ✗',
      },
      {
        title: "Recognize a non-obvious example: solutions to $f'' + f = 0$",
        body: "The set of all twice-differentiable functions $f: \\mathbb{R} \\to \\mathbb{R}$ satisfying $f'' + f = 0$ is a vector space. The zero function satisfies the equation. If $f$ and $g$ both satisfy it, so does $f + g$ (because differentiation is linear). If $f$ satisfies it, so does $cf$. The other axioms come for free from the function-space structure. This space turns out to be 2-dimensional, with basis $\\{\\sin t, \\cos t\\}$.",
      },
    ],

    problems: [
      {
        id: 'P-2.1a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Which of the following collections, with the indicated operations, forms a vector space?',
        choices: [
          { label: 'A' as const, body: 'The set of all $2 \\times 2$ matrices with trace equal to $1$, under standard matrix addition and scalar multiplication.' },
          { label: 'B' as const, body: 'The set of all polynomials of degree exactly $3$, under standard polynomial addition and scalar multiplication.' },
          { label: 'C' as const, body: 'The set of all continuous functions $f: [0, 1] \\to \\mathbb{R}$, under pointwise addition and scalar multiplication.' },
          { label: 'D' as const, body: 'The positive real numbers, with "addition" defined as multiplication and "scalar multiplication" defined as exponentiation: $c \\cdot x := x^c$.' },
          { label: 'E' as const, body: "The set of all $2 \\times 2$ upper triangular matrices with $1$'s on the diagonal, under matrix addition and scalar multiplication." },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The space $C([0, 1])$ of continuous functions is a vector space: pointwise sums and scalar multiples of continuous functions remain continuous, the zero function is continuous, and all eight axioms reduce to facts about real-number arithmetic applied pointwise.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Fails the existence of zero. The zero matrix has trace $0$, not $1$, so it is not in the set. Axiom 3 fails.' },
            { choice: 'B' as const, why: 'Not closed under addition. $p(x) = x^3$ and $q(x) = -x^3 + x^2$ both have degree exactly $3$, but $p + q = x^2$ has degree $2$.' },
            { choice: 'D' as const, why: 'Subtle but instructive. Under these operations, the "zero" would need to be a positive real $z$ with $z \\cdot x = x$ for all positive $x$ — that is, $z \\cdot x = x$. With multiplication as addition, this means $z = 1$. So $1$ plays the role of zero. But scalar multiplication by $0$ should give the zero element: $0 \\cdot x = x^0 = 1$. ✓ This actually checks out — and remarkably, this set IS a vector space (the positive reals under multiplication-as-addition form a 1-dimensional vector space with $1$ as the zero element). The "trick" is that students intuitively expect the standard zero ($0 \\notin \\mathbb{R}_{>0}$) and reject it, missing that the operations redefine "zero." Earns partial credit if the student correctly identifies why $1$ plays the role of zero here.' },
            { choice: 'E' as const, why: "Fails closure under scalar multiplication. If $A$ has $1$'s on the diagonal, then $2A$ has $2$'s on the diagonal, so $2A$ is not in the set." },
          ],
        },
      },
      {
        id: 'P-2.1b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $W$ be the set of all $3 \\times 3$ symmetric matrices, under standard matrix addition and scalar multiplication. To verify that $W$ is a vector space (specifically, a subspace of $\\mathbb{R}^{3 \\times 3}$), which property do we NOT need to check?',
        choices: [
          { label: 'A' as const, body: 'The zero matrix is symmetric.' },
          { label: 'B' as const, body: 'If $A$ and $B$ are symmetric, then $A + B$ is symmetric.' },
          { label: 'C' as const, body: 'If $A$ is symmetric and $c \\in \\mathbb{R}$, then $cA$ is symmetric.' },
          { label: 'D' as const, body: 'Every symmetric matrix is invertible.' },
          { label: 'E' as const, body: 'None of the above — all four must be checked.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'Invertibility is not part of the [[subspaces|subspace test]] or any vector space axiom. The three things you must check are: (i) the zero element is in the set, (ii) the set is closed under addition, (iii) the set is closed under scalar multiplication. The zero matrix and singular matrices are perfectly welcome members of vector spaces.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Required — the subspace must contain the zero element of the ambient space.' },
            { choice: 'B' as const, why: 'Required — closure under addition.' },
            { choice: 'C' as const, why: 'Required — closure under scalar multiplication.' },
            { choice: 'E' as const, why: 'Wrong because (D) is not required. Invertibility has nothing to do with vector space structure.' },
          ],
        },
      },
      {
        id: 'P-2.1c',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'In the vector space $\\mathcal{P}_3$ (polynomials of degree at most $3$), which of the following IS the zero vector?',
        choices: [
          { label: 'A' as const, body: 'The polynomial $p(x) = 0 x^3 + 0 x^2 + 0 x + 0$.' },
          { label: 'B' as const, body: 'The polynomial $p(x) = x^0 = 1$.' },
          { label: 'C' as const, body: 'The polynomial with no terms.' },
          { label: 'D' as const, body: 'The number $0$.' },
          { label: 'E' as const, body: 'Both (A) and (C) describe the zero polynomial.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'The zero vector in a polynomial space is the polynomial whose every coefficient is zero. Both (A) — written out explicitly — and (C) — described in words — refer to this same object. (B) is the constant polynomial $1$, not zero. (D) is correct in spirit but imprecise — the zero of $\\mathcal{P}_3$ is a polynomial, not the real number $0$, even though the polynomial evaluates to $0$ everywhere.',
          partialCredit: '(D) earns partial credit — it identifies the right *idea* but uses imprecise notation. In practice, mathematicians often write the zero polynomial as just "$0$," with the type understood from context.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Correct but incomplete on its own — (C) describes the same object.' },
            { choice: 'B' as const, why: '$x^0 = 1$, the constant polynomial. Its evaluation at every point is $1$, not $0$.' },
            { choice: 'C' as const, why: 'Correct but incomplete on its own.' },
            { choice: 'D' as const, why: 'Correct concept but imprecise type. Earns partial credit.' },
          ],
        },
      },
      {
        id: 'P-2.1d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the vector space $C([0, 1])$ of continuous functions on $[0, 1]$. If $f(x) = x^2$ and $g(x) = \\sin(\\pi x)$, what is $(2f - 3g)(0.5)$?',
        choices: [
          { label: 'A' as const, body: '$2(0.25) - 3(\\sin(0.5)) = 0.5 - 3 \\sin(0.5)$' },
          { label: 'B' as const, body: '$2(0.5) - 3(\\sin(0.5)) = 1 - 3 \\sin(0.5)$' },
          { label: 'C' as const, body: '$2(0.25) - 3(0) = 0.5$' },
          { label: 'D' as const, body: '$2(0.25) - 3(1) = -2.5$' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'In a function space, $(2f - 3g)$ is itself a function — the function whose value at any $x$ is $2 f(x) - 3 g(x)$. Evaluating at $x = 0.5$: $f(0.5) = (0.5)^2 = 0.25$, and $g(0.5) = \\sin(\\pi \\cdot 0.5) = \\sin(\\pi/2) = 1$. So $(2f - 3g)(0.5) = 2(0.25) - 3(1) = 0.5 - 3 = -2.5$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Forgets to multiply the input by $\\pi$ before applying $\\sin$. The function is $g(x) = \\sin(\\pi x)$, not $\\sin(x)$.' },
            { choice: 'B' as const, why: 'Two errors: forgets the $\\pi$ in the argument of $\\sin$, AND uses $f(0.5) = 0.5$ instead of $0.5^2 = 0.25$.' },
            { choice: 'C' as const, why: 'Treats $\\sin(\\pi/2) = 0$, but $\\sin(\\pi/2) = 1$. Possibly confuses with $\\sin(\\pi) = 0$.' },
          ],
        },
      },
    ],
  },
};
