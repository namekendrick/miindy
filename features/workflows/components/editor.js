"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { ClipLoader } from "react-spinners";

import { useGetWorkflow } from "@/features/workflows/api/use-get-workflow";
import { FlowEditor } from "@/features/workflows/components/flow-editor";
import { TaskMenu } from "@/features/workflows/components/task-menu";
import { TopBar } from "@/features/workflows/components/topbar/top-bar";
import { FlowValidationContextProvider } from "@/features/workflows/context/flow-validation-context";

export const Editor = ({ workflowId, workspaceId }) => {
  const { data: workflow, isLoading: isLoadingWorkflow } = useGetWorkflow({
    workflowId,
    workspaceId,
  });

  if (isLoadingWorkflow)
    return (
      <div className="flex h-full items-center justify-center gap-2">
        <ClipLoader size={20} /> Loading
      </div>
    );

  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <TopBar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
            workspaceId={workspaceId}
            isPublished={workflow.status === "PUBLISHED"}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
};
