import type { Concept } from '../types';

export const inverses: Concept = {
  id: 'inverses',
  unitId: 'ch1',
  number: '1.4',
  title: 'Inverses & Invertibility',
  blurb: 'When a matrix can be undone, and the four equivalent ways of telling.',
  tier: 'full',

  learn: {
    overview: `
A square matrix $A$ is **invertible** (or **nonsingular**) if there exists a matrix $A^{-1}$ such that $A A^{-1} = A^{-1} A = I$. Geometrically, this means the linear transformation $A$ has an undo button — every output of $A$ corresponds to exactly one input, and we can compute the input from the output. Algebraically, it means the equation $Ax = b$ has a unique solution for every $b$, namely $x = A^{-1} b$.

Invertibility is one of the most important properties a matrix can have, and remarkably, there are many seemingly different ways to characterize it — all of them equivalent. A matrix is invertible if and only if its determinant is nonzero, if and only if its rows are linearly independent, if and only if its columns are linearly independent, if and only if [[row-reduction]] of $A$ produces the identity, if and only if $Ax = 0$ has only the trivial solution, if and only if it is a product of [[gaussian-elimination|elementary matrices]]. These conditions all collapse into a single concept once you have the language of [[image-and-kernel|kernel and image]] and [[fundamental-theorem|the fundamental theorem]].

The textbook offers four perspectives on invertibility, each useful in different contexts. The **algebraic** perspective uses the determinant. The **analytic** perspective uses the equation $Ax = 0$ and asks whether it has only the trivial solution. The **computational** perspective uses [[row-reduction]] of $[A \\mid I]$ to find $A^{-1}$ explicitly when it exists. The **structural** perspective notes that an invertible matrix is one whose action on vectors is a bijection from $\\mathbb{R}^n$ to itself — equivalent to it being an [[injective-surjective|isomorphism]].

A non-square matrix cannot be invertible in the strict sense, but it may have a **left inverse** or a **right inverse**, or a generalized inverse — the [[least-squares|Moore-Penrose pseudoinverse]] is the most important example, and it appears later in the orthogonality chapter.
    `.trim(),

    definitions: [
      {
        term: 'Invertible matrix',
        body: 'A square matrix $A$ for which there exists a matrix $A^{-1}$ with $A A^{-1} = A^{-1} A = I$. The inverse, when it exists, is unique.',
      },
      {
        term: 'Singular matrix',
        body: 'A square matrix that is not invertible. Equivalently, $\\det(A) = 0$, or the columns are [[span-and-independence|linearly dependent]].',
      },
      {
        term: 'Determinant',
        body: 'A scalar $\\det(A)$ associated with each square matrix, equal to zero if and only if $A$ is singular. For a $2 \\times 2$ matrix $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, $\\det = ad - bc$. Geometrically, $|\\det(A)|$ is the factor by which $A$ scales volumes.',
      },
    ],

    theorems: [
      {
        name: 'Equivalent characterizations of invertibility',
        statement: 'For a square $n \\times n$ matrix $A$, the following are equivalent: (i) $A$ is invertible; (ii) $\\det(A) \\neq 0$; (iii) $Ax = 0$ has only the trivial solution $x = 0$; (iv) $\\text{RREF}(A) = I_n$; (v) $A$ has $n$ pivots; (vi) the columns of $A$ are linearly independent; (vii) the rows of $A$ are linearly independent; (viii) $A$ is a product of [[gaussian-elimination|elementary matrices]].',
        intuition: 'These are not separate facts to memorize — they are all the same fact, viewed from different angles. Each is most useful in a different context: (ii) for theoretical proofs, (iii) for showing uniqueness, (iv) for computing the inverse, (vi) and (vii) for connecting to [[span-and-independence]].',
      },
      {
        name: 'Computing the inverse via row reduction',
        statement: 'If $A$ is invertible, then row-reducing $[A \\mid I]$ to RREF produces $[I \\mid A^{-1}]$. If $A$ is singular, this process fails — you cannot reach $I$ on the left.',
        intuition: 'Row-reducing $A$ to $I$ is the same as left-multiplying $A$ by some sequence of [[gaussian-elimination|elementary matrices]] $E_k \\cdots E_1$. The product $E_k \\cdots E_1 = A^{-1}$, and applying the same operations to $I$ records this product directly.',
      },
      {
        name: 'Inverses compose',
        statement: 'If $A$ and $B$ are invertible $n \\times n$ matrices, then $AB$ is invertible and $(AB)^{-1} = B^{-1} A^{-1}$.',
        intuition: 'To undo "first $B$, then $A$," you undo $A$ first, then undo $B$ — like taking off shoes, then socks. The order reversal is essential.',
      },
    ],

    keyFormulas: [
      'A A^{-1} = A^{-1} A = I',
      '(AB)^{-1} = B^{-1} A^{-1}',
      '\\det(A) \\neq 0 \\iff A \\text{ is invertible}',
      '[A \\mid I] \\xrightarrow{\\text{RREF}} [I \\mid A^{-1}]',
    ],
  },

  explore: {
    vizComponent: 'InverseViz',
    description: "Adjust the entries of a $2 \\times 2$ matrix and watch its determinant. When the determinant is nonzero, the matrix is invertible and the inverse is computed live. When the determinant approaches zero, watch the inverse's entries blow up — this is the signature of an [[rank-and-conditioning|ill-conditioned]] matrix.",
    misconception: {
      title: 'A "small determinant" matrix is not the same as a singular matrix',
      body: `
A matrix is either invertible or it isn't — there is no continuum. But computationally, a matrix with a determinant very close to zero behaves badly: its inverse has very large entries, and small errors in $A$ or $b$ produce large errors in the solution to $Ax = b$.

This is the difference between **theoretical invertibility** and **practical conditioning**. The first is binary; the second is a question of degree, captured by the [[rank-and-conditioning|condition number]] $\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\|$. In numerical practice, an "almost singular" matrix is treated with as much suspicion as a truly singular one — the math may say it has an inverse, but computing with it is unreliable.

A related confusion: thinking the inverse "always exists, just sometimes hard to compute." For a singular matrix, the inverse genuinely does not exist; no algorithm can produce it. Numerical solvers signal this by returning a warning or refusing to proceed.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute a $2 \\times 2$ inverse',
        body: 'For $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$, $\\det A = 2 \\cdot 1 - 1 \\cdot 1 = 1$. The inverse formula gives $A^{-1} = \\frac{1}{\\det A} \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$.',
      },
      {
        title: 'Verify',
        body: '$A A^{-1} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = I$. ✓',
      },
    ],

    problems: [
      {
        id: 'P-1.4a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Which of the following is NOT equivalent to "$A$ is invertible" for a square $n \\times n$ matrix?',
        choices: [
          { label: 'A' as const, body: '$\\det(A) \\neq 0$.' },
          { label: 'B' as const, body: 'The columns of $A$ are linearly independent.' },
          { label: 'C' as const, body: '$Ax = 0$ has only the trivial solution $x = 0$.' },
          { label: 'D' as const, body: 'The RREF of $A$ is the identity matrix $I_n$.' },
          { label: 'E' as const, body: '$A$ has more rows than columns.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: '"More rows than columns" describes a non-square (tall) matrix, which by definition cannot be invertible — invertibility is only defined for square matrices. The other four are all equivalent characterizations of invertibility for a square matrix.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Equivalent — $\\det(A) \\neq 0$ is one of the standard tests.' },
            { choice: 'B' as const, why: 'Equivalent — linear independence of columns means the only $x$ with $Ax = 0$ is $x = 0$, which is the same as injectivity.' },
            { choice: 'C' as const, why: 'Equivalent — same fact as (B), restated.' },
            { choice: 'D' as const, why: 'Equivalent — RREF reaches $I_n$ exactly when $A$ is invertible.' },
          ],
        },
      },
      {
        id: 'P-1.4b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'If $A$ and $B$ are invertible $n \\times n$ matrices, which of the following equals $(AB)^{-1}$?',
        choices: [
          { label: 'A' as const, body: '$A^{-1} B^{-1}$' },
          { label: 'B' as const, body: '$B^{-1} A^{-1}$' },
          { label: 'C' as const, body: '$(BA)^{-1}$' },
          { label: 'D' as const, body: '$A B^{-1}$' },
          { label: 'E' as const, body: '$(B^{-1})(A^{-1})^T$' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'To verify: $(AB)(B^{-1} A^{-1}) = A(B B^{-1}) A^{-1} = A \\cdot I \\cdot A^{-1} = A A^{-1} = I$. So $(AB)^{-1} = B^{-1} A^{-1}$. Intuition: to undo "first $B$, then $A$," you must undo $A$ first, then undo $B$ — like taking off shoes and then socks.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Reverses the correct order. $(AB)(A^{-1} B^{-1}) = A B A^{-1} B^{-1}$, which does NOT simplify to $I$ in general because matrix multiplication is non-commutative.' },
            { choice: 'C' as const, why: '$(BA)^{-1} = A^{-1} B^{-1}$ — also wrong order. And $BA$ is not the same as $AB$ in general.' },
            { choice: 'D' as const, why: 'Mixes inverted and non-inverted factors. Does not equal $I$ when multiplied by $AB$.' },
            { choice: 'E' as const, why: 'Introduces a transpose, which is not part of the inverse formula.' },
          ],
        },
      },
      {
        id: 'P-1.4c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Suppose $A$ is invertible and $AB = AC$. Which conclusion is justified?',
        choices: [
          { label: 'A' as const, body: '$B = C$, by left-multiplying both sides by $A^{-1}$.' },
          { label: 'B' as const, body: '$B = C$ only if $A$ is also symmetric.' },
          { label: 'C' as const, body: 'Either $B = C$ or $A = 0$.' },
          { label: 'D' as const, body: '$B$ and $C$ must have the same number of rows.' },
          { label: 'E' as const, body: 'No conclusion is possible — the equation $AB = AC$ does not constrain $B$ and $C$.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Multiplying both sides of $AB = AC$ on the left by $A^{-1}$ gives $A^{-1}AB = A^{-1}AC$, which simplifies to $IB = IC$, i.e., $B = C$. This is the **left cancellation property** of invertible matrices. Note that it fails if $A$ is not invertible — for example, with $A = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$, we have $AB = AC$ for any $B, C$ that agree in their first row, regardless of their second rows.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Symmetry of $A$ is irrelevant. Invertibility alone is enough.' },
            { choice: 'C' as const, why: 'The conclusion "either $B = C$ or $A = 0$" is too weak — invertibility forces $B = C$ outright.' },
            { choice: 'D' as const, why: 'True but not the relevant conclusion. The equation $AB = AC$ can only hold if the dimensions match, but the question asks what it lets us conclude *about $B$ and $C$* — and the answer is they are equal.' },
            { choice: 'E' as const, why: 'False — invertibility is exactly what licenses the cancellation.' },
          ],
        },
      },
      {
        id: 'P-1.4d',
        format: 'multiple-choice' as const,
        difficulty: 3,
        statement: 'Which of the following correctly relates the inverse and transpose for an invertible matrix $A$?',
        choices: [
          { label: 'A' as const, body: '$(A^T)^{-1} = (A^{-1})^T$.' },
          { label: 'B' as const, body: '$(A^T)^{-1} = -(A^{-1})^T$.' },
          { label: 'C' as const, body: '$(A^T)^{-1} = A^{-1}$, since transpose and inverse are the same operation.' },
          { label: 'D' as const, body: '$(A^T)^{-1}$ does not exist in general, even when $A^{-1}$ does.' },
          { label: 'E' as const, body: '$(A^T)^{-1} = (A^T)^T = A$.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Take the transpose of $A A^{-1} = I$: $(A A^{-1})^T = I^T$, which gives $(A^{-1})^T A^T = I$. So $(A^{-1})^T$ is a left inverse of $A^T$, and (since $A^T$ is square and invertible) it is also the inverse: $(A^T)^{-1} = (A^{-1})^T$. The transpose and the inverse commute as operations.',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Inserts a spurious sign. There is no negation in the transpose-inverse relationship.' },
            { choice: 'C' as const, why: 'False — transpose and inverse are different operations. They coincide only for orthogonal matrices ($A^T = A^{-1}$), a special class.' },
            { choice: 'D' as const, why: 'False — if $A$ is invertible, so is $A^T$ (in fact, $\\det(A^T) = \\det(A) \\neq 0$).' },
            { choice: 'E' as const, why: 'Confuses two different identities. $(A^T)^T = A$ is true, but it does not equal $(A^T)^{-1}$ unless $A$ happens to be orthogonal.' },
          ],
        },
      },
    ],
  },
};
