"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSignup from "@/app/(public)/signup/hooks/useSignup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export default function Home() {
  const {
    form,
    onSubmit,
    verificationStep,
    verifyCodeForm,
    onVerifySubmit,
    resendVerificationCode,
  } = useSignup();

  return (
    <div className={"flex bg-[#F6F1EB] justify-center items-center h-screen"}>
      <Card className="px-6 py-8">
        <CardHeader>
          <img
            src={"/assets/images/logo.png"}
            alt={"logo"}
            className={"h-12 mx-auto"}
          />
          <h2 className="text-2xl font-semibold text-center mt-4">
            {verificationStep === "signup" && "Sign Up"}
            {verificationStep === "verification" && "Verify Your Email"}
            {verificationStep === "success" && "Account Created!"}
          </h2>
        </CardHeader>
        <CardContent>
          {verificationStep === "signup" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={"flex flex-col gap-4"}
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter your Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className={"w-full"}>
                  Signup
                </Button>

                <div className={"flex justify-center text-sm"}>
                  <p className={"text-sm"}>
                    Already have an account?{" "}
                    <Link href={"/login"} className={"text-blue-500 text-sm"}>
                      Sign in!
                    </Link>{" "}
                    Now!
                  </p>
                </div>
              </form>
            </Form>
          )}

          {/* Verification Code Step */}
          {verificationStep === "verification" && (
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
                      onClick={resendVerificationCode}
                      className="text-sm text-blue-500"
                    >
                      Didn't receive a code? Send again
                    </button>
                  </div>
                </form>
              </Form>
            </>
          )}

          {/* Success Step */}
          {verificationStep === "success" && (
            <div className="text-center">
              <p className="text-green-600 mb-4">
                Your account has been verified successfully!
              </p>
              <Button
                className={"w-full mt-4"}
                onClick={() => (window.location.href = "/login")}
              >
                Proceed to Login
              </Button>
            </div>
          )}

          {/* Show login link on all steps */}
          {verificationStep !== "signup" && (
            <div className={"flex justify-center mt-6"}>
              <Link href={"/login"} className={"text-sm text-blue-500"}>
                Back to Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
