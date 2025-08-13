import { EditIcon } from "lucide-react";

export const UpdateRecordTask = {
  type: "UPDATE_RECORD",
  label: "Update record",
  icon: (props) => <EditIcon className="stroke-blue-400" {...props} />,
  isTrigger: false,
  credits: 2,
  inputs: [
    {
      name: "Object",
      type: "OBJECT_SELECT",
      required: true,
    },
    {
      name: "Record",
      type: "RECORD_SELECT",
      required: true,
    },
    {
      name: "Attributes",
      type: "ATTRIBUTE_SELECT",
      required: true,
    },
  ],
  outputs: [
    {
      name: "Updated record",
      type: "JSON",
      description: "The updated record data",
    },
    {
      name: "Success",
      type: "BOOLEAN",
      description: "Whether the update was successful",
    },
  ],
};
