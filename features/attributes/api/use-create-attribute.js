import { useMutation } from "@tanstack/react-query";

import { createAttribute } from "@/features/attributes/server/create-attribute";
import { toast } from "sonner";

export const useCreateAttribute = () => {
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createAttribute(values);
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
