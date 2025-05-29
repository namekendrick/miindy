import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useDeleteWorkflow } from "@/features/workflows/api/use-delete-workflow";
import { useDeleteWorkflowModal } from "@/features/workflows/hooks/use-delete-workflow-modal";

export const DeleteWorkflowModal = () => {
  const modal = useDeleteWorkflowModal();

  const { mutate: deleteWorkflow, isPending: isDeletingWorkflow } =
    useDeleteWorkflow();

  const [confirmText, setConfirmText] = useState("");

  const deleteWorkflowMutation = () => {
    deleteWorkflow(
      {
        workflowId: modal.workflow.id,
        workspaceId: modal.workflow.workspaceId,
      },
      {
        onSuccess: () => {
          modal.onClose();
        },
      },
    );
  };

  return (
    <Modal
      title="Are you absolutely sure?"
      description=""
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div className="flex flex-col gap-y-8 py-4">
        <div className="flex flex-col gap-y-2">
          <p>
            If you delete this workflow, you will not be able to recover it.
          </p>
          <p>
            If you are sure, enter <b>{modal.workflow?.name}</b> to confirm:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-x-2">
          <Button
            className="text-md"
            disabled={isDeletingWorkflow}
            onClick={modal.onClose}
            size="lg"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="text-md"
            disabled={
              confirmText !== modal.workflow?.name || isDeletingWorkflow
            }
            onClick={deleteWorkflowMutation}
            size="lg"
            variant="destructive"
          >
            Delete workflow
          </Button>
        </div>
      </div>
    </Modal>
  );
};
