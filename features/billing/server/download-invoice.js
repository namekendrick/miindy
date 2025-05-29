"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function downloadInvoice(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { id, workspaceId } = values;

  const purchase = await prisma.workspacePurchase.findUnique({
    where: {
      id,
      workspaceId,
    },
  });

  if (!purchase) return { status: 400, message: "Bad request!" };

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);

  if (!session.invoice) throw new Error("Invoice not found!");

  const invoice = await stripe.invoices.retrieve(session.invoice);

  return invoice.hosted_invoice_url;
}
