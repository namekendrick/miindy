import { MousePointerClick } from "lucide-react";

export const ClickElementTask = {
  type: "CLICK_ELEMENT",
  label: "Click Element",
  icon: (props) => (
    <MousePointerClick className="stroke-orange-400" {...props} />
  ),
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
