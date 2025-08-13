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
      required: false,
    },
    {
      name: "Maximum",
      type: "NUMBER",
      required: false,
    },
  ],
  outputs: [{ name: "Random number", type: "NUMBER" }],
};
