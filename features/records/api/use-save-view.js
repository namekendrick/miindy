import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveView } from "@/features/records/server/save-view";
import { useToast } from "@/hooks/use-toast";

export const useSaveView = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await saveView(values);
      toast({ description: response.message });

      if (response.status !== 200 && response.status !== 201)
        throw new Error(response.message);

      return {
        ...values,
        newViewId: response.newViewId,
        slug: response.slug,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          {
            objectType: data.objectType,
            workspaceId: data.workspaceId,
            viewId: data.viewId,
            page: data.page,
          },
        ],
      });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return mutation;
};
