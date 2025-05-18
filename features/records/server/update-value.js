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

  const attribute = await prisma.attribute.findUnique({
    where: { id: attributeId },
    select: { attributeType: true, config: true, isReadOnly: true },
  });

  if (!attribute) return { status: 404, message: "Attribute not found" };

  if (attribute.isReadOnly)
    return { status: 403, message: "Attribute is read-only" };

  if (attribute.attributeType === "STATUS" && value) {
    const statusOptions = attribute.config?.options || [];
    const statusValues = statusOptions.map((option) => option.status);

    if (statusValues.length > 0 && !statusValues.includes(value)) {
      return {
        status: 400,
        message: `Invalid status value. Must be one of: ${statusValues.join(", ")}`,
      };
    }
  }

  const existingValue = await prisma.attributeValue.findFirst({
    where: {
      recordId,
      attributeId,
    },
  });

  let isEmpty = false;

  if (value === undefined || value === null) {
    isEmpty = true;
  } else if (typeof value === "string") {
    isEmpty = value.trim() === "";
  } else if (typeof value === "number") {
    isEmpty = false;
  } else if (Array.isArray(value)) {
    isEmpty = value.length === 0;
  } else if (typeof value === "object") {
    isEmpty = Object.keys(value).length === 0;
  } else if (typeof value === "boolean") {
    isEmpty = false;
  }

  switch (attribute.attributeType) {
    case "DATETIME":
      isEmpty =
        !value || value === "" || new Date(value).toString() === "Invalid Date";
      break;
    case "NUMBER":
      isEmpty = value === "" || value === null || value === undefined;
      break;
  }

  let updatedValue;

  if (existingValue) {
    if (isEmpty) {
      // Delete the record instead of storing an empty value
      await prisma.attributeValue.delete({
        where: { id: existingValue.id },
      });
      updatedValue = null;
    } else {
      updatedValue = await prisma.attributeValue.update({
        where: { id: existingValue.id },
        data: {
          value: { value },
        },
      });
    }
  } else {
    // Only create a new record if value is not empty
    if (!isEmpty) {
      updatedValue = await prisma.attributeValue.create({
        data: {
          recordId,
          attributeId,
          value: { value },
        },
      });
    } else {
      updatedValue = null;
    }
  }

  return { updatedValue, status: 200, message: "Value updated!" };
};
