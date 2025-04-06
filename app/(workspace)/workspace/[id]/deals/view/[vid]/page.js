"use client";

import { ClipLoader } from "react-spinners";

import { RecordsTable } from "@/features/records/components/records-table";
import { useRecordsTable } from "@/features/records/hooks/use-records-table";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export default function DealRecords() {
  const workspaceId = useWorkspaceId();

  const { recordsTable, isLoadingRecords } = useRecordsTable(
    workspaceId,
    "deals",
  );

  if (isLoadingRecords)
    return (
      <div className="mt-40 flex items-center justify-center gap-2">
        <ClipLoader size={20} /> Loading
      </div>
    );

  return <RecordsTable table={recordsTable} />;
}
