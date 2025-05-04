import { Clipboard, Search, X } from "lucide-react";
import { useRef, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DisplayValue } from "@/features/records/components/display-value";
import { RelatedRecordBadge } from "@/features/records/components/related-record-badge";
import { useSearchRecords } from "@/features/records/api/use-search-records";
import { useCreateRelatedRecord } from "@/features/records/api/use-create-related-record";
import { useDeleteRelatedRecord } from "@/features/records/api/use-delete-related-record";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

export const EditableCell = ({ value, row, attribute, onSave }) => {
  const inputRef = useRef(null);
  const cellRef = useRef(null);
  const calendarRef = useRef(null);
  const popoverRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [searchTerm, setSearchTerm] = useState("");

  const attributeType = attribute?.attributeType;
  const relationshipType = attribute?.sourceRelationship?.relationshipType;
  const workspaceId = row.original.workspaceId;
  const targetObjectId =
    attribute?.sourceRelationship?.targetAttribute?.objectId;

  const createRelatedRecord = useCreateRelatedRecord();
  const deleteRelatedRecord = useDeleteRelatedRecord();

  const { data: searchResults, isLoading: searchLoading } = useSearchRecords(
    {
      objectId: targetObjectId,
      workspaceId,
      searchTerm,
    },
    {
      enabled:
        isEditing &&
        (attributeType === "RELATIONSHIP" || attributeType === "RECORD") &&
        !!searchTerm &&
        !!targetObjectId,
    },
  );

  const handleClickOutside = () => {
    if (
      ![attributeType === "RELATIONSHIP", attributeType === "RECORD"].includes(
        true,
      )
    ) {
      if (editValue !== value) {
        handleSave();
      } else {
        setIsEditing(false);
      }
    }
  };

  const handleSave = () => {
    if (isEditing) {
      if (
        ![
          attributeType === "RELATIONSHIP",
          attributeType === "RECORD",
        ].includes(true)
      ) {
        onSave(row.original.id, attribute.id, editValue);
      }
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditing && !attribute.isReadOnly) setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleSelectRecord = (recordId) => {
    createRelatedRecord.mutate(
      {
        recordId: row.original.id,
        relatedRecordId: recordId,
        attributeId: attribute.id,
      },
      {
        onSuccess: () => {
          if (
            relationshipType === "ONE_TO_ONE" ||
            relationshipType === "MANY_TO_ONE"
          ) {
            setIsEditing(false);
          } else {
            setSearchTerm("");
          }
        },
      },
    );
  };

  const handleDelete = (relationId) => {
    deleteRelatedRecord.mutate({ relationId });
  };

  useOnClickOutside(isEditing ? inputRef : null, handleClickOutside);

  if (attributeType === "CHECKBOX") {
    return (
      <div className="flex h-full items-center justify-center">
        <Checkbox
          checked={value === true || value === "true"}
          onCheckedChange={(checked) => {
            if (!attribute.isReadOnly) {
              onSave(row.original.id, attribute.id, checked);
            }
          }}
        />
      </div>
    );
  }

  if (!isEditing) {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            ref={cellRef}
            className="min-h-[24px] min-w-[1px] cursor-default overflow-hidden text-ellipsis whitespace-nowrap"
            onDoubleClick={handleDoubleClick}
          >
            <DisplayValue
              value={value}
              attribute={attribute}
              recordId={row.original.id}
              isEditing={isEditing}
              workspaceId={workspaceId}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-[200px]">
          <ContextMenuItem onClick={() => navigator.clipboard.writeText(value)}>
            <Clipboard className="mr-2 h-4 w-4" />
            Copy
          </ContextMenuItem>
          <Separator className="my-1" />
          <ContextMenuItem
            className="text-destructive"
            onClick={() => onSave(row.original.id, attribute.id, "")}
            disabled={attribute.isReadOnly}
          >
            <X className="mr-2 h-4 w-4" />
            Clear value
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  switch (attributeType) {
    case "RELATIONSHIP":
    case "RECORD":
      return (
        <div ref={popoverRef}>
          <Popover
            open={true}
            onOpenChange={(open) => !open && setIsEditing(false)}
          >
            <PopoverTrigger asChild>
              <div className="h-0 w-0"></div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="space-y-4 p-4">
                <div className="flex items-center rounded-md border">
                  <Search className="text-muted-foreground ml-2 h-4 w-4 shrink-0" />
                  <Input
                    placeholder="Search records..."
                    className="h-9 border-0 shadow-none focus-visible:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current selection(s)</h4>
                  <RelatedRecordBadge
                    recordId={row.original.id}
                    attribute={attribute}
                    isEditing={true}
                    handleDelete={handleDelete}
                  />
                </div>
                {searchTerm && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Results</h4>
                    {searchLoading ? (
                      <div className="p-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="mt-2 h-6 w-full" />
                      </div>
                    ) : (
                      <ScrollArea className="max-h-48">
                        <div className="space-y-1">
                          {searchResults?.map((record) => {
                            const recordTextAttributeId =
                              record.object.recordTextAttributeId;
                            const recordTextValue =
                              record.values.find(
                                (v) => v.attributeId === recordTextAttributeId,
                              )?.value?.value || "Unnamed record";

                            return (
                              <div
                                key={record.id}
                                className="hover:bg-muted cursor-pointer rounded-md px-2 py-1"
                                onClick={() => handleSelectRecord(record.id)}
                              >
                                {recordTextValue}
                              </div>
                            );
                          })}
                          {searchResults?.length === 0 && (
                            <div className="text-muted-foreground px-2 py-1 text-sm">
                              No records found
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );

    case "DATE":
      return (
        <div ref={calendarRef}>
          <Popover
            open={true}
            onOpenChange={(open) => !open && setIsEditing(false)}
          >
            <PopoverTrigger asChild>
              <div className="h-0 w-0"></div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={editValue ? new Date(editValue) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setEditValue(date.toISOString());
                    setTimeout(() => {
                      onSave(row.original.id, attribute.id, date.toISOString());
                      setIsEditing(false);
                    }, 0);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );

    case "NUMBER":
    case "CURRENCY":
    case "RATING":
      return (
        <Input
          ref={inputRef}
          type="number"
          value={editValue || ""}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-fit w-full border-none p-0 shadow-none focus-visible:ring-0"
          autoFocus
        />
      );

    default:
      return (
        <Input
          ref={inputRef}
          type="text"
          value={editValue || ""}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-fit w-full border-none p-0 shadow-none focus-visible:ring-0"
          autoFocus
        />
      );
  }
};
