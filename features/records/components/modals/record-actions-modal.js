import { FilePlus2, SendHorizontal, Workflow, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDeleteRecord } from "@/features/records/api/use-delete-record";

export const RecordActionsModal = ({
  workspaceId,
  records,
  resetSelectedRecords,
}) => {
  const { mutate: deleteRecord, isPending: isDeletingRecord } =
    useDeleteRecord();

  const handleDeleteRecord = () => {
    deleteRecord(
      { records, workspaceId },
      { onSuccess: () => resetSelectedRecords() },
    );
  };

  if (!records.length) return null;

  return (
    <div
      className="absolute left-[50%] top-[90%] z-50 w-fit translate-x-[-50%] border bg-background px-4 py-3 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl"
      data-state="open"
    >
      <div className="flex items-center gap-2">
        <div className="mr-1 flex items-center gap-2">
          <span className="rounded-md bg-blue-500 px-2 py-1 text-sm font-medium text-white">
            {records.length}
          </span>
          <div className="text-sm text-muted-foreground">selected</div>
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
        <Button size="sm" variant="ghost" onClick={resetSelectedRecords}>
          <X />
        </Button>
      </div>
    </div>
  );
};
