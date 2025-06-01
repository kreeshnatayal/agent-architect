'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  useReactFlow,
  ReactFlowProvider,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Toolbar } from '@/components/Toolbar';
import { CustomNode } from '@/components/CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const defaultEdgeOptions = {
  style: { stroke: '#2563eb' },
  type: 'smoothstep',
  animated: true,
  deletable: true,
};

function Flow() {
  const initialNodes = [
    {
      id: '1',
      type: 'custom',
      position: { x: 250, y: 250 },
      data: { 
        label: 'Start',
        type: 'server'
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    // Expose ReactFlow instance to window for node deletion
    // @ts-ignore
    window.reactFlowInstance = reactFlowInstance;
  }, [reactFlowInstance]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      const newEdge: Edge = {
        id: `edge-${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#2563eb' },
        deletable: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: {
          ...e.style,
          stroke: e.id === edge.id ? '#ef4444' : '#2563eb',
        },
      }))
    );
  }, [setEdges]);

  const onPaneClick = useCallback(() => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: {
          ...e.style,
          stroke: '#2563eb',
        },
      }))
    );
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${nodes.length + 1}`,
        type: 'custom',
        position,
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1),
          type: type
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, reactFlowInstance]
  );

  const onSave = async () => {
    try {
      const response = await fetch('/api/flowcharts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'My Flowchart',
          nodes,
          edges,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save flowchart');
      }
      
      alert('Flowchart saved successfully!');
    } catch (error) {
      console.error('Error saving flowchart:', error);
      alert('Failed to save flowchart');
    }
  };

  return (
    <div className="h-full w-full relative">
        <Toolbar onSave={onSave} />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        defaultEdgeOptions={defaultEdgeOptions}
          fitView
        className="bg-gray-50"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
  );
}

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </main>
  );
}
