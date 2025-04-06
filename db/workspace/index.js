"use server";

import prisma from "@/lib/prisma";
import { MEMBERS_PER_PAGE } from "@/constants/pagination";
import { currentUser } from "@/lib/auth";

export const getCurrentUsersWorkspaces = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized!" };

    const workspaces = await prisma.workspace.findMany({
      where: {
        permissions: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    return workspaces;
  } catch (error) {
    console.log("[WORKSPACE_ERROR],", error);
    return { status: 500, message: "Internal Error" };
  }
};

export const getWorkspaceById = async (id) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  if (!id) return { status: 400, message: "Invalid id!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: id,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const workspace = await prisma.workspace.findUnique({
    where: { id },
  });

  return workspace;
};

export const getWorkspaceMembers = async (id, page) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  if (!id) return { status: 400, message: "Invalid id!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: id,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const members = await prisma.user.findMany({
    where: {
      workspaces: {
        some: {
          workspaceId: id,
        },
      },
    },
  });

  const paginated = await prisma.user.findMany({
    take: MEMBERS_PER_PAGE,
    skip: (page - 1) * MEMBERS_PER_PAGE,
    where: {
      workspaces: {
        some: {
          workspaceId: id,
        },
      },
    },
    include: {
      workspaces: {
        where: {
          workspaceId: id,
        },
      },
    },
  });

  let totalPages = Math.ceil(parseInt(members.length) / MEMBERS_PER_PAGE);

  return { paginated, totalPages };
};

export const getWorkspaceObjects = async (id) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  if (!id) return { status: 400, message: "Invalid id!" };

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId: id,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const workspace = await prisma.workspace.findUnique({
    where: { id },
    select: {
      objects: {
        orderBy: {
          singular: "asc",
        },
        include: {
          _count: {
            select: {
              records: true,
            },
          },
          attributes: true,
        },
      },
    },
  });

  return workspace.objects;
};
