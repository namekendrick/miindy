import { useMutation, useQueryClient } from "@tanstack/react-query";

import { update } from "@/features/members/server/update";
import { toast } from "sonner";

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await update(values);
      toast.success(response.message);

      if (response.status !== 200) throw new Error(response.message);

      return values.workspaceId;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["members", id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
