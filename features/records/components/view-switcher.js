"use client";

import {
  Check,
  ChevronsUpDown,
  EllipsisVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateViewModal } from "@/features/records/hooks/use-create-view-modal";
import { useDeleteViewModal } from "@/features/records/hooks/use-delete-view-modal";
import { useRenameViewModal } from "@/features/records/hooks/use-rename-view-modal";
import { cn } from "@/lib/utils";

export const ViewSwitcher = ({ views, viewId, currentFilters }) => {
  const objectType = views.find((view) => view.id === viewId).object.type;
  const [open, setOpen] = useState(false);
  const openCreateViewModal = useCreateViewModal((state) => state.onOpen);
  const openDeleteModal = useDeleteViewModal((state) => state.onOpen);
  const openRenameModal = useRenameViewModal((state) => state.onOpen);
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="w-fit max-w-[200px] justify-between truncate font-semibold"
        >
          {views.find((view) => view.id === viewId).name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[275px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search view..." />
          <CommandList>
            <CommandEmpty>No views found.</CommandEmpty>
            <CommandGroup>
              <div className="flex flex-col gap-1">
                {views.map((view) => (
                  <CommandItem
                    key={view.id}
                    value={view.name}
                    onSelect={() => {
                      setOpen(false);
                      router.push(
                        `/workspace/${workspaceId}/${view.object.slug}/view/${view.id}`,
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        viewId === view.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {view.name}
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="ml-auto"
                          variant="ghost"
                          size="xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openRenameModal(view);
                          }}
                        >
                          <Pencil className="h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(view);
                          }}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CommandItem>
                ))}
                <Separator />
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    openCreateViewModal({
                      workspaceId,
                      objectType,
                      currentFilters,
                    });
                  }}
                >
                  <Plus className="h-4 w-4" /> Create new view
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
