import prisma from "@/lib/prisma";

export const getInviteTokenByEmail = async (email) => {
  try {
    const inviteToken = await prisma.inviteToken.findFirst({
      where: {
        email,
      },
    });

    return inviteToken;
  } catch {
    return null;
  }
};

export const getInviteTokenByToken = async (token) => {
  try {
    const inviteToken = await prisma.inviteToken.findUnique({
      where: {
        token,
      },
    });

    return inviteToken;
  } catch {
    return null;
  }
};
