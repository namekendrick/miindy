"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetCreditUsage } from "@/features/billing/api/use-get-credit-usage";
import { CreditUsageChart } from "@/features/billing/components/credit-usage-chart";

export const CreditUsageCard = ({ workspaceId }) => {
  const period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  const { data, isLoading } = useGetCreditUsage({ workspaceId, period });

  if (isLoading) return <Skeleton className="h-[185px] w-full" />;

  return (
    <CreditUsageChart
      title="Credits consumed"
      description="Daily credit consumed in the current month"
      data={data}
    />
  );
};
