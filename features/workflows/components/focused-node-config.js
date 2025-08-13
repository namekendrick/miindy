"use client";

import { useReactFlow } from "@xyflow/react";
import { ArrowLeft, Copy, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CONFIG_REGISTRY,
  TASK_REGISTRY,
} from "@/features/workflows/constants/registry";
import { useFocusedNode } from "@/features/workflows/hooks/use-focused-node";
import { createFlowNode } from "@/features/workflows/utils/create-flow-node";

export const FocusedNodeConfig = () => {
  const { focusedNodeId, clearFocusedNode } = useFocusedNode();
  const { getNode, deleteElements, addNodes } = useReactFlow();

  const node = focusedNodeId ? getNode(focusedNodeId) : null;

  if (!node) return null;

  const task = TASK_REGISTRY[node.data.type];
  const ConfigComponent = CONFIG_REGISTRY[node.data.type];

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

      {/* Configuration component */}
      <div className="flex-1 overflow-auto p-4">
        {ConfigComponent ? (
          <>
            {!task.isTrigger && (
              <h4 className="mb-5 text-base font-semibold">Inputs</h4>
            )}
            <ConfigComponent nodeId={focusedNodeId} />
          </>
        ) : (
          <div className="flex justify-center p-10">
            <p className="text-muted-foreground text-center text-sm">
              Configuration component not found for {task.label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
