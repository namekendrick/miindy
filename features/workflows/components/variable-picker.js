"use client";

import { useReactFlow } from "@xyflow/react";
import { Variable, X } from "lucide-react";
import { useState, useMemo, useCallback, memo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAvailableVariables } from "@/features/workflows/utils/get-available-variables";
import {
  createVariableReference as formatVariableReference,
  parseVariableReference,
} from "@/features/workflows/utils/variable-resolver";
import { cn } from "@/lib/utils";

const VariablePickerComponent = ({
  nodeId,
  attributeType,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const { getNodes, getEdges } = useReactFlow();

  const nodes = getNodes();
  const edges = getEdges();

  const availableVariables = useMemo(() => {
    return getAvailableVariables(nodeId, nodes, edges, attributeType);
  }, [nodeId, nodes, edges, attributeType]);

  const currentVariable = useMemo(() => parseVariableReference(value), [value]);
  const hasVariable = currentVariable !== null;

  const handleSelectVariable = useCallback(
    (variable) => {
      const variableRef = formatVariableReference(variable);
      onChange(variableRef);
      setOpen(false);
    },
    [onChange],
  );

  const handleClearVariable = useCallback(() => onChange(""), [onChange]);

  const groupedVariables = useMemo(() => {
    const groups = {};
    for (const variable of availableVariables) {
      const key = variable.nodeId;
      if (!groups[key]) {
        groups[key] = {
          nodeLabel: variable.nodeLabel,
          nodeType: variable.nodeType,
          variables: [],
        };
      }
      groups[key].variables.push(variable);
    }
    return groups;
  }, [availableVariables]);

  const hasPreviousNodes = useMemo(
    () => nodes.filter((n) => n.id !== nodeId).length > 0,
    [nodes, nodeId],
  );

  if (!hasPreviousNodes) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {hasVariable ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs hover:bg-transparent"
          onClick={handleClearVariable}
        >
          <X className="mr-1 h-3 w-3" />
          Clear variable
        </Button>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "h-auto p-0 text-xs hover:bg-transparent",
                !hasVariable && "text-muted-foreground",
              )}
            >
              <Variable />
              {placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>
                  {availableVariables.length === 0
                    ? "No compatible variables from previous steps"
                    : "No variables found"}
                </CommandEmpty>
                {Object.entries(groupedVariables).map(([nodeId, group]) => (
                  <CommandGroup
                    key={nodeId}
                    heading={
                      <div className="flex items-center gap-2">
                        <span>{group.nodeLabel}</span>
                        <Badge variant="outline" className="text-xs">
                          {group.nodeType}
                        </Badge>
                      </div>
                    }
                  >
                    {group.variables.map((variable) => {
                      const isSelected =
                        currentVariable?.nodeId === variable.nodeId &&
                        currentVariable?.outputName === variable.outputName;

                      return (
                        <CommandItem
                          key={`${variable.nodeId}-${variable.outputName}`}
                          value={`${variable.nodeId}-${variable.outputName}`}
                          onSelect={() => handleSelectVariable(variable)}
                          className={cn(isSelected && "bg-accent")}
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {variable.outputName}
                              </span>
                              {variable.outputDescription && (
                                <span className="text-muted-foreground text-xs">
                                  {variable.outputDescription}
                                </span>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {variable.outputType}
                            </Badge>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

VariablePickerComponent.displayName = "VariablePicker";

export const VariablePicker = memo(VariablePickerComponent);
