"use client";

import {
  addEdge,
  Background,
  Controls,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";

import { DeletableEdge } from "@/features/workflows/components/edges/deletable-edge";
import { NodeComponent } from "@/features/workflows/components/nodes/node-component";
import { TASK_REGISTRY } from "@/features/workflows/constants/registry";
import { createFlowNode } from "@/features/workflows/utils/create-flow-node";

import "@xyflow/react/dist/style.css";

const nodeTypes = {
  MiindyNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid = [50, 50];
const fitViewOptions = { padding: 1 };

export const FlowEditor = ({ workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createFlowNode(taskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      const node = nodes.find((nd) => nd.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },
    [setEdges, updateNodeData, nodes],
  );

  const isValidConnection = useCallback(
    (connection) => {
      // No self-connections allowed
      if (connection.source === connection.target) {
        return false;
      }

      // Same taskParam type connection
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if (!source || !target) {
        console.error("invalid connection: source or target node not found");
        return false;
      }

      const sourceTask = TASK_REGISTRY[source.data.type];
      const targetTask = TASK_REGISTRY[target.data.type];

      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle,
      );

      const input = targetTask.inputs.find(
        (o) => o.name === connection.targetHandle,
      );

      if (input?.type !== output?.type) {
        console.error("invalid connection: type mismatch");
        return false;
      }

      const hasCycle = (node, visited = new Set()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      const detectedCycle = hasCycle(target);
      return !detectedCycle;
    },
    [nodes, edges],
  );

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {}
  }, [workflow.definition, setEdges, setNodes, setViewport]);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="bottom-left" fitViewOptions={fitViewOptions} />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};
