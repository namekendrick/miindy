export const CHECKBOX_OPERATIONS = [
  { value: "true", label: "Is checked" },
  { value: "false", label: "Is not checked" },
];

export const DATETIME_OPERATIONS = [
  { value: "is", label: "Is" },
  { value: "is_before", label: "Is before" },
  { value: "is_after", label: "Is after" },
  { value: "is_in_past", label: "Is in past" },
  { value: "is_in_future", label: "Is in future" },
  { value: "is_today", label: "Is today" },
  { value: "is_yesterday", label: "Is yesterday" },
  { value: "is_tomorrow", label: "Is tomorrow" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

export const DEFAULT_OPERATIONS = [
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Doesn't contain" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

export const NO_VALUE_OPERATIONS = [
  "is_empty",
  "is_not_empty",
  "is_in_past",
  "is_in_future",
  "is_yesterday",
  "is_today",
  "is_tomorrow",
  "true",
  "false",
];

export const NUMBER_OPERATIONS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Doesn't equal" },
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

export const RELATIONSHIP_MANY_OPERATIONS = [
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Doesn't contain" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

export const RELATIONSHIP_ONE_OPERATIONS = [
  { value: "equals", label: "Is" },
  { value: "not_equals", label: "Is not" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

export const STATUS_OPERATIONS = [
  { value: "equals", label: "Is" },
  { value: "not_equals", label: "Is not" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];

export const TEXT_OPERATIONS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Doesn't equal" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Doesn't contain" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
];
