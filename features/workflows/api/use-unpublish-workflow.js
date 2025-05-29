import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { unpublishWorkflow } from "@/features/workflows/server/unpublish-workflow";

export const useUnpublishWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => {
      const response = unpublishWorkflow(values);

      toast.promise(response, {
        loading: "Unpublishing workflow...",
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
