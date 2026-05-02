import type { Concept, Edge } from './types';
import { CONCEPT_NODES, UNITS, MANUAL_EDGES, EDGES } from './graph';
import { eigenvectors } from './concepts/eigenvectors';
import { gramSchmidt } from './concepts/gram-schmidt';
import { linearSystems } from './concepts/linear-systems';
import { specialMatrices } from './concepts/special-matrices';
import { rowReduction } from './concepts/row-reduction';
import { inverses } from './concepts/inverses';
import { gaussianElimination } from './concepts/gaussian-elimination';
import { luDecomposition } from './concepts/lu-decomposition';
import { pluDecomposition } from './concepts/plu-decomposition';
import { rankAndConditioning } from './concepts/rank-and-conditioning';
import { networkFlows } from './concepts/network-flows';
import { structuralAnalysis } from './concepts/structural-analysis';
import { vectorSpaceAxioms } from './concepts/vector-space-axioms';
import { vectorSpaceExamples } from './concepts/vector-space-examples';
import { subspaces } from './concepts/subspaces';
import { spanAndIndependence } from './concepts/span-and-independence';
import { dimension } from './concepts/dimension';
import { engineeringSignals } from './concepts/engineering-signals';
import { linearDifferentialEquations } from './concepts/linear-differential-equations';
import { extractConceptBacklinks } from '../lib/parseBacklinks';

export { UNITS, MANUAL_EDGES, EDGES };

// Concepts whose stub-tier entry in graph.ts gets fully overridden with
// content from a dedicated file. Flagship and full tier alike live here.
const CONTENT_OVERRIDES: Record<string, Concept> = {
  eigenvectors,
  'gram-schmidt': gramSchmidt,
  'linear-systems': linearSystems,
  'special-matrices': specialMatrices,
  'row-reduction': rowReduction,
  inverses,
  'gaussian-elimination': gaussianElimination,
  'lu-decomposition': luDecomposition,
  'plu-decomposition': pluDecomposition,
  'rank-and-conditioning': rankAndConditioning,
  'network-flows': networkFlows,
  'structural-analysis': structuralAnalysis,
  'vector-space-axioms': vectorSpaceAxioms,
  'vector-space-examples': vectorSpaceExamples,
  subspaces,
  'span-and-independence': spanAndIndependence,
  dimension,
  'engineering-signals': engineeringSignals,
  'linear-differential-equations': linearDifferentialEquations,
};

export const CONCEPTS: Concept[] = CONCEPT_NODES.map((node): Concept => {
  const override = CONTENT_OVERRIDES[node.id];
  if (override) return { ...node, ...override };
  return node as Concept;
});

export function getConceptById(id: string): Concept | undefined {
  return CONCEPTS.find((c) => c.id === id);
}

export function getUnitById(id: string) {
  return UNITS.find((u) => u.id === id);
}

// ── Edge computation: manual ∪ mention ∪ note, deduplicated ────────────────
//
// Manual edges are the editorial skeleton (curated semantic types).
// Mention edges are derived from [[backlinks]] in concept prose, type 'related'.
// Manual takes precedence: between the same pair, the manual edge wins and the
// mention edge is dropped.

const VALID_IDS = new Set(CONCEPTS.map((c) => c.id));

// Compute mention edges once at module load — concept prose is static at runtime.
function _computeMentionEdges(): Edge[] {
  const edges: Edge[] = [];
  for (const concept of CONCEPTS) {
    for (const m of extractConceptBacklinks(concept)) {
      if (!VALID_IDS.has(m.conceptId)) continue; // broken link — drop silently here, surfaced by validate-links
      edges.push({
        from: concept.id,
        to: m.conceptId,
        type: 'related',
        source: { kind: 'mention', location: `${concept.id}.${m.location}` },
      });
    }
  }
  return edges;
}

const MENTION_EDGES_CACHE: Edge[] = _computeMentionEdges();

export function computeMentionEdges(): Edge[] {
  return MENTION_EDGES_CACHE;
}

function edgeKey(e: Edge): string {
  // Undirected dedup: A→B and B→A share a key.
  return [e.from, e.to].slice().sort().join('::');
}

// Returns the deduplicated union of manual + mention + note edges.
// Manual wins ties; among non-manual, the first encountered wins.
export function getAllEdges(userNoteEdges: Edge[] = []): Edge[] {
  const seen = new Map<string, Edge>();

  // Manual first — they win.
  for (const e of MANUAL_EDGES) {
    const tagged: Edge = e.source ? e : { ...e, source: { kind: 'manual' } };
    seen.set(edgeKey(e), tagged);
  }

  for (const e of MENTION_EDGES_CACHE) {
    const k = edgeKey(e);
    if (!seen.has(k)) seen.set(k, e);
  }

  for (const e of userNoteEdges) {
    const k = edgeKey(e);
    if (!seen.has(k)) seen.set(k, e);
  }

  return Array.from(seen.values());
}
