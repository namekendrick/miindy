"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ViewActionButtons = ({
  resetFilters,
  saveViewConfiguration,
  handleOpenNewViewModal,
}) => (
  <div className="flex items-center gap-2">
    <Button size="sm" variant="ghost" onClick={resetFilters}>
      Reset
    </Button>
    <div className="flex items-center">
      <Button
        size="sm"
        variant="outline"
        onClick={saveViewConfiguration}
        className="gap-2 rounded-r-none border-r-0"
      >
        Save for everyone
      </Button>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="rounded-l-none px-2">
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenNewViewModal();
            }}
          >
            Save as new view
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);
