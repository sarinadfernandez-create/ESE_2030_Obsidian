import type { Concept } from '../types';

export const vectorSpaceExamples: Concept = {
  id: 'vector-space-examples',
  unitId: 'ch2',
  number: '2.2',
  title: 'Vector Space Examples',
  blurb: 'A guided tour through the standard vector spaces — Euclidean, polynomial, matrix, function, ODE solutions, and more.',
  tier: 'full',

  learn: {
    overview: `
The [[vector-space-axioms|axiomatic definition]] is abstract by design — it is meant to capture as many examples as possible. This page makes the abstraction concrete by surveying the spaces you will use throughout the course. Each is a vector space; together, they show why the abstraction is worth the effort.

**Euclidean space $\\mathbb{R}^n$** is the prototypical example: $n$-tuples of real numbers, with componentwise addition and scalar multiplication. Every theorem about $\\mathbb{R}^n$ — solving $Ax = b$, finding [[span-and-independence|span and independence]], computing [[dimension]] — generalizes to abstract vector spaces because the abstract definition was built to make the generalization automatic.

**Matrix space $\\mathbb{R}^{m \\times n}$** is the space of all $m \\times n$ real matrices, with entrywise addition and scalar multiplication. It is structurally just like $\\mathbb{R}^{mn}$ — a matrix is essentially a tuple of $mn$ numbers, just arranged in a rectangle. But that arrangement matters when matrices are applied as [[linear-transformation-defs|linear transformations]] or factored via [[lu-decomposition]]. The vector space structure on $\\mathbb{R}^{m \\times n}$ is what lets us add and scale matrices abstractly, independent of their action.

**Polynomial space $\\mathcal{P}_n$** is the space of polynomials of degree *at most* $n$, with the standard polynomial addition and scalar multiplication. The "at most" is essential — restricting to polynomials of degree *exactly* $n$ would not give a vector space (the sum of two such polynomials might have lower degree). $\\mathcal{P}_n$ has dimension $n + 1$, with the standard basis $\\{1, x, x^2, \\dots, x^n\\}$.

**Function spaces** like $C([a, b])$ — continuous functions on $[a, b]$ — are infinite-dimensional vector spaces. Pointwise addition and scalar multiplication preserve continuity, so the operations are well-defined. The zero function is the zero vector. Every continuous function has an additive inverse (its pointwise negative). These spaces are the natural setting for engineering signals, where a "signal" is a function of time.

**Solution spaces of linear homogeneous ODEs** form vector spaces. If $f$ and $g$ both satisfy a linear homogeneous equation like $f'' - 3 f' + 2 f = 0$, then so does $cf + dg$ for any scalars $c, d$. This is the structural reason why solving such ODEs reduces to finding a [[bases|basis]] for the solution space — once you have a basis, every solution is a linear combination of the basis elements.

**Formal power series and sequences** extend the polynomial idea to infinitely many terms. The space of all sequences $(a_0, a_1, a_2, \\dots)$ of real numbers is an infinite-dimensional vector space. Subspaces of this — convergent sequences, summable sequences, sequences satisfying recurrence relations — appear throughout signal processing and analysis.

The unifying lesson: linear algebra is not a theory of arrows in $\\mathbb{R}^n$. It is a theory of any structure satisfying the axioms, and many of the structures you actually care about — matrices, polynomials, signals, ODE solutions — *are* such structures, even though they look nothing like arrows.
    `.trim(),

    definitions: [
      {
        term: 'Euclidean space ($\\mathbb{R}^n$)',
        body: 'The set of all $n$-tuples of real numbers, with componentwise operations. Dimension $n$, standard basis $\\{e_1, \\dots, e_n\\}$.',
      },
      {
        term: 'Matrix space ($\\mathbb{R}^{m \\times n}$)',
        body: 'The set of all $m \\times n$ real matrices, with entrywise operations. Dimension $mn$, standard basis $\\{E_{ij}\\}$ where $E_{ij}$ has a $1$ in position $(i, j)$ and zeros elsewhere.',
      },
      {
        term: 'Polynomial space ($\\mathcal{P}_n$)',
        body: 'The set of polynomials of degree at most $n$, with standard polynomial operations. Dimension $n + 1$, standard basis $\\{1, x, x^2, \\dots, x^n\\}$.',
      },
      {
        term: 'Continuous functions ($C([a, b])$)',
        body: 'The set of continuous functions $f : [a, b] \\to \\mathbb{R}$, with pointwise operations. Infinite-dimensional.',
      },
      {
        term: 'Solution space of a linear homogeneous ODE',
        body: 'The set of all functions satisfying a given linear homogeneous differential equation. A finite-dimensional subspace of a function space; its dimension equals the order of the ODE for "nice" coefficient functions.',
      },
      {
        term: 'Sequence space',
        body: 'The set of all infinite sequences $(a_0, a_1, a_2, \\dots)$ of real numbers, with componentwise operations. Infinite-dimensional.',
      },
    ],

    theorems: [
      {
        name: 'Dimension of standard examples',
        statement: '$\\dim(\\mathbb{R}^n) = n$. $\\dim(\\mathbb{R}^{m \\times n}) = mn$. $\\dim(\\mathcal{P}_n) = n + 1$. $\\dim(C([a, b])) = \\infty$. The solution space of an $n$-th order linear homogeneous ODE has dimension $n$.',
        intuition: 'Each statement is a count of free parameters needed to specify an element. A vector in $\\mathbb{R}^n$ needs $n$ coordinates. A matrix in $\\mathbb{R}^{m \\times n}$ needs $mn$ entries. A polynomial in $\\mathcal{P}_n$ needs $n + 1$ coefficients (one for each power of $x$, including $x^0$). A continuous function on an interval needs an uncountable amount of information to specify, hence infinite dimension.',
      },
      {
        name: 'Polynomial space requires "at most"',
        statement: 'The set of polynomials of degree *at most* $n$ is a vector space. The set of polynomials of degree *exactly* $n$ is NOT a vector space.',
        intuition: 'Closure fails for the "exactly $n$" version because the sum of two degree-$n$ polynomials can have lower degree. For example, $x^3 + (-x^3 + x^2) = x^2$, which has degree $2$. The set is also missing the zero polynomial, which has no defined degree (or degree $-\\infty$, by convention).',
      },
    ],

    keyFormulas: [
      '\\dim(\\mathbb{R}^n) = n',
      '\\dim(\\mathbb{R}^{m \\times n}) = mn',
      '\\dim(\\mathcal{P}_n) = n + 1',
      '\\text{order of ODE} = \\dim(\\text{solution space})',
    ],
  },

  explore: {
    vizComponent: 'VectorSpaceExamplesViz',
    description: "Cycle through six standard vector spaces — $\\mathbb{R}^2$, $\\mathbb{R}^{2 \\times 2}$, $\\mathcal{P}_2$, $C([0,1])$, the solution space of $f'' + f = 0$, and the space of finite-length sequences. For each, the viz shows: a representative element, a basis of the space, and the dimension. Use this to build a mental gallery of \"what vectors actually look like\" across the examples.",
    misconception: {
      title: 'The dimension of $\\mathcal{P}_n$ is $n + 1$, not $n$',
      body: `
A persistent off-by-one error. Polynomials of degree at most $n$ have $n + 1$ coefficients — one for each of $1, x, x^2, \\dots, x^n$. So $\\mathcal{P}_n$ has dimension $n + 1$, with standard basis $\\{1, x, x^2, \\dots, x^n\\}$ of size $n + 1$.

Sources of confusion: the subscript $n$ refers to the maximum degree, not the dimension. $\\mathcal{P}_3$ — polynomials of degree at most $3$ — has dimension $4$, not $3$. $\\mathcal{P}_2$ has dimension $3$. The space of "polynomials of degree exactly $n$" is not even a vector space, so it has no dimension to confuse with.

A second misconception related to this unit: thinking infinite-dimensional spaces are somehow "weird" or "broken." They are perfectly well-defined vector spaces — they just don't have finite bases. Many engineering applications (signal processing, quantum mechanics, control theory) take place in infinite-dimensional spaces, and most of linear algebra still applies. The main difference is that finite-dimensional theorems involving "every basis has the same finite size" require care to extend.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute the dimension of $\\mathcal{P}_4$',
        body: '$\\mathcal{P}_4$ is the space of polynomials of degree at most $4$. A general element has the form $a_0 + a_1 x + a_2 x^2 + a_3 x^3 + a_4 x^4$, with $5$ free coefficients. So $\\dim(\\mathcal{P}_4) = 5$, with standard basis $\\{1, x, x^2, x^3, x^4\\}$.',
      },
      {
        title: 'Compute the dimension of the space of $3 \\times 3$ symmetric matrices',
        body: 'A symmetric $3 \\times 3$ matrix has the form $\\begin{pmatrix} a & b & c \\\\ b & d & e \\\\ c & e & f \\end{pmatrix}$, with $6$ free parameters ($a, b, c, d, e, f$). The off-diagonal entries are paired by the symmetry constraint. So this subspace of $\\mathbb{R}^{3 \\times 3}$ has dimension $6$.',
      },
      {
        title: "Identify the dimension of the solution space of $f'' - 4 f' + 3 f = 0$",
        body: 'This is a linear homogeneous ODE of order $2$, so its solution space has dimension $2$. (Concretely: the characteristic polynomial $\\lambda^2 - 4\\lambda + 3 = 0$ has roots $\\lambda = 1, 3$, giving solutions $e^t$ and $e^{3t}$, which form a basis.)',
      },
    ],

    problems: [
      {
        id: 'P-2.2a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'The set of all $2 \\times 2$ diagonal matrices forms a vector space under matrix addition and scalar multiplication. What is its dimension?',
        choices: [
          { label: 'A' as const, body: '$1$ — there is essentially one type of matrix.' },
          { label: 'B' as const, body: '$2$ — corresponding to the two diagonal entries.' },
          { label: 'C' as const, body: '$3$ — two diagonal entries plus one off-diagonal.' },
          { label: 'D' as const, body: '$4$ — same as the full space of $2 \\times 2$ matrices.' },
          { label: 'E' as const, body: 'Infinite — each entry can be any real number.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'A $2 \\times 2$ diagonal matrix has the form $\\begin{pmatrix} a & 0 \\\\ 0 & d \\end{pmatrix}$, with $2$ free parameters. A basis is $\\left\\{ \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}, \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix} \\right\\}$. So the dimension is $2$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Confuses "variety of objects" with "dimension." A vector space can have one shape of object but many parameters specifying it.' },
            { choice: 'C' as const, why: 'Counts an off-diagonal entry, but in a diagonal matrix the off-diagonals are forced to be zero — they contribute no free parameter.' },
            { choice: 'D' as const, why: 'The full space of $2 \\times 2$ matrices has dimension $4$, but the diagonal matrices form a strict subspace of dimension $2$.' },
            { choice: 'E' as const, why: 'Confuses "scalar values can be anything" with "infinite dimension." The dimension counts free parameters, not the cardinality of the underlying field.' },
          ],
        },
      },
      {
        id: 'P-2.2b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'The vector space of all infinite real sequences $(a_0, a_1, a_2, \\dots)$ has what dimension?',
        choices: [
          { label: 'A' as const, body: '$0$ — only the zero sequence is in the space.' },
          { label: 'B' as const, body: '$1$ — every sequence is a scalar multiple of $(1, 1, 1, \\dots)$.' },
          { label: 'C' as const, body: 'Countably infinite.' },
          { label: 'D' as const, body: 'Uncountably infinite.' },
          { label: 'E' as const, body: 'Undefined — infinite-dimensional spaces have no dimension.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'A natural candidate basis consists of the indicator sequences $e_0 = (1, 0, 0, \\dots)$, $e_1 = (0, 1, 0, \\dots)$, etc. — one for each index. There are countably infinitely many such basis elements (one per natural number). However, this is not actually a basis of the *full* sequence space, because not every sequence is a *finite* linear combination of these (a sequence like $(1, 1, 1, \\dots)$ would require infinitely many of them). The full sequence space requires an uncountable basis (a "Hamel basis"), but the standard convention in this course is to refer to it as countably infinite-dimensional, treating the indicator sequences as a "Schauder basis" with infinite combinations allowed.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'There are many sequences besides zero, so the space is far from trivial.' },
            { choice: 'B' as const, why: 'Different sequences are linearly independent in many ways. $(1, 0, 0, \\dots)$ and $(0, 1, 0, \\dots)$ are not scalar multiples of each other.' },
            { choice: 'D' as const, why: 'A subtle answer. In strict Hamel-basis terms, the full sequence space *is* uncountably-dimensional. But for the level of this course, "countably infinite" is the standard answer, treating the indicator sequences as the working basis.' },
            { choice: 'E' as const, why: 'Infinite-dimensional spaces have well-defined notions of dimension; the dimension is just an infinite cardinal.' },
          ],
        },
      },
      {
        id: 'P-2.2c',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'The vector space of all $n \\times n$ matrices under matrix addition has what dimension?',
        choices: [
          { label: 'A' as const, body: '$n$ — one dimension for each row.' },
          { label: 'B' as const, body: '$2n$ — for the $n$ rows plus $n$ columns.' },
          { label: 'C' as const, body: '$n^2$ — one dimension for each entry.' },
          { label: 'D' as const, body: '$n!$ — corresponding to permutations of the entries.' },
          { label: 'E' as const, body: 'It depends on the rank of the matrices.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'A general $n \\times n$ matrix has $n^2$ entries, each a free parameter. A standard basis consists of the matrices $E_{ij}$ that have a $1$ in position $(i, j)$ and zeros elsewhere — there are $n^2$ such matrices.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Significantly undercounts. Each row alone has $n$ entries, and there are $n$ rows.' },
            { choice: 'B' as const, why: 'Counts rows and columns separately, but each entry is shared between one row and one column. The correct count is $n \\cdot n$, not $n + n$.' },
            { choice: 'D' as const, why: 'Permutations are unrelated to dimension. $n!$ is the size of the permutation group, not the dimension of the matrix space.' },
            { choice: 'E' as const, why: 'The vector space of *all* $n \\times n$ matrices includes matrices of every rank. The dimension is the same regardless.' },
          ],
        },
      },
      {
        id: 'P-2.2d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $V$ be the set of all smooth functions $x: \\mathbb{R} \\to \\mathbb{R}$ satisfying the differential equation $\\frac{d^2 x}{dt^2} + x = 0$. (Every such solution is a linear combination of $\\sin t$ and $\\cos t$.) Under standard pointwise function operations, which statement is TRUE?',
        choices: [
          { label: 'A' as const, body: '$V$ is not a vector space because it does not contain the zero function.' },
          { label: 'B' as const, body: '$V$ is a vector space of dimension $1$.' },
          { label: 'C' as const, body: '$V$ is a vector space of dimension $2$.' },
          { label: 'D' as const, body: '$V$ is a vector space of infinite dimension.' },
          { label: 'E' as const, body: '$V$ is not a vector space because $\\sin$ and $\\cos$ are nonlinear functions.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: "The zero function trivially satisfies $0'' + 0 = 0$, so it is in $V$. The set $\\{\\cos t, \\sin t\\}$ is linearly independent (neither is a scalar multiple of the other), and every solution is a linear combination of these two. So $\\{\\cos t, \\sin t\\}$ is a basis for $V$, and $\\dim(V) = 2$.",
          trickAnalysis: [
            { choice: 'A' as const, why: "The zero function does satisfy the ODE: $0'' + 0 = 0$. So $V$ contains the zero element." },
            { choice: 'B' as const, why: 'Undercounts — both $\\cos t$ and $\\sin t$ are needed; neither alone suffices to express every solution.' },
            { choice: 'D' as const, why: 'Confuses the solution space (a 2-dimensional subspace) with the ambient space (the infinite-dimensional space of all smooth functions). The solution space is finite-dimensional.' },
            { choice: 'E' as const, why: "The differential equation $f'' + f = 0$ is linear in $f$. The functions $\\sin$ and $\\cos$ being \"nonlinear\" as functions of $t$ is irrelevant — what matters is that the operator $f \\mapsto f'' + f$ is linear." },
          ],
        },
      },
    ],
  },
};
