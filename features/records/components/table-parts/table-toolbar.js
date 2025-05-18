"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ViewSwitcher } from "@/features/records/components/view-switcher";

export const TableToolbar = ({
  views,
  viewId,
  handleAddRecord,
  isCreatingRecord,
  currentFilters,
}) => (
  <div className="bg-background flex items-center justify-between py-2 pr-2">
    <div className="flex items-center gap-2">
      <ViewSwitcher
        views={views}
        viewId={viewId}
        currentFilters={currentFilters}
      />
    </div>
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={handleAddRecord} disabled={isCreatingRecord}>
        <Plus className="size-4" /> Add Record
      </Button>
    </div>
  </div>
);
