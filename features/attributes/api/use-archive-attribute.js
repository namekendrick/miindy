import { useMutation, useQueryClient } from "@tanstack/react-query";

import { archiveAttribute } from "@/features/attributes/server/archive-attribute";
import { toast } from "sonner";

export const useArchiveAttribute = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await archiveAttribute(values);

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
