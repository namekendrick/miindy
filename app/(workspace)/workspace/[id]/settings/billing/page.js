"use client";

import { BalanceCard } from "@/features/billing/components/balance-card";
import { CreditUsageCard } from "@/features/billing/components/credit-usage-card";
import { CreditsPurchase } from "@/features/billing/components/credits-purchase";
import { TransactionHistoryCard } from "@/features/billing/components/transaction-history-card";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export default function BillingSettingsPage() {
  const workspaceId = useWorkspaceId();

  return (
    <div className="space-y-8">
      <BalanceCard workspaceId={workspaceId} />
      <CreditsPurchase workspaceId={workspaceId} />
      <CreditUsageCard workspaceId={workspaceId} />
      <TransactionHistoryCard workspaceId={workspaceId} />
    </div>
  );
}
