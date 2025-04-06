"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const update = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: values.workspaceId,
      OR: [{ access: "SUPER_ADMIN" }, { access: "ADMIN" }],
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  await prisma.permission.update({
    where: { id: values.id },
    data: { access: values.access },
  });

  return { status: 200, message: "Member updated!" };
};
