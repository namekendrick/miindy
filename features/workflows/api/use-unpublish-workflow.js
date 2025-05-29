import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { unpublishWorkflow } from "@/features/workflows/server/unpublish-workflow";

export const useUnpublishWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await unpublishWorkflow(values);
      toast.success(response.message);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.data;
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
