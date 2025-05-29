"use server";

import { redirect } from "next/navigation";

import { currentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function purchaseCredits(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workspaceId, packId } = values;

  const selectedPack = getCreditsPack(packId);
  if (!selectedPack) {
    throw new Error("Invalid pack");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    success_url: absoluteUrl("/billing"),
    cancel_url: absoluteUrl("/billing"),
    metadata: {
      workspaceId,
      packId,
    },
    line_items: [
      {
        quantity: 1,
        price: selectedPack.priceId,
      },
    ],
  });

  if (!session.url) {
    throw new Error("Cannot create Stripe session");
  }

  redirect(session.url);
}
