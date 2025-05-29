import { FileJson2Icon } from "lucide-react";

export const ReadPropertyFromJsonTask = {
  type: "READ_PROPERTY_FROM_JSON",
  label: "Read property from JSON",
  icon: (props) => <FileJson2Icon className="stroke-orange-400" {...props} />,
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
  ],
  outputs: [
    {
      name: "Property value",
      type: "STRING",
    },
  ],
};
