"use server";

import prisma from "@/lib/prisma";

import { RECORDS_PER_PAGE } from "@/constants/pagination";
import { getViewById } from "@/db/view";
import { currentUser } from "@/lib/auth";

export const getRecords = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { objectType, workspaceId, viewId, page, filters } = values;

  const normalizeDateValue = (value) => {
    if (!value) return null;

    try {
      if (value instanceof Date) return value;

      if (typeof value === "string") {
        const date = new Date(value);

        if (isNaN(date.getTime())) {
          return null;
        }
        return date;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const view = await getViewById(viewId, workspaceId);

  let whereClause = { workspaceId, object: { type: objectType } };

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

  const allRecords = await prisma.record.findMany({
    where: whereClause,
    include: {
      object: {
        select: {
          recordTextAttributeId: true,
          attributes: {
            where: {
              isArchived: false,
            },
            include: {
              sourceRelationship: {
                include: {
                  targetAttribute: {
                    include: {
                      object: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      values: true,
      relatedAsA: true,
      relatedAsB: true,
    },
  });

  let filteredRecords = allRecords;

  if (filters && Object.keys(filters).length > 0) {
    try {
      const matchesRule = (record, rule) => {
        if (!rule.field || !rule.operation) {
          return true;
        }

        const attribute = record.object.attributes.find(
          (attr) => attr.id === rule.field,
        );

        const attributeType = attribute?.attributeType;

        if (
          rule.operation === "is_empty" ||
          rule.operation === "is_not_empty"
        ) {
          if (attributeType === "RELATIONSHIP") {
            const hasRelatedRecords =
              record.relatedAsA?.some(
                (rel) => rel.attributeAId === rule.field,
              ) ||
              record.relatedAsB?.some((rel) => rel.attributeBId === rule.field);

            return rule.operation === "is_empty"
              ? !hasRelatedRecords
              : hasRelatedRecords;
          } else {
            const hasValue = record.values.some(
              (v) => v.attributeId === rule.field,
            );
            return rule.operation === "is_empty" ? !hasValue : hasValue;
          }
        }

        if (rule.operation === "true" || rule.operation === "false") {
          const recordValue = record.values.find(
            (v) => v.attributeId === rule.field,
          );

          if (!recordValue) return rule.operation === "false";

          const checkboxValue = recordValue.value?.value === true;
          return rule.operation === "true" ? checkboxValue : !checkboxValue;
        }

        const noValueOperations = [
          "is_in_past",
          "is_in_future",
          "is_today",
          "is_tomorrow",
          "is_yesterday",
        ];

        if (
          !noValueOperations.includes(rule.operation) &&
          (rule.value === undefined || rule.value === null || rule.value === "")
        ) {
          return true;
        }

        if (attributeType === "RELATIONSHIP") {
          const relatedRecordsAsA =
            record.relatedAsA?.filter(
              (rel) => rel.attributeAId === rule.field,
            ) || [];

          const relatedRecordsAsB =
            record.relatedAsB?.filter(
              (rel) => rel.attributeBId === rule.field,
            ) || [];

          const relatedRecordIds = [
            ...relatedRecordsAsA.map((rel) => rel.recordBId),
            ...relatedRecordsAsB.map((rel) => rel.recordAId),
          ];

          switch (rule.operation) {
            case "equals":
              return rule.value && relatedRecordIds.includes(rule.value);

            case "not_equals":
              return rule.value && !relatedRecordIds.includes(rule.value);

            case "contains":
              return rule.value && relatedRecordIds.includes(rule.value);

            case "not_contains":
              return rule.value && !relatedRecordIds.includes(rule.value);

            default:
              return true;
          }
        }

        const recordValue = record.values.find(
          (v) => v.attributeId === rule.field,
        );

        if (!recordValue) return false;

        const itemValue = recordValue.value?.value;

        if (
          attribute?.name === "Created at" &&
          attribute?.isSystem &&
          attributeType === "DATETIME"
        ) {
          const createdAt = record.createdAt;

          const noValueSystemOperations = [
            "is_in_past",
            "is_in_future",
            "is_today",
            "is_tomorrow",
            "is_yesterday",
          ];

          if (
            !noValueSystemOperations.includes(rule.operation) &&
            (rule.value === undefined ||
              rule.value === null ||
              rule.value === "")
          ) {
            return true;
          }

          switch (rule.operation) {
            case "is":
              try {
                const ruleDate = new Date(rule.value);

                if (isNaN(ruleDate.getTime())) {
                  return false;
                }

                return createdAt.getTime() === ruleDate.getTime();
              } catch (error) {
                return false;
              }
            case "is_in_past":
              try {
                const now = new Date();

                return createdAt.getTime() < now.getTime();
              } catch (error) {
                return false;
              }
            case "is_in_future":
              try {
                const now = new Date();

                return createdAt.getTime() > now.getTime();
              } catch (error) {
                return false;
              }
            case "is_yesterday":
              try {
                const today = new Date();
                const yesterday = new Date(today);

                yesterday.setDate(today.getDate() - 1);

                return (
                  createdAt.getFullYear() === yesterday.getFullYear() &&
                  createdAt.getMonth() === yesterday.getMonth() &&
                  createdAt.getDate() === yesterday.getDate()
                );
              } catch (error) {
                return false;
              }
            case "is_today":
              try {
                const today = new Date();

                return (
                  createdAt.getFullYear() === today.getFullYear() &&
                  createdAt.getMonth() === today.getMonth() &&
                  createdAt.getDate() === today.getDate()
                );
              } catch (error) {
                return false;
              }
            case "is_tomorrow":
              try {
                const today = new Date();
                const tomorrow = new Date(today);

                tomorrow.setDate(today.getDate() + 1);

                return (
                  createdAt.getFullYear() === tomorrow.getFullYear() &&
                  createdAt.getMonth() === tomorrow.getMonth() &&
                  createdAt.getDate() === tomorrow.getDate()
                );
              } catch (error) {
                return false;
              }
            case "is_before":
              try {
                const ruleDate = new Date(rule.value);

                if (isNaN(ruleDate.getTime())) {
                  return false;
                }

                return createdAt < ruleDate;
              } catch (error) {
                return false;
              }
            case "is_after":
              try {
                const ruleDate = new Date(rule.value);

                if (isNaN(ruleDate.getTime())) {
                  return false;
                }

                return createdAt > ruleDate;
              } catch (error) {
                return false;
              }
            default:
              return true;
          }
        }

        switch (rule.operation) {
          case "equals":
            return String(itemValue) === String(rule.value);
          case "not_equals":
            return String(itemValue) !== String(rule.value);
          case "contains":
            return String(itemValue)
              .toLowerCase()
              .includes(String(rule.value).toLowerCase());
          case "not_contains":
            return !String(itemValue)
              .toLowerCase()
              .includes(String(rule.value).toLowerCase());
          case "greater_than":
            return Number(itemValue) > Number(rule.value);
          case "less_than":
            return Number(itemValue) < Number(rule.value);
          case "starts_with":
            return String(itemValue)
              .toLowerCase()
              .startsWith(String(rule.value).toLowerCase());
          case "ends_with":
            return String(itemValue)
              .toLowerCase()
              .endsWith(String(rule.value).toLowerCase());

          case "is":
            if (attributeType === "DATETIME") {
              try {
                const ruleDate = new Date(rule.value);
                const itemDate = new Date(itemValue);

                if (isNaN(ruleDate.getTime()) || isNaN(itemDate.getTime())) {
                  return false;
                }

                return itemDate.getTime() === ruleDate.getTime();
              } catch (error) {
                return false;
              }
            }
            return false;
          case "is_in_past":
            if (attributeType === "DATETIME") {
              try {
                const rawValue = recordValue.value?.value;
                const itemDate = normalizeDateValue(rawValue);

                if (!itemDate) return false;

                const now = new Date();

                return itemDate.getTime() < now.getTime();
              } catch (error) {
                return false;
              }
            }
            return false;
          case "is_in_future":
            if (attributeType === "DATETIME") {
              try {
                const rawValue = recordValue.value?.value;
                const itemDate = normalizeDateValue(rawValue);

                if (!itemDate) return false;

                const now = new Date();

                return itemDate.getTime() > now.getTime();
              } catch (error) {
                return false;
              }
            }
            return false;
          case "is_yesterday":
            if (attributeType === "DATETIME") {
              try {
                const rawValue = recordValue.value?.value;
                const itemDate = normalizeDateValue(rawValue);

                if (!itemDate) return false;

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                return (
                  itemDate.getFullYear() === yesterday.getFullYear() &&
                  itemDate.getMonth() === yesterday.getMonth() &&
                  itemDate.getDate() === yesterday.getDate()
                );
              } catch (error) {
                return false;
              }
            }
            return false;
          case "is_today":
            if (attributeType === "DATETIME") {
              try {
                const rawValue = recordValue.value?.value;
                const itemDate = normalizeDateValue(rawValue);

                if (!itemDate) return false;

                const today = new Date();

                return (
                  itemDate.getFullYear() === today.getFullYear() &&
                  itemDate.getMonth() === today.getMonth() &&
                  itemDate.getDate() === today.getDate()
                );
              } catch (error) {
                return false;
              }
            }
            return false;
          case "is_tomorrow":
            if (attributeType === "DATETIME") {
              try {
                const rawValue = recordValue.value?.value;
                const itemDate = normalizeDateValue(rawValue);

                if (!itemDate) return false;

                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);

                return (
                  itemDate.getFullYear() === tomorrow.getFullYear() &&
                  itemDate.getMonth() === tomorrow.getMonth() &&
                  itemDate.getDate() === tomorrow.getDate()
                );
              } catch (error) {
                return false;
              }
            }
            return false;
          case "is_before":
            if (attributeType === "DATETIME") {
              try {
                const ruleDate = new Date(rule.value);
                const itemDate = new Date(itemValue);

                if (isNaN(ruleDate.getTime()) || isNaN(itemDate.getTime())) {
                  return false;
                }

                return itemDate < ruleDate;
              } catch (error) {
                return false;
              }
            }
            return false;
          case "is_after":
            if (attributeType === "DATETIME") {
              try {
                const ruleDate = new Date(rule.value);
                const itemDate = new Date(itemValue);

                if (isNaN(ruleDate.getTime()) || isNaN(itemDate.getTime())) {
                  return false;
                }

                return itemDate > ruleDate;
              } catch (error) {
                return false;
              }
            }
            return false;
          default:
            return true;
        }
      };

      const matchesGroup = (record, group) => {
        if (!group || !group.rules || group.rules.length === 0) {
          return true;
        }

        const operator = group.operator === "OR" ? "OR" : "AND";

        if (operator === "AND") {
          return group.rules.every((rule) =>
            rule.type === "group"
              ? matchesGroup(record, rule)
              : matchesRule(record, rule),
          );
        } else {
          return group.rules.some((rule) =>
            rule.type === "group"
              ? matchesGroup(record, rule)
              : matchesRule(record, rule),
          );
        }
      };

      filteredRecords = allRecords.filter((record) =>
        matchesGroup(record, filters),
      );
    } catch (error) {
      console.error("Error applying filters:", error);
      filteredRecords = allRecords;
    }
  }

  if (view.configuration?.sorts?.length > 0) {
    const sort = view.configuration.sorts[0];

    if (activeAttributeIds.includes(sort.attributeId)) {
      const sortedRecords = filteredRecords.sort((a, b) => {
        const aValueObj = a.values.find(
          (v) => v.attributeId === sort.attributeId,
        );
        const bValueObj = b.values.find(
          (v) => v.attributeId === sort.attributeId,
        );

        const aValue = aValueObj?.value?.value;
        const bValue = bValueObj?.value?.value;

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
                  recordTextAttributeId: true,
                  attributes: {
                    where: {
                      isArchived: false,
                    },
                    include: {
                      sourceRelationship: {
                        include: {
                          targetAttribute: {
                            include: {
                              object: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              values: true,
              relatedAsA: true,
              relatedAsB: true,
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

  const paginatedRecords = filteredRecords.slice(
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
              recordTextAttributeId: true,
              attributes: {
                where: {
                  isArchived: false,
                },
                include: {
                  sourceRelationship: {
                    include: {
                      targetAttribute: {
                        include: {
                          object: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          values: true,
          relatedAsA: true,
          relatedAsB: true,
        },
      }),
    ),
  );

  return {
    paginated,
    totalPages: Math.ceil(filteredRecords.length / RECORDS_PER_PAGE),
  };
};

export const getRelatedRecords = async (values) => {
  const { recordId, attributeId } = values;

  const attribute = await prisma.attribute.findUnique({
    where: { id: attributeId },
    select: { attributeType: true },
  });

  // For RELATIONSHIP type, get records from both sides
  if (attribute?.attributeType === "RELATIONSHIP") {
    const relatedRecordsAsA = await prisma.relatedRecord.findMany({
      where: {
        recordAId: recordId,
        attributeAId: attributeId,
      },
      include: {
        recordB: {
          include: {
            object: true,
            values: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });

    const relatedRecordsAsB = await prisma.relatedRecord.findMany({
      where: {
        recordBId: recordId,
        attributeBId: attributeId,
      },
      include: {
        recordA: {
          include: {
            object: true,
            values: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });

    // Transform to consistent format
    const relatedRecordsA = relatedRecordsAsA.map((relation) => ({
      id: relation.recordB.id,
      record: relation.recordB,
      relationId: relation.id,
    }));

    const relatedRecordsB = relatedRecordsAsB.map((relation) => ({
      id: relation.recordA.id,
      record: relation.recordA,
      relationId: relation.id,
    }));

    return [...relatedRecordsA, ...relatedRecordsB];
  }
  // For RECORD type, get records only from side A (one-directional)
  else if (attribute?.attributeType === "RECORD") {
    const relatedRecordsAsA = await prisma.relatedRecord.findMany({
      where: {
        recordAId: recordId,
        attributeAId: attributeId,
      },
      include: {
        recordB: {
          include: {
            object: true,
            values: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });

    // Transform to consistent format
    return relatedRecordsAsA.map((relation) => ({
      id: relation.recordB.id,
      record: relation.recordB,
      relationId: relation.id,
    }));
  }

  return [];
};

export const searchRecords = async (values) => {
  const { workspaceId, objectId, searchTerm } = values;

  const object = await prisma.object.findFirst({
    where: {
      id: objectId,
      workspaceId,
    },
    include: {
      recordTextAttribute: true,
    },
  });

  if (!object) return [];

  if (!searchTerm || searchTerm.trim() === "") {
    const records = await prisma.record.findMany({
      where: {
        workspaceId,
        objectId: object.id,
      },
      include: {
        object: true,
        values: {
          include: {
            attribute: true,
          },
        },
      },
      take: 10,
    });

    return records;
  }

  if (object.recordTextAttributeId) {
    const records = await prisma.record.findMany({
      where: {
        workspaceId,
        objectId: object.id,
        values: {
          some: {
            attributeId: object.recordTextAttributeId,
            value: {
              path: ["value"],
              string_contains: searchTerm,
            },
          },
        },
      },
      include: {
        object: true,
        values: {
          include: {
            attribute: true,
          },
        },
      },
      take: 10,
    });

    return records;
  }

  const records = await prisma.record.findMany({
    where: {
      workspaceId,
      objectId,
    },
    include: {
      object: true,
      values: {
        include: {
          attribute: true,
        },
      },
    },
    take: 10,
  });

  return records;
};

export const getObjectAttributes = async (workspaceId, objectType) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const object = await prisma.object.findFirst({
    where: {
      workspaceId,
      type: objectType,
    },
    include: {
      attributes: {
        where: {
          isArchived: false,
        },
        include: {
          sourceRelationship: {
            include: {
              targetAttribute: {
                include: {
                  object: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!object) return { attributes: [] };

  return {
    attributes: object.attributes.map((attr) => ({
      id: attr.id,
      name: attr.name,
      attributeType: attr.attributeType,
      config: attr.config,
      sourceRelationship: attr.sourceRelationship,
    })),
  };
};

export const getRecordById = async (values) => {
  const { id, workspaceId } = values;
  if (!id || !workspaceId) return null;

  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  return await prisma.record.findUnique({
    where: { id },
    include: {
      object: {
        select: {
          recordTextAttributeId: true,
          attributes: {
            where: { isArchived: false },
            include: {
              sourceRelationship: {
                include: {
                  targetAttribute: {
                    include: { object: true },
                  },
                },
              },
            },
          },
        },
      },
      values: true,
      relatedAsA: true,
      relatedAsB: true,
    },
  });
};
