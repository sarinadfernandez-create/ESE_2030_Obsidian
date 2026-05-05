import type { Concept } from '../types';

export const imageProcessing: Concept = {
  id: 'image-processing',
  unitId: 'ch6',
  number: '6.6.2',
  title: 'Image Processing',
  blurb: 'Compression, denoising, and edge detection: all variations on projecting images into well-chosen subspaces.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
**Image processing** treats images as vectors in a high-dimensional inner product space (an image with $n \\times n$ pixels lives in $\\mathbb{R}^{n^2}$). The operations of compression, denoising, restoration, and edge detection are all variations on [[orthogonal-projections|orthogonal projection]] onto subspaces chosen for their structural properties.

**JPEG compression** decomposes an image into $8 \\times 8$ blocks, applies the discrete cosine transform (DCT) — an [[orthonormal-bases|orthonormal basis change]] to the cosine basis — and quantizes the coefficients. Most natural-image energy concentrates in the low-frequency cosine coefficients; the high-frequency coefficients are small and can be discarded with minimal perceptual loss. This is [[regularized-least-squares|sparse approximation]] in the cosine basis.

**Denoising** uses similar machinery. Noisy images are projected onto subspaces where natural images concentrate (often defined by total-variation regularization or wavelet sparsity). The noise, being uncorrelated with image structure, has roughly equal energy across all subspace directions and is largely removed by projection.

**Edge detection** applies a [[linear-transformation-defs|linear transformation]] (a convolution with a derivative-like kernel) to highlight pixels where intensity changes rapidly. The result is a different image emphasizing structural boundaries — a basis-change that exposes the geometric content rather than the intensity content.

**Image inpainting** — filling in missing pixels — is a [[least-squares|least-squares]] problem with regularization: find an image that fits the known pixels exactly while minimizing some smoothness penalty. The mathematical setup is exactly [[regularized-least-squares|Tikhonov regularization]] with a structural penalty matrix.

Modern deep learning replaces these explicit linear-algebra constructions with learned representations, but the same intuitions persist: convolutional layers are [[matrix-representations|matrix representations]] of local operations, and the architecture's success comes from chaining many simple linear operations with nonlinearities — a strategy first articulated in the linear-algebraic image-processing literature.
    `.trim(),

    definitions: [
      {
        term: 'Discrete cosine transform (DCT)',
        body: 'An orthonormal basis change for $\\mathbb{R}^n$ using cosine basis functions. The foundation of JPEG image compression.',
      },
      {
        term: 'Convolution kernel',
        body: 'A small matrix used to apply a linear transformation locally to an image. Edge detection, blurring, and sharpening are all convolutions with appropriate kernels.',
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
