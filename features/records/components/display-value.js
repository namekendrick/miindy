import { format } from "date-fns";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RelatedRecordBadge } from "@/features/records/components/related-record-badge";

export const DisplayValue = ({ value, attribute, recordId }) => {
  const attributeType = attribute.attributeType;
  const isRecordTextAttribute =
    attribute.id === attribute?.object?.recordTextAttributeId;

  if (isRecordTextAttribute) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-help underline decoration-dotted">
            {value}
          </span>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Record Title</h4>
            <p className="text-muted-foreground text-sm">{value}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

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

    case "STATUS":
      return (
        value && (
          <Badge className="bg-primary/5 text-primary hover:bg-primary/10 w-full rounded-xs">
            {value}
          </Badge>
        )
      );

    case "RELATIONSHIP":
    case "RECORD":
      return (
        <RelatedRecordBadge
          recordId={recordId}
          attribute={attribute}
          displayValue
        />
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
