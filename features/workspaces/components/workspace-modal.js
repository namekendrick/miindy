import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import { useWorkspaceModal } from "@/features/workspaces/hooks/use-workspace-modal";

export const WorkspaceModal = () => {
  const router = useRouter();
  const modal = useWorkspaceModal();
  const deleteMutation = useDeleteWorkspace();

  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      deleteMutation.mutate(modal.id, {
        onSuccess: () => {
          modal.onClose();
          router.push("/workspace");
        },
      });
    });
  };

  return (
    <Modal
      title="Are you sure?"
      description="Once deleted, your workspace cannot be recovered."
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div className="flex gap-x-2">
        <Button
          className="text-md"
          disabled={isPending}
          onClick={modal.onClose}
          size="lg"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="text-md"
          disabled={isPending}
          onClick={handleClick}
          size="lg"
          variant="destructive"
        >
          Yes, delete
        </Button>
      </div>
    </Modal>
  );
};
