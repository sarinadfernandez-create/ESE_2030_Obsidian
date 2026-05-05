import type { Concept } from '../types';

export const signalProcessing: Concept = {
  id: 'signal-processing',
  unitId: 'ch6',
  number: '6.6.1',
  title: 'Signal Processing',
  blurb: 'Filtering, denoising, and compression all reduce to projections in inner-product function spaces.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
**Signal processing** — the discipline of analyzing, filtering, denoising, and compressing time-series or spatial data — is built on the inner-product machinery of Unit 5 and the projection theory of Unit 6.

A signal is modeled as a vector in an [[dot-and-inner-products|inner product space]] (typically $L^2$ for continuous signals or $\\mathbb{R}^n$ for sampled signals). The key operations all become geometric:

- **Fourier analysis** decomposes a signal into [[orthonormal-bases|orthonormal basis]] components — sines and cosines (or complex exponentials) at different frequencies. Each Fourier coefficient is an inner product, and the signal is the sum of basis components weighted by these coefficients ([[orthonormal-bases|Parseval's identity]]).
- **Filtering** is [[orthogonal-projections|orthogonal projection]] onto a subspace of "allowed" frequency components. A low-pass filter projects onto the subspace of low-frequency basis functions; high-pass projects onto high-frequency. Convolution in the time domain is multiplication in the Fourier domain — a basis-change identity.
- **Denoising** assumes the signal lives in a low-dimensional subspace (or has sparse basis representation) and the noise is "spread" across all dimensions. Projecting onto the signal subspace (or thresholding small coefficients) removes the noise.
- **Compression** picks the largest-magnitude basis coefficients and discards the rest — a form of [[regularized-least-squares|sparse approximation]] using L0 or L1 regularization.

The Fast Fourier Transform (FFT) is an algorithm for computing the basis-change between time-domain and frequency-domain representations in $O(n \\log n)$ instead of the naïve $O(n^2)$ — a single algorithmic insight that underpins essentially all of modern signal processing, from MP3 audio to JPEG images to MRI reconstruction.

Wavelets generalize Fourier analysis by using basis functions localized in both time and frequency, giving better representations for signals with discontinuities or transient features. The mathematical machinery is the same: orthonormal basis, [[orthogonal-projections|projection]], inner-product coefficients.
    `.trim(),

    definitions: [
      {
        term: 'Fourier coefficient',
        body: 'For a signal $f$ and a basis function $\\phi_n$ in an orthonormal basis: $c_n = \\langle f, \\phi_n \\rangle$. The "amount" of $\\phi_n$ in $f$.',
      },
      {
        term: 'Filter',
        body: 'A linear transformation that suppresses some frequency components of a signal. Often expressed as orthogonal projection onto a "passband" subspace.',
      },
      {
        term: 'Convolution',
        body: 'A linear operation $f \\ast g$ on two signals. In the Fourier basis, convolution becomes pointwise multiplication.',
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
