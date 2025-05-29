"use client";

import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUnpublishWorkflow } from "@/features/workflows/api/use-unpublish-workflow";

export const UnpublishButton = ({ workflowId }) => {
  const { mutate: unpublishWorkflow, isPending: isUnpublishingWorkflow } =
    useUnpublishWorkflow();

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={isUnpublishingWorkflow}
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: workflowId });
        unpublishWorkflow({ id: workflowId });
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
};
