import { format } from "date-fns";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const DisplayValue = ({ value, attribute }) => {
  if (value === null || value === undefined || value === "") return null;

  const attributeType = attribute?.attributeType;

  switch (attributeType) {
    case "DATE":
      try {
        return <span>{format(new Date(value), "PPP")}</span>;
      } catch (error) {
        return <span>{value}</span>;
      }

    case "TIMESTAMP":
      try {
        return <span>{format(new Date(value), "PPP p")}</span>;
      } catch (error) {
        return <span>{value}</span>;
      }

    case "CHECKBOX":
      return value === true || value === "true" ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      );

    case "STATUS":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          {value}
        </Badge>
      );

    case "RELATIONSHIP":
    case "RECORD":
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="cursor-help underline decoration-dotted">
              {value}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Related Record</h4>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      );

    case "CURRENCY":
      return <span>${parseFloat(value).toFixed(2)}</span>;

    case "NUMBER":
    case "RATING":
      return <span>{value}</span>;

    default:
      return <span>{value}</span>;
  }
};
