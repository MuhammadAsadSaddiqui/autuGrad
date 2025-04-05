"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/app/(public)/signup/action/register";
import { useNotification } from "@/lib/context/NotificationContext";

const UseSignup = () => {
  const { showSuccess, showError } = useNotification();
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await register({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });
    if (response.status !== 200) {
      showError(response.message);
    } else {
      showSuccess(response.message);
    }
  }
  return { form, formSchema, onSubmit };
};

export default UseSignup;
