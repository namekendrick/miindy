import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import {
  useRemoveWorkflowCron,
  useUpdateWorkflowCron,
} from "@/features/workflows/api/use-update-cron";
import { useScheduleWorkflowModal } from "@/features/workflows/hooks/use-schedule-workflow-modal";
import { cn } from "@/lib/utils";

export const ScheduleWorkflowModal = () => {
  const modal = useScheduleWorkflowModal();
  const { crn, workflowId } = modal;

  const [cron, setCron] = useState("");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  const { mutate: updateWorkflowCron, isPending: isUpdatingWorkflowCron } =
    useUpdateWorkflowCron();

  const { mutate: removeWorkflowCron, isPending: isRemovingWorkflowCron } =
    useRemoveWorkflowCron();

  const updateWorkflowCronMutation = () => {
    updateWorkflowCron(
      { workflowId, cron },
      {
        onSuccess: () => {
          modal.onClose();
        },
      },
    );
  };

  const removeWorkflowCronMutation = () => {
    removeWorkflowCron(
      { workflowId },
      {
        onSuccess: () => {
          modal.onClose();
        },
      },
    );
  };

  useEffect(() => {
    try {
      CronExpressionParser.parse(cron);
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = crn && crn.length > 0;

  return (
    <Modal
      title="Schedule workflow"
      description="Specify a cron expression to schedule periodic workflow execution. All times are in UTC"
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent border-destructive text-destructive rounded-md border p-4 text-sm",
              validCron && "border-primary text-primary",
            )}
          >
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>
          {workflowHasValidCron && (
            <div className="">
              <Button
                className="text-destructive border-destructive hover:text-destructive w-full"
                variant={"outline"}
                disabled={isUpdatingWorkflowCron || isRemovingWorkflowCron}
                onClick={removeWorkflowCronMutation}
              >
                Remove current schedule
              </Button>
              <Separator className="my-4" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-x-2">
          <Button
            className="text-md"
            onClick={modal.onClose}
            size="lg"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="text-md"
            disabled={isUpdatingWorkflowCron || !validCron}
            onClick={updateWorkflowCronMutation}
            size="lg"
            variant="destructive"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
