import { Handle, Position } from 'reactflow';
import {
  ServerIcon,
  CubeIcon,
  CodeBracketIcon,
  CircleStackIcon,
  CloudIcon,
  CommandLineIcon,
  BeakerIcon,
  CpuChipIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  CodeBracketSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Map node types to their corresponding icons
const iconMap: Record<string, IconComponent> = {
  // Infrastructure & Cloud
  aws: CloudIcon,
  azure: CloudIcon,
  gcp: CloudIcon,
  kubernetes: CubeIcon,
  docker: CubeIcon,
  jenkins: ServerIcon,
  git: CodeBracketSquareIcon,
  github: CodeBracketSquareIcon,
  gitlab: CodeBracketSquareIcon,
  
  // Languages & Frameworks
  python: CodeBracketIcon,
  java: CodeBracketIcon,
  cpp: CodeBracketIcon,
  javascript: CodeBracketIcon,
  typescript: CodeBracketIcon,
  react: CodeBracketIcon,
  nextjs: CodeBracketIcon,
  nodejs: CodeBracketIcon,
  flask: BeakerIcon,
  springboot: CodeBracketIcon,
  
  // Databases & Storage
  mongodb: CircleStackIcon,
  postgresql: CircleStackIcon,
  mysql: CircleStackIcon,
  redis: CircleStackIcon,
  
  // DevOps & Tools
  linux: CommandLineIcon,
  nginx: ServerIcon,
  apache: ServerIcon,
  terraform: WrenchScrewdriverIcon,
  ansible: WrenchScrewdriverIcon,
  
  // Monitoring & Logging
  prometheus: CpuChipIcon,
  grafana: GlobeAltIcon,
  elk: CircleStackIcon,
};

interface CustomNodeProps {
  data: {
    label: string;
    type: string;
  };
  id: string;
}

export function CustomNode({ data, id }: CustomNodeProps) {
  const Icon = iconMap[data.type] || ServerIcon; // Fallback to ServerIcon if type not found

  const onDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    // @ts-expect-error - ReactFlow instance is exposed to window for node deletion
    const reactFlowInstance = window.reactFlowInstance;
    if (reactFlowInstance) {
      reactFlowInstance.deleteElements({ nodes: [{ id }] });
    }
  };

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-200">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 hover:!bg-blue-600 transition-colors duration-200"
        style={{ top: -6 }}
      />
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-sm font-medium text-gray-700">{data.label}</div>
        <button
          onClick={onDelete}
          className="ml-2 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200"
          title="Delete node"
        >
          <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500 hover:!bg-blue-600 transition-colors duration-200"
        style={{ bottom: -6 }}
      />
    </div>
  );
} 