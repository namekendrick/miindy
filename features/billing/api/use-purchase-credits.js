import { useMutation, useQueryClient } from "@tanstack/react-query";

import { purchaseCredits } from "@/features/billing/server/purchase-credits";
import { toast } from "sonner";

export const usePurchaseCredits = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => {
      const response = purchaseCredits(values);

      toast.promise(response, {
        error: (error) => error.message,
      });

      return response;
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
