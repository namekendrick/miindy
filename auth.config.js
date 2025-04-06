/* eslint-disable import/no-anonymous-default-export */

import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { getUserByEmail } from "@/db/auth/user";
import { loginSchema } from "@/features/auth/schemas";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
};
