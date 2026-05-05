import type { Concept } from '../types';

export const vehicleSuspension: Concept = {
  id: 'vehicle-suspension',
  unitId: 'ch7',
  number: '7.8.2',
  title: 'Heavy Vehicle Suspension Analysis',
  blurb: 'Overdamped suspensions exhibit pure exponential modes from real negative eigenvalues; design separates time scales.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A "quarter-truck" model treats one wheel of a heavy vehicle: a sprung body mass $M$ connected via a spring (constant $k$) and damper (coefficient $c$) to an unsprung wheel mass $m$, which connects to the road through a tire spring $k_t$. Newton's second law yields two coupled second-order equations in body displacement $x$ and wheel displacement $y$. Stacking position and velocity into a state vector $\\mathbf{z} = (x, y, \\dot{x}, \\dot{y})^T$ converts the system to a fourth-order first-order linear ODE $\\dot{\\mathbf{z}} = A \\mathbf{z}$, exactly as in [[higher-order-equations|the companion-matrix construction]] generalized to coupled equations.

For typical heavy-vehicle parameters (large body mass, stiff tire, heavy damping), the system matrix $A$ has four real negative eigenvalues, well-separated in magnitude. This is the **overdamped** regime: solutions are pure exponential decay without oscillation, exactly the case treated in [[basis-solutions|this chapter]]. (Passenger vehicles, by contrast, are underdamped with complex eigenvalues, requiring Chapter 8.) The four modes correspond to physically distinct time scales: rapid tire deflection ($|\\lambda|$ largest), primary suspension response, coupled body-suspension motion, and slow body settling ($|\\lambda|$ smallest).

The eigenstructure guides design. All eigenvalues real and negative is the criterion for pure damping (no oscillation). Wide separation of eigenvalues prevents undesirable coupling between modes. The slowest eigenvalue governs the overall ride settling time, the most important quantity for driver comfort. Eigenvectors determine which sensors observe which modes: a sensor placed where one mode has large amplitude and others have small amplitude can isolate that mode in real-time monitoring. Mining trucks, construction equipment, and other heavy vehicles use this analysis to engineer suspensions that maintain stable operation under shifting loads.
    `.trim(),

    definitions: [
      {
        term: 'Sprung mass',
        body: 'The mass of the vehicle body, supported by the suspension. The displacement $x(t)$ of this mass is one of the primary state variables.',
      },
      {
        term: 'Unsprung mass',
        body: 'The mass of the wheel and axle assembly, between the suspension and the road. Its displacement $y(t)$ is the second primary state variable.',
      },
      {
        term: 'Overdamped system',
        body: 'A linear system whose eigenvalues are all real and negative. Solutions are pure exponential decays, with no oscillatory component. Heavy-vehicle suspensions are typically engineered into this regime; passenger-car suspensions are typically underdamped (complex eigenvalues, oscillation).',
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
