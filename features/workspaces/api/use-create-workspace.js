import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createWorkspace } from "@/features/workspaces/server/create-workspace";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await createWorkspace(values);
      toast.success(response.message);

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
      toast.error(error.message);
    },
  });

  return mutation;
};
