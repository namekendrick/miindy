"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { memo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ObjectSelectorComponent = ({
  objects,
  selectedObject,
  selectedObjectId,
  isLoading,
  onSelect,
  required = false,
  label = "Object",
  placeholder = "Select an object...",
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (objectId) => {
    onSelect(objectId);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>
        {label}{" "}
        {required && <span className="text-destructive font-normal">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !selectedObjectId && "text-muted-foreground",
            )}
          >
            {selectedObject ? selectedObject.plural : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search objects..." />
            <CommandEmpty>
              {isLoading ? "Loading..." : "No objects found."}
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {objects?.map((object) => (
                  <CommandItem
                    key={object.id}
                    value={object.plural}
                    onSelect={() => handleSelect(object.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedObjectId === object.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <span>{object.plural}</span>
                    <Badge variant="outline" className="ml-auto">
                      {object._count?.records || 0} records
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

ObjectSelectorComponent.displayName = "ObjectSelector";

export const ObjectSelector = memo(ObjectSelectorComponent);
