"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const archiveAttribute = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { attribute, restore } = values;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: attribute.workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  if (!restore) {
    // Find all views associated with this object
    const views = await prisma.view.findMany({
      where: { objectId: attribute.objectId },
      include: { configuration: true },
    });

    // Update each view's configuration
    for (const view of views) {
      if (view.configuration?.visibleColumns) {
        // Remove the attribute from visible columns
        const updatedVisibleColumns = JSON.parse(
          JSON.stringify(view.configuration.visibleColumns),
        ).filter((col) => col.id !== attribute.id);

        // Update sorts if this attribute was being used
        let updatedSorts = view.configuration.sorts;

        if (
          updatedSorts &&
          JSON.parse(JSON.stringify(updatedSorts)).some(
            (sort) => sort.attributeId === attribute.id,
          )
        ) {
          updatedSorts = null;
        }

        // Update filters if this attribute was being used
        let updatedFilters = view.configuration.filters;

        if (
          updatedFilters &&
          JSON.parse(JSON.stringify(updatedFilters)).some(
            (filter) => filter.attributeId === attribute.id,
          )
        ) {
          updatedFilters = JSON.parse(JSON.stringify(updatedFilters)).filter(
            (filter) => filter.attributeId !== attribute.id,
          );

          if (updatedFilters.length === 0) updatedFilters = null;
        }

        await prisma.viewConfiguration.update({
          where: { id: view.configuration.id },
          data: {
            visibleColumns: updatedVisibleColumns,
            sorts: updatedSorts,
            filters: updatedFilters,
          },
        });
      }
    }
  }

  await prisma.attribute.update({
    where: { id: attribute.id },
    data: { isArchived: restore ? false : true },
  });

  return {
    status: 200,
    message: restore ? "Attribute restored!" : "Attribute archived!",
  };
};
