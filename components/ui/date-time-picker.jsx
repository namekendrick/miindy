"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, addDays, startOfDay, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

// Component with all the datetime picker functionality without the popover
export function DateTimePickerContent({ date, setDate, onApply }) {
  const initialDate = date ? new Date(date) : new Date();

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [hours, setHours] = useState(initialDate.getHours());
  const [minutes, setMinutes] = useState(initialDate.getMinutes());
  const [inputValue, setInputValue] = useState(
    format(initialDate, "yyyy-MM-dd HH:mm"),
  );
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef(null);
  const cursorPositionRef = useRef(null);

  const handleInputChange = (e) => {
    const cursorPosition = e.target.selectionStart;
    const value = e.target.value;

    setInputValue(value);

    cursorPositionRef.current = cursorPosition;

    try {
      const parsedDate = parse(value, "yyyy-MM-dd HH:mm", new Date());

      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
        setHours(parsedDate.getHours());
        setMinutes(parsedDate.getMinutes());
        setInputError(false);
      } else {
        setInputError(true);
      }
    } catch (error) {
      setInputError(true);
    }
  };

  useEffect(() => {
    if (inputRef.current && cursorPositionRef.current !== null) {
      inputRef.current.setSelectionRange(
        cursorPositionRef.current,
        cursorPositionRef.current,
      );
    }
  }, [inputValue]);

  const handleApply = () => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);

    // Just a simple validity check before proceeding
    if (!isNaN(newDate.getTime())) {
      setDate(newDate);

      if (onApply) {
        onApply(newDate);
      }
    } else {
      setInputError(true);
    }
  };

  useEffect(() => {
    if (cursorPositionRef.current === null) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(hours);
      updatedDate.setMinutes(minutes);
      setInputValue(format(updatedDate, "yyyy-MM-dd HH:mm"));
    }
  }, [selectedDate, hours, minutes]);

  const datePresets = [
    {
      label: "Today",
      onClick: () => {
        const today = startOfDay(new Date());
        setSelectedDate(today);
        cursorPositionRef.current = null; // Allow input update
      },
    },
    {
      label: "Tomorrow",
      onClick: () => {
        setSelectedDate(startOfDay(addDays(new Date(), 1)));
        cursorPositionRef.current = null; // Allow input update
      },
    },
    {
      label: "In a week",
      onClick: () => {
        setSelectedDate(startOfDay(addDays(new Date(), 7)));
        cursorPositionRef.current = null; // Allow input update
      },
    },
  ];

  return (
    <div className="select-none">
      {/* Direct input field */}
      <div className="mb-3">
        <Input
          ref={inputRef}
          placeholder="YYYY-MM-DD HH:MM"
          value={inputValue}
          onChange={handleInputChange}
          className={cn(inputError && "border-red-500", "select-text")}
          onFocus={() => {
            // When user focuses on input, prepare for typing
            if (inputRef.current) {
              cursorPositionRef.current = inputRef.current.selectionStart;
            }
          }}
          onBlur={() => {
            // When user leaves input, allow calendar to update input
            cursorPositionRef.current = null;
          }}
        />
        {inputError && (
          <p className="mt-1 text-xs text-red-500">
            Please enter a valid date/time (YYYY-MM-DD HH:MM)
          </p>
        )}
      </div>

      {/* Date presets */}
      <div className="mb-3">
        <div className="mb-2 flex items-center gap-2">
          {datePresets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={preset.onClick}
              className="flex-1"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar - Full width */}
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(newDate) => {
          if (newDate) {
            setSelectedDate(newDate);
            cursorPositionRef.current = null; // Allow input update
          }
        }}
        initialFocus
      />

      {/* Apply button */}
      <Button
        variant="default"
        size="sm"
        className="mt-3 w-full"
        onClick={handleApply}
      >
        Apply
      </Button>
    </div>
  );
}

// Auto-open version for use in cell editing
export function AutoOpenDateTimePicker({ date, setDate, className, onClose }) {
  const pickerRef = useRef(null);

  useOnClickOutside(pickerRef, () => {
    if (onClose) {
      onClose();
    }
  });

  return (
    <div ref={pickerRef} className={cn(className, "select-none")}>
      <DateTimePickerContent
        date={date}
        setDate={(newDate) => {
          setDate(newDate);
          if (onClose) {
            onClose();
          }
        }}
      />
    </div>
  );
}

export function DateTimePicker({ date, setDate, disabled, className }) {
  const initialDate = date ? new Date(date) : new Date();
  const [displayDate, setDisplayDate] = useState(
    initialDate ? format(initialDate, "PPP p") : "Pick date and time",
  );
  const [open, setOpen] = useState(false);

  const handleDateSet = (newDate) => {
    setDisplayDate(format(new Date(newDate), "PPP p"));
    setDate(newDate);
    setOpen(false);
  };

  return (
    <div>
      <Popover
        open={open}
        onOpenChange={(openState) => {
          if (open && !openState) {
            setOpen(false);
          } else if (!open && openState) {
            setOpen(true);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className,
            )}
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-[300px] p-3 select-none"
          align="start"
          onInteractOutside={() => {
            setOpen(false);
          }}
          onEscapeKeyDown={() => {
            setOpen(false);
          }}
        >
          <DateTimePickerContent date={date} setDate={handleDateSet} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
