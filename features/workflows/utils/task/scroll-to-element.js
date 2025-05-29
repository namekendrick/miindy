import { ArrowUpIcon } from "lucide-react";

export const ScrollToElementTask = {
  type: "SCROLL_TO_ELEMENT",
  label: "Scroll to element",
  icon: (props) => <ArrowUpIcon className="stroke-orange-400" {...props} />,
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
  ],
  outputs: [
    {
      name: "Web page",
      type: "BROWSER_INSTANCE",
    },
  ],
};
