"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";

import { RECORDS_PER_PAGE } from "@/constants/pagination";
import { useCreateAttributeModal } from "@/features/attributes/hooks/use-create-attribute-modal";
import { useCreateRecord } from "@/features/records/api/use-create-record";
import { useGetRecords } from "@/features/records/api/use-get-records";
import { useSaveView } from "@/features/records/api/use-save-view";
import { useUpdateValue } from "@/features/records/api/use-update-value";
import { columns } from "@/features/records/components/columns";
import { useNewViewModal } from "@/features/records/hooks/use-new-view-modal";

export const useRecordsTable = (objectType, workspaceId, viewId, views) => {
  const currentView = views.find((view) => view.id === viewId);
  const initialConfig = currentView.configuration;

  const { mutate: saveView, isPending: isSavingView } = useSaveView();
  const { mutate: updateValue } = useUpdateValue();
  const { mutate: createRecord, isPending: isCreatingRecord } =
    useCreateRecord();

  const openNewViewModal = useNewViewModal((state) => state.onOpen);
  const openCreateAttributeModal = useCreateAttributeModal(
    (state) => state.onOpen,
  );

  const [currentFilters, setCurrentFilters] = useState(initialConfig?.filters);
  const [currentSort, setCurrentSort] = useState(initialConfig?.sorts);
  const [columnSizing, setColumnSizing] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(
    initialConfig?.visibleColumns || [],
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pagesize: RECORDS_PER_PAGE,
  });

  const { data, isLoading: isLoadingRecords } = useGetRecords({
    objectType,
    workspaceId,
    viewId,
    page: pagination.pageIndex + 1,
  });

  const recordTextAttributeId =
    data?.paginated?.[0]?.object?.recordTextAttributeId;

  const handleRowSelectionChange = (newRowSelection) => {
    const updatedSelection =
      typeof newRowSelection === "function"
        ? newRowSelection(rowSelection)
        : newRowSelection;

    setRowSelection(updatedSelection);

    const selectedRowIds = Object.keys(updatedSelection).filter(
      (id) => updatedSelection[id],
    );

    if (selectedRowIds.length > 0 && data?.paginated) {
      const records = data.paginated.filter(
        (record, index) => updatedSelection[index],
      );

      setSelectedRecords([...records]);
    } else {
      setSelectedRecords([]);
    }
  };

  const handleFiltersChange = (filters) => {
    if (
      filters.length > 0 &&
      filters.every(
        (filter) => filter.attributeId && filter.operator && filter.value,
      )
    ) {
      setCurrentFilters(filters);
      setHasChanges(true);
    } else if (filters.length === 0) {
      setCurrentFilters(null);
      setHasChanges(true);
    }
  };

  const handleSortingChange = (sort) => {
    setCurrentSort(sort ?? null);
    setHasChanges(true);
  };

  const handleOpenNewViewModal = () => {
    openNewViewModal({
      viewId,
      workspaceId,
      objectType,
      page: pagination.pageIndex + 1,
      currentFilters,
      currentView,
    });
  };

  const handleAddRecord = () => {
    createRecord({
      objectType,
      workspaceId,
    });
  };

  const handleOpenCreateAttributeModal = () => {
    openCreateAttributeModal({ workspaceId, objectType, handleAddColumn });
  };

  const handleAddColumn = (attributeId) => {
    const highestPosition = visibleColumns?.length
      ? Math.max(...visibleColumns.map((col) => parseInt(col.position)))
      : -1;

    const updatedVisibleColumns = [
      ...visibleColumns,
      { id: attributeId, position: String(highestPosition + 1) },
    ];

    setVisibleColumns(updatedVisibleColumns);

    const baseConfig = {
      objectType,
      workspaceId,
      viewId,
      page: pagination.pageIndex + 1,
      configuration: {
        ...initialConfig,
        filters: currentFilters,
        sorts: currentSort,
        visibleColumns: updatedVisibleColumns,
      },
    };

    saveView(baseConfig);
  };

  const handleHideColumn = (attributeId) => {
    const updatedVisibleColumns = visibleColumns.filter(
      (col) => col.id !== attributeId,
    );

    setVisibleColumns(updatedVisibleColumns);

    const baseConfig = {
      objectType,
      workspaceId,
      viewId,
      page: pagination.pageIndex + 1,
      configuration: {
        ...initialConfig,
        filters: currentFilters,
        sorts: currentSort,
        visibleColumns: updatedVisibleColumns,
      },
    };

    saveView(baseConfig);
  };

  const handleReorderColumns = (activeIndex, overIndex) => {
    if (!visibleColumns || visibleColumns.length === 0) return;

    const sortedColumns = sortVisibleColumnsByPosition(visibleColumns);

    const reorderedColumns = [...sortedColumns];
    const movedItem = reorderedColumns.splice(activeIndex, 1)[0];
    reorderedColumns.splice(overIndex, 0, movedItem);

    const updatedColumns = reorderedColumns.map((col, index) => ({
      ...col,
      position: String(index),
    }));

    setVisibleColumns(updatedColumns);

    const baseConfig = {
      objectType,
      workspaceId,
      viewId,
      page: pagination.pageIndex + 1,
      configuration: {
        ...initialConfig,
        filters: currentFilters,
        sorts: currentSort,
        visibleColumns: updatedColumns,
      },
    };

    saveView(baseConfig);
  };

  const handleUpdateAttributeValue = (recordId, attributeId, value) => {
    updateValue({ recordId, attributeId, value });
  };

  const saveConfiguration = () => {
    const baseConfig = {
      objectType,
      workspaceId,
      viewId,
      page: pagination.pageIndex + 1,
      configuration: {
        ...initialConfig,
        filters: currentFilters,
        sorts: currentSort,
      },
    };

    saveView(baseConfig, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const saveExistingView = () => {
    saveConfiguration();
  };

  const sortVisibleColumnsByPosition = (columns) => {
    if (!columns?.length) return [];

    return [...columns].sort(
      (a, b) => parseInt(a.position) - parseInt(b.position),
    );
  };

  const getVisibleAttributes = () => {
    if (!data?.paginated?.[0]) return [];

    const firstRecord = data.paginated[0];
    const attributes = firstRecord.object.attributes;

    // Filter out archived attributes
    const activeAttributes = attributes.filter((attr) => !attr.isArchived);

    // Sort visibleColumns by position
    const sortedVisibleColumns = sortVisibleColumnsByPosition(visibleColumns);

    // Get ordered list of attribute IDs
    const orderedAttributeIds = sortedVisibleColumns.map((col) => col.id);

    return orderedAttributeIds
      .map((id) => activeAttributes.find((attr) => attr.id === id))
      .filter(Boolean)
      .map((attr) => ({
        id: attr.id,
        name: attr.name,
      }));
  };

  const recordsTable = useReactTable({
    columns: columns({
      data: data?.paginated,
      handleSortingChange,
      currentSort,
      visibleColumns: getVisibleAttributes(),
      handleAddColumn,
      handleHideColumn,
      handleOpenCreateAttributeModal,
      handleUpdateAttributeValue,
    }),
    manualPagination: true,
    data: data?.paginated,
    pageCount: data?.totalPages,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: setPagination,
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,
    defaultColumn: { minSize: 125, maxSize: 500 },
    state: { rowSelection, pagination, columnSizing },
  });

  const headerGroup = recordsTable.getHeaderGroups()[0];

  const draggableColumns = headerGroup.headers.filter(
    (header) =>
      !header.id.includes("select") &&
      !header.id.includes("add-column") &&
      header.id !== recordTextAttributeId,
  );

  const draggableColumnIds = draggableColumns.map((col) => col.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (
      active &&
      over &&
      active.id !== over.id &&
      draggableColumnIds.includes(active.id) &&
      draggableColumnIds.includes(over.id)
    ) {
      const activeIndex = draggableColumnIds.indexOf(active.id);
      const overIndex = draggableColumnIds.indexOf(over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        handleReorderColumns(activeIndex, overIndex);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  return {
    recordsTable,
    handleAddRecord,
    isCreatingRecord,
    isLoadingRecords,
    isSavingView,
    hasChanges,
    currentFilters,
    selectedRecords,
    visibleAttributes: getVisibleAttributes(),
    saveExistingView,
    handleFiltersChange,
    handleOpenNewViewModal,
    sensors,
    handleDragEnd,
    draggableColumns,
    draggableColumnIds,
    columnSizing,
    recordTextAttributeId,
  };
};
