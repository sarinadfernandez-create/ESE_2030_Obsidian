import { create } from 'zustand';
import type { Problem, ConceptId } from '../content/types';

interface DrawerState {
  isOpen: boolean;
  problem: Problem | null;
  conceptId: ConceptId | null;
  vizComponent: string | null;
  currentFrameIndex: number;
  isPlaying: boolean;
  tweenT: number;

  open: (problem: Problem, conceptId: ConceptId, vizComponent: string) => void;
  close: () => void;
  play: () => void;
  pause: () => void;
  setFrameIndex: (i: number) => void;
  setTweenT: (t: number) => void;
  prev: () => void;
  next: () => void;
}

export const useDrawerStore = create<DrawerState>((set, get) => ({
  isOpen: false,
  problem: null,
  conceptId: null,
  vizComponent: null,
  currentFrameIndex: 0,
  isPlaying: false,
  tweenT: 0,

  open: (problem, conceptId, vizComponent) =>
    set({
      isOpen: true,
      problem,
      conceptId,
      vizComponent,
      currentFrameIndex: 0,
      isPlaying: false,
      tweenT: 0,
    }),

  close: () =>
    set({
      isOpen: false,
      problem: null,
      conceptId: null,
      vizComponent: null,
      currentFrameIndex: 0,
      isPlaying: false,
      tweenT: 0,
    }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  setFrameIndex: (i) => {
    const frames = get().problem?.solutionFrames ?? [];
    const clamped = Math.max(0, Math.min(frames.length - 1, i));
    set({ currentFrameIndex: clamped });
  },

  setTweenT: (t) => set({ tweenT: Math.max(0, Math.min(1, t)) }),

  prev: () => {
    const { currentFrameIndex } = get();
    set({ currentFrameIndex: Math.max(0, currentFrameIndex - 1), tweenT: 0, isPlaying: false });
  },

  next: () => {
    const { currentFrameIndex, problem } = get();
    const max = (problem?.solutionFrames?.length ?? 1) - 1;
    set({ currentFrameIndex: Math.min(max, currentFrameIndex + 1), tweenT: 0, isPlaying: false });
  },
}));
