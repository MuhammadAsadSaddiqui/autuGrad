"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/app/(public)/signup/action/register";
import { verifyCode, resendCode } from "@/app/(public)/signup/action/verify"; // Add this import
import { useNotification } from "@/lib/context/NotificationContext";

// Define the verification step type
type VerificationStep = "signup" | "verification" | "success";

// Add verification code schema
const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

const UseSignup = () => {
  const { showSuccess, showError } = useNotification();
  const [verificationStep, setVerificationStep] =
    useState<VerificationStep>("signup");
  const [userEmail, setUserEmail] = useState<string>("");

  // Signup form schema
  const formSchema = z
    .object({
      fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
      }),
      email: z.string().email({
        message: "Please enter a valid email address.",
      }),
      password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  // Signup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Verification code form
  const verifyCodeForm = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  // Signup form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      if (response.status !== 200) {
        showError(response.message);
      } else {
        setUserEmail(values.email);
        setVerificationStep("verification");
        showSuccess("Verification code sent to your email.");
      }
    } catch (error) {
      showError("An error occurred during signup.");
    }
  }

  // Verification code submission
  async function onVerifySubmit(
    values: z.infer<typeof verificationCodeSchema>,
  ) {
    try {
      const response = await verifyCode({
        email: userEmail,
        code: values.code,
      });

      if (response.success) {
        setVerificationStep("success");
        showSuccess("Account verified successfully!");
      } else {
        showError(response.message || "Invalid verification code");
      }
    } catch (error) {
      showError("An error occurred during verification.");
    }
  }

  // Resend verification code
  async function handleResendCode() {
    try {
      const response = await resendCode({
        email: userEmail,
      });

      if (response.success) {
        showSuccess("Verification code resent to your email.");
      } else {
        showError(response.message || "Failed to resend verification code");
      }
    } catch (error) {
      showError("An error occurred while resending the code.");
    }
  }

  return {
    form,
    formSchema,
    onSubmit,
    verificationStep,
    verifyCodeForm,
    onVerifySubmit,
    resendVerificationCode: handleResendCode,
  };
};

export default UseSignup;
