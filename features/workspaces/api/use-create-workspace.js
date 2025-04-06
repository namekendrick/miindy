import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createWorkspace } from "@/features/workspaces/server/create-workspace";
import { useToast } from "@/hooks/use-toast";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createWorkspace(values);
      toast({ description: response.message });

      if (response.status !== 200) throw new Error(response.message);

      return response.workspace.id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });

      router.push(`/workspace/${id}/home`);
      router.refresh();
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
