import type { Concept } from './types';
import { CONCEPT_NODES, UNITS, EDGES } from './graph';
import { eigenvectorsContent } from './concepts/eigenvectors';
import { gramSchmidtContent } from './concepts/gram-schmidt';

export { UNITS, EDGES };

export const CONCEPTS: Concept[] = CONCEPT_NODES.map((node): Concept => {
  if (node.id === 'eigenvectors') return { ...node, ...eigenvectorsContent } as Concept;
  if (node.id === 'gram-schmidt') return { ...node, ...gramSchmidtContent } as Concept;
  return node as Concept;
});

export function getConceptById(id: string): Concept | undefined {
  return CONCEPTS.find((c) => c.id === id);
}

export function getUnitById(id: string) {
  return UNITS.find((u) => u.id === id);
}
