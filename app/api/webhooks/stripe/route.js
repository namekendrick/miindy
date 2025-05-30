import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { checkoutSessionCompleted } from "@/features/billing/server/events/checkout-session-completed";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "checkout.session.completed":
        await checkoutSessionCompleted(event.data.object);
        break;
      default:
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
