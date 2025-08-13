"use client";

import { useReactFlow } from "@xyflow/react";
import { useState, useMemo, useCallback } from "react";

import { useGetObjects } from "@/features/objects/api/use-get-objects";
import { useGetRecord } from "@/features/records/api/use-get-record";
import { useSearchRecords } from "@/features/records/api/use-search-records";
import { useGetObjectAttributes } from "@/features/workflows/api/use-get-object-attributes";
import { AttributeInputs } from "@/features/workflows/components/attribute-inputs";
import { AttributesSelector } from "@/features/workflows/components/selectors/attributes-selector";
import { ObjectSelector } from "@/features/workflows/components/selectors/object-selector";
import { RecordSelector } from "@/features/workflows/components/selectors/record-selector";
import { useNodeConfig } from "@/features/workflows/hooks/use-node-config";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const UpdateRecordConfig = ({ nodeId }) => {
  const workspaceId = useWorkspaceId();
  const { getNode, updateNodeData } = useReactFlow();
  const node = getNode(nodeId);

  const { getInputValue, updateInput, removeInput } = useNodeConfig(nodeId);

  const [recordSearchTerm, setRecordSearchTerm] = useState("");
  const [attributeSearchTerm, setAttributeSearchTerm] = useState("");

  const selectedObjectId = getInputValue("Object", null);
  const selectedRecordId = getInputValue("Record", null);
  const selectedAttributes = getInputValue("Attributes", []);

  const { data: objects, isLoading: objectsLoading } =
    useGetObjects(workspaceId);

  const selectedObject = useMemo(() => {
    if (!objects || !selectedObjectId) return null;
    return objects.find((obj) => obj.id === selectedObjectId);
  }, [objects, selectedObjectId]);

  const { data: searchResults, isLoading: recordsLoading } = useSearchRecords(
    {
      objectId: selectedObjectId,
      workspaceId: workspaceId,
      searchTerm: recordSearchTerm,
    },
    {
      enabled: !!selectedObjectId,
    },
  );

  const { data: selectedRecord } = useGetRecord({
    id: selectedRecordId,
    workspaceId: workspaceId,
  });

  const { data: attributesData } = useGetObjectAttributes(
    workspaceId,
    selectedObject?.type,
    {
      enabled: !!selectedObject?.type,
    },
  );

  const attributes = attributesData?.attributes || [];

  const filteredAttributes = useMemo(() => {
    if (!attributeSearchTerm) return attributes;
    return attributes.filter((attr) =>
      attr.name.toLowerCase().includes(attributeSearchTerm.toLowerCase()),
    );
  }, [attributes, attributeSearchTerm]);

  const handleObjectSelect = useCallback(
    (objectId) => {
      const currentInputs = node?.data?.inputs || {};

      const cleanedInputs = Object.keys(currentInputs).reduce((acc, key) => {
        if (!key.startsWith("attribute_")) {
          acc[key] = currentInputs[key];
        }
        return acc;
      }, {});

      updateNodeData(nodeId, {
        ...node.data,
        inputs: {
          ...cleanedInputs,
          Object: objectId,
          Record: null,
          Attributes: [],
        },
      });

      setRecordSearchTerm("");
    },
    [node, nodeId, updateNodeData],
  );

  const handleRecordSelect = useCallback(
    (recordId) => updateInput("Record", recordId),
    [updateInput],
  );

  const handleAttributeToggle = useCallback(
    (attributeId) => {
      const newAttributes = selectedAttributes.includes(attributeId)
        ? selectedAttributes.filter((id) => id !== attributeId)
        : [...selectedAttributes, attributeId];

      if (
        selectedAttributes.includes(attributeId) &&
        !newAttributes.includes(attributeId)
      ) {
        removeInput(`attribute_${attributeId}`);
      }

      updateInput("Attributes", newAttributes);
    },
    [selectedAttributes, removeInput, updateInput],
  );

  const handleAttributeValueChange = useCallback(
    (attributeId, value) => updateInput(`attribute_${attributeId}`, value),
    [updateInput],
  );

  const handleRemoveAttribute = useCallback(
    (attributeId) => {
      const newAttrs = selectedAttributes.filter((id) => id !== attributeId);
      updateInput("Attributes", newAttrs);
    },
    [selectedAttributes, updateInput],
  );

  const getRecordDisplayName = useCallback((record) => {
    if (!record) return "Unnamed record";

    const recordTextAttributeId = record.object?.recordTextAttributeId;
    if (!recordTextAttributeId) return `Record ${record.id}`;

    const textValue = record.values?.find(
      (v) => v.attributeId === recordTextAttributeId,
    )?.value?.value;

    return textValue || `Record ${record.id}`;
  }, []);

  const selectedRecordDisplayName = useMemo(
    () => getRecordDisplayName(selectedRecord),
    [getRecordDisplayName, selectedRecord],
  );

  return (
    <div className="space-y-6">
      <ObjectSelector
        objects={objects}
        selectedObject={selectedObject}
        selectedObjectId={selectedObjectId}
        isLoading={objectsLoading}
        onSelect={handleObjectSelect}
        required={true}
        label="Object"
        placeholder="Select an object..."
      />

      {selectedObjectId && (
        <RecordSelector
          records={searchResults}
          selectedRecordId={selectedRecordId}
          selectedRecordDisplayName={selectedRecordDisplayName}
          isLoading={recordsLoading}
          onSelect={handleRecordSelect}
          searchTerm={recordSearchTerm}
          onSearchChange={setRecordSearchTerm}
          required={true}
          label="Record"
          placeholder="Select a record..."
          getRecordDisplayName={getRecordDisplayName}
        />
      )}

      {selectedObjectId && selectedRecordId && (
        <AttributesSelector
          attributes={filteredAttributes}
          selectedAttributes={selectedAttributes}
          onToggle={handleAttributeToggle}
          searchTerm={attributeSearchTerm}
          onSearchChange={setAttributeSearchTerm}
          required={true}
          label="Attributes to update"
          placeholder="Select attributes..."
        />
      )}

      <AttributeInputs
        selectedAttributes={selectedAttributes}
        attributes={attributes}
        getInputValue={getInputValue}
        onAttributeValueChange={handleAttributeValueChange}
        onRemoveAttribute={handleRemoveAttribute}
        nodeId={nodeId}
      />
    </div>
  );
};
