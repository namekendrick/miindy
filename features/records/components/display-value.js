import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RelatedRecordBadge } from "@/features/records/components/related-record-badge";
import {
  formatDateValue,
  formatStatusValue,
  formatCurrencyValue,
  isRecordTextAttribute,
} from "@/features/records/utils/value-formatters";

export const DisplayValue = ({ value, attribute, recordId }) => {
  const attributeType = attribute.attributeType;

  if (isRecordTextAttribute(attribute)) {
    return <RecordTextDisplay value={value} />;
  }

  switch (attributeType) {
    case "DATETIME":
      return <span className="select-none">{formatDateValue(value)}</span>;

    case "STATUS":
      const formattedStatus = formatStatusValue(
        value,
        attribute.config?.options,
      );
      if (!formattedStatus) return null;

      return (
        <Badge
          variant="outline"
          className="flex max-w-full items-center gap-1.5 rounded-md px-2 py-0.5 font-medium"
        >
          <div
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: formattedStatus.color }}
          />
          <span className="truncate">{formattedStatus.value}</span>
        </Badge>
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
      return <span>{formatCurrencyValue(value)}</span>;

    case "NUMBER":
    case "RATING":
      return <span>{value}</span>;

    default:
      return <span>{value}</span>;
  }
};

const RecordTextDisplay = ({ value }) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <span className="cursor-help underline decoration-dotted select-none">
        {value}
      </span>
    </HoverCardTrigger>
    <HoverCardContent align="start" className="w-80 select-text">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Record Title</h4>
        <p className="text-muted-foreground text-sm">{value}</p>
      </div>
    </HoverCardContent>
  </HoverCard>
);
