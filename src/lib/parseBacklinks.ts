import { CONCEPTS } from '../content/concepts.index';
import type { Concept, ConceptId } from '../content/types';

// Loose regex for the user-facing editor: any non-bracket text inside [[...]].
// Resolves via title-or-id lookup so [[Gram-Schmidt Process]] works.
const BACKLINK_RE = /\[\[([^\]]+)\]\]/g;

// Strict regex for editorial content (concept prose): id-only [[concept-id]] or [[concept-id|display]].
// Used by mention-edge generation, where typos should fail validation rather than silently match.
const STRICT_BACKLINK_RE = /\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g;

export interface BacklinkMatch {
  raw: string;       // original [[whatever]]
  target: string;    // the inner text
  conceptId: string | null;  // resolved concept id, or null if invalid
  start: number;
  end: number;
}

// Build a lookup: lowercased title → id, plus id → id (so [[gram-schmidt]] and [[Gram-Schmidt Process]] both work)
function buildLookup(): Map<string, string> {
  const m = new Map<string, string>();
  for (const c of CONCEPTS) {
    m.set(c.id.toLowerCase(), c.id);
    m.set(c.title.toLowerCase(), c.id);
  }
  return m;
}

let _lookup: Map<string, string> | null = null;
function getLookup(): Map<string, string> {
  if (_lookup === null) _lookup = buildLookup();
  return _lookup;
}

export function resolveBacklink(target: string): string | null {
  const lookup = getLookup();
  return lookup.get(target.trim().toLowerCase()) ?? null;
}

export function parseBacklinks(markdown: string): BacklinkMatch[] {
  const matches: BacklinkMatch[] = [];
  BACKLINK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = BACKLINK_RE.exec(markdown)) !== null) {
    matches.push({
      raw: m[0],
      target: m[1],
      conceptId: resolveBacklink(m[1]),
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  return matches;
}

// Convert [[id]] and [[id|display]] occurrences in markdown to standard markdown links
// with sentinel URLs (#concept:<id> or #invalid:<text>). The MarkdownMath component
// detects these sentinels and renders them as inline chips.
export function preprocessBacklinks(markdown: string): string {
  return markdown.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_full, rawTarget, displayText) => {
    const target = String(rawTarget).trim();
    const id = resolveBacklink(target);
    const fallbackLabel = displayText ? String(displayText).trim() : null;
    if (id) {
      const label = fallbackLabel ?? CONCEPTS.find((c) => c.id === id)?.title ?? id;
      return `[${label}](#concept:${id})`;
    }
    return `[${fallbackLabel ?? target}](#invalid:${target})`;
  });
}

// Return distinct, valid concept ids referenced in the markdown.
export function extractLinkedConcepts(markdown: string): string[] {
  const ids = new Set<string>();
  for (const m of parseBacklinks(markdown)) {
    if (m.conceptId) ids.add(m.conceptId);
  }
  return Array.from(ids);
}

// ── Strict / editorial-content API ─────────────────────────────────────────
// These are used to derive mention edges from concept prose. They require
// canonical id form so typos surface as broken links rather than silent matches.

export function extractBacklinks(markdown: string): Set<ConceptId> {
  const ids = new Set<ConceptId>();
  STRICT_BACKLINK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = STRICT_BACKLINK_RE.exec(markdown)) !== null) {
    ids.add(m[1]);
  }
  return ids;
}

export function isValidConceptId(id: string): boolean {
  return CONCEPTS.some((c) => c.id === id);
}

// Walk every prose field on a concept and return the (concept-id, location) pairs
// that the prose mentions. The location string lets us surface provenance in the UI
// (e.g. "linked from row-reduction · learn / overview").
export interface ConceptMention {
  conceptId: ConceptId;
  location: string;
}

export function extractConceptBacklinks(concept: Concept): ConceptMention[] {
  const fields: { text: string; location: string }[] = [];

  if (concept.learn) {
    fields.push({ text: concept.learn.overview, location: 'learn.overview' });
    concept.learn.definitions.forEach((d, i) =>
      fields.push({ text: d.body, location: `learn.definitions[${i}]` })
    );
    concept.learn.theorems.forEach((t, i) => {
      fields.push({ text: t.statement, location: `learn.theorems[${i}].statement` });
      if (t.intuition) fields.push({ text: t.intuition, location: `learn.theorems[${i}].intuition` });
    });
  }
  if (concept.explore) {
    fields.push({ text: concept.explore.description, location: 'explore.description' });
    fields.push({ text: concept.explore.misconception.title, location: 'explore.misconception.title' });
    fields.push({ text: concept.explore.misconception.body, location: 'explore.misconception.body' });
  }
  if (concept.practice) {
    concept.practice.workedExample.forEach((s, i) => {
      fields.push({ text: s.title, location: `practice.workedExample[${i}].title` });
      fields.push({ text: s.body, location: `practice.workedExample[${i}].body` });
    });
    concept.practice.problems.forEach((p, i) => {
      fields.push({ text: p.statement, location: `practice.problems[${i}].statement` });
      if (p.format === 'open' && p.hint)
        fields.push({ text: p.hint, location: `practice.problems[${i}].hint` });
      if (p.format === 'multiple-choice') {
        p.choices.forEach((c, j) =>
          fields.push({ text: c.body, location: `practice.problems[${i}].choices[${j}]` })
        );
        fields.push({
          text: p.solution.explanation,
          location: `practice.problems[${i}].solution.explanation`,
        });
      }
    });
  }

  const seen = new Set<string>();
  const out: ConceptMention[] = [];
  for (const f of fields) {
    for (const id of extractBacklinks(f.text)) {
      if (id === concept.id) continue; // self-mentions ignored
      const key = `${id}::${f.location}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ conceptId: id, location: f.location });
    }
  }
  return out;
}
