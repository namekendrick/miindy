"use client";

import { PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterRule } from "@/features/views/components/filter-rule";

export const FilterGroup = ({
  group,
  attributes,
  addRule,
  addGroup,
  updateRule,
  deleteRule,
  deleteGroup,
  updateGroupOperator,
  workspaceId,
  isRoot = false,
}) => {
  if (!group) return null;

  const { id, operator, rules, parentId } = group;

  return (
    <div className="rounded-md border p-4">
      <div className="mb-4 flex items-center gap-2">
        <Select
          value={operator}
          onValueChange={(value) => updateGroupOperator(id, value)}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Where..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-xs">
          of the following conditions:
        </span>
        {!isRoot && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-7 w-7"
            onClick={() => deleteGroup(id, parentId)}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {rules &&
          rules.map((rule) =>
            rule.type === "group" ? (
              <FilterGroup
                key={rule.id}
                group={rule}
                attributes={attributes}
                addRule={addRule}
                addGroup={addGroup}
                updateRule={updateRule}
                deleteRule={deleteRule}
                deleteGroup={deleteGroup}
                updateGroupOperator={updateGroupOperator}
                workspaceId={workspaceId}
              />
            ) : (
              <FilterRule
                key={rule.id}
                rule={rule}
                groupId={id}
                attributes={attributes}
                updateRule={updateRule}
                deleteRule={deleteRule}
                workspaceId={workspaceId}
              />
            ),
          )}
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => addRule(id)}
        >
          <PlusCircle className="mr-1 size-3" /> Add Rule
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => addGroup(id)}
        >
          <PlusCircle className="mr-1 size-3" /> Add Group
        </Button>
      </div>
    </div>
  );
};
