import { DicesIcon } from "lucide-react";

export const RandomNumberTask = {
  type: "RANDOM_NUMBER",
  label: "Random number",
  icon: (props) => <DicesIcon className="stroke-purple-400" {...props} />,
  isTrigger: false,
  credits: 1,
  inputs: [
    {
      name: "Minimum",
      type: "NUMBER",
      helperText: "Minimum value (default: 0)",
      required: false,
      hideHandle: false,
    },
    {
      name: "Maximum",
      type: "NUMBER",
      helperText: "Maximum value (default: 100)",
      required: false,
      hideHandle: false,
    },
  ],
  outputs: [{ name: "Random number", type: "NUMBER" }],
};
