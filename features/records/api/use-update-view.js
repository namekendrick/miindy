import { useMutation } from "@tanstack/react-query";

import { updateView } from "@/features/records/server/update-view";
import { toast } from "sonner";

export const useUpdateView = () => {
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateView(values);
      toast.success(response.message);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
