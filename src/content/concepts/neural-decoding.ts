import type { Concept } from '../types';

export const neuralDecoding: Concept = {
  id: 'neural-decoding',
  unitId: 'ch11',
  number: '11.6.1',
  title: 'Neural Decoding via PCA',
  blurb: 'Recordings from a population of neurons live in a high-dimensional space. PCA reveals that the neural activity is governed by a small number of latent variables — the natural coordinates of behavior.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A modern neural recording captures simultaneous activity from hundreds or thousands of neurons in the cortex of a behaving animal. Stack the firing rates of $d$ neurons across $n$ time bins and the result is a centered data matrix $X \\in \\mathbb{R}^{n \\times d}$ — same algebraic object as any [[principal-components|PCA]] dataset. The features are *neurons*; the observations are *moments in time*.

The remarkable empirical finding, repeated across motor cortex, prefrontal cortex, and many other areas, is that the [[statistical-significance|effective dimensionality]] of population activity is far smaller than the number of recorded neurons. A recording from $200$ motor-cortex neurons during reaching may have $90\\%$ of its variance captured by the first $8$-$15$ principal components. The trajectories of behavior — reach direction, speed, target — live in a *low-dimensional neural manifold* embedded in the high-dimensional firing-rate space. PCA discovers this manifold (or its linear approximation) without any biological assumption beyond "diagonalize the covariance."

The principal components, interpreted as patterns of neural co-activation, often correspond to meaningful behavioral or task variables: a first PC modulated by movement onset, a second PC encoding reach direction, a third PC tracking task phase. These interpretations require careful validation against behavior, but the underlying structure — a low-dimensional latent state governing many neurons — is robust. Cunningham and Yu's *Nature Neuroscience* (2014) review formalized this picture; Churchland and others showed that motor-cortex dynamics during reaching live on a rotational $2$-D plane in PC space.

The contrast with [[beyond-linear-pca|nonlinear methods]] in this domain is instructive: PCA's eigenvectors are *linear combinations of neurons* and can be interpreted directly as neural patterns; t-SNE's coordinates are not, which makes PCA the right starting point even when manifold methods give prettier scatterplots.
    `.trim(),

    definitions: [
      {
        term: 'Neural population activity',
        body: 'A matrix $X \\in \\mathbb{R}^{n \\times d}$ of firing rates: $n$ time bins of $d$ simultaneously recorded neurons. Each column is a single neuron; each row is a snapshot of the population state.',
      },
      {
        term: 'Neural latent variable',
        body: 'A score on a principal component, $X \\mathbf{q}_k \\in \\mathbb{R}^n$, interpreted as a low-dimensional behavioral or task signal governing many neurons jointly. Typical recordings have $5$-$20$ meaningful latent dimensions out of hundreds of recorded neurons.',
      },
      {
        term: 'Neural manifold',
        body: 'The low-dimensional subspace (or curved surface, for nonlinear methods) on which the population activity lives. PCA recovers a linear approximation; the true manifold may be curved and require manifold-learning techniques to unfold.',
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
