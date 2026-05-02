import type { Concept } from '../types';

export const coordinates: Concept = {
  id: 'coordinates',
  unitId: 'ch4',
  number: '4.2',
  title: 'Coordinates & Components',
  blurb: 'Pin down a vector by listing its coefficients in some basis — the bridge between abstract vectors and concrete tuples.',
  tier: 'full',

  learn: {
    overview: `
Given a [[bases|basis]] $\\mathcal{B} = \\{b_1, \\dots, b_n\\}$ of a vector space $V$, every vector $v \\in V$ has a *unique* expression as a linear combination of basis vectors:

$$v = c_1 b_1 + c_2 b_2 + \\cdots + c_n b_n.$$

The scalars $c_1, \\dots, c_n$ are the **coordinates** of $v$ with respect to $\\mathcal{B}$. Stacked as a column vector, they form the **coordinate vector**:

$$[v]_\\mathcal{B} = \\begin{pmatrix} c_1 \\\\ c_2 \\\\ \\vdots \\\\ c_n \\end{pmatrix} \\in \\mathbb{R}^n.$$

Coordinates are the bridge between abstract vector spaces and the concrete world of tuples and matrices. An abstract vector might be a polynomial, a function, a matrix, or some other complicated object — but its coordinate vector is just an element of $\\mathbb{R}^n$, suitable for direct computation.

The map $v \\mapsto [v]_\\mathcal{B}$, called the **coordinate isomorphism**, is a [[injective-surjective|linear isomorphism]] $V \\to \\mathbb{R}^n$. It preserves all linear-algebra structure: addition becomes coordinate-wise addition, scalar multiplication becomes coordinate-wise scaling, and linear independence is preserved exactly. This is what makes finite-dimensional linear algebra fundamentally about $\\mathbb{R}^n$ — every $n$-dimensional space has the same coordinate-level behavior.

**Uniqueness of coordinates** is a consequence of [[span-and-independence|linear independence]] of the basis: if $v = \\sum c_i b_i = \\sum d_i b_i$, then $\\sum (c_i - d_i) b_i = 0$, and independence forces $c_i = d_i$. Two different sets of coordinates for the same vector relative to the same basis is impossible.

**Coordinates depend on the basis.** The same vector has different coordinate vectors in different bases. In $\\mathbb{R}^2$, the standard basis gives $\\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix}$ for the vector $3 e_1 + 5 e_2$, but a rotated basis $\\{(1, 1)/\\sqrt{2}, (-1, 1)/\\sqrt{2}\\}$ gives different coordinates — even though the vector itself is unchanged. This is the central conceptual point: **vectors are intrinsic objects; coordinate vectors are basis-dependent representations**.

This basis-dependence is exactly why [[change-of-basis|change of basis]] matters. To translate a coordinate vector from one basis to another, multiply by the change-of-basis matrix. The vector itself never changes; only its representation does.

The coordinate isomorphism allows us to use familiar [[row-reduction|matrix machinery]] on abstract vector spaces. To check if polynomials $p_1, p_2, p_3$ are linearly independent in $\\mathcal{P}_2$, take their standard-basis coordinate vectors, form a matrix, row-reduce, and count pivots — all the standard machinery applies because the coordinate isomorphism preserves linear independence.

For an [[orthonormal-bases|orthonormal basis]], coordinates have an especially simple formula: $c_i = \\langle v, b_i \\rangle$. Each coordinate is just the [[dot-and-inner-products|inner product]] of $v$ with the corresponding basis vector. This is the "Fourier coefficient" formula, and it is one of the deepest reasons orthonormal bases are useful.
    `.trim(),

    definitions: [
      {
        term: 'Coordinates',
        body: 'For a vector $v \\in V$ and an ordered basis $\\mathcal{B} = \\{b_1, \\dots, b_n\\}$: the unique scalars $c_1, \\dots, c_n$ with $v = \\sum c_i b_i$.',
      },
      {
        term: 'Coordinate vector',
        body: '$[v]_\\mathcal{B} = (c_1, \\dots, c_n)^T \\in \\mathbb{R}^n$, the column of coordinates of $v$ with respect to $\\mathcal{B}$.',
      },
      {
        term: 'Coordinate isomorphism',
        body: 'The linear map $V \\to \\mathbb{R}^n$ given by $v \\mapsto [v]_\\mathcal{B}$. An isomorphism for any chosen basis $\\mathcal{B}$.',
      },
    ],

    theorems: [
      {
        name: 'Uniqueness of coordinates',
        statement: 'For a vector $v \\in V$ and a basis $\\mathcal{B}$: there is exactly one coordinate vector $[v]_\\mathcal{B}$.',
        intuition: 'Two different coordinate representations would mean $\\sum (c_i - d_i) b_i = 0$, which by linear independence of $\\mathcal{B}$ forces $c_i = d_i$ for all $i$.',
      },
      {
        name: 'Coordinates respect linear operations',
        statement: '$[v + w]_\\mathcal{B} = [v]_\\mathcal{B} + [w]_\\mathcal{B}$ and $[c v]_\\mathcal{B} = c [v]_\\mathcal{B}$.',
        intuition: 'The coordinate map is linear. This is what allows computations involving vector spaces (like checking independence or finding spans) to reduce to computations on coordinate vectors in $\\mathbb{R}^n$.',
      },
    ],

    keyFormulas: [
      'v = c_1 b_1 + c_2 b_2 + \\cdots + c_n b_n',
      '[v]_\\mathcal{B} = (c_1, c_2, \\ldots, c_n)^T',
      '[v + w]_\\mathcal{B} = [v]_\\mathcal{B} + [w]_\\mathcal{B}',
      'c_i = \\langle v, b_i \\rangle \\quad \\text{(orthonormal basis)}',
    ],
  },

  explore: {
    vizComponent: 'CoordinateViz',
    description: 'In $\\mathbb{R}^2$, pick a basis (standard, rotated, or shear-deformed) and click on the plane to place a vector. The viz shows the same vector with two displays: its standard-basis coordinates and its current-basis coordinates. Switch bases and watch the coordinates change while the vector itself stays put.',
    misconception: {
      title: 'Different bases do not change the vector — only its coordinate representation',
      body: `
A persistent misconception is that "changing basis changes the vector." This conflates the abstract vector with its numerical representation. **The vector is an abstract object. The coordinate vector is a representation of it.**

Analogy: a mountain has a fixed height. Measured in feet, that height is one number; measured in meters, it's a different number. But the mountain doesn't get taller or shorter when you change units — only the description changes. Same with vectors and coordinates: the vector $v$ is intrinsic to the vector space; its coordinate vector $[v]_\\mathcal{B}$ depends on the basis $\\mathcal{B}$.

The same numerical coordinate vector in two different bases generally represents different vectors. If $[v]_\\mathcal{B} = (3, 5)^T$ and $[w]_\\mathcal{C} = (3, 5)^T$ for two different bases $\\mathcal{B}$ and $\\mathcal{C}$, then $v = 3 b_1 + 5 b_2$ while $w = 3 c_1 + 5 c_2$. These are different linear combinations of different vectors — generally, $v \\neq w$.

A second misconception: thinking that orthonormality is required for coordinates to make sense. It is not. Coordinates exist for any basis, [[orthonormal-bases|orthonormal]] or not. Orthonormality just makes the coordinates *easier to compute* (inner-product formula instead of solving a linear system), and it makes the coordinate vector behave like the vector itself with respect to length and angle.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute coordinates in a non-standard basis',
        body: 'In $\\mathcal{P}_2$, consider $\\mathcal{B} = \\{1, x - 1, (x - 1)^2\\}$ and $p(x) = x^2 + 2x + 3$. To find $[p]_\\mathcal{B}$, write $p = c_0 + c_1 (x-1) + c_2 (x-1)^2$ and expand: $c_0 + c_1 x - c_1 + c_2 x^2 - 2 c_2 x + c_2 = c_2 x^2 + (c_1 - 2 c_2) x + (c_0 - c_1 + c_2)$. Match coefficients with $p(x) = x^2 + 2x + 3$: $c_2 = 1$, $c_1 - 2 c_2 = 2 \\Rightarrow c_1 = 4$, $c_0 - c_1 + c_2 = 3 \\Rightarrow c_0 = 6$. So $[p]_\\mathcal{B} = (6, 4, 1)^T$.',
      },
    ],

    problems: [
      {
        id: 'P-4.2a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'In $\\mathcal{P}_2$, consider the basis $\\mathcal{B} = \\{1, x - 1, (x - 1)^2\\}$. A student claims that $p(x) = x^2 + 2x + 3$ has coordinates $[p]_\\mathcal{B} = \\begin{pmatrix} 6 \\\\ 4 \\\\ 1 \\end{pmatrix}$. Which statement is correct?',
        choices: [
          { label: 'A' as const, body: 'The coordinates are correct as stated.' },
          { label: 'B' as const, body: 'The coordinates should be $\\begin{pmatrix} 3 \\\\ 2 \\\\ 1 \\end{pmatrix}$.' },
          { label: 'C' as const, body: 'The coordinates should be $\\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix}$.' },
          { label: 'D' as const, body: '$\\mathcal{B}$ is not a basis for $\\mathcal{P}_2$.' },
          { label: 'E' as const, body: 'The coordinates should be $\\begin{pmatrix} 1 \\\\ 4 \\\\ 1 \\end{pmatrix}$.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Verify by expanding: $6 \\cdot 1 + 4 (x - 1) + 1 (x - 1)^2 = 6 + 4x - 4 + x^2 - 2x + 1 = x^2 + 2x + 3$ ✓. The set $\\mathcal{B}$ is the "shifted monomial basis" — a basis for $\\mathcal{P}_2$ obtained by replacing $x$ with $x - 1$ in the standard basis.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Pattern-matches against the standard basis: takes the coefficients of $1$, $x$, $x^2$ from $p(x)$ directly. But the basis is $\\{1, x-1, (x-1)^2\\}$, not $\\{1, x, x^2\\}$.' },
            { choice: 'C' as const, why: 'Same issue, with descending-degree ordering of the coefficients.' },
            { choice: 'D' as const, why: '$\\mathcal{B}$ IS a basis. The three polynomials are linearly independent (different degrees) and there are exactly $3 = \\dim(\\mathcal{P}_2)$ of them.' },
            { choice: 'E' as const, why: 'Arithmetic error in the expansion. Verify: $1 \\cdot 1 + 4 (x - 1) + 1 (x - 1)^2 = 1 + 4x - 4 + x^2 - 2x + 1 = x^2 + 2x - 2$, not $x^2 + 2x + 3$.' },
          ],
        },
      },
      {
        id: 'P-4.2b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $V$ be a finite-dimensional vector space with basis $\\mathcal{B} = \\{b_1, \\dots, b_n\\}$. A student states: "Every vector in $V$ has exactly one coordinate representation with respect to $\\mathcal{B}$." Under what condition is this statement TRUE?',
        choices: [
          { label: 'A' as const, body: 'Always true, by definition of a basis.' },
          { label: 'B' as const, body: 'Only if the basis vectors are orthogonal.' },
          { label: 'C' as const, body: 'Only if the basis vectors are orthonormal.' },
          { label: 'D' as const, body: 'Only if $V = \\mathbb{R}^n$.' },
          { label: 'E' as const, body: 'Never true — vectors can have multiple coordinate representations.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Uniqueness of coordinate representation is a fundamental property of bases. Linear independence of the basis vectors forces uniqueness: if $v$ had two representations $\\sum c_i b_i = \\sum d_i b_i$, then $\\sum (c_i - d_i) b_i = 0$, which by independence forces $c_i = d_i$.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Orthogonality is irrelevant to uniqueness. Coordinates are unique for any basis.' },
            { choice: 'C' as const, why: 'Orthonormality makes coordinates *easier to compute* (inner-product formula), but does not affect existence or uniqueness.' },
            { choice: 'D' as const, why: 'Coordinates exist and are unique for any finite-dimensional vector space, not just $\\mathbb{R}^n$.' },
            { choice: 'E' as const, why: 'Confuses "different bases give different coordinates" (true) with "the same basis gives different coordinates" (false). With a fixed basis, coordinates are unique.' },
          ],
        },
      },
      {
        id: 'P-4.2c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A student claims: "If I change the basis for a vector space $V$, the vectors themselves change." Which response best addresses this claim?',
        choices: [
          { label: 'A' as const, body: 'The claim is correct — changing the basis transforms all vectors in the space.' },
          { label: 'B' as const, body: 'The claim is incorrect — vectors exist independently of basis; only their coordinate representations change.' },
          { label: 'C' as const, body: 'The claim is correct for some vectors but not others, depending on whether they are in the span of both bases.' },
          { label: 'D' as const, body: 'The claim is correct only when the change of basis matrix is orthogonal.' },
          { label: 'E' as const, body: 'The claim is partially correct — abstract vectors don\'t change, but since we can only work with coordinates, it\'s effectively the same as the vectors changing.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Vectors in a vector space exist as abstract objects independent of any coordinate system. When we change basis, we are changing our "measurement system" or "perspective," but the vectors themselves remain unchanged. Only their numerical descriptions (coordinates) change. Analogy: a mountain\'s height does not change whether we measure it in feet or meters.',
          partialCredit: '(E) earns partial credit. It shows understanding that vectors are abstract, but conflates the practical situation (we usually work with coordinates) with the conceptual point (vectors are basis-independent).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'A fundamental misconception. Vectors and their coordinate representations are different things.' },
            { choice: 'C' as const, why: 'Confuses span with basis change. Every vector in $V$ has a representation in any basis of $V$ — the basis change applies to all of them, not just some.' },
            { choice: 'D' as const, why: 'Orthogonality is irrelevant to this conceptual point. The vectors are basis-independent regardless of whether the change-of-basis matrix is orthogonal.' },
            { choice: 'E' as const, why: 'Conflates the representation with the object. Earns partial credit.' },
          ],
        },
      },
      {
        id: 'P-4.2d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $V$ be a 3-dimensional vector space with basis $\\mathcal{B} = \\{b_1, b_2, b_3\\}$. Three vectors in $V$ have coordinates $[u]_\\mathcal{B} = (1, 2, -1)^T$, $[v]_\\mathcal{B} = (3, 0, 1)^T$, $[w]_\\mathcal{B} = (4, 2, 0)^T$. Which statement about $\\{u, v, w\\}$ is correct?',
        choices: [
          { label: 'A' as const, body: 'They are linearly independent because $V$ is 3-dimensional and we have exactly 3 vectors.' },
          { label: 'B' as const, body: 'Whether they are dependent or independent cannot be determined without knowing $\\mathcal{B}$ explicitly.' },
          { label: 'C' as const, body: 'They are linearly independent because $\\mathcal{B}$ is a basis.' },
          { label: 'D' as const, body: 'They are linearly dependent because $[w]_\\mathcal{B} = [u]_\\mathcal{B} + [v]_\\mathcal{B}$.' },
          { label: 'E' as const, body: 'None of the above.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'The coordinate map $v \\mapsto [v]_\\mathcal{B}$ is a linear isomorphism. Linear isomorphisms preserve linear independence and dependence — every linear relation among vectors in $V$ is faithfully reflected in their coordinate vectors. Compute: $(1, 2, -1) + (3, 0, 1) = (4, 2, 0) = [w]_\\mathcal{B}$. So $u + v = w$ in $V$, regardless of what $\\mathcal{B}$ is. The set is linearly dependent.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Having $n$ vectors in an $n$-dimensional space is necessary for a basis but not sufficient for independence. Three coplanar vectors in $\\mathbb{R}^3$ can be dependent.' },
            { choice: 'B' as const, why: 'The coordinate isomorphism means linear independence can be settled from coordinates alone. The specific basis $\\mathcal{B}$ is irrelevant to the dependence question.' },
            { choice: 'C' as const, why: 'Reduces "linear independence" to "$\\mathcal{B}$ is a basis." But $\\mathcal{B}$ being a basis only ensures that coordinates exist and are unique — not that any specific set of vectors is independent.' },
            { choice: 'E' as const, why: '(D) is correct.' },
          ],
        },
      },
    ],
  },
};
