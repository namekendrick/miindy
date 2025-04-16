import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRecord } from "@/features/records/server/delete-record";
import { toast } from "sonner";

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await deleteRecord(values);
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
