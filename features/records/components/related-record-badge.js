import { X } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useGetRelatedRecords } from "@/features/records/api/use-get-related-records";
import { cn } from "@/lib/utils";

export const RelatedRecordBadge = ({
  recordId,
  attribute,
  isEditing,
  handleDelete,
  displayValue,
}) => {
  const { data, isLoading } = useGetRelatedRecords({
    recordId,
    attributeId: attribute.id,
  });

  if (isLoading) return <Skeleton className="h-6 w-24" />;

  return (
    <div
      className={cn("flex flex-col gap-1", displayValue && "w-fit flex-row")}
    >
      {data.map((relatedRecord) => {
        const recordTextAttributeId =
          relatedRecord.record.object.recordTextAttributeId;
        const recordTextValue =
          relatedRecord.record.values.find(
            (v) => v.attributeId === recordTextAttributeId,
          )?.value?.value || "Unnamed record";

        return (
          <div key={relatedRecord.id} className="flex w-full items-center">
            <HoverCard align="start">
              <HoverCardTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-primary/5 hover:bg-primary/10 flex cursor-help items-center"
                >
                  <span>{recordTextValue}</span>
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent align="start" className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    {relatedRecord.record.object.singular}
                  </h4>
                  <div className="text-muted-foreground space-y-1 text-sm">
                    {relatedRecord.record.values.slice(0, 3).map((value) => (
                      <div key={value.id} className="flex justify-between">
                        <span className="font-medium">
                          {value.attribute?.name || "Attribute"}:
                        </span>
                        <span>{value.value?.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            {isEditing && (
              <X
                className="text-muted-foreground hover:text-destructive ml-auto h-4 w-4 cursor-pointer"
                onClick={() => handleDelete(relatedRecord.relationId)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
