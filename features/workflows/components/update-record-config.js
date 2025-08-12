"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetObjects } from "@/features/objects/api/use-get-objects";
import { useSearchRecords } from "@/features/records/api/use-search-records";
import { useGetRecord } from "@/features/records/api/use-get-record";
import { useGetObjectAttributes } from "@/features/workflows/api/use-get-object-attributes";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const UpdateRecordConfig = ({ nodeId }) => {
  const workspaceId = useWorkspaceId();
  const { getNode, updateNodeData } = useReactFlow();
  const node = getNode(nodeId);

  const [objectOpen, setObjectOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [attributesOpen, setAttributesOpen] = useState(false);
  const [recordSearchTerm, setRecordSearchTerm] = useState("");
  const [attributeSearchTerm, setAttributeSearchTerm] = useState("");

  const selectedObjectId = node?.data?.inputs?.Object || null;
  const selectedRecordId = node?.data?.inputs?.Record || null;
  const selectedAttributes = node?.data?.inputs?.Attributes || [];

  // Fetch objects
  const { data: objects, isLoading: objectsLoading } =
    useGetObjects(workspaceId);

  // Get selected object details
  const selectedObject = useMemo(() => {
    if (!objects || !selectedObjectId) return null;
    return objects.find((obj) => obj.id === selectedObjectId);
  }, [objects, selectedObjectId]);

  // Fetch records for selected object
  const { data: searchResults, isLoading: recordsLoading } = useSearchRecords(
    {
      objectId: selectedObjectId,
      workspaceId: workspaceId,
      searchTerm: recordSearchTerm,
    },
    {
      enabled: !!selectedObjectId && recordOpen,
    },
  );

  // Fetch selected record details
  const { data: selectedRecord } = useGetRecord({
    id: selectedRecordId,
    workspaceId: workspaceId,
  });

  // Fetch attributes for selected object
  const { data: attributesData } = useGetObjectAttributes(
    workspaceId,
    selectedObject?.type,
    {
      enabled: !!selectedObject?.type,
    },
  );

  const attributes = attributesData?.attributes || [];

  // Filter attributes based on search
  const filteredAttributes = useMemo(() => {
    if (!attributeSearchTerm) return attributes;
    return attributes.filter((attr) =>
      attr.name.toLowerCase().includes(attributeSearchTerm.toLowerCase()),
    );
  }, [attributes, attributeSearchTerm]);

  // Update node data helper
  const updateInputs = (key, value) => {
    const currentInputs = node.data.inputs || {};
    updateNodeData(nodeId, {
      ...node.data,
      inputs: {
        ...currentInputs,
        [key]: value,
      },
    });
  };

  // Handle object selection
  const handleObjectSelect = (objectId) => {
    // Update all inputs at once to avoid race conditions
    const currentInputs = node.data.inputs || {};
    updateNodeData(nodeId, {
      ...node.data,
      inputs: {
        ...currentInputs,
        Object: objectId,
        Record: null,
        Attributes: [],
      },
    });
    setRecordSearchTerm("");
  };

  // Handle record selection
  const handleRecordSelect = (recordId) => {
    updateInputs("Record", recordId);
  };

  // Handle attribute toggle
  const handleAttributeToggle = (attributeId) => {
    const newAttributes = selectedAttributes.includes(attributeId)
      ? selectedAttributes.filter((id) => id !== attributeId)
      : [...selectedAttributes, attributeId];
    updateInputs("Attributes", newAttributes);
  };

  // Handle attribute value change
  const handleAttributeValueChange = (attributeId, value) => {
    updateInputs(`attribute_${attributeId}`, value);
  };

  // Get display name for record
  const getRecordDisplayName = (record) => {
    if (!record) return "Unnamed record";

    const recordTextAttributeId = record.object?.recordTextAttributeId;
    if (!recordTextAttributeId) return `Record ${record.id}`;

    const textValue = record.values?.find(
      (v) => v.attributeId === recordTextAttributeId,
    )?.value?.value;

    return textValue || `Record ${record.id}`;
  };

  // Get display name for search result
  const getSearchResultDisplayName = (record) => {
    const recordTextAttributeId = record.object?.recordTextAttributeId;
    if (!recordTextAttributeId) return `Record ${record.id}`;

    const textValue = record.values?.find(
      (v) => v.attributeId === recordTextAttributeId,
    )?.value?.value;

    return textValue || `Record ${record.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Object Selection */}
      <div className="space-y-2">
        <Label>
          Object <span className="text-destructive">*</span>
        </Label>
        <Popover open={objectOpen} onOpenChange={setObjectOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={objectOpen}
              className={cn(
                "w-full justify-between",
                !selectedObjectId && "text-muted-foreground",
              )}
            >
              {selectedObject ? selectedObject.plural : "Select an object..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search objects..." />
              <CommandEmpty>
                {objectsLoading ? "Loading..." : "No objects found."}
              </CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {objects?.map((object) => (
                    <CommandItem
                      key={object.id}
                      value={object.plural}
                      onSelect={() => {
                        handleObjectSelect(object.id);
                        setObjectOpen(false);
                      }}
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

      {/* Record Selection */}
      {selectedObjectId && (
        <div className="space-y-2">
          <Label>
            Record <span className="text-destructive">*</span>
          </Label>
          <Popover open={recordOpen} onOpenChange={setRecordOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={recordOpen}
                className={cn(
                  "w-full justify-between",
                  !selectedRecordId && "text-muted-foreground",
                )}
              >
                {selectedRecordId
                  ? getRecordDisplayName(selectedRecord)
                  : "Select a record..."}
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
                    value={recordSearchTerm}
                    onChange={(e) => setRecordSearchTerm(e.target.value)}
                  />
                </div>
                <CommandEmpty>
                  {recordsLoading ? "Searching..." : "No records found."}
                </CommandEmpty>
                <CommandList>
                  <ScrollArea className="max-h-60">
                    <CommandGroup>
                      {searchResults?.map((record) => (
                        <CommandItem
                          key={record.id}
                          value={record.id}
                          onSelect={() => {
                            handleRecordSelect(record.id);
                            setRecordOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedRecordId === record.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {getSearchResultDisplayName(record)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Attributes Selection */}
      {selectedObjectId && selectedRecordId && (
        <div className="space-y-2">
          <Label>
            Attributes to update <span className="text-destructive">*</span>
          </Label>
          <Popover open={attributesOpen} onOpenChange={setAttributesOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={attributesOpen}
                className={cn(
                  "w-full justify-between",
                  selectedAttributes.length === 0 && "text-muted-foreground",
                )}
              >
                {selectedAttributes.length > 0
                  ? `${selectedAttributes.length} attribute${selectedAttributes.length > 1 ? "s" : ""} selected`
                  : "Select attributes..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search attributes..."
                  value={attributeSearchTerm}
                  onValueChange={setAttributeSearchTerm}
                />
                <CommandEmpty>No attributes found.</CommandEmpty>
                <CommandList>
                  <ScrollArea className="max-h-60">
                    <CommandGroup>
                      {filteredAttributes.map((attribute) => (
                        <CommandItem
                          key={attribute.id}
                          value={attribute.id}
                          onSelect={() => handleAttributeToggle(attribute.id)}
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
      )}

      {/* Dynamic Attribute Inputs */}
      {selectedAttributes.length > 0 && (
        <div className="space-y-4">
          <Label>Attribute Values</Label>
          {selectedAttributes.map((attrId) => {
            const attribute = attributes.find((a) => a.id === attrId);
            if (!attribute) return null;

            const currentValue =
              node?.data?.inputs?.[`attribute_${attrId}`] || "";

            return (
              <div key={attrId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`attr-${attrId}`}
                    className="text-sm font-normal"
                  >
                    {attribute.name}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      const newAttrs = selectedAttributes.filter(
                        (id) => id !== attrId,
                      );
                      updateInputs("Attributes", newAttrs);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                {renderAttributeInput(attribute, currentValue, (value) =>
                  handleAttributeValueChange(attrId, value),
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to render the appropriate input based on attribute type
const renderAttributeInput = (attribute, value, onChange) => {
  switch (attribute.attributeType) {
    case "TEXT":
    case "EMAIL":
    case "URL":
    case "PHONE":
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${attribute.name.toLowerCase()}`}
        />
      );

    case "NUMBER":
    case "CURRENCY":
    case "RATING":
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${attribute.name.toLowerCase()}`}
        />
      );

    case "CHECKBOX":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={value === true || value === "true"}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <span className="text-muted-foreground text-sm">
            Check to set as true
          </span>
        </div>
      );

    case "DATETIME":
      return (
        <Input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "STATUS":
      const statusOptions = attribute.config?.options || [];
      return (
        <select
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select status...</option>
          {statusOptions.map((option) => (
            <option key={option.status} value={option.status}>
              {option.status}
            </option>
          ))}
        </select>
      );

    case "LONGTEXT":
      return (
        <textarea
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${attribute.name.toLowerCase()}`}
        />
      );

    default:
      return (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${attribute.name.toLowerCase()}`}
        />
      );
  }
};
