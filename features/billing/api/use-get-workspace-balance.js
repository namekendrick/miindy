import { useQuery } from "@tanstack/react-query";

import { getWorkspaceBalance } from "@/db/billing";

export const useGetWorkspaceBalance = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: ["workspace-balance"],
    queryFn: () => {
      return getWorkspaceBalance(values);
    },
    refetchInterval: 30 * 1000,
  });

  return { data, isLoading };
};
