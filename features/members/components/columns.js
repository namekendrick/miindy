import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangeAccessDropdown } from "@/features/members/components/change-access-dropdown";

export const memberColumns = () => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "name",
      label: "User",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex max-w-[800px] flex-col gap-1 px-4">
            <div className="overflow-hidden text-ellipsis font-semibold">
              {row.original.name}
            </div>
            <div className="text-muted-foreground">{row.original.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "access",
      cell: ({ row }) => {
        return <ChangeAccessDropdown member={row.original} />;
      },
    },
  ];
};
