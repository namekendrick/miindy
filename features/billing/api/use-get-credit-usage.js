import { useQuery } from "@tanstack/react-query";

import { getCreditUsageInPeriod } from "@/db/billing";

export const useGetCreditUsage = (values) => {
  const { data, isLoading } = useQuery({
    queryKey: ["credit-usage", values.workspaceId],
    queryFn: () => {
      return getCreditUsageInPeriod(values);
    },
    enabled: !!values.workspaceId,
  });

  return { data, isLoading };
};
