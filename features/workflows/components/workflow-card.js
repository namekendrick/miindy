import { FileTextIcon, PlayIcon, ShuffleIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { LastRunDetails } from "@/features/workflows/components/last-run-details";
import { RunButton } from "@/features/workflows/components/run-button";
import { ScheduleSection } from "@/features/workflows/components/schedule-section";
import { WorkflowActions } from "@/features/workflows/components/workflow-actions";
import { cn } from "@/lib/utils";

const statusColors = {
  DRAFT: "bg-yellow-400 text-yellow-600",
  PUBLISHED: "bg-primary",
};

export const WorkflowCard = ({ workflow }) => {
  const isDraft = workflow.status === "DRAFT";

  return (
    <Card className="dark:shadow-primary/30 group/card border-separate overflow-hidden rounded-lg border py-0 shadow-sm hover:shadow-md">
      <CardContent className="flex h-[100px] items-center justify-between p-4">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              statusColors[workflow.status],
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-muted-foreground flex items-center text-base font-bold">
              <TooltipWrapper content={workflow.description}>
                <a
                  href={`/workspace/${workflow.workspaceId}/workflows/${workflow.id}`}
                  className="flex items-center hover:underline"
                >
                  {workflow.name}
                </a>
              </TooltipWrapper>
              {isDraft && (
                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                  Draft
                </span>
              )}
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              cron={workflow.cron}
              workflowId={workflow.id}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && (
            <RunButton
              workflowId={workflow.id}
              workspaceId={workflow.workspaceId}
            />
          )}
          <a
            href={`/workspace/${workflow.workspaceId}/workflows/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2",
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </a>
          <WorkflowActions workflow={workflow} />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
};
