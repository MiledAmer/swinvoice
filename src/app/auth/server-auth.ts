"use server";
import bcrypt from "bcryptjs";
import { signIn } from "~/server/auth";
import { db } from "~/server/db";

export async function signUp(values: any) {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(values.password, salt);

  const result = await db.user.create({
    data: {
      name: values.name,
      email: values.email,
      password: hashedPassword,
    },
  });
}

export async function sign(formData: any) {
  "use server";
  await signIn("credentials", formData);
}

// get user by email
export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}
