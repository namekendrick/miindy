import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const InviteMemberCard = ({ form, onSubmit, isInvitingMember }) => {
  return (
    <Card className="pt-6">
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Invite member</div>
              <div className="text-xs text-muted-foreground">
                Enter an email address to invite a member to your workspace.
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Form {...form}>
              <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex w-full gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isInvitingMember}
                            placeholder="Email"
                            type="email"
                          ></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isInvitingMember}>
                    Invite member
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
