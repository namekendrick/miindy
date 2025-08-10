"use server";

import { pullAllSyncedRecords } from "@/features/integrations/server/pull-synced-records";
import { syncHubSpotContactsToPersonRecords } from "@/features/integrations/server/sync-hubspot-contacts";

export async function processSyncData(syncId) {
  try {
    const pullResult = await pullAllSyncedRecords(syncId);

    if (
      pullResult?.data &&
      Array.isArray(pullResult.data) &&
      pullResult.data.length > 0
    ) {
      try {
        const syncResult = await syncHubSpotContactsToPersonRecords(
          pullResult.data,
        );

        return {
          success: true,
          pullResult,
          syncResult,
        };
      } catch (syncError) {
        console.error("Error syncing contacts to Person records:", syncError);

        return {
          success: false,
          pullResult,
          syncResult: {
            success: false,
            error:
              syncError.message || "Failed to sync contacts to Person records",
          },
        };
      }
    }

    return {
      success: true,
      pullResult,
      syncResult: {
        success: true,
        message: "No data to sync",
      },
    };
  } catch (error) {
    console.error(`Error processing sync data for ${syncId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to process sync data",
    };
  }
}
