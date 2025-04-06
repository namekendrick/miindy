import { useMutation } from "@tanstack/react-query";

import { updateView } from "@/features/records/server/update-view";
import { useToast } from "@/hooks/use-toast";

export const useUpdateView = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateView(values);
      toast({ description: response.message });

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
