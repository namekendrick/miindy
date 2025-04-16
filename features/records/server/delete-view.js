"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const deleteView = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { viewId, workspaceId } = values;

  if (!viewId) return { status: 400, message: "Invalid view id!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
      OR: [{ access: "SUPER_ADMIN" }, { access: "ADMIN" }],
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  await prisma.view.delete({
    where: { id: viewId },
  });

  return { status: 200, message: "View deleted" };
};
