"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const getTasks = async (workspaceId) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized!" };

    const permission = await prisma.permission.findFirst({
      where: {
        userId: user.id,
        workspaceId,
      },
    });

    if (!permission) return { status: 401, message: "Unauthorized!" };

    const tasks = await prisma.task.findMany({
      where: { workspaceId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: tasks };
  } catch (error) {
    console.error("[GET_TASKS_ERROR]", error);
    return { status: 500, message: "Failed to fetch tasks" };
  }
};
