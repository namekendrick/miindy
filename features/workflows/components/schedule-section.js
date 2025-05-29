import cronstrue from "cronstrue";
import {
  CornerDownRightIcon,
  MoveRightIcon,
  CoinsIcon,
  ClockIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useScheduleWorkflowModal } from "@/features/workflows/hooks/use-schedule-workflow-modal";
import { cn } from "@/lib/utils";

export const ScheduleSection = ({ isDraft, creditsCost, cron, workflowId }) => {
  const openScheduleWorkflowModal = useScheduleWorkflowModal(
    (state) => state.onOpen,
  );

  const workflowHasValidCron = cron && cron.length > 0;
  const readableSavedCron = workflowHasValidCron && cronstrue.toString(cron);

  if (isDraft) return null;

  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="text-muted-foreground h-4 w-4" />
      <Button
        variant={"link"}
        size={"sm"}
        className={cn(
          "h-auto p-0 text-sm text-orange-500",
          workflowHasValidCron && "text-primary",
        )}
        onClick={() => openScheduleWorkflowModal({ crn: cron, workflowId })}
      >
        {workflowHasValidCron && (
          <div className="flex items-center gap-2">
            <ClockIcon />
            {readableSavedCron}
          </div>
        )}
        {!workflowHasValidCron && (
          <div className="flex items-center gap-1">
            <TriangleAlertIcon className="h-3 w-3" /> Set schedule
          </div>
        )}
      </Button>
      <MoveRightIcon className="text-muted-foreground h-4 w-4" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="itemscenter flex gap-3">
          <Badge
            variant={"outline"}
            className="text-muted-foreground space-x-2 rounded-sm"
          >
            <CoinsIcon className="h-4 w-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
};
