"use server";

import prisma from "@/lib/prisma";
import { getCreditsPack } from "@/features/billing/utils/get-credits-pack";

export async function checkoutSessionCompleted(event) {
  if (!event.metadata) throw new Error("Missing metadata");

  const { workspaceId, packId } = event.metadata;

  if (!workspaceId) throw new Error("missing workspace id");

  if (!packId) throw new Error("missing pack id");

  const purchasedPack = getCreditsPack(packId);

  if (!purchasedPack) throw new Error("Purchased pack not found");

  await prisma.workspaceBalance.upsert({
    where: { workspaceId },
    create: {
      workspaceId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      },
    },
  });

  await prisma.workspacePurchase.create({
    data: {
      workspaceId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total,
      currency: event.currency,
    },
  });
}
