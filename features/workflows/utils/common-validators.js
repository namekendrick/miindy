/**
 * Common validation helpers for workflow executors
 */

import {
  WorkflowError,
  WORKFLOW_ERROR_TYPES,
} from "@/features/workflows/utils/error-handling";

/**
 * Validates that a required input is present and not empty
 */
export const validateRequiredInput = (value, inputName) => {
  if (!value || value === "" || value === null || value === undefined) {
    throw new WorkflowError(
      WORKFLOW_ERROR_TYPES.MISSING_INPUT,
      `Missing required input: ${inputName}`,
    );
  }

  return value;
};

/**
 * Validates that an input is a non-empty array
 */
export const validateRequiredArray = (value, inputName) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    throw new WorkflowError(
      WORKFLOW_ERROR_TYPES.MISSING_INPUT,
      `Missing required input: ${inputName} (must be a non-empty array)`,
    );
  }

  return value;
};

/**
 * Validates and parses a numeric input with optional default value
 */
export const validateNumericInput = (value, inputName, defaultValue = null) => {
  if (value === null || value === undefined || value === "")
    return defaultValue;

  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    throw new WorkflowError(
      WORKFLOW_ERROR_TYPES.INVALID_INPUT,
      `Invalid numeric value for ${inputName}: ${value}`,
    );
  }

  return parsed;
};

/**
 * Validates that a numeric range is valid (max > min)
 */
export const validateNumericRange = (
  minimum,
  maximum,
  minName = "Minimum",
  maxName = "Maximum",
) => {
  if (maximum <= minimum) {
    throw new WorkflowError(
      WORKFLOW_ERROR_TYPES.INVALID_INPUT,
      `Invalid range: ${maxName} (${maximum}) must be greater than ${minName} (${minimum})`,
    );
  }

  return { minimum, maximum };
};

/**
 * Validates and formats different attribute value types
 */
export const validateAttributeValue = (value, attribute) => {
  if (value === null || value === undefined || value === "") return null;

  switch (attribute.attributeType) {
    case "NUMBER":
    case "CURRENCY":
    case "RATING":
      const numValue = parseFloat(value);
      if (isNaN(numValue))
        throw new Error(`Invalid number value for ${attribute.name}`);

      return numValue;

    case "CHECKBOX":
      return value === true || value === "true" || value === 1 || value === "1";

    case "DATETIME":
      const date = new Date(value);
      if (isNaN(date.getTime()))
        throw new Error(`Invalid date value for ${attribute.name}`);

      return date.toISOString();

    case "STATUS":
      if (attribute.config?.options) {
        const validStatuses = attribute.config.options.map((opt) => opt.status);
        if (!validStatuses.includes(value)) {
          throw new Error(
            `Invalid status value for ${attribute.name}. Must be one of: ${validStatuses.join(", ")}`,
          );
        }
      }
      return value;

    case "TEXT":
    case "TEXTAREA":
    case "EMAIL":
    case "URL":
    case "PHONE":
    default:
      return String(value);
  }
};

/**
 * Validates a database record exists and belongs to the specified object
 */
export const validateRecordBelongsToObject = (
  record,
  expectedObjectId,
  recordId,
) => {
  if (!record) {
    throw new WorkflowError(
      WORKFLOW_ERROR_TYPES.DATABASE_ERROR,
      `Record not found: ${recordId}`,
    );
  }

  if (record.objectId !== expectedObjectId) {
    throw new WorkflowError(
      WORKFLOW_ERROR_TYPES.VALIDATION_ERROR,
      `Record ${recordId} does not belong to object ${expectedObjectId}`,
    );
  }

  return record;
};

/**
 * Validates that an attribute exists and is not read-only
 */
export const validateAttributeForUpdate = (attribute, attributeId) => {
  if (!attribute) throw new Error(`Attribute ${attributeId} not found`);

  if (attribute.isReadOnly) return false;

  return true;
};

/**
 * Helper to collect validation errors without throwing immediately
 */
export const createErrorCollector = () => {
  const errors = [];

  return {
    add: (error) => {
      if (error instanceof Error) {
        errors.push(error.message);
      } else {
        errors.push(String(error));
      }
    },

    hasErrors: () => errors.length > 0,

    getErrors: () => [...errors],

    throwIfErrors: (message = "Validation failed") => {
      if (errors.length > 0) {
        throw new WorkflowError(
          WORKFLOW_ERROR_TYPES.VALIDATION_ERROR,
          `${message}: ${errors.join("; ")}`,
          undefined,
          { validationErrors: errors },
        );
      }
    },
  };
};
