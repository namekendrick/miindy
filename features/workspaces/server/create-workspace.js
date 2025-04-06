"use server";

import prisma from "@/lib/prisma";
import { createWorkspaceSchema } from "@/features/workspaces/schemas";
import { currentUser } from "@/lib/auth";

export const createWorkspace = async (values) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized!" };

    const validatedFields = createWorkspaceSchema.safeParse(values);

    if (!validatedFields.success) return { error: "Invalid fields!" };

    const { name } = validatedFields.data;

    const workspace = await prisma.workspace.create({
      data: { name },
    });

    await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        permissions: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
            OR: [{ access: "SUPER_ADMIN" }, { access: "ADMIN" }],
          },
        },
      },
    });

    return {
      status: 200,
      message: "Workspace created!",
      workspace,
    };
  } catch (error) {
    console.log("[DOMAIN_ERROR],", error);
    return { status: 500, message: "Internal Error" };
  }
};
