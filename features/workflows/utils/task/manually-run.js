import { PlayIcon } from "lucide-react";

export const ManuallyRunTask = {
  type: "MANUALLY_RUN",
  label: "Manually run",
  icon: (props) => <PlayIcon className="stroke-blue-400" {...props} />,
  isTrigger: true,
  credits: 0,
  inputs: [],
  outputs: [{ name: "Flow started", type: "TRIGGER" }],
};
