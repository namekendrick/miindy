"use client";

import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePublishWorkflow } from "@/features/workflows/api/use-publish-workflow";
import { useExecutionPlan } from "@/features/workflows/hooks/use-execution-plan";

export const PublishButton = ({ workflowId }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { mutate: publishWorkflow, isPending: isPublishingWorkflow } =
    usePublishWorkflow();

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={isPublishingWorkflow}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // Client side validation!
          return;
        }

        toast.loading("Publishing workflow...", { id: workflowId });
        publishWorkflow({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
};
