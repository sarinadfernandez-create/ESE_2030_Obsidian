import type { Concept } from '../types';

export const anglesAndOrthogonality: Concept = {
  id: 'angles-and-orthogonality',
  unitId: 'ch5',
  number: '5.2',
  title: 'Angles & Orthogonality',
  blurb: 'The Cauchy-Schwarz inequality, the cosine formula, and the Pythagorean theorem — generalized.',
  tier: 'full',

  learn: {
    overview: `
With an [[dot-and-inner-products|inner product]] in place, every vector space gains a notion of angle and length — and the geometric tools of Euclidean space become available in arbitrary settings.

The **Cauchy-Schwarz inequality** is the foundation:

$$|\\langle u, v \\rangle| \\leq \\|u\\| \\, \\|v\\|.$$

Equality holds iff $u$ and $v$ are linearly dependent (one is a scalar multiple of the other). This inequality is what allows the **angle** between two nonzero vectors to be defined:

$$\\cos\\theta = \\frac{\\langle u, v \\rangle}{\\|u\\| \\, \\|v\\|},$$

with $\\theta \\in [0, \\pi]$. By Cauchy-Schwarz, the right-hand side is in $[-1, 1]$, so $\\theta$ is well-defined.

Two vectors are **orthogonal** if $\\langle u, v \\rangle = 0$. This is the same as the angle being $\\pi/2$ — perpendicular. The notation $u \\perp v$ is standard. Orthogonality replaces the geometric concept of perpendicularity in any inner product space.

A central consequence is the **Pythagorean theorem**: if $u \\perp v$, then

$$\\|u + v\\|^2 = \\|u\\|^2 + \\|v\\|^2.$$

This is exactly the familiar high-school theorem, generalized to any inner product space. The proof: expand $\\|u + v\\|^2 = \\langle u + v, u + v \\rangle = \\|u\\|^2 + 2 \\langle u, v \\rangle + \\|v\\|^2$, and use $\\langle u, v \\rangle = 0$.

A further consequence: **orthogonal decomposition**. Given any nonzero vector $u$, every other vector $v$ can be uniquely decomposed as

$$v = v_\\parallel + v_\\perp,$$

where $v_\\parallel$ is the component of $v$ parallel to $u$ (the [[orthogonal-projections|orthogonal projection]] onto $u$) and $v_\\perp$ is the component orthogonal to $u$. Specifically, $v_\\parallel = \\frac{\\langle v, u \\rangle}{\\|u\\|^2} u$ and $v_\\perp = v - v_\\parallel$. This is the seed of [[gram-schmidt|Gram-Schmidt orthogonalization]] and the basic operation in [[least-squares|least-squares approximation]].

The orthogonality concept is **inner-product-dependent**. Two vectors orthogonal under one inner product can fail to be orthogonal under another. This is consistent with the [[dot-and-inner-products|principle that inner products define geometry]]: different inner products give different notions of angle, including different notions of "perpendicular."

The most important class of orthogonal sets is **[[orthonormal-bases|orthonormal bases]]** — bases whose vectors are pairwise orthogonal and unit-length. These bases combine the structural utility of bases with the geometric simplicity of perpendicular axes, making them the workhorses of inner-product-space computations. The next two sections (5.3 on orthonormal bases and 5.4 on Gram-Schmidt) develop these in detail.
    `.trim(),

    definitions: [
      {
        term: 'Orthogonal',
        body: 'Two vectors $u, v$ are orthogonal if $\\langle u, v \\rangle = 0$. Written $u \\perp v$.',
      },
      {
        term: 'Orthogonal set',
        body: 'A set of vectors that is pairwise orthogonal: $\\langle v_i, v_j \\rangle = 0$ for $i \\neq j$.',
      },
      {
        term: 'Angle between vectors',
        body: 'For nonzero $u, v$: $\\theta \\in [0, \\pi]$ defined by $\\cos\\theta = \\langle u, v \\rangle / (\\|u\\| \\, \\|v\\|)$.',
      },
    ],

    theorems: [
      {
        name: 'Cauchy-Schwarz inequality',
        statement: '$|\\langle u, v \\rangle| \\leq \\|u\\| \\, \\|v\\|$ for any vectors $u, v$ in an inner product space. Equality iff $u, v$ are linearly dependent.',
        intuition: 'The inequality is what makes angle well-defined: $\\langle u, v \\rangle / (\\|u\\| \\|v\\|)$ lies in $[-1, 1]$ exactly because $|\\langle u, v \\rangle| \\leq \\|u\\| \\|v\\|$. Geometrically: the absolute inner product cannot exceed the product of lengths.',
      },
      {
        name: 'Pythagorean theorem',
        statement: 'If $u \\perp v$ in an inner product space, then $\\|u + v\\|^2 = \\|u\\|^2 + \\|v\\|^2$.',
        intuition: 'Expand $\\|u + v\\|^2 = \\langle u + v, u + v \\rangle = \\|u\\|^2 + 2 \\langle u, v \\rangle + \\|v\\|^2$. Orthogonality kills the cross term, leaving the Pythagorean identity. The converse also holds: if $\\|u + v\\|^2 = \\|u\\|^2 + \\|v\\|^2$, then $\\langle u, v \\rangle = 0$.',
      },
      {
        name: 'Orthogonal decomposition (single vector)',
        statement: 'For any vector $v$ and nonzero $u$: $v = v_\\parallel + v_\\perp$ with $v_\\parallel = \\frac{\\langle v, u \\rangle}{\\|u\\|^2} u$ parallel to $u$ and $v_\\perp$ orthogonal to $u$. The decomposition is unique.',
        intuition: 'Project $v$ onto the line spanned by $u$ to get $v_\\parallel$. The remaining component, $v_\\perp = v - v_\\parallel$, is perpendicular to $u$ by construction. This basic split is the foundation of [[gram-schmidt|Gram-Schmidt]] and [[orthogonal-projections|orthogonal projection]].',
      },
    ],

    keyFormulas: [
      '|\\langle u, v \\rangle| \\leq \\|u\\| \\, \\|v\\|',
      '\\cos\\theta = \\langle u, v \\rangle / (\\|u\\| \\, \\|v\\|)',
      'u \\perp v \\iff \\langle u, v \\rangle = 0',
      '\\|u + v\\|^2 = \\|u\\|^2 + \\|v\\|^2 \\quad \\text{when } u \\perp v',
    ],
  },

  explore: {
    vizComponent: 'AnglesViz',
    description: 'Place two vectors in $\\mathbb{R}^2$ and watch the angle between them update in real time, alongside the inner product, the lengths, and the Cauchy-Schwarz check $|\\langle u, v \\rangle| \\leq \\|u\\| \\|v\\|$. Try aligning the vectors to see equality in CS; rotate one to perpendicular to see the inner product hit zero.',
    misconception: {
      title: 'Orthogonality depends on the inner product, not just on the vectors',
      body: `
A common misconception is treating "orthogonal" as a basis-independent property of two vectors. It is not. Two specific vectors can be orthogonal under one inner product and non-orthogonal under another.

For example, in $\\mathbb{R}^2$ the vectors $(1, 1)$ and $(1, -1)$ are orthogonal under the standard dot product ($\\langle u, v \\rangle = 0$). But under the weighted inner product $\\langle u, v \\rangle_M = u^T M v$ with $M = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$: $\\langle (1, 1), (1, -1) \\rangle_M = (1, 1) M (1, -1)^T = 1 - 1 + 1 - 2 = -1 \\neq 0$. Same vectors, different inner products, different orthogonality.

A second misconception: thinking that the Cauchy-Schwarz inequality has an analog of "$u$ and $v$ are equal" as the equality case. The equality case in Cauchy-Schwarz is $u$ and $v$ being **linearly dependent** — one is a scalar multiple of the other, with either sign. Equality $|\\langle u, v \\rangle| = \\|u\\| \\|v\\|$ holds when the angle is $0$ or $\\pi$, not just when $u = v$.

A third trap: assuming the Pythagorean theorem holds for non-orthogonal vectors. It does not. The general identity is $\\|u + v\\|^2 = \\|u\\|^2 + 2 \\langle u, v \\rangle + \\|v\\|^2$, which simplifies to the Pythagorean form only when $\\langle u, v \\rangle = 0$. For non-orthogonal vectors, the cross term contributes.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Verify Cauchy-Schwarz on specific vectors',
        body: 'In $\\mathbb{R}^3$, let $u = (1, 2, 2)$ and $v = (3, 0, 4)$. Compute $\\langle u, v \\rangle = 3 + 0 + 8 = 11$. Compute the lengths: $\\|u\\| = \\sqrt{1 + 4 + 4} = 3$ and $\\|v\\| = \\sqrt{9 + 0 + 16} = 5$. Verify Cauchy-Schwarz: $|\\langle u, v \\rangle| = 11 \\leq 15 = \\|u\\| \\, \\|v\\|$. ✓ The inequality is strict because $u$ and $v$ are not parallel.',
      },
      {
        title: 'Compute the angle between them',
        body: '$\\cos\\theta = 11 / 15 = 0.7\\overline{3}$, so $\\theta = \\arccos(11/15) \\approx 42.8°$.',
      },
    ],

    problems: [
      {
        id: 'P-5.2a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'In $\\mathbb{R}^3$ with the standard dot product, vectors $u = (3, -1, 2)$ and $v = (1, 5, 1)$ have what relationship?',
        choices: [
          { label: 'A' as const, body: 'They are orthogonal.' },
          { label: 'B' as const, body: 'They are parallel.' },
          { label: 'C' as const, body: 'The angle between them is acute.' },
          { label: 'D' as const, body: 'The angle between them is obtuse.' },
          { label: 'E' as const, body: 'They are equal in magnitude.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Compute $\\langle u, v \\rangle = 3 \\cdot 1 + (-1) \\cdot 5 + 2 \\cdot 1 = 3 - 5 + 2 = 0$. Since the inner product is zero, $u$ and $v$ are orthogonal.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Parallel would require one to be a scalar multiple of the other. Here $u$ has a negative second entry while $v$ has a positive second entry, so neither is a positive multiple of the other. (And Cauchy-Schwarz equality would require $|\\langle u, v \\rangle| = \\|u\\| \\|v\\|$, but the inner product is zero, far from the maximum.)' },
            { choice: 'C' as const, why: 'Acute angles have $\\cos\\theta > 0$, equivalent to $\\langle u, v \\rangle > 0$. Here the inner product is zero, giving $\\theta = \\pi/2$ exactly.' },
            { choice: 'D' as const, why: 'Obtuse angles have $\\cos\\theta < 0$, equivalent to $\\langle u, v \\rangle < 0$. Same issue.' },
            { choice: 'E' as const, why: '$\\|u\\| = \\sqrt{9 + 1 + 4} = \\sqrt{14}$ and $\\|v\\| = \\sqrt{1 + 25 + 1} = \\sqrt{27}$. Different magnitudes.' },
          ],
        },
      },
      {
        id: 'P-5.2b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Suppose $u, v \\in \\mathbb{R}^n$ are orthogonal under the standard dot product, with $\\|u\\| = 3$ and $\\|v\\| = 4$. What is $\\|u + v\\|$?',
        choices: [
          { label: 'A' as const, body: '$1$' },
          { label: 'B' as const, body: '$5$' },
          { label: 'C' as const, body: '$7$' },
          { label: 'D' as const, body: '$\\sqrt{7}$' },
          { label: 'E' as const, body: 'Cannot be determined without more information.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'By the Pythagorean theorem (which applies because $u \\perp v$): $\\|u + v\\|^2 = \\|u\\|^2 + \\|v\\|^2 = 9 + 16 = 25$. So $\\|u + v\\| = 5$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'This would be $|\\|u\\| - \\|v\\||$, the lower bound from the reverse triangle inequality (achieved when $u$ and $v$ point in opposite directions, not when they are orthogonal).' },
            { choice: 'C' as const, why: 'This is $\\|u\\| + \\|v\\|$, the upper bound from the triangle inequality (achieved when $u$ and $v$ are parallel and same-signed).' },
            { choice: 'D' as const, why: 'This corresponds to $\\|u\\|^2 + \\|v\\|^2 = 7$, which would require different magnitudes. Misreading the inputs.' },
            { choice: 'E' as const, why: 'It can be determined exactly via the Pythagorean theorem.' },
          ],
        },
      },
      {
        id: 'P-5.2c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For two nonzero vectors $u, v$ in an inner product space, equality $|\\langle u, v \\rangle| = \\|u\\| \\, \\|v\\|$ in the Cauchy-Schwarz inequality holds if and only if:',
        choices: [
          { label: 'A' as const, body: '$u = v$.' },
          { label: 'B' as const, body: '$u$ and $v$ are linearly independent.' },
          { label: 'C' as const, body: '$u$ and $v$ are linearly dependent (one is a scalar multiple of the other).' },
          { label: 'D' as const, body: '$u$ and $v$ are orthogonal.' },
          { label: 'E' as const, body: '$\\|u\\| = \\|v\\|$.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'Cauchy-Schwarz equality holds iff $u$ and $v$ are linearly dependent — that is, iff one is a scalar multiple of the other (with either sign). Geometrically, this corresponds to $\\theta = 0$ (parallel, $\\cos\\theta = 1$) or $\\theta = \\pi$ (anti-parallel, $\\cos\\theta = -1$). The absolute value in $|\\langle u, v \\rangle|$ accommodates both.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Too restrictive: $u = v$ gives equality, but so does $u = -v$, $u = 2v$, $u = -3v$, etc. Any scalar multiple works.' },
            { choice: 'B' as const, why: 'The opposite of the correct condition. Independence forces strict inequality.' },
            { choice: 'D' as const, why: 'Orthogonality gives $\\langle u, v \\rangle = 0$, the *minimum* of $|\\langle u, v \\rangle|$, not the maximum. Strict inequality $0 < \\|u\\| \\|v\\|$ holds.' },
            { choice: 'E' as const, why: 'Equal magnitudes are unrelated to the equality case. Two vectors of equal length can be at any angle.' },
          ],
        },
      },
    ],
  },
};
