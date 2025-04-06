import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteWorkspace } from "@/features/workspaces/server/delete-workspace";
import { useToast } from "@/hooks/use-toast";

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (id) => {
      const response = await deleteWorkspace(id);
      toast({ description: response.message });

      if (response.status !== 200) throw new Error(response.message);

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
