import prisma from "@/lib/prisma";

export const getTwoFactorConfirmationByUserId = async (userId) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: {
          userId,
        },
      },
    );

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
