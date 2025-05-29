"use server";

import prisma from "@/lib/prisma";
import { CronExpressionParser } from "cron-parser";
import { currentUser } from "@/lib/auth";

export const updateWorkflowCron = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workflowId, cron } = values;

  try {
    const interval = CronExpressionParser.parse(cron, {
      tz: "UTC",
    });

    await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });

    return { status: 200, message: "Workflow cron updated!" };
  } catch (error) {
    console.error("invalid cron:", error.message);
    throw new Error("invalid cron expression");
  }
};

export const removeWorkflowCron = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { workflowId } = values;

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  return { status: 200, message: "Workflow cron updated!" };
};
