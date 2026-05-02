import type { Concept } from '../types';

export const engineeringSignals: Concept = {
  id: 'engineering-signals',
  unitId: 'ch2',
  number: '2.6.1',
  title: 'Engineering Signals',
  blurb: 'Signals are functions of time, function spaces are vector spaces, and engineering operations are linear transformations.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A **signal** in engineering is a function — typically a function of time, like an audio waveform $s(t)$, a voltage $v(t)$, or a sensor reading $f(t)$. The set of all such signals (under appropriate regularity conditions — continuous, square-integrable, periodic, etc.) forms a [[vector-space-examples|function space]], and that function space is a [[vector-space-axioms|vector space]] in the formal sense. This recognition transforms signal processing from a collection of ad-hoc techniques into a single coherent linear-algebraic theory.

The key operations on signals — adding two signals, scaling a signal in volume, filtering a signal through a system, decomposing a signal into frequency components — are all [[linear-transformation-defs|linear transformations]] of the underlying function space. This is why so much of digital signal processing reduces to matrix multiplication, basis change, and projection: at bottom, signals live in vector spaces, and engineering operations are linear maps between them.

The most consequential basis for the function space of (periodic, square-integrable) signals is the **Fourier basis** — sines and cosines (or complex exponentials) at all frequencies. Decomposing a signal in this basis is what the Fourier transform does. The signal's content at each frequency is a coordinate in the Fourier basis. Filtering — emphasizing or suppressing certain frequencies — is just multiplying these coordinates by a frequency-dependent gain, an operation that becomes diagonal in this basis.

A few specific connections to this unit's material:

- **Sampling** a continuous signal at $n$ time points produces a vector in $\\mathbb{R}^n$. Discrete signals are literally elements of finite-dimensional vector spaces, with $\\dim$ equal to the sample count. Continuous signals live in [[vector-space-examples|infinite-dimensional]] function spaces.

- **Linearity of operations.** Adding two signals corresponds to adding the underlying functions pointwise. Amplifying a signal corresponds to scalar multiplication. Both are [[vector-space-axioms|the basic vector space operations]] applied to the signal space.

- **Signal subspaces.** The set of bandlimited signals (zero outside a frequency range) is a [[subspaces|subspace]] of the full signal space. So is the set of signals with finite energy. So is the solution space of a linear constant-coefficient differential equation describing a circuit. Each subspace inherits the linear-algebra theory.

- **Independent signal components.** Two signals are [[span-and-independence|linearly independent]] if neither is a scalar multiple of the other. A finite collection of signals can be checked for independence by setting up a Gram matrix or by row-reducing the matrix of samples. [[dimension|Dimensional]] limits then say how many independent components a signal subspace can support.

The deep payoff: once you accept that signals are vectors and engineering operations are linear, you can apply [[bases|change of basis]], [[orthonormal-bases|orthonormal expansions]], [[least-squares|least-squares approximation]], [[svd-form|SVD]], and [[principal-components|PCA]] to signal-processing problems with no special-case theory. The Fourier transform, wavelet decompositions, and modern compressed sensing are all the same idea applied to different bases.
    `.trim(),

    definitions: [
      {
        term: 'Signal',
        body: 'A function representing a measurable quantity, typically as a function of time. Discrete signals are vectors in $\\mathbb{R}^n$ (one entry per sample); continuous signals are elements of a function space.',
      },
      {
        term: 'Signal space',
        body: 'A vector space of signals. Examples: $\\mathbb{R}^n$ for length-$n$ discrete signals, $L^2(\\mathbb{R})$ for square-integrable continuous signals, $C([0, T])$ for continuous signals on a finite interval.',
      },
      {
        term: 'Filter',
        body: 'A linear transformation on the signal space, typically built from time-shifts and weighted sums. Common examples: low-pass, high-pass, band-pass.',
      },
      {
        term: 'Fourier basis',
        body: 'A basis for a periodic signal space consisting of sines and cosines (or complex exponentials) at all frequencies. The coordinates of a signal in this basis are its Fourier coefficients.',
      },
    ],

    theorems: [
      {
        name: 'Signal operations are linear',
        statement: 'Pointwise addition and scalar multiplication of signals satisfy the [[vector-space-axioms|vector space axioms]]. Many engineering operations (filtering, time-shifting, differentiation, integration) are [[linear-transformation-defs|linear transformations]].',
        intuition: 'A "linear, time-invariant" filter — the workhorse of signal processing — is exactly a linear transformation that commutes with time shifts. The full theory of LTI systems is a special case of linear algebra on signal spaces.',
      },
    ],

    keyFormulas: [
      '(s_1 + s_2)(t) = s_1(t) + s_2(t)',
      '(c \\cdot s)(t) = c \\cdot s(t)',
      's(t) = \\sum_n c_n \\phi_n(t) \\quad \\text{(expansion in basis } \\{\\phi_n\\}\\text{)}',
    ],
  },

  explore: {
    vizComponent: null,
    description: 'No interactive visualization for this application.',
    misconception: {
      title: 'A "signal" is not just a list of numbers — it is an element of a vector space',
      body: `
The most common conceptual error in this area is treating signals as bags of numbers without structure. A signal is a *vector* in a particular signal space, and operations on signals must respect the vector space structure.

A specific consequence: not every operation on signal samples is a valid signal-processing operation. Pointwise addition, scaling, and convolution are linear and respect the structure. But operations like "take the absolute value" or "square each sample" are nonlinear — they don't preserve the linearity that makes most signal-processing math work. When you see a nonlinear operation in a signal-processing context (e.g., taking the magnitude in spectrum analysis), you are stepping outside the linear-algebraic framework.

A second misconception: thinking continuous and discrete signals require different theories. They live in different vector spaces (one [[vector-space-examples|finite-dimensional]], one infinite-dimensional), but the same linear-algebra concepts — basis, span, [[image-and-kernel|kernel]], [[image-and-kernel|image]], [[orthonormal-bases|orthogonality]] — apply to both. Sampling a continuous signal is itself a linear transformation (from the continuous space to the discrete one), and the connection between the two views is one of [[change-of-basis|representation in different bases]].
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Decompose a signal in a basis',
        body: 'Suppose we have signals $s_1(t) = \\cos(t)$ and $s_2(t) = \\sin(t)$ as a basis for a 2-dimensional signal subspace, and we want to express $s(t) = 3\\cos(t) + 4\\sin(t)$ in coordinates with respect to this basis. By inspection, $s = 3 s_1 + 4 s_2$, so the coordinate vector is $(3, 4)^T$. The energy of the signal is $\\sqrt{3^2 + 4^2} = 5$, just like the magnitude of the coordinate vector.',
      },
      {
        title: 'Verify a signal subspace',
        body: 'The set of all bandlimited signals (those whose Fourier transform vanishes outside $[-B, B]$) is a [[subspaces|subspace]] of the full signal space. The zero signal is bandlimited (its Fourier transform is zero everywhere). Sums of bandlimited signals are bandlimited (Fourier transform of sum is sum of transforms). Scalar multiples are bandlimited. So the [[subspaces|subspace test]] passes.',
      },
    ],

    problems: [
      {
        id: 'P-2.6.1a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'Consider the set of discrete signals $V = \\{(s_0, s_1, s_2, s_3) : s_0 + s_1 + s_2 + s_3 = 0\\}$ (signals with zero mean). Is $V$ a subspace of $\\mathbb{R}^4$?',
        choices: [
          { label: 'A' as const, body: 'Yes — $V$ contains the zero signal and is closed under addition and scalar multiplication.' },
          { label: 'B' as const, body: 'No — $V$ does not contain the zero signal because the constraint excludes it.' },
          { label: 'C' as const, body: 'No — sums of zero-mean signals can have nonzero mean.' },
          { label: 'D' as const, body: 'Only if all the signals in $V$ are real-valued.' },
          { label: 'E' as const, body: 'Only if we restrict to bandlimited signals.' },
        ],
        correctAnswer: 'A' as const,
        solution: {
          explanation: 'The zero signal $(0, 0, 0, 0)$ has $0 + 0 + 0 + 0 = 0$, so it is in $V$. ✓ If $s = (s_0, \\dots, s_3)$ and $t = (t_0, \\dots, t_3)$ both have zero mean, then $(s + t)$ has mean $(s_0 + t_0) + \\cdots + (s_3 + t_3) = (s_0 + \\cdots + s_3) + (t_0 + \\cdots + t_3) = 0 + 0 = 0$. ✓ Similarly for scalar multiplication. ✓ So $V$ is a [[subspaces|subspace]]. (It is the [[image-and-kernel|null space]] of the linear functional $s \\mapsto s_0 + s_1 + s_2 + s_3$.)',
          trickAnalysis: [
            { choice: 'B' as const, why: 'The zero signal IS in $V$ because $0 + 0 + 0 + 0 = 0$ satisfies the constraint.' },
            { choice: 'C' as const, why: 'Sums of zero-mean signals do have zero mean — see the calculation above.' },
            { choice: 'D' as const, why: 'Real-valuedness is not relevant; the subspace structure works over any scalar field.' },
            { choice: 'E' as const, why: 'Bandlimitedness is unrelated to the zero-mean condition.' },
          ],
        },
      },
      {
        id: 'P-2.6.1b',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A discrete signal $s = (s_0, s_1, \\dots, s_{N-1})$ is **periodic with period $N$** by convention. The set of all such signals is $\\mathbb{R}^N$, with $\\dim = N$. Suppose we restrict to signals satisfying $s_n = s_{N-n}$ for all $n$ (palindromic / symmetric signals, with index arithmetic mod $N$). What is the dimension of this subspace, when $N = 4$?',
        choices: [
          { label: 'A' as const, body: '$1$' },
          { label: 'B' as const, body: '$2$' },
          { label: 'C' as const, body: '$3$' },
          { label: 'D' as const, body: '$4$' },
          { label: 'E' as const, body: 'Cannot be determined.' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'For $N = 4$, the symmetry constraint $s_n = s_{N - n}$ becomes (with index mod $4$): $s_0 = s_0$ (vacuous), $s_1 = s_3$, $s_2 = s_2$ (vacuous), $s_3 = s_1$ (same as the second). So the only effective constraint is $s_1 = s_3$. Free parameters: $s_0$, $s_1$, $s_2$, with $s_3$ forced equal to $s_1$. That gives $3$ free parameters, so the dimension is $3$.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Treats the symmetry as far more restrictive than it is. Only one equation is imposed.' },
            { choice: 'B' as const, why: 'Counts as if both $s_0 = s_0$ and $s_2 = s_2$ were nontrivial constraints. They are vacuous (always true).' },
            { choice: 'D' as const, why: 'Ignores the constraint entirely; this would be the dimension of the full space $\\mathbb{R}^4$.' },
            { choice: 'E' as const, why: 'It can be determined: count the constraints, subtract from the ambient dimension.' },
          ],
        },
      },
    ],
  },
};
