import type { Concept } from '../types';

export const quantumMeasurement: Concept = {
  id: 'quantum-measurement',
  unitId: 'ch5',
  number: '5.8.4',
  title: 'Quantum Measurement',
  blurb: 'Quantum states are unit vectors in inner product space; measurement is orthogonal projection.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
Quantum mechanics is built on linear algebra over complex inner product spaces. A quantum state is a unit vector $|\\psi\\rangle$ in a complex Hilbert space (a complete inner product space), and a measurement corresponds to choosing an [[orthonormal-bases|orthonormal basis]] $\\{|e_i\\rangle\\}$ — typically the eigenbasis of an observable. The measurement returns outcome $i$ with probability $|\\langle e_i | \\psi \\rangle|^2$, the squared modulus of the [[orthonormal-bases|Fourier coefficient]] of $|\\psi\\rangle$ along $|e_i\\rangle$. After measurement, the state "collapses" to $|e_i\\rangle$ — the [[orthogonal-projections|orthogonal projection]] of $|\\psi\\rangle$ onto the measured basis vector.

Quantum operators are linear, and **observables** — physical quantities that can be measured — are [[adjoints-and-transposes|self-adjoint]] operators, generalizing the Hermitian property of matrices. Self-adjointness guarantees real eigenvalues (since measurement outcomes must be real numbers) and an orthonormal basis of eigenvectors (so the eigenbasis decomposition makes sense as a measurement). The [[principal-components|spectral theorem]] is the workhorse: every self-adjoint operator decomposes into a real-eigenvalue [[simple-diagonalization|diagonalization]] in an orthonormal basis.

Quantum gates in quantum computation are unitary operators — the complex analog of [[orthogonal-transformations|orthogonal transformations]]. They preserve the inner product (so probabilities sum to 1) and are reversible (so quantum computation is unitary evolution). The Schrödinger equation $i\\hbar \\frac{d|\\psi\\rangle}{dt} = H|\\psi\\rangle$ is a [[linear-differential-equations|linear differential equation]] in the Hilbert space, with the Hamiltonian $H$ a self-adjoint operator. The entire formalism is linear algebra applied to physics.
    `.trim(),

    definitions: [
      {
        term: 'Quantum state',
        body: 'A unit vector $|\\psi\\rangle$ in a complex inner product space (Hilbert space). Notation $|\\psi\\rangle$ is bra-ket notation for vectors; $\\langle\\phi|\\psi\\rangle$ denotes the inner product.',
      },
      {
        term: 'Observable',
        body: 'A self-adjoint linear operator $H$ on the Hilbert space. Its eigenvalues are the possible measurement outcomes; its eigenvectors form the measurement basis.',
      },
      {
        term: 'Born rule',
        body: 'For a state $|\\psi\\rangle$ and measurement basis $\\{|e_i\\rangle\\}$: outcome $i$ occurs with probability $|\\langle e_i | \\psi \\rangle|^2$.',
      },
    ],
    theorems: [],
  },

  explore: {
    vizComponent: null,
    description: 'No interactive visualization for this application.',
    misconception: { title: '', body: '' },
  },

  practice: {
    workedExample: [],
    problems: [],
  },
};
