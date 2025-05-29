import { create } from "zustand";

export const useScheduleWorkflowModal = create((set) => ({
  isOpen: false,
  crn: null,
  workflowId: null,
  onOpen: (values) => set({ isOpen: true, ...values }),
  onClose: () => set({ isOpen: false }),
}));
