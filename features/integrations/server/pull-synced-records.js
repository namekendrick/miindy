"use server";

import { generateParagonUserToken } from "@/features/integrations/server/paragon-auth";

export async function pullAllSyncedRecords(syncId) {
  const tokenResult = await generateParagonUserToken();

  if (!tokenResult.success)
    throw new Error(`Failed to generate token: ${tokenResult.error}`);

  const url = `https://sync.useparagon.com/api/syncs/${syncId}/records`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenResult.token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  return result;
}
