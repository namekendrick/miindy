"use client";

import { FaUser } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STATUS, PRIORITY } from "@/features/tasks/constants/configs";
import { useTaskDetailSheet } from "@/features/tasks/hooks/use-task-detail-sheet";
import { cn, getInitials } from "@/lib/utils";

const TaskItem = ({ task, workspaceId }) => {
  const openTaskDetailSheet = useTaskDetailSheet((state) => state.onOpen);
  const StatusIcon = STATUS[task.status].icon;
  const priorityConfig = PRIORITY[task.priority];
  const PriorityIcon = priorityConfig.icon;

  return (
    <button
      onClick={() => openTaskDetailSheet({ task, workspaceId })}
      className="group hover:bg-muted/50 flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors"
    >
      <StatusIcon
        className={cn(
          "h-5 w-5 flex-shrink-0",
          task.status === "DONE"
            ? "text-green-600"
            : task.status === "IN_PROGRESS"
              ? "text-blue-600"
              : "text-muted-foreground",
        )}
      />
      <div className="flex w-full items-center justify-between">
        <span
          className={cn(
            "font-medium",
            task.status === "DONE" && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-4">
          <PriorityIcon className="h-5 w-5" />
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={task.assignee?.image} alt={task.assignee?.name} />
            <AvatarFallback>
              {task.assignee ? (
                getInitials(task.assignee.name || task.assignee.email)
              ) : (
                <FaUser className="text-muted-foreground mt-2 h-6 w-6" />
              )}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </button>
  );
};

export const TasksList = ({ tasks, workspaceId }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground text-sm">No tasks found</p>
        <p className="text-muted-foreground text-xs">
          Create a task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y rounded-lg border">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} workspaceId={workspaceId} />
      ))}
    </div>
  );
};
