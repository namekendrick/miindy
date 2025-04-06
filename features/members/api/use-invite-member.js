import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { invite } from "@/features/members/server/invite";
import { useToast } from "@/hooks/use-toast";

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await invite(values);
      toast({ description: response.message });

      if (response.status !== 200) throw new Error(response.message);

      return values.id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });
      router.refresh();
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
