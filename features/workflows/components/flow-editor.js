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
import { useFocusedNode } from "@/features/workflows/hooks/use-focused-node";
import { createFlowNode } from "@/features/workflows/utils/create-flow-node";

import "@xyflow/react/dist/style.css";

const nodeTypes = { MiindyNode: NodeComponent };

const edgeTypes = { default: DeletableEdge };

const snapGrid = [50, 50];
const fitViewOptions = { padding: 1 };

export const FlowEditor = ({ workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();
  const { setFocusedNode, clearFocusedNode } = useFocusedNode();

  // Sync our focus state with ReactFlow's selection
  useEffect(() => {
    const selectedNode = nodes.find((node) => node.selected);
    if (selectedNode) {
      setFocusedNode(selectedNode.id);
    } else {
      clearFocusedNode();
    }
  }, [nodes, setFocusedNode, clearFocusedNode]);

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
      newNode.selected = true;
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges],
  );

  const isValidConnection = useCallback(
    (connection) => {
      if (connection.source === connection.target) return false;

      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);

      if (!source || !target) return false;

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
    <main className="relative h-full w-full">
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
      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto rounded-lg bg-white/90 p-8 text-center shadow-lg dark:bg-gray-900/90">
            <h3 className="mb-2 text-lg font-semibold">
              Start Building Your Workflow
            </h3>
            <p className="text-muted-foreground">
              Drag a trigger from the left sidebar to begin
            </p>
          </div>
        </div>
      )}
    </main>
  );
};
