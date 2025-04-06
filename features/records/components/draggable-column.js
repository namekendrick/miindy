"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpNarrowWideIcon,
  EyeOff,
  XCircle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const DraggableColumn = ({
  header,
  attribute,
  isSorted,
  sortDirection,
  handleSortingChange,
  handleHideColumn,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: attribute.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1">
      <div {...attributes} {...listeners} className="cursor-grab rounded">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex h-full w-full cursor-pointer items-center justify-between font-medium hover:text-accent-foreground">
            <span className="mr-1 truncate">{attribute.name}</span>
            {isSorted && (
              <span className="flex-shrink-0">
                {sortDirection === "asc" ? (
                  <ArrowUpNarrowWideIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownWideNarrow className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() =>
              handleSortingChange([
                {
                  attributeId: attribute.id,
                  direction: "asc",
                },
              ])
            }
            className={sortDirection === "asc" ? "bg-accent" : ""}
          >
            <ArrowUp className="mr-1 h-4 w-4" /> Sort Ascending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              handleSortingChange([
                {
                  attributeId: attribute.id,
                  direction: "desc",
                },
              ])
            }
            className={sortDirection === "desc" ? "bg-accent" : ""}
          >
            <ArrowDown className="mr-1 h-4 w-4" /> Sort Descending
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isSorted && (
            <DropdownMenuItem onClick={() => handleSortingChange(null)}>
              <XCircle className="mr-1 h-4 w-4" /> Clear Sorting
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleHideColumn(attribute.id)}>
            <EyeOff className="mr-1 h-4 w-4" /> Hide from view
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`resizer ${
          header.column.getIsResizing() ? "isResizing" : ""
        }`}
      />
    </div>
  );
};
