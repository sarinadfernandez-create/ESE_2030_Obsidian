import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConceptId } from '../content/types';

interface ProgressState {
  reviewed: Record<ConceptId, boolean>;
  toggleReviewed: (id: ConceptId) => void;
  isReviewed: (id: ConceptId) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      reviewed: {},
      toggleReviewed: (id) =>
        set((state) => ({
          reviewed: { ...state.reviewed, [id]: !state.reviewed[id] },
        })),
      isReviewed: (id) => get().reviewed[id] ?? false,
    }),
    { name: 'ese2030-progress' }
  )
);
