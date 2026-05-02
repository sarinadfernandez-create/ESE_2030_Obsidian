import type { Concept } from '../types';

export const bases: Concept = {
  id: 'bases',
  unitId: 'ch4',
  number: '4.1',
  title: 'Bases & Spanning Sets',
  blurb: 'A basis is a spanning set with no redundancy — the minimal description of a vector space.',
  tier: 'full',

  learn: {
    overview: `
A **basis** for a vector space $V$ is a set $\\mathcal{B} = \\{b_1, b_2, \\dots, b_n\\}$ that is both [[span-and-independence|linearly independent and spans $V$]]. These two conditions force $\\mathcal{B}$ to be the *minimum* set needed to describe $V$ — small enough to have no redundancy, large enough to reach every vector.

Bases are the workhorses of linear algebra. Once you have a basis for a space, every vector in the space can be written *uniquely* as a linear combination of basis vectors, and you can use those coefficients as a coordinate system. The choice of basis is what turns abstract vectors into concrete tuples of numbers — and different bases give different coordinate systems for the same space.

The **standard basis** of $\\mathbb{R}^n$ is $\\{e_1, e_2, \\dots, e_n\\}$, where $e_i$ has a $1$ in position $i$ and zeros elsewhere. The standard basis of $\\mathcal{P}_n$ is $\\{1, x, x^2, \\dots, x^n\\}$. The standard basis of $\\mathbb{R}^{m \\times n}$ is $\\{E_{ij}\\}$, the matrices with $1$ in position $(i, j)$ and zeros elsewhere. These are the "default" choices, and most concrete computations begin in the standard basis. But many problems are simpler in non-standard bases: signal processing in the [[engineering-signals|Fourier basis]], polynomial interpolation in the **Lagrange basis**, dynamical systems in the [[eigenvectors|eigenbasis]] of the relevant operator.

The **Basis Extension Theorem** says that any linearly independent set in a finite-dimensional vector space can be extended to a basis. The proof is constructive: while the set has fewer than $\\dim(V)$ elements, pick any vector outside the span of the current set and add it. Linear independence is preserved at each step (the new vector cannot be a linear combination of the existing ones, by construction). Eventually the set has $\\dim(V)$ elements and must be a basis (by the [[dimension|dimension count]]). Conversely, the **Basis Reduction Theorem** says any spanning set contains a basis — repeatedly remove redundant vectors until no more can be removed.

A useful test for a basis: in a vector space of known dimension $n$, a set of exactly $n$ vectors is a basis if and only if it is *either* spanning *or* linearly independent. (The other follows automatically.) This is the [[dimension|"two out of three" rule]] — having the right *count* of vectors plus *one* of the basis properties is enough.

The non-uniqueness of bases is essential. Every vector space has many different bases, and different bases give different coordinate systems. For most applications, this freedom is the point: the right basis makes a problem easy. The Lagrange basis makes polynomial interpolation a single evaluation. The eigenbasis makes a linear transformation diagonal. The Fourier basis makes filtering trivial. [[change-of-basis|Change of basis]] is the algebraic tool for converting between coordinate systems when needed.

A common construction: the **Lagrange basis** for $\\mathcal{P}_n$ associated with $n + 1$ distinct nodes $x_0, x_1, \\dots, x_n$. Each $L_i$ is the unique polynomial of degree $\\leq n$ with $L_i(x_j) = \\delta_{ij}$ — equal to $1$ at its own node, $0$ at all others. The Lagrange basis has the magical property that the [[coordinates|coordinates]] of any polynomial $p$ with respect to this basis are simply its values at the nodes: $[p]_\\mathcal{L} = (p(x_0), p(x_1), \\dots, p(x_n))^T$. No system of equations needed.
    `.trim(),

    definitions: [
      {
        term: 'Basis',
        body: 'A set $\\mathcal{B} = \\{b_1, \\dots, b_n\\}$ of vectors in $V$ that is linearly independent and spans $V$. Equivalently, a minimal spanning set, or a maximal linearly independent set.',
      },
      {
        term: 'Standard basis',
        body: 'The "default" basis for a familiar space: $\\{e_1, \\dots, e_n\\}$ for $\\mathbb{R}^n$, $\\{1, x, \\dots, x^n\\}$ for $\\mathcal{P}_n$, $\\{E_{ij}\\}$ for $\\mathbb{R}^{m \\times n}$.',
      },
      {
        term: 'Lagrange basis',
        body: 'For $\\mathcal{P}_n$ with distinct nodes $x_0, \\dots, x_n$: the basis $\\{L_0, \\dots, L_n\\}$ where each $L_i$ is the unique degree-$n$ polynomial with $L_i(x_j) = \\delta_{ij}$. Designed so that polynomial coordinates are evaluations at the nodes.',
      },
      {
        term: 'Ordered basis',
        body: 'A basis with a specified order on its elements. Required for [[coordinates|coordinate vectors]] to be well-defined.',
      },
    ],

    theorems: [
      {
        name: 'Basis extension theorem',
        statement: 'Any linearly independent set $S$ in a finite-dimensional vector space $V$ can be extended to a basis of $V$ by adding zero or more vectors.',
        intuition: 'If $S$ does not span $V$, pick any $v \\notin \\text{span}(S)$ and add it. The enlarged set is still linearly independent (the new vector is not a linear combination of the old ones). Continue until $|S| = \\dim(V)$, at which point $S$ must be a basis.',
      },
      {
        name: '"Two out of three" basis criterion',
        statement: 'In an $n$-dimensional vector space, any set of $n$ vectors is a basis if it is either linearly independent or spanning.',
        intuition: 'Having the right count plus either property forces the other. With $n$ vectors and dimension $n$: independent vectors automatically span (otherwise their span has dim $< n$ but with $n$ independent vectors that\'s impossible); spanning vectors are automatically independent (otherwise a smaller subset spans, contradicting dim $= n$).',
      },
    ],

    keyFormulas: [
      '\\mathcal{B} \\text{ basis} \\iff \\mathcal{B} \\text{ spans and is linearly independent}',
      '|\\mathcal{B}| = \\dim(V)',
      'L_i(x_j) = \\delta_{ij} \\quad \\text{(Lagrange basis defining property)}',
    ],
  },

  explore: {
    vizComponent: 'BasisExplorer',
    description: 'Pick a vector space ($\\mathbb{R}^2$, $\\mathbb{R}^3$, or $\\mathcal{P}_2$) and a candidate set of vectors. The viz tests independence and spanning, reporting whether the set is a basis. Try the Lagrange basis with adjustable nodes — watch how the basis polynomials change as you move the nodes around.',
    misconception: {
      title: 'A basis is a SET of vectors, but the order matters for coordinates',
      body: `
Strictly speaking, a basis is a *set* of vectors — and sets are unordered. But for [[coordinates|coordinate representations]] to be well-defined, the basis needs an *order*. We typically write $\\mathcal{B} = \\{b_1, b_2, \\dots, b_n\\}$ with the subscripts implying an order, even though the set notation $\\{...\\}$ formally does not.

A reordered basis gives a different coordinate vector for the same vector. If $\\mathcal{B} = \\{b_1, b_2\\}$ gives $[v]_\\mathcal{B} = (3, 5)^T$, then the reordered basis $\\mathcal{B}' = \\{b_2, b_1\\}$ gives $[v]_{\\mathcal{B}'} = (5, 3)^T$. The vector $v$ is the same; only the coordinate representation changed.

A second misconception: thinking that a basis must be "simple" (like the standard basis). Many useful bases are not standard. The Lagrange basis for $\\mathcal{P}_n$ involves polynomials with no special structure beyond their interpolation property. Fourier bases involve trigonometric functions. Eigenbases involve eigenvectors of a specific operator. Standard bases are convenient defaults; non-standard bases are often the *right* tool for a problem.

A third trap: thinking that any set of $\\dim(V)$ vectors is a basis. It is not — they must also be either spanning or linearly independent. The set $\\{e_1, e_1, e_2\\}$ in $\\mathbb{R}^3$ has three vectors but is not a basis (it's not even linearly independent).
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify the Lagrange basis property',
        body: 'For $\\mathcal{P}_2$ with nodes $x_0 = -1, x_1 = 0, x_2 = 1$: the Lagrange basis polynomial $L_0$ has $L_0(-1) = 1, L_0(0) = 0, L_0(1) = 0$. Constructing it: $L_0(x) = \\frac{(x - 0)(x - 1)}{(-1 - 0)(-1 - 1)} = \\frac{x(x-1)}{2}$. Verify: $L_0(-1) = \\frac{(-1)(-2)}{2} = 1$ ✓, $L_0(0) = 0$ ✓, $L_0(1) = 0$ ✓.',
      },
      {
        title: 'Use the Lagrange basis for fast coordinates',
        body: 'For $p(x) = x^2 - x + 2$ in the Lagrange basis above: the coordinates are simply the evaluations at the nodes. $p(-1) = 1 + 1 + 2 = 4$, $p(0) = 0 - 0 + 2 = 2$, $p(1) = 1 - 1 + 2 = 2$. So $[p]_\\mathcal{L} = (4, 2, 2)^T$ — no system of equations needed.',
      },
    ],

    problems: [
      {
        id: 'P-4.1a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the space of $2 \\times 2$ symmetric matrices $\\text{Sym}_2 = \\{A \\in \\mathbb{R}^{2 \\times 2} : A^T = A\\}$. A student proposes the set $\\mathcal{B} = \\left\\{\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}, \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}, \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}, \\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}\\right\\}$ as a basis. Which statement is correct?',
        choices: [
          { label: 'A' as const, body: '$\\mathcal{B}$ forms a basis for $\\text{Sym}_2$.' },
          { label: 'B' as const, body: '$\\mathcal{B}$ spans $\\text{Sym}_2$ but is not linearly independent.' },
          { label: 'C' as const, body: '$\\mathcal{B}$ is linearly independent but does not span $\\text{Sym}_2$.' },
          { label: 'D' as const, body: '$\\mathcal{B}$ contains a non-symmetric matrix, so it cannot be a subset of $\\text{Sym}_2$.' },
          { label: 'E' as const, body: '$\\text{Sym}_2$ is 4-dimensional, so no set of 4 matrices can be a basis.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: '$\\dim(\\text{Sym}_2) = 3$ (a symmetric $2 \\times 2$ matrix has three independent entries: the two diagonal entries and one off-diagonal). $\\mathcal{B}$ has $4$ matrices in this 3-dimensional space, so it is forced to be linearly dependent. Verify: $\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix} = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix} + \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix} + \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ — the fourth matrix is the sum of the first three. The first three matrices form a basis, and adding the fourth makes the set still spanning but linearly dependent.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Does not recognize the linear dependence — having $4$ vectors in a 3-dimensional space forces dependence.' },
            { choice: 'C' as const, why: 'Wrong direction — the set is dependent, not independent. (The first three matrices alone are linearly independent.)' },
            { choice: 'D' as const, why: 'Every matrix in $\\mathcal{B}$ IS symmetric — they all satisfy $A^T = A$.' },
            { choice: 'E' as const, why: 'Confuses the dimension. $\\text{Sym}_2$ is 3-dimensional, not 4-dimensional.' },
          ],
        },
      },
      {
        id: 'P-4.1b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider $\\mathcal{P}_2$ with the Lagrange basis $\\mathcal{L} = \\{L_0, L_1, L_2\\}$ associated with nodes $x = -1, 0, 1$. What is $[p]_\\mathcal{L}$ for $p(x) = x^2 - x + 2$?',
        choices: [
          { label: 'A' as const, body: '$\\begin{pmatrix} 2 \\\\ -1 \\\\ 1 \\end{pmatrix}$' },
          { label: 'B' as const, body: '$\\begin{pmatrix} 2 \\\\ 2 \\\\ 4 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$\\begin{pmatrix} 1 \\\\ -1 \\\\ 2 \\end{pmatrix}$' },
          { label: 'D' as const, body: '$\\begin{pmatrix} 4 \\\\ 2 \\\\ 2 \\end{pmatrix}$' },
          { label: 'E' as const, body: 'Cannot be determined without computing the $L_i$ explicitly.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'In the Lagrange basis, the coordinates of $p$ are simply the evaluations of $p$ at the nodes. $p(-1) = 1 + 1 + 2 = 4$, $p(0) = 0 - 0 + 2 = 2$, $p(1) = 1 - 1 + 2 = 2$. So $[p]_\\mathcal{L} = (4, 2, 2)^T$. The defining property of the Lagrange basis $L_i(x_j) = \\delta_{ij}$ makes coordinates equal to evaluations, with no system to solve.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Reads off the coefficients in the standard basis $\\{1, x, x^2\\}$ — that is, the standard-basis coordinates of $p$. This conflates the standard and Lagrange bases.' },
            { choice: 'B' as const, why: 'Evaluates at the wrong node set $\\{0, 1, 2\\}$ instead of $\\{-1, 0, 1\\}$. The conceptual understanding is sound; the error is in reading the problem.' },
            { choice: 'C' as const, why: 'Reads the coefficients in descending-degree order from $x^2 - x + 2$ — another flavor of standard-basis confusion.' },
            { choice: 'E' as const, why: 'Misses the defining property of the Lagrange basis: coordinates are evaluations at nodes. No explicit computation of $L_i$ is needed.' },
          ],
        },
      },
    ],
  },
};
