import type { Concept } from '../types';

export const buildingTemperature: Concept = {
  id: 'building-temperature',
  unitId: 'ch7',
  number: '7.8.1',
  title: 'Multi-Zone Building Temperature Control',
  blurb: 'Thermal coupling between rooms produces a linear ODE system whose eigenmodes guide HVAC strategy.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
The temperature dynamics of a multi-zone building reduce to a linear ODE system once Newton's law of cooling and conservation of energy are applied to each zone. Let $T_i(t)$ be the temperature of room $i$, and let $x_i = T_i - T_a$ measure the deviation from the ambient temperature $T_a$. The unforced response then satisfies $\\dot{\\mathbf{x}} = A \\mathbf{x}$ where $A$ encodes thermal conductances $k_{ij}$ between adjacent rooms (off-diagonal) and heat-loss coefficients $h_i$ to the exterior (modifying the diagonal).

The [[eigenvectors|eigenvalues]] of $A$ are the natural thermal modes of the building. For physically reasonable parameters, all eigenvalues are real and negative, guaranteeing asymptotic decay back to ambient. The fastest mode (largest $|\\lambda|$) corresponds to rapid equilibration between strongly-coupled rooms; the slowest mode (smallest $|\\lambda|$) governs the overall settling time. The corresponding eigenvectors describe spatial patterns of temperature deviation: a "uniform decay" mode where all rooms drift toward ambient together, plus mixing modes where some rooms warm while others cool.

Eigenanalysis guides HVAC control. The slowest decaying mode dominates long-term behavior, so controllers should target it. Sensor placement should align with the dominant eigenvectors to capture the modes with the most measurement signal. Building design (insulation, thermal mass, ventilation) reshapes the eigenvalue spectrum, allowing engineers to engineer thermal time scales explicitly. The mathematical machinery developed in [[matrix-exponentials|this chapter]], specifically [[simple-diagonalization|diagonalization]] and the [[matrix-exponentials|matrix exponential]], provides the unforced temperature response $\\mathbf{x}(t) = e^{At} \\mathbf{x}_0$ in closed form.
    `.trim(),

    definitions: [
      {
        term: 'Thermal conductance $k_{ij}$',
        body: 'The rate of heat transfer between rooms $i$ and $j$ per unit temperature difference. Encodes wall thickness, materials, and shared surface area. Off-diagonal entries of the thermal coupling matrix.',
      },
      {
        term: 'Thermal mode',
        body: 'An eigenvector of the building thermal matrix $A$, paired with its eigenvalue. Each mode is a spatial temperature pattern that decays at its own characteristic rate $|\\lambda|^{-1}$.',
      },
      {
        term: 'Settling time',
        body: 'The time scale on which deviations from ambient decay to a small fraction of their initial value. Governed by the slowest eigenvalue: settling time $\\sim 1/|\\lambda_{\\min}|$ where $\\lambda_{\\min}$ is the eigenvalue closest to zero.',
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
