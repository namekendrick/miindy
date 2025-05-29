"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const getUserCredentials = async () => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized!" };

  const credentials = await prisma.credential.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  return credentials;
};
