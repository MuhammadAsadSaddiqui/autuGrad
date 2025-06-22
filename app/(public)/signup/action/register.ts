"use server";
import { RegisterInterface } from "@/app/(public)/signup/interfaces/registerInterface";
import { UserInterface } from "@/types/user/type";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens"; // Create this utility
import sendEmail from "@/lib/email.service";

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

  // Generate verification token (6-digit code)
  const verificationToken = generateVerificationToken();

  const hashPassword = await hash(password, 10);
  await db.user.create({
    data: {
      fullName,
      email,
      password: hashPassword,
      verificationToken,
      emailVerified: false, // User starts as unverified
    },
  });

  // Send verification email
  await sendVerificationEmail(email, fullName, verificationToken);

  return {
    data: null,
    message: "User created. Please check your email to verify your account.",
    status: 200,
  };
}

async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}&email=${email}`;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    htmlContent: `
      <div>
        <h1>Email Verification</h1>
        <p>Hi ${name},</p>
        <p>Thanks for signing up! Please verify your email address with the code below:</p>
        <h2>${token}</h2>
        <p>Or click the link below to verify directly:</p>
        <a href="${verificationUrl}">Verify Email</a>
      </div>
    `,
  });
}
