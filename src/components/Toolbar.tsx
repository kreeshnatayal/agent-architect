import { useCallback, useState } from 'react';
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
} from '@heroicons/react/24/outline';
import { Node, Edge } from 'reactflow';

const icons = [
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

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
      {/* Toolbar Container */}
      <div className="bg-white p-4 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {icons.map(({ type, icon: Icon, label }) => (
            <div
              key={type}
              className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-blue-50"
              draggable
              onDragStart={(e) => onDragStart(e, type)}
            >
              <Icon className="w-6 h-6 text-black" />
              <span className="text-black font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button Container */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105 transform hover:shadow-lg cursor-pointer ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? 'Saving...' : 'Export as UML'}
        </button>
      </div>
    </div>
  );
} 