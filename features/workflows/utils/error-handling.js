/**
 * Standardized error handling utilities for workflow executors
 */

// Error types for workflow execution
export const WORKFLOW_ERROR_TYPES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_INPUT: "MISSING_INPUT",
  INVALID_INPUT: "INVALID_INPUT",
  DATABASE_ERROR: "DATABASE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  PERMISSION_ERROR: "PERMISSION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

export const ERROR_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};

/**
 * Creates a standardized workflow error
 */
export class WorkflowError extends Error {
  constructor(type, message, severity = ERROR_SEVERITY.MEDIUM, details = {}) {
    super(message);
    this.name = "WorkflowError";
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Input validation helper for executors
 */
export const validateExecutorInputs = (environment, requiredInputs) => {
  const errors = [];
  const inputs = {};

  for (const inputConfig of requiredInputs) {
    const {
      name,
      type,
      required = true,
      validator,
      defaultValue,
    } = inputConfig;
    let value = environment.getInput(name);

    // Apply default value if input is not provided
    if (
      (value === undefined || value === null || value === "") &&
      defaultValue !== undefined
    ) {
      value = defaultValue;
    }

    // Check required inputs
    if (required && (value === undefined || value === null || value === "")) {
      errors.push({
        type: WORKFLOW_ERROR_TYPES.MISSING_INPUT,
        message: `Missing required input: ${name}`,
        inputName: name,
      });
      continue;
    }

    // Skip validation if input is not provided and not required and no default
    if (
      !required &&
      (value === undefined || value === null || value === "") &&
      defaultValue === undefined
    ) {
      inputs[name] = null;
      continue;
    }

    // Type validation
    if (type && value !== null && value !== undefined) {
      switch (type) {
        case "string":
          if (typeof value !== "string") {
            errors.push({
              type: WORKFLOW_ERROR_TYPES.INVALID_INPUT,
              message: `Input '${name}' must be a string`,
              inputName: name,
              expectedType: "string",
              actualValue: value,
            });
            continue;
          }
          break;
        case "number":
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            errors.push({
              type: WORKFLOW_ERROR_TYPES.INVALID_INPUT,
              message: `Input '${name}' must be a valid number`,
              inputName: name,
              expectedType: "number",
              actualValue: value,
            });
            continue;
          }
          inputs[name] = numValue;
          continue;
        case "boolean":
          if (typeof value !== "boolean") {
            if (value === "true" || value === "1" || value === 1) {
              inputs[name] = true;
            } else if (value === "false" || value === "0" || value === 0) {
              inputs[name] = false;
            } else {
              errors.push({
                type: WORKFLOW_ERROR_TYPES.INVALID_INPUT,
                message: `Input '${name}' must be a boolean`,
                inputName: name,
                expectedType: "boolean",
                actualValue: value,
              });
              continue;
            }
          } else {
            inputs[name] = value;
          }
          break;
        case "array":
          if (!Array.isArray(value)) {
            errors.push({
              type: WORKFLOW_ERROR_TYPES.INVALID_INPUT,
              message: `Input '${name}' must be an array`,
              inputName: name,
              expectedType: "array",
              actualValue: value,
            });
            continue;
          }
          break;
      }
    }

    // Custom validation
    if (validator && typeof validator === "function") {
      try {
        const validationResult = validator(value);
        if (validationResult !== true) {
          errors.push({
            type: WORKFLOW_ERROR_TYPES.INVALID_INPUT,
            message: validationResult || `Invalid value for input '${name}'`,
            inputName: name,
            actualValue: value,
          });
          continue;
        }
      } catch (error) {
        errors.push({
          type: WORKFLOW_ERROR_TYPES.INVALID_INPUT,
          message: `Validation error for input '${name}': ${error.message}`,
          inputName: name,
          actualValue: value,
        });
        continue;
      }
    }

    inputs[name] = value;
  }

  return { isValid: errors.length === 0, errors, inputs };
};

/**
 * Standardized error handler for executors
 */
export const handleExecutorError = (environment, error, context = {}) => {
  let workflowError;

  if (error instanceof WorkflowError) {
    workflowError = error;
  } else {
    let errorType = WORKFLOW_ERROR_TYPES.UNKNOWN_ERROR;

    const errorMessage = error.message?.toLowerCase() || "";

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("does not exist")
    ) {
      errorType = WORKFLOW_ERROR_TYPES.DATABASE_ERROR;
    } else if (
      errorMessage.includes("permission") ||
      errorMessage.includes("unauthorized")
    ) {
      errorType = WORKFLOW_ERROR_TYPES.PERMISSION_ERROR;
    } else if (
      errorMessage.includes("network") ||
      errorMessage.includes("timeout")
    ) {
      errorType = WORKFLOW_ERROR_TYPES.NETWORK_ERROR;
    }

    workflowError = new WorkflowError(
      errorType,
      error.message || "An unknown error occurred",
      ERROR_SEVERITY.MEDIUM,
      { originalError: error, context },
    );
  }

  // Log the error with appropriate level
  switch (workflowError.severity) {
    case ERROR_SEVERITY.LOW:
      environment.log.warn(workflowError.message);
      break;
    case ERROR_SEVERITY.MEDIUM:
      environment.log.error(workflowError.message);
      break;
    case ERROR_SEVERITY.HIGH:
      environment.log.error(`CRITICAL: ${workflowError.message}`);
      break;
    default:
      environment.log.error(workflowError.message);
  }

  // Set standard outputs
  environment.setOutput("Success", false);
  environment.setOutput("Error", {
    type: workflowError.type,
    message: workflowError.message,
    severity: workflowError.severity,
    timestamp: workflowError.timestamp,
    details: workflowError.details,
  });

  return workflowError;
};

/**
 * Success handler for executors
 */
export const handleExecutorSuccess = (environment, result, message) => {
  environment.log.info(message || "Operation completed successfully");
  environment.setOutput("Success", true);

  if (result !== undefined) {
    if (
      typeof result === "object" &&
      result !== null &&
      !Array.isArray(result)
    ) {
      Object.entries(result).forEach(([key, value]) => {
        environment.setOutput(key, value);
      });
    } else {
      environment.setOutput("Result", result);
    }
  }

  return true;
};

/**
 * Wrapper function to standardize executor implementation
 */
export const createStandardExecutor = (executorFn, config = {}) => {
  const {
    requiredInputs = [],
    name = "Unknown Executor",
    validateInputs = true,
  } = config;

  return async (environment) => {
    try {
      // Input validation if configured
      if (validateInputs && requiredInputs.length > 0) {
        const validation = validateExecutorInputs(environment, requiredInputs);

        if (!validation.isValid) {
          const errorMessages = validation.errors
            .map((e) => e.message)
            .join("; ");
          throw new WorkflowError(
            WORKFLOW_ERROR_TYPES.VALIDATION_ERROR,
            `Input validation failed: ${errorMessages}`,
            ERROR_SEVERITY.MEDIUM,
            { validationErrors: validation.errors },
          );
        }

        return await executorFn(environment, validation.inputs);
      }

      return await executorFn(environment);
    } catch (error) {
      handleExecutorError(environment, error, { executorName: name });
      return false;
    }
  };
};
