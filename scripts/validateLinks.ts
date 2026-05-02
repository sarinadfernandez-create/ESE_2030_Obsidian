// Walks all concept prose, checks every [[id]] backlink against the concept index,
// and reports orphans (concepts with no edges of any kind).
// Run via: npm run validate-links

import {
  CONCEPTS,
  MANUAL_EDGES,
  computeMentionEdges,
} from '../src/content/concepts.index';
import {
  extractConceptBacklinks,
  isValidConceptId,
} from '../src/lib/parseBacklinks';

let errors = 0;
let warnings = 0;

// Broken backlinks
for (const concept of CONCEPTS) {
  const mentions = extractConceptBacklinks(concept);
  for (const m of mentions) {
    if (!isValidConceptId(m.conceptId)) {
      console.error(
        `✗ broken link in ${concept.id} (${m.location}): [[${m.conceptId}]] does not exist`
      );
      errors++;
    }
  }
}

// Manual edges referencing missing concepts
for (const edge of MANUAL_EDGES) {
  if (!isValidConceptId(edge.from)) {
    console.error(`✗ manual edge references invalid 'from': ${edge.from}`);
    errors++;
  }
  if (!isValidConceptId(edge.to)) {
    console.error(`✗ manual edge references invalid 'to': ${edge.to}`);
    errors++;
  }
}

// Orphans
const allEdges = [...MANUAL_EDGES, ...computeMentionEdges()];
const connected = new Set<string>();
for (const edge of allEdges) {
  connected.add(edge.from);
  connected.add(edge.to);
}
for (const concept of CONCEPTS) {
  if (!connected.has(concept.id)) {
    console.warn(`⚠ orphan concept: ${concept.id} (no incoming or outgoing edges)`);
    warnings++;
  }
}

if (errors > 0) {
  console.error(`\n${errors} error(s), ${warnings} warning(s)`);
  process.exit(1);
}
console.log(`\n✓ all links valid · ${warnings} warning(s)`);
