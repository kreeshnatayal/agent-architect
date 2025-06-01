import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateUmlFromFlow } from './Flow';
import {
  ServerIcon,
  CodeBracketIcon,
  CircleStackIcon,
  CloudIcon,
  CommandLineIcon,
  BeakerIcon,
  CpuChipIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  CodeBracketSquareIcon,
  // Flowchart specific icons
  RectangleStackIcon,
  ChatBubbleBottomCenterTextIcon, // For Data/IO
  ChevronUpDownIcon, // For Decision
  StopCircleIcon, // For Terminator
  ArrowPathIcon, // For Connector/Loop
} from '@heroicons/react/24/outline';
import { Node, Edge } from 'reactflow'; // Node and Edge are already here

const icons = [
  // Flowchart Elements
  { type: 'process', icon: RectangleStackIcon, label: 'Process' },
  { type: 'decision', icon: ChevronUpDownIcon, label: 'Decision' },
  { type: 'terminator', icon: StopCircleIcon, label: 'Terminator' },
  { type: 'data', icon: ChatBubbleBottomCenterTextIcon, label: 'Data (I/O)' },
  { type: 'connector', icon: ArrowPathIcon, label: 'Connector' },

  // Infrastructure & Cloud
  { type: 'aws', icon: CloudIcon, label: 'AWS' },
  { type: 'azure', icon: CloudIcon, label: 'Azure' },
  { type: 'gcp', icon: CloudIcon, label: 'GCP' },
  { type: 'kubernetes', icon: CommandLineIcon, label: 'Kubernetes' },
  { type: 'docker', icon: CommandLineIcon, label: 'Docker' },
  { type: 'jenkins', icon: ServerIcon, label: 'Jenkins' },
  { type: 'git', icon: CodeBracketSquareIcon, label: 'Git' },
  { type: 'github', icon: CodeBracketSquareIcon, label: 'GitHub' },
  { type: 'gitlab', icon: CodeBracketSquareIcon, label: 'GitLab' },
  
  // Languages & Frameworks
  { type: 'python', icon: CodeBracketIcon, label: 'Python' },
  { type: 'java', icon: CodeBracketIcon, label: 'Java' },
  { type: 'cpp', icon: CodeBracketIcon, label: 'C++' },
  { type: 'javascript', icon: CodeBracketIcon, label: 'JavaScript' },
  { type: 'typescript', icon: CodeBracketIcon, label: 'TypeScript' },
  { type: 'react', icon: CodeBracketIcon, label: 'React' },
  { type: 'nextjs', icon: CodeBracketIcon, label: 'Next.js' },
  { type: 'nodejs', icon: CodeBracketIcon, label: 'Node.js' },
  { type: 'flask', icon: BeakerIcon, label: 'Flask' },
  { type: 'springboot', icon: CodeBracketIcon, label: 'Spring Boot' },
  
  // Databases & Storage
  { type: 'mongodb', icon: CircleStackIcon, label: 'MongoDB' },
  { type: 'postgresql', icon: CircleStackIcon, label: 'PostgreSQL' },
  { type: 'mysql', icon: CircleStackIcon, label: 'MySQL' },
  { type: 'redis', icon: CircleStackIcon, label: 'Redis' },
  
  // DevOps & Tools
  { type: 'linux', icon: CommandLineIcon, label: 'Linux' },
  { type: 'nginx', icon: ServerIcon, label: 'Nginx' },
  { type: 'apache', icon: ServerIcon, label: 'Apache' },
  { type: 'terraform', icon: WrenchScrewdriverIcon, label: 'Terraform' },
  { type: 'ansible', icon: WrenchScrewdriverIcon, label: 'Ansible' },
  
  // Monitoring & Logging
  { type: 'prometheus', icon: CpuChipIcon, label: 'Prometheus' },
  { type: 'grafana', icon: GlobeAltIcon, label: 'Grafana' },
  { type: 'elk', icon: CircleStackIcon, label: 'ELK Stack' },

  // AI tools
  { type: 'openai', icon: CodeBracketIcon, label: 'OpenAI' },
  { type: 'anthropic', icon: CodeBracketIcon, label: 'Anthropic' },
  { type: 'claude', icon: CodeBracketIcon, label: 'Claude' },
  { type: 'gemini', icon: CodeBracketIcon, label: 'Gemini' },
  { type: 'gpt', icon: CodeBracketIcon, label: 'GPT' },
  { type: 'websearch', icon: GlobeAltIcon, label: 'Web Search' }
];

