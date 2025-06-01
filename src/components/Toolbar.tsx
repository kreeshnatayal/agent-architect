import { useCallback, useState } from 'react';
import {
  ServerIcon,
  CubeIcon,
  CodeBracketIcon,
  CircleStackIcon,
  CloudIcon,
  CommandLineIcon,
  BeakerIcon,
  CommandLineIcon as TerminalIcon,
  CpuChipIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  CodeBracketSquareIcon,
  CircleStackIcon as DatabaseIcon,
  CloudIcon as CloudServiceIcon,
  CommandLineIcon as ShellIcon,
  ServerIcon as ServerIcon2,
  CubeIcon as ContainerIcon,
  CodeBracketIcon as CodeIcon,
  CircleStackIcon as DataIcon,
  CloudIcon as CloudIcon2,
  CommandLineIcon as CliIcon,
} from '@heroicons/react/24/outline';

const icons = [
  // Infrastructure & Cloud
  { type: 'aws', icon: CloudServiceIcon, label: 'AWS' },
  { type: 'azure', icon: CloudServiceIcon, label: 'Azure' },
  { type: 'gcp', icon: CloudServiceIcon, label: 'GCP' },
  { type: 'kubernetes', icon: ContainerIcon, label: 'Kubernetes' },
  { type: 'docker', icon: ContainerIcon, label: 'Docker' },
  { type: 'jenkins', icon: ServerIcon, label: 'Jenkins' },
  { type: 'git', icon: CodeBracketSquareIcon, label: 'Git' },
  { type: 'github', icon: CodeBracketSquareIcon, label: 'GitHub' },
  { type: 'gitlab', icon: CodeBracketSquareIcon, label: 'GitLab' },
  
  // Languages & Frameworks
  { type: 'python', icon: CodeIcon, label: 'Python' },
  { type: 'java', icon: CodeIcon, label: 'Java' },
  { type: 'cpp', icon: CodeIcon, label: 'C++' },
  { type: 'javascript', icon: CodeIcon, label: 'JavaScript' },
  { type: 'typescript', icon: CodeIcon, label: 'TypeScript' },
  { type: 'react', icon: CodeIcon, label: 'React' },
  { type: 'nextjs', icon: CodeIcon, label: 'Next.js' },
  { type: 'nodejs', icon: CodeIcon, label: 'Node.js' },
  { type: 'flask', icon: BeakerIcon, label: 'Flask' },
  { type: 'springboot', icon: CodeIcon, label: 'Spring Boot' },
  
  // Databases & Storage
  { type: 'mongodb', icon: DatabaseIcon, label: 'MongoDB' },
  { type: 'postgresql', icon: DatabaseIcon, label: 'PostgreSQL' },
  { type: 'mysql', icon: DatabaseIcon, label: 'MySQL' },
  { type: 'redis', icon: DatabaseIcon, label: 'Redis' },
  
  // DevOps & Tools
  { type: 'linux', icon: TerminalIcon, label: 'Linux' },
  { type: 'nginx', icon: ServerIcon, label: 'Nginx' },
  { type: 'apache', icon: ServerIcon, label: 'Apache' },
  { type: 'terraform', icon: WrenchScrewdriverIcon, label: 'Terraform' },
  { type: 'ansible', icon: WrenchScrewdriverIcon, label: 'Ansible' },
  
  // Monitoring & Logging
  { type: 'prometheus', icon: CpuChipIcon, label: 'Prometheus' },
  { type: 'grafana', icon: GlobeAltIcon, label: 'Grafana' },
  { type: 'elk', icon: DataIcon, label: 'ELK Stack' },
];

interface ToolbarProps {
  onSave: () => void;
}

export function Toolbar({ onSave }: ToolbarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');

      // @ts-ignore - ReactFlow types are not properly exposed
      const reactFlowInstance = window.reactFlowInstance;
      if (!reactFlowInstance) {
        throw new Error('Flow instance not found');
      }

      const flowData = reactFlowInstance.toObject();
      
      const response = await fetch('/api/flowcharts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'My Flowchart',
          nodes: flowData.nodes,
          edges: flowData.edges,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save flowchart');
      }

      setSaveMessage('Flowchart saved successfully!');
    } catch (error) {
      console.error('Error saving flowchart:', error);
      setSaveMessage('Failed to save flowchart. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, []);

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
          className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Flowchart'}
        </button>
        {saveMessage && (
          <p className={`mt-2 text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
} 