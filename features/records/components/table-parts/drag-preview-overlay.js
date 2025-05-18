"use client";

import { DragOverlay } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

export const DragPreviewOverlay = ({ activeId, activeColumn }) => (
  <DragOverlay dropAnimation={null} modifiers={[]}>
    {activeId && activeColumn && (
      <div
        className="bg-background border-primary flex h-10 items-center rounded border-1 px-2 shadow-md"
        style={{
          width: activeColumn.getSize(),
          opacity: 0.9,
          pointerEvents: "none",
          zIndex: 100,
        }}
      >
        <div className="flex items-center gap-1">
          <GripVertical className="text-muted-foreground h-4 w-4" />
          <span className="truncate font-medium">
            {activeColumn?.column?.columnDef?.header
              ? activeColumn.column.columnDef.header({
                  column: activeColumn.column,
                  header: activeColumn,
                  getContext: () => ({}),
                }).props.attribute?.name || "Column"
              : "Column"}
          </span>
        </div>
      </div>
    )}
  </DragOverlay>
);
