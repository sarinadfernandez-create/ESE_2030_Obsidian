import type { Concept } from '../types';

export const powerGrid: Concept = {
  id: 'power-grid',
  unitId: 'ch8',
  number: '8.6.1',
  title: 'Power Grid Stability',
  blurb: 'Electrical grids are dynamical systems whose stability is governed by the eigenvalues of the system Jacobian.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
An electrical power grid is a large coupled dynamical system: generators, transmission lines, transformers, and loads exchange power according to the swing equation, a system of [[higher-order-equations|second-order differential equations]] capturing the rotational dynamics of synchronous generators. Linearizing around an operating point gives a linear system $\\dot{\\mathbf{x}} = A\\mathbf{x}$ whose stability is determined by the eigenvalues of $A$.

The eigenvalues come in patterns familiar from [[complex-eigenvalues|complex eigenvalue]] analysis. Real negative eigenvalues correspond to **damping modes** — perturbations that decay exponentially without oscillation, mainly governed by friction and resistive losses. Complex pairs with negative real part correspond to **damped oscillatory modes**: small disturbances ringing at a characteristic frequency (typically 0.2 Hz to 2 Hz for inter-area oscillations, or 1 to 5 Hz for local generator swings) and decaying due to damping. Eigenvalues with **positive real part** indicate **instability** — small perturbations grow exponentially, leading to loss of synchronism, cascading failures, or blackouts.

The eigenvalues of the grid Jacobian are not optional features; they are the engineering specification. Grid operators monitor the eigenvalues continuously, particularly the **dominant mode** (the eigenvalue closest to the imaginary axis), since it controls how quickly disturbances are absorbed. Power system stabilizers and damping controllers are designed specifically to push the eigenvalues farther into the left half-plane, increasing the damping and reducing oscillation amplitudes. The classic [[adjoints-and-transposes|symmetric]] structure of the linearized system (under physically reasonable assumptions) means the eigenvalues are real or come in complex conjugate pairs, and modal analysis using the eigenvectors reveals which physical components participate in each mode — useful for siting controllers where they have maximum effect.
    `.trim(),

    definitions: [
      {
        term: 'Swing equation',
        body: 'The rotational dynamics equation $M \\ddot \\delta + D \\dot \\delta + K \\delta = 0$ (linearized form) for a generator\'s rotor angle $\\delta$, with $M$ inertia, $D$ damping, $K$ stiffness from network connections.',
      },
      {
        term: 'Dominant mode',
        body: 'The eigenvalue of the linearized grid system closest to the imaginary axis. It controls the slowest-decaying perturbation and thus the practical stability margin of the grid.',
      },
      {
        term: 'Damping ratio',
        body: 'For a complex eigenvalue $\\lambda = \\alpha + i\\beta$, the ratio $\\zeta = -\\alpha / \\sqrt{\\alpha^2 + \\beta^2}$. Power system operators require $\\zeta \\geq 0.05$ for all modes; lower values risk persistent oscillations.',
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
