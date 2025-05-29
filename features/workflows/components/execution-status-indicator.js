import { cn } from "@/lib/utils";

const indicatorColors = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  FAILED: "bg-red-400",
  COMPLETED: "bg-emerald-600",
};

export const ExecutionStatusIndicator = ({ status }) => {
  return (
    <div className={cn("h-2 w-2 rounded-full", indicatorColors[status])} />
  );
};

const labelColors = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  FAILED: "text-red-400",
  COMPLETED: "text-emerald-600",
};

export const ExecutionStatusLabel = ({ status }) => {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
};
