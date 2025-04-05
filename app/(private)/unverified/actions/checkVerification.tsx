"use server";
import { getAuthUser } from "@/lib/authUser";
import { redirect } from "next/navigation";

export async function checkVerification() {
  console.log("@@@@");
  const session = await getAuthUser();
  console.log("@@@@", session);
  if (!session) {
    redirect("/login");
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (!session.user.verified) {
    redirect("/unverified");
  }
}
