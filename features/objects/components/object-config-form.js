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
import { useUpdateObject } from "@/features/objects/hooks/use-update-object";
import { objectConfigSchema } from "@/features/objects/schemas";

export const ObjectConfigForm = ({ object }) => {
  const { mutate: updateObject, isPending: isUpdatingObject } =
    useUpdateObject();

  const form = useForm({
    resolver: zodResolver(objectConfigSchema),
    defaultValues: {
      singular: object.singular,
      plural: object.plural,
      slug: object.slug,
    },
  });

  const onSubmit = (values) => {
    updateObject({ ...values });
  };

  return (
    <div className="flex flex-col gap-y-8 px-1">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="singular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Singular title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isUpdatingObject || object.isStandard}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plural"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Plural title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isUpdatingObject || object.isStandard}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Identifier / Slug</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-1.5 flex items-center">
                        <span className="rounded-md bg-muted px-2 text-muted-foreground">
                          /
                        </span>
                      </div>
                      <Input
                        {...field}
                        disabled={isUpdatingObject || object.isStandard}
                        className="pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!object.isStandard && (
            <Button type="submit" disabled={isUpdatingObject}>
              Save changes
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
