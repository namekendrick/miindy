"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const saveWorkflow = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { id, definition } = values;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!workflow) return { status: 404, message: "Workflow not found!" };

  if (workflow.status !== "DRAFT")
    return { status: 400, message: "Workflow is not a draft!" };

  await prisma.workflow.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      definition,
    },
  });

  return { status: 200, message: "Workflow saved!" };
};
