import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateWorkflow } from "@/features/workflows/api/use-create-workflow";
import { useCreateWorkflowModal } from "@/features/workflows/hooks/use-create-workflow-modal";
import { createWorkflowSchema } from "@/features/workflows/schemas";

export const CreateWorkflowModal = () => {
  const modal = useCreateWorkflowModal();

  const { mutate: createWorkflow, isPending: isCreatingWorkflow } =
    useCreateWorkflow();

  const form = useForm({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: { name: "", description: "" },
  });

  const createNewWorkflow = (values) => {
    createWorkflow(
      {
        name: values.name,
        workspaceId: modal.workspaceId,
      },
      {
        onSuccess: () => {
          modal.onClose();
        },
      },
    );
  };

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
            onSubmit={form.handleSubmit(createNewWorkflow)}
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isCreatingWorkflow} />
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
                      <Textarea {...field} disabled={isCreatingWorkflow} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-x-2">
              <Button
                disabled={isCreatingWorkflow}
                onClick={modal.onClose}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingWorkflow} size="sm">
                Create workflow
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
