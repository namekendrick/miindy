import { Edit3Icon } from "lucide-react";

export const FillInputTask = {
  type: "FILL_INPUT",
  label: "Fill input",
  icon: (props) => <Edit3Icon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web page",
      type: "BROWSER_INSTANCE",
      required: true,
    },
    {
      name: "Selector",
      type: "STRING",
      required: true,
    },
    {
      name: "Value",
      type: "STRING",
      required: true,
    },
  ],
  outputs: [
    {
      name: "Web page",
      type: "BROWSER_INSTANCE",
    },
  ],
};
