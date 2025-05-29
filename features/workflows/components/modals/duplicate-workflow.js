import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useDuplicateWorkflow } from "@/features/workflows/api/use-duplicate-workflow";
import { useDuplicateWorkflowModal } from "@/features/workflows/hooks/use-duplicate-workflow-modal";
import { duplicateWorkflowSchema } from "@/features/workflows/schemas";

export const DuplicateWorkflowModal = () => {
  const modal = useDuplicateWorkflowModal();

  const { mutate: duplicateWorkflow, isPending: isDuplicatingWorkflow } =
    useDuplicateWorkflow();

  const form = useForm({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: { name: null, description: null, workflowId: null },
  });

  const duplicateWorkflowMutation = (values) => {
    duplicateWorkflow(
      {
        name: values.name,
        description: values.description,
        workflowId: modal.workflow.id,
        workspaceId: modal.workflow.workspaceId,
      },
      {
        onSuccess: () => {
          modal.onClose();
        },
      },
    );
  };

  useEffect(() => {
    form.reset({
      name: modal.workflow?.name + " (Copy)",
      description: modal.workflow?.description || "",
      workflowId: modal.workflow?.id,
    });
  }, [modal]);

  return (
    <Modal
      title="Create a new workflow"
      description="Please enter a name for your new workflow."
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div className="flex flex-col gap-y-8 px-1">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(duplicateWorkflowMutation)}
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDuplicatingWorkflow} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isDuplicatingWorkflow} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-x-2">
              <Button
                disabled={isDuplicatingWorkflow}
                onClick={modal.onClose}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isDuplicatingWorkflow} size="sm">
                Duplicate workflow
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
