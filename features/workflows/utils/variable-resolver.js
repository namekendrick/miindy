/**
 * Shared variable resolution utilities for both client and server-side workflow processing
 * Consolidates variable handling logic to maintain consistency and reduce duplication
 */

/**
 * Checks if a value is a variable reference
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is a variable reference
 */
export const isVariableReference = (value) => {
  return value && typeof value === "object" && value.type === "variable";
};

/**
 * Resolves a variable reference to its actual value from the execution environment
 * @param {any} value - The value to resolve (could be a variable reference or static value)
 * @param {Object} environment - The execution environment containing phase outputs
 * @returns {any} The resolved value or null if resolution fails
 */
export const resolveVariableValue = (value, environment) => {
  if (!isVariableReference(value)) {
    return value;
  }

  const { nodeId: sourceNodeId, outputName } = value;

  if (
    environment.phases?.[sourceNodeId]?.outputs &&
    outputName in environment.phases[sourceNodeId].outputs
  ) {
    const resolvedValue = environment.phases[sourceNodeId].outputs[outputName];
    return resolvedValue !== undefined ? resolvedValue : null;
  }

  console.error(
    `Failed to resolve variable reference: ${sourceNodeId}.${outputName}`,
  );

  return null;
};

/**
 * Resolves all variable references in an inputs object
 * @param {Object} inputs - Object containing input values (may include variable references)
 * @param {Object} environment - The execution environment
 * @returns {Object} Object with all variable references resolved
 */
export const resolveAllInputs = (inputs, environment) => {
  const resolved = {};

  for (const [key, value] of Object.entries(inputs))
    resolved[key] = resolveVariableValue(value, environment);

  return resolved;
};

/**
 * Resolves inputs for a specific phase, handling both defined inputs and dynamic attributes
 * This is the main resolution function used during workflow execution
 * @param {Object} node - The workflow node
 * @param {Object} environment - The execution environment
 * @param {Array} edges - The workflow edges for fallback resolution
 * @param {Array} taskInputs - The task definition inputs
 * @returns {Object} Resolved inputs ready for execution
 */
export const resolvePhaseInputs = (node, environment, edges, taskInputs) => {
  const resolvedInputs = {};

  for (const input of taskInputs) {
    if (input.type === "BROWSER_INSTANCE") continue;

    const inputValue = node.data.inputs?.[input.name];

    if (inputValue !== undefined) {
      resolvedInputs[input.name] = resolveVariableValue(
        inputValue,
        environment,
      );
      continue;
    }

    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name,
    );

    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "node id:", node.id);
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source]?.outputs?.[
        connectedEdge.sourceHandle
      ];

    resolvedInputs[input.name] = outputValue;
  }

  if (node.data.inputs) {
    const selectedAttributes = resolvedInputs.Attributes;

    Object.keys(node.data.inputs).forEach((inputName) => {
      if (resolvedInputs.hasOwnProperty(inputName)) return;

      if (inputName.startsWith("attribute_")) {
        const attributeId = inputName.replace("attribute_", "");
        if (
          selectedAttributes &&
          Array.isArray(selectedAttributes) &&
          selectedAttributes.includes(attributeId)
        ) {
          const value = node.data.inputs[inputName];
          resolvedInputs[inputName] = resolveVariableValue(value, environment);
        }
      } else {
        const value = node.data.inputs[inputName];
        resolvedInputs[inputName] = resolveVariableValue(value, environment);
      }
    });
  }

  return resolvedInputs;
};

/**
 * Creates a variable reference object
 * @param {Object} variable - Variable object with nodeId and outputName
 * @returns {Object} Formatted variable reference
 */
export const createVariableReference = (variable) => {
  return {
    type: "variable",
    nodeId: variable.nodeId,
    outputName: variable.outputName,
  };
};

/**
 * Parses a variable reference to extract nodeId and outputName
 * @param {any} value - The value to parse
 * @returns {Object|null} Parsed reference or null if not a variable reference
 */
export const parseVariableReference = (value) => {
  if (!isVariableReference(value)) return null;
  return {
    nodeId: value.nodeId,
    outputName: value.outputName,
  };
};
