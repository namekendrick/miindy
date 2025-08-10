"use server";

import { generateParagonUserToken } from "@/features/integrations/server/paragon-auth";

export async function listUserSyncs() {
  try {
    const tokenResult = await generateParagonUserToken();

    if (!tokenResult.success)
      throw new Error(`Failed to generate token: ${tokenResult.error}`);

    const response = await fetch("https://sync.useparagon.com/api/syncs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenResult.token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error) {
    console.error("Failed to list syncs:", error);
    return {
      success: false,
      error: error.message || "Failed to list syncs",
    };
  }
}

export async function findSyncByIntegrationAndPipeline(integration, pipeline) {
  try {
    const syncsResult = await listUserSyncs();

    const matchingSync = syncsResult.data.find(
      (sync) => sync.integration === integration && sync.pipeline === pipeline,
    );

    return {
      found: matchingSync ? true : false,
      data: matchingSync || null,
    };
  } catch (error) {
    console.error("Failed to find sync:", error);
    return {
      success: false,
      error: error.message || "Failed to find sync",
    };
  }
}
