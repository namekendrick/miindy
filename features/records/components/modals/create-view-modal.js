import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { useCreateView } from "@/features/records/api/use-create-view";
import { useCreateViewModal } from "@/features/records/hooks/use-create-view-modal";
import { createViewSchema } from "@/features/records/schemas";

export const CreateViewModal = () => {
  const modal = useCreateViewModal();
  const router = useRouter();

  const { mutate: createView, isPending: isCreatingView } = useCreateView();

  const form = useForm({
    resolver: zodResolver(createViewSchema),
    defaultValues: { name: "" },
  });

  const createNewView = (values) => {
    createView(
      {
        name: values.name,
        workspaceId: modal.workspaceId,
        objectType: modal.objectType,
        currentFilters: modal.currentFilters,
      },
      {
        onSuccess: (view) => {
          router.push(
            `/workspace/${modal.workspaceId}/${view.object.slug}/view/${view.id}`,
          );
        },
      },
    );
  };

  return (
    <Modal
      title="Create a new view"
      description="Please enter a name for your new view."
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div className="flex flex-col gap-y-8 px-1">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(createNewView)}
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isCreatingView} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-x-2">
              <Button
                disabled={isCreatingView}
                onClick={modal.onClose}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingView} size="sm">
                Create view
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
