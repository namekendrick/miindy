import { useMutation } from "@tanstack/react-query";

import { updateObject } from "@/features/objects/server/update-object";
import { toast } from "sonner";

export const useUpdateObject = () => {
  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateObject(values);
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
