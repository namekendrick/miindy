"use client";

import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useSaveWorkflow } from "@/features/workflows/api/use-save-workflow";

export const SaveButton = ({ workflowId }) => {
  const { toObject } = useReactFlow();

  const { mutate: saveWorkflow, isPending: isSavingWorkflow } =
    useSaveWorkflow();

  return (
    <Button
      disabled={isSavingWorkflow}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        saveWorkflow({
          id: workflowId,
          definition: workflowDefinition,
        });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
};
