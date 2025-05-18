"use client";

import { useSortable } from "@dnd-kit/sortable";
import {
  GripVertical,
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpNarrowWideIcon,
  EyeOff,
  XCircle,
} from "lucide-react";
import { memo } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const DraggableColumn = memo(function DraggableColumn({
  header,
  attribute,
  isSorted,
  sortDirection,
  handleSortingChange,
  handleHideColumn,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: attribute.id,
    animateLayoutChanges: () => false,
    transform: null,
    transition: null,
  });

  const columnStyle = isDragging ? { opacity: 0.3 } : undefined;

  const handleSortAscending = () => {
    handleSortingChange([{ attributeId: attribute.id, direction: "asc" }]);
  };

  const handleSortDescending = () => {
    handleSortingChange([{ attributeId: attribute.id, direction: "desc" }]);
  };

  const handleClearSorting = () => {
    handleSortingChange(null);
  };

  const handleHideColumnClick = () => {
    handleHideColumn(attribute.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={columnStyle}
      className="relative flex h-full w-full items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1 pr-2">
        <div
          {...attributes}
          {...listeners}
          className="hover:bg-accent/50 flex-shrink-0 cursor-grab rounded p-1"
        >
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-full min-w-0 cursor-pointer items-center justify-between font-medium">
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
              onClick={handleSortAscending}
              className={sortDirection === "asc" ? "bg-accent" : ""}
            >
              <ArrowUp className="mr-1 h-4 w-4" /> Sort Ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSortDescending}
              className={sortDirection === "desc" ? "bg-accent" : ""}
            >
              <ArrowDown className="mr-1 h-4 w-4" /> Sort Descending
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isSorted && (
              <DropdownMenuItem onClick={handleClearSorting}>
                <XCircle className="mr-1 h-4 w-4" /> Clear Sorting
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleHideColumnClick}>
              <EyeOff className="mr-1 h-4 w-4" /> Hide from view
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
      />
    </div>
  );
});

export { DraggableColumn };
