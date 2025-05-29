import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  removeWorkflowCron,
  updateWorkflowCron,
} from "@/features/workflows/server/update-workflow";

export const useUpdateWorkflowCron = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => {
      const response = updateWorkflowCron(values);

      toast.promise(response, {
        loading: "Updating workflow...",
        success: (data) => data.message,
        error: (error) => error.message,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export const useRemoveWorkflowCron = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => {
      const response = removeWorkflowCron(values);

      toast.promise(response, {
        loading: "Updating workflow...",
        success: (data) => data.message,
        error: (error) => error.message,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
