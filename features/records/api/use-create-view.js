import { useMutation } from "@tanstack/react-query";

import { createView } from "@/features/records/server/create-view";
import { useToast } from "@/hooks/use-toast";

export const useCreateView = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createView(values);
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
