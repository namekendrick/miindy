"use client";

import { X } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AttributeValueInput } from "@/features/workflows/components/attribute-value-input";

const AttributeInputsComponent = ({
  selectedAttributes,
  attributes,
  getInputValue,
  onAttributeValueChange,
  onRemoveAttribute,
  nodeId,
}) => {
  if (selectedAttributes.length === 0) return null;

  return (
    <>
      {selectedAttributes.map((attrId) => {
        const attribute = attributes.find((a) => a.id === attrId);
        if (!attribute) return null;

        const currentValue = getInputValue(`attribute_${attrId}`, "");

        return (
          <div key={attrId} className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor={`attr-${attrId}`} className="text-sm font-medium">
                {attribute.name}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onRemoveAttribute(attrId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <AttributeValueInput
              attribute={attribute}
              value={currentValue}
              onChange={(value) => onAttributeValueChange(attrId, value)}
              nodeId={nodeId}
            />
          </div>
        );
      })}
    </>
  );
};

AttributeInputsComponent.displayName = "AttributeInputs";

export const AttributeInputs = memo(AttributeInputsComponent);
