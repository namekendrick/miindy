import { Suspense } from "react";

import { LoadingIndicator } from "@/components/loading-indicator";
import { getWorkflowExecutionWithPhases } from "@/db/executions";
import { ExecutionViewer } from "@/features/workflows/components/execution-viewer";
import { TopBar } from "@/features/workflows/components/topbar/top-bar";

export default async function WorkflowRunPage({ params }) {
  const { id, wfid, xid } = await params;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <TopBar
        title="Workflow run details"
        subtitle={`Run ID: ${xid}`}
        workflowId={wfid}
        workspaceId={id}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <LoadingIndicator />
            </div>
          }
        >
          <ExecutionViewerWrapper workflowId={wfid} executionId={xid} />
        </Suspense>
      </section>
    </div>
  );
}

const ExecutionViewerWrapper = async ({ workflowId, executionId }) => {
  const execution = await getWorkflowExecutionWithPhases({
    workflowId,
    executionId,
  });

  return <ExecutionViewer workflowId={workflowId} initialData={execution} />;
};
