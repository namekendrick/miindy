"use client";

import { useReactFlow } from "@xyflow/react";
import { useCallback, useMemo } from "react";

export const useNodeConfig = (nodeId) => {
  const { getNode, updateNodeData } = useReactFlow();
  const node = getNode(nodeId);

  const getInputValue = useCallback(
    (inputName, defaultValue = "") => {
      return node?.data?.inputs?.[inputName] ?? defaultValue;
    },
    [node],
  );

  const updateInput = useCallback(
    (inputName, value) => {
      if (!node) return;

      const currentInputs = node.data.inputs || {};
      updateNodeData(nodeId, {
        ...node.data,
        inputs: {
          ...currentInputs,
          [inputName]: value,
        },
      });
    },
    [node, nodeId, updateNodeData],
  );

  const updateInputs = useCallback(
    (inputUpdates) => {
      if (!node) return;

      const currentInputs = node.data.inputs || {};
      updateNodeData(nodeId, {
        ...node.data,
        inputs: {
          ...currentInputs,
          ...inputUpdates,
        },
      });
    },
    [node, nodeId, updateNodeData],
  );

  const removeInput = useCallback(
    (inputName, cleanupPredicate = null) => {
      if (!node) return;

      const currentInputs = node.data.inputs || {};
      const { [inputName]: removed, ...restInputs } = currentInputs;

      let cleanedInputs = restInputs;

      if (cleanupPredicate) {
        cleanedInputs = Object.keys(restInputs).reduce((acc, key) => {
          if (!cleanupPredicate(key)) {
            acc[key] = restInputs[key];
          }
          return acc;
        }, {});
      }

      updateNodeData(nodeId, {
        ...node.data,
        inputs: cleanedInputs,
      });
    },
    [node, nodeId, updateNodeData],
  );

  const cleanupInputs = useCallback(
    (cleanupPredicate) => {
      if (!node) return;

      const currentInputs = node.data.inputs || {};
      const cleanedInputs = Object.keys(currentInputs).reduce((acc, key) => {
        if (!cleanupPredicate(key)) {
          acc[key] = currentInputs[key];
        }
        return acc;
      }, {});

      updateNodeData(nodeId, {
        ...node.data,
        inputs: cleanedInputs,
      });
    },
    [node, nodeId, updateNodeData],
  );

  const inputs = useMemo(() => node?.data?.inputs || {}, [node]);

  return {
    node,
    inputs,
    getInputValue,
    updateInput,
    updateInputs,
    removeInput,
    cleanupInputs,
  };
};
