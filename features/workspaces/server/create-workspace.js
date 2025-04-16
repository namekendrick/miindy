"use server";

import prisma from "@/lib/prisma";
import { standardObjects, standardObjectConfigs } from "@/constants/objects";
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

    const updated = await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        objects: {
          create: standardObjects(workspace.id),
        },
        permissions: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
            access: "SUPER_ADMIN",
          },
        },
      },
      select: {
        id: true,
        objects: {
          include: { attributes: true },
        },
      },
    });

    for (const config of standardObjectConfigs) {
      const object = updated.objects.find((o) => o.type === config.type);

      if (object) {
        const attribute = object.attributes.find(
          (a) => a.name === config.attributeName,
        );

        if (attribute) {
          await prisma.object.update({
            where: { id: object.id },
            data: { recordTextAttributeId: attribute.id },
          });
        } else {
          console.warn(
            `[CREATE_WORKSPACE] Could not find attribute "${config.attributeName}" for standard object type "${config.type}" (Workspace ID: ${workspace.id})`,
          );
        }
      } else {
        console.warn(
          `[CREATE_WORKSPACE] Could not find standard object type "${config.type}" (Workspace ID: ${workspace.id})`,
        );
      }
    }

    for (const object of updated.objects) {
      await prisma.view.create({
        data: {
          name: `All ${object.plural}`,
          objectId: object.id,
          workspaceId: workspace.id,
          configuration: {
            create: {
              filters: [],
              sorts: [],
              visibleColumns: object.attributes
                .slice(0, 5)
                .map((attr, index) => ({
                  id: attr.id,
                  position: String(index),
                })),
            },
          },
        },
      });
    }

    return {
      status: 200,
      message: "Workspace created!",
      workspace: { id: updated.id, name: updated.name },
    };
  } catch (error) {
    console.error("[CREATE_WORKSPACE_ERROR],", error);
    return { status: 500, message: "Internal Error" };
  }
};
