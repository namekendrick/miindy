import { BrainIcon } from "lucide-react";

export const ExtractDataWithAITask = {
  type: "EXTRACT_DATA_WITH_AI",
  label: "Extract data with AI",
  icon: (props) => <BrainIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Content",
      type: "STRING",
      required: true,
    },
    {
      name: "Credentials",
      type: "CREDENTIAL",
      required: true,
    },
    {
      name: "Prompt",
      type: "STRING",
      required: true,
      variant: "textarea",
    },
  ],
  outputs: [
    {
      name: "Extracted data",
      type: "STRING",
    },
  ],
};
