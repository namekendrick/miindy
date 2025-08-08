"use server";

import jwt from "jsonwebtoken";
import { currentUser } from "@/lib/auth";

export async function generateParagonUserToken() {
  try {
    const user = await currentUser();

    if (!user) throw new Error("User not authenticated");

    const projectId = process.env.PARAGON_PROJECT_ID;
    const signingKey = process.env.PARAGON_SIGNING_KEY;

    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60;

    const payload = {
      sub: user.id,
      aud: `useparagon.com/${projectId}`,
      iat: currentTime,
      exp: currentTime + expiresIn,
    };

    const token = jwt.sign(payload, signingKey, {
      algorithm: "RS256",
    });

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error("Failed to generate Paragon user token:", error);
    return {
      success: false,
      error: error.message || "Failed to generate authentication token",
    };
  }
}
