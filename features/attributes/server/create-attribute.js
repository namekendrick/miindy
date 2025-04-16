"use server";

import prisma from "@/lib/prisma";
import { getWorkspaceObjects } from "@/db/workspace";
import { currentUser } from "@/lib/auth";

export async function createAttribute(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { name, description, type, workspaceId, objectType } = values;

  const permission = await prisma.permission.findFirst({
    where: { userId: user.id, workspaceId },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  try {
    const objects = await getWorkspaceObjects(workspaceId);

    const object = objects.find((object) => object.type === objectType);
    if (!object) return { status: 400, message: "Invalid object type!" };

    const attribute = await prisma.attribute.create({
      data: {
        name,
        description,
        attributeType: type.toUpperCase(),
        workspaceId,
        objectId: object.id,
      },
    });

    return {
      status: 201,
      message: "Attribute created!",
      data: attribute,
    };
  } catch (error) {
    console.error("Error creating attribute:", error);
    return { status: 500, message: "Failed to create attribute" };
  }
}
