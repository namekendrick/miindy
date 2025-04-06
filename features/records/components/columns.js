import { Plus } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DraggableColumn } from "@/features/records/components/draggable-column";
import { EditableCell } from "@/features/records/components/editable-cell";

export const columns = ({
  data,
  handleSortingChange,
  currentSort,
  visibleColumns,
  handleAddColumn,
  handleHideColumn,
  handleOpenCreateAttributeModal,
  handleUpdateAttributeValue,
}) => {
  if (!data?.[0]) return [];

  const firstRecord = data[0];
  const attributes = firstRecord.object.attributes;

  const columns = [];

  columns.push({
    id: "select",
    maxSize: 40,
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
  });

  const visibleAttributeIds = visibleColumns?.map((col) => col.id) || [];

  if (visibleColumns && visibleColumns.length > 0) {
    visibleColumns.forEach((visibleCol) => {
      const attribute = attributes.find((attr) => attr.id === visibleCol.id);

      if (!attribute) return;

      const isSorted =
        currentSort && currentSort[0]?.attributeId === attribute.id;
      const sortDirection = isSorted ? currentSort[0].direction : null;

      columns.push({
        accessorFn: (row) => {
          const value = row.values.find((v) => v.attributeId === attribute.id)
            ?.value?.value;
          return value || "";
        },
        id: attribute.id,
        header: ({ header }) => (
          <DraggableColumn
            header={header}
            attribute={attribute}
            isSorted={isSorted}
            sortDirection={sortDirection}
            handleSortingChange={handleSortingChange}
            handleHideColumn={handleHideColumn}
          />
        ),
        cell: ({ row, column }) => {
          const value = column.accessorFn(row.original);

          return (
            <EditableCell
              value={value}
              row={row}
              attribute={attribute}
              onSave={handleUpdateAttributeValue}
            />
          );
        },
      });
    });
  }

  const hiddenAttributes = attributes.filter(
    (attr) => !visibleAttributeIds.includes(attr.id),
  );

  columns.push({
    id: "add-column",
    header: () => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="flex h-full w-full cursor-pointer items-center justify-start px-2 font-medium hover:text-accent-foreground">
            <Plus className="mr-2 h-4 w-4" /> Add Column
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {hiddenAttributes.map((attribute) => (
            <DropdownMenuItem
              key={attribute.id}
              onClick={() => handleAddColumn(attribute.id)}
            >
              {attribute.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenCreateAttributeModal}>
            <Plus className="h-4 w-4" />
            Create new attribute
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  });

  return columns;
};
