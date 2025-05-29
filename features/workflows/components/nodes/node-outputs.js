"use client";

import { Handle, Position } from "@xyflow/react";

import { COLOR_FOR_HANDLE } from "@/features/workflows/constants/common";
import { cn } from "@/lib/utils";

export const NodeOutputs = ({ children }) => {
  return <div className="flex flex-col gap-1 divide-y">{children}</div>;
};

export const NodeOutput = ({ output }) => {
  return (
    <div className="bg-secondary relative flex justify-end p-3">
      <p className="text-muted-foreground text-xs">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-background !-right-2 !h-4 !w-4 !border-2",
          COLOR_FOR_HANDLE[output.type],
        )}
      />
    </div>
  );
};
