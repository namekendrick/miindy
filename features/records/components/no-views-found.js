"use client";

import { Button } from "@/components/ui/button";
import { useCreateViewModal } from "@/features/records/hooks/use-create-view-modal";

export const NoViewsFound = ({ id, objectType }) => {
  const openCreateViewModal = useCreateViewModal((state) => state.onOpen);

  return (
    <div className="mt-40 flex items-center justify-center gap-2">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">Create a view to get started</h1>
          <p className="text-sm text-muted-foreground">
            A view is a way to organize and filter your people.
          </p>
        </div>
        <Button
          onClick={() => openCreateViewModal({ workspaceId: id, objectType })}
        >
          Create view
        </Button>
      </div>
    </div>
  );
};
