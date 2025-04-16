import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteWorkspace } from "@/features/workspaces/server/delete-workspace";

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id) => {
      const response = await deleteWorkspace(id);
      toast.success(response.message);

      if (response.status !== 200) throw new Error(response.message);

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
