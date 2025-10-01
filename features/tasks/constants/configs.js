import {
  CheckCircle2,
  Circle,
  CircleDot,
  CircleDashed,
  Minus,
  SignalLow,
  SignalMedium,
  SignalHigh,
  CircleAlert,
} from "lucide-react";

export const PRIORITY = {
  NONE: {
    icon: Minus,
    label: "None",
  },
  LOW: {
    icon: SignalLow,
    label: "Low",
  },
  MEDIUM: {
    icon: SignalMedium,
    label: "Medium",
  },
  HIGH: {
    icon: SignalHigh,
    label: "High",
  },
  URGENT: {
    icon: CircleAlert,
    label: "Urgent",
  },
};

export const STATUS = {
  BACKLOG: {
    icon: CircleDashed,
    label: "Backlog",
  },
  TODO: {
    icon: Circle,
    label: "To Do",
  },
  IN_PROGRESS: {
    icon: CircleDot,
    label: "In Progress",
  },
  DONE: {
    icon: CheckCircle2,
    label: "Done",
  },
};
