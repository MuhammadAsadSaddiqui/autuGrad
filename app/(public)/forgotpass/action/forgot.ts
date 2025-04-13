// app/(public)/forgotpass/action/forgot.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import sendEmail from "../../../../lib/email.service";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createVerificationEmail(code: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset</h2>
      <p>We received a request to reset your password. Use the verification code below to continue:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${code}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
}

export async function sendPasswordResetCode(data: { email: string }) {
  try {
    const result = emailSchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: "Invalid email address" };
    }

    const { email } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: true };
    }

    const verificationCode = generateVerificationCode();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: {
        token: verificationCode,
        expiresAt,
      },
      create: {
        userId: user.id,
        token: verificationCode,
        expiresAt,
      },
    });

    // Send email with verification code
    const htmlContent = createVerificationEmail(verificationCode);
    await sendEmail({
      to: email,
      subject: "Password Reset Verification Code",
      htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return { success: false, error: "Failed to send verification code" };
  }
}

export async function verifyResetCode(data: { email: string; code: string }) {
  try {
    const { email, code } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { passwordReset: true },
    });

    if (!user || !user.passwordReset) {
      return { success: false, error: "Invalid verification code" };
    }

    // Check if code is valid and not expired
    if (
      user.passwordReset.token !== code ||
      user.passwordReset.expiresAt < new Date()
    ) {
      return { success: false, error: "Invalid or expired verification code" };
    }

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Error verifying code:", error);
    return { success: false, error: "Failed to verify code" };
  }
}

export async function resetPassword(data: {
  email: string;
  code: string;
  password: string;
}) {
  try {
    // First verify the code
    const verificationResult = await verifyResetCode({
      email: data.email,
      code: data.code,
    });

    if (!verificationResult.success) {
      return verificationResult;
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Update the user's password with the hashed version
    await prisma.user.update({
      where: { id: verificationResult.userId },
      data: {
        password: hashedPassword,
      },
    });

    // Delete the password reset token
    await prisma.passwordReset.delete({
      where: { userId: verificationResult.userId },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
