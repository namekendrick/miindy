import { useQuery } from "@tanstack/react-query";

import { getWorkspacePurchaseHistory } from "@/db/billing";

export const useGetWorkspacePurchaseHistory = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: ["purchase-history", values.workspaceId],
    queryFn: () => {
      return getWorkspacePurchaseHistory(values);
    },
    enabled: !!values.workspaceId,
  });

  return { data, isLoading };
};
