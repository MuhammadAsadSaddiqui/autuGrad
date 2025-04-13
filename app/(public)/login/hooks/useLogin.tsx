"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Add this import

export const useLogin = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null); // Add state for error message

  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoginError(null); // Clear previous errors

    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    console.log(signInData);
    if (signInData?.status !== 200) {
      console.log("Login failed");
      setLoginError("Invalid email or password. Please try again."); // Set user-friendly error
    } else {
      router.push("/home");
    }
  }

  return { form, formSchema, onSubmit, loginError };
};
