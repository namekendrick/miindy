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
import { TASK_REGISTRY } from "@/features/workflows/constants/registry";

export const TaskMenu = () => {
  return (
    <aside className="h-full w-[340px] max-w-[340px] min-w-[340px] border-separate overflow-auto border-r-2 p-2 px-4">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "extraction",
          "interactions",
          "timing",
          "results",
          "storage",
        ]}
      >
        <AccordionItem value="interactions">
          <AccordionTrigger className="font-bold">
            User interactions
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType="NAVIGATE_URL" />
            <TaskMenuBtn taskType="FILL_INPUT" />
            <TaskMenuBtn taskType="CLICK_ELEMENT" />
            <TaskMenuBtn taskType="SCROLL_TO_ELEMENT" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType="PAGE_TO_HTML" />
            <TaskMenuBtn taskType="EXTRACT_TEXT_FROM_ELEMENT" />
            <TaskMenuBtn taskType="EXTRACT_DATA_WITH_AI" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="storage">
          <AccordionTrigger className="font-bold">
            Data storage
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType="READ_PROPERTY_FROM_JSON" />
            <TaskMenuBtn taskType="ADD_PROPERTY_TO_JSON" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="timing">
          <AccordionTrigger className="font-bold">
            Timing controls
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType="WAIT_FOR_ELEMENT" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="results">
          <AccordionTrigger className="font-bold">
            Result delivery
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType="DELIVER_VIA_WEBHOOK" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
