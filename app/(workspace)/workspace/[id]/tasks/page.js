"use client";

import { useParams } from "next/navigation";

import { LoadingIndicator } from "@/components/loading-indicator";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { TasksHeader } from "@/features/tasks/components/tasks-header";
import { TasksList } from "@/features/tasks/components/tasks-list";

export default function TasksPage() {
  const { id } = useParams();
  const { data: tasks, isLoading } = useGetTasks(id);

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <TasksHeader workspaceId={id} />
      <TasksList tasks={tasks.data} workspaceId={id} />
    </div>
  );
}
