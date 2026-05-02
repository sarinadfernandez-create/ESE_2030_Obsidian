import { CONCEPTS } from '../content/concepts.index';

const BACKLINK_RE = /\[\[([^\]]+)\]\]/g;

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

// Return distinct, valid concept ids referenced in the markdown.
export function extractLinkedConcepts(markdown: string): string[] {
  const ids = new Set<string>();
  for (const m of parseBacklinks(markdown)) {
    if (m.conceptId) ids.add(m.conceptId);
  }
  return Array.from(ids);
}
