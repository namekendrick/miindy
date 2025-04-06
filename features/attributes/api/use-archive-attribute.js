import { useMutation, useQueryClient } from "@tanstack/react-query";

import { archiveAttribute } from "@/features/attributes/server/archive-attribute";
import { useToast } from "@/hooks/use-toast";

export const useArchiveAttribute = () => {
  const { toast } = useToast();
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
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
