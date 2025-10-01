import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteTask } from "@/features/tasks/server/delete-task";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success("Task deleted successfully");
      } else {
        toast.error(data?.message || "Failed to delete task");
      }
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
};
