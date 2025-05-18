"use server";

import prisma from "@/lib/prisma";
import { getWorkspaceObjects } from "@/db/workspace";
import { currentUser } from "@/lib/auth";

export async function createView(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { name, workspaceId, objectType, currentFilters } = values;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  try {
    const objects = await getWorkspaceObjects(workspaceId);

    const object = objects.find((object) => object.type === objectType);
    if (!object) return { status: 400, message: "Invalid object type!" };

    const attributes = await prisma.attribute.findMany({
      where: {
        objectId: object.id,
        workspaceId: workspaceId,
        isArchived: false,
      },
      take: 3,
    });

    if (!attributes.length)
      return {
        status: 400,
        message: "No attributes found for this object type",
      };

    const visibleColumns = attributes.map((attr, index) => ({
      id: attr.id,
      position: String(index),
    }));

    const view = await prisma.view.create({
      data: {
        name,
        workspaceId,
        objectId: object.id,
        configuration: {
          create: {
            visibleColumns,
            filters: currentFilters || null,
          },
        },
      },
      include: {
        object: true,
        configuration: true,
      },
    });

    return {
      status: 201,
      message: "View created!",
      data: view,
    };
  } catch (error) {
    console.error("Error creating view:", error);
    return { status: 500, message: "Failed to create view" };
  }
}
