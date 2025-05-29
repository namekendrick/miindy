"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { ExecuteButton } from "@/features/workflows/components/topbar/execute-button";
import { NavigationTabs } from "@/features/workflows/components/topbar/navigation-tabs";
import { PublishButton } from "@/features/workflows/components/topbar/publish-button";
import { SaveButton } from "@/features/workflows/components/topbar/save-button";
import { UnpublishButton } from "@/features/workflows/components/topbar/unpublish-button";

export const TopBar = ({
  title,
  subtitle,
  workflowId,
  workspaceId,
  hideButtons = false,
  isPublished = false,
}) => {
  const router = useRouter();

  return (
    <header className="bg-background sticky top-0 z-10 flex h-[60px] w-full border-separate items-center justify-between border-b-1 px-4 py-2">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="truncate font-bold text-ellipsis">{title}</p>
          {subtitle && (
            <p className="text-muted-foreground truncate text-xs text-ellipsis">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} workspaceId={workspaceId} />
      <div className="flex flex-1 justify-end gap-1">
        {hideButtons === false && (
          <>
            <ExecuteButton workflowId={workflowId} workspaceId={workspaceId} />
            {isPublished && <UnpublishButton workflowId={workflowId} />}
            {!isPublished && (
              <>
                <SaveButton workflowId={workflowId} />
                <PublishButton workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};
