"use client";

import { CoinsIcon, GripVerticalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TASK_REGISTRY } from "@/features/workflows/constants/registry";

export const NodeHeader = ({ taskType }) => {
  const task = TASK_REGISTRY[taskType];

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex w-full items-center justify-between">
        <p className="text-muted-foreground text-xs font-bold uppercase">
          {task.label}
        </p>
        <div className="flex items-center gap-1">
          {task.isTrigger && <Badge>Trigger</Badge>}
          <Badge className="flex items-center gap-2 text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
