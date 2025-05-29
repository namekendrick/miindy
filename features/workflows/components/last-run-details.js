import { ChevronRightIcon, ClockIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import {
  ExecutionStatusIndicator,
  ExecutionStatusLabel,
} from "@/features/workflows/components/execution-status-indicator";

export const LastRunDetails = ({ workflow }) => {
  const isDraft = workflow.status === "DRAFT";
  if (isDraft) return null;

  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;

  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

  return (
    <div className="bg-primary/5 text-muted-foreground flex items-center justify-between px-4 py-1">
      <div className="flex items-center gap-2 text-sm">
        {lastRunAt && (
          <a
            href={`/workspace/${workflow.workspaceId}/workflows/${workflow.id}/runs/${lastRunId}`}
            className="group flex items-center gap-2 text-sm"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator status={lastRunStatus} />
            <ExecutionStatusLabel status={lastRunStatus} />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] transition group-hover:translate-x-0"
            />
          </a>
        )}
        {!lastRunAt && <p>No runs yet</p>}
      </div>
      {nextRunAt && (
        <div className="flex items-center gap-2 text-sm">
          <ClockIcon size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  );
};
