import type { Concept } from '../types';

export const orthogonalTransformations: Concept = {
  id: 'orthogonal-transformations',
  unitId: 'ch5',
  number: '5.6',
  title: 'Orthogonal Transformations',
  blurb: 'Linear transformations that preserve lengths, angles, and inner products — rigid motions of inner product spaces.',
  tier: 'full',

  learn: {
    overview: `
An **orthogonal transformation** is a [[linear-transformation-defs|linear transformation]] $T: V \\to V$ on an inner product space that preserves the inner product:

$$\\langle T(u), T(v) \\rangle = \\langle u, v \\rangle \\quad \\text{for all } u, v \\in V.$$

This single condition is enormously consequential. Once $T$ preserves inner products, it automatically preserves *lengths* ($\\|T(v)\\|^2 = \\langle T(v), T(v) \\rangle = \\langle v, v \\rangle = \\|v\\|^2$) and *angles* ($\\cos\\theta = \\langle T(u), T(v) \\rangle / (\\|T(u)\\| \\|T(v)\\|)$ matches the angle in the original). Orthogonal transformations are the "rigid motions" of inner product spaces — geometry-preserving in every metric sense.

Equivalent characterizations of orthogonal transformations (for finite-dimensional $V$):

1. **Inner-product preservation**: $\\langle T(u), T(v) \\rangle = \\langle u, v \\rangle$ for all $u, v$.
2. **Length preservation**: $\\|T(v)\\| = \\|v\\|$ for all $v$.
3. **Adjoint = inverse**: $T^* T = I$ (and $T T^* = I$ for finite-dimensional, square cases).
4. **Orthonormal-basis preservation**: $T$ maps any orthonormal basis to another orthonormal basis.

Each of these implies the others. Length preservation is the simplest to check; it implies inner-product preservation via the polarization identity $\\langle u, v \\rangle = \\frac{1}{4}(\\|u + v\\|^2 - \\|u - v\\|^2)$.

For matrices in [[orthonormal-bases|standard orthonormal coordinates]], the orthogonality condition becomes $Q^T Q = I$. A square matrix satisfying this is called an **orthogonal matrix**. Orthogonal matrices have several characteristic properties:

- $Q^{-1} = Q^T$ (the inverse is the transpose).
- The columns of $Q$ form an [[orthonormal-bases|orthonormal basis]] of $\\mathbb{R}^n$.
- The rows of $Q$ also form an orthonormal basis of $\\mathbb{R}^n$.
- $\\det(Q) = \\pm 1$. Determinant $+1$ corresponds to **rotations** (orientation-preserving); determinant $-1$ corresponds to **reflections** (orientation-reversing).
- All entries of $Q$ are bounded: $|Q_{ij}| \\leq 1$.

The set of orthogonal $n \\times n$ matrices forms a group under multiplication, called $O(n)$. The subgroup with determinant $+1$ is $SO(n)$, the **special orthogonal group** — the rotations. These groups are central to physics, robotics, and geometry: they describe symmetries of Euclidean space, rotational motions of rigid bodies, and changes between [[orthonormal-bases|orthonormal coordinate systems]].

Two important examples in low dimensions: $O(2)$ consists of $2 \\times 2$ rotations $R_\\theta$ (det $= +1$) and reflections (det $= -1$). $O(3)$ includes 3D rotations (about an axis through the origin) and reflections (across a plane through the origin), plus their composites. Higher dimensions admit additional structure, but the $\\det = \\pm 1$ dichotomy persists.

Products of orthogonal matrices are orthogonal: if $P^T P = I$ and $Q^T Q = I$, then $(PQ)^T (PQ) = Q^T P^T P Q = Q^T I Q = I$. The group structure is what makes composition of rigid motions still a rigid motion — a crucial fact in robotics, where chained rotations must remain rotations.

Orthogonal transformations also play a leading role in [[qr-decomposition|QR decomposition]] (where $Q$ is orthogonal), the [[svd-form|SVD]] (where left and right singular bases are orthonormal, encoded by orthogonal matrices), and the [[principal-components|spectral theorem]] (where symmetric matrices are diagonalized by orthogonal change of basis). The recurring theme: when you can change basis via an orthogonal transformation, you preserve all the geometric structure while gaining algebraic simplicity.
    `.trim(),

    definitions: [
      {
        term: 'Orthogonal transformation',
        body: 'A linear $T: V \\to V$ on an inner product space that preserves the inner product: $\\langle T(u), T(v) \\rangle = \\langle u, v \\rangle$ for all $u, v$.',
      },
      {
        term: 'Orthogonal matrix',
        body: 'A square matrix $Q$ with $Q^T Q = I$. Equivalently, the matrix of an orthogonal transformation in standard orthonormal coordinates.',
      },
      {
        term: 'Special orthogonal group $SO(n)$',
        body: 'The group of orthogonal $n \\times n$ matrices with determinant $+1$. The rotations. A subgroup of $O(n)$ of index 2.',
      },
    ],

    theorems: [
      {
        name: 'Equivalent definitions of orthogonality',
        statement: 'For a linear $T: V \\to V$ on a finite-dimensional inner product space, the following are equivalent: (i) $\\langle T(u), T(v) \\rangle = \\langle u, v \\rangle$ for all $u, v$; (ii) $\\|T(v)\\| = \\|v\\|$ for all $v$; (iii) $T^* T = I$; (iv) $T$ maps every orthonormal basis to an orthonormal basis.',
        intuition: 'Length preservation is the easiest to check; it implies inner-product preservation by the polarization identity, which writes the inner product as a combination of norms. Each implies the others by a chain of straightforward arguments.',
      },
      {
        name: 'Orthogonal matrices have $\\det = \\pm 1$',
        statement: 'For an orthogonal matrix $Q$: $\\det(Q) = \\pm 1$.',
        intuition: 'From $Q^T Q = I$: $\\det(Q^T) \\det(Q) = \\det(I) = 1$. Since $\\det(Q^T) = \\det(Q)$, we have $\\det(Q)^2 = 1$, so $\\det(Q) = \\pm 1$. Determinant $+1$ corresponds to rotations; $-1$ to reflections.',
      },
      {
        name: 'Products of orthogonal matrices are orthogonal',
        statement: 'If $P$ and $Q$ are orthogonal $n \\times n$ matrices, then so is $PQ$.',
        intuition: '$(PQ)^T (PQ) = Q^T P^T P Q = Q^T I Q = Q^T Q = I$. The group structure is preserved by composition — chaining rigid motions gives a rigid motion.',
      },
    ],

    keyFormulas: [
      'Q^T Q = I',
      'Q^{-1} = Q^T',
      '\\det(Q) = \\pm 1',
      '\\|Q x\\| = \\|x\\|',
      '\\langle Qx, Qy \\rangle = \\langle x, y \\rangle',
    ],
  },

  explore: {
    vizComponent: 'OrthogonalTransformViz',
    description: 'Pick a $2 \\times 2$ matrix and watch the viz check whether it is orthogonal: $Q^T Q = I$? The viz shows the action on the unit circle (which becomes the unit circle again iff $Q$ is orthogonal) and reports the determinant. Toggle between rotations ($\\det = +1$) and reflections ($\\det = -1$) to see both cases. Then try non-orthogonal matrices (e.g., shears, scalings) to see the unit circle deform into an ellipse.',
    misconception: {
      title: 'Orthogonal matrices have $\\det = \\pm 1$, not always $+1$',
      body: `
A common error is conflating "orthogonal" with "rotation." All rotations are orthogonal, but not all orthogonal transformations are rotations — reflections are orthogonal too, and they have $\\det = -1$.

A specific consequence: questions of the form "which property MUST an orthogonal matrix have?" sometimes list "$\\det(Q) = 1$" as a candidate. This is wrong — only $\\det(Q) = \\pm 1$ is guaranteed. The $+1$ subset is the rotations $SO(n)$; the $-1$ subset is the orientation-reversing orthogonal transformations (which include reflections).

A second misconception: thinking orthogonal matrices have entries bounded by some specific value other than $1$. The bound is $|Q_{ij}| \\leq 1$ — the entries are component values of unit vectors. This is true for all orthogonal matrices regardless of dimension.

A third trap: thinking that the property "preserves angles" means orthogonal. Many transformations preserve angles without preserving lengths — for example, scalar multiplications $x \\mapsto cx$ for $c \\neq 0$. These are called **conformal**, and they form a strictly larger class than orthogonal transformations. Orthogonal transformations preserve both lengths AND angles; conformal transformations preserve only angles. Length-preserving by itself is what makes a transformation orthogonal.

A fourth misconception: thinking that the columns of an orthogonal matrix are merely orthogonal (not orthonormal). They must be both — pairwise orthogonal AND each unit-length. The condition $Q^T Q = I$ encodes both: the off-diagonal entries of $Q^T Q$ being zero gives orthogonality, and the diagonal entries being $1$ gives unit length.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify the orthogonality of a rotation matrix',
        body: 'For $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$: compute $R_\\theta^T R_\\theta = \\begin{pmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{pmatrix} \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix} = \\begin{pmatrix} \\cos^2 + \\sin^2 & 0 \\\\ 0 & \\sin^2 + \\cos^2 \\end{pmatrix} = I$. ✓ So $R_\\theta$ is orthogonal. And $\\det(R_\\theta) = \\cos^2 + \\sin^2 = 1$, confirming it is a rotation.',
      },
    ],

    problems: [
      {
        id: 'P-5.6a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A linear transformation $T: \\mathbb{R}^3 \\to \\mathbb{R}^3$ satisfies $\\langle T(u), T(v) \\rangle = \\langle u, v \\rangle$ for all $u, v$. What does $T$ preserve?',
        choices: [
          { label: 'A' as const, body: 'Angles between vectors only.' },
          { label: 'B' as const, body: 'Lengths of vectors only.' },
          { label: 'C' as const, body: 'Both lengths and angles.' },
          { label: 'D' as const, body: 'Orthogonality of vectors only.' },
          { label: 'E' as const, body: 'The sum of vector components.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'Inner-product preservation implies length preservation ($\\|T(v)\\|^2 = \\langle T(v), T(v) \\rangle = \\langle v, v \\rangle = \\|v\\|^2$) and angle preservation ($\\cos\\theta = \\langle u, v \\rangle / (\\|u\\| \\|v\\|)$, with both numerator and denominator preserved). So both lengths and angles are preserved. Orthogonal transformations are exactly the "rigid motions" of inner product spaces.',
          partialCredit: '(A) and (B) are partially correct — each captures one of the two properties.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Angles are preserved, but so are lengths. Earns partial credit.' },
            { choice: 'B' as const, why: 'Lengths are preserved, but so are angles. Earns partial credit.' },
            { choice: 'D' as const, why: 'Orthogonality is one consequence (it follows from preserving the inner product, which generalizes orthogonality). But the full preservation is broader — all inner-product values are preserved.' },
            { choice: 'E' as const, why: 'Component sums are not preserved by general orthogonal transformations. Rotations and reflections move components around.' },
          ],
        },
      },
      {
        id: 'P-5.6b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Let $Q$ be a $3 \\times 3$ orthogonal matrix. Which of the following properties must $Q$ possess?',
        choices: [
          { label: 'A' as const, body: 'All entries of $Q$ are between $-1$ and $1$.' },
          { label: 'B' as const, body: 'The columns of $Q$ form an orthonormal set.' },
          { label: 'C' as const, body: '$Q$ is symmetric ($Q^T = Q$).' },
          { label: 'D' as const, body: 'The determinant of $Q$ is $1$.' },
          { label: 'E' as const, body: '$Q^T Q = Q Q^T = Q^2$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'By definition, an orthogonal matrix has $Q^T Q = I$, which says exactly that the columns of $Q$ are pairwise orthogonal and each unit-length — that is, orthonormal. The other listed properties are not generally true.',
          partialCredit: '(A) is true (a consequence of unit-length columns) but is not the *defining* property — earns partial credit.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'True for orthogonal matrices but not the defining property. Earns partial credit.' },
            { choice: 'C' as const, why: 'Only special orthogonal matrices are symmetric (e.g., $I$, reflections through the origin). Most orthogonal matrices are not symmetric — for instance, $R_{90°} \\neq R_{90°}^T$.' },
            { choice: 'D' as const, why: 'Reflections have $\\det = -1$, so $\\det(Q) = +1$ is NOT guaranteed for orthogonal matrices in general — only $\\det(Q) = \\pm 1$.' },
            { choice: 'E' as const, why: '$Q^T Q = I$, but $Q^2$ is generally not $I$ unless $Q$ is also symmetric (so that $Q^2 = Q^T Q$). The identity confuses two different things.' },
          ],
        },
      },
      {
        id: 'P-5.6c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $P$ and $Q$ be two $n \\times n$ orthogonal matrices. Which of the following matrices must also be orthogonal?',
        choices: [
          { label: 'A' as const, body: '$P + Q$' },
          { label: 'B' as const, body: '$PQ$' },
          { label: 'C' as const, body: '$P^{-1} Q^T$' },
          { label: 'D' as const, body: '$2P$' },
          { label: 'E' as const, body: 'Both (B) and (C).' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'Products and certain compositions of orthogonal matrices are orthogonal. (B) $PQ$: $(PQ)^T (PQ) = Q^T P^T P Q = Q^T Q = I$. ✓ (C) $P^{-1} Q^T = P^T Q^T = (QP)^T$, which is the transpose of an orthogonal matrix and hence also orthogonal. ✓ Both are orthogonal, so (E).',
          partialCredit: '(B) and (C) individually each earn partial credit — they are correct but incomplete.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Sums of orthogonal matrices are generally NOT orthogonal. For example, $I + I = 2I$, but $(2I)^T (2I) = 4I \\neq I$.' },
            { choice: 'B' as const, why: 'Correct, but (E) is more complete. Earns partial credit.' },
            { choice: 'C' as const, why: 'Correct, but (E) is more complete. Earns partial credit.' },
            { choice: 'D' as const, why: 'Scaling an orthogonal matrix destroys the unit length of its columns. $(2P)^T (2P) = 4 P^T P = 4 I \\neq I$.' },
          ],
        },
      },
      {
        id: 'P-5.6d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $Q$ be an $n \\times n$ orthogonal matrix. Which of the following is NOT guaranteed to be true?',
        choices: [
          { label: 'A' as const, body: '$\\|Q x\\| = \\|x\\|$ for all $x \\in \\mathbb{R}^n$.' },
          { label: 'B' as const, body: '$\\det(Q) = 1$.' },
          { label: 'C' as const, body: 'The rows of $Q$ form an orthonormal set.' },
          { label: 'D' as const, body: '$Q^{-1} = Q^T$.' },
          { label: 'E' as const, body: '$\\langle Q x, Q y \\rangle = \\langle x, y \\rangle$ for all $x, y$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'From $Q^T Q = I$, we get $(\\det Q)^2 = \\det(Q^T) \\det(Q) = \\det(I) = 1$, so $\\det(Q) = \\pm 1$. Reflections are orthogonal and have $\\det = -1$, so $\\det(Q) = +1$ is NOT guaranteed.',
          partialCredit: '(C) is sometimes flagged as uncertain by students who memorize "the columns are orthonormal" without remembering "the rows are too." It IS guaranteed (since $Q^T Q = I$ for square $Q$ implies $Q Q^T = I$ as well), but flagging this property shows partial understanding.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Length preservation IS guaranteed: $\\|Qx\\|^2 = (Qx)^T (Qx) = x^T Q^T Q x = x^T x = \\|x\\|^2$.' },
            { choice: 'C' as const, why: '$Q^T Q = I$ implies $Q Q^T = I$ for square $Q$, which means the rows are orthonormal too. Earns partial credit if flagged as uncertain — shows incomplete understanding.' },
            { choice: 'D' as const, why: 'This is the defining property restated.' },
            { choice: 'E' as const, why: 'Inner-product preservation IS guaranteed: $\\langle Qx, Qy \\rangle = (Qx)^T(Qy) = x^T Q^T Q y = x^T y = \\langle x, y \\rangle$.' },
          ],
        },
      },
    ],
  },
};
