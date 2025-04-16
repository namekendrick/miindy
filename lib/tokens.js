import { v4 as uuidv4 } from "uuid";

import prisma from "@/lib/prisma";
import { getInviteTokenByEmail } from "@/db/auth/invite-token";
import { getPasswordResetTokenByEmail } from "@/db/auth/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/db/auth/two-factor-token";
import { getVerificationTokenByEmail } from "@/db/auth/verification-token";

export const generateInviteToken = async (email) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getInviteTokenByEmail(email);

  if (existingToken) {
    await prisma.inviteToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const inviteToken = await prisma.inviteToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return inviteToken;
};

export const generatePasswordResetToken = async (email) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (email) => {
  const crypto = require("crypto");
  const token = (
    (parseInt(crypto.randomBytes(4).toString("hex"), 16) % 900000) +
    100000
  ).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const generateVerificationToken = async (identifier) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(identifier);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });

  return verificationToken;
};
