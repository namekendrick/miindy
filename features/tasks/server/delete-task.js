"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const deleteTask = async (taskId) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized!" };

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return { status: 404, message: "Task not found" };
    }

    const permission = await prisma.permission.findFirst({
      where: {
        userId: user.id,
        workspaceId: existingTask.workspaceId,
      },
    });

    if (!permission) return { status: 401, message: "Unauthorized!" };

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { success: true };
  } catch (error) {
    console.error("[DELETE_TASK_ERROR]", error);
    return { status: 500, message: "Failed to delete task" };
  }
};
