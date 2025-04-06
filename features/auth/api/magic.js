"use server";

import { signIn } from "@/auth";
import { magicLinkSchema } from "@/features/auth/schemas";

export const magic = async (values) => {
  const validatedFields = magicLinkSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email } = validatedFields.data;

  const { callbackUrl } = values;

  await signIn("resend", {
    email,
    callbackUrl,
    redirect: false,
  });

  return { success: "Confirmation email sent!" };
};
