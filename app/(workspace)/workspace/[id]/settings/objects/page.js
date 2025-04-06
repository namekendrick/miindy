"use client";

import { ClipLoader } from "react-spinners";

import { ObjectsTable } from "@/features/objects/components/objects-table";
import { useObjectsSettings } from "@/features/objects/hooks/use-objects-settings";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export default function ObjectsSettingsPage() {
  const workspaceId = useWorkspaceId();

  const { objectsTable, isLoadingObjects } = useObjectsSettings(workspaceId);

  if (isLoadingObjects)
    return (
      <div className="mt-40 flex items-center justify-center gap-2">
        <ClipLoader size={20} /> Loading
      </div>
    );

  return <ObjectsTable table={objectsTable} workspaceId={workspaceId} />;
}
