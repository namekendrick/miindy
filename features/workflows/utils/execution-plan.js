import { TASK_REGISTRY } from "@/features/workflows/constants/registry";
import { isVariableReference } from "@/features/workflows/utils/variable-resolver";

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

  const hasIncomingConnection = edges.some((edge) => edge.target === node.id);

  for (const input of inputs) {
    const inputValue = node.data.inputs?.[input.name];
    let inputValueProvided = inputValue && inputValue.toString().length > 0;

    if (isVariableReference(inputValue)) {
      const sourceNodeId = inputValue.nodeId;
      if (!planned.has(sourceNodeId)) {
        invalidInputs.push(input.name);
        continue;
      }
      inputValueProvided = true;
    }

    if (inputValueProvided) continue;

    if (hasIncomingConnection && !input.required) {
      const incomingEdge = edges.find((edge) => edge.target === node.id);
      if (incomingEdge && planned.has(incomingEdge.source)) {
        continue;
      }
    }

    if (input.required && !inputValueProvided) invalidInputs.push(input.name);
  }

  // Check for dynamic inputs that aren't in the inputs definition (like dynamic attribute inputs)
  if (node.data.inputs) {
    Object.keys(node.data.inputs).forEach((inputName) => {
      // Skip inputs that are already defined in the task's inputs array
      if (inputs.some((input) => input.name === inputName)) return;

      const inputValue = node.data.inputs[inputName];

      if (isVariableReference(inputValue)) {
        const sourceNodeId = inputValue.nodeId;
        if (!planned.has(sourceNodeId)) {
          invalidInputs.push(inputName);
        }
      }
    });
  }

  return invalidInputs;
};

const getIncomers = (node, nodes, edges) => {
  if (!node.id) return [];

  const incomersIds = new Set();

  edges.forEach((edge) => {
    if (edge.target === node.id) incomersIds.add(edge.source);
  });

  return nodes.filter((n) => incomersIds.has(n.id));
};
