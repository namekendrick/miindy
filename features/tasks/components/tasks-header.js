"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateTask } from "@/features/tasks/api/use-create-task";
import { useTaskDetailSheet } from "@/features/tasks/hooks/use-task-detail-sheet";

export const TasksHeader = ({ workspaceId }) => {
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const openTaskDetailSheet = useTaskDetailSheet((state) => state.onOpen);

  const handleCreateTask = () => {
    createTask(
      {
        title: "Untitled task",
        status: "BACKLOG",
        priority: "NONE",
        workspaceId,
      },
      {
        onSuccess: (data) => {
          if (data?.success) {
            openTaskDetailSheet({ task: data.data, workspaceId });
          }
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground text-sm">
          Manage and track your tasks
        </p>
      </div>
      <Button onClick={handleCreateTask} disabled={isCreatingTask}>
        <Plus className="h-4 w-4 gap-2" />
        Create Task
      </Button>
    </div>
  );
};
