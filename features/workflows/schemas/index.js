import * as z from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter a name" }),
  description: z.string().trim().optional(),
});

export const duplicateWorkflowSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter a name" }),
  description: z.string().trim().optional(),
  workflowId: z.string(),
});
