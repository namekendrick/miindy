"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { flexRender } from "@tanstack/react-table";
import { useState, useCallback, useEffect } from "react";

import { LoadingIndicator } from "@/components/loading-indicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetObjectAttributes } from "@/features/records/api/use-get-object-attributes";
import { RecordActionsModal } from "@/features/records/components/modals/record-actions-modal";
import { DragPreviewOverlay } from "@/features/records/components/table-parts/drag-preview-overlay";
import { FilterToolbar } from "@/features/records/components/table-parts/filter-toolbar";
import { TableToolbar } from "@/features/records/components/table-parts/table-toolbar";
import { useRecordActionsModal } from "@/features/records/hooks/use-record-actions-modal";
import { useRecordsTable } from "@/features/records/hooks/use-records-table";
import { handleFilterChange } from "@/features/records/utils/table-helpers";
import { useFilter } from "@/features/views/hooks/use-filter";

export const RecordsTable = ({ objectType, workspaceId, viewId, views }) => {
  const currentView = views.find((view) => view.id === viewId);

  const [activeId, setActiveId] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const { onOpen, onClose } = useRecordActionsModal();

  const {
    recordsTable: table,
    handleAddRecord,
    isCreatingRecord,
    isLoadingRecords,
    isSavingView,
    hasChanges,
    selectedRecords,
    saveViewConfiguration,
    handleOpenNewViewModal,
    sensors,
    handleDragEnd,
    handleDragOver,
    dragOverId,
    draggableColumns,
    draggableColumnIds,
    recordTextAttributeId,
    updateViewState,
  } = useRecordsTable(objectType, workspaceId, viewId, views);

  useEffect(() => {
    if (selectedRecords.length > 0) {
      onOpen();
    } else {
      onClose();
    }
  }, [selectedRecords.length, onOpen, onClose]);

  const { data: attributesData, isLoading: isLoadingAttributes } =
    useGetObjectAttributes(workspaceId, objectType);

  const allAttributes = attributesData?.attributes || [];

  const {
    filters,
    filterCount,
    isFilterOpen,
    setIsFilterOpen,
    addRule,
    addGroup,
    updateRule,
    deleteRule,
    deleteGroup,
    updateGroupOperator,
    applyCurrentFilters,
    resetFilters,
    isFormValid,
    clearAllFilters,
  } = useFilter({
    onFilterChange: (filters, markAsChanged = true) =>
      handleFilterChange(filters, updateViewState, markAsChanged),
    initialFilters: currentView?.configuration?.filters || null,
  });

  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      if (!active) return;

      requestAnimationFrame(() => {
        setActiveId(active.id);

        const column = draggableColumns.find(
          (header) => header.id === active.id,
        );
        if (column) {
          setActiveColumn(column);
        }
      });
    },
    [draggableColumns],
  );

  const handleDragEndWrapper = useCallback(
    (event) => {
      setActiveId(null);
      handleDragEnd(event);
    },
    [handleDragEnd],
  );

  if (isLoadingRecords || isSavingView || isLoadingAttributes) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex h-full flex-col select-none">
      <TableToolbar
        views={views}
        viewId={viewId}
        handleAddRecord={handleAddRecord}
        isCreatingRecord={isCreatingRecord}
        currentFilters={filters}
      />
      <FilterToolbar
        filters={filters}
        filterCount={filterCount}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        allAttributes={allAttributes}
        addRule={addRule}
        addGroup={addGroup}
        updateRule={updateRule}
        deleteRule={deleteRule}
        deleteGroup={deleteGroup}
        updateGroupOperator={updateGroupOperator}
        applyCurrentFilters={applyCurrentFilters}
        resetFilters={resetFilters}
        isFormValid={isFormValid}
        clearAllFilters={clearAllFilters}
        hasChanges={hasChanges}
        saveViewConfiguration={saveViewConfiguration}
        handleOpenNewViewModal={handleOpenNewViewModal}
        workspaceId={workspaceId}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="absolute inset-0 flex h-full flex-col overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndWrapper}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            autoScroll={false}
          >
            <Table
              className="h-full min-w-full border-y"
              style={{ width: table.getTotalSize(), minHeight: "100%" }}
            >
              <TableHeader>
                {renderTableHeader(
                  table,
                  recordTextAttributeId,
                  draggableColumnIds,
                  draggableColumns,
                  dragOverId,
                )}
              </TableHeader>
              <TableBody className="flex-1">{renderTableBody(table)}</TableBody>
            </Table>
            <DragPreviewOverlay
              activeId={activeId}
              activeColumn={activeColumn}
            />
          </DndContext>
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

const renderTableHeader = (
  table,
  recordTextAttributeId,
  draggableColumnIds,
  draggableColumns,
  dragOverId,
) =>
  table.getHeaderGroups().map((headerGroup) => (
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
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      {recordTextAttributeId &&
        headerGroup.headers
          .filter((header) => header.id === recordTextAttributeId)
          .map((header) => (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className="flex h-10 items-center overflow-hidden pr-0"
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
        {draggableColumns.map((header) => {
          const isOver = dragOverId === header.id;

          const headStyle = {
            position: "absolute",
            left: header.getStart(),
            width: header.getSize(),
            zIndex: 1,
          };

          const headClasses = "flex h-10 items-center overflow-hidden";

          return (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className={headClasses + " p-0"}
              style={headStyle}
            >
              {isOver && (
                <div
                  className="border-primary bg-primary/10 pointer-events-none absolute inset-0 border-l-1 border-dashed"
                  aria-hidden="true"
                />
              )}

              {!header.isPlaceholder &&
                flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          );
        })}
      </SortableContext>
      {headerGroup.headers
        .filter((header) => header.id.includes("add-column"))
        .map((header) => (
          <TableHead
            key={header.id}
            colSpan={header.colSpan}
            className="flex h-10 items-center p-0"
            style={{
              position: "absolute",
              left: header.getStart(),
              width: header.getSize(),
            }}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
    </TableRow>
  ));

const renderTableBody = (table) => {
  if (!table.getRowModel().rows?.length) {
    return (
      <TableRow>
        <TableCell
          colSpan={table.getHeaderGroups().length}
          className="h-24 text-center"
        >
          No records.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {table.getRowModel().rows.map((row) => (
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
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
      <TableRow
        className="flex-1"
        style={{ height: "calc(100% - 40px)" }}
      ></TableRow>
    </>
  );
};
