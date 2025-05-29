import { CornerDownRightIcon, MoveRightIcon, CoinsIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";

export const ScheduleSection = ({ isDraft, creditsCost }) => {
  if (isDraft) return null;

  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="text-muted-foreground h-4 w-4" />
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
