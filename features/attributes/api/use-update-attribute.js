import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAttribute } from "@/features/attributes/server/update-attribute";
import { toast } from "sonner";

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateAttribute(values);
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
