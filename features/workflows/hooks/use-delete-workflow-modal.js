import { create } from "zustand";

export const useDeleteWorkflowModal = create((set) => ({
  isOpen: false,
  workflow: null,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false }),
}));
