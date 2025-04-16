import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { invite } from "@/features/members/server/invite";
import { toast } from "sonner";

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await invite(values);
      toast.success(response.message);

      if (response.status !== 200) throw new Error(response.message);

      return values.id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
