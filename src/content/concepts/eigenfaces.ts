import type { Concept } from '../types';

export const eigenfaces: Concept = {
  id: 'eigenfaces',
  unitId: 'ch11',
  number: '11.6.2',
  title: 'Eigenfaces',
  blurb: 'A face image is a high-dimensional vector. PCA finds the dominant patterns of variation across faces — the eigenfaces — and represents each face as a sparse combination of them.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A grayscale image of $h \\times w$ pixels is a vector in $\\mathbb{R}^{h w}$: stack the rows or columns into a single column, treat each pixel as a coordinate. A typical face image of $64 \\times 64$ pixels is a vector in $\\mathbb{R}^{4096}$. The set of *face* images is a tiny subset of this enormous space — most of $\\mathbb{R}^{4096}$ is noise, edges of random objects, or pixel patterns with no facial structure. PCA on a database of face images reveals the *axes of variation that matter*: the directions in pixel space along which real faces vary.

Turk and Pentland's 1991 paper "Eigenfaces for Recognition" introduced this method as one of the first practical face-recognition systems. The procedure: center a database of face images by subtracting the [[principal-components|mean face]] (literally the pixel-wise average across the database, which looks like a generic blurry face), then run [[principal-components|covariance PCA]] on the centered images. The first few principal components — the *eigenfaces* — are themselves images: each one is a unit vector in $\\mathbb{R}^{4096}$ that looks like a ghostly face, encoding a particular axis of variation across the database (lighting, head tilt, presence of glasses, gender mix, etc.).

The compression is dramatic. A new face image is projected onto the top $k$ eigenfaces (typically $k = 50$ to $200$) to obtain $k$ scalar coefficients — a sparse code. Reconstructing the image from these coefficients gives a slightly blurred but recognizable approximation. Recognition is performed by matching coefficient vectors: two images of the same person have similar PCA coordinates, while images of different people have different coordinates. The dimensionality reduction takes face matching from a $4096$-dimensional problem to a $50$-$200$-dimensional problem.

The procedure has known limitations: lighting variations dominate the early eigenfaces in a database with diverse illumination, and identity-relevant variation is buried in lower-rank components. Variants such as Fisherfaces (using [[symmetric-spectra|LDA]] instead of PCA) and modern deep learning approaches outperform eigenfaces today. But the conceptual content — *images are vectors, PCA finds the dominant axes of variation, low-rank approximations are recognizable* — remains fundamental.
    `.trim(),

    definitions: [
      {
        term: 'Image as vector',
        body: 'A grayscale image of $h \\times w$ pixels is the vector $\\mathbf{x} \\in \\mathbb{R}^{h w}$ obtained by stacking the rows (or columns) into a single column. A color image triples the dimension: one coordinate per pixel per channel.',
      },
      {
        term: 'Mean face',
        body: 'The pixel-wise average of all images in a face database, treated as a vector in $\\mathbb{R}^{h w}$ and visualized as an image. It is the *centering offset* used before PCA.',
      },
      {
        term: 'Eigenface',
        body: 'A unit-norm principal component of the centered face database, visualized as an image. Each eigenface is a pattern of pixel intensities that captures one axis of variation across the database.',
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
