"use server";

import prisma from "@/lib/prisma";
import { taskSchema } from "@/features/tasks/schemas";
import { currentUser } from "@/lib/auth";

export const createTask = async (values) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized!" };

    const validatedFields = taskSchema.safeParse(values);
    if (!validatedFields.success) {
      return { status: 400, message: "Invalid fields!" };
    }

    const permission = await prisma.permission.findFirst({
      where: {
        userId: user.id,
        workspaceId: values.workspaceId,
      },
    });

    if (!permission) return { status: 401, message: "Unauthorized!" };

    const task = await prisma.task.create({
      data: {
        ...validatedFields.data,
        workspaceId: values.workspaceId,
      },
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
    console.error("[CREATE_TASK_ERROR]", error);
    return { status: 500, message: "Failed to create task" };
  }
};
