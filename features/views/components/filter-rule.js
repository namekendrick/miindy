"use client";

import { Trash2, AlertCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimeValueInput } from "@/features/views/components/date-time-value-input";
import { RelationshipValueInput } from "@/features/views/components/relationship-value-input";
import { StatusOrSelectValueInput } from "@/features/views/components/status-or-select-value-input";
import { NO_VALUE_OPERATIONS } from "@/features/views/constants/filter-operations";
import {
  validateFilterValue,
  getFilterOperationsByType,
} from "@/features/views/utils/filter-utils";
import { cn } from "@/lib/utils";

export const FilterRule = ({
  rule,
  groupId,
  attributes = [],
  updateRule,
  deleteRule,
  workspaceId,
}) => {
  const { id, field, operation, value } = rule;
  const selectedAttribute = attributes.find((attr) => attr.id === field);

  const [validationError, setValidationError] = useState(null);

  const availableOperations = useMemo(() => {
    if (!field || !selectedAttribute) return [];

    if (selectedAttribute.attributeType === "RELATIONSHIP") {
      const relationshipType =
        selectedAttribute.sourceRelationship?.relationshipType;
      return getFilterOperationsByType(
        selectedAttribute.attributeType,
        relationshipType,
      );
    }

    return getFilterOperationsByType(selectedAttribute.attributeType);
  }, [field, selectedAttribute]);

  const handleValueChange = (newValue) => {
    if (selectedAttribute) {
      const { isValid, error } = validateFilterValue(
        newValue,
        selectedAttribute.attributeType,
        operation,
      );

      setValidationError(isValid ? null : error);
    }

    updateRule(id, groupId, "value", newValue);
  };

  useEffect(() => {
    setValidationError(null);
  }, [operation]);

  const hideValueInput = NO_VALUE_OPERATIONS.includes(operation);

  const renderValueInput = () => {
    if (!field || !selectedAttribute || hideValueInput) {
      return null;
    }

    switch (selectedAttribute.attributeType) {
      case "CHECKBOX":
        return null;

      case "RELATIONSHIP":
        return (
          <RelationshipValueInput
            selectedAttribute={selectedAttribute}
            value={value}
            onChange={handleValueChange}
            validationError={validationError}
            workspaceId={workspaceId}
          />
        );

      case "DATETIME":
        return (
          <DateTimeValueInput
            value={value}
            onChange={handleValueChange}
            validationError={validationError}
          />
        );

      case "NUMBER":
      case "CURRENCY":
      case "RATING":
        return (
          <Input
            type="number"
            placeholder="Value"
            value={value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            className={cn("w-[120px]", validationError && "border-red-500")}
          />
        );

      case "STATUS":
      case "SELECT":
      case "MULTI_SELECT":
        return (
          <StatusOrSelectValueInput
            selectedAttribute={selectedAttribute}
            value={value}
            onChange={handleValueChange}
            validationError={validationError}
          />
        );

      default:
        return (
          <Input
            placeholder="Value"
            value={value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            className={cn("w-[120px]", validationError && "border-red-500")}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Select
          value={field}
          onValueChange={(value) => {
            updateRule(id, groupId, "field", value);
            updateRule(id, groupId, "operation", "");
            updateRule(id, groupId, "value", "");
            setValidationError(null);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {attributes.map((attribute) => (
              <SelectItem key={attribute.id} value={attribute.id}>
                {attribute.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={operation}
          onValueChange={(value) => {
            updateRule(id, groupId, "operation", value);
            updateRule(id, groupId, "value", "");
            setValidationError(null);
          }}
          disabled={!field}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            {availableOperations.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {renderValueInput()}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => deleteRule(id, groupId)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {validationError && (
        <div className="ml-1 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="size-3" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
