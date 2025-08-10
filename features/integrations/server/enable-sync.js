"use server";

import prisma from "@/lib/prisma";
import { findSyncByIntegrationAndPipeline } from "@/features/integrations/server/list-syncs";
import { generateParagonUserToken } from "@/features/integrations/server/paragon-auth";
import { processSyncData } from "@/features/integrations/server/process-sync-data";
import { currentUser } from "@/lib/auth";

export async function enableSync(
  integration,
  pipeline,
  configuration = {},
  configurationName = null,
  workspaceId = null,
) {
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

    // Generate a fresh Paragon user token for the sync API call
    const tokenResult = await generateParagonUserToken();

    if (!tokenResult.success)
      throw new Error(`Failed to generate token: ${tokenResult.error}`);

    // Call Paragon Sync API to enable the sync
    const response = await fetch("https://sync.useparagon.com/api/syncs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenResult.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        integration,
        pipeline,
        configuration,
        configurationName,
      }),
    });

    const result = await response.json();

    if (response.status === 409) {
      const syncResult = await findSyncByIntegrationAndPipeline(
        integration,
        pipeline,
      );

      if (syncResult.found) {
        const existingSync = syncResult.data;

        const processResult = await processSyncData(
          existingSync.id,
          "existing-sync",
        );

        return {
          ...processResult,
          alreadyExists: true,
        };
      } else {
        console.error("Could not find existing sync:", syncResult.error);

        return {
          success: true,
          data: {
            message: "Sync already exists but could not retrieve records",
          },
          alreadyExists: true,
        };
      }
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to enable sync:", error);
    return { success: false, error: error.message || "Failed to enable sync" };
  }
}
