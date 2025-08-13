import { TASK_REGISTRY } from "@/features/workflows/constants/registry";

const TYPE_COMPATIBILITY = {
  TEXT: ["TEXT", "STRING", "NUMBER", "EMAIL", "URL", "PHONE"],
  EMAIL: ["TEXT", "STRING", "EMAIL"],
  URL: ["TEXT", "STRING", "URL"],
  PHONE: ["TEXT", "STRING", "PHONE"],
  NUMBER: ["NUMBER", "INTEGER", "FLOAT", "RATING"],
  CURRENCY: ["NUMBER", "CURRENCY", "INTEGER", "FLOAT"],
  RATING: ["NUMBER", "RATING", "INTEGER", "FLOAT"],
  CHECKBOX: ["BOOLEAN", "CHECKBOX"],
  DATETIME: ["DATETIME", "DATE", "STRING"],
  STATUS: ["STATUS", "STRING", "TEXT"],
  LONGTEXT: ["TEXT", "STRING", "LONGTEXT", "JSON"],
};

export const getPredecessorNodes = (currentNodeId, nodes, edges) => {
  const predecessors = [];
  const visited = new Set();

  const currentNode = nodes.find((n) => n.id === currentNodeId);
  if (!currentNode) return [];

  const findPredecessors = (nodeId, depth = 0) => {
    if (visited.has(nodeId) || depth > 10) return;
    visited.add(nodeId);

    const incomingEdges = edges.filter((edge) => edge.target === nodeId);

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode && sourceNode.id !== currentNodeId) {
        if (!predecessors.find((p) => p.id === sourceNode.id))
          predecessors.push(sourceNode);

        findPredecessors(sourceNode.id, depth + 1);
      }
    }
  };

  findPredecessors(currentNodeId);

  if (predecessors.length === 0) {
    for (const node of nodes) {
      if (
        node.id !== currentNodeId &&
        node.position.x < currentNode.position.x
      ) {
        predecessors.push(node);
      }
    }
  }

  return predecessors.sort((a, b) => {
    if (Math.abs(a.position.x - b.position.x) > 50)
      return a.position.x - b.position.x;

    return a.position.y - b.position.y;
  });
};

export const getAvailableVariables = (
  currentNodeId,
  nodes,
  edges,
  attributeType = null,
) => {
  const predecessors = getPredecessorNodes(currentNodeId, nodes, edges);
  const variables = [];

  for (const node of predecessors) {
    const taskDefinition = TASK_REGISTRY[node.data.type];
    if (!taskDefinition || !taskDefinition.outputs) continue;

    for (const output of taskDefinition.outputs) {
      if (output.type === "TRIGGER") continue;

      if (attributeType) {
        const compatibleTypes = TYPE_COMPATIBILITY[attributeType] || [
          attributeType,
        ];
        if (!compatibleTypes.includes(output.type)) continue;
      }

      const variable = {
        nodeId: node.id,
        nodeType: node.data.type,
        nodeLabel: taskDefinition.label,
        outputName: output.name,
        outputType: output.type,
        outputDescription: output.description,
      };

      variables.push(variable);
    }
  }

  return variables;
};

export {
  createVariableReference as formatVariableReference,
  isVariableReference,
  parseVariableReference,
} from "@/features/workflows/utils/variable-resolver";

export const getVariableDisplayText = (variableRef, nodes) => {
  if (!variableRef) return "";

  const node = nodes.find((n) => n.id === variableRef.nodeId);
  if (!node) return "Unknown variable";

  const taskDefinition = TASK_REGISTRY[node.data.type];
  if (!taskDefinition) return "Unknown variable";

  const sameTypeNodes = nodes.filter((n) => n.data.type === node.data.type);
  const nodeIndex = sameTypeNodes.findIndex((n) => n.id === node.id);
  const nodeSuffix = sameTypeNodes.length > 1 ? ` (${nodeIndex + 1})` : "";

  return `${taskDefinition.label}${nodeSuffix} → ${variableRef.outputName}`;
};
