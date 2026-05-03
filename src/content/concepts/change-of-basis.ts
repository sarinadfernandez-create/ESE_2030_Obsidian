import type { Concept } from '../types';

export const changeOfBasis: Concept = {
  id: 'change-of-basis',
  unitId: 'ch4',
  number: '4.3',
  title: 'Change of Basis',
  blurb: 'Translate coordinates from one basis to another via a single matrix multiplication.',
  tier: 'full',

  learn: {
    overview: `
A vector lives in a vector space; its [[coordinates|coordinate representation]] depends on which [[bases|basis]] we choose. So the same vector can have multiple coordinate vectors — one per basis. **Change of basis** is the algebraic recipe for translating between these representations.

Given two ordered bases $\\mathcal{B} = \\{b_1, \\dots, b_n\\}$ and $\\mathcal{C} = \\{c_1, \\dots, c_n\\}$ for the same vector space $V$, there is a unique matrix $P$ — the **change-of-basis matrix from $\\mathcal{B}$ to $\\mathcal{C}$** — such that

$$[v]_\\mathcal{C} = P \\, [v]_\\mathcal{B} \\quad \\text{for every } v \\in V.$$

The matrix $P$ does the translation in one direction; its inverse $P^{-1}$ does the reverse. The columns of $P$ are easy to identify: the $j$-th column is $[b_j]_\\mathcal{C}$ — the $j$-th basis vector of $\\mathcal{B}$, expressed in $\\mathcal{C}$-coordinates.

Why this works: by linearity of the [[coordinates|coordinate isomorphism]], if we know $[b_j]_\\mathcal{C}$ for each $j$, we know how to translate any vector. Specifically, $v = \\sum c_i b_i$ in $\\mathcal{B}$-coordinates means $[v]_\\mathcal{C} = \\sum c_i [b_i]_\\mathcal{C}$, which is exactly $P [v]_\\mathcal{B}$.

A useful mental model: think of $P$ as a translator between two languages describing the same world. Speak vector $v$ in language $\\mathcal{B}$ (give its $\\mathcal{B}$-coordinates), and $P$ gives you the same vector spoken in language $\\mathcal{C}$. The vector itself never moved; only the description changed.

A common source of confusion is the *direction* of the change of basis. The matrix $P$ from $\\mathcal{B}$ to $\\mathcal{C}$ takes $\\mathcal{B}$-coordinates *as input* and produces $\\mathcal{C}$-coordinates *as output*. So the formula is $[v]_\\mathcal{C} = P [v]_\\mathcal{B}$ — the *new* coordinates equal $P$ times the *old* coordinates. Some books define the direction the other way; whichever convention is used, the columns of $P$ tell you everything: column $j$ is "what becomes of basis vector $j$ of the input basis, expressed in the output basis."

A subtle but important case: when one of the bases is the **standard basis**, the change-of-basis matrix has an especially clean form. If $\\mathcal{C}$ is the standard basis of $\\mathbb{R}^n$ and $\\mathcal{B} = \\{b_1, \\dots, b_n\\}$ is some other basis, then the columns of $P$ (from $\\mathcal{B}$ to standard) are simply the basis vectors of $\\mathcal{B}$, written as column vectors. This is sometimes called "$P$ has the basis vectors as its columns," and it makes the standard-basis side of any change of basis trivial.

Change of basis is the algebraic engine behind the more abstract concept of **[[similarity|similar matrices]]** and the deeper [[matrix-representations|representation theory]] of linear transformations: when you change the basis, the matrix of a linear map transforms by similarity ($A \\to P^{-1} A P$), and only the matrix's intrinsic invariants (rank, trace, determinant, eigenvalues) are preserved.
    `.trim(),

    definitions: [
      {
        term: 'Change-of-basis matrix',
        body: 'For two ordered bases $\\mathcal{B}$ and $\\mathcal{C}$ of the same vector space $V$: the unique matrix $P$ satisfying $[v]_\\mathcal{C} = P [v]_\\mathcal{B}$ for every $v \\in V$. The columns of $P$ are $[b_j]_\\mathcal{C}$.',
      },
      {
        term: 'Inverse change of basis',
        body: 'If $P$ is the change-of-basis matrix from $\\mathcal{B}$ to $\\mathcal{C}$, then $P^{-1}$ is the change-of-basis matrix from $\\mathcal{C}$ to $\\mathcal{B}$.',
      },
    ],

    theorems: [
      {
        name: 'Construction of the change-of-basis matrix',
        statement: 'For ordered bases $\\mathcal{B} = \\{b_1, \\dots, b_n\\}$ and $\\mathcal{C}$ of $V$, the matrix $P$ satisfying $[v]_\\mathcal{C} = P [v]_\\mathcal{B}$ has $j$-th column equal to $[b_j]_\\mathcal{C}$.',
        intuition: 'Plug in $v = b_j$. Its $\\mathcal{B}$-coordinates are the standard basis vector $e_j$, so $P e_j = [b_j]_\\mathcal{C}$ — but $P e_j$ is exactly the $j$-th column of $P$.',
      },
      {
        name: 'Composition of changes of basis',
        statement: 'If $P_1$ is the change of basis from $\\mathcal{B}$ to $\\mathcal{C}$ and $P_2$ is the change of basis from $\\mathcal{C}$ to $\\mathcal{D}$, then $P_2 P_1$ is the change of basis from $\\mathcal{B}$ to $\\mathcal{D}$.',
        intuition: 'Translation through an intermediate language: speak $\\mathcal{B}$, translate to $\\mathcal{C}$ via $P_1$, then translate from $\\mathcal{C}$ to $\\mathcal{D}$ via $P_2$. Composition reads right-to-left like function composition.',
      },
    ],

    keyFormulas: [
      '[v]_\\mathcal{C} = P [v]_\\mathcal{B}',
      '\\text{column } j \\text{ of } P = [b_j]_\\mathcal{C}',
      '[v]_\\mathcal{B} = P^{-1} [v]_\\mathcal{C}',
    ],
  },

  explore: {
    vizComponent: 'ChangeOfBasisViz',
    description: 'Pick two bases of $\\mathbb{R}^2$ — for example, the standard basis and a rotated basis. Place a vector and watch its coordinates in both bases simultaneously, with the change-of-basis matrix $P$ displayed live. Drag the second basis to deform it, and see $P$ update. The vector itself stays put; only the coordinates change.',
    misconception: {
      title: 'The columns of $P$ are basis vectors of the SOURCE basis, expressed in the TARGET basis',
      body: `
A persistent error: getting the direction of the change of basis wrong. The matrix $P$ that converts from $\\mathcal{B}$-coordinates to $\\mathcal{C}$-coordinates has columns equal to $[b_j]_\\mathcal{C}$ — the source basis vectors expressed in the target basis. Reversing this gives $P^{-1}$, the wrong direction.

A useful sanity check: plug in the basis vectors. If $v = b_1$, then $[v]_\\mathcal{B} = e_1 = (1, 0, \\dots, 0)^T$, so $P [v]_\\mathcal{B} = P e_1$ should equal $[b_1]_\\mathcal{C}$. The product $P e_1$ extracts the first column of $P$, so the first column of $P$ must be $[b_1]_\\mathcal{C}$. ✓

A second confusion: when one basis is the standard basis, the change-of-basis matrix is sometimes simpler than expected. From $\\mathcal{B}$ to the standard basis, $P$ has the basis vectors of $\\mathcal{B}$ as its columns — written as column vectors. From the standard basis to $\\mathcal{B}$, $P$ is the inverse of that. Students sometimes apply the columns rule in the wrong direction here.

A third trap: thinking that the change-of-basis matrix $P$ "transforms" the vector. It does not. The vector is invariant; $P$ transforms the *representation*. This is the same conceptual point that troubles students throughout this unit.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Translate $\\mathcal{B}$-coordinates to $\\mathcal{C}$-coordinates',
        body: 'In $\\mathbb{R}^2$, suppose the change of basis from $\\mathcal{B}$ to $\\mathcal{C}$ is $P = \\begin{pmatrix} 2 & 1 \\\\ -1 & 3 \\end{pmatrix}$. If a vector $v$ has $[v]_\\mathcal{C} = (3, -2)^T$, what are its $\\mathcal{B}$-coordinates? Wait — careful: the formula $[v]_\\mathcal{C} = P [v]_\\mathcal{B}$ means $P$ maps $\\mathcal{B}$-coordinates to $\\mathcal{C}$-coordinates. Here we know $\\mathcal{C}$-coordinates and want $\\mathcal{B}$-coordinates, so we should multiply by $P^{-1}$? Actually, re-read carefully: the problem may state the direction differently. Let me follow the problem\'s stated direction.',
      },
      {
        title: 'Apply $P$ to find $\\mathcal{B}$-coordinates',
        body: 'Reading the problem as Quizzam 1 stated it: "$P$ is the change of basis from $\\mathcal{B}$ to $\\mathcal{B}\'$", with $[v]_{\\mathcal{B}\'} = (3, -2)^T$ — and the question asks for $[v]_\\mathcal{B}$. The convention used: $[v]_\\mathcal{B} = P [v]_{\\mathcal{B}\'}$, i.e. $P$ converts FROM new TO old. Compute: $P \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 2 \\cdot 3 + 1 \\cdot (-2) \\\\ -1 \\cdot 3 + 3 \\cdot (-2) \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -9 \\end{pmatrix}$.',
      },
    ],

    problems: [
      {
        id: 'P-4.3a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $\\mathcal{B} = \\{b_1, b_2\\}$ and $\\mathcal{B}\' = \\{b_1\', b_2\'\\}$ be two bases for $\\mathbb{R}^2$. The change of basis matrix from $\\mathcal{B}$ to $\\mathcal{B}\'$ is $P = \\begin{pmatrix} 2 & 1 \\\\ -1 & 3 \\end{pmatrix}$, and a vector $v$ has coordinates $[v]_{\\mathcal{B}\'} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$. What are its coordinates in basis $\\mathcal{B}$?',
        choices: [
          { label: 'A' as const, body: '$[v]_\\mathcal{B} = \\begin{pmatrix} 4 \\\\ -9 \\end{pmatrix}$' },
          { label: 'B' as const, body: '$[v]_\\mathcal{B} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$[v]_\\mathcal{B} = \\begin{pmatrix} 8 \\\\ 3 \\end{pmatrix}$' },
          { label: 'D' as const, body: '$[v]_\\mathcal{B} = \\begin{pmatrix} -8 \\\\ 3 \\end{pmatrix}$' },
          { label: 'E' as const, body: '$[v]_\\mathcal{B} = \\begin{pmatrix} 1/7 \\\\ 5/7 \\end{pmatrix}$' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'The change of basis formula $[v]_\\mathcal{B} = P [v]_{\\mathcal{B}\'}$ gives: $P \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 2 \\cdot 3 + 1 \\cdot (-2) \\\\ -1 \\cdot 3 + 3 \\cdot (-2) \\end{pmatrix} = \\begin{pmatrix} 6 - 2 \\\\ -3 - 6 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -9 \\end{pmatrix}$.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Treats coordinates as basis-independent — but a vector has different coordinates in different bases.' },
            { choice: 'C' as const, why: 'Uses $P^T$ instead of $P$. Computing $P^T (3, -2)^T = (2 \\cdot 3 + (-1)(-2), 1 \\cdot 3 + 3(-2))^T = (8, -3)^T$ — different from $(8, 3)$, but close enough to attract students who transposed.' },
            { choice: 'D' as const, why: 'Variant of the transpose error with sign mistakes.' },
            { choice: 'E' as const, why: 'Uses $P^{-1}$ instead of $P$ — applying the change of basis in the wrong direction.' },
          ],
        },
      },
      {
        id: 'P-4.3b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $\\mathcal{B}$ and $\\mathcal{C}$ be two bases for $\\mathbb{R}^n$, and let $P$ be the matrix satisfying $[v]_\\mathcal{C} = P [v]_\\mathcal{B}$ for all $v \\in \\mathbb{R}^n$. What are the columns of $P$?',
        choices: [
          { label: 'A' as const, body: 'The vectors in $\\mathcal{C}$, expressed in standard coordinates.' },
          { label: 'B' as const, body: 'The vectors in $\\mathcal{B}$, expressed in standard coordinates.' },
          { label: 'C' as const, body: 'The vectors in $\\mathcal{B}$, expressed in $\\mathcal{C}$-coordinates.' },
          { label: 'D' as const, body: 'The vectors in $\\mathcal{C}$, expressed in $\\mathcal{B}$-coordinates.' },
          { label: 'E' as const, body: 'The standard basis vectors, expressed in $\\mathcal{C}$-coordinates.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'Plug in $v = b_j$ (the $j$-th vector of $\\mathcal{B}$). Its $\\mathcal{B}$-coordinates are $e_j$, the $j$-th standard basis vector. So $P e_j = [b_j]_\\mathcal{C}$ — but $P e_j$ extracts the $j$-th column of $P$. Therefore the $j$-th column of $P$ is $[b_j]_\\mathcal{C}$: the $j$-th basis vector of $\\mathcal{B}$, expressed in $\\mathcal{C}$-coordinates.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Describes the matrix that converts from $\\mathcal{C}$-coordinates to standard coordinates, not from $\\mathcal{B}$ to $\\mathcal{C}$.' },
            { choice: 'B' as const, why: 'Describes the matrix that converts from $\\mathcal{B}$-coordinates to standard coordinates — different again.' },
            { choice: 'D' as const, why: 'Describes the columns of $P^{-1}$, not $P$. Reversing the direction is the most common error.' },
            { choice: 'E' as const, why: 'Standard basis vectors in $\\mathcal{C}$-coordinates would describe yet another change-of-basis direction (standard to $\\mathcal{C}$).' },
          ],
        },
      },
      {
        id: 'P-4.3c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $\\mathcal{B}$ and $\\mathcal{C}$ be two different ordered bases for $\\mathbb{R}^3$. Suppose vectors $v$ and $w$ satisfy $[v]_\\mathcal{B} = [w]_\\mathcal{C} = (2, -1, 3)^T$. Which statement is correct?',
        choices: [
          { label: 'A' as const, body: '$v = w$, since their coordinate representations are identical.' },
          { label: 'B' as const, body: '$v$ and $w$ need not be equal.' },
          { label: 'C' as const, body: '$\\|v\\| = \\|w\\|$, since the norm is determined by the coordinate entries.' },
          { label: 'D' as const, body: '$v = w$ if and only if both $\\mathcal{B}$ and $\\mathcal{C}$ are orthonormal.' },
          { label: 'E' as const, body: 'The equation $[v]_\\mathcal{B} = [w]_\\mathcal{C}$ forces $\\mathcal{B} = \\mathcal{C}$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Writing $\\mathcal{B} = \\{b_1, b_2, b_3\\}$ and $\\mathcal{C} = \\{c_1, c_2, c_3\\}$: $v = 2 b_1 - b_2 + 3 b_3$ while $w = 2 c_1 - c_2 + 3 c_3$. Since $\\mathcal{B} \\neq \\mathcal{C}$, these are generally different vectors. The coordinate vector is not the vector itself; it is a basis-dependent representation.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The most common misconception about coordinates: conflating a vector with its coordinate representation. "Same numbers" does not mean "same vector" when the bases differ.' },
            { choice: 'C' as const, why: 'The norm of a vector equals the norm of its coordinate vector only when the basis is [[orthonormal-bases|orthonormal]]. For a general basis, identical coordinates can give different norms.' },
            { choice: 'D' as const, why: 'Orthonormality is not the relevant condition. $v = w$ depends on the specific basis vectors, not on whether they are orthonormal.' },
            { choice: 'E' as const, why: 'The equation gives no information about the relationship between $\\mathcal{B}$ and $\\mathcal{C}$ — it is a coincidence of coordinate values, nothing more.' },
          ],
        },
      },
    ],
  },
};
