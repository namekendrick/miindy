import { Clipboard, X } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { DisplayValue } from "@/features/records/components/display-value";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

export const EditableCell = ({ value, row, attribute, onSave }) => {
  const inputRef = useRef(null);
  const cellRef = useRef(null);
  const calendarRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const attributeType = attribute?.attributeType;

  const handleClickOutside = () => {
    if (editValue !== value) {
      handleSave();
    } else {
      setIsEditing(false);
    }
  };

  useOnClickOutside(isEditing ? inputRef : null, handleClickOutside);

  const handleSave = () => {
    if (isEditing) {
      onSave(row.original.id, attribute.id, editValue);
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditing) setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            ref={cellRef}
            className="min-h-[24px] min-w-[1px] cursor-default overflow-hidden text-ellipsis whitespace-nowrap"
            onDoubleClick={handleDoubleClick}
          >
            <DisplayValue value={value} attribute={attribute} />
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
          >
            <X className="mr-2 h-4 w-4" />
            Clear value
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  switch (attributeType) {
    case "CHECKBOX":
      return (
        <div ref={inputRef} className="flex h-full items-center justify-center">
          <Checkbox
            checked={editValue === true || editValue === "true"}
            onCheckedChange={(checked) => {
              setEditValue(checked);
              setTimeout(handleSave, 0);
            }}
          />
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
