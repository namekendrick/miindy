"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const getViewById = async (id, workspaceId) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const view = await prisma.view.findFirst({
    where: { id },
    include: {
      object: true,
      list: true,
      configuration: true,
    },
  });

  if (!view) return { status: 404, message: "View not found!" };

  return view;
};

export const getViews = async (workspaceId, objectType) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const views = await prisma.view.findMany({
    where: {
      workspaceId,
      object: { type: objectType },
    },
    include: {
      object: true,
      configuration: true,
    },
  });

  return views;
};
