"use server";

import prisma from "@/lib/prisma";
import { duplicateWorkflowSchema } from "@/features/workflows/schemas";
import { currentUser } from "@/lib/auth";

export const duplicateWorkflow = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const validatedFields = duplicateWorkflowSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { name, description, workflowId, workspaceId } = values;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: { id: workflowId, workspaceId },
  });

  if (!sourceWorkflow) throw new Error("Workflow not found");

  const result = await prisma.workflow.create({
    data: {
      name,
      description,
      userId: user.id,
      workspaceId,
      definition: sourceWorkflow.definition,
      status: "DRAFT",
    },
  });

  if (!result) throw new Error("Failed to duplicate workflow");

  return { status: 201, message: "Workflow duplicated!" };
};
