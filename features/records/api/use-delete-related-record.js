import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRelatedRecord } from "@/features/records/server/delete-related-record";
import { toast } from "sonner";

export const useDeleteRelatedRecord = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await deleteRelatedRecord(values);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["related-records"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
