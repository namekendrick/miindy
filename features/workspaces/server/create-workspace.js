"use server";

import prisma from "@/lib/prisma";
import {
  standardObjects,
  standardObjectConfigs,
  standardRelationships,
} from "@/constants/objects";
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
        name: true,
        objects: {
          include: { attributes: true },
        },
      },
    });

    // Set up record text attributes for each object
    for (const config of standardObjectConfigs) {
      const object = updated.objects.find((o) => o.type === config.type);

      if (object) {
        const attribute = object.attributes.find(
          (a) => a.name === config.attributeName,
        );

        if (attribute)
          await prisma.object.update({
            where: { id: object.id },
            data: { recordTextAttributeId: attribute.id },
          });
      }
    }

    const objectsByType = {};
    const attributesByObjectAndName = {};

    // Build lookups for efficient relationship creation
    for (const object of updated.objects) {
      objectsByType[object.type] = object;
      attributesByObjectAndName[object.type] = {};

      for (const attr of object.attributes) {
        attributesByObjectAndName[object.type][attr.name] = attr;
      }
    }

    const relationshipsToCreate = [];

    for (const relationship of standardRelationships) {
      const {
        sourceObjectType,
        sourceAttributeName,
        targetObjectType,
        targetAttributeName,
        relationshipType,
      } = relationship;

      const sourceAttribute =
        attributesByObjectAndName[sourceObjectType]?.[sourceAttributeName];
      const targetAttribute =
        attributesByObjectAndName[targetObjectType]?.[targetAttributeName];

      if (sourceAttribute && targetAttribute) {
        relationshipsToCreate.push({
          sourceAttributeId: sourceAttribute.id,
          targetAttributeId: targetAttribute.id,
          relationshipType,
        });
      }
    }

    if (relationshipsToCreate.length > 0) {
      await prisma.$transaction(
        relationshipsToCreate.map((rel) =>
          prisma.relationship.create({
            data: rel,
          }),
        ),
      );
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
