"use client";

import { useReactFlow } from "@xyflow/react";
import { useMemo, useCallback, memo } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { VariablePicker } from "@/features/workflows/components/variable-picker";
import { getVariableDisplayText } from "@/features/workflows/utils/get-available-variables";
import {
  parseVariableReference,
  isVariableReference,
} from "@/features/workflows/utils/variable-resolver";

const AttributeValueInputComponent = ({
  attribute,
  value,
  onChange,
  nodeId,
}) => {
  const { getNodes } = useReactFlow();
  const nodes = getNodes();

  const variableRef = useMemo(() => parseVariableReference(value), [value]);

  const variableDisplayText = useMemo(() => {
    if (!variableRef) return "";
    const fullText = getVariableDisplayText(variableRef, nodes);
    const parts = fullText.split(" → ");
    return parts.length > 1 ? parts[1] : fullText;
  }, [variableRef, nodes]);

  const handleStaticValueChange = useCallback(
    (newValue) => onChange(newValue),
    [onChange],
  );

  const handleVariableChange = useCallback(
    (variableValue) => onChange(variableValue),
    [onChange],
  );

  return (
    <div className="space-y-2">
      {variableRef ? (
        <div className="relative">
          <Input
            type="text"
            value={`{ ${variableDisplayText} }`}
            readOnly
            className="pr-10 font-mono font-medium text-indigo-700 dark:text-indigo-400"
            placeholder={`Enter ${attribute.name.toLowerCase()}`}
          />
        </div>
      ) : (
        renderStaticInput(attribute, value, handleStaticValueChange)
      )}

      <VariablePicker
        nodeId={nodeId}
        attributeType={attribute.attributeType}
        value={value}
        onChange={handleVariableChange}
        placeholder="Insert variable"
        className="text-muted-foreground"
      />
    </div>
  );
};

AttributeValueInputComponent.displayName = "AttributeValueInput";

export const AttributeValueInput = memo(AttributeValueInputComponent);

const renderStaticInput = (attribute, value, onChange) => {
  const displayValue = isVariableReference(value) ? "" : value;

  switch (attribute.attributeType) {
    case "TEXT":
    case "EMAIL":
    case "URL":
    case "PHONE":
      return (
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${attribute.name.toLowerCase()}`}
          className="flex-1"
        />
      );

    case "NUMBER":
    case "CURRENCY":
    case "RATING":
      return (
        <Input
          type="number"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${attribute.name.toLowerCase()}`}
          className="flex-1"
        />
      );

    case "CHECKBOX":
      return (
        <div className="flex flex-1 items-center space-x-2">
          <Checkbox
            checked={displayValue === true || displayValue === "true"}
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
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      );

    case "STATUS":
      const statusOptions = attribute.config?.options || [];
      return (
        <select
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 flex-1 rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={displayValue}
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
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] flex-1 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${attribute.name.toLowerCase()}`}
        />
      );

    default:
      return (
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${attribute.name.toLowerCase()}`}
          className="flex-1"
        />
      );
  }
};
