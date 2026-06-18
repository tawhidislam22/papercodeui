import { create } from 'zustand';

type LessonState = {
  currentBlockId?: string;
  completedBlockIds: string[];
  setCurrentBlockId: (id?: string) => void;
  setCompletedBlockIds: (ids: string[]) => void;
  markCompleted: (id: string) => void;
  resetProgress: () => void;
};

export const useLessonStore = create<LessonState>((set) => ({
  currentBlockId: undefined,
  completedBlockIds: [],
  setCurrentBlockId: (id) => set({ currentBlockId: id }),
  setCompletedBlockIds: (ids) => set({ completedBlockIds: ids }),
  markCompleted: (id) =>
    set((state) =>
      state.completedBlockIds.includes(id)
        ? state
        : { completedBlockIds: [...state.completedBlockIds, id] }
    ),
  resetProgress: () => set({ currentBlockId: undefined, completedBlockIds: [] }),
}));
