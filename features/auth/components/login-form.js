"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { CardWrapper } from "@/features/auth/components/card-wrapper";
import { loginSchema } from "@/features/auth/schemas";
import { login } from "@/features/auth/server/login";

export const LoginForm = () => {
  const router = useRouter();

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", code: "" },
  });

  const onSubmit = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.twoFactor) setShowTwoFactor(true);

          if (!data?.error && !data?.twoFactor)
            router.push(DEFAULT_LOGIN_REDIRECT);
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel=""
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/sign-up"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="space-y-2">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Email"
                          type="email"
                        />
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
                          {...field}
                          disabled={isPending}
                          placeholder="Password"
                          type="password"
                        />
                      </FormControl>
                      <div className="flex items-center gap-x-2">
                        <Button
                          size="sm"
                          variant="link"
                          className="px-0 text-xs"
                          asChild
                        >
                          <Link href="/auth/email">Continue with email</Link>
                        </Button>
                        <span>&#183;</span>
                        <Button
                          size="sm"
                          variant="link"
                          className="px-0 text-xs"
                          asChild
                        >
                          <Link href="/auth/reset">Set a new password</Link>
                        </Button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {showTwoFactor ? "Confirm" : "Sign in"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
