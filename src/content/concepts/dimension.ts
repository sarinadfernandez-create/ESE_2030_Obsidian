import type { Concept } from '../types';

export const dimension: Concept = {
  id: 'dimension',
  unitId: 'ch2',
  number: '2.5',
  title: 'Dimension',
  blurb: 'A single number that captures how much "freedom" a vector space contains.',
  tier: 'full',

  learn: {
    overview: `
The **dimension** of a vector space is the number of vectors in any [[bases|basis]] for it. This single number summarizes the size and complexity of the space — and astonishingly, it does not depend on which basis you choose. Every basis has the same number of elements.

Why this is non-obvious: a vector space has many bases, and they generally don't share any individual vectors. The standard basis of $\\mathbb{R}^3$ is $\\{e_1, e_2, e_3\\}$. Another basis is $\\{(1, 1, 0), (0, 1, 1), (1, 0, 1)\\}$. Yet another is $\\{(1, 2, 3), (4, 5, 6), (7, 8, 10)\\}$ (after checking independence). Each basis has $3$ elements, and the number $3$ is intrinsic to $\\mathbb{R}^3$ in a way the specific basis is not.

The proof that any two bases have the same size uses an exchange argument: if $\\{u_1, \\dots, u_m\\}$ and $\\{w_1, \\dots, w_n\\}$ are both bases of $V$, you can systematically replace $u$'s with $w$'s, one at a time, while maintaining the basis property at each step. This process forces $m = n$.

For familiar spaces, the dimensions are:
- $\\dim(\\mathbb{R}^n) = n$
- $\\dim(\\mathbb{R}^{m \\times n}) = mn$
- $\\dim(\\mathcal{P}_n) = n + 1$ (note the off-by-one — $\\mathcal{P}_n$ allows degree $0$ as well as up through degree $n$)
- $\\dim(\\text{symmetric } n \\times n \\text{ matrices}) = n(n+1)/2$
- $\\dim(\\text{solution space of linear } n\\text{-th order ODE}) = n$
- $\\dim(C([a, b])) = \\infty$

A vector space with finite dimension is called **finite-dimensional**; otherwise **infinite-dimensional**. The course focuses primarily on finite-dimensional spaces, where dimension is a finite number and many strong theorems hold.

Dimension is closely tied to the [[span-and-independence|spanning and independence]] concepts:

- A linearly independent set in $V$ has at most $\\dim(V)$ elements.
- A spanning set for $V$ has at least $\\dim(V)$ elements.
- A set with exactly $\\dim(V)$ elements is a [[bases|basis]] if it is either spanning OR independent — neither needs to be checked separately if you already have the right count.

This last fact is sometimes called the "two out of three" rule: in a finite-dimensional space, having the right *count* plus *one* of the two basis properties (spanning or independence) is enough. The other follows automatically.

For [[subspaces]]: $\\dim(W) \\leq \\dim(V)$ when $W \\subseteq V$, with equality if and only if $W = V$. This monotonicity makes dimension a useful tool for distinguishing subspaces.

A two-subspace identity worth knowing: $\\dim(U + W) = \\dim(U) + \\dim(W) - \\dim(U \\cap W)$. The intersection is "double-counted" in the naive sum, so we subtract it once. Special case: when $V = U \\oplus W$ is a [[subspaces|direct sum]], $U \\cap W = \\{0\\}$ has dimension $0$, and $\\dim(V) = \\dim(U) + \\dim(W)$.
    `.trim(),

    definitions: [
      {
        term: 'Dimension',
        body: 'For a finite-dimensional vector space $V$, $\\dim(V)$ is the number of vectors in any [[bases|basis]] for $V$. For an infinite-dimensional space, $\\dim(V) = \\infty$ (with finer cardinality distinctions in advanced treatments).',
      },
      {
        term: 'Finite-dimensional',
        body: 'A vector space is finite-dimensional if it has a finite spanning set. Equivalently, it has a finite basis.',
      },
      {
        term: 'Infinite-dimensional',
        body: 'Not finite-dimensional. The space of all polynomials, the space of continuous functions on an interval, the space of all sequences — all are infinite-dimensional.',
      },
      {
        term: 'Minimal spanning set',
        body: 'A spanning set with no proper subset that also spans. Equivalent to a [[bases|basis]].',
      },
    ],

    theorems: [
      {
        name: 'Invariance of dimension',
        statement: 'Any two bases of a finite-dimensional vector space have the same number of elements.',
        intuition: 'The proof uses an exchange argument: starting from one basis, you can swap in vectors from another basis one at a time, always maintaining a basis. After $\\min(m, n)$ steps, the surviving set is a basis containing only vectors from the second basis — which forces $m = n$.',
      },
      {
        name: 'Bounds on independent and spanning sets',
        statement: 'In an $n$-dimensional vector space: (i) any linearly independent set has at most $n$ elements, (ii) any spanning set has at least $n$ elements, (iii) any set of exactly $n$ vectors is a basis if it is either independent or spanning.',
        intuition: 'The dimension is the "Goldilocks number" — too few vectors and you cannot span; too many and you cannot be independent. Hitting the dimension exactly puts you in basis territory, and either of the two basis properties suffices to confirm the other.',
      },
      {
        name: 'Subspace dimension',
        statement: 'For subspaces $W \\subseteq V$ of a finite-dimensional space: $\\dim(W) \\leq \\dim(V)$, with equality if and only if $W = V$.',
        intuition: 'A subspace cannot be more complex than its parent. If they have equal dimension, a basis for $W$ is automatically a basis for $V$ (independence carries over; spanning follows from the dimension count), so $W = V$.',
      },
      {
        name: 'Dimension of sum of subspaces',
        statement: 'For subspaces $U, W$ of $V$: $\\dim(U + W) + \\dim(U \\cap W) = \\dim(U) + \\dim(W)$. Special case: if $U + W$ is a direct sum, $\\dim(U \\oplus W) = \\dim(U) + \\dim(W)$.',
        intuition: 'A naive sum $\\dim(U) + \\dim(W)$ double-counts the intersection — vectors in $U \\cap W$ contribute to both $U$ and $W$. Subtracting once corrects the double count.',
      },
    ],

    keyFormulas: [
      '\\dim(V) = |\\mathcal{B}| \\quad \\text{for any basis } \\mathcal{B}',
      '\\dim(\\mathbb{R}^n) = n, \\quad \\dim(\\mathcal{P}_n) = n + 1, \\quad \\dim(\\mathbb{R}^{m \\times n}) = mn',
      '\\dim(U + W) = \\dim(U) + \\dim(W) - \\dim(U \\cap W)',
      '\\dim(U \\oplus W) = \\dim(U) + \\dim(W)',
    ],
  },

  explore: {
    vizComponent: 'DimensionViz',
    description: "Pick a vector space — $\\mathbb{R}^2$, $\\mathbb{R}^3$, $\\mathcal{P}_2$, $\\mathcal{P}_3$, or $2 \\times 2$ matrices — and a candidate set of vectors. The viz reports its span's dimension and whether it equals the dimension of the ambient space (i.e., whether the set is a basis). Try replacing vectors to see how dimension responds — adding a dependent vector keeps dimension the same, adding an independent one increases it (until you hit the ambient dimension).",
    misconception: {
      title: 'Dimension counts free parameters, not the cardinality of vectors',
      body: `
A common confusion: thinking that more vectors in a set means more dimension. Dimension counts independent directions, not vectors.

The set $\\{e_1, e_2, e_1 + e_2, 2e_1\\}$ in $\\mathbb{R}^2$ has $4$ elements but spans only a 2-dimensional space. Adding more vectors to a set never *decreases* the dimension of its span, but it might not *increase* the dimension either. Dimension is determined by the number of *independent directions* you generate, not by the count of generators.

A second common error: confusing the dimension of $\\mathcal{P}_n$ with $n$. The space $\\mathcal{P}_n$ has dimension $n + 1$, because polynomials of degree at most $n$ have $n + 1$ coefficients (one for each of $1, x, x^2, \\dots, x^n$).

A third trap: using the dimension formula $\\dim(U + W) = \\dim(U) + \\dim(W) - \\dim(U \\cap W)$ without checking the intersection. If two subspaces are *disjoint as subspaces* (i.e., $U \\cap W = \\{0\\}$), only then is the sum of dimensions correct. If they share more than just zero, you must subtract $\\dim(U \\cap W)$.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute the dimension of a polynomial subspace',
        body: 'What is the dimension of the subspace $W = \\{p \\in \\mathcal{P}_3 : p(0) = 0\\}$ of $\\mathcal{P}_3$? A polynomial $p(x) = a_0 + a_1 x + a_2 x^2 + a_3 x^3$ satisfies $p(0) = 0$ iff $a_0 = 0$. So $W$ consists of polynomials of the form $a_1 x + a_2 x^2 + a_3 x^3$ with $3$ free parameters. A basis is $\\{x, x^2, x^3\\}$. So $\\dim(W) = 3$.',
      },
      {
        title: 'Apply the dimension formula',
        body: 'In $\\mathbb{R}^4$, let $U = \\text{span}\\{e_1, e_2\\}$ and $W = \\text{span}\\{e_2, e_3\\}$. Then $\\dim(U) = \\dim(W) = 2$, and $U \\cap W = \\text{span}\\{e_2\\}$ has dimension $1$. By the dimension formula, $\\dim(U + W) = 2 + 2 - 1 = 3$. We can verify: $U + W = \\text{span}\\{e_1, e_2, e_3\\}$, a 3-dimensional subspace.',
      },
    ],

    problems: [
      {
        id: 'P-2.5a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Which of the following IS a basis for $\\mathcal{P}_2$ (polynomials of degree at most $2$)?',
        choices: [
          { label: 'A' as const, body: '$\\{1, x, x^2\\}$ — the standard basis.' },
          { label: 'B' as const, body: '$\\{1, 1 + x, 1 + x + x^2\\}$' },
          { label: 'C' as const, body: '$\\{x, x^2, x^3\\}$' },
          { label: 'D' as const, body: '$\\{1, x, x^2, 2x^2\\}$' },
          { label: 'E' as const, body: 'Both (A) and (B) are bases.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: '(A) is the standard basis of $\\mathcal{P}_2$. (B) is also a basis: the three polynomials are linearly independent (no one is a linear combination of the others — different leading degrees) and there are exactly $3 = \\dim(\\mathcal{P}_2)$ of them, so by the [[dimension|"two out of three" rule]] they form a basis.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Correct, but incomplete on its own — (B) is also a basis.' },
            { choice: 'B' as const, why: 'Correct, but incomplete on its own.' },
            { choice: 'C' as const, why: '$x^3 \\notin \\mathcal{P}_2$ — it has degree $3$, exceeding the degree-$2$ bound. So this set is not even a subset of $\\mathcal{P}_2$.' },
            { choice: 'D' as const, why: 'Four vectors in a 3-dimensional space are forced to be linearly dependent (specifically, $2 x^2 = 2 \\cdot x^2$). A basis cannot have linearly dependent elements, and cannot exceed the dimension.' },
          ],
        },
      },
      {
        id: 'P-2.5b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'In $\\mathcal{P}_2$ with basis $\\{1, x, x^2\\}$, the coordinate vector of $p(x) = 3 - 2x + 5x^2$ is:',
        choices: [
          { label: 'A' as const, body: '$\\begin{pmatrix} 3 \\\\ -2 \\\\ 5 \\end{pmatrix}$' },
          { label: 'B' as const, body: '$\\begin{pmatrix} 5 \\\\ -2 \\\\ 3 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$\\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\end{pmatrix}$' },
          { label: 'D' as const, body: '$\\begin{pmatrix} 3 \\\\ 2 \\\\ 5 \\end{pmatrix}$' },
          { label: 'E' as const, body: '$p(x)$ itself — coordinate vectors and polynomials are the same.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'The coordinate vector lists the coefficients in the *order of the basis*. The basis is $\\{1, x, x^2\\}$, so the coordinates are the coefficients of $1$, $x$, $x^2$ in that order: $3$, $-2$, $5$. The coordinate vector is $(3, -2, 5)^T$.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Reversed order. Coordinate order matches basis order, so the constant coefficient comes first.' },
            { choice: 'C' as const, why: "Replaces the actual coefficients with $1$'s. Coordinate vectors record coefficients, not just \"presence.\"" },
            { choice: 'D' as const, why: 'Loses the negative sign on the $x$ coefficient. Coordinates record signs as well as magnitudes.' },
            { choice: 'E' as const, why: 'Polynomials and their coordinate vectors are isomorphic but not identical. The coordinate vector is a tuple of scalars; the polynomial is a polynomial.' },
          ],
        },
      },
      {
        id: 'P-2.5c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $V$ be a finite-dimensional vector space and let $S \\subseteq V$ be a set of vectors. Which of the following is FALSE?',
        choices: [
          { label: 'A' as const, body: 'If $|S| < \\dim(V)$, then $S$ cannot span $V$.' },
          { label: 'B' as const, body: 'If $|S| > \\dim(V)$, then $S$ must be linearly dependent.' },
          { label: 'C' as const, body: 'If $|S| = \\dim(V)$ and $S$ is linearly independent, then $S$ is a basis for $V$.' },
          { label: 'D' as const, body: 'If $|S| = \\dim(V)$ and $S$ spans $V$, then $S$ is linearly independent.' },
          { label: 'E' as const, body: 'If $|S| = \\dim(V)$, then $S$ is automatically a basis.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'A set with the right *count* of vectors is not automatically a basis — it must also be either spanning or linearly independent. For example, $\\{e_1, e_1, e_2\\}$ has $3$ elements in $\\mathbb{R}^3$ but is linearly dependent (the first two are equal), so it is not a basis. Statements (C) and (D) correctly express the "two out of three" rule: with the right count, you only need *one* of {spanning, independent}, but at least one is required.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'True — a spanning set must have at least $\\dim(V)$ elements.' },
            { choice: 'B' as const, why: 'True — an independent set has at most $\\dim(V)$ elements.' },
            { choice: 'C' as const, why: 'True — with the right count plus independence, spanning follows automatically.' },
            { choice: 'D' as const, why: 'True — with the right count plus spanning, independence follows automatically.' },
          ],
        },
      },
      {
        id: 'P-2.5d',
        format: 'multiple-choice' as const,
        difficulty: 3,
        statement: 'Let $U$ and $W$ be subspaces of $\\mathbb{R}^5$ with $\\dim(U) = 3$ and $\\dim(W) = 4$. Which of the following is the SMALLEST possible value of $\\dim(U \\cap W)$?',
        choices: [
          { label: 'A' as const, body: '$0$' },
          { label: 'B' as const, body: '$1$' },
          { label: 'C' as const, body: '$2$' },
          { label: 'D' as const, body: '$3$' },
          { label: 'E' as const, body: '$4$' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'Use the dimension formula: $\\dim(U + W) = \\dim(U) + \\dim(W) - \\dim(U \\cap W) = 3 + 4 - \\dim(U \\cap W) = 7 - \\dim(U \\cap W)$. Since $U + W$ is a subspace of $\\mathbb{R}^5$, we have $\\dim(U + W) \\leq 5$. So $7 - \\dim(U \\cap W) \\leq 5$, giving $\\dim(U \\cap W) \\geq 2$. The minimum is $2$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Would require $\\dim(U + W) = 7$, but $U + W \\subseteq \\mathbb{R}^5$ has dimension at most $5$.' },
            { choice: 'B' as const, why: 'Would require $\\dim(U + W) = 6$, also impossible in $\\mathbb{R}^5$.' },
            { choice: 'D' as const, why: 'Possible (when $U \\subseteq W$), but not the minimum.' },
            { choice: 'E' as const, why: 'Would require $U \\cap W$ to have larger dimension than $U$ itself, impossible.' },
          ],
        },
      },
    ],
  },
};