interface NodeData {
  label: string;
  type: string;
}

interface ToolbarProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

export function Toolbar({ nodes, edges }: ToolbarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const convertToUML = (nodes: Node<NodeData>[], edges: Edge[]): string => {
    let uml = '@startuml\n\n';

    // Add nodes as components
    nodes.forEach((node) => {
      uml += `component "${node.data.label}" as ${node.id}\n`;
    });

    uml += '\n';

    // Add relationships
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (sourceNode && targetNode) {
        uml += `${sourceNode.id} --> ${targetNode.id}\n`;
      }
    });

    uml += '\n@enduml';
    return uml;
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const uml = convertToUML(nodes, edges);
      
      // Create a blob and download the file
      const blob = new Blob([uml], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'architecture-diagram.puml';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Save to MongoDB
      const response = await fetch('/api/save-uml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uml }),
      });

      if (!response.ok) {
        throw new Error('Failed to save UML diagram');
      }

      alert('UML diagram saved successfully!');
    } catch (error) {
      console.error('Error saving UML diagram:', error);
      alert('Failed to save UML diagram. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoToChat = async () => {
    setIsNavigating(true);
    try {
      const uml = generateUmlFromFlow(nodes, edges); // Using the new function
      const response = await fetch('/api/save-uml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uml }), // Sending the new UML format
      });
      if (!response.ok) {
        throw new Error('Failed to save UML for chat');
      }
      router.push('/chat');
    } catch (error) {
      console.error('Error saving UML and navigating to chat:', error);
      alert('Failed to save UML and navigate. Please try again.');
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    // Use theme colors and improve layout
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar Container */}
      {/* Use primary color for background, ensure text is light (foreground) */}
      <div className="bg-primary p-4 rounded-lg shadow-xl max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="flex flex-col gap-3">
          {icons.map(({ type, icon: Icon, label }) => (
            <div
              key={type}
              // Use secondary for item background, accent for hover, ensure text is foreground
              className="flex items-center gap-3 p-3 border border-secondary rounded-md cursor-move hover:bg-accent hover:text-white transition-colors duration-150"
              draggable
              onDragStart={(e) => onDragStart(e, type)}
            >
              {/* Icon color should be foreground, changes to white on hover if item text does */}
              <Icon className="w-5 h-5 text-foreground" />
              <span className="text-foreground font-medium text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons Container */}
      {/* Use primary color for background, ensure text is light (foreground) */}
      <div className="bg-primary p-4 rounded-lg shadow-xl flex flex-col gap-3 mt-auto">
        <button
          onClick={handleSave}
          disabled={isSaving || isNavigating}
          // Use accent for button, ensure text is light, add more padding and rounded corners
          className={`px-5 py-3 bg-accent text-white rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition-all duration-200 hover:scale-105 transform hover:shadow-lg cursor-pointer ${
            (isSaving || isNavigating) ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? 'Saving...' : 'Export as UML'}
        </button>
        <button
          onClick={handleGoToChat}
          disabled={isNavigating || isSaving}
          // Use a different color for the second button (e.g. secondary), ensure text is light
          className={`px-5 py-3 bg-secondary text-white rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 transition-all duration-200 hover:scale-105 transform hover:shadow-lg cursor-pointer ${
            (isNavigating || isSaving) ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isNavigating ? 'Processing...' : 'Go to Chat'}
        </button>
      </div>
    </div>
  );
}