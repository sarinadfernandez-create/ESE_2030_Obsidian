import type { Concept } from '../types';

export const latentSemanticAnalysis: Concept = {
  id: 'latent-semantic-analysis',
  unitId: 'ch10',
  number: '10.5.1',
  title: 'Latent Semantic Analysis',
  blurb: 'SVD applied to a term-document matrix uncovers latent topics — directions in high-dimensional word space along which documents cluster.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A corpus of $d$ documents over a vocabulary of $w$ terms can be encoded as a **term-document matrix** $A \\in \\mathbb{R}^{w \\times d}$, with $A_{ij}$ equal to the (TF-IDF-weighted) frequency of term $i$ in document $j$. Most entries are zero: any given document uses only a small fraction of the vocabulary. The matrix is huge, sparse, and dominated by noise from synonym choice, word frequency variation, and stylistic differences between authors. Direct cosine-similarity comparisons between document columns are unreliable.

**Latent Semantic Analysis** (LSA), introduced by Deerwester et al. in 1990, applies the [[svd-form|SVD]] $A = U\\Sigma V^T$ and keeps only the top $k$ singular values to get a rank-$k$ approximation $A_k = U_k \\Sigma_k V_k^T$. The columns of $U_k$ — the top $k$ left singular vectors — are interpreted as **latent topics**: directions in word space that capture coherent semantic themes (e.g., one direction loads heavily on "neuron," "synapse," "axon," another on "transistor," "circuit," "voltage"). The columns of $V_k$ project each document onto these $k$ topics, giving a $k$-dimensional embedding where documents about similar topics cluster together regardless of exact word choice.

LSA is the prototype for every modern document embedding (word2vec, GloVe, BERT, etc.), all of which can be viewed as variations on "factor a co-occurrence matrix and use the factors as feature vectors." The SVD's role is foundational: it gives the optimal low-rank approximation to $A$ in [[spheres-ellipsoids|Frobenius norm]] (Eckart-Mirsky-Young theorem), so the $k$-topic representation is provably the best $k$-dimensional summary of the term-document matrix in least-squares sense. Truncation also serves as **denoising**: small singular values typically capture noise from idiosyncratic word usage, while large singular values capture systematic semantic structure. Dropping the small singular values therefore produces a cleaner representation than the original matrix.
    `.trim(),
    definitions: [
      {
        term: 'Term-document matrix',
        body: 'A matrix $A \\in \\mathbb{R}^{w \\times d}$ with $A_{ij}$ encoding the importance (TF-IDF weight) of term $i$ in document $j$. Typically very sparse and very high-dimensional.',
      },
      {
        term: 'Latent topic',
        body: 'A left singular vector $\\mathbf{u}_i \\in \\mathbb{R}^w$ of the term-document matrix, interpreted as a direction in word-frequency space along which a coherent semantic theme varies. The singular value $\\sigma_i$ measures how dominant this topic is in the corpus.',
      },
      {
        term: 'Document embedding',
        body: 'For a corpus with SVD $A = U\\Sigma V^T$, the $k$-dimensional vector $\\Sigma_k \\mathbf{v}_j$ (or simply $\\mathbf{v}_j$, the $j$-th row of $V$ truncated to $k$ components) representing document $j$. Documents with similar embeddings are semantically related.',
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
