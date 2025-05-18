"use client";

import { useState, useCallback, useEffect } from "react";

import {
  getRuleCount,
  deepClone,
  createEmptyRule,
  createEmptyGroup,
  isFormValid,
  applyFilters as applyFiltersUtil,
  cleanupFilters,
} from "@/features/views/utils/filter-utils";

export const useFilter = ({ onFilterChange, initialFilters = null }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Server-side filters (what's saved in the database)
  const [serverFilters, setServerFilters] = useState(() => {
    if (
      initialFilters &&
      typeof initialFilters === "object" &&
      initialFilters.type === "group"
    ) {
      return deepClone(initialFilters);
    }
    return createEmptyGroup();
  });

  // Current working filter state (what's shown in the UI)
  const [filters, setFilters] = useState(() => {
    if (
      initialFilters &&
      typeof initialFilters === "object" &&
      initialFilters.type === "group"
    ) {
      return deepClone(initialFilters);
    }
    return createEmptyGroup();
  });

  // The currently applied filters (what's applied to the data)
  const [appliedFilters, setAppliedFilters] = useState(() => {
    if (
      initialFilters &&
      typeof initialFilters === "object" &&
      initialFilters.type === "group"
    ) {
      return deepClone(initialFilters);
    }
    return null;
  });

  // Track if filters have been applied (but not saved)
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  const filterCount = getRuleCount(
    hasAppliedFilters ? appliedFilters : serverFilters,
  );

  const handlePopoverOpenChange = (open = null) => {
    const newIsOpen = open !== null ? open : !isFilterOpen;

    if (newIsOpen) {
      const filtersToShow = hasAppliedFilters ? appliedFilters : serverFilters;
      setFilters(deepClone(filtersToShow));
    }

    setIsFilterOpen(newIsOpen);
  };

  const addRule = useCallback((groupId) => {
    setFilters((current) => {
      const newFilters = { ...current };

      const findAndAddRule = (group) => {
        if (group.id === groupId) {
          return {
            ...group,
            rules: [...group.rules, createEmptyRule()],
          };
        }

        if (group.rules) {
          return {
            ...group,
            rules: group.rules.map((rule) => {
              if (rule.type === "group") {
                return findAndAddRule(rule);
              }
              return rule;
            }),
          };
        }

        return group;
      };

      return findAndAddRule(newFilters);
    });
  }, []);

  const addGroup = useCallback((parentGroupId) => {
    setFilters((current) => {
      const newFilters = { ...current };

      // Helper function to find the parent group and add a new group
      const findAndAddGroup = (group) => {
        if (group.id === parentGroupId) {
          return {
            ...group,
            rules: [...group.rules, createEmptyGroup(parentGroupId)],
          };
        }

        if (group.rules) {
          return {
            ...group,
            rules: group.rules.map((rule) => {
              if (rule.type === "group") {
                return findAndAddGroup(rule);
              }
              return rule;
            }),
          };
        }

        return group;
      };

      return findAndAddGroup(newFilters);
    });
  }, []);

  const updateRule = useCallback((ruleId, groupId, field, value) => {
    setFilters((current) => {
      const newFilters = { ...current };

      const findAndUpdateRule = (group) => {
        if (group.id === groupId) {
          return {
            ...group,
            rules: group.rules.map((rule) => {
              if (rule.id === ruleId) {
                return { ...rule, [field]: value };
              }
              return rule;
            }),
          };
        }

        if (group.rules) {
          return {
            ...group,
            rules: group.rules.map((rule) => {
              if (rule.type === "group") {
                return findAndUpdateRule(rule);
              }
              return rule;
            }),
          };
        }

        return group;
      };

      return findAndUpdateRule(newFilters);
    });
  }, []);

  const deleteRule = useCallback((ruleId, groupId) => {
    setFilters((current) => {
      const newFilters = { ...current };

      const findAndDeleteRule = (group) => {
        if (group.id === groupId) {
          if (group.rules.length <= 1) {
            return group;
          }

          return {
            ...group,
            rules: group.rules.filter((rule) => rule.id !== ruleId),
          };
        }

        if (group.rules) {
          return {
            ...group,
            rules: group.rules.map((rule) => {
              if (rule.type === "group") {
                return findAndDeleteRule(rule);
              }
              return rule;
            }),
          };
        }

        return group;
      };

      return findAndDeleteRule(newFilters);
    });
  }, []);

  const deleteGroup = useCallback((groupId, parentGroupId) => {
    setFilters((current) => {
      if (current.id === groupId && !parentGroupId) {
        return createEmptyGroup();
      }

      const newFilters = { ...current };

      const findAndDeleteGroup = (group) => {
        if (group.id === parentGroupId) {
          if (group.rules.length <= 1) {
            return group;
          }

          return {
            ...group,
            rules: group.rules.filter((rule) => rule.id !== groupId),
          };
        }

        if (group.rules) {
          return {
            ...group,
            rules: group.rules.map((rule) => {
              if (rule.type === "group") {
                return findAndDeleteGroup(rule);
              }
              return rule;
            }),
          };
        }

        return group;
      };

      return findAndDeleteGroup(newFilters);
    });
  }, []);

  const updateGroupOperator = useCallback((groupId, operator) => {
    setFilters((current) => {
      const newFilters = { ...current };

      if (newFilters.id === groupId) {
        return {
          ...newFilters,
          operator,
        };
      }

      const findAndUpdateGroup = (group) => {
        if (group.id === groupId) {
          return {
            ...group,
            operator,
          };
        }

        if (group.rules) {
          return {
            ...group,
            rules: group.rules.map((rule) => {
              if (rule.type === "group") {
                return findAndUpdateGroup(rule);
              }
              return rule;
            }),
          };
        }

        return group;
      };

      return findAndUpdateGroup(newFilters);
    });
  }, []);

  const applyFilters = useCallback(
    (data) => {
      return applyFiltersUtil(data, filters);
    },
    [filters],
  );

  const applyCurrentFilters = useCallback(() => {
    const hasRealRules = (filterGroup) => {
      if (!filterGroup || !filterGroup.rules) return false;

      return filterGroup.rules.some((rule) => {
        if (rule.type === "group") {
          return hasRealRules(rule);
        }
        return rule.field && rule.field.length > 0;
      });
    };

    const shouldApplyFilters =
      onFilterChange &&
      isFormValid(filters) &&
      (hasRealRules(filters) || filterCount > 0);

    if (shouldApplyFilters) {
      const currentFiltersCopy = deepClone(filters);
      const cleanedFilters = cleanupFilters(currentFiltersCopy);

      // Normalize operations to ensure they match what the server expects
      const normalizeFilterOperations = (group) => {
        if (!group || !group.rules) return group;

        const normalizedRules = group.rules.map((rule) => {
          if (rule.type === "group") {
            return normalizeFilterOperations(rule);
          }

          const normalizedRule = { ...rule };

          // Map UI operations to server operations if needed
          switch (rule.operation) {
            case "equals":
            case "not_equals":
            case "contains":
            case "not_contains":
            case "greater_than":
            case "less_than":
            case "starts_with":
            case "ends_with":
            case "is_empty":
            case "is_not_empty":
            case "is_in_past":
            case "is_in_future":
            case "is_today":
            case "is_tomorrow":
            case "is_yesterday":
            case "is":
            case "is_before":
            case "is_after":
            case "true":
            case "false":
              break;
            default:
              console.warn(
                `Operation '${rule.operation}' might need conversion for server compatibility`,
              );
          }

          return normalizedRule;
        });

        return {
          ...group,
          rules: normalizedRules,
        };
      };

      const normalizedFilters = normalizeFilterOperations(cleanedFilters);

      setAppliedFilters(normalizedFilters);
      setHasAppliedFilters(true);

      // Notify parent about the changes
      onFilterChange(normalizedFilters, true);
    } else {
      console.warn("Cannot apply filters:", {
        hasOnFilterChange: !!onFilterChange,
        filterCount,
        isFormValid: isFormValid(filters),
        hasRealRules: hasRealRules(filters),
      });
    }
  }, [filters, onFilterChange, filterCount]);

  const resetFilters = useCallback(() => {
    const serverFiltersCopy = deepClone(serverFilters);
    setFilters(serverFiltersCopy);
    setAppliedFilters(serverFiltersCopy);
    setHasAppliedFilters(false);

    // Notify parent to update data with server filters
    // But don't mark as changed
    if (onFilterChange) {
      // Indicate this shouldn't be tracked as a change
      onFilterChange(serverFiltersCopy, false);
    }
  }, [serverFilters, onFilterChange]);

  const updateServerFilters = useCallback(() => {
    const appliedFiltersCopy = deepClone(appliedFilters || filters);
    setServerFilters(appliedFiltersCopy);
    setHasAppliedFilters(false);
  }, [appliedFilters, filters]);

  const clearAllFilters = useCallback(() => {
    const newEmptyGroup = createEmptyGroup();
    setFilters(newEmptyGroup);
    setAppliedFilters(newEmptyGroup);
    setHasAppliedFilters(true);

    // Notify parent to update data with empty filters
    if (onFilterChange) {
      onFilterChange(newEmptyGroup, true);
    }
  }, [onFilterChange]);

  useEffect(() => {
    if (
      initialFilters &&
      typeof initialFilters === "object" &&
      initialFilters.type === "group"
    ) {
      const newFilters = deepClone(initialFilters);
      setFilters(newFilters);
      setServerFilters(newFilters);
      setAppliedFilters(newFilters);
      setHasAppliedFilters(false);
    }
  }, [initialFilters]);

  return {
    filters,
    filterCount,
    isFilterOpen,
    setIsFilterOpen: handlePopoverOpenChange,
    addRule,
    addGroup,
    updateRule,
    deleteRule,
    deleteGroup,
    updateGroupOperator,
    applyFilters,
    applyCurrentFilters,
    resetFilters,
    updateServerFilters,
    appliedFilters,
    hasAppliedFilters,
    isFormValid,
    clearAllFilters,
  };
};
