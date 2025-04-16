import { create } from "zustand";

export const useDeleteViewModal = create((set) => ({
  isOpen: false,
  view: null,
  onOpen: (view) => set({ isOpen: true, view }),
  onClose: () => set({ isOpen: false }),
}));
