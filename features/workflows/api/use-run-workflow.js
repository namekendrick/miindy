import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { runWorkflow } from "@/features/workflows/server/run-workflow";

export const useRunWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => {
      const response = runWorkflow(values);

      toast.promise(response, {
        loading: "Scheduling run...",
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
