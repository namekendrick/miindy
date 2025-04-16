"use client";

import { WorkspaceSettingsForms } from "@/features/workspaces/components/workspace-settings-forms";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export default function GeneralSettingsPage() {
  const workspaceId = useWorkspaceId();

  return <WorkspaceSettingsForms workspaceId={workspaceId} />;
}
