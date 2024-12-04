import NextAuth, { type DefaultSession } from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db, db as prisma } from "./db";
import { object, string } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "~/app/auth/server-auth";



export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      // @ts-expect-error
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          // logic to salt and hash password
          user = await getUserByEmail(email);
          if (!user) {
            throw new Error("Invalid credentials.");
          }
          console.log("user", user);

          const pwHash = await bcrypt.compare(
            password,
            user.password as string,
          );
          console.log("resulrt", pwHash);
          if (pwHash) {
            return user;
          }
          return null;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
});
