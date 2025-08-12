import { create } from "zustand";

export const useFocusedNode = create((set) => ({
  focusedNodeId: null,
  setFocusedNode: (nodeId) => set({ focusedNodeId: nodeId }),
  clearFocusedNode: () => set({ focusedNodeId: null }),
}));
