import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateWorkspace } from "@/features/workspaces/server/update-workspace";

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateWorkspace(values);
      toast.success(response.message);

      if (response.status !== 200) throw new Error(response.message);

      return values.id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
