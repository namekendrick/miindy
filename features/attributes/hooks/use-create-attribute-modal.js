import { create } from "zustand";

export const useCreateAttributeModal = create((set) => ({
  isOpen: false,
  workspaceId: null,
  objectType: null,
  handleAddColumn: null,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false }),
}));
