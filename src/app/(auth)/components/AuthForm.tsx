"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signInSchema, signUpSchema } from "../authSchema";
import { cn } from "@/lib/utils";
import OtpDialog from "./OtpDIalog";
import { login, signUp } from "@/actions";
import { customToast } from "@/components/ui/sonner";

type AuthType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: AuthType }) => {
  const authSchema = type === "sign-up" ? signUpSchema : signInSchema;
  const [isLoading, setIsLoading] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema | typeof signInSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof signInSchema | typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const user =
        type === "sign-up"
          ? await signUp({ fullName: "username" in values ? values.username : "", email: values.email })
          : await login({ email: values.email });

      if (user.error) return customToast(user.error, "error");

      setAccountId(user.accountId);
      setOpenDialog(true);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <OtpDialog
          email={form.getValues("email")}
          setAccountId={setAccountId}
          accountId={accountId}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-12 my-auto flex w-full flex-col justify-center space-y-8 lg:mx-0 lg:w-1/3"
        >
          <div className="flex gap-4 lg:hidden">
            <Image src={"assets/icons/logo-brand.svg"} height={60} width={60} alt="" />
            <span className="font-500 text-[2.25rem] tracking-tight">StoreIt</span>
          </div>
          <div className="text-dark-grey font-600 text-center text-[3rem] tracking-tighter">
            {type === "sign-in" ? "Login" : "Create Account"}
          </div>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div>
                  <FormItem
                    className={cn(
                      "border-light-300 flex h-[78px] flex-col justify-center rounded-xl border px-4 shadow-[0px_10px_30px_0px_#4247611A]",
                      "username" in form.formState.errors && form.formState.errors.username && "border-red-500",
                    )}
                  >
                    <FormLabel className="text-light-100 body-2 w-full pt-2">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                  </FormItem>
                  <FormMessage className="p-2" />
                </div>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <div>
                <FormItem
                  className={cn(
                    "border-light-300 flex h-[78px] flex-col justify-center rounded-xl border px-4 shadow-[0px_10px_30px_0px_#4247611A]",
                    form.formState.errors.email && "border-red-500",
                  )}
                >
                  <FormLabel className="text-light-100 body-2 w-full pt-2">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                </FormItem>
                <FormMessage className="p-2" />
              </div>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full rounded-full !py-8">
            {isLoading ? (
              <>
                <Image src={"assets/icons/loader.svg"} className="animate-spin" width={24} height={24} alt="" />
                {type === "sign-in" ? "Signing in..." : "Signing Up..."}
              </>
            ) : type === "sign-in" ? (
              "Login"
            ) : (
              "Continue"
            )}
          </Button>
          {type === "sign-up" ? (
            <div className="body2 text-center">
              Already have an account?{" "}
              <Link href={"/sign-in"} className="text-dark-orange">
                Login
              </Link>
            </div>
          ) : (
            <div className="body2 text-center">
              {"Don't have an account? "}
              <Link href={"/sign-up"} className="text-dark-orange">
                Create Account
              </Link>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
