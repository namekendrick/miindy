"use server";

import { eachDayOfInterval, format } from "date-fns";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { periodToDateRange } from "@/lib/utils/dates";

export async function getCreditUsageInPeriod(values) {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workspaceId, period } = values;

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  const dateRange = periodToDateRange(period);

  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId: user.id,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: ["COMPLETED", "FAILED"],
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {});

  executionPhases.forEach((phase) => {
    const date = format(phase.startedAt, dateFormat);

    if (phase.status === "COMPLETED") {
      stats[date].success += phase.creditsConsumed || 0;
    }

    if (phase.status === "FAILED") {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}

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

  const permission = await prisma.permission.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!permission) return { status: 401, message: "Unauthorized!" };

  return prisma.workspacePurchase.findMany({
    where: { workspaceId },
    orderBy: {
      date: "desc",
    },
  });
}
