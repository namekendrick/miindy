"use client";

import Link from "next/link";
import { CoinsIcon } from "lucide-react";

import { ReactCountUpWrapper } from "@/components/react-count-up-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { useGetWorkspaceBalance } from "@/features/billing/api/use-get-workspace-balance";
import { cn } from "@/lib/utils";

function AvailableCreditsBadge({ workspaceId }) {
  const { data, isLoading } = useGetWorkspaceBalance({ workspaceId });

  return (
    <Link
      href={`/workspace/${workspaceId}/settings/billing`}
      className={cn(
        "w-full items-center",
        buttonVariants({ variant: "outline" }),
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {isLoading && "0"}
        {!isLoading && data && <ReactCountUpWrapper value={data} />}
        {!isLoading && data === undefined && "-"}
      </span>
    </Link>
  );
}

export default AvailableCreditsBadge;
