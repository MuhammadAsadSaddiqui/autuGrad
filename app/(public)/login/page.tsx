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
} from "@/components/ui/form";
import { useLogin } from "@/app/(public)/login/hooks/useLogin";

// Define form schema with validation

export default function Home() {
  const { form, onSubmit } = useLogin();

  return (
    <div className={"flex bg-[#F6F1EB] justify-center items-center h-screen"}>
      <Card className={"px-6 py-8"}>
        <CardHeader>
          <img src={"/assets/images/logo.png"} alt={"logo"} />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={"space-y-3"}
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={"flex justify-center"}>
                <Link href={"/forgotpass"} className={"text-sm text-blue-500"}>
                  Forget password?
                </Link>
              </div>
              <Button type="submit" className={"w-full"}>
                Login
              </Button>
            </form>
          </Form>
          <div className={"flex justify-center mt-2 text-sm"}>
            <p className={"text-sm"}>
              Not Registered yet?{" "}
              <Link href={"/signup"} className={"text-blue-500 text-sm"}>
                Sign up!
              </Link>{" "}
              Now!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
