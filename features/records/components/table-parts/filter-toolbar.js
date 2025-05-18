"use client";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ViewActionButtons } from "@/features/records/components/table-parts/view-action-buttons";
import { FilterGroup } from "@/features/views/components/filter-group";

export const FilterToolbar = ({
  filters,
  filterCount,
  isFilterOpen,
  setIsFilterOpen,
  allAttributes,
  addRule,
  addGroup,
  updateRule,
  deleteRule,
  deleteGroup,
  updateGroupOperator,
  applyCurrentFilters,
  resetFilters,
  isFormValid,
  clearAllFilters,
  hasChanges,
  saveViewConfiguration,
  handleOpenNewViewModal,
  workspaceId,
}) => (
  <div className="bg-background flex items-center justify-between border-t py-2 pr-2">
    <div className="flex items-center gap-2">
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Filter className="size-4" />
            Filter
            {filterCount > 0 && (
              <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                {filterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="max-h-[80vh] w-[700px] overflow-y-auto p-4"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium">Filter records where:</div>
            <FilterGroup
              group={filters}
              attributes={allAttributes}
              addRule={addRule}
              addGroup={addGroup}
              updateRule={updateRule}
              deleteRule={deleteRule}
              deleteGroup={deleteGroup}
              updateGroupOperator={updateGroupOperator}
              workspaceId={workspaceId}
              isRoot
            />
            <div className="flex justify-between pt-2">
              <Button size="sm" variant="ghost" onClick={clearAllFilters}>
                Clear all filters
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          applyCurrentFilters();
                          setIsFilterOpen(false);
                        }}
                        disabled={!isFormValid(filters)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!isFormValid(filters) && (
                    <TooltipContent side="bottom">
                      <p>Please complete all filter rules before applying</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <div className="flex items-center gap-2">
      {hasChanges && (
        <ViewActionButtons
          resetFilters={resetFilters}
          saveViewConfiguration={saveViewConfiguration}
          handleOpenNewViewModal={handleOpenNewViewModal}
        />
      )}
    </div>
  </div>
);
