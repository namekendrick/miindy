import { format } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AutoOpenDateTimePicker } from "@/components/ui/date-time-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const DateTimeValueInput = ({ value, onChange, validationError }) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[180px] justify-start truncate text-left font-normal",
            !value && "text-muted-foreground",
            validationError && "border-red-500",
          )}
        >
          {value && !isNaN(new Date(value).getTime())
            ? format(new Date(value), "PPP p")
            : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="absolute z-10 rounded-md border bg-white shadow-lg">
          <AutoOpenDateTimePicker
            date={
              value && !isNaN(new Date(value).getTime())
                ? new Date(value)
                : new Date()
            }
            setDate={(date) => {
              if (date && !isNaN(date.getTime())) {
                onChange(date.toISOString());
                setDatePickerOpen(false);
              }
            }}
            className="min-w-[300px] p-3"
            onClose={() => setDatePickerOpen(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
