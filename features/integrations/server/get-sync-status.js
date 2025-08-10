"use server";

import { generateParagonUserToken } from "@/features/integrations/server/paragon-auth";

export async function getSyncStatus(syncId) {
  try {
    // Generate a fresh Paragon user token for the sync API call
    const tokenResult = await generateParagonUserToken();
    if (!tokenResult.success) {
      throw new Error(`Failed to generate token: ${tokenResult.error}`);
    }

    // Call Paragon Sync API to get sync status
    const response = await fetch(
      `https://sync.useparagon.com/api/syncs/${syncId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      // If sync doesn't exist, return not found status
      if (response.status === 404) {
        return {
          success: true,
          exists: false,
          data: null,
        };
      }

      throw new Error(
        result.error || `Failed to get sync status: ${response.status}`,
      );
    }

    console.log(`Sync status retrieved for ${syncId}:`, {
      syncId: result.id,
      status: result.status,
      integration: result.integration,
      pipeline: result.pipeline,
    });

    return {
      success: true,
      exists: true,
      data: result,
    };
  } catch (error) {
    console.error("Failed to get sync status:", error);
    return {
      success: false,
      error: error.message || "Failed to get sync status",
    };
  }
}
