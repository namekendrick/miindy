import { DatabaseIcon } from "lucide-react";

export const AddPropertyToJsonTask = {
  type: "ADD_PROPERTY_TO_JSON",
  label: "Add property to JSON",
  icon: (props) => <DatabaseIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "JSON",
      type: "STRING",
      required: true,
    },
    {
      name: "Property name",
      type: "STRING",
      required: true,
    },
    {
      name: "Property value",
      type: "STRING",
      required: true,
    },
  ],
  outputs: [
    {
      name: "Upadte JSON",
      type: "STRING",
    },
  ],
};
