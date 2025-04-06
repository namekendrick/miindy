import { useMutation, useQueryClient } from "@tanstack/react-query";

import { update } from "@/features/members/server/update";
import { useToast } from "@/hooks/use-toast";

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await update(values);
      toast({ description: response.message });

      if (response.status !== 200) throw new Error(response.message);

      return values.workspaceId;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["members", id] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
