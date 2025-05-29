"use server";

import prisma from "@/lib/prisma";
import { createFlowNode } from "@/features/workflows/utils/create-flow-node";
import { currentUser } from "@/lib/auth";

export const createWorkflow = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { name, workspaceId } = values;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const initialFlow = { nodes: [], edges: [] };

  initialFlow.nodes.push(createFlowNode("LAUNCH_BROWSER"));

  const workflow = await prisma.workflow.create({
    data: {
      name,
      workspaceId,
      userId: user.id,
      definition: JSON.stringify(initialFlow),
    },
  });

  return {
    workflow,
    status: 201,
    message: "Workflow created successfully!",
  };
};
