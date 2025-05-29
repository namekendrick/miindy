import { TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
  type: "EXTRACT_TEXT_FROM_ELEMENT",
  label: "Extract text from element",
  icon: (props) => <TextIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: "STRING",
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: "STRING",
      required: true,
    },
  ],
  outputs: [
    {
      name: "Extracted text",
      type: "STRING",
    },
  ],
};
