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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ATTRIBUTE_TYPES } from "@/constants/attribute-types";
import { useCreateAttribute } from "@/features/attributes/api/use-create-attribute";
import { useCreateAttributeModal } from "@/features/attributes/hooks/use-create-attribute-modal";
import { createAttributeSchema } from "@/features/attributes/schemas";

export const CreateAttributeModal = () => {
  const modal = useCreateAttributeModal();

  const { mutate: createAttribute, isPending: isCreatingAttribute } =
    useCreateAttribute();

  // TODO: Update schema to validate against all possible attribute types

  const form = useForm({
    resolver: zodResolver(createAttributeSchema),
    defaultValues: { type: "text", name: "" },
  });

  const onSubmit = (values) => {
    createAttribute(
      {
        ...values,
        workspaceId: modal.workspaceId,
        objectType: modal.objectType,
      },
      {
        onSuccess: (data) => {
          modal.onClose();
          modal.handleAddColumn(data.id);
        },
      },
    );
  };

  return (
    <Modal
      title="Create attribute"
      description="Please enter a name for your new attribute."
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ATTRIBUTE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
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
                      <Input {...field} disabled={isCreatingAttribute} />
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
                        disabled={isCreatingAttribute}
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
                disabled={isCreatingAttribute}
                onClick={modal.onClose}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingAttribute} size="sm">
                Create attribute
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
