import { create } from "zustand";

export const useTaskDetailSheet = create((set) => ({
  isOpen: false,
  task: null,
  workspaceId: null,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false, task: null }),
}));
