import { memo } from "react";

import { NodeCard } from "@/features/workflows/components/nodes/node-card";
import { NodeHeader } from "@/features/workflows/components/nodes/node-header";
import {
  NodeInput,
  NodeInputs,
} from "@/features/workflows/components/nodes/node-inputs";
import {
  NodeOutput,
  NodeOutputs,
} from "@/features/workflows/components/nodes/node-outputs";
import { TASK_REGISTRY } from "@/features/workflows/constants/registry";

export const NodeComponent = memo((props) => {
  const nodeData = props.data;
  const task = TASK_REGISTRY[nodeData.type];

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={props.id} />
        ))}
      </NodeInputs>

      <NodeOutputs>
        {task.outputs.map((output) => (
          <NodeOutput key={output.name} output={output} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";
