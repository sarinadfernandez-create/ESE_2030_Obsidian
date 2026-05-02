import type { Concept } from '../types';

export const networkFlows: Concept = {
  id: 'network-flows',
  unitId: 'ch1',
  number: '1.9.1',
  title: 'Network Flows',
  blurb: 'Conservation laws on graphs become linear systems — and their solutions describe currents, traffic, and supply chains.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A **flow network** is a graph in which each edge carries some quantity — current in a circuit, water in a pipe network, traffic on a road, money in an economy. At each node, a conservation law holds: the total flow in equals the total flow out (with possible external sources or sinks). This balance equation, written across all nodes, is exactly a [[linear-systems|linear system]].

The matrix of this system is the **incidence matrix** of the graph: rows index nodes, columns index edges, and each column has a $+1$ for the edge's source node, a $-1$ for its target node, and $0$ elsewhere. Conservation at each node becomes one row of $Ax = b$, where $x$ is the vector of edge flows and $b$ encodes external sources and sinks.

Solving the system gives the flows. The structure of solutions reflects the structure of the graph in a deep way: the [[image-and-kernel|null space]] of the incidence matrix corresponds to **circulations** — flows that loop around cycles in the graph without net source or sink. The [[rank-and-conditioning|rank]] of the incidence matrix is one less than the number of nodes (because flows are determined only up to an overall potential offset). These connections between linear algebra and graph topology are made fully precise in [[graph-topology]] and reappear in [[spectral-graph-theory]].

The application matters historically and practically. Kirchhoff's laws for electrical circuits — the voltage law and the current law — are exactly the equations of a flow network, and Kirchhoff himself first observed the matrix-graph connection in the 1840s. Modern uses span everything from internet traffic engineering to supply-chain optimization to the analysis of biological signaling networks.
    `.trim(),

    definitions: [
      {
        term: 'Directed graph',
        body: 'A pair $(V, E)$ where $V$ is a set of nodes and $E$ is a set of directed edges, each connecting an ordered pair of nodes.',
      },
      {
        term: 'Incidence matrix',
        body: 'For a directed graph with $|V|$ nodes and $|E|$ edges, the $|V| \\times |E|$ matrix whose entry in row $v$ and column $e$ is $+1$ if $e$ enters $v$, $-1$ if $e$ leaves $v$, and $0$ otherwise.',
      },
      {
        term: 'Conservation law',
        body: 'At each node, the algebraic sum of incoming flows equals the algebraic sum of outgoing flows, plus any external source or sink at that node. Encoded as one row of the linear system $Ax = b$.',
      },
      {
        term: 'Circulation',
        body: 'A flow assignment in which every node has zero net source/sink. Forms the [[image-and-kernel|null space]] of the incidence matrix.',
      },
    ],

    theorems: [
      {
        name: 'Rank of the incidence matrix',
        statement: 'For a connected directed graph with $n$ nodes and $m$ edges, the incidence matrix has rank $n - 1$ and nullity $m - n + 1$.',
        intuition: "The $-1$ in rank reflects that potentials are determined only up to a constant — adding a constant to every node's potential changes nothing observable. The nullity counts independent cycles in the graph; each cycle supports an independent circulation.",
      },
    ],

    keyFormulas: [
      'Ax = b \\quad \\text{where } A \\text{ is the incidence matrix}',
      '\\text{rank}(A) = n - 1 \\quad \\text{(connected graph)}',
      '\\text{nullity}(A) = m - n + 1 \\quad \\text{(number of independent cycles)}',
    ],
  },

  explore: {
    vizComponent: 'NetworkFlowViz',
    description: 'A small directed graph with adjustable edge directions and node sources/sinks. The incidence matrix is shown alongside, and you can solve for the flows in real time as you change the network.',
    misconception: {
      title: 'Conservation does not mean equal flow on every edge',
      body: `
A node with one incoming edge and three outgoing edges balances if the incoming flow equals the *sum* of the three outgoing flows — not if each outgoing flow equals the incoming. Conservation is about totals, not per-edge equality.

A second, more subtle one: the choice of edge directions in the graph is somewhat arbitrary. Reversing an edge changes the signs in the corresponding column of the incidence matrix and the sign of the flow variable on that edge — but the overall solution structure is unchanged. The flows along reversed edges just come out negative, indicating the actual direction of motion.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Set up a small network',
        body: 'A graph with 3 nodes and 3 edges: edge 1 from node A to node B, edge 2 from node B to node C, edge 3 from node A to node C. Sources: 5 units enter at A, 5 units exit at C, no external flow at B.',
      },
      {
        title: 'Build the incidence matrix',
        body: '$A = \\begin{pmatrix} -1 & 0 & -1 \\\\ 1 & -1 & 0 \\\\ 0 & 1 & 1 \\end{pmatrix}$, $b = \\begin{pmatrix} -5 \\\\ 0 \\\\ 5 \\end{pmatrix}$.',
      },
      {
        title: 'Solve',
        body: 'The system $Ax = b$ has rank 2 (since $n - 1 = 2$), so the solution has one free parameter — corresponding to the cycle through all three nodes. Setting that parameter chooses how much flow goes via the direct edge versus the indirect path.',
      },
    ],

    problems: [
      {
        id: 'P-1.9.1a',
        difficulty: 2,
        statement: 'For a graph with 4 nodes connected in a square (4 edges, no diagonals), how many independent circulations are there?',
        hint: 'Use $\\text{nullity} = m - n + 1$. The square has $m = 4$, $n = 4$.',
        hasAnimatedSolution: false,
      },
      {
        id: 'P-1.9.1b',
        difficulty: 3,
        statement: "Show that the incidence matrix of any graph has the all-ones vector $(1, 1, \\dots, 1)^T$ in the [[image-and-kernel|left null space]]. (Think about what this vector means physically — it's why potentials are only defined up to a constant.)",
        hint: 'Multiply the all-ones row vector on the left of $A$. Each column of $A$ has exactly one $+1$ and one $-1$, so the product is zero.',
        hasAnimatedSolution: false,
      },
    ],
  },
};
