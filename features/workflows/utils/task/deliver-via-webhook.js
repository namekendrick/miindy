import { SendIcon } from "lucide-react";

export const DeliverViaWebhookTask = {
  type: "DELIVER_VIA_WEBHOOK",
  label: "Deliver via Webhook",
  icon: (props) => <SendIcon className="stroke-blue-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Target URL",
      type: "STRING",
      required: true,
    },
    {
      name: "Body",
      type: "STRING",
      required: true,
    },
  ],
  outputs: [],
};
