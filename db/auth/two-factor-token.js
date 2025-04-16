import prisma from "@/lib/prisma";

export const getTwoFactorTokenByEmail = async (email) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
