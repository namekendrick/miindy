import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { saveWorkflow } from "@/features/workflows/server/save-workflow";

export const useSaveWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = saveWorkflow(values);

      toast.promise(response, {
        loading: "Saving workflow...",
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
