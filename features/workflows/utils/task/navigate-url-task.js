import { Link2Icon } from "lucide-react";

export const NavigateUrlTask = {
  type: "NAVIGATE_URL",
  label: "Navigate Url",
  icon: (props) => <Link2Icon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web page",
      type: "BROWSER_INSTANCE",
      required: true,
    },
    {
      name: "URL",
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
