import { useQuery } from "@tanstack/react-query";

import { getWorkspaceBalance } from "@/db/billing";

export const useGetWorkspaceBalance = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: ["workspace-balance", values.workspaceId],
    queryFn: () => {
      return getWorkspaceBalance(values);
    },
    enabled: !!values.workspaceId,
    refetchInterval: 30 * 1000,
  });

  return { data, isLoading };
};
