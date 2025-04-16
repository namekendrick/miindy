"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { flexRender } from "@tanstack/react-table";
import { Plus, ChevronDown } from "lucide-react";
import { ClipLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterBuilder } from "@/features/records/components/filter-builder";
import { ViewSwitcher } from "@/features/records/components/view-switcher";
import { useRecordsTable } from "@/features/records/hooks/use-records-table";
import { RecordActionsModal } from "@/features/records/components/modals/record-actions-modal";

export const RecordsTable = ({ objectType, workspaceId, viewId, views }) => {
  const {
    recordsTable: table,
    isLoadingRecords,
    isSavingView,
    hasChanges,
    currentFilters,
    selectedRecords,
    visibleAttributes,
    saveExistingView,
    handleFiltersChange,
    handleOpenNewViewModal,
    sensors,
    handleDragEnd,
    draggableColumns,
    draggableColumnIds,
    recordTextAttributeId,
  } = useRecordsTable(objectType, workspaceId, viewId, views);

  if (isLoadingRecords || isSavingView) {
    return (
      <div className="mt-40 flex items-center justify-center gap-2">
        <ClipLoader size={20} /> Loading
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background flex items-center justify-between py-3 pr-2">
        <div className="flex items-center gap-2">
          <ViewSwitcher views={views} viewId={viewId} />
          <FilterBuilder
            attributes={visibleAttributes}
            onFiltersChange={(filters) => handleFiltersChange(filters)}
            currentFilters={currentFilters}
          />
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <div className="flex items-center">
              <Button
                size="sm"
                variant="outline"
                onClick={saveExistingView}
                className="gap-2 rounded-r-none border-r-0"
              >
                Save for everyone
              </Button>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-l-none px-2"
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNewViewModal();
                    }}
                  >
                    Save as new view
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button size="sm">
            <Plus className="size-4" /> Add Record
          </Button>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table
              className="min-w-full border-y"
              style={{ width: table.getTotalSize() }}
            >
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="h-10 w-fit"
                    style={{ position: "relative" }}
                  >
                    {headerGroup.headers
                      .filter((header) => header.id.includes("select"))
                      .map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="flex h-10 items-center"
                          style={{
                            position: "absolute",
                            left: header.getStart(),
                            width: header.getSize(),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    {recordTextAttributeId &&
                      headerGroup.headers
                        .filter((header) => header.id === recordTextAttributeId)
                        .map((header) => (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className="flex h-10 items-center overflow-hidden"
                            style={{
                              position: "absolute",
                              left: header.getStart(),
                              width: header.getSize(),
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                    <SortableContext
                      items={draggableColumnIds}
                      strategy={horizontalListSortingStrategy}
                    >
                      {draggableColumns.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="flex h-10 items-center overflow-hidden"
                          style={{
                            position: "absolute",
                            left: header.getStart(),
                            width: header.getSize(),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </SortableContext>
                    {headerGroup.headers
                      .filter((header) => header.id.includes("add-column"))
                      .map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="flex h-10 items-center"
                          style={{
                            position: "absolute",
                            left: header.getStart(),
                            width: header.getSize(),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="h-10 w-fit"
                      style={{ position: "relative" }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`h-10 ${
                            !cell.column.id.includes("select") &&
                            !cell.column.id.includes("add-column")
                              ? "border-r"
                              : ""
                          }`}
                          style={{
                            position: "absolute",
                            left: cell.column.getStart(),
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getHeaderGroups().length}
                      className="h-24 text-center"
                    >
                      No records.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
          <div className="fixed right-0 flex items-center space-x-2 px-2 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <RecordActionsModal
        workspaceId={workspaceId}
        records={selectedRecords}
        resetSelectedRecords={() => table.resetRowSelection()}
      />
    </div>
  );
};
