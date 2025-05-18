import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveView } from "@/features/records/server/save-view";
import { toast } from "sonner";

export const useSaveView = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await saveView(values);
      toast.success(response.message);

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
          },
        ],
      });

      queryClient.invalidateQueries({ queryKey: ["objectAttributes"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
