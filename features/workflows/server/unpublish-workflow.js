"use server";

import { currentUser } from "@/lib/auth";

export const unpublishWorkflow = async (values) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const { id } = values;

  return { status: 200, message: "Workflow unpublished!" };
};
