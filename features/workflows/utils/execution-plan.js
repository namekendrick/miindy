import { TASK_REGISTRY } from "@/features/workflows/constants/registry";

export const flowToExecutionPlan = (nodes, edges) => {
  const triggerNode = nodes.find(
    (node) => TASK_REGISTRY[node.data.type].isTrigger,
  );

  if (!triggerNode) {
    return {
      error: {
        type: "NO_TRIGGER",
      },
    };
  }

  const inputsWithErrors = [];
  const planned = new Set();

  const invalidInputs = getInvalidInputs(triggerNode, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: triggerNode.id,
      inputs: invalidInputs,
    });
  }

  const executionPlan = [
    {
      phase: 1,
      nodes: [triggerNode],
    },
  ];

  planned.add(triggerNode.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Node already put in the execution plan.
        continue;
      }

      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // If all incoming incomers/edges are planned and there are still invalid inputs
          // this means that this particular node has an invalid input
          // which means that the workflow is invalid
          console.error("invalid inputs", currentNode.id, invalidInputs);
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          // let's skip this node for now
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: "INVALID_INPUTS",
        invalidElements: inputsWithErrors,
      },
    };
  }

  return { executionPlan };
};

const getInvalidInputs = (node, edges, planned) => {
  const invalidInputs = [];
  const inputs = TASK_REGISTRY[node.data.type].inputs;

  // Check if node has incoming connection
  const hasIncomingConnection = edges.some((edge) => edge.target === node.id);

  for (const input of inputs) {
    const inputValue = node.data.inputs?.[input.name];
    const inputValueProvided = inputValue && inputValue.toString().length > 0;

    if (inputValueProvided) {
      // this input is fine, so we can move on
      continue;
    }

    // For simplified connections, if there's an incoming edge and this is not a required input,
    // we can assume it might get its value from the connected node
    if (hasIncomingConnection && !input.required) {
      const incomingEdge = edges.find((edge) => edge.target === node.id);
      if (incomingEdge && planned.has(incomingEdge.source)) {
        continue;
      }
    }

    // Check if this is a required input that needs a value
    if (input.required && !inputValueProvided) {
      invalidInputs.push(input.name);
    }
  }

  return invalidInputs;
};

const getIncomers = (node, nodes, edges) => {
  if (!node.id) {
    return [];
  }
  const incomersIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });

  return nodes.filter((n) => incomersIds.has(n.id));
};
