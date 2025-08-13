"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNodeConfig } from "@/features/workflows/hooks/use-node-config";

export const RandomNumberConfig = ({ nodeId }) => {
  const { getInputValue, updateInput } = useNodeConfig(nodeId);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="minimum" className="text-sm font-normal">
          Minimum
        </Label>
        <Input
          id="minimum"
          type="number"
          value={getInputValue("Minimum")}
          onChange={(e) => updateInput("Minimum", e.target.value)}
          placeholder="0"
          className="text-sm"
        />
        <p className="text-muted-foreground text-xs">
          Minimum value (default: 0)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maximum" className="text-sm font-normal">
          Maximum
        </Label>
        <Input
          id="maximum"
          type="number"
          value={getInputValue("Maximum")}
          onChange={(e) => updateInput("Maximum", e.target.value)}
          placeholder="100"
          className="text-sm"
        />
        <p className="text-muted-foreground text-xs">
          Maximum value (default: 100)
        </p>
      </div>
    </div>
  );
};
