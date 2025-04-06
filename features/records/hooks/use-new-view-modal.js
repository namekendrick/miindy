import { create } from "zustand";

export const useNewViewModal = create((set) => ({
  isOpen: false,
  viewId: null,
  workspaceId: null,
  objectType: null,
  page: null,
  currentFilters: [],
  currentView: null,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false }),
}));
