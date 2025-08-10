import { NextResponse } from "next/server";

import { handleSyncCompleted } from "@/features/integrations/server/handle-sync-completed";

export async function POST(req) {
  try {
    const body = await req.json();

    switch (body.event) {
      case "sync_completed":
        await handleSyncCompleted(body);
        break;
      case "record_created":
        break;
      case "record_updated":
        console.log(body);

        break;
      case "record_deleted":
        break;
      default:
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Paragon webhook error:", error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
