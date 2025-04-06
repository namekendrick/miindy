"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const Breadcrumb = ({
  parentRoute,
  parentLabel,
  currentLabel,
  backUrl = null,
}) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  // Use provided backUrl or construct one from parentRoute
  const backLinkUrl =
    backUrl || `/workspace/${workspaceId}/settings/${parentRoute}`;

  const handleBack = () => {
    router.push(backLinkUrl);
    router.refresh();
  };

  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="-ml-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{parentLabel}</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-foreground">{currentLabel}</span>
        </div>
      </div>
    </div>
  );
};
