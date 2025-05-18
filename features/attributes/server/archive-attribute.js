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
    const views = await prisma.view.findMany({
      where: { objectId: attribute.objectId },
      include: { configuration: true },
    });

    for (const view of views) {
      if (view.configuration) {
        const updates = {};

        if (view.configuration.visibleColumns) {
          updates.visibleColumns = JSON.parse(
            JSON.stringify(view.configuration.visibleColumns),
          ).filter((col) => col.id !== attribute.id);
        }

        if (
          view.configuration.sorts &&
          JSON.parse(JSON.stringify(view.configuration.sorts)).some(
            (sort) => sort.attributeId === attribute.id,
          )
        ) {
          updates.sorts = null;
        }

        if (view.configuration.filters) {
          const filtersJson = JSON.parse(
            JSON.stringify(view.configuration.filters),
          );
          const updatedFilters = removeAttributeFromFilters(
            filtersJson,
            attribute.id,
          );

          if (JSON.stringify(filtersJson) !== JSON.stringify(updatedFilters)) {
            updates.filters = updatedFilters;
          }
        }

        if (Object.keys(updates).length > 0) {
          await prisma.viewConfiguration.update({
            where: { id: view.configuration.id },
            data: updates,
          });
        }
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

function removeAttributeFromFilters(filter, attributeId) {
  if (!filter || typeof filter !== "object") return filter;

  if (filter.field === attributeId) {
    return null;
  }

  if (filter.rules && Array.isArray(filter.rules)) {
    const updatedRules = filter.rules
      .map((rule) => removeAttributeFromFilters(rule, attributeId))
      .filter((rule) => rule !== null);

    if (updatedRules.length === 0) {
      return null;
    }

    return {
      ...filter,
      rules: updatedRules,
    };
  }

  return filter;
}
