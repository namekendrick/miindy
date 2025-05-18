"use client";

import { FilePlus2, SendHorizontal, Workflow, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDeleteRecord } from "@/features/records/api/use-delete-record";
import { useRecordActionsModal } from "@/features/records/hooks/use-record-actions-modal";

export const RecordActionsModal = ({
  workspaceId,
  records,
  resetSelectedRecords,
}) => {
  const { mutate: deleteRecord, isPending: isDeletingRecord } =
    useDeleteRecord();

  const { isOpen, onClose } = useRecordActionsModal();

  const handleDeleteRecord = () => {
    deleteRecord(
      { records, workspaceId },
      { onSuccess: () => resetSelectedRecords() },
    );
  };

  if (!records.length || !isOpen) return null;

  return (
    <div className="absolute bottom-8 left-[50%] z-50 w-fit translate-x-[-50%] border px-4 py-3 shadow-lg duration-200 sm:rounded-xl">
      <div className="flex items-center gap-2">
        <div className="mr-1 flex items-center gap-2">
          <span className="rounded-md bg-blue-500 px-2 py-1 text-sm font-medium text-white">
            {records.length}
          </span>
          <div className="text-muted-foreground text-sm">selected</div>
        </div>
        <Button size="sm" variant="outline" className="shadow">
          <FilePlus2 />
          Add to list
        </Button>
        <Button size="sm" variant="outline" className="shadow">
          <SendHorizontal />
          Send email
        </Button>
        <Button size="sm" variant="outline" className="shadow">
          <Workflow />
          Run workflow
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDeleteRecord}
          disabled={isDeletingRecord}
        >
          Delete
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            resetSelectedRecords();
            onClose();
          }}
        >
          <X />
        </Button>
      </div>
    </div>
  );
};
