"use client";

import { useReactFlow } from "@xyflow/react";
import { ArrowLeft, Copy, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TASK_REGISTRY } from "@/features/workflows/constants/registry";
import { useFocusedNode } from "@/features/workflows/hooks/use-focused-node";
import { createFlowNode } from "@/features/workflows/utils/create-flow-node";
import { UpdateRecordConfig } from "@/features/workflows/components/update-record-config";

export const FocusedNodeConfig = () => {
  const { focusedNodeId, clearFocusedNode } = useFocusedNode();
  const { getNode, deleteElements, addNodes, updateNodeData } = useReactFlow();

  const node = focusedNodeId ? getNode(focusedNodeId) : null;

  if (!node) return null;

  const task = TASK_REGISTRY[node.data.type];

  const handleInputChange = (inputName, value) => {
    const currentInputs = node.data.inputs || {};
    updateNodeData(focusedNodeId, {
      inputs: {
        ...currentInputs,
        [inputName]: value,
      },
    });
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id: focusedNodeId }] });
    clearFocusedNode();
  };

  const handleDuplicate = () => {
    const newX = node.position.x;
    const newY = node.position.y + (node.measured?.height || 100) + 20;
    const newNode = createFlowNode(node.data.type, {
      x: newX,
      y: newY,
    });

    newNode.data.inputs = { ...node.data.inputs };
    newNode.selected = true;
    addNodes([newNode]);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mb-3 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFocusedNode}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft size={16} />
          </Button>
          <task.icon size={20} />
          <h3 className="text-sm font-semibold">{task.label}</h3>
          <div className="ml-auto">
            {task.isTrigger && (
              <Badge variant="secondary" className="text-xs">
                Trigger
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {task.credits} credits
            </Badge>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            className="flex-1"
          >
            <Copy size={14} className="mr-1" />
            Duplicate
          </Button>
          {!task.isTrigger && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive-foreground flex-1"
            >
              <Trash2 size={14} className="mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Custom configuration component */}
      {task.hasCustomConfig && (
        <div className="flex-1 overflow-auto p-4">
          <h4 className="mb-5 text-base font-semibold">Inputs</h4>
          {task.type === "UPDATE_RECORD" && (
            <UpdateRecordConfig nodeId={focusedNodeId} />
          )}
        </div>
      )}

      {/* Standard inputs section */}
      {!task.hasCustomConfig && task.inputs && task.inputs.length > 0 && (
        <div className="flex-1 overflow-auto p-4">
          <h4 className="mb-5 text-base font-semibold">Inputs</h4>
          <div className="space-y-6">
            {task.inputs.map((input) => {
              const currentValue = node.data.inputs?.[input.name] || "";

              return (
                <div key={input.name} className="space-y-2">
                  <Label htmlFor={input.name} className="text-sm font-normal">
                    {input.name}
                    {input.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                  <Input
                    id={input.name}
                    value={currentValue}
                    onChange={(e) =>
                      handleInputChange(input.name, e.target.value)
                    }
                    placeholder={
                      input.helperText || `Enter ${input.name.toLowerCase()}`
                    }
                    className="text-sm"
                    type={input.type === "NUMBER" ? "number" : "text"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No inputs message */}
      {!task.hasCustomConfig && (!task.inputs || task.inputs.length === 0) && (
        <div className="flex justify-center p-10">
          <p className="text-muted-foreground text-center text-sm">
            This node has no configurable inputs
          </p>
        </div>
      )}
    </div>
  );
};
