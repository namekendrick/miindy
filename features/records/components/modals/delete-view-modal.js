import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDeleteView } from "@/features/records/api/use-delete-view";
import { useDeleteViewModal } from "@/features/records/hooks/use-delete-view-modal";

export const DeleteViewModal = () => {
  const router = useRouter();
  const modal = useDeleteViewModal();
  const view = modal.view;

  const { mutate: deleteView, isPending: isDeletingView } = useDeleteView();

  const handleDeleteView = () => {
    deleteView(
      { viewId: view.id, workspaceId: view.workspaceId },
      {
        onSuccess: () => {
          modal.onClose();
          router.push(`/workspace/${view.workspaceId}/people/view`);
        },
      },
    );
  };

  return (
    <Modal
      title="Are you sure?"
      description="You are about to delete this view."
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div className="flex gap-x-2">
        <Button
          className="text-md"
          disabled={isDeletingView}
          onClick={modal.onClose}
          size="lg"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="text-md"
          disabled={isDeletingView}
          onClick={handleDeleteView}
          size="lg"
          variant="destructive"
        >
          Delete view
        </Button>
      </div>
    </Modal>
  );
};
