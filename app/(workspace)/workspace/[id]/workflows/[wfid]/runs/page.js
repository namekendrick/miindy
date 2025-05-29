import { Suspense } from "react";

import { LoadingIndicator } from "@/components/loading-indicator";
import { ExecutionsTableWrapper } from "@/features/workflows/components/executions-table-wrapper";
import { TopBar } from "@/features/workflows/components/topbar/top-bar";

export default async function WorkflowRunsPage({ params }) {
  const { id, wfid } = await params;

  return (
    <div className="h-full w-full overflow-auto">
      <TopBar
        title="Workflow runs"
        subtitle="List of all your workflow runs"
        workflowId={wfid}
        workspaceId={id}
        hideButtons
      />
      <Suspense
        fallback={
          <div className="mt-52 flex w-full items-center justify-center">
            <LoadingIndicator />
          </div>
        }
      >
        <ExecutionsTableWrapper workspaceId={id} workflowId={wfid} />
      </Suspense>
    </div>
  );
}
