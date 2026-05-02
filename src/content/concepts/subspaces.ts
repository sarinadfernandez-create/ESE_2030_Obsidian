import type { Concept } from '../types';

export const subspaces: Concept = {
  id: 'subspaces',
  unitId: 'ch2',
  number: '2.3',
  title: 'Subspaces',
  blurb: 'Subsets that inherit vector space structure from their parent — and the three-step test for spotting them.',
  tier: 'full',

  learn: {
    overview: `
A **subspace** of a vector space $V$ is a subset $W \\subseteq V$ that is itself a vector space, using the same operations inherited from $V$. The key word is *inherited*: addition and scalar multiplication are not redefined, just restricted to $W$.

Subspaces are everywhere in linear algebra. The [[image-and-kernel|null space]] of a matrix is a subspace of the domain. The [[image-and-kernel|column space]] is a subspace of the codomain. Solution sets of homogeneous systems are subspaces. The space of symmetric matrices is a subspace of the space of all matrices. Each of these inherits the [[vector-space-axioms|eight axioms]] for free, because they hold automatically inside any vector space.

The remarkable fact that makes subspaces useful is the **subspace test**: instead of checking all eight axioms for $W$, you only need to check three things.

1. The zero vector of $V$ is in $W$.
2. $W$ is closed under addition: $u, v \\in W$ implies $u + v \\in W$.
3. $W$ is closed under scalar multiplication: $v \\in W, c \\in \\mathbb{R}$ implies $cv \\in W$.

If these three hold, $W$ is automatically a subspace — every other axiom is inherited. The other five axioms involve only equations between vectors, and equations that are true in $V$ remain true when restricted to $W$.

Of the three checks, the first one — *zero is in $W$* — is the most often forgotten and the most often violated. Sets defined by an inequality (like "$x \\geq 0$") might be closed under addition but fail closure under scalar multiplication. Sets defined by a non-homogeneous equation (like "$x + y = 1$") might be closed under nothing because they don't contain zero. A reliable strategy: check zero first, since it eliminates many candidates immediately.

Two operations on subspaces produce new subspaces. The **intersection** $U \\cap W$ of two subspaces is always a subspace. The **sum** $U + W = \\{u + w : u \\in U, w \\in W\\}$ is also always a subspace, and it is the smallest subspace containing both $U$ and $W$. (The *union* $U \\cup W$ is generally NOT a subspace — closure under addition fails for vectors from different parts of the union.) When $U$ and $W$ have only the zero vector in common ($U \\cap W = \\{0\\}$), their sum is called a **direct sum** and is written $U \\oplus W$. In a direct sum, every element decomposes uniquely as $u + w$.

Subspaces inherit not just structure but also tools: every theorem about [[span-and-independence]], [[dimension]], [[bases]], and so on applies to subspaces. The role of "the whole space" can be played by any subspace, and the linear algebra runs the same.
    `.trim(),

    definitions: [
      {
        term: 'Subspace',
        body: 'A subset $W$ of a vector space $V$ that is itself a vector space under the operations inherited from $V$. Equivalently: a subset that contains the zero vector and is closed under addition and scalar multiplication.',
      },
      {
        term: 'Trivial subspaces',
        body: 'For any vector space $V$, the set $\\{0\\}$ (containing only the zero vector) and $V$ itself are subspaces. These are the "trivial" subspaces; all others are called proper subspaces.',
      },
      {
        term: 'Intersection of subspaces',
        body: 'For subspaces $U, W \\subseteq V$, the set $U \\cap W$ of vectors lying in both. Always a subspace.',
      },
      {
        term: 'Sum of subspaces',
        body: '$U + W = \\{u + w : u \\in U, w \\in W\\}$. The smallest subspace containing both $U$ and $W$.',
      },
      {
        term: 'Direct sum',
        body: 'A sum $U + W$ for which $U \\cap W = \\{0\\}$. Written $U \\oplus W$. Equivalent to: every element of $U + W$ has a unique decomposition $u + w$ with $u \\in U, w \\in W$.',
      },
    ],

    theorems: [
      {
        name: 'Subspace test',
        statement: 'A subset $W$ of a vector space $V$ is a subspace if and only if: (i) $0 \\in W$, (ii) for all $u, v \\in W$, $u + v \\in W$, and (iii) for all $v \\in W$ and $c \\in \\mathbb{R}$, $cv \\in W$.',
        intuition: 'The other [[vector-space-axioms|five axioms]] (commutativity, associativity, distributive laws, scalar associativity, identity scalar) hold for $W$ automatically because they hold for the larger $V$ — and an equation true in $V$ is true on any subset. The three checks isolate exactly the new things that could fail when restricting to a subset: containing zero, and closure of the operations.',
      },
      {
        name: 'Operations on subspaces',
        statement: 'For subspaces $U, W$ of $V$: (i) $U \\cap W$ is a subspace, (ii) $U + W$ is a subspace, (iii) $U \\cup W$ is generally NOT a subspace.',
        intuition: 'Intersection works because both subspace properties carry over: any vector in both $U$ and $W$ inherits closure from each. Sum works because adding two subspace vectors stays in the sum. Union fails because a vector in $U$ added to a vector in $W$ might land outside both.',
      },
      {
        name: 'Direct sum criterion',
        statement: '$V = U \\oplus W$ if and only if every vector $v \\in V$ has a unique decomposition $v = u + w$ with $u \\in U, w \\in W$.',
        intuition: 'The condition $U \\cap W = \\{0\\}$ is equivalent to uniqueness: if a nonzero vector were in both subspaces, we could add and subtract it to produce different decompositions, breaking uniqueness.',
      },
    ],

    keyFormulas: [
      'W \\text{ is a subspace} \\iff 0 \\in W \\text{ and } W \\text{ is closed under } + \\text{ and } \\cdot',
      'U + W = \\{u + w : u \\in U, w \\in W\\}',
      'V = U \\oplus W \\iff V = U + W \\text{ and } U \\cap W = \\{0\\}',
    ],
  },

  explore: {
    vizComponent: 'SubspaceTester',
    description: 'Pick a candidate subset of $\\mathbb{R}^2$ — half-plane, line through origin, shifted line, unit disk, two axes, etc. — and watch the three subspace tests run on it. Each test that fails shows a specific counterexample: a missing zero, a sum that escapes the set, a scalar multiple that escapes the set. Use this to build a feel for which kinds of subsets pass and which kinds fail.',
    misconception: {
      title: 'Subspaces must contain the zero vector — this rules out most "natural-looking" sets',
      body: `
The most common subspace error is forgetting to check that the zero vector is in the candidate. Many "natural-looking" subsets fail this single criterion:

- A line in $\\mathbb{R}^2$ that does *not* pass through the origin (like $x + y = 1$) is not a subspace.
- A half-plane (like $x \\geq 0$) is not a subspace, because $-1 \\cdot (1, 0) = (-1, 0)$ leaves the half-plane.
- The unit circle is not a subspace — the zero vector has norm $0$, not $1$.
- The set of $2 \\times 2$ matrices with trace $1$ is not a subspace, because the zero matrix has trace $0$.

A second misconception: thinking the union of two subspaces should be a subspace. It usually isn't. Take the $x$-axis and $y$-axis in $\\mathbb{R}^2$: each is a subspace (a 1-dimensional one). Their union is the "+" shape — but $(1, 0) + (0, 1) = (1, 1)$ is in neither axis, so the union is not closed under addition. The *sum* $U + W$ (the smallest subspace containing both) IS a subspace, but the *union* generally is not.

A third trap: confusing "subspace" with "subset." Every subspace is a subset, but most subsets of a vector space are not subspaces. A finite collection of vectors is a subset; it is a subspace only if that collection happens to be $\\{0\\}$.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify that the diagonal matrices form a subspace of $\\mathbb{R}^{2 \\times 2}$',
        body: '(i) The zero matrix is diagonal. ✓ (ii) Sum of two diagonal matrices is diagonal (off-diagonals stay zero). ✓ (iii) A scalar times a diagonal matrix is diagonal. ✓ All three conditions hold, so the diagonal matrices form a subspace. By the [[subspaces|subspace test]], no further axioms need to be checked.',
      },
      {
        title: 'Show that $\\{(x, y) : x + y = 1\\}$ is NOT a subspace of $\\mathbb{R}^2$',
        body: 'Check (i) first: does $(0, 0)$ satisfy $0 + 0 = 1$? No. So the zero vector is not in the set, and the subspace test fails immediately. The set is an affine line — a translate of a subspace — not a subspace itself.',
      },
      {
        title: 'Verify that $\\{f \\in C(\\mathbb{R}) : f(0) = 0\\}$ is a subspace of $C(\\mathbb{R})$',
        body: '(i) The zero function satisfies $0(0) = 0$. ✓ (ii) If $f(0) = 0$ and $g(0) = 0$, then $(f + g)(0) = f(0) + g(0) = 0 + 0 = 0$. ✓ (iii) If $f(0) = 0$ and $c \\in \\mathbb{R}$, then $(cf)(0) = c f(0) = 0$. ✓ All three pass; this is a subspace.',
      },
    ],

    problems: [
      {
        id: 'P-2.3a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Which of the following subsets of $\\mathbb{R}^2$ IS a subspace?',
        choices: [
          { label: 'A' as const, body: '$\\{(x, y) : x \\geq 0\\}$' },
          { label: 'B' as const, body: '$\\{(x, y) : x + y = 1\\}$' },
          { label: 'C' as const, body: '$\\{(x, y) : xy = 0\\}$' },
          { label: 'D' as const, body: '$\\{(x, y) : x^2 + y^2 \\leq 1\\}$' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'Each of the four candidates fails at least one subspace condition.\n\n(A) Fails closure under scalar multiplication: $(1, 0)$ is in the set, but $(-1) \\cdot (1, 0) = (-1, 0)$ has $x = -1 < 0$.\n\n(B) Fails to contain the zero vector: $(0, 0)$ has $0 + 0 = 0 \\neq 1$.\n\n(C) Contains $(1, 0)$ and $(0, 1)$ — both satisfy $xy = 0$ — but their sum $(1, 1)$ has $1 \\cdot 1 = 1 \\neq 0$. Fails closure under addition.\n\n(D) Contains $(1, 0)$, but $2 \\cdot (1, 0) = (2, 0)$ has $4 + 0 = 4 > 1$. Fails closure under scalar multiplication.',
          partialCredit: '(C) earns partial credit — it contains the zero vector AND is closed under scalar multiplication (any scalar multiple of a vector with $xy = 0$ also has its product equal $0$). It only fails closure under addition, which is the subtlest of the three to check.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'A "half-plane" looks like a respectable region, but subspaces must be symmetric about the origin (closed under negation).' },
            { choice: 'B' as const, why: 'A line that does not pass through the origin. Any line *through* the origin would be a subspace, but this one is shifted.' },
            { choice: 'C' as const, why: 'The two axes. Looks like a plus-sign region. Earns partial credit for passing two of the three tests.' },
            { choice: 'D' as const, why: 'A nice geometric region (the closed unit disk), but bounded sets other than $\\{0\\}$ cannot be subspaces.' },
          ],
          visual: {
            kind: 'subspace-test' as const,
            data: {
              region: 'union-of-axes' as const,
              failureExample: {
                kind: 'closure-add' as const,
                points: [[1, 0], [0, 1], [1, 1]] as [number, number][],
              },
            },
            caption: 'Set (C): both $(1, 0)$ and $(0, 1)$ lie on the axes (so $xy = 0$), but their sum $(1, 1)$ is in the interior, where $xy = 1 \\neq 0$.',
          },
        },
      },
      {
        id: 'P-2.3b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'If $U$ and $W$ are subspaces of a vector space $V$, which of the following is ALWAYS a subspace of $V$?',
        choices: [
          { label: 'A' as const, body: 'The intersection $U \\cap W$.' },
          { label: 'B' as const, body: 'The union $U \\cup W$.' },
          { label: 'C' as const, body: 'The set of vectors in $U$ but not in $W$.' },
          { label: 'D' as const, body: 'The set of unit-norm vectors in $U$.' },
          { label: 'E' as const, body: 'The set of all dot products $u \\cdot w$ for $u \\in U, w \\in W$.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'The intersection of two subspaces is always a subspace: the zero vector is in both $U$ and $W$, sums of common vectors stay in both, and scalar multiples of common vectors stay in both. The other candidates all fail.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'A classic trick. The union is generally not closed under addition: a vector from $U$ plus a vector from $W$ might lie outside both. (Take the $x$- and $y$-axes in $\\mathbb{R}^2$ — their union is missing $(1, 1)$.)' },
            { choice: 'C' as const, why: 'The set difference does not contain the zero vector ($0 \\in W$, so $0$ is not in "$U$ but not $W$"), and it is not closed under any of the operations.' },
            { choice: 'D' as const, why: 'Sets of unit-norm vectors do not contain the zero vector (which has norm $0$), so they fail the first subspace condition.' },
            { choice: 'E' as const, why: 'Dot products are scalars, not vectors. The set of dot products is a subset of $\\mathbb{R}$, not of $V$ — a category error.' },
          ],
        },
      },
      {
        id: 'P-2.3c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the vector space $\\mathcal{F}$ of all functions $f: \\mathbb{R} \\to \\mathbb{R}$ with standard operations. Which of the following IS a subspace of $\\mathcal{F}$?',
        choices: [
          { label: 'A' as const, body: '$\\{f \\in \\mathcal{F} : f(0) = 1\\}$' },
          { label: 'B' as const, body: '$\\{f \\in \\mathcal{F} : f(x) \\geq 0 \\text{ for all } x\\}$' },
          { label: 'C' as const, body: '$\\{f \\in \\mathcal{F} : f(1) = 2 f(0)\\}$' },
          { label: 'D' as const, body: '$\\{f \\in \\mathcal{F} : f(x) = f(-x) \\text{ for all } x\\}$ (the even functions)' },
          { label: 'E' as const, body: 'Both (C) and (D) are subspaces.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'Both (C) and (D) are subspaces.\n\n(C): The zero function satisfies $0 = 2 \\cdot 0$. ✓ If $f(1) = 2f(0)$ and $g(1) = 2g(0)$, then $(f + g)(1) = f(1) + g(1) = 2f(0) + 2g(0) = 2(f + g)(0)$. ✓ Similarly for scalar multiplication. ✓\n\n(D): The zero function is even. The sum and scalar multiple of even functions are even.\n\n(A) and (B) fail: (A) does not contain the zero function (which has $f(0) = 0 \\neq 1$); (B) is not closed under scalar multiplication (multiplying a nonnegative function by $-1$ produces a non-nonnegative function).',
          partialCredit: 'Selecting only (C) or only (D) earns partial credit — those identifications are correct, just incomplete.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Fails the zero condition. The constraint $f(0) = 1$ excludes the zero function.' },
            { choice: 'B' as const, why: 'Inequality constraints typically fail closure under scalar multiplication — multiplying by a negative scalar flips the inequality.' },
            { choice: 'C' as const, why: 'Correct — but (D) is also correct, so this answer is incomplete.' },
            { choice: 'D' as const, why: 'Correct — but (C) is also correct, so this answer is incomplete.' },
          ],
        },
      },
      {
        id: 'P-2.3d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $V = \\mathbb{R}^{2 \\times 2}$ be the space of all $2 \\times 2$ real matrices, and let $W = \\left\\{ A \\in V : A \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix} \\right\\}$. What is the dimension of $W$?',
        choices: [
          { label: 'A' as const, body: '$1$' },
          { label: 'B' as const, body: '$2$' },
          { label: 'C' as const, body: '$3$' },
          { label: 'D' as const, body: '$4$' },
          { label: 'E' as const, body: 'Undefined — $W$ is not a subspace of $V$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Write $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$. The condition $A \\begin{pmatrix}1\\\\1\\end{pmatrix} = \\begin{pmatrix}0\\\\0\\end{pmatrix}$ gives $\\begin{pmatrix}a+b\\\\c+d\\end{pmatrix} = \\begin{pmatrix}0\\\\0\\end{pmatrix}$, so $b = -a$ and $d = -c$. The matrices in $W$ have the form $\\begin{pmatrix}a & -a \\\\ c & -c\\end{pmatrix}$ with $2$ free parameters $a, c$. A basis is $\\left\\{ \\begin{pmatrix}1&-1\\\\0&0\\end{pmatrix}, \\begin{pmatrix}0&0\\\\1&-1\\end{pmatrix} \\right\\}$. So $\\dim(W) = 2$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Miscounts the free parameters. There are two independent parameters ($a$ and $c$), giving a 2-dimensional space.' },
            { choice: 'C' as const, why: 'Treats the two constraints as one, or miscounts free parameters. The two constraints $b = -a$ and $d = -c$ are independent, removing two dimensions from the 4-dimensional ambient space.' },
            { choice: 'D' as const, why: 'Ignores the constraints — that would give the dimension of all of $V$, not the constrained subspace.' },
            { choice: 'E' as const, why: '$W$ is the [[image-and-kernel|kernel]] of the [[linear-transformation-defs|linear map]] $A \\mapsto A \\begin{pmatrix}1\\\\1\\end{pmatrix}$, and kernels of linear maps are always subspaces.' },
          ],
        },
      },
    ],
  },
};
