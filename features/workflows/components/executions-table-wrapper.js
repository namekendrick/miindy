import { InboxIcon } from "lucide-react";

import { getExecutionsByWorkflowId } from "@/db/executions";
import { ExecutionsTable } from "@/features/workflows/components/executions-table";

export const ExecutionsTableWrapper = async ({ workspaceId, workflowId }) => {
  const executions = await getExecutionsByWorkflowId({ workflowId });

  if (executions.length === 0) {
    return (
      <div className="mt-52 w-full">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <div className="bg-accent flex h-20 w-20 items-center justify-center rounded-lg">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-muted-foreground text-sm">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ExecutionsTable
      workspaceId={workspaceId}
      workflowId={workflowId}
      initialData={executions}
    />
  );
};
