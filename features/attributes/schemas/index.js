import * as z from "zod";
import { ATTRIBUTE_TYPES } from "@/constants/attribute-types";

export const createAttributeSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter a name" }),
  description: z.string().optional(),
  type: z.enum(
    ATTRIBUTE_TYPES.map((type) => type.value),
    { message: "Please select a valid attribute type" },
  ),
});

export const updateAttributeSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter a name" }),
  description: z.string().optional(),
});
