"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function getWorkspaceBalance(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workspaceId } = values;

  const balance = await prisma.workspaceBalance.findUnique({
    where: { workspaceId },
  });

  if (!balance) return -1;

  return balance.credits;
}

export async function getWorkspacePurchaseHistory(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workspaceId } = values;

  return prisma.workspacePurchase.findMany({
    where: { workspaceId },
    orderBy: {
      date: "desc",
    },
  });
}
