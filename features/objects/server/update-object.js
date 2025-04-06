"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const updateObject = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  if (!values.id) return { status: 400, message: "Invalid id!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: values.workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  return { status: 200, message: "Coming soon!" };
};
