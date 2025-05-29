import * as z from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter a name" }),
  description: z.string().trim().optional(),
});
