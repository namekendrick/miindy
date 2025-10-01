import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTask } from "@/features/tasks/server/update-task";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success("Task updated successfully");
      } else {
        toast.error(data?.message || "Failed to update task");
      }
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
};
