import type { Concept } from '../types';

// Placeholder flagship content — full interactive content arrives in Deliverable 4.
export const gramSchmidtContent: Partial<Concept> = {
  tier: 'flagship',
  learn: {
    overview: `
The **Gram-Schmidt process** takes any basis $\\{\\mathbf{v}_1, \\ldots, \\mathbf{v}_n\\}$ for a subspace
and produces an **orthonormal basis** $\\{\\mathbf{e}_1, \\ldots, \\mathbf{e}_n\\}$ spanning the same subspace.

*Full definitions, theorems, and interactive content arrive in Deliverable 4.*
    `.trim(),
    definitions: [
      {
        term: 'Orthogonal Projection',
        body: 'The projection of $\\mathbf{v}$ onto $\\mathbf{u}$ is $\\mathrm{proj}_{\\mathbf{u}}\\mathbf{v} = \\dfrac{\\langle \\mathbf{v},\\mathbf{u}\\rangle}{\\langle \\mathbf{u},\\mathbf{u}\\rangle}\\mathbf{u}$.',
      },
      {
        term: 'Orthonormal Basis',
        body: 'A basis $\\{\\mathbf{e}_1, \\ldots, \\mathbf{e}_n\\}$ where $\\langle \\mathbf{e}_i, \\mathbf{e}_j\\rangle = \\delta_{ij}$.',
      },
    ],
    theorems: [
      {
        name: 'Gram-Schmidt Algorithm',
        statement: 'Given linearly independent $\\mathbf{v}_1, \\ldots, \\mathbf{v}_k$, define $\\mathbf{u}_j = \\mathbf{v}_j - \\sum_{i<j}\\mathrm{proj}_{\\mathbf{u}_i}\\mathbf{v}_j$, then $\\mathbf{e}_j = \\mathbf{u}_j / \\|\\mathbf{u}_j\\|$. The result is an orthonormal basis.',
        intuition: 'At each step, strip away the components already accounted for by earlier basis vectors.',
      },
    ],
    keyFormulas: [
      '\\mathbf{u}_j = \\mathbf{v}_j - \\sum_{i=1}^{j-1}\\frac{\\langle \\mathbf{v}_j,\\mathbf{u}_i\\rangle}{\\langle \\mathbf{u}_i,\\mathbf{u}_i\\rangle}\\mathbf{u}_i',
      'A = QR',
    ],
  },
  explore: {
    vizComponent: 'GramSchmidtViz',
    description: 'Drag the input vectors to see how Gram-Schmidt progressively orthogonalizes them. Watch the projection and subtraction steps animate in real time.',
    misconception: {
      title: 'Gram-Schmidt is numerically unstable in its classical form',
      body: "The classical Gram-Schmidt algorithm accumulates floating-point errors. In practice, **modified Gram-Schmidt** (subtracting projections one at a time rather than all at once) is far more stable — though the result is the same in exact arithmetic.",
    },
  },
  practice: {
    workedExample: [
      {
        title: 'Orthogonalize $\\mathbf{v}_1 = (1, 1, 0)^T$, $\\mathbf{v}_2 = (1, 0, 1)^T$',
        body: 'Set $\\mathbf{u}_1 = \\mathbf{v}_1$. Then $\\mathbf{u}_2 = \\mathbf{v}_2 - \\frac{\\langle \\mathbf{v}_2,\\mathbf{u}_1\\rangle}{\\|\\mathbf{u}_1\\|^2}\\mathbf{u}_1 = (1,0,1)^T - \\frac{1}{2}(1,1,0)^T = (\\tfrac{1}{2},-\\tfrac{1}{2},1)^T$.',
      },
    ],
    problems: [
      {
        id: 'P-5.4a',
        difficulty: 1,
        statement: 'Apply Gram-Schmidt to $\\mathbf{v}_1 = (1, 1)^T$ and $\\mathbf{v}_2 = (0, 2)^T$ to find an orthonormal basis for $\\mathbb{R}^2$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-5.4b',
        difficulty: 2,
        statement: 'Show that the Gram-Schmidt process applied to the columns of $A$ produces the QR factorization $A = QR$.',
        hint: 'Express each original column as a linear combination of the orthonormal columns.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
