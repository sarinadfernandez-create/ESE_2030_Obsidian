import type { Concept } from '../types';

export const graphTopology: Concept = {
  id: 'graph-topology',
  unitId: 'ch3',
  number: '3.10',
  title: 'Graph Topology & Network Structure',
  blurb: 'The Fundamental Theorem applied to graphs reveals the deep relationship between cycles and connectedness.',
  tier: 'full',
  isApplication: true,

  learn: {
    overview: `
A directed graph with $n$ nodes and $m$ edges has an [[network-flows|incidence matrix]] $A \\in \\mathbb{R}^{n \\times m}$ — rows indexed by nodes, columns by edges, with each column containing $-1$ at the source node and $+1$ at the target node of its edge. This matrix represents a [[linear-transformation-defs|linear transformation]] $T: \\mathbb{R}^m \\to \\mathbb{R}^n$ from "edge flows" to "net flow at each node."

The [[fundamental-theorem|Fundamental Theorem of Linear Algebra]] applied to this matrix yields beautiful and direct interpretations of graph structure:

- **Kernel of $A$** = set of edge flows where every node is balanced (flow in equals flow out). These are **circulations** — flows that loop around cycles in the graph. The dimension of the kernel equals the **number of independent cycles** in the graph.

- **Image of $A$** = set of node-imbalance vectors achievable by some flow. The dimension of the image equals $n - c$, where $c$ is the number of connected components (one degree of freedom per component is lost to the constraint "total flow = 0 within each component").

- **Cokernel of $A$** = quotient of the node space by the image, with dimension $c$. Each connected component contributes one cokernel dimension, corresponding to the constraint that node potentials are only determined up to a constant within each component.

- **Coimage of $A$** $\\cong$ **Image of $A$**, both with dimension $\\text{rank}(A) = n - c = m - (\\text{number of cycles})$.

This four-way decomposition reveals **Euler's formula** for graphs in linear-algebraic form: $m = (\\text{edges in spanning forest}) + (\\text{independent cycles}) = (n - c) + (m - n + c)$. The first term equals the rank; the second equals the nullity; rank + nullity = $m$ = number of columns of $A$ — exactly rank-nullity.

The connection to physical networks is direct. For an electrical circuit:
- Nodes are wire junctions; edges are circuit elements.
- Edge flows are currents.
- Node imbalances are external currents flowing in/out.
- The kernel (circulations) corresponds to **Kirchhoff's voltage law solutions** — currents that satisfy KVL by looping around loops.
- The image corresponds to **Kirchhoff's current law solutions** — net flows consistent with conservation at each node.

For a road network or a supply chain, similar interpretations hold: cycles allow rerouting without changing net flow; connected components are independent sub-systems.

This application makes the abstract algebra of the FTLA tangible. Each fundamental subspace has a concrete physical meaning, and the dimensions count things you can see in the graph (cycles, components, edges).
    `.trim(),

    definitions: [
      {
        term: 'Incidence matrix',
        body: 'For a directed graph with $n$ nodes and $m$ edges: the $n \\times m$ matrix with $A_{ij} = +1$ if edge $j$ enters node $i$, $-1$ if it leaves, and $0$ otherwise.',
      },
      {
        term: 'Circulation',
        body: 'An edge flow assignment in which every node is balanced (no external sources or sinks). Forms the kernel of the incidence matrix.',
      },
      {
        term: 'Connected component',
        body: 'A maximal subset of nodes such that every pair is connected by a path of edges (in the underlying undirected graph).',
      },
    ],

    theorems: [
      {
        name: 'Rank of the incidence matrix',
        statement: 'For a graph with $n$ nodes, $m$ edges, and $c$ connected components: $\\text{rank}(A) = n - c$ and $\\text{nullity}(A) = m - n + c$.',
        intuition: 'Each connected component imposes one constraint (sum of node imbalances = 0), reducing the rank by one per component. The nullity counts independent cycles — Euler\'s formula $V - E + F = 2$ for planar graphs is the topological face of this fact.',
      },
    ],

    keyFormulas: [
      '\\text{rank}(A) = n - c',
      '\\text{nullity}(A) = m - n + c',
      '\\text{rank} + \\text{nullity} = m \\quad \\text{(Euler / rank-nullity)}',
    ],
  },

  explore: {
    vizComponent: null,
    description: 'No interactive visualization for this application.',
    misconception: {
      title: 'The kernel of the incidence matrix consists of CIRCULATIONS, not just zero',
      body: `
A common error is thinking that "balanced flow at every node" means "no flow at all." It does not. A circulation is a nonzero flow in which every node has equal incoming and outgoing flow — for example, a unit flow looping around a cycle.

The number of independent circulations equals the dimension of the kernel of the incidence matrix, which is also the number of independent cycles in the graph. A tree has no cycles and no circulations (kernel = $\\{0\\}$). A graph with one cycle has a 1-dimensional kernel. A graph with $k$ independent cycles has a $k$-dimensional kernel.

A second misconception: thinking the rank of the incidence matrix equals the number of nodes. It does not. The rank is $n - c$, where $c$ is the number of connected components. For a connected graph ($c = 1$), the rank is $n - 1$, not $n$. The "missing dimension" comes from the constraint that the all-ones vector $(1, 1, \\dots, 1)$ is in the left null space — meaning the rows of the incidence matrix always sum to zero.
      `.trim(),
    },
  },

  practice: {
    workedExample: [
      {
        title: 'Compute the dimensions for a triangle',
        body: 'A triangle graph has $n = 3$ nodes, $m = 3$ edges, and $c = 1$ connected component. By the rank formula: $\\text{rank}(A) = n - c = 2$. By the nullity formula: $\\text{nullity}(A) = m - n + c = 3 - 3 + 1 = 1$. So one independent circulation exists — corresponding to the one cycle (the triangle itself).',
      },
    ],

    problems: [
      {
        id: 'P-3.10a',
        format: 'multiple-choice' as const,
        difficulty: 2,
        statement: 'A connected graph has $n = 5$ nodes and $m = 7$ edges. How many independent circulations does it support?',
        choices: [
          { label: 'A' as const, body: '$1$' },
          { label: 'B' as const, body: '$2$' },
          { label: 'C' as const, body: '$3$' },
          { label: 'D' as const, body: '$5$' },
          { label: 'E' as const, body: '$7$' },
        ],
        correctAnswer: 'C' as const,
        solution: {
          explanation: 'For a connected graph, $\\text{nullity}(A) = m - n + 1 = 7 - 5 + 1 = 3$. Three independent circulations.',
          trickAnalysis: [
            { choice: 'A' as const, why: 'Underestimates — each independent cycle in the graph is a circulation, and a graph with $m - n + 1 = 3$ extra edges beyond a spanning tree has $3$ cycles.' },
            { choice: 'B' as const, why: 'Off by one.' },
            { choice: 'D' as const, why: 'This is $n$. The number of nodes is unrelated to the number of cycles.' },
            { choice: 'E' as const, why: 'This is $m$. The number of edges, again unrelated directly to the cycle count.' },
          ],
        },
      },
    ],
  },
};
