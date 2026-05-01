import type { Concept } from '../types';

// Placeholder flagship content — full interactive content arrives in Deliverable 3.
export const eigenvectorsContent: Partial<Concept> = {
  tier: 'flagship',
  learn: {
    overview: `
An **eigenvector** of a square matrix $A$ is a nonzero vector $\\mathbf{v}$ such that
$$A\\mathbf{v} = \\lambda \\mathbf{v}$$
for some scalar $\\lambda$, called the **eigenvalue**.

*Full definitions, theorems, and interactive content arrive in Deliverable 3.*
    `.trim(),
    definitions: [
      {
        term: 'Eigenvector',
        body: 'A nonzero vector $\\mathbf{v}$ such that $A\\mathbf{v} = \\lambda\\mathbf{v}$ for some scalar $\\lambda$.',
      },
      {
        term: 'Eigenvalue',
        body: 'The scalar $\\lambda$ such that $A\\mathbf{v} = \\lambda\\mathbf{v}$ for a nonzero eigenvector $\\mathbf{v}$.',
      },
      {
        term: 'Characteristic Polynomial',
        body: 'The polynomial $p(\\lambda) = \\det(A - \\lambda I)$, whose roots are the eigenvalues of $A$.',
      },
    ],
    theorems: [
      {
        name: 'Eigendecomposition',
        statement: 'If $A$ has $n$ linearly independent eigenvectors $\\mathbf{v}_1, \\ldots, \\mathbf{v}_n$ with eigenvalues $\\lambda_1, \\ldots, \\lambda_n$, then $A = PDP^{-1}$ where $P = [\\mathbf{v}_1 \\cdots \\mathbf{v}_n]$ and $D = \\mathrm{diag}(\\lambda_1, \\ldots, \\lambda_n)$.',
        intuition: "Eigenvectors are the 'natural axes' of a transformation — the directions where the map simply scales.",
      },
    ],
    keyFormulas: [
      'A\\mathbf{v} = \\lambda\\mathbf{v}',
      '\\det(A - \\lambda I) = 0',
      'A = PDP^{-1}',
    ],
  },
  explore: {
    vizComponent: 'EigenvectorViz',
    description: 'Drag any vector to see how A transforms it. Watch for the special directions where the vector only stretches — those are the eigenvectors.',
    misconception: {
      title: 'Eigenvectors are not special vectors of the matrix itself',
      body: "Eigenvectors depend on *both* the matrix and the transformation context. The same matrix can have completely different eigenvectors depending on whether you view it as acting on $\\mathbb{R}^2$ vs. $\\mathbb{C}^2$.",
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Find the eigenvalues of $A = \\begin{pmatrix}2 & 1 \\\\ 0 & 3\\end{pmatrix}$',
        body: 'Solve $\\det(A - \\lambda I) = (2 - \\lambda)(3 - \\lambda) = 0$, giving $\\lambda_1 = 2$, $\\lambda_2 = 3$.',
      },
    ],
    problems: [
      {
        id: 'P-7.3a',
        difficulty: 1,
        statement: 'Find all eigenvalues and eigenvectors of $A = \\begin{pmatrix}3 & 0 \\\\ 0 & -1\\end{pmatrix}$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-7.3b',
        difficulty: 2,
        statement: 'Show that if $\\mathbf{v}$ is an eigenvector of $A$ with eigenvalue $\\lambda$, then $\\mathbf{v}$ is an eigenvector of $A^2$ with eigenvalue $\\lambda^2$.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
