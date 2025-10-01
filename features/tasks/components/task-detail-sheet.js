"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Settings, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useGetWorkspaceMembers } from "@/features/members/api/use-get-members";
import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { STATUS, PRIORITY } from "@/features/tasks/constants/configs";
import { useTaskDetailSheet } from "@/features/tasks/hooks/use-task-detail-sheet";
import { updateTaskSchema } from "@/features/tasks/schemas";

const TASK_STATUSES = Object.entries(STATUS).map(([value, config]) => ({
  value,
  label: config.label,
}));

const TASK_PRIORITIES = Object.entries(PRIORITY).map(([value, config]) => ({
  value,
  label: config.label,
}));

export const TaskDetailSheet = () => {
  const sheet = useTaskDetailSheet();
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();
  const { data: membersData } = useGetWorkspaceMembers(sheet.workspaceId, 1);
  const [viewMode, setViewMode] = useState("default");

  const members = membersData?.paginated || [];

  const form = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      status: "BACKLOG",
      priority: "NONE",
      assigneeId: undefined,
    },
  });

  useEffect(() => {
    if (sheet.task) {
      form.reset({
        id: sheet.task.id,
        title: sheet.task.title,
        description: sheet.task.description || "",
        status: sheet.task.status,
        priority: sheet.task.priority,
        assigneeId: sheet.task.assigneeId || undefined,
      });
      setViewMode("default");
    }
  }, [sheet.task, form]);

  const onSubmit = (values) => {
    updateTask(values, {
      onSuccess: (data) => {
        if (data?.success) {
          sheet.onClose();
        }
      },
    });
  };

  const handleDelete = () => {
    if (!sheet.task?.id) return;

    deleteTask(sheet.task.id, {
      onSuccess: (data) => {
        if (data?.success) {
          sheet.onClose();
        }
      },
    });
  };

  return (
    <Sheet open={sheet.isOpen} onOpenChange={sheet.onClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl">
        <Form {...form}>
          <SheetHeader>
            <div className="flex items-center justify-between gap-2">
              {viewMode === "properties" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("default")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <SheetTitle className="flex-1">
                {viewMode === "default" ? (
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isUpdatingTask}
                            placeholder="Untitled Task"
                            className="border-0 p-0 shadow-none focus-visible:ring-0"
                            style={{ fontSize: "1.5rem" }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <span className="text-xl font-semibold">Properties</span>
                )}
              </SheetTitle>
              {viewMode === "default" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mr-6"
                  onClick={() => setViewMode("properties")}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              )}
            </div>
          </SheetHeader>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {viewMode === "default" && (
              <div className="space-y-6 p-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isUpdatingTask}
                          placeholder="Add description..."
                          rows={6}
                          className="resize-none border-0 p-0 shadow-none focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {viewMode === "properties" && (
              <div className="space-y-8 p-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isUpdatingTask}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TASK_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isUpdatingTask}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TASK_PRIORITIES.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                            >
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isUpdatingTask}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name || member.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <SheetFooter className="flex justify-between">
              <div className="flex gap-x-2">
                <Button type="submit" disabled={isUpdatingTask} size="sm">
                  Save changes
                </Button>
                {viewMode === "properties" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeletingTask || isUpdatingTask}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
