import { useMutation } from "@tanstack/react-query";

import { createView } from "@/features/records/server/create-view";
import { toast } from "sonner";

export const useCreateView = () => {
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createView(values);
      toast.success(response.message);

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return response.data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
