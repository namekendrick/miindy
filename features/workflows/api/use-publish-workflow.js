import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { publishWorkflow } from "@/features/workflows/server/publish-workflow";

export const usePublishWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => {
      const response = publishWorkflow(values);

      toast.promise(response, {
        loading: "Publishing workflow...",
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
