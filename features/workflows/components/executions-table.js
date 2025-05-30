"use client";

import { formatDistanceToNow } from "date-fns";
import { CoinsIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetExecutions } from "@/features/workflows/api/use-get-executions";
import { ExecutionStatusIndicator } from "@/features/workflows/components/execution-status-indicator";
import { datesToDurationString } from "@/lib/utils/dates";

export const ExecutionsTable = ({ workspaceId, workflowId, initialData }) => {
  const router = useRouter();

  const { data: executions } = useGetExecutions(
    { workflowId },
    { initialData, refetchInterval: 5000 },
  );

  return (
    <div className="overflow-auto shadow-sm">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-muted-foreground text-right text-xs">
              Started at (desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full gap-2 overflow-auto">
          {executions &&
            executions.map((execution) => {
              const duration = datesToDurationString(
                execution.completedAt,
                execution.startedAt,
              );

              const formattedStartedAt =
                execution.startedAt &&
                formatDistanceToNow(execution.startedAt, {
                  addSuffix: true,
                });

              return (
                <TableRow
                  key={execution.id}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/workspace/${workspaceId}/workflows/${execution.workflowId}/runs/${execution.id}`,
                    );
                  }}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{execution.id}</span>
                      <div className="text-muted-foreground text-xs">
                        <span>Triggered via</span>
                        <Badge variant={"outline"}>{execution.trigger}</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <ExecutionStatusIndicator status={execution.status} />
                        <span className="font-semibold capitalize">
                          {execution.status}
                        </span>
                      </div>
                      <div className="text-muted-foreground mx-5 text-xs">
                        {duration}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <CoinsIcon size={16} className="text-primary" />
                        <span className="font-semibold capitalize">
                          {execution.creditsConsumed}
                        </span>
                      </div>
                      <div className="text-muted-foreground mx-5 text-xs">
                        Credits
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {formattedStartedAt}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};
