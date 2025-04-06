"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { AppDrawer } from "@/components/app-drawer";
import { useCurrentUser } from "@/features/auth/hooks";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export default function WorkspacePage() {
  const user = useCurrentUser();
  const router = useRouter();
  const { update } = useSession();

  const [open, setOpen] = useState();

  const { data, isLoading } = useGetWorkspaces();

  //TODO: Add a loading state

  useEffect(() => {
    update();
  }, []);

  useEffect(() => {
    if (user && data?.length) {
      router.replace(`/workspace/${data[0].id}/home`);
      router.refresh();
    } else if (!open && !isLoading) {
      setOpen(true);
    }
  }, [user, open, setOpen, router, data, isLoading]);

  if (isLoading) return;

  return (
    <AppDrawer
      title="Create a workspace to get started"
      description="Enter your company name."
      open={open}
    >
      <div className="flex w-full flex-col items-center space-y-10">
        <CreateWorkspaceForm setOpen={setOpen} />
      </div>
    </AppDrawer>
  );
}
