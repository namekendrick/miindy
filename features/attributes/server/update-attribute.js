"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { updateAttributeSchema } from "@/features/attributes/schemas";

export const updateAttribute = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const validatedFields = updateAttributeSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: values.workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  await prisma.attribute.update({
    where: { id: values.id },
    data: { ...validatedFields.data },
  });

  return { status: 200, message: "Attribute updated!" };
};
