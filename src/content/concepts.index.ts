import type { Concept } from './types';
import { CONCEPT_NODES, UNITS, EDGES } from './graph';
import { eigenvectors } from './concepts/eigenvectors';
import { gramSchmidt } from './concepts/gram-schmidt';

export { UNITS, EDGES };

const FLAGSHIP_OVERRIDES: Record<string, Concept> = {
  eigenvectors,
  'gram-schmidt': gramSchmidt,
};

export const CONCEPTS: Concept[] = CONCEPT_NODES.map((node): Concept => {
  const override = FLAGSHIP_OVERRIDES[node.id];
  if (override) return { ...node, ...override };
  return node as Concept;
});

export function getConceptById(id: string): Concept | undefined {
  return CONCEPTS.find((c) => c.id === id);
}

export function getUnitById(id: string) {
  return UNITS.find((u) => u.id === id);
}
