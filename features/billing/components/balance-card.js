"use client";

import { CoinsIcon } from "lucide-react";

import { ReactCountUpWrapper } from "@/components/react-count-up-wrapper";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkspaceBalance } from "@/features/billing/api/use-get-workspace-balance";

export const BalanceCard = ({ workspaceId }) => {
  const { data: balance, isLoading } = useGetWorkspaceBalance({ workspaceId });

  if (isLoading) return <Skeleton className="h-[185px] w-full" />;

  return (
    <Card className="from-primary/10 via-primary/5 to-background border-primary/20 flex flex-col justify-between overflow-hidden bg-gradient-to-br shadow-lg">
      <CardContent className="relative items-center p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-foreground mb-1 text-lg font-semibold">
              Available Credits
            </h3>
            <p className="text-primary text-4xl font-bold">
              <ReactCountUpWrapper value={balance} />
            </p>
          </div>

          <CoinsIcon
            size={140}
            className="text-primary absolute right-0 bottom-0 opacity-20"
          />
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        When your credit balance reaches zero, you&apos;ll be unable to execute
        workflow runs
      </CardFooter>
    </Card>
  );
};
