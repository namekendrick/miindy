"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { memo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const RecordSelectorComponent = ({
  records,
  selectedRecordId,
  selectedRecordDisplayName,
  isLoading,
  onSelect,
  searchTerm,
  onSearchChange,
  required = false,
  label = "Record",
  placeholder = "Select a record...",
  getRecordDisplayName = (record) => `Record ${record.id}`,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (recordId) => {
    onSelect(recordId);
    setOpen(false);
  };

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
              !selectedRecordId && "text-muted-foreground",
            )}
          >
            {selectedRecordId ? selectedRecordDisplayName : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search records..."
                className="placeholder:text-muted-foreground flex h-11 w-full border-0 bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <CommandEmpty>
              {isLoading ? "Searching..." : "No records found."}
            </CommandEmpty>
            <CommandList>
              <ScrollArea className="max-h-60">
                <CommandGroup>
                  {records?.map((record) => (
                    <CommandItem
                      key={record.id}
                      value={record.id}
                      onSelect={() => handleSelect(record.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRecordId === record.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {getRecordDisplayName(record)}
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

RecordSelectorComponent.displayName = "RecordSelector";

export const RecordSelector = memo(RecordSelectorComponent);
