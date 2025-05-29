"use client";

import { Layers, Plus } from "lucide-react";

import { WorkspaceWorkflowsSkeleton } from "@/app/(workspace)/workspace/[id]/workflows/_components/workspace-workflows-skeleton";
import { Button } from "@/components/ui/button";
import { useGetWorkflows } from "@/features/workflows/api/use-get-workflows";
import { WorkflowCard } from "@/features/workflows/components/workflow-card";
import { WorkflowsPageHeader } from "@/app/(workspace)/workspace/[id]/workflows/_components/workflows-page-header";
import { useCreateWorkflowModal } from "@/features/workflows/hooks/use-create-workflow-modal";

export const WorkspaceWorkflows = ({ workspaceId }) => {
  const { data, isLoading } = useGetWorkflows(workspaceId);
  const openCreateWorkflowModal = useCreateWorkflowModal(
    (state) => state.onOpen,
  );

  if (isLoading)
    return (
      <div className="flex flex-col">
        <WorkflowsPageHeader workspaceId={workspaceId} />
        <WorkspaceWorkflowsSkeleton />
      </div>
    );

  if (data.length === 0)
    return (
      <div className="flex flex-col">
        <WorkflowsPageHeader workspaceId={workspaceId} />
        <div className="mt-12 flex flex-col items-center justify-center gap-3 py-8">
          <Layers className="text-muted-foreground h-10 w-10" />
          <p className="text-muted-foreground font-medium">
            No workflows created yet
          </p>
          <Button onClick={() => openCreateWorkflowModal({ workspaceId })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col">
      <WorkflowsPageHeader workspaceId={workspaceId} />
      <div className="flex flex-col gap-y-4">
        {data.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  );
};
