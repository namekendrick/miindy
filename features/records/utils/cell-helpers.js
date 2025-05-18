/**
 * Handles saving edited value
 * @param {boolean} isEditing - Whether cell is in edit mode
 * @param {Function} onSave - Save callback function
 * @param {string} recordId - Record ID
 * @param {string} attributeId - Attribute ID
 * @param {any} editValue - Edited value
 * @returns {void}
 */
export const handleSaveCell = (
  isEditing,
  onSave,
  recordId,
  attributeId,
  editValue,
) => {
  if (isEditing) {
    onSave(recordId, attributeId, editValue);
  }
};

/**
 * Determines if editing should be exited
 * @param {string} attributeType - Type of attribute
 * @returns {boolean} - Whether to exit editing mode
 */
export const shouldExitEditing = (attributeType) => {
  return !["RELATIONSHIP", "RECORD"].includes(attributeType);
};

/**
 * Creates formatted options for Status dropdown
 * @param {Array} statusOptions - Status options from attribute config
 * @param {boolean} isRequired - Whether the attribute is required
 * @returns {Array} - Formatted options for dropdown
 */
export const formatStatusOptions = (statusOptions, isRequired) => {
  if (!statusOptions || !Array.isArray(statusOptions)) {
    return [];
  }

  const formattedOptions = statusOptions.map((option) => ({
    label: option.status,
    value: option.status,
    color: option.color,
  }));

  if (!isRequired) {
    formattedOptions.unshift({ label: "Empty", value: "" });
  }

  return formattedOptions;
};
