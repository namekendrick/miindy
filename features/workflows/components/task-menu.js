"use client";

import { CoinsIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FocusedNodeConfig } from "@/features/workflows/components/focused-node-config";
import { TASK_REGISTRY } from "@/features/workflows/constants/registry";
import { useFocusedNode } from "@/features/workflows/hooks/use-focused-node";

export const TaskMenu = () => {
  const { focusedNodeId } = useFocusedNode();

  return (
    <aside className="h-full w-[340px] max-w-[340px] min-w-[340px] border-separate overflow-auto border-r-2">
      {focusedNodeId ? (
        <FocusedNodeConfig />
      ) : (
        <div className="p-2 px-4">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["triggers", "blocks"]}
          >
            <AccordionItem value="triggers">
              <AccordionTrigger className="font-bold">
                Triggers
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1">
                <TaskMenuBtn taskType="MANUALLY_RUN" />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="blocks">
              <AccordionTrigger className="font-bold">Blocks</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1">
                <TaskMenuBtn taskType="RANDOM_NUMBER" />
                <TaskMenuBtn taskType="UPDATE_RECORD" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </aside>
  );
};

const TaskMenuBtn = ({ taskType }) => {
  const task = TASK_REGISTRY[taskType];

  const onDragStart = (event) => {
    event.dataTransfer.setData("application/reactflow", taskType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant={"secondary"}
      className="flex w-full items-center justify-between gap-2 border"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
      <Badge className="flex items-center gap-2" variant={"outline"}>
        <CoinsIcon size={16} />
        {task.credits}
      </Badge>
    </Button>
  );
};
