"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const deleteWorkspace = async (id) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  if (!id) return { status: 400, message: "Invalid id!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: id,
      OR: [{ access: "SUPER_ADMIN" }, { access: "ADMIN" }],
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  await prisma.workspace.delete({
    where: { id },
  });

  return { status: 200, message: "Workspace deleted" };
};
