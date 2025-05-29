"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const unpublishWorkflow = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { id } = values;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }

  if (workflow.status !== "PUBLISHED") {
    throw new Error("workflow is not published");
  }

  await prisma.workflow.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      status: "DRAFT",
      executionPlan: null,
      creditsCost: 0,
    },
  });

  return { status: 200, message: "Workflow unpublished!" };
};
