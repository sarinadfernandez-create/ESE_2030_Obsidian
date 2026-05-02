import type { Concept } from '../types';

export const spanAndIndependence: Concept = {
  id: 'span-and-independence',
  unitId: 'ch2',
  number: '2.4',
  title: 'Span & Linear Independence',
  blurb: 'How collections of vectors generate subspaces — and how to spot redundancy.',
  tier: 'full',

  learn: {
    overview: `
Given a finite set of vectors in a [[vector-space-axioms|vector space]], two natural questions arise: what subspace do they generate, and is any of them redundant? **Span** answers the first question; **linear independence** answers the second.

A **linear combination** of vectors $v_1, \\dots, v_k$ is any expression $c_1 v_1 + c_2 v_2 + \\cdots + c_k v_k$ for scalars $c_1, \\dots, c_k$. The **span** of the set $\\{v_1, \\dots, v_k\\}$ is the collection of all such combinations — equivalently, the smallest [[subspaces|subspace]] containing all of them. Span is the constructive operation: given some vectors, span them out into the subspace they generate.

A set $\\{v_1, \\dots, v_k\\}$ is **linearly dependent** if some nontrivial linear combination of them equals the zero vector — that is, if there exist scalars $c_1, \\dots, c_k$, not all zero, with $c_1 v_1 + \\cdots + c_k v_k = 0$. Equivalently, at least one of the vectors is a linear combination of the others, and could be removed without changing the span. A set is **linearly independent** if no such redundancy exists: the only linear combination giving the zero vector is the trivial one $c_1 = c_2 = \\cdots = c_k = 0$.

The two concepts are inverses of each other in spirit. Span asks "how big is what these vectors generate?" Independence asks "can the same span be generated with fewer vectors?" Together they lead to the central concept of [[bases|basis]] — a spanning set that is also linearly independent, hence as small as possible while still spanning.

In computational terms, both questions reduce to [[row-reduction]]. Place the vectors as columns of a matrix $A$. Then $\\text{span}\\{v_1, \\dots, v_k\\} = \\text{Col}(A)$, the [[image-and-kernel|column space]]. Linear independence corresponds to whether $A$ has full column rank — or equivalently, whether the only solution to $Ax = 0$ is the trivial one.

Some intuitive facts that come from this perspective:

- **More vectors than dimension means dependence.** If you have $k$ vectors in an $n$-dimensional space with $k > n$, they must be linearly dependent. There are not enough independent directions for them all to be independent.
- **A single nonzero vector is independent.** A two-vector set is independent if and only if neither is a scalar multiple of the other. A three-vector set is independent if and only if no one is a linear combination of the other two — but this gets harder to check by inspection.
- **Linear independence is preserved by [[change-of-basis|invertible linear transformations]] and by adding-a-zero-coordinate.** It is not preserved by projection (which can collapse independent vectors onto a lower-dimensional subspace) or by general linear transformations (which can have nontrivial kernels).

The combination of span and independence gives [[bases|bases]] their two properties: a basis is a spanning set with no redundancy. The [[dimension]] is the size of any basis — a number that turns out to be intrinsic to the space, not dependent on which basis you choose.
    `.trim(),

    definitions: [
      {
        term: 'Linear combination',
        body: 'For vectors $v_1, \\dots, v_k$ in $V$ and scalars $c_1, \\dots, c_k$, the vector $c_1 v_1 + \\cdots + c_k v_k$. The scalars are called the coefficients.',
      },
      {
        term: 'Span',
        body: 'For a set $S = \\{v_1, \\dots, v_k\\}$, the span $\\text{span}(S)$ is the set of all linear combinations of vectors in $S$. Equivalently, the smallest subspace of $V$ containing $S$.',
      },
      {
        term: 'Linearly dependent',
        body: 'A set $\\{v_1, \\dots, v_k\\}$ is linearly dependent if there exist scalars $c_1, \\dots, c_k$, not all zero, such that $c_1 v_1 + \\cdots + c_k v_k = 0$. Equivalently, at least one $v_i$ can be written as a linear combination of the others.',
      },
      {
        term: 'Linearly independent',
        body: 'A set $\\{v_1, \\dots, v_k\\}$ is linearly independent if it is not linearly dependent. Equivalently, the only solution to $c_1 v_1 + \\cdots + c_k v_k = 0$ is the trivial one $c_1 = c_2 = \\cdots = c_k = 0$.',
      },
      {
        term: 'Spanning set',
        body: 'A set $S \\subseteq V$ is a spanning set for a subspace $W$ if $\\text{span}(S) = W$. A spanning set may have redundancy.',
      },
    ],

    theorems: [
      {
        name: 'Span is the smallest containing subspace',
        statement: 'For any set $S$ in a vector space $V$, $\\text{span}(S)$ is a subspace of $V$, and it is contained in every subspace that contains $S$.',
        intuition: 'The span is closed under addition and scalar multiplication by construction (linear combinations of linear combinations are linear combinations). Any subspace containing $S$ must, by closure, contain all linear combinations of $S$ — that is, all of $\\text{span}(S)$. So $\\text{span}(S)$ is the minimum.',
      },
      {
        name: 'Independence test via linear systems',
        statement: 'Vectors $v_1, \\dots, v_k$ in $\\mathbb{R}^n$ are linearly independent if and only if the matrix $A$ with columns $v_1, \\dots, v_k$ has trivial null space — equivalently, $Ax = 0$ has only the solution $x = 0$.',
        intuition: 'The equation $c_1 v_1 + \\cdots + c_k v_k = 0$ is exactly $Ax = 0$ where $x = (c_1, \\dots, c_k)^T$. Asking for the dependence relation to have a nontrivial solution is asking whether the matrix has a nontrivial null space.',
      },
      {
        name: 'More vectors than dimension forces dependence',
        statement: 'If $\\{v_1, \\dots, v_k\\}$ is a set in an $n$-dimensional vector space and $k > n$, then the set is linearly dependent.',
        intuition: 'There are not enough linearly independent directions in an $n$-dimensional space to support $k$ independent vectors. The matrix $A$ formed from the vectors as columns has more columns than rows; by rank-nullity, its null space is nontrivial.',
      },
      {
        name: 'A vector and a dependence relation',
        statement: 'A set $\\{v_1, \\dots, v_k\\}$ is linearly dependent if and only if at least one $v_i$ is a linear combination of the others.',
        intuition: 'The two conditions are equivalent algebraically. A nontrivial relation $c_1 v_1 + \\cdots + c_k v_k = 0$ with $c_i \\neq 0$ can be rearranged to express $v_i$ as a combination of the others. Conversely, expressing $v_i$ as a combination of the others gives a nontrivial relation.',
      },
    ],

    keyFormulas: [
      'c_1 v_1 + c_2 v_2 + \\cdots + c_k v_k = \\sum_{i=1}^k c_i v_i',
      '\\text{span}\\{v_1, \\dots, v_k\\} = \\left\\{ \\sum c_i v_i : c_i \\in \\mathbb{R} \\right\\}',
      '\\{v_1, \\dots, v_k\\} \\text{ independent} \\iff (c_1 v_1 + \\cdots + c_k v_k = 0 \\Rightarrow c_1 = \\cdots = c_k = 0)',
    ],
  },

  explore: {
    vizComponent: 'SpanAndIndependenceViz',
    description: 'Place up to three vectors in $\\mathbb{R}^2$ or $\\mathbb{R}^3$. The viz shows the subspace they span — a line, plane, or all of the space — and detects when vectors are linearly dependent. Drag vectors into and out of dependence configurations to see the span shrink and grow.',
    misconception: {
      title: 'Three vectors in $\\mathbb{R}^3$ are not automatically a basis',
      body: `
A common error in this unit is assuming that "the right number" of vectors in a space is automatically a basis. It is not. Three vectors in $\\mathbb{R}^3$ form a basis if and only if they are linearly independent. If they are dependent, they span a 2-dimensional plane (or smaller) and definitely do not span all of $\\mathbb{R}^3$.

A specific instance: if $v_1 = (1, 1, 0)$, $v_2 = (0, 1, 1)$, and $v_3 = v_1 - v_2 = (1, 0, -1)$, the three vectors look generic, but $v_3$ is a linear combination of the first two — so they only span a 2-dimensional plane.

A second misconception: thinking "linearly dependent" means "all the vectors are scalar multiples of each other." It doesn't. A set is dependent as soon as *some* nontrivial relation exists — even if it involves all the vectors with different coefficients. The set $\\{(1, 0, 0), (0, 1, 0), (1, 1, 0)\\}$ is dependent because $v_1 + v_2 - v_3 = 0$, even though no two of them are scalar multiples.

A third trap: confusing "spanning" with "filling up." A spanning set might be much larger than necessary. The set $\\{e_1, e_2, e_3, 2e_1, 3e_2\\}$ spans $\\mathbb{R}^3$, but contains 2 redundant vectors. Spanning says "everything in the space can be reached"; it does not say "as efficiently as possible."
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Test independence of three vectors in $\\mathbb{R}^3$',
        body: 'Are $v_1 = (1, 0, 1)$, $v_2 = (0, 1, 1)$, $v_3 = (1, 1, 0)$ linearly independent? Form the matrix $A = \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\\\ 1 & 1 & 0 \\end{pmatrix}$ with the vectors as columns and row-reduce.',
      },
      {
        title: 'Row reduce',
        body: 'Subtract row 1 from row 3: $\\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 1 & -1 \\end{pmatrix}$. Subtract row 2 from row 3: $\\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & -2 \\end{pmatrix}$. Three pivots, no zero rows.',
      },
      {
        title: 'Conclude',
        body: 'The matrix has rank $3$ and full column rank, so the three columns are linearly independent. Equivalently, $\\det(A) = -2 \\neq 0$, so the columns span all of $\\mathbb{R}^3$ and form a basis.',
      },
    ],

    problems: [
      {
        id: 'P-2.4a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'In $\\mathcal{P}_2$, consider the polynomials $p_1(x) = 1 + x$, $p_2(x) = x + x^2$, and $p_3(x) = 1 + 2x + x^2$. These polynomials are linearly dependent because:',
        choices: [
          { label: 'A' as const, body: 'They all have degree at most $2$.' },
          { label: 'B' as const, body: '$p_3 = p_1 + p_2$, so $p_3$ is a linear combination of $p_1$ and $p_2$.' },
          { label: 'C' as const, body: 'They do not include the polynomial $x^2$ alone, so they fail to span $\\mathcal{P}_2$.' },
          { label: 'D' as const, body: 'Three polynomials in $\\mathcal{P}_2$ are always linearly dependent.' },
          { label: 'E' as const, body: 'None of the above — the polynomials are actually independent.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Compute $p_1 + p_2 = (1 + x) + (x + x^2) = 1 + 2x + x^2 = p_3$. So $p_1 + p_2 - p_3 = 0$ is a nontrivial dependence relation. The set is linearly dependent.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Having a common bound on degree is irrelevant to dependence. Many sets of degree-$\\leq 2$ polynomials are independent.' },
            { choice: 'C' as const, why: "Failure to span $\\mathcal{P}_2$ would be a separate (and possibly false) claim. The vectors here actually do span only a 2-dimensional subspace, but failing-to-span doesn't cause dependence — dependence has its own definition." },
            { choice: 'D' as const, why: 'False. $\\mathcal{P}_2$ has dimension $3$, so three polynomials in $\\mathcal{P}_2$ *can* be linearly independent (and form a basis). It is having $4$ or more that forces dependence.' },
            { choice: 'E' as const, why: 'They are dependent — see the explanation.' },
          ],
        },
      },
      {
        id: 'P-2.4b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For the polynomials in the previous problem, what is the dimension of $\\text{span}\\{p_1, p_2, p_3\\}$?',
        choices: [
          { label: 'A' as const, body: '$1$ — they are all the same polynomial.' },
          { label: 'B' as const, body: '$2$ — they are dependent, so the span is smaller than the count of vectors.' },
          { label: 'C' as const, body: '$3$ — they span all of $\\mathcal{P}_2$.' },
          { label: 'D' as const, body: '$4$ — one for each polynomial plus one for the zero polynomial.' },
          { label: 'E' as const, body: 'Cannot be determined without more information.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Since $p_3 = p_1 + p_2$, the span is generated by $p_1$ and $p_2$ alone: $\\text{span}\\{p_1, p_2, p_3\\} = \\text{span}\\{p_1, p_2\\}$. The two polynomials $p_1 = 1 + x$ and $p_2 = x + x^2$ are linearly independent (neither is a scalar multiple of the other — they have different degrees of leading term). So the span is $2$-dimensional.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The three polynomials are different from each other. Dependence does not require equality.' },
            { choice: 'C' as const, why: '$\\mathcal{P}_2$ has dimension $3$, but our span has dimension $2$ — short of all of $\\mathcal{P}_2$. The polynomials do not span $\\mathcal{P}_2$.' },
            { choice: 'D' as const, why: 'Adding the zero vector to a set never increases the span. The span is determined by the nonzero vectors.' },
            { choice: 'E' as const, why: 'The dimension can be determined: it is $2$.' },
          ],
        },
      },
      {
        id: 'P-2.4c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the vectors in $\\mathbb{R}^3$: $v_1 = (1, 1, 0)$, $v_2 = (0, 1, 1)$, $v_3 = (1, 0, -1)$. Which statement is TRUE about $S = \\{v_1, v_2, v_3\\}$?',
        choices: [
          { label: 'A' as const, body: '$S$ is a basis for $\\mathbb{R}^3$.' },
          { label: 'B' as const, body: '$S$ is linearly independent but does not span $\\mathbb{R}^3$.' },
          { label: 'C' as const, body: '$S$ spans $\\mathbb{R}^3$ but is linearly dependent.' },
          { label: 'D' as const, body: '$S$ is linearly dependent and does not span $\\mathbb{R}^3$.' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'Observe that $v_1 - v_2 = (1, 1, 0) - (0, 1, 1) = (1, 0, -1) = v_3$. So $v_1 - v_2 - v_3 = 0$ is a nontrivial dependence relation: $S$ is linearly dependent. Since $S$ is dependent, $\\text{span}(S) = \\text{span}\\{v_1, v_2\\}$, a 2-dimensional plane in $\\mathbb{R}^3$. So $S$ does not span $\\mathbb{R}^3$.',
          partialCredit: '(C) earns partial credit for correctly identifying dependence but mistakenly concluding that three vectors in $\\mathbb{R}^3$ must span — a common but incorrect intuition.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Bases are independent and spanning. $S$ is neither, so it is far from being a basis.' },
            { choice: 'B' as const, why: 'Impossible: 3 linearly independent vectors in $\\mathbb{R}^3$ always span $\\mathbb{R}^3$.' },
            { choice: 'C' as const, why: 'Targets the misconception that "3 vectors in $\\mathbb{R}^3$" guarantees spanning. Dependence here means the span has dimension $< 3$, so $\\mathbb{R}^3$ is not fully spanned.' },
            { choice: 'E' as const, why: '(D) is correct.' },
          ],
        },
      },
      {
        id: 'P-2.4d',
        format: 'multiple-choice' as const,
        difficulty: 3,
        statement: 'In $\\mathbb{R}^4$, let $v_1, v_2, v_3$ be linearly independent vectors. Define $w_1 = v_1 + v_2$, $w_2 = v_2 + v_3$, $w_3 = v_3 + v_1$. Which statement about $\\{w_1, w_2, w_3\\}$ is TRUE?',
        choices: [
          { label: 'A' as const, body: '$\\{w_1, w_2, w_3\\}$ is always linearly independent.' },
          { label: 'B' as const, body: '$\\{w_1, w_2, w_3\\}$ is always linearly dependent.' },
          { label: 'C' as const, body: '$\\{w_1, w_2, w_3\\}$ is linearly independent if and only if $v_1 + v_2 + v_3 \\neq 0$.' },
          { label: 'D' as const, body: '$\\{w_1, w_2, w_3\\}$ spans $\\mathbb{R}^4$.' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Suppose $a w_1 + b w_2 + c w_3 = 0$. Substituting: $a(v_1 + v_2) + b(v_2 + v_3) + c(v_3 + v_1) = 0$, which rearranges to $(a + c) v_1 + (a + b) v_2 + (b + c) v_3 = 0$. Since $v_1, v_2, v_3$ are linearly independent, each coefficient must be zero: $a + c = 0$, $a + b = 0$, $b + c = 0$. From the first two: $c = -a$ and $b = -a$. Substituting into the third: $-a + (-a) = -2a = 0$, so $a = 0$. Then $b = c = 0$. The only solution is the trivial one, so the set is independent.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Students may guess dependence because $w_1 + w_2 + w_3 = 2(v_1 + v_2 + v_3)$, but this is not a dependence relation among $w_1, w_2, w_3$ unless the right-hand side is zero.' },
            { choice: 'C' as const, why: "The condition $v_1 + v_2 + v_3 \\neq 0$ is automatically true when $v_1, v_2, v_3$ are independent (nontrivial linear combinations of independent vectors are nonzero), so the implication trivializes — but it does not characterize independence of the $w$'s." },
            { choice: 'D' as const, why: 'Three vectors cannot span $\\mathbb{R}^4$; you would need at least 4.' },
            { choice: 'E' as const, why: '(A) is correct.' },
          ],
        },
      },
    ],
  },
};
