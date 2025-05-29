"use client";

import { Button } from "@/components/ui/button";
import { useCreateWorkflowModal } from "@/features/workflows/hooks/use-create-workflow-modal";

export const WorkflowsPageHeader = ({ workspaceId }) => {
  const openCreateWorkflowModal = useCreateWorkflowModal(
    (state) => state.onOpen,
  );

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <p className="text-muted-foreground text-sm">
          Create and manage your workflows
        </p>
      </div>
      <Button onClick={() => openCreateWorkflowModal({ workspaceId })}>
        Create Workflow
      </Button>
    </div>
  );
};
