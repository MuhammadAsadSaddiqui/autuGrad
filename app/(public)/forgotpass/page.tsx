// page.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useForgotPassword } from "@/app/(public)/forgotpass/useForgotPass";

export default function ForgotPassword() {
  const {
    form,
    onSubmit,
    emailSent,
    verificationStep,
    verifyCodeForm,
    onVerifySubmit,
    resetPasswordForm,
    onResetPasswordSubmit,
  } = useForgotPassword();

  return (
    <div className={"flex bg-[#F6F1EB] justify-center items-center h-screen"}>
      <Card className={"px-6 py-8"}>
        <CardHeader>
          <img src={"/assets/images/logo.png"} alt={"logo"} />
          <h2 className="text-2xl font-semibold text-center mt-4">
            {verificationStep === "email" && "Forgot Password"}
            {verificationStep === "code" && "Verification Code"}
            {verificationStep === "resetPassword" && "Reset Password"}
            {verificationStep === "success" && "Success"}
          </h2>
        </CardHeader>
        <CardContent>
          {/* Email Step */}
          {verificationStep === "email" && (
            <>
              <p className="text-center mb-6 text-gray-600">
                Enter your email address and we'll send you instructions to
                reset your password.
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={"space-y-4"}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className={"w-full"}
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Sending..."
                      : "Send Verification Code"}
                  </Button>
                </form>
              </Form>
            </>
          )}

          {/* Verification Code Step */}
          {verificationStep === "code" && (
            <>
              <p className="text-center mb-6 text-gray-600">
                Please enter the verification code we sent to your email
                address.
              </p>
              <Form {...verifyCodeForm}>
                <form
                  onSubmit={verifyCodeForm.handleSubmit(onVerifySubmit)}
                  className={"space-y-4"}
                >
                  <FormField
                    control={verifyCodeForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter 6-digit code"
                            {...field}
                            className="text-center text-lg tracking-widest"
                            maxLength={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className={"w-full"}
                    disabled={verifyCodeForm.formState.isSubmitting}
                  >
                    {verifyCodeForm.formState.isSubmitting
                      ? "Verifying..."
                      : "Verify Code"}
                  </Button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => onSubmit(form.getValues())}
                      className="text-sm text-blue-500"
                    >
                      Didn't receive a code? Send again
                    </button>
                  </div>
                </form>
              </Form>
            </>
          )}

          {/* Reset Password Step */}
          {verificationStep === "resetPassword" && (
            <>
              <p className="text-center mb-6 text-gray-600">
                Create a new password for your account.
              </p>
              <Form {...resetPasswordForm}>
                <form
                  onSubmit={resetPasswordForm.handleSubmit(
                    onResetPasswordSubmit,
                  )}
                  className={"space-y-4"}
                >
                  <FormField
                    control={resetPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className={"w-full mt-2"}
                    disabled={resetPasswordForm.formState.isSubmitting}
                  >
                    {resetPasswordForm.formState.isSubmitting
                      ? "Resetting..."
                      : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </>
          )}

          {/* Success Step */}
          {verificationStep === "success" && (
            <div className="text-center">
              <p className="text-green-600 mb-4">
                Your password has been reset successfully!
              </p>
              <Button
                className={"w-full mt-4"}
                onClick={() => (window.location.href = "/login")}
              >
                Login with New Password
              </Button>
            </div>
          )}

          <div className={"flex justify-center mt-6"}>
            <Link href={"/login"} className={"text-sm text-blue-500"}>
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
