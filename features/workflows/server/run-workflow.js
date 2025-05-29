"use server";

import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { TASK_REGISTRY } from "@/features/workflows/constants/registry";
import { executeWorkflow } from "@/features/workflows/server/execute-workflow";
import { flowToExecutionPlan } from "@/features/workflows/utils/execution-plan";
import { currentUser } from "@/lib/auth";

export const runWorkflow = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workflowId, workspaceId, definition } = values;

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId: user.id,
      id: workflowId,
    },
  });

  if (!workflow) return { status: 404, message: "Workflow not found!" };

  let executionPlan;
  let workflowDefinition = definition;

  if (workflow.status === "PUBLISHED") {
    if (!workflow.executionPlan) {
      return { status: 400, message: "No execution plan found!" };
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition;
  } else {
    if (!definition) {
      // Workflow is a draft
      return { status: 400, message: "Definition is not defined!" };
    }

    const flow = JSON.parse(definition);
    const result = flowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
      return { status: 400, message: "Invalid definition!" };
    }

    if (!result.executionPlan) {
      return { status: 400, message: "No execution plan generated!" };
    }

    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId: user.id,
      status: "PENDING",
      startedAt: new Date(),
      trigger: "MANUAL",
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId: user.id,
              status: "CREATED",
              number: phase.phase,
              node: JSON.stringify(node),
              name: TASK_REGISTRY[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    return { status: 500, message: "Workflow execution not created!" };
  }

  executeWorkflow(execution.id); // run this on background
  redirect(
    `/workspace/${workspaceId}/workflows/${workflowId}/runs/${execution.id}`,
  );
};
