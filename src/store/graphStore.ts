import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConceptId } from '../content/types';

export type ViewMode = 'clustered' | 'expanded';

interface PinnedPosition {
  x: number;
  y: number;
}

interface GraphState {
  viewMode: ViewMode;
  expandedUnits: Set<string>;
  pinnedNodes: Record<ConceptId, PinnedPosition>;
  setViewMode: (mode: ViewMode) => void;
  toggleUnit: (unitId: string) => void;
  pinNode: (id: ConceptId, x: number, y: number) => void;
  unpinNode: (id: ConceptId) => void;
  isPinned: (id: ConceptId) => boolean;
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      viewMode: 'clustered',
      expandedUnits: new Set<string>(),
      pinnedNodes: {},

      setViewMode: (mode) => set({ viewMode: mode }),

      toggleUnit: (unitId) =>
        set((state) => {
          const next = new Set(state.expandedUnits);
          if (next.has(unitId)) next.delete(unitId);
          else next.add(unitId);
          return { expandedUnits: next };
        }),

      pinNode: (id, x, y) =>
        set((state) => ({
          pinnedNodes: { ...state.pinnedNodes, [id]: { x, y } },
        })),

      unpinNode: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.pinnedNodes;
          return { pinnedNodes: rest };
        }),

      isPinned: (id) => id in get().pinnedNodes,
    }),
    {
      name: 'ese2030-graph',
      partialize: (state) => ({
        viewMode: state.viewMode,
        pinnedNodes: state.pinnedNodes,
        expandedUnits: Array.from(state.expandedUnits),
      }),
      merge: (persisted, current) => {
        const p = persisted as Record<string, unknown> | undefined;
        return {
          ...current,
          ...(p ?? {}),
          expandedUnits: new Set(
            Array.isArray(p?.expandedUnits) ? (p.expandedUnits as string[]) : []
          ),
        };
      },
    }
  )
);
