"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const getWorkflowById = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workflowId, workspaceId } = values;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });

  return workflow;
};

export const getWorkflowsByWorkspaceId = async (workspaceId) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const workflows = await prisma.workflow.findMany({
    where: {
      workspaceId,
    },
  });

  return workflows;
};
