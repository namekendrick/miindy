import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { useSaveView } from "@/features/records/api/use-save-view";
import { useNewViewModal } from "@/features/records/hooks/use-new-view-modal";
import { createViewSchema } from "@/features/records/schemas";

export const NewViewModal = () => {
  const router = useRouter();
  const modal = useNewViewModal();

  const { mutate: saveView, isPending: isSavingView } = useSaveView();

  const form = useForm({
    resolver: zodResolver(createViewSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    form.reset({
      name: modal.currentView?.name,
    });
  }, [modal.currentView]);

  const saveAsNewView = (values) => {
    const {
      viewId,
      workspaceId,
      page,
      currentFilters,
      currentView,
      objectType,
    } = modal;

    saveView(
      {
        objectType,
        workspaceId,
        viewId,
        page,
        configuration: {
          ...currentView.configuration,
          filters: currentFilters,
        },
        createNewView: true,
        newViewName: values.name,
      },
      {
        onSuccess: (data) => {
          modal.onClose();

          if (data.newViewId) {
            router.push(
              `/workspace/${workspaceId}/${data.slug}/view/${data.newViewId}`,
            );
          }
        },
      },
    );
  };

  return (
    <Modal
      title="Save as new view"
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div className="flex flex-col gap-y-8 px-1">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(saveAsNewView)}
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSavingView} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-x-2">
              <Button
                disabled={isSavingView}
                onClick={modal.onClose}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingView} size="sm">
                Create view
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
