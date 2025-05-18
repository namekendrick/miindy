import { ChevronsUpDown, Check } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRecord } from "@/features/records/api/use-get-record";
import { useSearchRecords } from "@/features/records/api/use-search-records";
import { cn } from "@/lib/utils";

export const RelationshipValueInput = ({
  selectedAttribute,
  value,
  onChange,
  validationError,
  workspaceId,
}) => {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const targetObjectId =
    selectedAttribute?.sourceRelationship?.targetAttribute?.object?.id;

  const { data: recordOptions, isLoading: isSearching } = useSearchRecords(
    {
      objectId: targetObjectId,
      workspaceId: workspaceId,
      searchTerm: searchTerm,
    },
    {
      enabled: comboboxOpen,
    },
  );

  const { data: selectedRecord, isLoading: isLoadingSelected } = useGetRecord({
    id: value,
    workspaceId: workspaceId,
  });

  const formattedRecordOptions = useMemo(() => {
    const options = [];

    if (recordOptions) {
      options.push(
        ...recordOptions.map((record) => {
          const recordTextAttributeId = record.object.recordTextAttributeId;
          const recordTextValue =
            record.values.find((v) => v.attributeId === recordTextAttributeId)
              ?.value?.value || "Unnamed record";
          return {
            label: recordTextValue,
            value: record.id,
          };
        }),
      );
    }

    if (
      selectedRecord &&
      !options.some((opt) => opt.value === selectedRecord.id)
    ) {
      const recordTextAttributeId = selectedRecord.object.recordTextAttributeId;
      const recordTextValue =
        selectedRecord.values.find(
          (v) => v.attributeId === recordTextAttributeId,
        )?.value?.value || "Unnamed record";
      options.push({
        label: recordTextValue,
        value: selectedRecord.id,
      });
    }

    return options;
  }, [recordOptions, selectedRecord]);

  return (
    <div className="w-[180px]">
      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between truncate",
              !value && "text-muted-foreground",
              validationError && "border-red-500",
            )}
          >
            {value
              ? formattedRecordOptions.find((opt) => opt.value === value)
                  ?.label ||
                (isLoadingSelected ? "Loading..." : "Select record...")
              : "Select record..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search records..."
              value={searchTerm}
              onValueChange={(value) => setSearchTerm(value)}
              autoFocus
            />
            <CommandEmpty>
              {isSearching ? "Searching..." : "No records found"}
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {formattedRecordOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setComboboxOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isSearching && (
        <div className="absolute z-20 mt-1 w-[250px] rounded-md border bg-white p-2 shadow-lg">
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-3/5" />
          </div>
        </div>
      )}
    </div>
  );
};
