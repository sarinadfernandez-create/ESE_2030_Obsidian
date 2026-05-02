import type { Concept } from '../types';

export const rankAndConditioning: Concept = {
  id: 'rank-and-conditioning',
  unitId: 'ch1',
  number: '1.8',
  title: 'Rank & Conditioning',
  blurb: 'Two numbers that decide how well a matrix behaves: rank, and the condition number.',
  tier: 'full',

  learn: {
    overview: `
A matrix can be invertible in theory but disastrous in practice. Two scalar quantities — the **rank** and the **condition number** — capture, between them, almost everything you need to know about how a matrix behaves under realistic computation.

The **rank** of a matrix is the number of pivots in its [[row-reduction|RREF]], or equivalently the number of linearly independent rows (equivalently, columns). It measures the *effective dimensionality* of the matrix's action: a $5 \\times 5$ matrix of rank $3$ acts like a 3-dimensional transformation embedded in 5-dimensional space, regardless of how it looks at first glance. Rank is binary in its consequences for [[inverses|invertibility]] — a square matrix is invertible if and only if it has full rank — but it is fundamental to the structure theory developed in [[image-and-kernel]] and [[fundamental-theorem]].

A matrix has **full rank** if its rank equals the smaller of its two dimensions. For square matrices, full rank means invertible.

The **condition number** $\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\|$ measures how much $A$ amplifies relative error. If you solve $Ax = b$ and the right-hand side is known only approximately — say, to within a relative error of $\\varepsilon$ — then the relative error in the computed $x$ can be as large as $\\kappa(A) \\cdot \\varepsilon$. A matrix with $\\kappa(A) = 10^{10}$ amplifies a 7-digit-accurate input into a result with at most a few correct digits.

A matrix with large condition number is called **ill-conditioned**. It may be invertible — full rank, nonzero determinant — but solving with it is unreliable. Ill-conditioning arises naturally near the boundary of singularity: a matrix that is "almost rank-deficient" is exactly an ill-conditioned matrix, and the relationship is made precise by the [[svd-form|singular value decomposition]] (the condition number equals $\\sigma_{\\max} / \\sigma_{\\min}$).

The practical takeaway: theoretical invertibility is necessary but not sufficient for computational tractability. Both rank and conditioning need to be checked. In numerical software, computing the condition number is a standard preflight before solving any linear system.
    `.trim(),

    definitions: [
      {
        term: 'Rank',
        body: 'The number of pivots in the [[row-reduction|RREF]] of a matrix. Equivalently, the dimension of the [[image-and-kernel|column space]], the dimension of the row space, or the maximum number of linearly independent rows (or columns).',
      },
      {
        term: 'Full rank',
        body: 'A matrix is full rank if its rank equals $\\min(m, n)$ for an $m \\times n$ matrix. For square matrices, equivalent to [[inverses|invertible]].',
      },
      {
        term: 'Matrix norm',
        body: 'A scalar measuring the "size" of a matrix\'s action on vectors. The most common is the operator (induced) 2-norm: $\\|A\\| = \\max_{\\|x\\| = 1} \\|Ax\\|$, the largest factor by which $A$ stretches a unit vector. For symmetric matrices, this equals the largest absolute value of an [[eigenvectors|eigenvalue]].',
      },
      {
        term: 'Condition number',
        body: 'For an invertible matrix, $\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\|$. Always $\\geq 1$. Quantifies sensitivity of the system $Ax = b$ to perturbations in $b$.',
      },
      {
        term: 'Ill-conditioned matrix',
        body: 'A matrix with a large condition number — typically meaning $\\kappa(A) \\gg 1/\\varepsilon$, where $\\varepsilon$ is the relative precision of the inputs. No sharp threshold; "ill-conditioned" is a contextual judgment.',
      },
    ],

    theorems: [
      {
        name: 'Rank-nullity (preview)',
        statement: 'For an $m \\times n$ matrix $A$, $\\text{rank}(A) + \\text{nullity}(A) = n$, where nullity is the dimension of the [[image-and-kernel|null space]].',
        intuition: 'Each non-pivot column corresponds to a free variable in $Ax = 0$, contributing one dimension to the null space. Each pivot column contributes one dimension to the column space. The two add up to $n$. The full theorem is developed in [[fundamental-theorem|the fundamental theorem of linear algebra]].',
      },
      {
        name: 'Equivalent characterizations of full rank for square matrices',
        statement: 'For a square $n \\times n$ matrix $A$, the following are equivalent: (i) $\\text{rank}(A) = n$; (ii) $A$ is invertible; (iii) $\\det(A) \\neq 0$; (iv) the columns of $A$ are linearly independent; (v) $Ax = 0$ has only the trivial solution.',
        intuition: 'For square matrices, full rank and invertibility are the same property, viewed through different lenses. The key restriction is squareness — for non-square matrices, "full rank" and "invertible" are not even comparable concepts.',
      },
      {
        name: 'Error amplification bound',
        statement: 'If $A x = b$ and $A \\hat{x} = \\hat{b}$ for some perturbed $\\hat{b}$, then $\\dfrac{\\|x - \\hat{x}\\|}{\\|x\\|} \\leq \\kappa(A) \\dfrac{\\|b - \\hat{b}\\|}{\\|b\\|}$.',
        intuition: 'The condition number is exactly the worst-case amplification factor for relative error. A condition number of $10^k$ means up to $k$ digits can be lost from input to output.',
      },
    ],

    keyFormulas: [
      '\\text{rank}(A) + \\text{nullity}(A) = n',
      '\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\|',
      '\\kappa(A) = \\sigma_{\\max}(A) / \\sigma_{\\min}(A) \\quad \\text{(via SVD)}',
    ],
  },

  explore: {
    vizComponent: 'ConditioningViz',
    description: 'Adjust the entries of a $2 \\times 2$ matrix and watch the condition number, the determinant, and the geometric "image of the unit circle" simultaneously. As the matrix approaches singular, the unit circle\'s image flattens into a thin ellipse — and the condition number explodes. This is the geometric meaning of ill-conditioning.',
    misconception: {
      title: 'A determinant near zero is a hint, not a measure',
      body: `
The determinant tells you *whether* a matrix is singular, but not *how close to singular* it is. Two matrices with the same determinant can have wildly different condition numbers. The determinant is the *product* of singular values, while the condition number is their *ratio* — different objects entirely.

Example: a diagonal matrix $D = \\text{diag}(1, 10^{-10})$ has $\\det(D) = 10^{-10}$, very small. But a matrix $A = 10^{-5} I$ also has $\\det(A) = 10^{-10}$ in 2D, while being beautifully conditioned ($\\kappa(A) = 1$). Same determinant, opposite computational behavior.

A second confusion: thinking that scaling the whole matrix changes its conditioning. It doesn't — $\\kappa(cA) = \\kappa(A)$ for any nonzero scalar $c$, because the norm of $cA$ scales by $|c|$ but so does the norm of $(cA)^{-1} = c^{-1} A^{-1}$, with the factors canceling. The condition number is a *relative* quantity, sensitive to the matrix's shape but not its overall magnitude.

A third: thinking ill-conditioning is about input data being noisy. It can be triggered by noisy data, but the matrix's conditioning is intrinsic — it describes how much *any* perturbation gets amplified, including the ones introduced by floating-point arithmetic itself.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute rank by row reduction',
        body: 'Find the rank of $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 1 & 1 \\end{pmatrix}$.',
      },
      {
        title: 'Reduce to REF',
        body: 'Subtract $2$ times row 1 from row 2 (giving a zero row), and subtract row 1 from row 3: $\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 0 & 0 \\\\ 0 & -1 & -2 \\end{pmatrix}$. Swap rows 2 and 3 to put the zero row at the bottom: $\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & -1 & -2 \\\\ 0 & 0 & 0 \\end{pmatrix}$.',
      },
      {
        title: 'Count pivots',
        body: 'Two pivots (in columns 1 and 2). So $\\text{rank}(A) = 2$. The matrix is $3 \\times 3$ but acts as a 2-dimensional transformation — it collapses one direction.',
      },
    ],

    problems: [
      {
        id: 'P-1.8a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A $5 \\times 4$ matrix $A$ has the row echelon form $\\begin{pmatrix} 2 & 1 & 0 & 3 \\\\ 0 & 0 & 4 & 1 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$. Which statement is TRUE?',
        choices: [
          { label: 'A' as const, body: 'The column space of $A$ is a 2-dimensional subspace of $\\mathbb{R}^4$.' },
          { label: 'B' as const, body: 'Columns 1 and 3 of the row echelon form above form a basis for the column space of $A$.' },
          { label: 'C' as const, body: 'The equation $Ax = 0$ has a 3-dimensional solution space.' },
          { label: 'D' as const, body: 'The rank of $A$ equals 2, which is the number of nonzero rows.' },
          { label: 'E' as const, body: 'The pivot columns are columns 1, 2, and 3.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: 'The rank equals the number of pivots, which equals the number of nonzero rows in REF. There are 2 pivots (in columns 1 and 3), so rank$(A) = 2$. Row operations preserve rank, so the rank of $A$ matches the rank of its REF.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The column space is a subspace of the **codomain** $\\mathbb{R}^5$ (since $A$ has 5 rows), not $\\mathbb{R}^4$. A common error: confusing row-space and column-space ambient dimensions.' },
            { choice: 'B' as const, why: "Critical misconception. The pivot columns of the REF span a different space than the columns of the original $A$ — row operations change the column space. To get a basis for $A$'s column space, take the **original** columns of $A$ at the pivot positions, not the REF columns." },
            { choice: 'C' as const, why: 'By rank-nullity: nullity $= 4 - \\text{rank} = 4 - 2 = 2$, not 3.' },
            { choice: 'E' as const, why: 'Column 2 is NOT a pivot column — its entries are not the leading entries of any row. Pivots are in columns 1 and 3 only.' },
          ],
        },
      },
      {
        id: 'P-1.8b',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'For an $m \\times n$ matrix $A$ with rank $r$, what is the dimension of the solution space to $Ax = 0$?',
        choices: [
          { label: 'A' as const, body: '$r$' },
          { label: 'B' as const, body: '$m - r$' },
          { label: 'C' as const, body: '$n - r$' },
          { label: 'D' as const, body: '$\\min(m, n) - r$' },
          { label: 'E' as const, body: 'It depends on whether $m > n$ or $m < n$.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'By the rank-nullity theorem, $\\text{rank}(A) + \\text{nullity}(A) = n$, where $n$ is the number of columns (which is also the dimension of the domain). The solution space to $Ax = 0$ is the null space of $A$, with dimension $n - r$. This holds regardless of whether $m > n$ or $m < n$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'The rank counts pivots; the nullity counts free variables. They sum to $n$, not equal each other.' },
            { choice: 'B' as const, why: 'Confuses the codomain dimension $m$ with the domain dimension. The null space lives in the domain $\\mathbb{R}^n$, not the codomain.' },
            { choice: 'D' as const, why: 'Inserts a $\\min$ that does not appear in rank-nullity. The dimension is $n - r$ exactly.' },
            { choice: 'E' as const, why: 'The formula $n - r$ holds in both regimes; the relationship between $m$ and $n$ does not change it.' },
          ],
        },
      },
      {
        id: 'P-1.8c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Which of the following is TRUE about the rank of $A^T$ compared to $A$?',
        choices: [
          { label: 'A' as const, body: '$\\text{rank}(A^T) = \\text{rank}(A)$ always.' },
          { label: 'B' as const, body: '$\\text{rank}(A^T) \\leq \\text{rank}(A)$ in general.' },
          { label: 'C' as const, body: '$\\text{rank}(A^T) \\geq \\text{rank}(A)$ in general.' },
          { label: 'D' as const, body: '$\\text{rank}(A^T) = \\text{rank}(A)$ only when $A$ is square.' },
          { label: 'E' as const, body: 'Cannot be determined without more information.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'This is the deep fact "row rank equals column rank." The rank of $A$ counts its linearly independent columns; the rank of $A^T$ counts its linearly independent columns, which are the rows of $A$. So $\\text{rank}(A) = \\text{rank}(A^T)$ always — no matter the shape of $A$.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Equality holds in general, not inequality.' },
            { choice: 'C' as const, why: 'Same — equality in both directions.' },
            { choice: 'D' as const, why: 'The equality holds for any shape, not just square. The transpose of a tall matrix is wide, but its rank is the same.' },
            { choice: 'E' as const, why: 'It can be determined: equality holds always.' },
          ],
        },
      },
      {
        id: 'P-1.8d',
        format: 'multiple-choice' as const,
        difficulty: 3,
        statement: 'Two matrices $A$ and $B = 100 A$ have the same condition number $\\kappa$. Why?',
        choices: [
          { label: 'A' as const, body: 'The condition number ignores scaling because both $\\|A\\|$ and $\\|A^{-1}\\|$ scale the same way under uniform multiplication, and they cancel.' },
          { label: 'B' as const, body: 'The condition number is always 1 for any matrix.' },
          { label: 'C' as const, body: 'Scaling has no effect on linear algebra in general.' },
          { label: 'D' as const, body: 'They have the same condition number only by coincidence.' },
          { label: 'E' as const, body: "Multiplying by a positive scalar does not change a matrix's rank, so it cannot change its conditioning." },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: "$\\|cA\\| = |c| \\cdot \\|A\\|$ and $\\|(cA)^{-1}\\| = \\|c^{-1} A^{-1}\\| = |c|^{-1} \\cdot \\|A^{-1}\\|$. So $\\kappa(cA) = \\|cA\\| \\cdot \\|(cA)^{-1}\\| = |c| \\cdot |c|^{-1} \\cdot \\|A\\| \\cdot \\|A^{-1}\\| = \\kappa(A)$. The factors of $|c|$ cancel exactly. This means the condition number is a *relative* quantity, sensitive to a matrix's shape but not its overall magnitude.",
          trickAnalysis: [
            { choice: 'B' as const, why: 'False — only the identity matrix has $\\kappa = 1$. Most matrices have $\\kappa > 1$.' },
            { choice: 'C' as const, why: 'Far too sweeping. Scaling does affect many things — for example, the singular values themselves scale.' },
            { choice: 'D' as const, why: 'Not a coincidence — it follows from the algebraic identity above.' },
            { choice: 'E' as const, why: 'True that scaling preserves rank, but that is a separate fact. The reason $\\kappa$ is preserved is the cancellation, not rank invariance. Earns partial credit if interpreted very generously.' },
          ],
        },
      },
    ],
  },
};
