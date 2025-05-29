"use client";

import { PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRunWorkflow } from "@/features/workflows/api/use-run-workflow";

export const RunButton = ({ workflowId, workspaceId }) => {
  const { mutate: runWorkflow, isPending: isRunningWorkflow } =
    useRunWorkflow();

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      disabled={isRunningWorkflow}
      onClick={() => {
        runWorkflow({ workflowId, workspaceId });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
};
