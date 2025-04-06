"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useGetObjects } from "@/features/objects/api/use-get-objects";
import { columns } from "@/features/objects/components/columns";

export const useObjectsSettings = (workspaceId) => {
  const { data, isLoading: isLoadingObjects } = useGetObjects(workspaceId);

  const objectsTable = useReactTable({
    columns: columns(),
    getCoreRowModel: getCoreRowModel(),
    data,
  });

  return {
    objectsTable,
    isLoadingObjects,
  };
};
