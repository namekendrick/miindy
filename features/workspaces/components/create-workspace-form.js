"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace";
import { createWorkspaceSchema } from "@/features/workspaces/schemas";

export const CreateWorkspaceForm = () => {
  const mutation = useCreateWorkspace();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values) => {
    startTransition(() => {
      mutation.mutate(values);
    });
  };

  return (
    <Form {...form}>
      <form
        className="mt-4 w-full max-w-[400px] space-y-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Acme Inc."
                  disabled={isPending}
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          Create workspace
        </Button>
      </form>
    </Form>
  );
};
