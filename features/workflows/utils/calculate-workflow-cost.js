import { TASK_REGISTRY } from "@/features/workflows/constants/registry";

export function calculateWorkflowCost(nodes) {
  return nodes.reduce((acc, node) => {
    return acc + TASK_REGISTRY[node.data.type].credits;
  }, 0);
}
