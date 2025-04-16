"use client";

import { AttributeType } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FILTER_OPERATORS = [
  { label: "Equals", value: "equals" },
  { label: "Contains", value: "contains" },
  { label: "Greater than", value: "greater_than" },
  { label: "Less than", value: "less_than" },
  { label: "Between", value: "between" },
  { label: "In list", value: "in" },
];

export const FilterBuilder = ({
  attributes,
  onFiltersChange,
  currentFilters,
}) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(
    currentFilters?.length > 0
      ? currentFilters
      : [{ attributeId: null, operator: "equals", value: "" }],
  );

  const [attributePopoverOpen, setAttributePopoverOpen] = useState(null);
  const [operatorPopoverOpen, setOperatorPopoverOpen] = useState(null);

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      { attributeId: null, operator: "equals", value: "" },
    ]);
  };

  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = filters.map((filter, i) => {
      if (i === index) {
        return { ...filter, [field]: value };
      }
      return filter;
    });
    setFilters(newFilters);
    onFiltersChange(newFilters);

    if (field === "attributeId") {
      setAttributePopoverOpen(null);
    } else if (field === "operator") {
      setOperatorPopoverOpen(null);
    }
  };

  const handleClearFilters = () => {
    setFilters([{ attributeId: null, operator: "equals", value: "" }]);
    onFiltersChange([]);
  };

  const renderValueInput = (filter, index, attribute) => {
    if (!attribute) return null;

    const attributeType = attribute.attributeType;

    switch (attributeType) {
      case AttributeType.CHECKBOX:
        return (
          <select
            className="h-8 text-xs"
            value={filter.value?.toString() || ""}
            disabled={!filter.attributeId}
            onChange={(e) =>
              handleFilterChange(index, "value", e.target.value === "true")
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      case AttributeType.DATE:
        return (
          <Input
            type="date"
            className="h-8"
            value={filter.value || ""}
            disabled={!filter.attributeId}
            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
          />
        );

      case AttributeType.NUMBER:
      case AttributeType.CURRENCY:
      case AttributeType.RATING:
        return (
          <Input
            type="number"
            className="h-8 placeholder:text-xs"
            placeholder="Enter number..."
            value={filter.value || ""}
            disabled={!filter.attributeId}
            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
          />
        );

      default:
        return (
          <Input
            placeholder="Enter value..."
            className="h-8 placeholder:text-xs"
            value={filter.value || ""}
            disabled={!filter.attributeId}
            onChange={(e) => handleFilterChange(index, "value", e.target.value)}
          />
        );
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-3" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            {filters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2">
                <Popover
                  open={attributePopoverOpen === index}
                  onOpenChange={(isOpen) =>
                    setAttributePopoverOpen(isOpen ? index : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      {attributes.find((a) => a.id === filter.attributeId)
                        ?.name || "Select attribute"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No attributes found.</CommandEmpty>
                        <CommandGroup>
                          {attributes.map((attribute) => (
                            <CommandItem
                              key={attribute.id}
                              onSelect={() => {
                                handleFilterChange(
                                  index,
                                  "attributeId",
                                  attribute.id,
                                );
                              }}
                            >
                              {attribute.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover
                  open={operatorPopoverOpen === index}
                  onOpenChange={(isOpen) =>
                    setOperatorPopoverOpen(isOpen ? index : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!filter.attributeId}
                    >
                      {
                        FILTER_OPERATORS.find(
                          (op) => op.value === filter.operator,
                        )?.label
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {FILTER_OPERATORS.map((operator) => (
                            <CommandItem
                              key={operator.value}
                              onSelect={() =>
                                handleFilterChange(
                                  index,
                                  "operator",
                                  operator.value,
                                )
                              }
                            >
                              {operator.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {attributes.find((a) => a.id === filter.attributeId) &&
                  renderValueInput(
                    filter,
                    index,
                    attributes.find((a) => a.id === filter.attributeId),
                  )}
                {filters.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddFilter}
              disabled={filters.some(
                (filter) =>
                  !filter.attributeId || !filter.operator || !filter.value,
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add filter
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear all filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
