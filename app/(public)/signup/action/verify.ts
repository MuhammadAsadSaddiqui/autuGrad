// app/(public)/signup/action/verify.ts
"use server";

import { db } from "@/lib/db";
import sendEmail from "@/lib/email.service";
import { generateVerificationToken } from "@/lib/tokens";

export async function verifyCode({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
        verificationToken: code,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid verification code",
      };
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    console.error("Error verifying code:", error);
    return {
      success: false,
      message: "An error occurred during verification",
    };
  }
}

export async function resendCode({ email }: { email: string }) {
  try {
    const verificationToken = generateVerificationToken();

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Update the user's verification token
    await db.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Send the new verification email
    await sendVerificationEmail(email, user.fullName, verificationToken);

    return {
      success: true,
      message: "Verification code sent successfully",
    };
  } catch (error) {
    console.error("Error resending code:", error);
    return {
      success: false,
      message: "An error occurred while resending the code",
    };
  }
}

// Helper function to send verification email
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
