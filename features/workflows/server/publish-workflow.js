"use server";

import { currentUser } from "@/lib/auth";

export const publishWorkflow = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { id, flowDefinition } = values;

  return { status: 200, message: "Workflow published!" };
};
