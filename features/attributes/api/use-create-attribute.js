import { useMutation } from "@tanstack/react-query";

import { createAttribute } from "@/features/attributes/server/create-attribute";
import { useToast } from "@/hooks/use-toast";

export const useCreateAttribute = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createAttribute(values);
      toast({ description: response.message });

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.data;
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
