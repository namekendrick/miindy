import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/utils/color-utils";

export const StatusOrSelectValueInput = ({
  selectedAttribute,
  value,
  onChange,
  validationError,
}) => {
  const statusOptions = useMemo(() => {
    if (
      selectedAttribute?.attributeType === "STATUS" &&
      selectedAttribute?.config?.options &&
      Array.isArray(selectedAttribute.config.options)
    ) {
      return selectedAttribute.config.options.map((option) => ({
        value: option.status,
        label: option.status,
        color: option.color,
      }));
    }

    if (
      selectedAttribute?.attributeType === "SELECT" &&
      selectedAttribute?.config?.options &&
      Array.isArray(selectedAttribute.config.options)
    ) {
      return selectedAttribute.config.options.map((option) => ({
        value: option,
        label: option,
      }));
    }

    return [];
  }, [selectedAttribute]);

  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger
        className={cn("w-[180px]", validationError && "border-red-500")}
      >
        <SelectValue placeholder="Select status">
          {value && (
            <div className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    selectedAttribute.attributeType === "STATUS"
                      ? getStatusColor(value, selectedAttribute.config?.options)
                      : getStatusColor(value),
                }}
              />
              <span>{value}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem
            key={status.value}
            value={status.value}
            className="flex items-center gap-1.5"
          >
            <div
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{
                backgroundColor:
                  status.color ||
                  getStatusColor(
                    status.value,
                    selectedAttribute.config?.options,
                  ),
              }}
            />
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
