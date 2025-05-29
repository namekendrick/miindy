export const createFlowNode = (nodeType, position) => {
  return {
    id: crypto.randomUUID(),
    type: "MiindyNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
};
