"use server";
import { RegisterInterface } from "@/app/(public)/signup/interfaces/registerInterface";
import { UserInterface } from "@/types/user/type";
import { db } from "@/lib/db";
import { hash } from "bcrypt";

export async function register({
  fullName,
  email,
  password,
}: RegisterInterface) {
  const existingUser: UserInterface | null = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return { data: null, message: "User already exists", status: 409 };
  }
  const hashPassword = await hash(password, 10);
  await db.user.create({
    data: {
      fullName,
      email,
      password: hashPassword,
    },
  });
  return { data: null, message: "User created", status: 200 };
}
