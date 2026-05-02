import { create } from 'zustand';
import type { Note } from '../content/types';
import { storage } from '../lib/storage';
import { shortId } from '../lib/ids';
import { extractLinkedConcepts } from '../lib/parseBacklinks';

const STORAGE_KEY = 'ese2030-notes';

interface NotesState {
  notes: Record<string, Note>;
  createNote: (initial?: Partial<Note>) => string;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNotesForConcept: (conceptId: string) => Note[];
  getNote: (id: string) => Note | undefined;
  allNotes: () => Note[];
}

function load(): Record<string, Note> {
  return storage.get<Record<string, Note>>(STORAGE_KEY) ?? {};
}

function save(notes: Record<string, Note>) {
  storage.set(STORAGE_KEY, notes);
}

export const useNotesStore = create<NotesState>()((set, get) => ({
  notes: load(),

  createNote: (initial) => {
    const id = shortId();
    const now = Date.now();
    const body = initial?.body ?? '';
    const note: Note = {
      id,
      title: initial?.title ?? '',
      body,
      createdAt: now,
      updatedAt: now,
      linkedConcepts: extractLinkedConcepts(body).concat(
        initial?.linkedConcepts ?? []
      ).filter((v, i, a) => a.indexOf(v) === i),
      positionHint: initial?.positionHint,
    };
    set((state) => {
      const next = { ...state.notes, [id]: note };
      save(next);
      return { notes: next };
    });
    return id;
  },

  updateNote: (id, patch) => {
    set((state) => {
      const existing = state.notes[id];
      if (!existing) return state;
      const merged: Note = { ...existing, ...patch, id, updatedAt: Date.now() };
      // Re-derive linked concepts from body whenever body changes
      if (patch.body !== undefined) {
        merged.linkedConcepts = extractLinkedConcepts(patch.body);
      }
      const next = { ...state.notes, [id]: merged };
      save(next);
      return { notes: next };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const next = { ...state.notes };
      delete next[id];
      save(next);
      return { notes: next };
    });
  },

  getNotesForConcept: (conceptId) => {
    const all = Object.values(get().notes);
    return all
      .filter((n) => n.linkedConcepts.includes(conceptId))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getNote: (id) => get().notes[id],

  allNotes: () =>
    Object.values(get().notes).sort((a, b) => b.updatedAt - a.updatedAt),
}));
