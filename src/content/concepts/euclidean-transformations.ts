import type { Concept } from '../types';

export const euclideanTransformations: Concept = {
  id: 'euclidean-transformations',
  unitId: 'ch3',
  number: '3.1',
  title: 'Euclidean Transformations',
  blurb: 'The geometric building blocks: scaling, rotation, and shear in the plane.',
  tier: 'full',

  learn: {
    overview: `
Before the abstract definition of a [[linear-transformation-defs|linear transformation]] arrives, it is worth seeing the simplest concrete examples — geometric transformations of the plane that are linear in the technical sense and intuitive in the visual sense. Three families of such transformations are foundational: **scaling**, **rotation**, and **shear**. Together they generate, by composition, almost every plane transformation that comes up in graphics, robotics, and signal processing.

A **scaling** transformation stretches or compresses the plane uniformly along its coordinate axes. A scaling that multiplies the $x$-component by $a$ and the $y$-component by $b$ is represented by the diagonal [[special-matrices|matrix]] $\\begin{pmatrix} a & 0 \\\\ 0 & b \\end{pmatrix}$. Uniform scalings ($a = b$) preserve angles; non-uniform scalings ($a \\neq b$) distort circles into ellipses.

A **rotation** rotates every vector by a fixed angle $\\theta$ about the origin. The rotation matrix is $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$. Rotations preserve both lengths and angles — they are [[orthogonal-transformations|orthogonal transformations]], and the columns of $R_\\theta$ form an [[orthonormal-bases|orthonormal basis]] of $\\mathbb{R}^2$.

A **shear** slides points parallel to one axis by an amount proportional to their distance from that axis. A horizontal shear by factor $k$ sends $(x, y)$ to $(x + ky, y)$, with matrix $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$. Shears preserve area but not angles or lengths.

These three families are the geometric atoms from which much of computer graphics is built. The key observation is that all three are **linear** — they preserve sums and scalar multiples — and so they are all matrix transformations. The matrices encode the geometry, and matrix multiplication encodes composition: rotating then scaling is the same as multiplying the rotation and scaling matrices.

When transformations from these families are composed, more complex behaviors emerge. Rotation followed by non-uniform scaling produces a "squash-and-rotate" deformation. Rotation followed by shear produces a "tilt." [[change-of-basis|Change of basis]] tells us when two seemingly different transformations are actually the same transformation expressed in different coordinate systems — the algebra of [[similarity|similar matrices]] formalizes this.

Crucially, not every transformation of the plane is in this Euclidean family. **Translations** — shifts of the plane by a fixed vector — are *not* linear transformations because they do not fix the origin (they violate $T(0) = 0$). To handle translations alongside linear transformations in a unified framework, computer graphics uses [[computer-graphics|homogeneous coordinates]], embedding the plane in $\\mathbb{R}^3$ so that translation can be encoded as a matrix.
    `.trim(),

    definitions: [
      {
        term: 'Scaling',
        body: 'A linear transformation that multiplies each coordinate by a fixed scalar. In 2D: $T(x, y) = (ax, by)$, with matrix $\\begin{pmatrix} a & 0 \\\\ 0 & b \\end{pmatrix}$.',
      },
      {
        term: 'Rotation',
        body: 'A linear transformation that rotates every vector by a fixed angle $\\theta$ about the origin. Matrix: $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$.',
      },
      {
        term: 'Shear',
        body: 'A linear transformation that slides points parallel to one axis by an amount proportional to their distance from that axis. Horizontal shear matrix: $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$.',
      },
      {
        term: 'Reflection',
        body: 'A linear transformation that flips the plane across a line through the origin. Reflection across the $x$-axis: $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$. A special kind of [[orthogonal-transformations|orthogonal transformation]] with $\\det = -1$.',
      },
    ],

    theorems: [
      {
        name: 'Composition of Euclidean transformations',
        statement: 'If $T_1$ and $T_2$ are Euclidean transformations represented by matrices $A_1$ and $A_2$, the composition $T_2 \\circ T_1$ is represented by the product $A_2 A_1$.',
        intuition: 'Apply $T_1$ first (rightmost factor), then $T_2$ on the result. This matches the convention that linear transformations [[gaussian-elimination|left-multiply]] vectors, so composition corresponds to multiplying matrices in the same order operations are applied — last operation on the left.',
      },
      {
        name: 'Determinant and area',
        statement: 'For a 2D linear transformation with matrix $A$, $|\\det(A)|$ is the factor by which $A$ scales areas. $\\det(A) > 0$ preserves orientation; $\\det(A) < 0$ reverses it.',
        intuition: 'Rotations have $\\det = 1$ (preserve area and orientation). Reflections have $\\det = -1$ (preserve area, reverse orientation). Non-uniform scaling has $\\det = ab$ (scales by $|ab|$). Shears have $\\det = 1$ (preserve area despite distorting shape).',
      },
    ],

    keyFormulas: [
      'R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}',
      '\\text{shear}_x(k) = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}',
      '|\\det(A)| = \\text{area scaling factor}',
    ],
  },

  explore: {
    vizComponent: 'EuclideanTransformViz',
    description: 'Pick a transformation type — scaling, rotation, shear, or reflection — and watch its action on the unit square. Compose two transformations and see the matrix product produce the combined effect. The determinant updates live, showing area scaling and orientation. Try a rotation followed by a shear vs. a shear followed by a rotation: the results differ, illustrating that matrix multiplication is non-commutative.',
    misconception: {
      title: 'Translation is NOT a linear transformation',
      body: `
A persistent confusion: thinking that "rigid motions of the plane" — which include translations, rotations, and reflections — are all linear transformations. They are not. Translations violate the most basic linearity requirement: they do not fix the origin. If $T(x) = x + v_0$ for some fixed nonzero vector $v_0$, then $T(0) = v_0 \\neq 0$, so $T$ is not linear.

Linear transformations always send the origin to the origin. They always send the line through any two vectors $u$ and $v$ to the line through $T(u)$ and $T(v)$. They cannot "shift" anything off-center.

The way to handle translations alongside linear transformations is **homogeneous coordinates** — embed $\\mathbb{R}^2$ as the plane $z = 1$ in $\\mathbb{R}^3$, and represent translations as $3 \\times 3$ matrices acting on the augmented coordinate. This is the standard trick in [[computer-graphics|computer graphics]] and [[robotic-kinematics|robotic kinematics]]. But the underlying point is structural: in pure linear algebra, translations are *affine* transformations, not linear ones.

A second confusion: thinking matrix multiplication is commutative because the underlying transformations seem similar. It is not. Rotation by $90°$ followed by horizontal shear gives a different result than shear followed by rotation, and the matrix products $R_{90°} \\cdot S_k$ and $S_k \\cdot R_{90°}$ are correspondingly different. Order matters in geometric transformations, just as in matrix algebra.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compose a rotation and a scaling',
        body: 'Rotate by $90°$ counterclockwise, then scale $x$ by $2$ and $y$ by $3$. The rotation matrix is $R_{90} = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$, and the scaling matrix is $S = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$.',
      },
      {
        title: 'Multiply in the right order',
        body: 'Composition is $S \\circ R_{90}$, which corresponds to $S \\cdot R_{90} = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix} \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & -2 \\\\ 3 & 0 \\end{pmatrix}$.',
      },
      {
        title: 'Verify on the basis vectors',
        body: 'Apply to $e_1 = (1, 0)$: rotation sends it to $(0, 1)$, then scaling sends that to $(0, 3)$. The composition matrix says $(0, 3)$ — match. Apply to $e_2 = (0, 1)$: rotation sends it to $(-1, 0)$, scaling sends that to $(-2, 0)$. The composition matrix says $(-2, 0)$ — match.',
      },
    ],

    problems: [
      {
        id: 'P-3.1a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Which of the following transformations $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ is linear?',
        choices: [
          { label: 'A' as const, body: '$T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x + 1 \\\\ y \\end{pmatrix}$' },
          { label: 'B' as const, body: '$T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} xy \\\\ 0 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 2x - y \\\\ x + 3y \\end{pmatrix}$' },
          { label: 'D' as const, body: '$T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} |x| \\\\ y \\end{pmatrix}$' },
          { label: 'E' as const, body: '$T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x^2 \\\\ y^2 \\end{pmatrix}$' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'A linear transformation must satisfy $T(u + v) = T(u) + T(v)$ and $T(cu) = c T(u)$. (C) fits the form $T(x) = Ax$ with $A = \\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}$, so it is automatically linear. The others all fail at least one linearity axiom.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Translation by $(1, 0)$. Fails $T(0) = 0$ — applying it to $(0, 0)$ gives $(1, 0) \\neq (0, 0)$. Translations are affine, not linear.' },
            { choice: 'B' as const, why: 'The product $xy$ is nonlinear in the pair $(x, y)$. Fails additivity: $T((1,0) + (0,1)) = T(1,1) = (1, 0)$, but $T(1,0) + T(0,1) = (0, 0) + (0, 0) = (0, 0)$.' },
            { choice: 'D' as const, why: 'Absolute value violates homogeneity. $T(-1, 0) = (1, 0)$, but $-1 \\cdot T(1, 0) = -1 \\cdot (1, 0) = (-1, 0)$. The two are not equal.' },
            { choice: 'E' as const, why: 'Squaring is nonlinear. $T(2, 0) = (4, 0) \\neq 2 \\cdot T(1, 0) = 2 \\cdot (1, 0) = (2, 0)$.' },
          ],
        },
      },
      {
        id: 'P-3.1b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A horizontal shear with parameter $k = 2$ followed by a $90°$ counterclockwise rotation produces what overall matrix?',
        choices: [
          { label: 'A' as const, body: '$\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$' },
          { label: 'B' as const, body: '$\\begin{pmatrix} 0 & -1 \\\\ 1 & 2 \\end{pmatrix}$' },
          { label: 'C' as const, body: '$\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$' },
          { label: 'D' as const, body: '$\\begin{pmatrix} 2 & 1 \\\\ 1 & 0 \\end{pmatrix}$' },
          { label: 'E' as const, body: '$\\begin{pmatrix} 1 & -2 \\\\ 0 & 1 \\end{pmatrix}$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Composition is "shear then rotate," which corresponds to $R \\cdot S$ (rightmost matrix applied first). $R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$ and $S = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$. Compute $R S = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 0 \\cdot 1 + (-1) \\cdot 0 & 0 \\cdot 2 + (-1) \\cdot 1 \\\\ 1 \\cdot 1 + 0 \\cdot 0 & 1 \\cdot 2 + 0 \\cdot 1 \\end{pmatrix} = \\begin{pmatrix} 0 & -1 \\\\ 1 & 2 \\end{pmatrix}$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The shear matrix alone, ignoring the rotation.' },
            { choice: 'C' as const, why: 'The rotation matrix alone, ignoring the shear.' },
            { choice: 'D' as const, why: 'Computes $S \\cdot R$ instead of $R \\cdot S$ — the wrong order. This corresponds to "rotate then shear," not "shear then rotate."' },
            { choice: 'E' as const, why: 'A horizontal shear with $k = -2$. Wrong sign on the off-diagonal entry.' },
          ],
        },
      },
      {
        id: 'P-3.1c',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'For a $2 \\times 2$ rotation matrix $R_\\theta$, what is $\\det(R_\\theta)$?',
        choices: [
          { label: 'A' as const, body: '$0$' },
          { label: 'B' as const, body: '$1$' },
          { label: 'C' as const, body: '$-1$' },
          { label: 'D' as const, body: '$\\cos\\theta$' },
          { label: 'E' as const, body: '$\\sin^2\\theta + \\cos^2\\theta - 1 = 0$, so the matrix is singular.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Compute: $\\det\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix} = \\cos^2\\theta - (-\\sin\\theta)(\\sin\\theta) = \\cos^2\\theta + \\sin^2\\theta = 1$. Geometrically: rotations preserve area (and orientation), so the determinant is $+1$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Would mean the matrix is singular — but rotations are invertible (the inverse of a rotation by $\\theta$ is rotation by $-\\theta$).' },
            { choice: 'C' as const, why: '$\\det = -1$ corresponds to reflections (orientation-reversing orthogonal transformations), not rotations.' },
            { choice: 'D' as const, why: 'Confuses $\\det(R)$ with the trace $\\text{tr}(R) = 2 \\cos\\theta$, then drops a factor.' },
            { choice: 'E' as const, why: 'Correctly identifies that $\\sin^2\\theta + \\cos^2\\theta = 1$, but then incorrectly subtracts another $1$ to get $0$.' },
          ],
        },
      },
    ],
  },
};
