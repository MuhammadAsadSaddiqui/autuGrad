"use server";
import { getAuthUser } from "@/lib/authUser";
import { redirect } from "next/navigation";

export async function checkVerification() {
  const session = await getAuthUser();
  console.log("@@@@", session);
  if (!session) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    redirect("/unverified");
  }
}
