"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const createRecord = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { objectType, workspaceId } = values;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const object = await prisma.object.findFirst({
    where: { workspaceId, type: objectType },
  });

  if (!object) return { status: 404, message: "Object not found!" };

  const record = await prisma.record.create({
    data: {
      objectId: object.id,
      workspaceId,
    },
  });

  return {
    record,
    status: 201,
    message: "Record created successfully!",
  };
};
