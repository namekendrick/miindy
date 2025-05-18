import { z } from "zod";

import { NO_VALUE_OPERATIONS } from "@/features/views/constants/filter-operations";

/**
 * Counts the valid rules in a filter structure
 * @param {Object} filter - The filter object to count rules in
 * @returns {number} The count of valid rules
 */
export const getRuleCount = (filter) => {
  let count = 0;

  if (!filter) return 0;

  if (filter.rules) {
    filter.rules.forEach((rule) => {
      if (rule.type === "group") {
        count += getRuleCount(rule);
      } else if (rule.field && rule.operation) {
        const noValueNeeded = NO_VALUE_OPERATIONS.includes(rule.operation);

        if (
          noValueNeeded ||
          (rule.value !== undefined && rule.value !== null && rule.value !== "")
        ) {
          count += 1;
        }
      }
    });
  }

  return count;
};

/**
 * Checks if an item matches a specific filter rule
 * @param {Object} item - The item to check
 * @param {Object} rule - The rule to check against
 * @returns {boolean} True if the item matches the rule
 */
export const matchesRule = (item, rule) => {
  const { field, operation, value } = rule;

  if (!field || !operation) {
    return true;
  }

  if (operation === "is_empty" || operation === "is_not_empty") {
    const hasValue =
      item[field] !== undefined && item[field] !== null && item[field] !== "";
    return operation === "is_empty" ? !hasValue : hasValue;
  }

  if (value === undefined || value === null || value === "") {
    return true;
  }

  const itemValue = item[field];

  switch (operation) {
    case "equals":
      return itemValue === value;
    case "not_equals":
      return itemValue !== value;
    case "contains":
      return String(itemValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "not_contains":
      return !String(itemValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "greater_than":
      return Number(itemValue) > Number(value);
    case "less_than":
      return Number(itemValue) < Number(value);
    case "starts_with":
      return String(itemValue)
        .toLowerCase()
        .startsWith(String(value).toLowerCase());
    case "ends_with":
      return String(itemValue)
        .toLowerCase()
        .endsWith(String(value).toLowerCase());
    default:
      return true;
  }
};

/**
 * Checks if an item matches a filter group
 * @param {Object} item - The item to check
 * @param {Object} group - The filter group to check against
 * @returns {boolean} True if the item matches the group
 */
export const matchesGroup = (item, group) => {
  if (!group || !group.rules || group.rules.length === 0) {
    return true;
  }

  const operator = group.operator === "OR" ? "OR" : "AND";

  if (operator === "AND") {
    return group.rules.every((rule) =>
      rule.type === "group"
        ? matchesGroup(item, rule)
        : matchesRule(item, rule),
    );
  } else {
    return group.rules.some((rule) =>
      rule.type === "group"
        ? matchesGroup(item, rule)
        : matchesRule(item, rule),
    );
  }
};

/**
 * Applies filters to a dataset and returns filtered results
 * @param {Array} data - The data to filter
 * @param {Object} filters - The filter structure to apply
 * @returns {Array} Filtered data
 */
export const applyFilters = (data, filters) => {
  if (!data || !filters) return data;
  return data.filter((item) => matchesGroup(item, filters));
};

/**
 * Cleans up a filter structure by removing empty rules and normalizing operations
 * @param {Object} filters - The filter structure to clean
 * @returns {Object} Cleaned filter structure
 */
export const cleanupFilters = (filters) => {
  if (!filters || !filters.rules) return filters;

  const cleanupEmptyRules = (group) => {
    if (!group || !group.rules) return group;

    const validRules = group.rules
      .filter((rule) => {
        if (rule.type === "group") {
          return true;
        }
        return rule.field && rule.field.length > 0;
      })
      .map((rule) => {
        if (rule.type === "group") {
          return cleanupEmptyRules(rule);
        }
        return rule;
      });

    return {
      ...group,
      rules: validRules,
    };
  };

  return cleanupEmptyRules(filters);
};

/**
 * Validates if all filter rules in a structure are valid
 * @param {Object} filter - The filter object to validate
 * @returns {boolean} True if all rules are valid
 */
export const isFormValid = (filter) => {
  if (!filter) return true;

  const isRuleValid = (rule) => {
    if (!rule.field || !rule.operation) {
      return false;
    }

    const operationRequiresValue = !NO_VALUE_OPERATIONS.includes(
      rule.operation,
    );

    if (!operationRequiresValue) {
      return true;
    }

    const hasValidValue =
      (rule.value !== undefined && rule.value !== null && rule.value !== "") ||
      rule.value === 0;

    return hasValidValue;
  };

  const isGroupValid = (group) => {
    if (!group.rules || group.rules.length === 0) {
      return true;
    }

    if (group.rules.length === 1 && !group.rules[0].field) {
      return true;
    }

    const allRulesValid = group.rules.every((rule) => {
      if (rule.type === "group") {
        return isGroupValid(rule);
      }
      return isRuleValid(rule);
    });

    return allRulesValid;
  };

  return isGroupValid(filter);
};

/**
 * Deep clones an object using JSON parse/stringify
 * @param {Object} obj - The object to clone
 * @returns {Object} A deep clone of the object
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Creates an empty filter rule
 * @returns {Object} An empty rule object
 */
export const createEmptyRule = () => ({
  id: Date.now().toString(),
  field: "",
  operation: "equals",
  value: "",
});

/**
 * Creates an empty filter group
 * @param {string|null} parentId - Optional parent group ID
 * @returns {Object} An empty group object
 */
export const createEmptyGroup = (parentId = null) => ({
  id: Date.now().toString(),
  type: "group",
  operator: "AND",
  parentId,
  rules: [createEmptyRule()],
});

/**
 * Validates and normalizes a filter structure to ensure proper format
 * @param {Object} filters - The filter object to validate and normalize
 * @returns {Object|null} Normalized filter structure or null if invalid
 */
export const validateAndNormalizeFilters = (filters) => {
  if (!filters) return null;

  if (
    typeof filters !== "object" ||
    !filters.type ||
    filters.type !== "group"
  ) {
    console.warn("Invalid filter structure:", filters);
    return null;
  }

  const normalizeGroup = (group) => {
    if (!group || !group.rules || !Array.isArray(group.rules)) {
      return {
        id: group?.id || Date.now().toString(),
        type: "group",
        operator: group?.operator || "AND",
        rules: [],
      };
    }

    const normalizedRules = group.rules.map((rule) => {
      if (rule.type === "group") {
        return normalizeGroup(rule);
      }

      return {
        id: rule.id || Date.now().toString(),
        field: rule.field || "",
        operation: rule.operation || "equals",
        value: rule.value ?? "",
        ...(rule.type ? { type: rule.type } : {}),
      };
    });

    return {
      id: group.id || Date.now().toString(),
      type: "group",
      operator: group.operator === "OR" ? "OR" : "AND",
      rules: normalizedRules,
    };
  };

  return normalizeGroup(filters);
};

/**
 * Formats a filter value based on its attribute type
 * @param {*} value - The value to format
 * @param {string} attributeType - The type of the attribute
 * @returns {string} The formatted value
 */
export const formatFilterValue = (value, attributeType) => {
  if (value === null || value === undefined) return "";

  switch (attributeType) {
    case "DATETIME":
      return value instanceof Date ? value.toISOString().split("T")[0] : value;
    case "NUMBER":
      return value.toString();
    case "CHECKBOX":
      return value === true || value === "true" ? "true" : "false";
    default:
      return value.toString();
  }
};

/**
 * Gets the appropriate Zod schema for the given attribute type
 * @param {string} attributeType - The type of the attribute
 * @returns {z.ZodType} The corresponding Zod schema
 */
export const getSchemaForAttributeType = (attributeType) => {
  switch (attributeType) {
    case "CHECKBOX":
      return z
        .boolean()
        .or(z.enum(["true", "false"]).transform((val) => val === "true"));
    case "DATETIME":
      return z.coerce.date();
    case "NUMBER":
      return z.coerce.number();
    case "STATUS":
      return z.string();
    default:
      return z.string();
  }
};

/**
 * Gets the validation schema for a filter value based on attribute type and operation
 * @param {string} attributeType - The type of the attribute
 * @param {string} operation - The filter operation
 * @returns {z.ZodType} The validation schema
 */
export const getValidationSchema = (attributeType, operation) => {
  if (NO_VALUE_OPERATIONS.includes(operation)) {
    return z.any().optional();
  }

  return getSchemaForAttributeType(attributeType);
};

/**
 * Validates a filter value against its expected schema
 * @param {*} value - The value to validate
 * @param {string} attributeType - The type of the attribute
 * @param {string} operation - The filter operation
 * @returns {Object} Result containing the parsed value, validation status, and any error
 */
export const validateFilterValue = (value, attributeType, operation) => {
  try {
    const schema = getValidationSchema(attributeType, operation);
    return { value: schema.parse(value), isValid: true, error: null };
  } catch (error) {
    return {
      value,
      isValid: false,
      error: error.errors?.[0]?.message || "Invalid value",
    };
  }
};

/**
 * Returns available filter operations based on attribute type
 * @param {string} attributeType - The type of the attribute
 * @param {string} relationshipType - Optional relationship type for relationship attributes
 * @returns {Array} List of operations available for the attribute type
 */
export const getFilterOperationsByType = (attributeType, relationshipType) => {
  const {
    TEXT_OPERATIONS,
    NUMBER_OPERATIONS,
    DATETIME_OPERATIONS,
    STATUS_OPERATIONS,
    CHECKBOX_OPERATIONS,
    RELATIONSHIP_MANY_OPERATIONS,
    RELATIONSHIP_ONE_OPERATIONS,
    DEFAULT_OPERATIONS,
  } = require("@/features/views/constants/filter-operations");

  switch (attributeType) {
    case "TEXT":
    case "PERSONAL_NAME":
    case "EMAIL_ADDRESS":
    case "DOMAIN":
      return TEXT_OPERATIONS;
    case "NUMBER":
    case "CURRENCY":
    case "RATING":
      return NUMBER_OPERATIONS;
    case "DATETIME":
      return DATETIME_OPERATIONS;
    case "STATUS":
    case "SELECT":
    case "MULTI_SELECT":
      return STATUS_OPERATIONS;
    case "CHECKBOX":
      return CHECKBOX_OPERATIONS;
    case "RELATIONSHIP":
      if (
        relationshipType === "MANY_TO_MANY" ||
        relationshipType === "ONE_TO_MANY"
      ) {
        return RELATIONSHIP_MANY_OPERATIONS;
      } else if (
        relationshipType === "MANY_TO_ONE" ||
        relationshipType === "ONE_TO_ONE"
      ) {
        return RELATIONSHIP_ONE_OPERATIONS;
      }
      return DEFAULT_OPERATIONS;
    default:
      return DEFAULT_OPERATIONS;
  }
};
