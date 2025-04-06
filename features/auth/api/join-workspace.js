"use server";

import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/db/auth/user";
import { getInviteTokenByToken } from "@/db/auth/invite-token";

export const joinWorkspace = async (token, id) => {
  const existingToken = await getInviteTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Invite has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      workspaces: {
        create: {
          workspace: {
            connect: { id },
          },
        },
      },
    },
  });

  await prisma.inviteToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Invite accepted!" };
};
