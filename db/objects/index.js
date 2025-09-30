"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const getEnabledObjects = async (workspaceId) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const objects = await prisma.object.findMany({
    where: {
      workspaceId,
      isEnabled: true,
    },
    orderBy: {
      singular: "asc",
    },
    select: {
      id: true,
      singular: true,
      plural: true,
      slug: true,
      type: true,
      isStandard: true,
      _count: {
        select: {
          records: true,
        },
      },
    },
  });

  return objects;
};

export const getObjectBySlug = async (workspaceId, slug) => {
  const user = await currentUser();
  if (!user) return null;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return null;

  const object = await prisma.object.findFirst({
    where: {
      workspaceId,
      slug,
      isEnabled: true,
    },
    select: {
      id: true,
      singular: true,
      plural: true,
      slug: true,
      type: true,
      isStandard: true,
    },
  });

  return object;
};
