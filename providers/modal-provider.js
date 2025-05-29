"use client";

import { useEffect, useState } from "react";

import { CreateAttributeModal } from "@/features/attributes/components/modals/create-attribute-modal";
import { UpdateAttributeModal } from "@/features/attributes/components/modals/update-attribute-modal";
import { CreateViewModal } from "@/features/records/components/modals/create-view-modal";
import { DeleteViewModal } from "@/features/records/components/modals/delete-view-modal";
import { NewViewModal } from "@/features/records/components/modals/new-view-modal";
import { RenameViewModal } from "@/features/records/components/modals/rename-view-modal";
import { CreateWorkflowModal } from "@/features/workflows/components/modals/create-workflow-modal";
import { WorkspaceModal } from "@/features/workspaces/components/workspace-modal";
import { DeleteWorkflowModal } from "@/features/workflows/components/modals/delete-workflow-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateAttributeModal />
      <UpdateAttributeModal />
      <CreateViewModal />
      <DeleteViewModal />
      <NewViewModal />
      <RenameViewModal />
      <CreateWorkflowModal />
      <DeleteWorkflowModal />
      <WorkspaceModal />
    </>
  );
};
