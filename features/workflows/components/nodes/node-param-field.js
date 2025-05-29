"use client";

import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

import { BrowserInstanceParam } from "@/features/workflows/components/nodes/param/browser-instance-param";
import { CredentialsParam } from "@/features/workflows/components/nodes/param/credentials-param";
import { SelectParam } from "@/features/workflows/components/nodes/param/select-param";
import { StringParam } from "@/features/workflows/components/nodes/param/string-param";

export const NodeParamField = ({ param, nodeId, disabled }) => {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId);
  const value = node?.data.inputs?.[param.name];

  const updateNodeParamValue = useCallback(
    (newValue) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [nodeId, updateNodeData, param.name, node?.data.inputs],
  );

  switch (param.type) {
    case "STRING":
      return (
        <StringParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case "BROWSER_INSTANCE":
      return (
        <BrowserInstanceParam
          param={param}
          value={""}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    case "SELECT":
      return (
        <SelectParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case "CREDENTIAL":
      return (
        <CredentialsParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-muted-foreground text-xs">Not implemented</p>
        </div>
      );
  }
};
