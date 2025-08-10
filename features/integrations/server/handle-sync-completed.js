"use server";

import { processSyncData } from "@/features/integrations/server/process-sync-data";

export async function handleSyncCompleted(webhookData) {
  if (webhookData.status === "IDLE") {
    return await processSyncData(webhookData.sync_id, "initial-sync");
  }

  return {
    success: true,
    message: "Sync not in IDLE state, no processing needed",
  };
}
