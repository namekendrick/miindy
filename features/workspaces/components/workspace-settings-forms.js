"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetCurrentWorkspace } from "@/features/workspaces/api/use-get-current-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useWorkspaceModal } from "@/features/workspaces/hooks/use-workspace-modal";
import { updateWorkspaceSchema } from "@/features/workspaces/schemas";

export const WorkspaceSettingsForms = ({ workspaceId }) => {
  const { data: workspace, isLoading } = useGetCurrentWorkspace(workspaceId);
  const openWorkspaceModal = useWorkspaceModal((state) => state.onOpen);
  const updateMutation = useUpdateWorkspace();

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values) => {
    values.id = workspaceId;

    startTransition(() => {
      updateMutation.mutate(values);
    });
  };

  useEffect(() => {
    if (!isLoading) {
      form.setValue("name", workspace.name);
    }
  }, [isLoading, workspace, form]);

  if (isLoading)
    return (
      <div className="mt-40 flex items-center justify-center gap-2">
        <ClipLoader size={20} /> Loading
      </div>
    );

  return (
    <div className="flex flex-col gap-y-8">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
      <Form {...form}>
        <form className="space-y-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="delete"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danger Zone</FormLabel>
                  <Card className="border-red-300 pt-6">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium">
                            Delete workspace
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Deleting your workspace is irreversible
                          </div>
                        </div>
                        <Button
                          onClick={() => openWorkspaceModal(workspaceId)}
                          type="button"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Delete Workspace
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
