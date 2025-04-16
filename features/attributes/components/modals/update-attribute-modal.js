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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAttribute } from "@/features/attributes/api/use-update-attribute";
import { useUpdateAttributeModal } from "@/features/attributes/hooks/use-update-attribute-modal";
import { updateAttributeSchema } from "@/features/attributes/schemas";

export const UpdateAttributeModal = () => {
  const modal = useUpdateAttributeModal();

  const { mutate: updateAttribute, isPending: isUpdatingAttribute } =
    useUpdateAttribute();

  const form = useForm({
    resolver: zodResolver(updateAttributeSchema),
  });

  useEffect(() => {
    form.reset({
      type: modal.attribute?.attributeType.toLowerCase() || "",
      name: modal.attribute?.name || "",
      description: modal.attribute?.description || "",
    });
  }, [modal.attribute]);

  const onSubmit = (values) => {
    updateAttribute(
      {
        ...values,
        workspaceId: modal.attribute.workspaceId,
        id: modal.attribute.id,
      },
      { onSuccess: () => modal.onClose() },
    );
  };

  return (
    <Modal
      title="Update attribute"
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div className="flex flex-col gap-y-8 px-1">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={field.value}>
                          <span className="capitalize">{field.value}</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isUpdatingAttribute} />
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
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isUpdatingAttribute}
                        placeholder="Enter a description for your attribute"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-x-2">
              <Button
                disabled={isUpdatingAttribute}
                onClick={modal.onClose}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingAttribute} size="sm">
                Update attribute
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
