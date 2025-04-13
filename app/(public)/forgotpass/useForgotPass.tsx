"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  sendPasswordResetCode,
  verifyResetCode,
  resetPassword,
} from "./action/forgot";

// Email form schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Verification code form schema
const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

// Reset password form schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type VerificationCodeForm = z.infer<typeof verificationCodeSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

type VerificationStep = "email" | "code" | "resetPassword" | "success";

export const useForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [verificationStep, setVerificationStep] =
    useState<VerificationStep>("email");
  const [isLoading, setIsLoading] = useState(false);

  // Email form
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Verification code form
  const verifyCodeForm = useForm<VerificationCodeForm>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  // Reset password form
  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      // Call the server action to send verification code
      const result = await sendPasswordResetCode({ email: data.email });

      if (!result.success) {
        form.setError("email", {
          message:
            result.error ||
            "Failed to send verification code. Please try again.",
        });
        return;
      }

      // Move to verification code step
      setEmailSent(true);
      setVerificationStep("code");
    } catch (error) {
      console.error("Error sending verification code:", error);
      form.setError("email", {
        message: "Failed to send verification code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifySubmit = async (data: VerificationCodeForm) => {
    try {
      setIsLoading(true);
      // Call the server action to verify the code
      const result = await verifyResetCode({
        email: form.getValues().email,
        code: data.code,
      });

      if (!result.success) {
        verifyCodeForm.setError("code", {
          message:
            result.error || "Invalid verification code. Please try again.",
        });
        return;
      }

      // Move to reset password step
      setVerificationStep("resetPassword");
    } catch (error) {
      console.error("Error verifying code:", error);
      verifyCodeForm.setError("code", {
        message: "Invalid verification code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPasswordSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      // Call the server action to reset the password
      const result = await resetPassword({
        email: form.getValues().email,
        code: verifyCodeForm.getValues().code,
        password: data.password,
      });

      if (!result.success) {
        resetPasswordForm.setError("password", {
          message:
            result.error! || "Failed to reset password. Please try again.",
        });
        return;
      }

      // Move to success step
      setVerificationStep("success");
    } catch (error) {
      console.error("Error resetting password:", error);
      resetPasswordForm.setError("password", {
        message: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    verifyCodeForm,
    resetPasswordForm,
    onSubmit,
    onVerifySubmit,
    onResetPasswordSubmit,
    emailSent,
    verificationStep,
    isLoading,
  };
};
