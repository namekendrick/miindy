"use server";

import prisma from "@/lib/prisma";
import { validateAndNormalizeFilters } from "@/features/views/utils/filter-utils";
import { currentUser } from "@/lib/auth";

export async function saveView(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workspaceId, viewId, configuration, createNewView, newViewName } =
    values;

  const normalizedFilters = validateAndNormalizeFilters(configuration.filters);

  const configValues = {
    sorts: configuration.sorts || null,
    visibleColumns: configuration.visibleColumns || [],
    filters: normalizedFilters,
  };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  try {
    const view = await prisma.view.findUnique({
      where: { id: viewId },
      include: { object: true },
    });

    if (createNewView) {
      const newView = await prisma.view.create({
        data: {
          name: newViewName,
          objectId: view.objectId,
          workspaceId,
          configuration: {
            create: {
              ...configValues,
            },
          },
        },
      });

      return {
        status: 201,
        message: "View saved!",
        data: newView,
        newViewId: newView.id,
        slug: view.object.slug,
      };
    }

    const existingConfig = await prisma.viewConfiguration.findUnique({
      where: { viewId },
    });

    if (existingConfig) {
      const updated = await prisma.viewConfiguration.update({
        where: { viewId },
        data: { ...configValues },
      });
      return {
        status: 200,
        message: "View saved!",
        data: updated,
      };
    } else {
      const created = await prisma.viewConfiguration.create({
        data: {
          viewId,
          ...configValues,
        },
      });
      return {
        status: 201,
        message: "View saved!",
        data: created,
      };
    }
  } catch (error) {
    console.error("Error saving configuration:", error);
    return { status: 500, message: "Failed to save view" };
  }
}
