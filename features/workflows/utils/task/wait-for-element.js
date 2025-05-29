import { EyeIcon } from "lucide-react";

export const WaitForElementTask = {
  type: "WAIT_FOR_ELEMENT",
  label: "Wait for element",
  icon: (props) => <EyeIcon className="stroke-amber-400" {...props} />,
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
      name: "Visibility",
      type: "SELECT",
      hideHandle: true,
      required: true,
      options: [
        { label: "Visible", value: "visible" },
        { label: "Hidden", value: "hidden" },
      ],
    },
  ],
  outputs: [
    {
      name: "Web page",
      type: "BROWSER_INSTANCE",
    },
  ],
};
