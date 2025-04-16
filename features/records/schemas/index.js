import * as z from "zod";

export const createViewSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter a name" }),
});
