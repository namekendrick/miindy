import { Plus } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const recordTextAttributeId = firstRecord.object.recordTextAttributeId;

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

  const recordTextAttribute = recordTextAttributeId
    ? attributes.find((attr) => attr.id === recordTextAttributeId)
    : null;

  if (recordTextAttribute) {
    columns.push({
      accessorFn: (row) => {
        const value = row.values.find(
          (v) => v.attributeId === recordTextAttribute.id,
        )?.value?.value;
        return value || "";
      },
      id: recordTextAttribute.id,
      header: ({ header }) => (
        <div className="flex h-full w-full items-center justify-between gap-1 font-medium">
          <span className="truncate">{recordTextAttribute.name}</span>
          <div
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            className={`resizer ${
              header.column.getIsResizing() ? "isResizing" : ""
            }`}
          />
        </div>
      ),
      cell: ({ row, column }) => {
        const value = column.accessorFn(row.original);
        const enhancedAttribute = {
          ...recordTextAttribute,
          object: { recordTextAttributeId: recordTextAttribute.id },
        };

        return (
          <EditableCell
            value={value}
            row={row}
            attribute={enhancedAttribute}
            onSave={handleUpdateAttributeValue}
          />
        );
      },
    });
  }

  const visibleAttributeIds = visibleColumns?.map((col) => col.id) || [];

  if (visibleColumns && visibleColumns.length > 0) {
    visibleColumns.forEach((visibleCol) => {
      if (visibleCol.id === recordTextAttributeId) return;

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
          <div className="hover:text-accent-foreground flex h-full w-full cursor-pointer items-center justify-start px-2 font-medium">
            <Plus className="mr-2 h-4 w-4" /> Add Column
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-[400px] w-72 p-0">
          <div className="max-h-[350px] overflow-y-auto p-1">
            {hiddenAttributes.map((attribute) => (
              <DropdownMenuItem
                key={attribute.id}
                onClick={() => handleAddColumn(attribute.id)}
              >
                {attribute.name}
              </DropdownMenuItem>
            ))}
          </div>
          <div className="bg-popover sticky bottom-0 border-t p-1">
            <DropdownMenuItem onClick={handleOpenCreateAttributeModal}>
              <Plus className="mr-2 h-4 w-4" />
              Create new attribute
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  });

  return columns;
};
