"use server";

import prisma from "@/lib/prisma";

export const deleteRelatedRecord = async (values) => {
  const { relationId } = values;

  await prisma.relatedRecord.delete({
    where: { id: relationId },
  });

  return { status: 200, message: "Relationship deleted" };
};
