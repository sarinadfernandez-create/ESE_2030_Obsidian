import type { Concept } from '../types';

export const jordanForm: Concept = {
  id: 'jordan-form',
  unitId: 'ch8',
  number: '8.3',
  title: 'Jordan Canonical Form',
  blurb: 'The closest a non-diagonalizable matrix gets to diagonal: blocks with eigenvalues on the diagonal and ones on the superdiagonal.',
  tier: 'full',

  learn: {
    overview: `
The [[jordan-form|Jordan canonical form]] is the answer to the question "what does every matrix look like up to [[similarity|similarity]], including the non-diagonalizable ones?" Every square matrix $A$ over $\\mathbb{C}$ is similar to a block-diagonal matrix where each block is a **Jordan block** — a matrix with a single eigenvalue $\\lambda$ on the diagonal and ones on the superdiagonal:
$$J_k(\\lambda) = \\begin{bmatrix} \\lambda & 1 & & \\\\ & \\lambda & \\ddots & \\\\ & & \\ddots & 1 \\\\ & & & \\lambda \\end{bmatrix} \\quad (k \\times k).$$

When $k = 1$, the Jordan block degenerates to a $1 \\times 1$ matrix $[\\lambda]$ — a regular diagonal entry. So diagonal matrices are the special case where every Jordan block has size 1. The Jordan form for a [[simple-diagonalization|diagonalizable]] matrix is exactly its diagonal form.

The data in a Jordan form has a clean interpretation. For each eigenvalue $\\lambda$, the sizes of its Jordan blocks form a partition of the algebraic multiplicity of $\\lambda$. The NUMBER of Jordan blocks for $\\lambda$ equals the geometric multiplicity of $\\lambda$ (each block contributes one independent eigenvector). The deficiency — the gap between algebraic and geometric multiplicity — equals the total number of non-trivial entries on the superdiagonal across all blocks for that eigenvalue, which is also the dimension of the generalized eigenspace minus the dimension of the ordinary eigenspace.

Over the reals, complex eigenvalue pairs $\\alpha \\pm i\\beta$ produce a [[complex-eigenvalues|real Jordan block]] structure: a $2 \\times 2$ block $\\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$ replaces the corresponding complex pair. For higher-multiplicity complex eigenvalues that are also defective, the real Jordan block grows into a $2k \\times 2k$ matrix with $2 \\times 2$ blocks down the diagonal and $2 \\times 2$ identity blocks on the "superdiagonal." The **real Jordan form** is the canonical form for real matrices over $\\mathbb{R}$, and it has the virtue of being real-valued while preserving the geometric structure.

A Jordan block $J_k(\\lambda)$ can be split as $J_k(\\lambda) = \\lambda I + N$, where $N$ is the **nilpotent** part with ones on the superdiagonal and zeros elsewhere. The matrix $N$ satisfies $N^k = 0$ (its $k$-th power is zero), and this nilpotency is what makes the matrix exponential of a Jordan block tractable. Specifically:
$$e^{J_k(\\lambda) t} = e^{\\lambda t}\\left(I + tN + \\frac{t^2}{2!}N^2 + \\cdots + \\frac{t^{k-1}}{(k-1)!}N^{k-1}\\right).$$
The series terminates after $k$ terms because $N^k = 0$. This is the formal source of the polynomial-times-exponential terms $te^{\\lambda t}, t^2 e^{\\lambda t}, \\ldots$ that appeared in [[repeated-eigenvalues|repeated-eigenvalue]] solutions. For a $3 \\times 3$ Jordan block with eigenvalue $\\lambda$, the matrix exponential is:
$$e^{J_3(\\lambda)t} = e^{\\lambda t}\\begin{bmatrix} 1 & t & t^2/2 \\\\ 0 & 1 & t \\\\ 0 & 0 & 1 \\end{bmatrix}.$$
Note the $t^2/2$, NOT $t^2$ — this is a frequent error. The pattern: entry $(i, j)$ for $j \\geq i$ is $\\frac{t^{j-i}}{(j-i)!}e^{\\lambda t}$.

Why does the Jordan form matter? It is the canonical form under similarity: two matrices are similar if and only if they have the same Jordan form (up to reordering blocks). All similarity invariants — [[rank-and-conditioning|rank]], trace, determinant, characteristic polynomial, minimal polynomial — are encoded in the Jordan structure. It also makes hard problems (matrix exponentials, [[iteration|powers of matrices]], [[matrix-exponentials|solving linear systems]]) computable: the Jordan form reduces every problem to a block-by-block computation on Jordan blocks, where the block algebra is fully understood.

In this course, the Jordan form is treated as a **structural object** — students should recognize it, identify whether a given matrix is in Jordan form, count its blocks, compute its matrix exponential, and read off the solution-space structure. The procedure for actually computing the Jordan form from an arbitrary matrix (finding generalized eigenvectors and chains) is covered in [[finding-jordan-form|the next section]], but the construction is treated lightly: the focus is on what the Jordan form tells you, not on the mechanical recipe to compute it.
    `.trim(),

    definitions: [
      {
        term: 'Jordan block $J_k(\\lambda)$',
        body: 'The $k \\times k$ matrix with $\\lambda$ on the diagonal, ones on the superdiagonal, and zeros elsewhere. The Jordan block of size 1 is just $[\\lambda]$.',
      },
      {
        term: 'Jordan canonical form',
        body: 'A block-diagonal matrix $J = \\mathrm{diag}(J_{k_1}(\\lambda_1), J_{k_2}(\\lambda_2), \\ldots, J_{k_r}(\\lambda_r))$ where each $J_{k_i}(\\lambda_i)$ is a Jordan block. Every square complex matrix is similar to a Jordan canonical form, unique up to permutation of blocks.',
      },
      {
        term: 'Real Jordan form',
        body: 'The canonical form over $\\mathbb{R}$: real eigenvalues produce ordinary Jordan blocks; each complex conjugate pair $\\alpha \\pm i\\beta$ with chain length $k$ produces a $2k \\times 2k$ real block with $\\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$ on the diagonal and $I_2$ on the superdiagonal.',
      },
      {
        term: 'Nilpotent part of a Jordan block',
        body: 'For $J_k(\\lambda) = \\lambda I + N$, the matrix $N$ has ones on the superdiagonal and zeros elsewhere. It satisfies $N^k = 0$, so any power $N^j$ has the $j$-th superdiagonal filled with ones and zeros elsewhere; $N^k$ and beyond vanish.',
      },
      {
        term: 'Generalized eigenspace',
        body: 'For eigenvalue $\\lambda$, the subspace $\\ker(A - \\lambda I)^k$ for large enough $k$ (it stabilizes at $k$ equal to the size of the largest Jordan block for $\\lambda$). Its dimension equals the algebraic multiplicity of $\\lambda$.',
      },
    ],

    theorems: [
      {
        name: 'Jordan decomposition theorem',
        statement: 'Every square matrix $A$ over $\\mathbb{C}$ is similar to a Jordan canonical form. The form is unique up to ordering of blocks.',
        intuition: 'This is the structure theorem for finitely generated modules over $\\mathbb{C}[\\lambda]$, specialized to linear operators on finite-dimensional spaces. The intuitive content: the space decomposes into generalized eigenspaces, one per distinct eigenvalue; on each generalized eigenspace, the matrix is "$\\lambda I$ plus a nilpotent part"; nilpotent operators decompose into Jordan-block chains. Putting these together gives the Jordan form.',
      },
      {
        name: 'Matrix exponential of a Jordan block',
        statement: 'For $J_k(\\lambda) = \\lambda I + N$ with $N^k = 0$, $e^{J_k(\\lambda) t} = e^{\\lambda t} \\sum_{j=0}^{k-1} \\frac{t^j}{j!} N^j$. The $(i, j)$ entry for $j \\geq i$ is $\\frac{t^{j-i}}{(j-i)!} e^{\\lambda t}$ and is zero for $j < i$.',
        intuition: 'Since $\\lambda I$ and $N$ commute, $e^{J_k(\\lambda)t} = e^{\\lambda t} e^{Nt}$. The series $e^{Nt} = \\sum t^j N^j / j!$ terminates after $k$ terms because $N^k = 0$. Each $N^j$ has ones on the $j$-th superdiagonal — so the polynomial factors $t^j / j!$ slot into the appropriate diagonals. The factorials in the denominators are critical: the entry above the diagonal is $t e^{\\lambda t}$, two above is $\\frac{t^2}{2}e^{\\lambda t}$ (NOT $t^2 e^{\\lambda t}$), three above is $\\frac{t^3}{6}e^{\\lambda t}$, and so on.',
      },
      {
        name: 'Block count and sizes',
        statement: 'For a matrix $A$ with eigenvalue $\\lambda$, the number of Jordan blocks for $\\lambda$ equals the geometric multiplicity $\\dim \\ker(A - \\lambda I)$. The total size of all blocks for $\\lambda$ equals the algebraic multiplicity of $\\lambda$.',
        intuition: 'Each Jordan block contributes exactly one eigenvector (the first column of its associated basis), so the number of blocks counts eigenvectors. The sum of block sizes counts generalized eigenvectors, which fills the entire generalized eigenspace and matches the algebraic multiplicity by the [[finding-jordan-form|generalized eigenspace decomposition]].',
      },
    ],

    keyFormulas: [
      'J_k(\\lambda) = \\lambda I + N, \\quad N^k = 0',
      'e^{J_k(\\lambda)t} = e^{\\lambda t}\\left(I + tN + \\frac{t^2}{2!}N^2 + \\cdots + \\frac{t^{k-1}}{(k-1)!}N^{k-1}\\right)',
      '\\text{# blocks for } \\lambda = \\dim \\ker(A - \\lambda I) = \\text{geom. mult.}',
      '\\sum \\text{block sizes for } \\lambda = \\text{alg. mult.}',
      'e^{J_3(\\lambda)t} = e^{\\lambda t}\\begin{bmatrix} 1 & t & t^2/2 \\\\ 0 & 1 & t \\\\ 0 & 0 & 1 \\end{bmatrix}',
    ],
  },

  explore: {
    vizComponent: 'JordanFormViz',
    description: 'A panel of three $4 \\times 4$ Jordan structures with eigenvalue 2: $\\mathrm{diag}(2,2,2,2)$ (four $1 \\times 1$ blocks), one $J_2(2) \\oplus \\mathrm{diag}(2,2)$ (one $2 \\times 2$ + two $1 \\times 1$), and one $J_4(2)$ (single $4 \\times 4$). Each panel shows the matrix, its matrix exponential $e^{Jt}$, and a tiny line chart of $\\|e^{Jt}\\mathbf{x}_0\\|$ over time. Slider controls $t$; the polynomial-times-exponential growth in the big-block case is visible as a curve that overtakes the diagonal case at large $t$. A second mode shows real Jordan blocks for complex eigenvalues, with the same exponential animation.',
    misconception: {
      title: 'The matrix exponential of a Jordan block has factorials in the denominators — the $t^k / k!$ pattern is essential.',
      body: `The most common error in computing $e^{J_k(\\lambda) t}$ is dropping the factorials. Students who write $e^{J_3(\\lambda)t} = e^{\\lambda t}\\begin{bmatrix} 1 & t & t^2 \\\\ 0 & 1 & t \\\\ 0 & 0 & 1 \\end{bmatrix}$ are missing the $1/2$ in the upper-right entry. This is wrong. The correct entry is $t^2/2$. The pattern is $(t^{j-i})/(j-i)!$ for entry $(i, j)$ with $j \\geq i$, and the factorial denominators come from the Taylor series of $e^x$: every power $x^n$ in $\\sum x^n/n!$ contributes a $1/n!$.

A second misconception is treating a Jordan block as a "weird-looking" object that requires special memorization. The structure is simple if you decompose $J_k(\\lambda) = \\lambda I + N$. The scalar $\\lambda$ contributes a uniform $e^{\\lambda t}$ envelope; the nilpotent $N$ generates the polynomial-in-$t$ correction. The whole structure is $e^{\\lambda t}$ times a polynomial in $t$, with the polynomial determined entirely by powers of $N$ — which are easy because $N$ is just "shift up by one column."

A third trap is confusing the algebraic multiplicity with the size of the LARGEST Jordan block. They are related but not equal. The largest block size for $\\lambda$ is called the **index** of $\\lambda$ in the matrix, and it equals the smallest $k$ such that $\\ker(A - \\lambda I)^k = \\ker(A - \\lambda I)^{k+1}$. The algebraic multiplicity is the SUM of all block sizes for $\\lambda$. A $5 \\times 5$ matrix with eigenvalue $\\lambda$ of algebraic multiplicity 5 could have block structure $[5]$ (one big block, index 5), $[4, 1]$, $[3, 2]$, $[3, 1, 1]$, $[2, 2, 1]$, $[2, 1, 1, 1]$, or $[1, 1, 1, 1, 1]$ (fully diagonalizable). Seven distinct partitions, seven distinct Jordan forms, all with the same algebraic multiplicity.

A fourth issue: real Jordan forms for complex eigenvalue pairs use $\\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$ blocks on the diagonal — NOT diagonal blocks $\\mathrm{diag}(\\alpha, \\alpha)$ with $\\beta$ on the off-diagonals. The sign convention ($-\\beta$ in the upper-right) matters because it encodes the rotation direction. Flipping the sign produces the conjugate eigenvalue pair, rotating in the opposite direction.`,
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Step 1 — identify the Jordan structure of a given matrix',
        body: 'Consider $J = \\begin{bmatrix} 2 & 1 & 0 & 0 \\\\ 0 & 2 & 0 & 0 \\\\ 0 & 0 & 2 & 0 \\\\ 0 & 0 & 0 & 5 \\end{bmatrix}$. Reading off the block structure: the upper $2 \\times 2$ is $J_2(2)$ (one Jordan block of size 2 for eigenvalue 2), the next entry is $J_1(2)$ (a $1 \\times 1$ block for eigenvalue 2), and the last entry is $J_1(5)$. So eigenvalue 2 has algebraic multiplicity 3 and geometric multiplicity 2 (two blocks); eigenvalue 5 has algebraic multiplicity 1 and geometric multiplicity 1.',
      },
      {
        title: 'Step 2 — compute the matrix exponential block by block',
        body: 'For the $J_2(2)$ block: $e^{J_2(2) t} = e^{2t} \\begin{bmatrix} 1 & t \\\\ 0 & 1 \\end{bmatrix}$. For the $J_1(2) = [2]$ block: $e^{2t}$. For $J_1(5) = [5]$: $e^{5t}$. Stack into block-diagonal form: $e^{Jt} = \\begin{bmatrix} e^{2t} & te^{2t} & 0 & 0 \\\\ 0 & e^{2t} & 0 & 0 \\\\ 0 & 0 & e^{2t} & 0 \\\\ 0 & 0 & 0 & e^{5t} \\end{bmatrix}$.',
      },
      {
        title: 'Step 3 — read off the basis solutions',
        body: 'Each column of $e^{Jt}$ is a basis solution for $\\dot{\\mathbf{x}} = J\\mathbf{x}$ (starting from the corresponding standard basis vector). The four basis solutions are $e^{2t}\\mathbf{e}_1$, $te^{2t}\\mathbf{e}_1 + e^{2t}\\mathbf{e}_2$, $e^{2t}\\mathbf{e}_3$, and $e^{5t}\\mathbf{e}_4$. The $te^{2t}$ factor appears only in the second column — the column corresponding to the "second slot" of the $J_2(2)$ block, where the nilpotent $N$ pushes one $t$ factor up.',
      },
    ],

    problems: [
      {
        id: 'P-8.3a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the three $6 \\times 6$ matrices below. Which are in real Jordan canonical form?\n\n$\\mathcal{M}_1 = \\begin{bmatrix} 2 & 0 & 0 & 0 & 0 & 0 \\\\ 0 & 1 & -3 & 0 & 0 & 0 \\\\ 0 & 3 & 1 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 4 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 4 & 0 \\\\ 0 & 0 & 0 & 0 & 0 & 4 \\end{bmatrix}$, $\\mathcal{M}_2 = \\begin{bmatrix} 2 & 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 3 & 0 & 0 & 0 \\\\ 0 & -3 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 4 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 4 & 0 \\\\ 0 & 0 & 0 & 0 & 0 & 5 \\end{bmatrix}$, $\\mathcal{M}_3 = \\begin{bmatrix} 1 & -3 & 0 & 0 & 0 & 0 \\\\ 3 & 1 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 4 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 4 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 4 & 0 \\\\ 0 & 0 & 0 & 0 & 0 & 2 \\end{bmatrix}$',
        choices: [
          { label: 'A' as const, body: 'Only $\\mathcal{M}_1$.' },
          { label: 'B' as const, body: 'Only $\\mathcal{M}_2$.' },
          { label: 'C' as const, body: 'Only $\\mathcal{M}_3$.' },
          { label: 'D' as const, body: 'Only $\\mathcal{M}_1$ and $\\mathcal{M}_3$.' },
          { label: 'E' as const, body: 'All of them.' },
        ],
        correctAnswer: 'D' as const,
        solution: {
          explanation: '$\\mathcal{M}_1$: the upper-left $1 \\times 1$ has eigenvalue 2; the $2 \\times 2$ block $\\begin{bmatrix} 1 & -3 \\\\ 3 & 1 \\end{bmatrix}$ is a real Jordan block for the complex pair $1 \\pm 3i$ (in the form $\\alpha I + \\beta J$ with $\\alpha = 1$, $\\beta = 3$, sign convention $-\\beta$ above the diagonal); the lower $3 \\times 3$ piece is $J_2(4) \\oplus J_1(4)$ — valid Jordan blocks. So $\\mathcal{M}_1$ IS in real Jordan form. $\\mathcal{M}_3$: same checks pass — top $2 \\times 2$ is real Jordan block for $1 \\pm 3i$; the $3 \\times 3$ middle is $J_3(4)$ (a $3 \\times 3$ Jordan block for $\\lambda = 4$); bottom is $J_1(2)$. So $\\mathcal{M}_3$ IS in real Jordan form. $\\mathcal{M}_2$: the $2 \\times 2$ block $\\begin{bmatrix} 0 & 3 \\\\ -3 & 0 \\end{bmatrix}$ has WRONG sign convention (the sign is flipped from $\\begin{bmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{bmatrix}$), so this is not in canonical real Jordan form. Hence (D).',
          partialCredit: 'E (correctly identifies that $\\mathcal{M}_1$ and $\\mathcal{M}_3$ are valid, but mistakenly accepts $\\mathcal{M}_2$ by overlooking the sign-flipped block).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Misses $\\mathcal{M}_3$. The $3 \\times 3$ block $J_3(4)$ in $\\mathcal{M}_3$ is a valid single Jordan block; combined with a complex pair block and a $1 \\times 1$ block, $\\mathcal{M}_3$ is a valid real Jordan form.' },
            { choice: 'B' as const, why: 'Incorrectly accepts $\\mathcal{M}_2$, whose $2 \\times 2$ complex-pair block has the wrong sign convention $\\begin{bmatrix} 0 & 3 \\\\ -3 & 0 \\end{bmatrix}$ instead of $\\begin{bmatrix} 0 & -3 \\\\ 3 & 0 \\end{bmatrix}$. Also misses $\\mathcal{M}_1$ and $\\mathcal{M}_3$.' },
            { choice: 'C' as const, why: 'Misses $\\mathcal{M}_1$, which is also in valid real Jordan form (real-pair block plus diagonal entries plus a $J_2(4) \\oplus J_1(4)$ structure for $\\lambda = 4$).' },
            { choice: 'E' as const, why: 'Overlooks that $\\mathcal{M}_2$ has the wrong sign convention in its complex-pair $2 \\times 2$ block. The form is similar to but NOT equal to the real Jordan canonical form.' },
          ],
        },
      },
      {
        id: 'P-8.3b',
        format: 'multiple-choice' as const,
        difficulty: 3,
        statement: 'Consider a $4 \\times 4$ matrix $J$ in Jordan canonical form where all eigenvalues equal 2. Which of the following matrices is a valid $e^{Jt}$ for some such Jordan form?\n\n$\\mathbf{I.}\\ \\begin{bmatrix} e^{2t} & te^{2t} & 0 & 0 \\\\ 0 & e^{2t} & 0 & 0 \\\\ 0 & 0 & e^{2t} & te^{2t} \\\\ 0 & 0 & 0 & e^{2t} \\end{bmatrix}$\n\n$\\mathbf{II.}\\ \\begin{bmatrix} e^{2t} & te^{2t} & t^2 e^{2t} & 0 \\\\ 0 & e^{2t} & te^{2t} & 0 \\\\ 0 & 0 & e^{2t} & 0 \\\\ 0 & 0 & 0 & e^{2t} \\end{bmatrix}$\n\n$\\mathbf{III.}\\ \\begin{bmatrix} e^{2t} & te^{2t} & \\frac{t^2}{2}e^{2t} & 0 \\\\ 0 & e^{2t} & te^{2t} & 0 \\\\ 0 & 0 & e^{2t} & 0 \\\\ 0 & 0 & 0 & e^{2t} \\end{bmatrix}$\n\n$\\mathbf{IV.}\\ \\begin{bmatrix} e^{2t} & te^{2t} & 0 & 0 \\\\ 0 & e^{2t} & \\frac{t^2}{2}e^{2t} & 0 \\\\ 0 & 0 & e^{2t} & te^{2t} \\\\ 0 & 0 & 0 & e^{2t} \\end{bmatrix}$',
        choices: [
          { label: 'A' as const, body: 'I and III only.' },
          { label: 'B' as const, body: 'II and IV only.' },
          { label: 'C' as const, body: 'I, II, and III only.' },
          { label: 'D' as const, body: 'III only.' },
          { label: 'E' as const, body: 'I, II, III, and IV.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'Each row corresponds to a Jordan block structure. **I** is the matrix exponential of $J_2(2) \\oplus J_2(2)$: two $2 \\times 2$ blocks. Each $2 \\times 2$ block $J_2(2)$ exponentiates to $e^{2t}\\begin{bmatrix} 1 & t \\\\ 0 & 1 \\end{bmatrix}$, matching I exactly. **III** is the matrix exponential of $J_3(2) \\oplus J_1(2)$: one $3 \\times 3$ block and one $1 \\times 1$ block. The $3 \\times 3$ block exponentiates to $e^{2t}\\begin{bmatrix} 1 & t & t^2/2 \\\\ 0 & 1 & t \\\\ 0 & 0 & 1 \\end{bmatrix}$ — note the FACTORIAL $1/2$ in the upper-right — which matches III. So I and III are valid. **II** has $t^2$ (no factorial) in the upper-right of the $3 \\times 3$ block, which is wrong: the correct entry is $t^2/2$. **IV** mixes a $2 \\times 2$ block in rows 1-2 with another structure in rows 2-4 that "leaks" between blocks — the $t^2/2$ entry sits in position (2, 3) where it cannot come from any Jordan block of $4 \\times 4$ size with the given constraints; the off-diagonal structure does not correspond to any valid block-diagonal Jordan form.',
          partialCredit: 'C (correctly identifies I and III, partially recognizes the pattern, but accepts II by missing the factorial). D (recognizes III but misses the validity of I).',
          trickAnalysis: [
            { choice: 'B' as const, why: 'Accepts both II (missing factorial — wrong) and IV (off-block leakage — wrong); misses I and III, the two genuinely valid forms.' },
            { choice: 'C' as const, why: 'Catches I and III correctly but mistakenly accepts II. The missing $1/2$ in II is the classic factorial error.' },
            { choice: 'D' as const, why: 'Recognizes III but misses I, which is the simpler two-$J_2$ block structure — also a valid Jordan exponential.' },
            { choice: 'E' as const, why: 'Accepts both II and IV, both of which contain errors. II misses the factorial $1/2$ in the $t^2/2$ position. IV has off-diagonal entries that cannot arise from block-diagonal Jordan structure.' },
          ],
        },
      },
      {
        id: 'P-8.3c',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A $5 \\times 5$ matrix has eigenvalues $\\lambda = 3$ (algebraic multiplicity 3) and $\\lambda = -1$ (algebraic multiplicity 2). Suppose the Jordan form has THREE Jordan blocks total. What is the Jordan structure?',
        choices: [
          { label: 'A' as const, body: 'One $3 \\times 3$ block for $\\lambda = 3$ and one $2 \\times 2$ block for $\\lambda = -1$.' },
          { label: 'B' as const, body: 'One $2 \\times 2$ block and one $1 \\times 1$ block for $\\lambda = 3$, plus one $2 \\times 2$ block for $\\lambda = -1$.' },
          { label: 'C' as const, body: 'Three $1 \\times 1$ blocks for $\\lambda = 3$ and two $1 \\times 1$ blocks for $\\lambda = -1$.' },
          { label: 'D' as const, body: 'One $3 \\times 3$ block for $\\lambda = 3$ and two $1 \\times 1$ blocks for $\\lambda = -1$.' },
          { label: 'E' as const, body: 'Cannot be determined from the information given.' },
        ],
        correctAnswer: 'E' as const,
        solution: {
          explanation: 'Total block count is 3. Block sizes must sum to algebraic multiplicities: 3 for $\\lambda = 3$ and 2 for $\\lambda = -1$. The valid partitions of 3 are $[3]$, $[2,1]$, $[1,1,1]$ giving 1, 2, 3 blocks. The valid partitions of 2 are $[2]$, $[1,1]$ giving 1, 2 blocks. Combinations summing to 3 blocks total: $(1) + (2) = [3] \\oplus [1,1]$ — this is (D), giving block sizes $3, 1, 1$. $(2) + (1) = [2,1] \\oplus [2]$ — this is (B), giving block sizes $2, 1, 2$. So both (B) and (D) give 3 total blocks. Without additional information about the geometric multiplicities, the structure is not uniquely determined.',
          partialCredit: 'B or D (each is a possible structure consistent with the constraints; the question is genuinely underdetermined as posed).',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Only 2 blocks total, not 3. Violates the given constraint.' },
            { choice: 'B' as const, why: 'Valid structure (3 blocks total, block sizes $2, 1, 2$ summing correctly), but so is (D). Not uniquely determined.' },
            { choice: 'C' as const, why: '5 blocks total, not 3. Also implies full diagonalizability, which the geometric multiplicity constraints would have to support — but block count violates the given.' },
            { choice: 'D' as const, why: 'Valid structure (3 blocks total, block sizes $3, 1, 1$), but so is (B). Not uniquely determined.' },
          ],
        },
      },
    ],
  },
};
