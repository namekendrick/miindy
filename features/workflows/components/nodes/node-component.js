import { Handle, Position } from "@xyflow/react";
import { memo } from "react";

import { NodeCard } from "@/features/workflows/components/nodes/node-card";
import { NodeHeader } from "@/features/workflows/components/nodes/node-header";
import { TASK_REGISTRY } from "@/features/workflows/constants/registry";

export const NodeComponent = memo((props) => {
  const nodeData = props.data;
  const task = TASK_REGISTRY[nodeData.type];

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      {!task.isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-muted-foreground !border-background !-left-2 !h-4 !w-4 !border-2"
        />
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-muted-foreground !border-background !-right-2 !h-4 !w-4 !border-2"
      />
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";
