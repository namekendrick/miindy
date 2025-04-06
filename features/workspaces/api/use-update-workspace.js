import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateWorkspace } from "@/features/workspaces/server/update-workspace";
import { useToast } from "@/hooks/use-toast";

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await updateWorkspace(values);
      toast({ description: response.message });

      if (response.status !== 200) throw new Error(response.message);

      return values.id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
