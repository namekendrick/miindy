import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRecord } from "@/features/records/server/delete-record";
import { useToast } from "@/hooks/use-toast";

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await deleteRecord(values);
      toast({ description: response.message });

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
