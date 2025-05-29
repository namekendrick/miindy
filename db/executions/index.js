"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const getExecutionsByWorkflowId = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workflowId } = values;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
    select: {
      workspaceId: true,
    },
  });

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: workflow.workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const executions = await prisma.workflowExecution.findMany({
    where: {
      workflowId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return executions;
};

export async function getWorkflowExecutionWithPhases(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workflowId, executionId } = values;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
    select: {
      workspaceId: true,
    },
  });

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: workflow.workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId: user.id,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  return execution;
}

export async function getWorkflowPhaseDetails(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { selectedPhase, workflowId } = values;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
    select: {
      workspaceId: true,
    },
  });

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: workflow.workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const phase = await prisma.executionPhase.findUnique({
    where: {
      id: selectedPhase,
      execution: {
        userId: user.id,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });

  return phase;
}
