"use client";

import { ArrowLeftRightIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkspacePurchaseHistory } from "@/features/billing/api/use-get-workspace-purchase-history";
import { InvoiceButton } from "@/features/billing/components/invoice-button";
import { formatAmount } from "@/features/billing/utils/format-amount";
import { formatDate } from "@/features/billing/utils/format-date";

export const TransactionHistoryCard = ({ workspaceId }) => {
  const { data: purchases, isLoading } = useGetWorkspacePurchaseHistory({
    workspaceId,
  });

  if (isLoading) return <Skeleton className="h-[150px] w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ArrowLeftRightIcon className="text-primary h-6 w-6" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">No transactions yet</p>
        )}
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-muted-foreground text-sm">
                {purchase.description}
              </p>
            </div>

            <div className="flex items-center text-right">
              <p className="font-medium">
                {formatAmount(purchase.amount, purchase.currency)}
              </p>
              <InvoiceButton id={purchase.id} workspaceId={workspaceId} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
