"use client";

import { useReactFlow } from "@xyflow/react";

import { useFlowValidation } from "@/features/workflows/hooks/use-flow-validation";
import { cn } from "@/lib/utils";

export const NodeCard = ({ children, nodeId, isSelected }) => {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const x = position.x + width / 2;
        const y = position.y + height / 2;

        if (x === undefined || y === undefined) return;

        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "bg-background flex w-[420px] border-separate cursor-pointer flex-col gap-1 rounded-md border-2 text-xs",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2",
      )}
    >
      {children}
    </div>
  );
};
