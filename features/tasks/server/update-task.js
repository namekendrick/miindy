"use server";

import prisma from "@/lib/prisma";
import { updateTaskSchema } from "@/features/tasks/schemas";
import { currentUser } from "@/lib/auth";

export const updateTask = async (values) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized!" };

    const validatedFields = updateTaskSchema.safeParse(values);
    if (!validatedFields.success) {
      return { status: 400, message: "Invalid fields!" };
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: validatedFields.data.id },
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

    const { id, ...updateData } = validatedFields.data;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
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
    });

    return { success: true, data: task };
  } catch (error) {
    console.error("[UPDATE_TASK_ERROR]", error);
    return { status: 500, message: "Failed to update task" };
  }
};
