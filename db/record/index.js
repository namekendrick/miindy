"use server";

import prisma from "@/lib/prisma";
import { RECORDS_PER_PAGE } from "@/constants/pagination";
import { getViewById } from "@/db/view";
import { currentUser } from "@/lib/auth";

export const getRecords = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { objectType, workspaceId, viewId, page } = values;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const view = await getViewById(viewId, workspaceId);

  let whereClause = { workspaceId, object: { type: objectType } };

  // Get all active (non-archived) attributes for this object
  const activeAttributes = await prisma.attribute.findMany({
    where: {
      objectId: view.objectId,
      isArchived: false,
    },
    select: {
      id: true,
    },
  });

  const activeAttributeIds = activeAttributes.map((attr) => attr.id);

  // Apply filters, excluding any that reference archived attributes
  if (view.configuration?.filters) {
    const validFilters = view.configuration.filters.filter((filter) =>
      activeAttributeIds.includes(filter.attributeId),
    );

    if (validFilters.length > 0) {
      whereClause = {
        ...whereClause,
        AND: validFilters.map((filter) => ({
          values: {
            some: {
              AND: [
                { attributeId: filter.attributeId },
                {
                  value: {
                    ...(filter.operator === "equals" && {
                      path: ["value"],
                      equals: filter.value,
                    }),
                    ...(filter.operator === "contains" && {
                      path: ["value"],
                      string_contains: filter.value,
                    }),
                    ...(filter.operator === "greater_than" && {
                      path: ["value"],
                      gt: filter.value,
                    }),
                    ...(filter.operator === "less_than" && {
                      path: ["value"],
                      lt: filter.value,
                    }),
                    ...(filter.operator === "between" && {
                      path: ["value"],
                      gte: filter.value.min,
                      lte: filter.value.max,
                    }),
                    ...(filter.operator === "in" && {
                      path: ["value"],
                      in: filter.value,
                    }),
                  },
                },
              ],
            },
          },
        })),
      };
    }
  }

  // Check if sorting is used and the attribute is not archived
  if (view.configuration?.sorts?.length > 0) {
    const sort = view.configuration.sorts[0];

    // Skip sorting if the attribute is archived
    if (activeAttributeIds.includes(sort.attributeId)) {
      const recordsWithValues = await prisma.record.findMany({
        where: whereClause,
        include: {
          values: {
            where: {
              attributeId: sort.attributeId,
            },
          },
        },
      });

      const sortedRecords = recordsWithValues.sort((a, b) => {
        const aValue = a.values[0]?.value?.value;
        const bValue = b.values[0]?.value?.value;

        if (sort.direction === "desc") {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });

      const paginatedRecords = sortedRecords.slice(
        (page - 1) * RECORDS_PER_PAGE,
        page * RECORDS_PER_PAGE,
      );

      const paginated = await Promise.all(
        paginatedRecords.map((record) =>
          prisma.record.findUnique({
            where: {
              id: record.id,
            },
            include: {
              object: {
                select: {
                  attributes: {
                    where: {
                      isArchived: false,
                    },
                  },
                },
              },
              values: true,
            },
          }),
        ),
      );

      return {
        paginated,
        totalPages: Math.ceil(sortedRecords.length / RECORDS_PER_PAGE),
      };
    }
  }

  // Default pagination without sorting or with archived sort attribute
  const paginated = await prisma.record.findMany({
    take: RECORDS_PER_PAGE,
    skip: (page - 1) * RECORDS_PER_PAGE,
    where: whereClause,
    include: {
      object: {
        select: {
          recordTextAttributeId: true,
          attributes: {
            where: {
              isArchived: false,
            },
          },
        },
      },
      values: true,
    },
  });

  const totalRecords = await prisma.record.count({ where: whereClause });

  return { paginated, totalPages: Math.ceil(totalRecords / RECORDS_PER_PAGE) };
};
