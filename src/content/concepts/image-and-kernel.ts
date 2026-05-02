import type { Concept } from '../types';

export const imageAndKernel: Concept = {
  id: 'image-and-kernel',
  unitId: 'ch3',
  number: '3.5',
  title: 'Image & Kernel',
  blurb: 'Two subspaces that capture everything important about a linear transformation.',
  tier: 'full',

  learn: {
    overview: `
Every [[linear-transformation-defs|linear transformation]] $T: V \\to W$ has two distinguished [[subspaces]] associated with it: the **kernel** in the domain, and the **image** in the codomain. Together, these two subspaces tell you almost everything you need to know about $T$ — its [[injective-surjective|injectivity, surjectivity]], its [[rank-and-nullity|rank, nullity]], and its place in the [[fundamental-theorem|Fundamental Theorem of Linear Algebra]].

The **kernel** of $T$ is $\\ker(T) = \\{v \\in V : T(v) = 0\\}$ — the set of vectors that $T$ collapses to zero. It is always a [[subspaces|subspace]] of $V$: the zero vector is in it (since $T(0) = 0$), it is closed under addition ($T(u + v) = T(u) + T(v) = 0 + 0 = 0$), and it is closed under scalar multiplication. The kernel measures how "non-injective" $T$ is: a trivial kernel ($\\{0\\}$) means $T$ is injective; a large kernel means many vectors collapse to zero.

The **image** of $T$ is $\\text{im}(T) = \\{w \\in W : w = T(v) \\text{ for some } v \\in V\\}$ — the set of all outputs $T$ can produce. It is always a subspace of $W$, by similar closure arguments. The image measures how "surjective" $T$ is: $\\text{im}(T) = W$ means surjective; a strict subspace means $T$ misses parts of the codomain.

For a matrix transformation $T(x) = Ax$ where $A$ is $m \\times n$:

- **The kernel of $T$ equals the null space of $A$** — the set of $x$ with $Ax = 0$. Computing the null space is a [[row-reduction|row-reduction]] exercise: bring $A$ to RREF, identify free variables, parameterize.

- **The image of $T$ equals the column space of $A$** — the span of $A$'s columns. This is because $Ax$ is by definition a linear combination of $A$'s columns with weights given by the entries of $x$.

So for matrices, "kernel" and "null space" are the same, and "image" and "column space" are the same. The two pieces of vocabulary come from two views: function-theoretic (kernel and image) versus matrix-algebraic (null space and column space). They describe identical objects.

A useful structural fact, sometimes called the **structure of solutions**: for any $b \\in W$, the solution set of $T(v) = b$ is either empty (if $b \\notin \\text{im}(T)$) or a coset $v_0 + \\ker(T)$ for any particular solution $v_0$. This generalizes the [[linear-systems|particular-plus-homogeneous]] decomposition from Unit 1: solutions form an affine subspace, parallel to the kernel.

The kernel and image are also the source of the four fundamental subspaces: $\\ker(T), \\text{im}(T), \\ker(T)^\\perp, \\text{im}(T)^\\perp$ — equivalent to the null space, column space, row space, and left null space of the matrix in the matrix view. The deep relationships among these are the content of the [[fundamental-theorem|Fundamental Theorem]] and its [[geometric-fundamental-theorem|geometric form]].
    `.trim(),

    definitions: [
      {
        term: 'Kernel',
        body: '$\\ker(T) = \\{v \\in V : T(v) = 0\\}$. A subspace of the domain. Also called the null space (especially in the matrix case).',
      },
      {
        term: 'Image',
        body: '$\\text{im}(T) = \\{T(v) : v \\in V\\}$. A subspace of the codomain. Also called the range or column space (in the matrix case).',
      },
      {
        term: 'Null space of a matrix',
        body: 'For an $m \\times n$ matrix $A$: $\\text{null}(A) = \\{x \\in \\mathbb{R}^n : Ax = 0\\}$. Equal to $\\ker(T)$ for the linear map $T(x) = Ax$.',
      },
      {
        term: 'Column space of a matrix',
        body: 'For an $m \\times n$ matrix $A$: $\\text{Col}(A) = \\text{span}\\{a_1, a_2, \\dots, a_n\\}$, the span of $A$\'s columns. Equal to $\\text{im}(T)$.',
      },
    ],

    theorems: [
      {
        name: 'Kernel and image are subspaces',
        statement: 'For any linear $T: V \\to W$, $\\ker(T)$ is a subspace of $V$ and $\\text{im}(T)$ is a subspace of $W$.',
        intuition: 'The closure properties are immediate from linearity. $\\ker(T)$ contains $0$ (since $T(0) = 0$), is closed under addition (sums of kernel vectors are kernel vectors), and closed under scalar multiplication. Similarly for the image.',
      },
      {
        name: 'Solution set structure',
        statement: 'For any $b \\in W$, the solution set $\\{v \\in V : T(v) = b\\}$ is either empty (if $b \\notin \\text{im}(T)$) or equal to $v_0 + \\ker(T)$ for any particular solution $v_0$.',
        intuition: 'If $T(v_0) = b$, then $T(v) = b \\iff T(v) - T(v_0) = 0 \\iff T(v - v_0) = 0 \\iff v - v_0 \\in \\ker(T)$. So all solutions are obtained from one solution by adding kernel elements.',
      },
      {
        name: 'Image equals column span (matrix case)',
        statement: 'For an $m \\times n$ matrix $A$ and the corresponding linear map $T(x) = Ax$: $\\text{im}(T) = \\text{Col}(A) = \\text{span}\\{a_1, \\dots, a_n\\}$, where $a_j$ is the $j$-th column of $A$.',
        intuition: '$Ax = \\sum_j x_j a_j$ — the matrix-vector product is exactly a linear combination of the columns weighted by the entries of $x$. So the set of outputs $\\{Ax : x \\in \\mathbb{R}^n\\}$ is exactly the span of the columns.',
      },
    ],

    keyFormulas: [
      '\\ker(T) = \\{v : T(v) = 0\\}',
      '\\text{im}(T) = \\{T(v) : v \\in V\\}',
      'T(v) = b \\implies v \\in v_0 + \\ker(T)',
      '\\text{im}(T) = \\text{span}\\{T(b_1), \\dots, T(b_n)\\} \\quad \\text{for basis } \\{b_i\\}',
    ],
  },

  explore: {
    vizComponent: 'KernelImageViz',
    description: 'Pick a $2 \\times 3$ or $3 \\times 2$ matrix and watch its kernel and image visualize as subspaces of the appropriate ambient spaces. The kernel appears as a line, plane, or point in the domain; the image as a line, plane, or filled region in the codomain. Drag matrix entries to deform $A$ — watch as the kernel grows when $A$ becomes singular, and watch the image collapse to a lower-dimensional subspace.',
    misconception: {
      title: 'The kernel and image live in DIFFERENT spaces',
      body: `
A persistent confusion: thinking the kernel and image are subspaces of the same space, or even comparable. They are not. For $T: V \\to W$:

- $\\ker(T) \\subseteq V$ — the kernel is in the domain.
- $\\text{im}(T) \\subseteq W$ — the image is in the codomain.

For $T: \\mathbb{R}^5 \\to \\mathbb{R}^3$, the kernel lives in $\\mathbb{R}^5$ and the image lives in $\\mathbb{R}^3$. Asking "is $\\ker(T) = \\text{im}(T)$" is a category error — they are subspaces of different ambient spaces.

A second misconception: thinking the column space of a row-reduced matrix is the same as the column space of the original matrix. It is not. Row operations preserve the row space and the rank, but they generally CHANGE the column space. To find a basis for the column space of $A$, identify the pivot columns of the [[row-reduction|RREF]] of $A$ — but then take those columns from the *original* $A$, not from the RREF.

A third trap: confusing "$T$ is surjective" with "$T$ is invertible." Surjectivity means the image equals the codomain, but the kernel could still be nontrivial. For example, $T: \\mathbb{R}^3 \\to \\mathbb{R}^2$ given by projection onto the first two coordinates is surjective, but its kernel is the $z$-axis. Surjectivity alone is not enough for invertibility.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute the kernel of a matrix',
        body: 'For $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\end{pmatrix}$: row-reduce by $R_2 \\to R_2 - 2 R_1$, giving $\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$. One pivot in column 1; columns 2 and 3 are non-pivot, so $y$ and $z$ are free variables.',
      },
      {
        title: 'Parameterize the kernel',
        body: 'From the first row, $x = -2y - 3z$. So $\\ker(A) = \\{(-2y - 3z, y, z) : y, z \\in \\mathbb{R}\\} = \\text{span}\\{(-2, 1, 0), (-3, 0, 1)\\}$, a 2-dimensional subspace of $\\mathbb{R}^3$.',
      },
      {
        title: 'Compute the image',
        body: 'The image is $\\text{Col}(A) = \\text{span}\\{(1, 2), (2, 4), (3, 6)\\}$. All three columns are scalar multiples of $(1, 2)$, so $\\text{Col}(A) = \\text{span}\\{(1, 2)\\}$, a 1-dimensional subspace of $\\mathbb{R}^2$.',
      },
    ],

    problems: [
      {
        id: 'P-3.5a',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'Consider the kernel of a linear transformation $T: V \\to W$. Which statement is necessarily FALSE?',
        choices: [
          { label: 'A' as const, body: 'The kernel is always a subspace of $V$.' },
          { label: 'B' as const, body: 'If $T$ is injective, then $\\ker(T) = \\{0_V\\}$.' },
          { label: 'C' as const, body: 'The kernel can be empty.' },
          { label: 'D' as const, body: 'The dimension of the kernel is called the nullity of $T$.' },
          { label: 'E' as const, body: 'If $v_1, v_2 \\in \\ker(T)$, then $v_1 + v_2 \\in \\ker(T)$.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The kernel always contains at least the zero vector (since $T(0) = 0$ for any linear $T$). So the kernel is never empty. The other statements are all standard facts: kernel is a subspace, kernel = $\\{0\\}$ characterizes injectivity, dim of kernel = nullity, and kernels are closed under addition.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'True — kernels are always subspaces.' },
            { choice: 'B' as const, why: 'True — $\\ker(T) = \\{0\\}$ is the kernel characterization of injectivity.' },
            { choice: 'D' as const, why: 'True — nullity is by definition $\\dim(\\ker(T))$.' },
            { choice: 'E' as const, why: 'True — kernels are closed under addition (this is part of being a subspace).' },
          ],
        },
      },
      {
        id: 'P-3.5b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Let $T: \\mathbb{R}^3 \\to \\mathbb{R}^2$ be a linear transformation. Which of the following must be true about the image of $T$?',
        choices: [
          { label: 'A' as const, body: '$\\text{im}(T) = \\mathbb{R}^2$ — $T$ is always surjective.' },
          { label: 'B' as const, body: '$\\dim(\\text{im}(T)) \\leq 2$.' },
          { label: 'C' as const, body: '$\\dim(\\text{im}(T)) = 3$.' },
          { label: 'D' as const, body: '$\\text{im}(T) = \\{0\\}$ — $T$ is the zero transformation.' },
          { label: 'E' as const, body: '$\\dim(\\text{im}(T)) \\geq 2$.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The image of $T$ is a subspace of the codomain $\\mathbb{R}^2$, so $\\dim(\\text{im}(T)) \\leq \\dim(\\mathbb{R}^2) = 2$. This is a hard upper bound: no subspace of $\\mathbb{R}^2$ can have dimension greater than $2$. The actual dimension can be $0$, $1$, or $2$ depending on $T$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Not all maps are surjective. The zero map has image $\\{0\\}$.' },
            { choice: 'C' as const, why: 'Cannot exceed the codomain dimension. $\\dim(\\text{im}(T)) \\leq 2$.' },
            { choice: 'D' as const, why: 'Too restrictive — only true for the zero map. Most maps have nontrivial images.' },
            { choice: 'E' as const, why: 'Too restrictive in the other direction — could be $0$, $1$, or $2$, not always $\\geq 2$.' },
          ],
        },
      },
      {
        id: 'P-3.5c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For the matrix $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\end{pmatrix}$ representing $T: \\mathbb{R}^3 \\to \\mathbb{R}^2$, what is $\\dim(\\ker(T))$?',
        choices: [
          { label: 'A' as const, body: '$0$ — $T$ is injective.' },
          { label: 'B' as const, body: '$1$' },
          { label: 'C' as const, body: '$2$' },
          { label: 'D' as const, body: '$3$ — $T$ is the zero map.' },
          { label: 'E' as const, body: 'Cannot be determined.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'The two rows are scalar multiples (row 2 = $2 \\cdot$ row 1), so $\\text{rank}(A) = 1$. By rank-nullity, $\\dim(\\ker(T)) = 3 - \\text{rank}(A) = 3 - 1 = 2$.',
          partialCredit: '(B) earns partial credit for being close — students who recognize the matrix has rank deficiency but compute the nullity as $3 - 2 = 1$ instead of $3 - 1 = 2$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Would be true if the rows were independent, but they are not — they are scalar multiples.' },
            { choice: 'B' as const, why: 'Off by one. Earns partial credit.' },
            { choice: 'D' as const, why: 'Would mean $T$ is the zero map, but $A$ is not the zero matrix — its first row $(1, 2, 3)$ is nonzero.' },
            { choice: 'E' as const, why: 'Can be computed: $\\dim(\\ker) = 3 - \\text{rank}(A) = 3 - 1 = 2$.' },
          ],
        },
      },
      {
        id: 'P-3.5d',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'For the same matrix $A$ from the previous problem, what is the rank of the transformation $T$?',
        choices: [
          { label: 'A' as const, body: '$0$' },
          { label: 'B' as const, body: '$1$' },
          { label: 'C' as const, body: '$2$' },
          { label: 'D' as const, body: '$3$' },
          { label: 'E' as const, body: 'Undefined for non-square matrices.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'The rank equals the dimension of the image, which is the column space. All three columns of $A$ are scalar multiples of $(1, 2)$, so the column space is 1-dimensional. Equivalently: rows are dependent, so $\\text{rank}(A) = 1$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Would mean $A$ is the zero matrix, but it is not.' },
            { choice: 'C' as const, why: 'Treats the rows as independent. They are not — row 2 is twice row 1.' },
            { choice: 'D' as const, why: 'Exceeds possible rank: $\\text{rank}(A) \\leq \\min(m, n) = \\min(2, 3) = 2$.' },
            { choice: 'E' as const, why: 'Rank is well-defined for any matrix, square or not.' },
          ],
        },
      },
    ],
  },
};
