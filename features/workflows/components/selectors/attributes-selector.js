"use client";

import { ChevronsUpDown } from "lucide-react";
import { memo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const AttributesSelectorComponent = ({
  attributes,
  selectedAttributes,
  onToggle,
  searchTerm,
  onSearchChange,
  required = false,
  label = "Attributes",
  placeholder = "Select attributes...",
}) => {
  const [open, setOpen] = useState(false);

  const displayText =
    selectedAttributes.length > 0
      ? `${selectedAttributes.length} attribute${selectedAttributes.length > 1 ? "s" : ""} selected`
      : placeholder;

  const handleToggle = (attributeId) => onToggle(attributeId);

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              selectedAttributes.length === 0 && "text-muted-foreground",
            )}
          >
            {displayText}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search attributes..."
              value={searchTerm}
              onValueChange={onSearchChange}
            />
            <CommandEmpty>No attributes found.</CommandEmpty>
            <CommandList>
              <ScrollArea className="max-h-60">
                <CommandGroup>
                  {attributes.map((attribute) => (
                    <CommandItem
                      key={attribute.id}
                      value={attribute.id}
                      onSelect={() => handleToggle(attribute.id)}
                    >
                      <Checkbox
                        checked={selectedAttributes.includes(attribute.id)}
                        className="mr-2"
                      />
                      <span>{attribute.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {attribute.attributeType}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

AttributesSelectorComponent.displayName = "AttributesSelector";

export const AttributesSelector = memo(AttributesSelectorComponent);
