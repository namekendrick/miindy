export const ATTRIBUTE_TYPES = [
  { value: "status", label: "Status", description: "Status indicator" },
  { value: "user", label: "User", description: "User" },
  {
    value: "select",
    label: "Single Select",
    description: "Choose one option from a list",
  },
  {
    value: "multi_select",
    label: "Multi Select",
    description: "Choose multiple options",
  },
  { value: "text", label: "Text", description: "Simple text value" },
  { value: "date", label: "Date", description: "Date without time" },
  { value: "timestamp", label: "Date & Time", description: "Date with time" },
  { value: "number", label: "Number", description: "Numeric value" },
  { value: "currency", label: "Currency", description: "Monetary value" },
  { value: "checkbox", label: "Checkbox", description: "True/false value" },
  { value: "rating", label: "Rating", description: "Numeric rating (1-5)" },
  { value: "location", label: "Location", description: "Geographic location" },
  { value: "phone", label: "Phone", description: "Phone number" },
  { value: "record", label: "Record", description: "Reference another record" },
];
