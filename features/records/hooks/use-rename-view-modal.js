import { create } from "zustand";

export const useRenameViewModal = create((set) => ({
  isOpen: false,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false }),
}));
