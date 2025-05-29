import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  Loader2Icon,
} from "lucide-react";

export const PhaseStatusBadge = ({ status }) => {
  switch (status) {
    case "PENDING":
      return <CircleDashedIcon size={20} className="stroke-muted-foreground" />;
    case "RUNNING":
      return (
        <Loader2Icon size={20} className="animate-spin stroke-yellow-500" />
      );
    case "FAILED":
      return <CircleXIcon size={20} className="stroke-destructive" />;
    case "COMPLETED":
      return <CircleCheckIcon size={20} className="stroke-green-500" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
};
