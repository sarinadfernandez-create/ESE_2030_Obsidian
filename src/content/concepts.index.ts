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
import { euclideanTransformations } from './concepts/euclidean-transformations';
import { linearTransformationDefs } from './concepts/linear-transformation-defs';
import { linearTransformationExamples } from './concepts/linear-transformation-examples';
import { injectiveSurjective } from './concepts/injective-surjective';
import { imageAndKernel } from './concepts/image-and-kernel';
import { rankAndNullity } from './concepts/rank-and-nullity';
import { quotients } from './concepts/quotients';
import { coimageCokernel } from './concepts/coimage-cokernel';
import { fundamentalTheorem } from './concepts/fundamental-theorem';
import { graphTopology } from './concepts/graph-topology';
import { bases } from './concepts/bases';
import { coordinates } from './concepts/coordinates';
import { changeOfBasis } from './concepts/change-of-basis';
import { matrixRepresentations } from './concepts/matrix-representations';
import { similarity } from './concepts/similarity';
import { roboticKinematics } from './concepts/robotic-kinematics';
import { computerGraphics } from './concepts/computer-graphics';
import { dotAndInnerProducts } from './concepts/dot-and-inner-products';
import { anglesAndOrthogonality } from './concepts/angles-and-orthogonality';
import { orthonormalBases } from './concepts/orthonormal-bases';
import { adjointsAndTransposes } from './concepts/adjoints-and-transposes';
import { orthogonalTransformations } from './concepts/orthogonal-transformations';
import { qrDecomposition } from './concepts/qr-decomposition';
import { kMeans } from './concepts/k-means';
import { imageSegmentation } from './concepts/image-segmentation';
import { textEmbeddings } from './concepts/text-embeddings';
import { quantumMeasurement } from './concepts/quantum-measurement';
import { firstOrderSystems } from './concepts/first-order-systems';
import { coupledSystems } from './concepts/coupled-systems';
import { simpleDiagonalization } from './concepts/simple-diagonalization';
import { matrixExponentials } from './concepts/matrix-exponentials';
import { higherOrderEquations } from './concepts/higher-order-equations';
import { basisSolutions } from './concepts/basis-solutions';
import { buildingTemperature } from './concepts/building-temperature';
import { vehicleSuspension } from './concepts/vehicle-suspension';
import { orthogonalComplements } from './concepts/orthogonal-complements';
import { orthogonalProjections } from './concepts/orthogonal-projections';
import { geometricFundamentalTheorem } from './concepts/geometric-fundamental-theorem';
import { leastSquares } from './concepts/least-squares';
import { regularizedLeastSquares } from './concepts/regularized-least-squares';
import { signalProcessing } from './concepts/signal-processing';
import { imageProcessing } from './concepts/image-processing';
import { svm } from './concepts/svm';
import { complexEigenvalues } from './concepts/complex-eigenvalues';
import { repeatedEigenvalues } from './concepts/repeated-eigenvalues';
import { jordanForm } from './concepts/jordan-form';
import { findingJordanForm } from './concepts/finding-jordan-form';
import { computingEigenvalues } from './concepts/computing-eigenvalues';
import { powerGrid } from './concepts/power-grid';
import { chemicalNetworks } from './concepts/chemical-networks';
import { iteration } from './concepts/iteration';
import { dominanceConvergence } from './concepts/dominance-convergence';
import { perronFrobenius } from './concepts/perron-frobenius';
import { symmetricSpectra } from './concepts/symmetric-spectra';
import { consensus } from './concepts/consensus';
import { spectralGraphTheory } from './concepts/spectral-graph-theory';
import { pagerank } from './concepts/pagerank';
import { spheresEllipsoids } from './concepts/spheres-ellipsoids';
import { polarDecomposition } from './concepts/polar-decomposition';
import { svdForm } from './concepts/svd-form';
import { svdInvariance } from './concepts/svd-invariance';
import { latentSemanticAnalysis } from './concepts/latent-semantic-analysis';
import { sensorNetworks } from './concepts/sensor-networks';
import { tensors } from './concepts/tensors';
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
  'euclidean-transformations': euclideanTransformations,
  'linear-transformation-defs': linearTransformationDefs,
  'linear-transformation-examples': linearTransformationExamples,
  'injective-surjective': injectiveSurjective,
  'image-and-kernel': imageAndKernel,
  'rank-and-nullity': rankAndNullity,
  quotients,
  'coimage-cokernel': coimageCokernel,
  'fundamental-theorem': fundamentalTheorem,
  'graph-topology': graphTopology,
  bases,
  coordinates,
  'change-of-basis': changeOfBasis,
  'matrix-representations': matrixRepresentations,
  similarity,
  'robotic-kinematics': roboticKinematics,
  'computer-graphics': computerGraphics,
  'dot-and-inner-products': dotAndInnerProducts,
  'angles-and-orthogonality': anglesAndOrthogonality,
  'orthonormal-bases': orthonormalBases,
  'adjoints-and-transposes': adjointsAndTransposes,
  'orthogonal-transformations': orthogonalTransformations,
  'qr-decomposition': qrDecomposition,
  'k-means': kMeans,
  'image-segmentation': imageSegmentation,
  'text-embeddings': textEmbeddings,
  'quantum-measurement': quantumMeasurement,
  'first-order-systems': firstOrderSystems,
  'coupled-systems': coupledSystems,
  'simple-diagonalization': simpleDiagonalization,
  'matrix-exponentials': matrixExponentials,
  'higher-order-equations': higherOrderEquations,
  'basis-solutions': basisSolutions,
  'building-temperature': buildingTemperature,
  'vehicle-suspension': vehicleSuspension,
  'orthogonal-complements': orthogonalComplements,
  'orthogonal-projections': orthogonalProjections,
  'geometric-fundamental-theorem': geometricFundamentalTheorem,
  'least-squares': leastSquares,
  'regularized-least-squares': regularizedLeastSquares,
  'signal-processing': signalProcessing,
  'image-processing': imageProcessing,
  svm,
  'complex-eigenvalues': complexEigenvalues,
  'repeated-eigenvalues': repeatedEigenvalues,
  'jordan-form': jordanForm,
  'finding-jordan-form': findingJordanForm,
  'computing-eigenvalues': computingEigenvalues,
  'power-grid': powerGrid,
  'chemical-networks': chemicalNetworks,
  iteration,
  'dominance-convergence': dominanceConvergence,
  'perron-frobenius': perronFrobenius,
  'symmetric-spectra': symmetricSpectra,
  consensus,
  'spectral-graph-theory': spectralGraphTheory,
  pagerank,
  'spheres-ellipsoids': spheresEllipsoids,
  'polar-decomposition': polarDecomposition,
  'svd-form': svdForm,
  'svd-invariance': svdInvariance,
  'latent-semantic-analysis': latentSemanticAnalysis,
  'sensor-networks': sensorNetworks,
  tensors,
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
