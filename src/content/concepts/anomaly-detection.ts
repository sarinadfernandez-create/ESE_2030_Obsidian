import type { Concept } from '../types';

export const anomalyDetection: Concept = {
  id: 'anomaly-detection',
  unitId: 'ch12',
  number: '12.6.2',
  title: 'Anomaly Detection via Low-Rank-Plus-Sparse Decomposition',
  blurb: 'Network traffic, industrial sensors, financial transactions: in each, normal behavior is governed by a few underlying modes (low-rank) and anomalies are localized in time and source (sparse). Robust PCA isolates the anomalies.',
  tier: 'full',
  isApplication: true,
  learn: {
    overview: `
Many monitoring problems share the same matrix structure: rows are entities (sensors, devices, accounts), columns are time points. Under normal conditions, entities exhibit correlated behavior governed by a few latent factors — diurnal patterns, shared workload — so the matrix is approximately low-rank. **Anomalies** are localized deviations: a sensor malfunctioning briefly, a network intrusion targeting a few hosts, a fraudulent transaction. These appear as a **sparse** signal concentrated on a few entries. The [[robust-factorization|Robust PCA / Principal Component Pursuit]] machinery is purpose-built: decompose $M = L + S$ with $L$ capturing normal low-rank behavior and $S$ capturing sparse anomalies. The nonzero entries of $S$ flag exactly which entity behaved anomalously when.

In **industrial monitoring**, sensors instrumenting a manufacturing line measure temperature, vibration, current at high frequency. Healthy operation has correlated sensors (a few process modes); a failing component shows as a sparse anomaly. The Robust PCA decomposition identifies failures before propagation.

In **network security**, packet-flow matrices (source-destination pairs $\\times$ time bins) are normally low-rank. DDoS attacks, port scans, and lateral-movement intrusions are sparse perturbations. PCP-based anomaly detection identifies them in near real time.

In **financial fraud detection**, account-transaction matrices have low-rank normal patterns (customer archetypes) and sparse anomalies (fraudulent transactions).

The **conceptual unification** is striking: the same algorithmic machinery that separates background from foreground in video ([[robust-factorization|Unit 12.5]]), separates honest from spam ratings ([[netflix-prize|Unit 12.6.1]]), and separates normal operation from anomalies in industrial monitoring. The unifying principle is the **low-rank-plus-sparse** model.

A practical caveat: real-time detection requires streaming updates as new data arrives. **Online Robust PCA** variants (GRASTA, ORPCA) update the low-rank subspace incrementally without recomputing from scratch.

A theoretical caveat: the convex relaxation requires the support of $S$ to be approximately random. Clustered anomalies (an intrusion affecting a subnet for sustained intervals) violate sparsity assumptions. Modern extensions (block-sparse PCP, structured-sparse PCP) handle these by replacing entrywise $L^1$ with group norms.
    `.trim(),
    definitions: [
      {
        term: 'Low-rank-plus-sparse model',
        body: '$M = L + S$ where $L$ is low-rank (normal behavior, few latent modes) and $S$ is sparse (anomalies, isolated in space and time).',
      },
      {
        term: 'Spatiotemporal anomaly',
        body: 'A deviation localized to a small subset of entities (rows) over a short time window (columns). Corresponds to a sparse support pattern.',
      },
      {
        term: 'Online Robust PCA',
        body: 'A streaming variant of PCP that updates the low-rank subspace estimate as new column-data arrives, without recomputing the full SVD.',
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
