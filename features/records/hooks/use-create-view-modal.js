import { create } from "zustand";

export const useCreateViewModal = create((set) => ({
  isOpen: false,
  workspaceId: null,
  objectType: null,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false }),
}));
