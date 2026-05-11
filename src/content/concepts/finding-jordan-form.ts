import type { Concept } from '../types';

export const findingJordanForm: Concept = {
  id: 'finding-jordan-form',
  unitId: 'ch8',
  number: '8.4',
  title: 'Finding the Jordan Form',
  blurb: 'Counting Jordan blocks from kernel-power dimensions: how to read off the Jordan structure without computing generalized eigenvectors by hand.',
  tier: 'full',

  learn: {
    overview: `
The [[jordan-form|Jordan canonical form]] of a matrix $A$ is determined entirely by combinatorial data: the eigenvalues and the partition of each eigenvalue\'s algebraic multiplicity into block sizes. The crucial insight is that one can read off the partition without ever constructing the eigenvectors explicitly — just by counting the dimensions of the iterated kernels $\\ker(A - \\lambda I)^k$.

For each eigenvalue $\\lambda$ and each $k \\geq 1$, let $d_k = \\dim \\ker(A - \\lambda I)^k$. As $k$ grows, $d_k$ is non-decreasing (each kernel contains the previous one). It stabilizes at some value $d_\\infty$ equal to the algebraic multiplicity of $\\lambda$. The differences $d_1, d_2 - d_1, d_3 - d_2, \\ldots$ form a non-increasing sequence whose entries are the number of Jordan blocks of size at least $k$. Specifically:
$$\\text{# blocks of size} \\geq k \\text{ for } \\lambda = d_k - d_{k-1} \\quad (\\text{with } d_0 = 0).$$
This is the **block-counting formula**. From it the number of blocks of EXACTLY size $k$ is $(d_k - d_{k-1}) - (d_{k+1} - d_k) = 2d_k - d_{k-1} - d_{k+1}$.

A concrete example. Suppose $\\lambda$ has algebraic multiplicity 5 and we compute $d_1 = 3$, $d_2 = 4$, $d_3 = 5$, $d_4 = 5, \\ldots$ Then the number of blocks of size $\\geq 1$ is $d_1 - d_0 = 3$, of size $\\geq 2$ is $d_2 - d_1 = 1$, of size $\\geq 3$ is $d_3 - d_2 = 1$, of size $\\geq 4$ is $d_4 - d_3 = 0$. So there are: 3 blocks (total), of which 1 has size $\\geq 2$ and 1 has size $\\geq 3$. The block sizes are 3, 1, 1 (one block of size 3, two of size 1), partitioning the algebraic multiplicity 5 correctly. The geometric multiplicity $d_1 = 3$ is the total number of blocks. The Jordan structure is $J_3(\\lambda) \\oplus J_1(\\lambda) \\oplus J_1(\\lambda)$.

The procedure for computing a Jordan form of an arbitrary matrix is therefore:
1. Compute the characteristic polynomial and extract distinct eigenvalues with algebraic multiplicities.
2. For each $\\lambda$, compute $d_1, d_2, \\ldots$ until $d_k$ stabilizes.
3. Apply the block-counting formula to read off the Jordan block sizes for that $\\lambda$.
4. Stack the blocks into the Jordan canonical form.

Note this requires NO computation of generalized eigenvectors. The block sizes are determined by kernel dimensions of polynomial matrix functions, which are pure linear algebra. The change-of-basis matrix $P$ such that $P^{-1}AP = J$ does require constructing generalized eigenvectors, but in ESE 2030 the focus is on identifying the structure, not computing $P$.

For the [[matrix-exponentials|matrix exponential]], all you need is the Jordan structure: the formula $e^{Jt}$ for a Jordan canonical form $J$ is block-diagonal with each block being an exponential of the corresponding Jordan block, computable from the $k \\times k$ formula in [[jordan-form|section 8.3]]. So even without the change-of-basis matrix, you can determine the qualitative structure of solutions to $\\dot{\\mathbf{x}} = A\\mathbf{x}$: the basis includes terms $t^j e^{\\lambda t}$ where the maximum $j$ for each $\\lambda$ is one less than the largest Jordan block size for $\\lambda$.

The block-counting formula also reveals which matrices are [[simple-diagonalization|diagonalizable]]: $A$ is diagonalizable if and only if $d_1 = d_\\infty$ for every eigenvalue (the eigenspace already accounts for everything, so no higher kernel power adds dimension). When $d_2 > d_1$ for some $\\lambda$, there is at least one block of size $\\geq 2$, and the matrix is not diagonalizable.

A subtle point: the generalized eigenspace for $\\lambda$ is $\\ker(A - \\lambda I)^\\infty = \\ker(A - \\lambda I)^k$ for $k$ at least the size of the largest block. Its dimension is the algebraic multiplicity of $\\lambda$, regardless of the block structure. The full space decomposes as a direct sum of generalized eigenspaces across distinct eigenvalues. This decomposition is the [[fundamental-theorem|FTLA]] for non-diagonalizable matrices: it generalizes the eigenspace decomposition from the diagonalizable case.
    `.trim(),

    definitions: [
      {
        term: 'Iterated kernel sequence',
        body: 'For eigenvalue $\\lambda$ and $k \\geq 0$, the dimensions $d_k = \\dim \\ker(A - \\lambda I)^k$, with $d_0 = 0$. The sequence is strictly increasing until it stabilizes at $d_\\infty = $ algebraic multiplicity of $\\lambda$.',
      },
      {
        term: 'Block-counting formula',
        body: 'The number of Jordan blocks of size at least $k$ for eigenvalue $\\lambda$ is $d_k - d_{k-1}$. The number of blocks of exactly size $k$ is $2d_k - d_{k-1} - d_{k+1}$.',
      },
      {
        term: 'Index of an eigenvalue',
        body: 'The smallest $k$ such that $d_k = d_{k+1}$, equivalently the size of the largest Jordan block for $\\lambda$. This is the highest power of $t$ in the polynomial-times-exponential terms $t^{k-1}e^{\\lambda t}$ appearing in $e^{At}$.',
      },
      {
        term: 'Generalized eigenspace',
        body: 'The subspace $\\ker(A - \\lambda I)^\\infty$, which equals $\\ker(A - \\lambda I)^k$ once $k$ reaches the index of $\\lambda$. Its dimension equals the algebraic multiplicity of $\\lambda$.',
      },
    ],

    theorems: [
      {
        name: 'Block-size determination',
        statement: 'The Jordan block sizes for eigenvalue $\\lambda$ are determined by the dimensions $d_k = \\dim \\ker(A - \\lambda I)^k$ via the formula: $\\text{# blocks of size} \\geq k = d_k - d_{k-1}$.',
        intuition: 'Each Jordan block of size $m$ for $\\lambda$ contributes 1 to $d_1$ (one ordinary eigenvector), 1 more to $d_2$ (one generalized eigenvector at depth 2), and so on, contributing 1 to each $d_k$ for $k \\leq m$ and 0 for $k > m$. Summing across all blocks: $d_k - d_{k-1}$ counts exactly the blocks of size $\\geq k$. The "filtration" $\\ker \\subset \\ker^2 \\subset \\cdots$ peels off generalized eigenvectors one chain-level at a time.',
      },
      {
        name: 'Generalized eigenspace decomposition',
        statement: 'For a matrix $A$ with distinct eigenvalues $\\lambda_1, \\ldots, \\lambda_r$, the space decomposes as $V = \\bigoplus_{i=1}^r \\ker(A - \\lambda_i I)^{m_i}$ where $m_i$ is the algebraic multiplicity of $\\lambda_i$. Each summand is invariant under $A$.',
        intuition: 'This is the [[fundamental-theorem|FTLA-style]] structural decomposition that powers the Jordan form. Each generalized eigenspace is the "natural home" of one eigenvalue, an [[image-and-kernel|invariant subspace]] on which $A$ acts as $\\lambda I + $ nilpotent. Outside its eigenvalue, every generalized eigenspace looks invisible — vectors in $\\ker(A - \\lambda_i I)^{m_i}$ are annihilated by powers of $A - \\lambda_i I$ but generally NOT by $A - \\lambda_j I$ for $j \\neq i$.',
      },
      {
        name: 'Diagonalizability via kernel dimensions',
        statement: '$A$ is diagonalizable if and only if for every eigenvalue $\\lambda$, $\\dim \\ker(A - \\lambda I) = $ algebraic multiplicity of $\\lambda$ (equivalently, $d_1 = d_\\infty$ for every eigenvalue).',
        intuition: 'Diagonalizability means every Jordan block has size 1, equivalently $d_k = d_1$ for all $k$, equivalently the eigenspace already contains the full generalized eigenspace. The geometric multiplicity at level 1 is enough — no need to descend to higher kernel powers to find generalized eigenvectors.',
      },
    ],

    keyFormulas: [
      'd_k = \\dim \\ker(A - \\lambda I)^k',
      '\\text{# blocks of size} \\geq k = d_k - d_{k-1}',
      '\\text{# blocks of size exactly } k = 2d_k - d_{k-1} - d_{k+1}',
      '\\text{algebraic mult.}(\\lambda) = d_\\infty = \\dim \\ker(A - \\lambda I)^{\\text{index}}',
      '\\text{geometric mult.}(\\lambda) = d_1 = \\dim \\ker(A - \\lambda I)',
    ],
  },

  explore: {
    vizComponent: 'IteratedKernelViz',
    description: 'A $5 \\times 5$ matrix $A$ with a chosen eigenvalue $\\lambda$ is fixed. The viz shows a nested sequence of kernels $\\ker(A - \\lambda I) \\subset \\ker(A - \\lambda I)^2 \\subset \\cdots$ as concentric "rings" inside the 5D space, with dimensions $d_1, d_2, \\ldots$ labeled. As the user clicks a slider to advance $k$, the active ring expands until it stabilizes at the generalized eigenspace; the dimension counts populate a small table to the side. The Jordan block structure (e.g., "3, 1, 1") is computed live from the differences $d_k - d_{k-1}$. A "reveal" button shows the resulting Jordan form as a block-diagonal matrix.',
    misconception: {
      title: 'The block sizes are not the dimensions $d_k$ themselves — they are the differences $d_k - d_{k-1}$.',
      body: `Students often confuse the cumulative kernel dimensions with the block sizes themselves. The dimensions $d_1, d_2, d_3, \\ldots$ are CUMULATIVE: $d_k$ is the dimension of $\\ker(A - \\lambda I)^k$, which CONTAINS $\\ker(A - \\lambda I)^{k-1}$. To extract block sizes, you take DIFFERENCES. Specifically, $d_k - d_{k-1}$ is the number of blocks of size $\\geq k$, and the number of blocks of exactly size $k$ is $(d_k - d_{k-1}) - (d_{k+1} - d_k)$.

Example. Suppose $\\lambda$ has algebraic multiplicity 5 and we compute $d_1 = 3, d_2 = 4, d_3 = 5$. The wrong reading is "three Jordan blocks of sizes $3, 4, 5$" — total 12, far exceeding 5. The right reading: blocks of size $\\geq 1$: $d_1 - d_0 = 3 - 0 = 3$. Blocks of size $\\geq 2$: $d_2 - d_1 = 4 - 3 = 1$. Blocks of size $\\geq 3$: $d_3 - d_2 = 5 - 4 = 1$. Blocks of size $\\geq 4$: $d_4 - d_3 = 0$ (kernel stabilized). So: 3 total blocks, 1 of size $\\geq 2$, 1 of size $\\geq 3$. Block sizes: 3, 1, 1.

A second misconception is computing $\\ker(A - \\lambda I)^k$ as $(\\ker(A - \\lambda I))^k$ or as "the kernel of $A^k - \\lambda^k I$." Neither is right. $\\ker(A - \\lambda I)^k$ means the kernel of the matrix $(A - \\lambda I)^k$, where the matrix $A - \\lambda I$ is raised to the $k$-th power and THEN the kernel of that product is computed. The kernel of the matrix product is generally LARGER than the kernel of any single factor (because more vectors get killed when you compose).

A third trap is forgetting that the kernel sequence stabilizes. Once $d_{k+1} = d_k$, all higher $d$'s are equal — you cannot get MORE generalized eigenvectors by going to higher powers. The stabilization point IS the index of $\\lambda$, and the kernel at that point IS the generalized eigenspace. Computing $d_{k+1}$ beyond stabilization is wasted work; the algorithm should terminate once a fixed point is reached.

A fourth issue: trying to read off Jordan block sizes by inspecting the matrix entries directly. Block sizes are similarity invariants computed from kernel dimensions, NOT from matrix entries. Two similar matrices can look completely different element-by-element but have identical Jordan forms.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1 — set up the matrix and find eigenvalues',
        body: 'Let $A$ be a $4 \\times 4$ matrix with characteristic polynomial $(\\lambda - 1)^4$. So $\\lambda = 1$ is the only eigenvalue, with algebraic multiplicity 4.',
      },
      {
        title: 'Step 2 — compute kernel dimensions',
        body: 'Suppose we compute $d_1 = \\dim \\ker(A - I) = 2$, $d_2 = \\dim \\ker(A - I)^2 = 3$, $d_3 = \\dim \\ker(A - I)^3 = 4$, $d_4 = 4$ (stabilized).',
      },
      {
        title: 'Step 3 — apply the block-counting formula',
        body: 'Blocks of size $\\geq 1$: $d_1 - d_0 = 2$. Blocks of size $\\geq 2$: $d_2 - d_1 = 1$. Blocks of size $\\geq 3$: $d_3 - d_2 = 1$. Blocks of size $\\geq 4$: $d_4 - d_3 = 0$. So: 2 total blocks, 1 of size $\\geq 2$, 1 of size $\\geq 3$. Block sizes: 3, 1. Jordan form: $J_3(1) \\oplus J_1(1)$. The basis of solutions for $\\dot{\\mathbf{x}} = A\\mathbf{x}$ includes $e^t, te^t, t^2 e^t / 2$ (from the size-3 block) and $e^t$ (from the size-1 block).',
      },
    ],

    problems: [
      {
        id: 'P-8.4a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A $5 \\times 5$ matrix $A$ has a single eigenvalue $\\lambda = 0$ (algebraic multiplicity 5). The iterated kernel dimensions are $d_1 = 3, d_2 = 4, d_3 = 5, d_4 = 5$. What are the Jordan block sizes for $\\lambda = 0$?',
        choices: [
          { label: 'A' as const, body: '$3, 4, 5$.' },
          { label: 'B' as const, body: '$5$ (one block of size 5).' },
          { label: 'C' as const, body: '$3, 1, 1$.' },
          { label: 'D' as const, body: '$2, 2, 1$.' },
          { label: 'E' as const, body: '$1, 1, 1, 1, 1$.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'Apply the block-counting formula. Blocks of size $\\geq 1$: $d_1 - d_0 = 3 - 0 = 3$. Blocks of size $\\geq 2$: $d_2 - d_1 = 4 - 3 = 1$. Blocks of size $\\geq 3$: $d_3 - d_2 = 5 - 4 = 1$. Blocks of size $\\geq 4$: $d_4 - d_3 = 5 - 5 = 0$. So: 3 total blocks; one has size $\\geq 2$; one has size $\\geq 3$. Block sizes are 3, 1, 1 (one block of size 3 containing the size-$\\geq 2$ and size-$\\geq 3$ counts, two of size 1 to fill out the total count). The sizes sum to $3 + 1 + 1 = 5$, matching the algebraic multiplicity.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Reads the $d_k$ values directly as block sizes — the most common error. The $d_k$ are CUMULATIVE kernel dimensions; block sizes are their DIFFERENCES.' },
            { choice: 'B' as const, why: 'Would require $d_1 = 1$ (only one eigenvector) — contradicts $d_1 = 3$.' },
            { choice: 'D' as const, why: 'Block sizes $2, 2, 1$ sum to 5 correctly but require $d_1 = 3, d_2 = 5$ (both size-2 blocks contribute fully at $k = 2$). Here $d_2 = 4$, so only one block has size $\\geq 2$, not two.' },
            { choice: 'E' as const, why: 'Diagonalizable case — requires $d_1 = 5 = $ algebraic multiplicity. Here $d_1 = 3 < 5$, so $A$ is defective.' },
          ],
        },
      },
      {
        id: 'P-8.4b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A matrix $A$ has eigenvalue $\\lambda$ with $\\dim \\ker(A - \\lambda I) = 2$ and $\\dim \\ker(A - \\lambda I)^2 = 4$. What is the smallest possible size of the largest Jordan block for $\\lambda$?',
        choices: [
          { label: 'A' as const, body: '$1$' },
          { label: 'B' as const, body: '$2$' },
          { label: 'C' as const, body: '$3$' },
          { label: 'D' as const, body: '$4$' },
          { label: 'E' as const, body: 'Cannot be determined.' },
        ],
        correctAnswer: 'B' as const,
        solution: {
          explanation: 'Blocks of size $\\geq 2$ count $d_2 - d_1 = 4 - 2 = 2$. So $\\lambda$ has TWO Jordan blocks of size $\\geq 2$. Since $d_1 = 2$ total blocks, BOTH blocks have size $\\geq 2$. The smallest possible size for the largest block is 2 — this occurs when both blocks are EXACTLY size 2 (algebraic multiplicity 4, block sizes $2, 2$). The largest block could also be larger (e.g., sizes $3, 2$ or $4, 2$), but the smallest possible value is 2.',
          partialCredit: 'A (correct if misreading "smallest" — a Jordan block of size 1 would have $d_2 = d_1$, contradicting $d_2 = 4 > 2 = d_1$).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Size-1 blocks have $d_2 = d_1$ (kernel does not grow). But here $d_2 = 4 > 2 = d_1$, so at least one block has size $\\geq 2$. In fact BOTH blocks do.' },
            { choice: 'C' as const, why: 'Possible (block sizes $3, 1$ — but this requires only ONE block of size $\\geq 2$, giving $d_2 = d_1 + 1 = 3 \\neq 4$). Inconsistent with the given $d_2 = 4$.' },
            { choice: 'D' as const, why: 'Possible if the second block has size 1 and the first is size 4 — but that gives ONE block of size $\\geq 2$, contradicting $d_2 - d_1 = 2$.' },
            { choice: 'E' as const, why: 'Fully determined by the kernel dimensions; the smallest possible largest-block-size is 2.' },
          ],
        },
      },
      {
        id: 'P-8.4c',
        format: 'multiple-choice' as const,
        difficulty: 1,
        statement: 'A $4 \\times 4$ matrix $A$ has eigenvalue $\\lambda = 5$ with algebraic multiplicity 4. Suppose $\\dim \\ker(A - 5I) = 4$. What is the Jordan form of $A$?',
        choices: [
          { label: 'A' as const, body: '$\\mathrm{diag}(5, 5, 5, 5)$' },
          { label: 'B' as const, body: '$J_4(5)$ (a single $4 \\times 4$ Jordan block).' },
          { label: 'C' as const, body: '$J_2(5) \\oplus J_2(5)$' },
          { label: 'D' as const, body: '$J_3(5) \\oplus J_1(5)$' },
          { label: 'E' as const, body: 'Cannot be determined.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: '$\\dim \\ker(A - 5I) = 4 = $ algebraic multiplicity, so geometric multiplicity equals algebraic multiplicity. By the diagonalizability criterion, $A$ is diagonalizable. With a single eigenvalue $\\lambda = 5$ of multiplicity 4 and geometric multiplicity 4, the Jordan form is $\\mathrm{diag}(5, 5, 5, 5) = 5I$. All four Jordan blocks are size 1.',
          trickAnalysis: [
            { choice: 'B' as const, why: '$J_4(5)$ has $\\dim \\ker(A - 5I) = 1$ (one eigenvector). Contradicts $\\dim \\ker = 4$.' },
            { choice: 'C' as const, why: '$J_2(5) \\oplus J_2(5)$ has $\\dim \\ker(A - 5I) = 2$ (one eigenvector per block). Contradicts $\\dim \\ker = 4$.' },
            { choice: 'D' as const, why: '$J_3(5) \\oplus J_1(5)$ has $\\dim \\ker(A - 5I) = 2$ (one eigenvector per block). Contradicts $\\dim \\ker = 4$.' },
            { choice: 'E' as const, why: 'Fully determined: $\\dim \\ker(A - 5I) = $ algebraic multiplicity forces diagonalizability and hence the single Jordan form (A).' },
          ],
        },
      },
    ],
  },
};
