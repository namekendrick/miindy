"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const updateWorkspace = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  if (!values.id) return { status: 400, message: "Invalid id!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: values.id,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  await prisma.workspace.update({
    where: { id: values.id },
    data: { ...values },
  });

  return { status: 200, message: "Workspace updated!" };
};
