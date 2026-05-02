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
        difficulty: 1,
        statement: 'Compute the inverse of $A = \\begin{pmatrix} 3 & 1 \\\\ 5 & 2 \\end{pmatrix}$ using the $2 \\times 2$ formula.',
        hint: '$\\det A = 6 - 5 = 1$. The inverse swaps the diagonal entries and negates the off-diagonal entries.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.4b',
        difficulty: 2,
        statement: 'Use the augmented-matrix method to find $A^{-1}$, where $A = \\begin{pmatrix} 1 & 2 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{pmatrix}$.',
        hint: 'Form $[A \\mid I_3]$ and row-reduce to $[I_3 \\mid A^{-1}]$. Since $A$ is upper triangular, you only need to eliminate above the diagonal.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.4c',
        difficulty: 2,
        statement: 'Show that if $A$ is invertible and $AB = AC$, then $B = C$. (This is the **left cancellation** property.) Show by example that the analogous claim fails for non-invertible $A$.',
        hint: 'For the first part, multiply on the left by $A^{-1}$. For the counterexample, find a singular $A$ and matrices $B \\neq C$ with $AB = AC$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.4d',
        difficulty: 3,
        statement: 'Let $A$ be invertible. Prove $(A^T)^{-1} = (A^{-1})^T$. (The transpose and the inverse commute.)',
        hint: 'Take the transpose of $A A^{-1} = I$ and use $(XY)^T = Y^T X^T$.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
