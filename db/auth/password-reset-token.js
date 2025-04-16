import prisma from "@/lib/prisma";

export const getPasswordResetTokenByEmail = async (email) => {
  try {
    const passwordToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
      },
    });

    return passwordToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token) => {
  try {
    const passwordToken = await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return passwordToken;
  } catch {
    return null;
  }
};
