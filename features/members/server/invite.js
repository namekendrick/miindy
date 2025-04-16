"use server";

import prisma from "@/lib/prisma";
import { signIn } from "@/auth";
import { magicLinkSchema } from "@/features/auth/schemas";
import { generateInviteToken } from "@/lib/tokens";

export const invite = async (values) => {
  const validatedFields = magicLinkSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email } = validatedFields.data;
  const { workspaceId } = values;

  const existingMember = await prisma.permission.findFirst({
    where: {
      user: {
        is: {
          email,
        },
      },
    },
  });

  if (existingMember) return { status: 400, message: "Already a member!" };

  const inviteToken = await generateInviteToken(email);

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/join-workspace?token=${inviteToken.token}&id=${workspaceId}`;

  await signIn("resend", {
    email,
    redirect: false,
    redirectTo: redirectUrl,
  });

  return { status: 200, message: "Invite email sent!" };
};
