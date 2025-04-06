import * as z from "zod";

export const objectConfigSchema = z.object({
  singular: z.string().trim().min(1, { message: "Please enter a name" }),
  plural: z.string().trim().min(1, { message: "Please enter a name" }),
  slug: z.string().trim().min(1, { message: "Please enter a name" }),
});
