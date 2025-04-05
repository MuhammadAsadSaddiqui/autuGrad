"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function getAuthUser() {
  return await getServerSession(authOptions);
}
