import type { Concept } from '../types';

export const textEmbeddings: Concept = {
  id: 'text-embeddings',
  unitId: 'ch5',
  number: '5.8.3',
  title: 'Text Embeddings',
  blurb: 'Represent words and documents as vectors so that similarity becomes inner product geometry.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
**Text embeddings** map words, sentences, or documents to vectors in $\\mathbb{R}^d$ such that semantic similarity corresponds to [[dot-and-inner-products|inner product]] geometry — typically cosine similarity. Once text is embedded, all the linear-algebra tools of inner product spaces apply: [[angles-and-orthogonality|angle]] measures relatedness, [[orthogonal-projections|projection]] removes confounding directions, and [[principal-components|PCA]] reveals the dominant axes of variation.

Classical embeddings like **word2vec** and **GloVe** train shallow neural networks to produce vectors $v_w$ for each word $w$ such that $v_w \\cdot v_{w'} \\approx \\log P(w, w')$ — words that co-occur often have aligned vectors. Modern transformer-based embeddings (BERT, sentence-transformers) produce contextual embeddings: a single word can have different vectors depending on the surrounding text, and the resulting embeddings of full sentences or documents capture nuanced meaning.

The key linear-algebra facts: (1) the embedding space is an [[dot-and-inner-products|inner product space]], typically with the standard dot product, where cosine similarity $\\cos\\theta = \\langle u, v \\rangle / (\\|u\\| \\|v\\|)$ measures semantic relatedness; (2) operations like averaging word embeddings to represent a sentence are [[linear-transformation-defs|linear operations]] in the embedding space; (3) "concept directions" can sometimes be identified as specific vectors — the gender direction, the sentiment direction — and projecting onto or away from these directions yields debiasing or attribute manipulation. Linear algebra makes these manipulations precise and computable.
    `.trim(),

    definitions: [
      {
        term: 'Word embedding',
        body: 'A function from a vocabulary $V$ to $\\mathbb{R}^d$ mapping each word $w \\in V$ to a vector $v_w$ such that semantic similarity corresponds to vector similarity (typically cosine).',
      },
      {
        term: 'Cosine similarity',
        body: 'For vectors $u, v$: $\\cos\\theta = \\langle u, v \\rangle / (\\|u\\| \\, \\|v\\|)$. Bounded in $[-1, 1]$, with $1$ meaning identical direction, $0$ meaning orthogonal, $-1$ meaning anti-parallel.',
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
