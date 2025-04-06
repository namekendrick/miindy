import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAttribute } from "@/features/attributes/server/update-attribute";
import { useToast } from "@/hooks/use-toast";

export const useUpdateAttribute = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateAttribute(values);
      toast({ description: response.message });

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
