import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { duplicateWorkflow } from "@/features/workflows/server/duplicate-workflow";

export const useDuplicateWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = duplicateWorkflow(values);

      toast.promise(response, {
        loading: "Duplicating workflow...",
        success: (data) => data.message,
        error: (error) => error.message,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return mutation;
};
