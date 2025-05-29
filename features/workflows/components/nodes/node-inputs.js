import { Handle, Position, useEdges } from "@xyflow/react";

import { NodeParamField } from "@/features/workflows/components/nodes/node-param-field";
import { COLOR_FOR_HANDLE } from "@/features/workflows/constants/common";
import { useFlowValidation } from "@/features/workflows/hooks/use-flow-validation";
import { cn } from "@/lib/utils";

export const NodeInputs = ({ children }) => {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>;
};

export const NodeInput = ({ input, nodeId }) => {
  const { invalidInputs } = useFlowValidation();
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name,
  );
  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);

  return (
    <div
      className={cn(
        "bg-secondary relative flex w-full justify-start p-3",
        hasErrors && "bg-destructive/30",
      )}
    >
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-background !-left-2 !h-4 !w-4 !border-2",
            COLOR_FOR_HANDLE[input.type],
          )}
        />
      )}
    </div>
  );
};
