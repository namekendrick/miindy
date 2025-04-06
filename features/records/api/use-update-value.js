import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateValue } from "@/features/records/server/update-value";
import { useToast } from "@/hooks/use-toast";

export const useUpdateValue = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateValue(values);
      // toast({ description: response.message });

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
