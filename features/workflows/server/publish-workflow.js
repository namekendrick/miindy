"use server";

import prisma from "@/lib/prisma";
import { calculateWorkflowCost } from "@/features/workflows/utils/calculate-workflow-cost";
import { flowToExecutionPlan } from "@/features/workflows/utils/execution-plan";
import { currentUser } from "@/lib/auth";

export const publishWorkflow = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { id, flowDefinition } = values;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!workflow) throw new Error("workflow not found");

  if (workflow.status !== "DRAFT") {
    throw new Error("workflow is not a draft");
  }

  const flow = JSON.parse(flowDefinition);

  const result = flowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("flow definition not valid");
  }

  if (!result.executionPlan) {
    throw new Error("no execution plan generated");
  }

  const creditsCost = calculateWorkflowCost(flow.nodes);

  await prisma.workflow.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: "PUBLISHED",
    },
  });

  return { status: 200, message: "Workflow published!" };
};
