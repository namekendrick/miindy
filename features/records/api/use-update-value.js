import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateValue } from "@/features/records/server/update-value";
import { toast } from "sonner";

export const useUpdateValue = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateValue(values);
      // toast.success(response.message);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);
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
