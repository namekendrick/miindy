"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const deleteRecord = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { records, workspaceId } = values;

  if (!records) return { status: 404, message: "Records not found!" };

  const recordIds = records.map((record) => record.id);

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
      OR: [{ access: "SUPER_ADMIN" }, { access: "ADMIN" }],
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  await prisma.record.deleteMany({
    where: { id: { in: recordIds } },
  });

  return { status: 200, message: "Records deleted" };
};
