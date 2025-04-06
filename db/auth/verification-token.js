import prisma from "@/lib/prisma";

export const getVerificationTokenByEmail = async (identifier) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
