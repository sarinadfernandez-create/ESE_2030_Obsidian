import type { Concept } from '../types';

export const orthogonalProjections: Concept = {
  id: 'orthogonal-projections',
  unitId: 'ch6',
  number: '6.2',
  title: 'Orthogonal Projections',
  blurb: 'The closest point in a subspace to a given vector — and the matrix that finds it.',
  tier: 'full',

  learn: {
    overview: `
Given a [[subspaces|subspace]] $W$ of an [[dot-and-inner-products|inner product space]] $V$ and a vector $v \\in V$, the **orthogonal projection** of $v$ onto $W$, written $\\Pi_W(v)$ or $\\hat{v}$, is the unique vector in $W$ that is closest to $v$:

$$\\hat{v} = \\arg\\min_{w \\in W} \\|v - w\\|.$$

Equivalently, $\\hat{v}$ is the vector in $W$ such that $v - \\hat{v}$ is in [[orthogonal-complements|$W^\\perp$]]. The two characterizations — closest-point and orthogonal-residual — are equivalent, and both pin down $\\hat{v}$ uniquely.

The orthogonal projection sits at the intersection of geometry, optimization, and linear algebra. It is the geometric foundation of [[least-squares|least squares]], the algebraic content of "best approximation in a subspace," and the building block for [[fundamental-theorem|orthogonal decomposition]].

**Formula via orthonormal basis.** If $\\{q_1, \\dots, q_k\\}$ is an [[orthonormal-bases|orthonormal basis]] of $W$, then

$$\\hat{v} = \\Pi_W(v) = \\sum_{i=1}^{k} \\langle v, q_i \\rangle q_i.$$

This is a direct consequence of the inner-product formula for [[orthonormal-bases|orthonormal-basis coordinates]]: each Fourier coefficient $\\langle v, q_i \\rangle$ contributes the $q_i$-component of $v$, and summing them gives the projection.

**Formula via general basis.** If $W$ has a basis $\\{w_1, \\dots, w_k\\}$ that is NOT orthonormal, package it into a matrix $W = [w_1 | \\cdots | w_k]$. Then

$$\\Pi_W(v) = W (W^T W)^{-1} W^T v.$$

The matrix $W (W^T W)^{-1} W^T$ is the **projection matrix** onto $W$, denoted $P_W$ or simply $P$. The factor $(W^T W)^{-1}$ corrects for the basis's non-orthonormality. When the basis is orthonormal, $W^T W = I$, and the formula simplifies to $P_W = W W^T$.

**Properties of projection matrices.** For any orthogonal projection matrix $P$:
- **Idempotent**: $P^2 = P$ (projecting twice is the same as projecting once).
- **Symmetric**: $P^T = P$ (this distinguishes orthogonal projections from oblique ones).
- **Rank**: $\\text{rank}(P) = \\dim(W)$.
- **Eigenvalues**: only $0$ and $1$. Eigenvectors with eigenvalue $1$ span $W$; eigenvectors with eigenvalue $0$ span $W^\\perp$.
- **Complement projection**: $I - P$ is the orthogonal projection onto $W^\\perp$.
- **NOT invertible** (unless $W = V$): the projection has nontrivial kernel $W^\\perp$.

**Geometric decomposition.** For any $v \\in V$:

$$v = \\Pi_W(v) + (I - \\Pi_W)(v) = \\hat{v} + r,$$

where $\\hat{v} = \\Pi_W(v) \\in W$ and $r = v - \\hat{v} \\in W^\\perp$ (the **residual**). This is the [[orthogonal-complements|orthogonal decomposition]] $V = W \\oplus W^\\perp$ realized for a specific vector. The Pythagorean theorem applies: $\\|v\\|^2 = \\|\\hat{v}\\|^2 + \\|r\\|^2$.

**The "closest point" perspective.** The phrase "best approximation in $W$" is a defining property: $\\hat{v}$ minimizes the distance $\\|v - w\\|$ over all $w \\in W$. This is what makes projections the foundation of approximation theory. When you want to approximate a complicated function $f$ by a polynomial of degree $\\leq n$, you're computing the orthogonal projection of $f$ onto the subspace of polynomials of degree $\\leq n$ — using the $L^2$ inner product on functions.

**Special case: projection onto a single vector.** $\\Pi_v(u) = \\frac{\\langle u, v \\rangle}{\\|v\\|^2} v$ — the parallel component of $u$ along the direction of $v$. This is the basic "drop a perpendicular onto the line through $v$" computation, and it appears in [[gram-schmidt|Gram-Schmidt]] as the projection step.
    `.trim(),

    definitions: [
      {
        term: 'Orthogonal projection',
        body: 'For a subspace $W \\subseteq V$ and a vector $v \\in V$: the unique vector $\\hat{v} \\in W$ such that $v - \\hat{v} \\in W^\\perp$. Equivalently, the closest point in $W$ to $v$.',
      },
      {
        term: 'Projection matrix',
        body: 'For a subspace $W$ with basis matrix $W = [w_1 | \\cdots | w_k]$: $P_W = W(W^T W)^{-1} W^T$. Satisfies $P_W^2 = P_W = P_W^T$.',
      },
      {
        term: 'Residual',
        body: 'For an orthogonal projection $\\hat{v} = \\Pi_W(v)$: the leftover $r = v - \\hat{v} \\in W^\\perp$. The "error" of the projection.',
      },
    ],

    theorems: [
      {
        name: 'Best approximation theorem',
        statement: 'For $v \\in V$ and a subspace $W$: $\\hat{v} = \\Pi_W(v)$ is the unique vector in $W$ minimizing $\\|v - w\\|$ over all $w \\in W$.',
        intuition: 'Any other $w \\in W$ has $\\|v - w\\|^2 = \\|v - \\hat{v}\\|^2 + \\|\\hat{v} - w\\|^2$ by the Pythagorean theorem (since $v - \\hat{v} \\in W^\\perp$ and $\\hat{v} - w \\in W$ are orthogonal). Adding a positive term means $\\|v - w\\| > \\|v - \\hat{v}\\|$.',
      },
      {
        name: 'Idempotent and symmetric',
        statement: 'A matrix $P$ is the orthogonal projection onto its column space iff $P^2 = P$ and $P^T = P$.',
        intuition: 'Idempotency captures "projecting twice = projecting once" (geometric stability). Symmetry distinguishes orthogonal projections from oblique ones (where $P^2 = P$ but $P^T \\neq P$). Together they pin down the orthogonal-projection identity.',
      },
      {
        name: 'Pythagorean theorem for projections',
        statement: 'For $\\hat{v} = \\Pi_W(v)$ and residual $r = v - \\hat{v}$: $\\|v\\|^2 = \\|\\hat{v}\\|^2 + \\|r\\|^2$.',
        intuition: '$\\hat{v}$ and $r$ are orthogonal (one is in $W$, the other in $W^\\perp$). The Pythagorean theorem for orthogonal vectors gives the squared-norm decomposition.',
      },
      {
        name: 'Complement projection',
        statement: 'If $P$ is the orthogonal projection onto $W$, then $I - P$ is the orthogonal projection onto $W^\\perp$.',
        intuition: '$v = Pv + (I - P)v$, with $Pv \\in W$ and $(I - P)v = v - Pv \\in W^\\perp$ (the residual). The decomposition of $v$ is exactly the projection onto $W$ plus the projection onto $W^\\perp$.',
      },
    ],

    keyFormulas: [
      '\\hat{v} = \\sum_{i=1}^{k} \\langle v, q_i \\rangle q_i \\quad (\\text{orthonormal basis})',
      '\\hat{v} = W(W^T W)^{-1} W^T v \\quad (\\text{general basis})',
      'P^2 = P, \\quad P^T = P',
      '\\|v\\|^2 = \\|\\hat{v}\\|^2 + \\|r\\|^2',
    ],
  },

  explore: {
    vizComponent: 'OrthogonalProjectionViz',
    description: 'In $\\mathbb{R}^3$, pick a subspace $W$ (a line or a plane through origin) and a draggable test vector $v$. Watch the projection $\\hat{v} = \\Pi_W(v)$ render as a vector in $W$, with the residual $r = v - \\hat{v}$ rendering as a perpendicular drop. The Pythagorean check $\\|v\\|^2 = \\|\\hat{v}\\|^2 + \\|r\\|^2$ updates live.',
    misconception: {
      title: 'The projection matrix $P$ is NOT invertible (unless $W = V$)',
      body: `
A common error is treating $P$ as if it were a generic invertible matrix. It is not. Orthogonal projection matrices have rank $\\dim(W)$, which is strictly less than $\\dim(V)$ unless $W = V$. The kernel of $P$ is exactly $W^\\perp$ — every vector orthogonal to $W$ gets sent to zero.

This non-invertibility is structural, not accidental. The whole point of projection is to "collapse" the $W^\\perp$ component; trying to undo a projection would require recovering information that was deliberately discarded.

A second misconception: confusing orthogonal projection with oblique projection. Both satisfy $P^2 = P$ (idempotent), but only orthogonal projections satisfy $P^T = P$ (symmetric). An oblique projection projects along some direction not perpendicular to $W$ — for example, projecting onto the $x$-axis along the line $y = x$ (rather than along the $y$-axis). Oblique projections are useful in some contexts but lack the "closest point" property of orthogonal projections.

A third trap: thinking the formula $P = W(W^T W)^{-1} W^T$ requires $W$ to be orthogonal in some sense. It does not — $W$ just needs to be a basis (linearly independent columns) of the subspace. The formula corrects for non-orthogonality via the factor $(W^T W)^{-1}$, which is the inverse of the **Gram matrix** of the basis. When the basis is orthonormal, $W^T W = I$, and the formula simplifies to $P = W W^T$.

A fourth misconception: thinking the projection of $v$ onto $W$ depends on the choice of basis for $W$. It does not — the projection is geometrically defined (closest point in $W$) and doesn't care about basis. Different bases give different intermediate matrices, but the final projection $\\hat{v}$ is the same.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Project a vector onto a line',
        body: 'Project $v = (3, 4, 0)$ onto $W = \\text{span}\\{(1, 1, 0)\\}$ in $\\mathbb{R}^3$. Use the single-vector formula: $\\hat{v} = \\frac{v \\cdot w}{\\|w\\|^2} w$ where $w = (1, 1, 0)$. Compute: $v \\cdot w = 3 + 4 + 0 = 7$, $\\|w\\|^2 = 2$. So $\\hat{v} = \\frac{7}{2}(1, 1, 0) = (3.5, 3.5, 0)$.',
      },
      {
        title: 'Verify the residual is perpendicular',
        body: 'Residual: $r = v - \\hat{v} = (3, 4, 0) - (3.5, 3.5, 0) = (-0.5, 0.5, 0)$. Check: $r \\cdot w = -0.5 + 0.5 + 0 = 0$ ✓. So $r \\in W^\\perp$ as expected. Pythagorean check: $\\|v\\|^2 = 25$, $\\|\\hat{v}\\|^2 = 24.5$, $\\|r\\|^2 = 0.5$, and $24.5 + 0.5 = 25$ ✓.',
      },
    ],

    problems: [
      {
        id: 'P-6.2a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $P$ be the matrix that orthogonally projects $\\mathbb{R}^n$ onto a subspace $W$ with $\\dim(W) = k$, where $0 < k < n$. Which of the following is FALSE?',
        choices: [
          { label: 'A' as const, body: '$P^2 = P$' },
          { label: 'B' as const, body: '$P^T = P$' },
          { label: 'C' as const, body: '$\\text{rank}(P) = k$' },
          { label: 'D' as const, body: '$I - P$ is the orthogonal projection onto $W^\\perp$' },
          { label: 'E' as const, body: '$P$ is invertible' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'Since $0 < k < n$, the projection has nontrivial kernel $W^\\perp$ (every vector in $W^\\perp$ is sent to $0$ by $P$). So $P$ is not injective, hence not invertible. All other listed properties are fundamental facts about orthogonal projections.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'True — idempotency is the defining algebraic property of any projection: projecting twice equals projecting once.' },
            { choice: 'B' as const, why: 'True — symmetry is what makes the projection orthogonal (rather than oblique).' },
            { choice: 'C' as const, why: 'True — $\\text{im}(P) = W$, so $\\text{rank}(P) = \\dim(W) = k$.' },
            { choice: 'D' as const, why: 'True — $v = Pv + (I - P)v$ with the two pieces orthogonal, so $I - P$ projects onto $W^\\perp$.' },
          ],
        },
      },
      {
        id: 'P-6.2b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $W$ be a subspace of an inner product space $V$, and let $v \\in V$. Define $\\hat{v} = \\Pi_W(v)$ (the orthogonal projection onto $W$) and $r = v - \\hat{v}$ (the residual). Which of the following is GUARANTEED to be true?',
        choices: [
          { label: 'A' as const, body: '$\\|\\hat{v}\\| = \\|v\\|$' },
          { label: 'B' as const, body: '$\\langle \\hat{v}, r \\rangle = 1$' },
          { label: 'C' as const, body: '$r \\in W$' },
          { label: 'D' as const, body: '$\\|r\\| > 0$' },
          { label: 'E' as const, body: 'None of the above' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'The orthogonal decomposition gives $v = \\hat{v} + r$ with $\\hat{v} \\in W$ and $r \\in W^\\perp$. By Pythagoras, $\\|v\\|^2 = \\|\\hat{v}\\|^2 + \\|r\\|^2$. None of (A)–(D) is universally true: (A) only when $v \\in W$; (B) is wrong (the inner product is $0$, not $1$); (C) is the wrong subspace ($r \\in W^\\perp$); (D) only when $v \\notin W$.',
          partialCredit: '(C) earns partial credit. The student understands $r$ lives in a specific subspace related to $W$, but identifies the wrong one (the most common swap error in orthogonal decomposition).',
          trickAnalysis: [
            { choice: 'A' as const, why: '$\\|\\hat{v}\\| \\leq \\|v\\|$ with equality iff $v \\in W$ (so $r = 0$). For generic $v \\notin W$, the projection has strictly smaller norm.' },
            { choice: 'B' as const, why: '$\\langle \\hat{v}, r \\rangle = 0$, not $1$. Orthogonality is the defining property of the decomposition.' },
            { choice: 'C' as const, why: '$r \\in W^\\perp$, not $W$. Earns partial credit for recognizing $r$ is in some specific subspace.' },
            { choice: 'D' as const, why: '$\\|r\\| > 0$ holds for "generic" $v$ but fails when $v \\in W$ (giving $r = 0$). So this is not guaranteed.' },
          ],
        },
      },
      {
        id: 'P-6.2c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $\\{q_1, q_2, q_3\\}$ be an orthonormal set in $\\mathbb{R}^5$, and let $W = \\text{span}\\{q_1, q_2, q_3\\}$. For any vector $v \\in \\mathbb{R}^5$, the orthogonal projection $\\Pi_W(v)$ equals:',
        choices: [
          { label: 'A' as const, body: '$\\langle v, q_1 \\rangle + \\langle v, q_2 \\rangle + \\langle v, q_3 \\rangle$' },
          { label: 'B' as const, body: '$\\sum_{i=1}^{3} \\langle v, q_i \\rangle q_i$' },
          { label: 'C' as const, body: '$\\frac{1}{3}(q_1 + q_2 + q_3)$' },
          { label: 'D' as const, body: '$Q v$ where $Q = [q_1 | q_2 | q_3]$' },
          { label: 'E' as const, body: '$Q^T v$ where $Q = [q_1 | q_2 | q_3]$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'For an orthonormal basis of $W$, the projection onto $W$ is the sum of the components along each basis vector: $\\hat{v} = \\sum_i \\langle v, q_i \\rangle q_i$. This is the orthonormal-basis formula for projections.',
          partialCredit: '(D) earns partial credit if interpreted as $Q Q^T v$ — that IS the projection matrix formula, and the student may have just dropped a factor. Choice (D) as stated ($Qv$) is wrong because $Q$ is $5 \\times 3$ and $v$ is $5 \\times 1$, dimensions don\'t match.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'A scalar (sum of inner products) cannot equal a vector projection. Dimensions don\'t match.' },
            { choice: 'C' as const, why: 'Just averages the basis vectors — has nothing to do with $v$.' },
            { choice: 'D' as const, why: 'Dimensions wrong: $Q$ is $5 \\times 3$, $v$ is in $\\mathbb{R}^5$ ($5 \\times 1$), so $Qv$ is undefined. The correct projection matrix formula is $Q Q^T v$. Earns partial credit for direction.' },
            { choice: 'E' as const, why: '$Q^T v$ is $3 \\times 1$ — the coefficient vector $(\\langle v, q_1 \\rangle, \\langle v, q_2 \\rangle, \\langle v, q_3 \\rangle)^T$. Not the projection itself, but rather the coordinates of the projection in the $\\{q_i\\}$ basis.' },
          ],
        },
      },
    ],
  },
};
