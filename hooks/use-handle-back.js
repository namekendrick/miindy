"use client";

import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const useHandleBack = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  function handleBack() {
    const lastPath =
      localStorage.getItem("lastNonSettingsPath") ||
      `/workspace/${workspaceId}/home`;

    router.push(lastPath);
    router.refresh();
  }

  return handleBack;
};
