import { create } from "zustand";

export const useCreateWorkflowModal = create((set) => ({
  isOpen: false,
  workspaceId: null,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false }),
}));
