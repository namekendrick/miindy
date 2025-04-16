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
import { useUpdateView } from "@/features/records/api/use-update-view";
import { useRenameViewModal } from "@/features/records/hooks/use-rename-view-modal";
import { createViewSchema } from "@/features/records/schemas";

export const RenameViewModal = () => {
  const router = useRouter();
  const modal = useRenameViewModal();

  const { mutate: updateView, isPending: isUpdatingView } = useUpdateView();

  const form = useForm({
    resolver: zodResolver(createViewSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    form.reset({ name: modal.name });
  }, [modal.name]);

  const renameView = (values) => {
    updateView(
      {
        id: modal.id,
        workspaceId: modal.workspaceId,
        name: values.name,
      },
      {
        onSuccess: () => {
          modal.onClose();
          router.refresh();
        },
      },
    );
  };

  return (
    <Modal title="Rename view" isOpen={modal.isOpen} onClose={modal.onClose}>
      <div className="flex flex-col gap-y-8 px-1">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(renameView)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isUpdatingView} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-x-2">
              <Button
                disabled={isUpdatingView}
                onClick={modal.onClose}
                type="button"
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingView} size="sm">
                Rename view
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
