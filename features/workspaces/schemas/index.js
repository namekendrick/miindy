import * as z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter a name" }),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, { message: "Must be 1 or more characters" }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
