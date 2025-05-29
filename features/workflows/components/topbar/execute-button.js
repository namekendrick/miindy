"use client";

import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRunWorkflow } from "@/features/workflows/api/use-run-workflow";
import { useExecutionPlan } from "@/features/workflows/hooks/use-execution-plan";

export const ExecuteButton = ({ workflowId, workspaceId }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { mutate: runWorkflow, isPending: isRunningWorkflow } =
    useRunWorkflow();

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={isRunningWorkflow}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // Client side validation!
          return;
        }

        runWorkflow({
          workflowId,
          workspaceId,
          definition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
};
