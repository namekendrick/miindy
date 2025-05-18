"use client";

import { Check, Clipboard, Search, X } from "lucide-react";
import { useRef, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { AutoOpenCombobox } from "@/components/ui/combobox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AutoOpenDateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateRelatedRecord } from "@/features/records/api/use-create-related-record";
import { useDeleteRelatedRecord } from "@/features/records/api/use-delete-related-record";
import { useSearchRecords } from "@/features/records/api/use-search-records";
import { DisplayValue } from "@/features/records/components/display-value";
import { RelatedRecordBadge } from "@/features/records/components/related-record-badge";
import {
  handleSaveCell,
  shouldExitEditing,
  formatStatusOptions,
} from "@/features/records/utils/cell-helpers";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { cn } from "@/lib/utils";

export const EditableCell = ({ value, row, attribute, onSave }) => {
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const attributeType = attribute?.attributeType;

  const handleClickOutside = () => {
    if (shouldExitEditing(attributeType)) {
      if (editValue !== value) {
        handleSave();
      } else {
        setIsEditing(false);
      }
    }
  };

  const handleSave = () => {
    if (shouldExitEditing(attributeType)) {
      handleSaveCell(
        isEditing,
        onSave,
        row.original.id,
        attribute.id,
        editValue,
      );
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

  useOnClickOutside(isEditing ? inputRef : null, handleClickOutside);

  if (attributeType === "CHECKBOX") {
    return (
      <CheckboxCell
        value={value}
        onSave={onSave}
        recordId={row.original.id}
        attributeId={attribute.id}
        isReadOnly={attribute.isReadOnly}
      />
    );
  }

  if (!isEditing) {
    return (
      <ReadOnlyCell
        value={value}
        attribute={attribute}
        recordId={row.original.id}
        onSave={onSave}
        handleDoubleClick={handleDoubleClick}
        workspaceId={row.original.workspaceId}
      />
    );
  }

  // Editing state components based on attribute type
  switch (attributeType) {
    case "RELATIONSHIP":
    case "RECORD":
      return (
        <RelationshipCell
          recordId={row.original.id}
          attribute={attribute}
          workspaceId={row.original.workspaceId}
          setIsEditing={setIsEditing}
        />
      );

    case "STATUS":
      return (
        <StatusCell
          value={editValue}
          attribute={attribute}
          recordId={row.original.id}
          onSave={onSave}
          setIsEditing={setIsEditing}
        />
      );

    case "DATETIME":
      return (
        <DateTimeCell
          value={editValue}
          recordId={row.original.id}
          attributeId={attribute.id}
          onSave={onSave}
          setIsEditing={setIsEditing}
          setEditValue={setEditValue}
        />
      );

    case "NUMBER":
    case "CURRENCY":
    case "RATING":
      return (
        <NumberCell
          value={editValue}
          inputRef={inputRef}
          setEditValue={setEditValue}
          handleKeyDown={handleKeyDown}
        />
      );

    default:
      return (
        <TextCell
          value={editValue}
          inputRef={inputRef}
          setEditValue={setEditValue}
          handleKeyDown={handleKeyDown}
        />
      );
  }
};

const CheckboxCell = ({ value, onSave, recordId, attributeId, isReadOnly }) => (
  <div className="flex h-full items-center justify-center">
    <Checkbox
      checked={value === true || value === "true"}
      onCheckedChange={(checked) => {
        if (!isReadOnly) {
          onSave(recordId, attributeId, checked);
        }
      }}
    />
  </div>
);

const ReadOnlyCell = ({
  value,
  attribute,
  recordId,
  onSave,
  handleDoubleClick,
  workspaceId,
}) => (
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <div
        className="min-h-[24px] min-w-[1px] cursor-default overflow-hidden text-ellipsis whitespace-nowrap"
        onDoubleClick={handleDoubleClick}
      >
        <DisplayValue
          value={value}
          attribute={attribute}
          recordId={recordId}
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
        onClick={() => onSave(recordId, attribute.id, "")}
        disabled={attribute.isReadOnly}
      >
        <X className="mr-2 h-4 w-4" />
        Clear value
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);

const RelationshipCell = ({
  recordId,
  attribute,
  workspaceId,
  setIsEditing,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const relationshipType = attribute?.sourceRelationship?.relationshipType;
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
      enabled: !!searchTerm && !!targetObjectId,
    },
  );

  const handleSelectRecord = (relatedRecordId) => {
    createRelatedRecord.mutate(
      {
        recordId,
        relatedRecordId,
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

  return (
    <div>
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
                className="h-9 border-0 shadow-none select-text focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current selection(s)</h4>
              <RelatedRecordBadge
                recordId={recordId}
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
};

const StatusCell = ({ value, attribute, recordId, onSave, setIsEditing }) => {
  const statusOptions = attribute.config?.options || [];
  const formattedOptions = formatStatusOptions(
    statusOptions,
    attribute.isRequired,
  );

  return (
    <div className="absolute z-10">
      <AutoOpenCombobox
        options={formattedOptions}
        value={value}
        onChange={(newValue) => {
          onSave(recordId, attribute.id, newValue);
        }}
        placeholder="Select status"
        searchPlaceholder="Search status..."
        popoverClassName="w-[200px]"
        onClose={() => {
          setIsEditing(false);
        }}
        renderOption={(option, isSelected) => (
          <div className="flex items-center">
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                isSelected ? "opacity-100" : "opacity-0",
              )}
            />
            {option.value ? (
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: option.color,
                }}
              />
            ) : null}
            {option.label}
          </div>
        )}
      />
    </div>
  );
};

const DateTimeCell = ({
  value,
  recordId,
  attributeId,
  onSave,
  setIsEditing,
  setEditValue,
}) => (
  <div className="absolute z-10 rounded-md border bg-white shadow-lg select-none">
    <AutoOpenDateTimePicker
      date={value}
      setDate={(date) => {
        setEditValue(date);
        setTimeout(() => {
          onSave(recordId, attributeId, date);
          setIsEditing(false);
        }, 0);
      }}
      className="min-w-[300px] p-3"
      onClose={() => setIsEditing(false)}
    />
  </div>
);

const NumberCell = ({ value, inputRef, setEditValue, handleKeyDown }) => (
  <Input
    ref={inputRef}
    type="number"
    value={value || ""}
    onChange={(e) => setEditValue(e.target.value)}
    onKeyDown={handleKeyDown}
    className="h-fit w-full border-none p-0 shadow-none select-text focus-visible:ring-0"
    autoFocus
  />
);

const TextCell = ({ value, inputRef, setEditValue, handleKeyDown }) => (
  <Input
    ref={inputRef}
    type="text"
    value={value || ""}
    onChange={(e) => setEditValue(e.target.value)}
    onKeyDown={handleKeyDown}
    className="h-fit w-full border-none p-0 shadow-none select-text focus-visible:ring-0"
    autoFocus
  />
);
