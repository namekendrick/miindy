import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createTask } from "@/features/tasks/server/create-task";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success("Task created successfully");
      } else {
        toast.error(data?.message || "Failed to create task");
      }
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
};
