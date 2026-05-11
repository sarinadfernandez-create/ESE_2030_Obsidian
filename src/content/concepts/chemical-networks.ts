import type { Concept } from '../types';

export const chemicalNetworks: Concept = {
  id: 'chemical-networks',
  unitId: 'ch8',
  number: '8.6.2',
  title: 'Chemical Reaction Networks',
  blurb: 'Reaction kinetics linearize to ODE systems whose eigenvalues reveal time scales, stability, and oscillatory behavior.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A chemical reaction network is a system of interconnected reactions $A \\to B$, $B + C \\to D$, etc., with concentrations $\\mathbf{c}(t) = (c_1, c_2, \\ldots, c_n)^T$ evolving according to the law of mass action. Linearizing the rate equations around an equilibrium gives a [[first-order-systems|linear ODE system]] $\\dot{\\mathbf{c}} = A \\mathbf{c}$, where $A$ encodes the stoichiometric coefficients weighted by reaction rate constants. The eigenvalues of $A$ reveal the chemistry: real negative eigenvalues correspond to **relaxation time scales** $\\tau_i = -1/\\lambda_i$, telling you how quickly each chemical mode equilibrates; complex pairs reveal **oscillatory reactions** like the Belousov-Zhabotinsky reaction or biological circadian rhythms; eigenvalues with positive real part flag **autocatalytic instability**, where small perturbations grow into limit cycles or runaway reactions.

In biochemistry, [[repeated-eigenvalues|repeated eigenvalues]] often appear in symmetric reaction schemes (e.g., enzyme kinetics with two identical binding sites) and signal special degeneracies that affect identifiability — when two reaction pathways have identical time scales, they are kinetically indistinguishable from concentration measurements alone. The eigenvectors of $A$ specify the **reaction modes**: combinations of species that evolve coherently. For a reaction network with conservation laws (e.g., total atom counts), the matrix $A$ has zero as an eigenvalue, with the eigenvector indicating the conserved quantity. This is the same [[image-and-kernel|kernel]] analysis that appears in [[graph-topology|graph-theoretic]] contexts, applied to chemistry.
    `.trim(),

    definitions: [
      {
        term: 'Stoichiometry matrix',
        body: 'A matrix $S$ whose $(i, j)$ entry is the net change in species $i$ produced by one occurrence of reaction $j$. Conservation laws appear as left-null-space vectors $\\mathbf{c}^T S = 0$.',
      },
      {
        term: 'Relaxation time scale',
        body: 'For a real eigenvalue $\\lambda < 0$ of the linearized rate matrix, the time scale $\\tau = -1/\\lambda$. Larger $|\\lambda|$ means faster equilibration.',
      },
      {
        term: 'Oscillatory reaction',
        body: 'A chemical system whose linearization has complex eigenvalues $\\alpha \\pm i\\beta$. The angular frequency $\\beta$ sets the period of the oscillation; $\\alpha < 0$ gives damped oscillation, $\\alpha = 0$ a stable limit cycle in the nonlinear regime, $\\alpha > 0$ growing instability.',
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
