import { create } from "zustand";

export const useUpdateAttributeModal = create((set) => ({
  isOpen: false,
  attribute: null,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false }),
}));
