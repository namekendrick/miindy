"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState, useEffect, useCallback, useRef } from "react";

import { RECORDS_PER_PAGE } from "@/constants/pagination";
import { useCreateAttributeModal } from "@/features/attributes/hooks/use-create-attribute-modal";
import { useCreateRecord } from "@/features/records/api/use-create-record";
import { useGetRecords } from "@/features/records/api/use-get-records";
import { useSaveView } from "@/features/records/api/use-save-view";
import { useUpdateValue } from "@/features/records/api/use-update-value";
import { columns } from "@/features/records/components/columns";
import { useNewViewModal } from "@/features/records/hooks/use-new-view-modal";
import {
  getDraggableColumns,
  reorderColumns,
} from "@/features/records/utils/drag-drop-helpers";
import {
  filterVisibleAttributes,
  createInitialFilterGroup,
  getAttributesFromFirstRecord,
} from "@/features/records/utils/table-helpers";

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

  const [currentSort, setCurrentSort] = useState(initialConfig?.sorts);
  const [columnSizing, setColumnSizing] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(
    initialConfig?.visibleColumns || [],
  );
  const [currentFilters, setCurrentFilters] = useState(() => {
    if (initialConfig?.filters && initialConfig.filters.type === "group") {
      return initialConfig.filters;
    }
    return createInitialFilterGroup();
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pagesize: RECORDS_PER_PAGE,
  });
  const [dragOverId, setDragOverId] = useState(null);
  const dragOverRef = useRef(null);

  const { data, isLoading: isLoadingRecords } = useGetRecords({
    objectType,
    workspaceId,
    viewId,
    page: pagination.pageIndex + 1,
    filters: currentFilters,
  });

  const recordTextAttributeId =
    data?.paginated?.[0]?.object?.recordTextAttributeId;

  const handleRowSelectionChange = (newRowSelection) => {
    const updatedSelection =
      typeof newRowSelection === "function"
        ? newRowSelection(rowSelection)
        : newRowSelection;

    setRowSelection(updatedSelection);

    if (!data?.paginated) {
      setSelectedRecords([]);
      return;
    }

    const selectedRowIds = Object.keys(updatedSelection).filter(
      (id) => updatedSelection[id],
    );

    if (selectedRowIds.length === 0) {
      setSelectedRecords([]);
      return;
    }

    const records = data.paginated.filter(
      (record, index) => updatedSelection[index],
    );

    setSelectedRecords([...records]);
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
      currentView: {
        ...currentView,
        configuration: {
          ...currentView.configuration,
          filters: currentFilters,
        },
      },
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

    saveViewConfiguration({
      visibleColumns: updatedVisibleColumns,
    });
  };

  const handleHideColumn = (attributeId) => {
    const updatedVisibleColumns = visibleColumns.filter(
      (col) => col.id !== attributeId,
    );

    setVisibleColumns(updatedVisibleColumns);

    saveViewConfiguration({
      visibleColumns: updatedVisibleColumns,
    });
  };

  const handleUpdateAttributeValue = (recordId, attributeId, value) => {
    updateValue({ recordId, attributeId, value });
  };

  const updateViewState = (updates) => {
    if (updates.sorts !== undefined) {
      setCurrentSort(updates.sorts);
    }

    if (updates.filters !== undefined) {
      if (updates.filters.type === "group") {
        setCurrentFilters(updates.filters);
      }
    }

    if (updates.visibleColumns !== undefined) {
      setVisibleColumns(updates.visibleColumns);
    }

    if (!updates.skipChangeTracking) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  };

  const saveViewConfiguration = (customConfig = {}) => {
    const baseConfig = {
      objectType,
      workspaceId,
      viewId,
      page: pagination.pageIndex + 1,
      configuration: {
        filters: currentFilters,
        sorts: currentSort,
        visibleColumns,
        ...customConfig,
      },
    };

    saveView(baseConfig, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const getVisibleAttributes = () => {
    if (!data?.paginated?.[0]) return [];

    const attributes = getAttributesFromFirstRecord(data.paginated);
    return filterVisibleAttributes(attributes, visibleColumns);
  };

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;

    if (!over || !active) {
      if (dragOverRef.current !== null) {
        dragOverRef.current = null;
        setDragOverId(null);
      }
      return;
    }

    if (over.id !== dragOverRef.current) {
      dragOverRef.current = over.id;

      requestAnimationFrame(() => {
        if (over.id === dragOverRef.current) {
          setDragOverId(over.id);
        }
      });
    }
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      setDragOverId(null);

      const { active, over } = event;

      if (!active || !over) return;
      if (active.id === over.id) return;

      const headerGroup = recordsTable.getHeaderGroups()[0];
      const draggableColumns = getDraggableColumns(
        headerGroup.headers,
        recordTextAttributeId,
      );
      const draggableColumnIds = draggableColumns.map((col) => col.id);

      if (
        !draggableColumnIds.includes(active.id) ||
        !draggableColumnIds.includes(over.id)
      )
        return;

      const updatedColumns = reorderColumns(visibleColumns, active.id, over.id);

      if (!updatedColumns) return;

      setVisibleColumns(updatedColumns);
      saveViewConfiguration({ visibleColumns: updatedColumns });
    },
    [visibleColumns, saveView, recordTextAttributeId],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        tolerance: 5,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor),
  );

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
    data: data?.paginated || [],
    pageCount: data?.totalPages || 0,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: setPagination,
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,
    defaultColumn: { minSize: 125, maxSize: 500 },
    state: { rowSelection, pagination, columnSizing },
  });

  const headerGroup = recordsTable.getHeaderGroups()[0];

  const draggableColumns = getDraggableColumns(
    headerGroup.headers,
    recordTextAttributeId,
  );

  const draggableColumnIds = draggableColumns.map((col) => col.id);

  // Update state when view changes
  useEffect(() => {
    if (!viewId || !views || views.length === 0) return;

    const updatedView = views.find((view) => view.id === viewId);
    if (!updatedView) return;

    // Update filters
    if (updatedView?.configuration?.filters) {
      if (updatedView.configuration.filters.type === "group") {
        setCurrentFilters(updatedView.configuration.filters);
      } else {
        console.warn(
          "Invalid filter structure in view configuration:",
          updatedView.configuration.filters,
        );
      }
    } else {
      setCurrentFilters(createInitialFilterGroup());
    }

    if (updatedView?.configuration?.visibleColumns) {
      setVisibleColumns(updatedView.configuration.visibleColumns);
    }

    setHasChanges(false);
  }, [viewId, views, objectType]);

  return {
    recordsTable,
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
    setDragOverId,
    draggableColumns,
    draggableColumnIds,
    columnSizing,
    recordTextAttributeId,
    updateViewState,
  };
};
