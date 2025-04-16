"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const updateValue = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { recordId, attributeId, value } = values;

  const record = await prisma.record.findUnique({
    where: { id: recordId },
    select: { workspaceId: true },
  });

  if (!record) return { status: 404, message: "Record not found" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: record.workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const existingValue = await prisma.attributeValue.findFirst({
    where: {
      recordId,
      attributeId,
    },
  });

  let updatedValue;

  if (existingValue) {
    updatedValue = await prisma.attributeValue.update({
      where: { id: existingValue.id },
      data: {
        value: { value },
      },
    });
  } else {
    updatedValue = await prisma.attributeValue.create({
      data: {
        recordId,
        attributeId,
        value: { value },
      },
    });
  }

  return { updatedValue, status: 200, message: "Value updated!" };
};
