import type { Concept } from '../types';

export const netflixPrize: Concept = {
  id: 'netflix-prize',
  unitId: 'ch12',
  number: '12.6.1',
  title: 'The Netflix Prize and Modern Recommender Systems',
  blurb: 'A $1 million competition launched the modern theory of matrix completion and remade an industry. The winning approach was low-rank factorization of an enormous, sparse user-movie rating matrix.',
  tier: 'full',
  isApplication: true,
  learn: {
    overview: `
In October 2006, Netflix released a dataset of $100$ million movie ratings from $480{,}000$ subscribers across $17{,}770$ films and offered \\$1{,}000{,}000$ to anyone who could improve their in-house recommendation system's RMSE by $10\\%$. The training data was a sparse matrix $M \\in \\mathbb{R}^{480000 \\times 17770}$ with only about $1\\%$ of entries filled. The task — predict each subscriber's ratings for films they had not yet seen — is exactly [[matrix-completion|matrix completion]] with a real-world dataset, real-world objective, and a million-dollar incentive.

The winning approach was a low-rank factorization model: each rating $M_{u, m}$ decomposes as $M_{u, m} \\approx \\mathbf{p}_u^T \\mathbf{q}_m$, where $\\mathbf{p}_u \\in \\mathbb{R}^k$ is a "latent feature vector" for user $u$ and $\\mathbf{q}_m \\in \\mathbb{R}^k$ for movie $m$. The dimensions are not pre-specified; they emerge from the data. Winning models used $k \\approx 50$ to $200$. The optimization is exactly the [[matrix-completion|alternating minimization]] of Unit 12.4, with regularization, per-user/per-movie biases, and temporal effects.

The winning team **BellKor's Pragmatic Chaos** submitted on the final day, narrowly beating a competing team. Their solution was an ensemble of hundreds of models — primarily matrix factorizations of various flavors, blended via linear regression. Total improvement: $10.06\\%$.

The intellectual legacy is enormous. The Netflix Prize established **matrix factorization** as the canonical approach to collaborative filtering, used today by every major streaming service. It established **ensembling** as routine for production systems. And it accelerated research on theoretical guarantees (Candès-Recht, Candès-Tao). The mathematical content — alternating minimization on $\\min \\sum_{(u, m) \\in \\Omega} (M_{u,m} - \\mathbf{p}_u^T \\mathbf{q}_m)^2 + \\lambda (\\|\\mathbf{p}\\|^2 + \\|\\mathbf{q}\\|^2)$ — is exactly [[matrix-completion|Unit 12.4]] at scale.

Netflix never deployed the winning system. By 2009, they had transitioned from DVD-by-mail (where ratings mattered) to streaming (where what you finished watching matters). The Netflix Prize remains a landmark for crystallizing a generation of research, not for the deployed solution.

A second legacy: the **privacy disaster**. Narayanan and Shmatikov (2007) de-anonymized the dataset by cross-referencing with public IMDB reviews. This led to a 2009 class-action lawsuit and Netflix's cancellation of a planned sequel prize. "Anonymized" rating matrices contain re-identifiable signatures; modern systems use differential privacy and federated learning.
    `.trim(),
    definitions: [
      {
        term: 'Latent feature model',
        body: 'A model assuming user-item interactions follow $M_{u, i} \\approx \\mathbf{p}_u^T \\mathbf{q}_i$ for unobserved feature vectors. Dimensions $k$ typically 50-200; features inferred from data.',
      },
      {
        term: 'RMSE',
        body: 'The Netflix Prize objective: $\\sqrt{\\frac{1}{|\\Omega_{\\text{test}}|} \\sum (M - \\hat M)^2}$. Equivalent to Frobenius norm restricted to test entries.',
      },
      {
        term: 'Ensembling',
        body: 'Combining predictions from multiple models via linear regression on validation data. The winning entry blended hundreds of base models.',
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
