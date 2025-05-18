import { format } from "date-fns";

import { getStatusColor } from "@/lib/utils/color-utils";

/**
 * Formats a date value based on whether it has a time component
 * @param {string|Date} value - Date value to format
 * @returns {string} - Formatted date string
 */
export const formatDateValue = (value) => {
  try {
    const date = new Date(value);
    const hasTimeComponent =
      date.getHours() !== 0 ||
      date.getMinutes() !== 0 ||
      date.getSeconds() !== 0;

    return format(date, hasTimeComponent ? "PPP p" : "PPP");
  } catch (error) {
    return value;
  }
};

/**
 * Formats a status value with its color
 * @param {string} value - Status value
 * @param {Array} options - Status options from attribute config
 * @returns {Object} - Formatted status with color
 */
export const formatStatusValue = (value, options) => {
  if (!value) return null;

  return {
    value,
    color: getStatusColor(value, options),
  };
};

/**
 * Formats a currency value
 * @param {number|string} value - Currency value
 * @returns {string} - Formatted currency string
 */
export const formatCurrencyValue = (value) => {
  return `$${parseFloat(value).toFixed(2)}`;
};

/**
 * Determines if value is a record text attribute
 * @param {Object} attribute - Attribute metadata
 * @returns {boolean} - True if record text attribute
 */
export const isRecordTextAttribute = (attribute) => {
  return attribute.id === attribute?.object?.recordTextAttributeId;
};
