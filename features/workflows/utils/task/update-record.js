import { EditIcon } from "lucide-react";

export const UpdateRecordTask = {
  type: "UPDATE_RECORD",
  label: "Update record",
  icon: (props) => <EditIcon className="stroke-blue-400" {...props} />,
  isTrigger: false,
  credits: 2,
  hasCustomConfig: true, // This will tell the system to use a custom configuration component
  inputs: [
    {
      name: "Object",
      type: "OBJECT_SELECT",
      helperText: "Select the object type",
      required: true,
      hideHandle: false,
    },
    {
      name: "Record",
      type: "RECORD_SELECT",
      helperText: "Select or search for a record",
      required: true,
      hideHandle: false,
    },
    {
      name: "Attributes",
      type: "ATTRIBUTE_SELECT",
      helperText: "Select attributes to update",
      required: true,
      hideHandle: false,
      multiple: true,
    },
    // Dynamic attribute inputs will be added by the custom config component
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
