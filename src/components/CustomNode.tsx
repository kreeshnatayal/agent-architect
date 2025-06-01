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
  // Flowchart specific icons from Toolbar
  RectangleStackIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronUpDownIcon,
  StopCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Map node types to their corresponding icons
const iconMap: Record<string, IconComponent> = {
  // Flowchart Elements
  process: RectangleStackIcon,
  decision: ChevronUpDownIcon,
  terminator: StopCircleIcon,
  data: ChatBubbleBottomCenterTextIcon,
  connector: ArrowPathIcon,

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
    // Use theme colors: primary for background, secondary for border, foreground for text
    <div className="px-4 py-3 shadow-lg rounded-lg bg-primary border border-secondary hover:shadow-xl transition-shadow duration-200">
      <Handle
        type="target"
        position={Position.Top}
        // Use accent color for handles
        className="w-3 h-3 !bg-accent hover:!bg-opacity-80 transition-colors duration-200"
        style={{ top: -6 }}
      />
      <div className="flex items-center gap-3">
        {/* Use secondary for icon background, accent for icon color */}
        <div className="p-2 bg-secondary rounded-lg">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        {/* Text color should be foreground */}
        <div className="text-sm font-medium text-foreground">{data.label}</div>
        <button
          onClick={onDelete}
          // Use a subtle hover background, accent for icon hover
          className="ml-auto p-1.5 rounded-full hover:bg-secondary transition-colors duration-200"
          title="Delete node"
        >
          {/* Icon color foreground, hover accent */}
          <XMarkIcon className="w-4 h-4 text-foreground hover:text-accent" />
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        // Use accent color for handles
        className="w-3 h-3 !bg-accent hover:!bg-opacity-80 transition-colors duration-200"
        style={{ bottom: -6 }}
      />
    </div>
  );
}