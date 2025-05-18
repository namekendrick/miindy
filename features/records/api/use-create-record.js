import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRecord } from "@/features/records/server/create-record";
import { toast } from "sonner";

export const useCreateRecord = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createRecord(values);

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
