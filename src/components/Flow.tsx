import { ReactFlow, Background, Controls, Panel, useNodesState, useEdgesState, Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from './CustomNode';
import { ToolPanel } from './ToolPanel';
import { useState } from 'react';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 5 },
    data: { label: 'Database', type: 'database' },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: { label: 'Server', type: 'server' },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: { label: 'Container', type: 'container' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 25,
      height: 25,
      color: '#2563eb',
    },
    style: { stroke: '#2563eb', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 25,
      height: 25,
      color: '#2563eb',
    },
    style: { stroke: '#2563eb', strokeWidth: 2 },
  },
];

export function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = (params: any) => {
    const newEdge = {
      ...params,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 25,
        height: 25,
        color: '#2563eb',
      },
      style: { stroke: '#2563eb', strokeWidth: 2 },
    };
    setEdges((eds) => [...eds, newEdge]);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position,
      data: { label: type, type: type.toLowerCase() },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background color="#94a3b8" gap={16} size={1} />
        <Controls className="bg-white shadow-lg rounded-lg p-1" />
        <Panel position="top-left" className="bg-white shadow-lg rounded-lg p-4">
          <ToolPanel />
        </Panel>
      </ReactFlow>
    </div>
  );
} 