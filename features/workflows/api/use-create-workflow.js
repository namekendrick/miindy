import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createWorkflow } from "@/features/workflows/server/create-workflow";
import { toast } from "sonner";

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createWorkflow(values);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.data;
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
