import { CopyIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useDeleteWorkflowModal } from "@/features/workflows/hooks/use-delete-workflow-modal";
import { useDuplicateWorkflowModal } from "@/features/workflows/hooks/use-duplicate-workflow-modal";

export const WorkflowActions = ({ workflow }) => {
  const openDeleteWorkflowModal = useDeleteWorkflowModal(
    (state) => state.onOpen,
  );
  const openDuplicateWorkflowModal = useDuplicateWorkflowModal(
    (state) => state.onOpen,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          <TooltipWrapper content={"More actions"}>
            <div className="flex h-full w-full items-center justify-center">
              <MoreVerticalIcon size={18} />
            </div>
          </TooltipWrapper>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={() => {
            openDuplicateWorkflowModal({ workflow });
          }}
        >
          <CopyIcon size={16} />
          Duplicate
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          className="text-destructive flex items-center gap-2"
          onSelect={() => {
            openDeleteWorkflowModal({ workflow });
          }}
        >
          <TrashIcon size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
