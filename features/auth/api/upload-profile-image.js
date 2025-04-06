"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export const uploadProfileImage = async (values) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized!" };

    await prisma.user.update({
      where: { id: user.id },
      data: { ...values },
    });

    return { success: "Image uploaded!" };
  } catch (error) {
    console.log("[USER_ERROR],", error);
    return { status: 500, message: "Internal Error" };
  }
};
