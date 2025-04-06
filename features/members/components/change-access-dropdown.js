"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { accessLevels } from "@/constants/access";
import { useMembersSettings } from "@/features/members/hooks/use-members-settings";
import { cn } from "@/lib/utils";

export const ChangeAccessDropdown = ({ member }) => {
  const [open, setOpen] = useState(false);

  const { updateMember } = useMembersSettings();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {member.workspaces[0].access
            ? accessLevels.find(
                (accessLevel) =>
                  accessLevel.value === member.workspaces[0].access,
              )?.label
            : "Select access level..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No access level found.</CommandEmpty>
            <CommandGroup>
              {accessLevels.map((accessLevel) => (
                <CommandItem
                  key={accessLevel.value}
                  value={accessLevel.value}
                  onSelect={(currentValue) => {
                    updateMember({
                      id: member.workspaces[0].id,
                      workspaceId: member.workspaces[0].workspaceId,
                      access: currentValue,
                    });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      member.workspaces[0].access === accessLevel.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {accessLevel.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
