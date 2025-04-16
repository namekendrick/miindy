import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteView } from "@/features/records/server/delete-view";
import { toast } from "sonner";

export const useDeleteView = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await deleteView(values);
      toast.success(response.message);

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
