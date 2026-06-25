/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  GitCommit, 
  Cpu, 
  Database, 
  FileCode, 
  Layers, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Send, 
  Download, 
  Share2, 
  RefreshCw, 
  Search, 
  Sliders, 
  X,
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';

// Type Definitions
interface ModuleItem {
  id: string;
  name: string;
  desc: string;
  priority: 'P0' | 'P1' | 'P2';
  complexity: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
}

interface TechBlock {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Infrastructure';
  role: string;
  status: 'Approved' | 'Under Review' | 'Proposed';
}

interface FlowStep {
  id: string;
  label: string;
  type: 'Action' | 'State' | 'System';
  group: 'Planning' | 'Orchestration' | 'Deliverables';
  desc: string;
}

interface DataField {
  name: string;
  type: string;
  isKey?: boolean;
  isNullable?: boolean;
}

interface DataTable {
  id: string;
  name: string;
  fields: DataField[];
}

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: string;
  desc: string;
  requestBody: string;
  responseBody: string;
}

interface RiskItem {
  id: string;
  title: string;
  desc: string;
  severity: 'High' | 'Medium' | 'Low';
  resolved: boolean;
}

export default function App() {
  // Sidebar Navigation State
  const [activeTab, setActiveTab] = useState<'modules' | 'flows' | 'tech' | 'data' | 'apis' | 'figma'>('modules');
  
  // App Sync & Toast State
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');
  const [toast, setToast] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Core Modules State
  const [modules, setModules] = useState<ModuleItem[]>(() => {
    const saved = localStorage.getItem('pm_modules');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'User Workspace', desc: 'Project management & file trees', priority: 'P0', complexity: 'Medium', status: 'In Progress' },
      { id: '2', name: 'Inference Engine', desc: 'Real-time LLM stream processing', priority: 'P0', complexity: 'High', status: 'Not Started' },
      { id: '3', name: 'Asset Library', desc: 'Cloud storage & version control', priority: 'P1', complexity: 'Low', status: 'Completed' },
      { id: '4', name: 'Admin Portal', desc: 'Billing & Usage Analytics', priority: 'P2', complexity: 'Medium', status: 'Not Started' },
    ];
  });

  // 2. Interaction Flows State
  const [flows, setFlows] = useState<FlowStep[]>(() => {
    const saved = localStorage.getItem('pm_flows');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', label: 'User Authentication', type: 'State', group: 'Planning', desc: 'Secure login via provider and initial session handshake' },
      { id: 'f2', label: 'Dashboard Init', type: 'Action', group: 'Planning', desc: 'Initialize standard views, load workspace config & metadata' },
      { id: 'f3', label: 'Main Workspace', type: 'State', group: 'Planning', desc: 'Main user work environment with explorer and file trees' },
      { id: 'f4', label: 'Select AI Model', type: 'State', group: 'Orchestration', desc: 'Choose between standard models and real-time inference options' },
      { id: 'f5', label: 'Prompt Input', type: 'Action', group: 'Orchestration', desc: 'Validation and forwarding of user commands to server' },
      { id: 'f6', label: 'Streaming Output', type: 'State', group: 'Orchestration', desc: 'Live server-sent events (SSE) render responses token-by-token' },
      { id: 'f7', label: 'Export & Save', type: 'Action', group: 'Deliverables', desc: 'Compile blueprint specs and download or share report' }
    ];
  });

  // 3. Technical Architecture State
  const [techStack, setTechStack] = useState<TechBlock[]>(() => {
    const saved = localStorage.getItem('pm_tech');
    return saved ? JSON.parse(saved) : [
      { id: 't1', name: 'React 19 + Vite', category: 'Frontend', role: 'Framework Stack', status: 'Approved' },
      { id: 't2', name: 'Tailwind CSS v4', category: 'Frontend', role: 'UI Component System', status: 'Approved' },
      { id: 't3', name: 'Node.js / Express', category: 'Backend', role: 'API Services Layer', status: 'Under Review' },
      { id: 't4', name: 'PostgreSQL + Prisma', category: 'Backend', role: 'Relational Data Engine', status: 'Approved' },
      { id: 't5', name: 'Redis Queue', category: 'Infrastructure', role: 'Job Scheduling', status: 'Proposed' },
      { id: 't6', name: 'AWS S3 + CloudFront', category: 'Infrastructure', role: 'Edge Asset Delivery', status: 'Approved' },
    ];
  });

  // 4. Data Schema State
  const [dataTables, setDataTables] = useState<DataTable[]>(() => {
    const saved = localStorage.getItem('pm_data_tables');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'tbl-1', 
        name: 'Users', 
        fields: [
          { name: 'id', type: 'UUID (PK)', isKey: true },
          { name: 'email', type: 'VARCHAR(255)', isNullable: false },
          { name: 'role', type: 'VARCHAR(50)', isNullable: false },
          { name: 'created_at', type: 'TIMESTAMP', isNullable: true }
        ]
      },
      { 
        id: 'tbl-2', 
        name: 'Projects', 
        fields: [
          { name: 'id', type: 'UUID (PK)', isKey: true },
          { name: 'name', type: 'VARCHAR(100)', isNullable: false },
          { name: 'description', type: 'TEXT', isNullable: true },
          { name: 'user_id', type: 'UUID (FK)', isKey: true },
          { name: 'updated_at', type: 'TIMESTAMP', isNullable: true }
        ]
      },
      { 
        id: 'tbl-3', 
        name: 'InferenceLogs', 
        fields: [
          { name: 'id', type: 'UUID (PK)', isKey: true },
          { name: 'project_id', type: 'UUID (FK)', isKey: true },
          { name: 'model_name', type: 'VARCHAR(50)', isNullable: false },
          { name: 'tokens_used', type: 'INTEGER', isNullable: false },
          { name: 'duration_ms', type: 'INTEGER', isNullable: true },
          { name: 'timestamp', type: 'TIMESTAMP', isNullable: true }
        ]
      }
    ];
  });

  // 5. API Specs State
  const [apiSpecs, setApiSpecs] = useState<ApiEndpoint[]>(() => {
    const saved = localStorage.getItem('pm_apis');
    return saved ? JSON.parse(saved) : [
      { id: 'a1', method: 'POST', path: '/api/auth/login', category: 'Auth', desc: 'Authenticate user and return session token', requestBody: '{\n  "email": "user@example.com",\n  "password": "••••••••"\n}', responseBody: '{\n  "success": true,\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "user": { "id": "u1", "role": "editor" }\n}' },
      { id: 'a2', method: 'GET', path: '/api/projects', category: 'Workspace', desc: 'Retrieve all projects and blueprints for logged-in user', requestBody: '{}', responseBody: '{\n  "projects": [\n    { "id": "p1", "name": "Lumina AI Platform", "status": "draft" }\n  ]\n}' },
      { id: 'a3', method: 'POST', path: '/api/inference/stream', category: 'Inference', desc: 'Stream live LLM responses with token-count metrics', requestBody: '{\n  "prompt": "Explain high density visual grids",\n  "model": "gemini-2.5-pro"\n}', responseBody: 'data: {"token": "High"}\ndata: {"token": " density"}\ndata: {"token": " design"}\ndata: [DONE]' }
    ];
  });

  // 6. PM Insights & Timeline State
  const [risks, setRisks] = useState<RiskItem[]>(() => {
    const saved = localStorage.getItem('pm_risks');
    return saved ? JSON.parse(saved) : [
      { id: 'r1', title: 'Token Costs', desc: 'Real-time LLM inference will be the primary OpEx driver. Need quota management system.', severity: 'High', resolved: false },
      { id: 'r2', title: 'Scalability', desc: 'WebSocket connections for streaming output need a load balancer with sticky sessions.', severity: 'Medium', resolved: false },
    ];
  });
  
  const [mvpTimelineWeeks, setMvpTimelineWeeks] = useState<number>(() => {
    const saved = localStorage.getItem('pm_timeline');
    return saved ? parseInt(saved) : 8;
  });

  // Modals & Temp States for creating items
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Form Fields
  const [newModName, setNewModName] = useState('');
  const [newModDesc, setNewModDesc] = useState('');
  const [newModPriority, setNewModPriority] = useState<'P0' | 'P1' | 'P2'>('P0');
  const [newModComplexity, setNewModComplexity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newModStatus, setNewModStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('Not Started');

  const [newTechName, setNewTechName] = useState('');
  const [newTechCategory, setNewTechCategory] = useState<'Frontend' | 'Backend' | 'Infrastructure'>('Frontend');
  const [newTechRole, setNewTechRole] = useState('');
  const [newTechStatus, setNewTechStatus] = useState<'Approved' | 'Under Review' | 'Proposed'>('Approved');

  const [newFlowLabel, setNewFlowLabel] = useState('');
  const [newFlowType, setNewFlowType] = useState<'Action' | 'State' | 'System'>('Action');
  const [newFlowGroup, setNewFlowGroup] = useState<'Planning' | 'Orchestration' | 'Deliverables'>('Planning');
  const [newFlowDesc, setNewFlowDesc] = useState('');

  const [newTableName, setNewTableName] = useState('');
  const [newTableFields, setNewTableFields] = useState<DataField[]>([
    { name: 'id', type: 'UUID (PK)', isKey: true },
    { name: 'name', type: 'VARCHAR(100)', isNullable: false }
  ]);
  const [tempFieldName, setTempFieldName] = useState('');
  const [tempFieldType, setTempFieldType] = useState('VARCHAR(100)');
  const [tempFieldIsPK, setTempFieldIsPK] = useState(false);

  const [newApiMethod, setNewApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [newApiPath, setNewApiPath] = useState('');
  const [newApiCategory, setNewApiCategory] = useState('Workspace');
  const [newApiDesc, setNewApiDesc] = useState('');
  const [newApiRequest, setNewApiRequest] = useState('{\n  \n}');
  const [newApiResponse, setNewApiResponse] = useState('{\n  "success": true\n}');

  const [newRiskTitle, setNewRiskTitle] = useState('');
  const [newRiskDesc, setNewRiskDesc] = useState('');
  const [newRiskSeverity, setNewRiskSeverity] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Dynamic API Sandbox State
  const [selectedSandboxApi, setSelectedSandboxApi] = useState<string>('a1');
  const [sandboxRequest, setSandboxRequest] = useState('');
  const [sandboxResponse, setSandboxResponse] = useState('');
  const [sandboxIsLoading, setSandboxIsLoading] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);

  // Figma wireframe customization
  const [wireframeDensity, setWireframeDensity] = useState<'high' | 'standard' | 'low'>('high');
  const [wireframeLayout, setWireframeLayout] = useState<'dashboard' | 'split' | 'detailed'>('dashboard');

  // Sync to LocalStorage with visual indicator
  const triggerSync = (type: string, details: string) => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      showToast(`${type} updated successfully!`);
    }, 400);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem('pm_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('pm_flows', JSON.stringify(flows));
  }, [flows]);

  useEffect(() => {
    localStorage.setItem('pm_tech', JSON.stringify(techStack));
  }, [techStack]);

  useEffect(() => {
    localStorage.setItem('pm_data_tables', JSON.stringify(dataTables));
  }, [dataTables]);

  useEffect(() => {
    localStorage.setItem('pm_apis', JSON.stringify(apiSpecs));
  }, [apiSpecs]);

  useEffect(() => {
    localStorage.setItem('pm_risks', JSON.stringify(risks));
  }, [risks]);

  useEffect(() => {
    localStorage.setItem('pm_timeline', mvpTimelineWeeks.toString());
  }, [mvpTimelineWeeks]);

  // Sync sandbox initial content when API selection changes
  useEffect(() => {
    const api = apiSpecs.find(a => a.id === selectedSandboxApi);
    if (api) {
      setSandboxRequest(api.requestBody);
      setSandboxResponse('');
      setSandboxLogs([]);
    }
  }, [selectedSandboxApi, apiSpecs]);

  // Actions
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModName) return;
    const item: ModuleItem = {
      id: Date.now().toString(),
      name: newModName,
      desc: newModDesc || 'No description provided.',
      priority: newModPriority,
      complexity: newModComplexity,
      status: newModStatus
    };
    setModules([...modules, item]);
    setIsModuleModalOpen(false);
    setNewModName('');
    setNewModDesc('');
    triggerSync('Module', `Added ${newModName}`);
  };

  const handleDeleteModule = (id: string) => {
    const item = modules.find(m => m.id === id);
    setModules(modules.filter(m => m.id !== id));
    triggerSync('Module', `Deleted ${item?.name}`);
  };

  const handleToggleModuleStatus = (id: string) => {
    const order: ('Not Started' | 'In Progress' | 'Completed')[] = ['Not Started', 'In Progress', 'Completed'];
    setModules(modules.map(m => {
      if (m.id === id) {
        const nextIndex = (order.indexOf(m.status) + 1) % order.length;
        return { ...m, status: order[nextIndex] };
      }
      return m;
    }));
    triggerSync('Module', 'Updated status');
  };

  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName) return;
    const item: TechBlock = {
      id: Date.now().toString(),
      name: newTechName,
      category: newTechCategory,
      role: newTechRole || 'General Component',
      status: newTechStatus
    };
    setTechStack([...techStack, item]);
    setIsTechModalOpen(false);
    setNewTechName('');
    setNewTechRole('');
    triggerSync('Tech Block', `Added ${newTechName}`);
  };

  const handleDeleteTech = (id: string) => {
    const item = techStack.find(t => t.id === id);
    setTechStack(techStack.filter(t => t.id !== id));
    triggerSync('Tech Block', `Deleted ${item?.name}`);
  };

  const handleAddFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowLabel) return;
    const item: FlowStep = {
      id: 'f-' + Date.now().toString(),
      label: newFlowLabel,
      type: newFlowType,
      group: newFlowGroup,
      desc: newFlowDesc || 'No description'
    };
    setFlows([...flows, item]);
    setIsFlowModalOpen(false);
    setNewFlowLabel('');
    setNewFlowDesc('');
    triggerSync('Flow Step', `Added ${newFlowLabel}`);
  };

  const handleDeleteFlow = (id: string) => {
    const item = flows.find(f => f.id === id);
    setFlows(flows.filter(f => f.id !== id));
    triggerSync('Flow Step', `Deleted ${item?.label}`);
  };

  const handleAddFieldToNewTable = () => {
    if (!tempFieldName) return;
    setNewTableFields([...newTableFields, {
      name: tempFieldName,
      type: tempFieldType,
      isKey: tempFieldIsPK,
      isNullable: !tempFieldIsPK
    }]);
    setTempFieldName('');
    setTempFieldIsPK(false);
  };

  const handleRemoveFieldFromNewTable = (index: number) => {
    setNewTableFields(newTableFields.filter((_, i) => i !== index));
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName) return;
    const item: DataTable = {
      id: 'tbl-' + Date.now(),
      name: newTableName,
      fields: newTableFields
    };
    setDataTables([...dataTables, item]);
    setIsTableModalOpen(false);
    setNewTableName('');
    setNewTableFields([
      { name: 'id', type: 'UUID (PK)', isKey: true },
      { name: 'name', type: 'VARCHAR(100)', isNullable: false }
    ]);
    triggerSync('Data Model', `Added Table ${newTableName}`);
  };

  const handleDeleteTable = (id: string) => {
    const item = dataTables.find(t => t.id === id);
    setDataTables(dataTables.filter(t => t.id !== id));
    triggerSync('Data Model', `Deleted Table ${item?.name}`);
  };

  const handleAddApi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiPath) return;
    const item: ApiEndpoint = {
      id: 'a-' + Date.now(),
      method: newApiMethod,
      path: newApiPath,
      category: newApiCategory,
      desc: newApiDesc || 'No description',
      requestBody: newApiRequest,
      responseBody: newApiResponse
    };
    setApiSpecs([...apiSpecs, item]);
    setIsApiModalOpen(false);
    setNewApiPath('');
    setNewApiDesc('');
    setNewApiRequest('{\n  \n}');
    setNewApiResponse('{\n  "success": true\n}');
    triggerSync('API Spec', `Added ${newApiMethod} ${newApiPath}`);
  };

  const handleDeleteApi = (id: string) => {
    const item = apiSpecs.find(a => a.id === id);
    setApiSpecs(apiSpecs.filter(a => a.id !== id));
    triggerSync('API Spec', `Deleted API ${item?.path}`);
  };

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiskTitle) return;
    const item: RiskItem = {
      id: 'r-' + Date.now(),
      title: newRiskTitle,
      desc: newRiskDesc || 'No description provided.',
      severity: newRiskSeverity,
      resolved: false
    };
    setRisks([...risks, item]);
    setIsRiskModalOpen(false);
    setNewRiskTitle('');
    setNewRiskDesc('');
    triggerSync('Risk Assessment', `Added risk ${newRiskTitle}`);
  };

  const handleToggleRiskResolve = (id: string) => {
    setRisks(risks.map(r => r.id === id ? { ...r, resolved: !r.resolved } : r));
    triggerSync('Risk Assessment', 'Toggled resolution state');
  };

  // Run simulated API Request Client
  const executeSandboxRequest = () => {
    const currentApi = apiSpecs.find(a => a.id === selectedSandboxApi);
    if (!currentApi) return;

    setSandboxIsLoading(true);
    setSandboxLogs([
      `[${new Date().toLocaleTimeString()}] Sending request payload to ${currentApi.method} ${currentApi.path}...`,
      `[${new Date().toLocaleTimeString()}] Establishing mock server session...`,
    ]);

    setTimeout(() => {
      setSandboxLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Connection secured. Server-side middleware running.`,
        `[${new Date().toLocaleTimeString()}] Response received with HTTP Status 200 OK.`
      ]);
      setSandboxResponse(currentApi.responseBody);
      setSandboxIsLoading(false);
      showToast("Simulated request success!");
    }, 1200);
  };

  // Quick statistics
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.status === 'Completed').length;
  const activeRisks = risks.filter(r => !r.resolved).length;
  const totalTables = dataTables.length;
  const totalApis = apiSpecs.length;

  // Filter lists based on search query
  const filteredModules = modules.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTech = techStack.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApis = apiSpecs.filter(a => 
    a.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden select-none">
      
      {/* Toast Alert */}
      {toast && (
        <div id="toast-notif" className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs border border-slate-700 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
          <span>{toast}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION PANEL */}
      <aside id="sidebar-nav" className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        
        {/* Workspace Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm shadow-md">
              P
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">PM Console v2.4</h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">Lumina Blueprint v2.0</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-slate-800/60 rounded px-2.5 py-1.5 border border-slate-800">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Quick search..."
              className="bg-transparent border-none text-[11px] text-white focus:outline-none w-full placeholder-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X className="w-3 h-3 text-slate-400 cursor-pointer" onClick={() => setSearchQuery('')} />
            )}
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <div>
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Planning Phases</div>
            <nav className="mt-1 space-y-0.5">
              <button 
                id="btn-nav-modules"
                onClick={() => { setActiveTab('modules'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${activeTab === 'modules' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Core Modules</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'modules' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {totalModules}
                </span>
              </button>

              <button 
                id="btn-nav-flows"
                onClick={() => { setActiveTab('flows'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${activeTab === 'flows' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
              >
                <div className="flex items-center gap-2">
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>Interaction Flows</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'flows' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {flows.length}
                </span>
              </button>

              <button 
                id="btn-nav-tech"
                onClick={() => { setActiveTab('tech'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${activeTab === 'tech' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Tech Architecture</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'tech' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {techStack.length}
                </span>
              </button>

              <button 
                id="btn-nav-data"
                onClick={() => { setActiveTab('data'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${activeTab === 'data' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>Data Models (SQL)</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'data' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {totalTables}
                </span>
              </button>
            </nav>
          </div>

          <div>
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Project Deliverables</div>
            <nav className="mt-1 space-y-0.5">
              <button 
                id="btn-nav-apis"
                onClick={() => { setActiveTab('apis'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${activeTab === 'apis' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>API specs & Simulator</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'apis' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {totalApis}
                </span>
              </button>

              <button 
                id="btn-nav-figma"
                onClick={() => { setActiveTab('figma'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${activeTab === 'figma' ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>UI Wireframe Sandbox</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-md font-bold uppercase font-mono">
                  Live
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Metrics widget */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Milestone Track</div>
            <div className="px-3">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Completed modules</span>
                <span className="font-mono text-white">{completedModules}/{totalModules}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalModules > 0 ? (completedModules / totalModules) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="px-3 pt-2">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>MVP Timeline</span>
                <span className="font-mono text-blue-400 font-bold">{mvpTimelineWeeks} Weeks</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (mvpTimelineWeeks / 16) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sync status footer */}
        <div className="p-4 border-t border-slate-800 text-[11px] bg-slate-950/40">
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`}></span>
              <span>Sync Status: {syncStatus === 'syncing' ? 'Syncing...' : 'Active'}</span>
            </div>
            <button 
              onClick={() => triggerSync('Global state', 'Forced cloud synchronize')} 
              className="text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded transition-colors"
              title="Manually sync parameters to cloud"
            >
              <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="mt-1 text-slate-500 text-[10px]">Changes persistent to browser storage</div>
        </div>
      </aside>

      {/* MAIN CONTENT SPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP STATUS HEADER BAR */}
        <header id="main-header" className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-slate-900 tracking-tight text-sm md:text-base flex items-center gap-2">
              Lumina AI Platform Blueprint: 
              <span className="text-blue-600 font-mono text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {activeTab === 'modules' && 'Modules Planner'}
                {activeTab === 'flows' && 'User Interaction Flow'}
                {activeTab === 'tech' && 'Tech Stack Architecture'}
                {activeTab === 'data' && 'Relational Schema'}
                {activeTab === 'apis' && 'API Integration & Sandbox'}
                {activeTab === 'figma' && 'Visual Layout Sandbox'}
              </span>
            </h2>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wide shrink-0">
              Drafting Phase
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              id="btn-header-export"
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Blueprint</span>
            </button>
            <button 
              id="btn-header-share"
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Review</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* 1. CORE MODULES PANEL */}
          {activeTab === 'modules' && (
            <div id="section-modules" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Functional Modules</h3>
                  <p className="text-xs text-slate-500">Define the core systems, operational priorities, and execution statuses of the Lumina AI platform.</p>
                </div>
                <button 
                  id="btn-add-module-trigger"
                  onClick={() => setIsModuleModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Module</span>
                </button>
              </div>

              {/* Grid with main modules table & quick view stats */}
              <div className="grid grid-cols-12 gap-5">
                
                {/* Main Table Card */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Core Modules Specifications</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Showing {filteredModules.length} items</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 bg-slate-50 border-b border-slate-100 uppercase text-[10px] tracking-wider">
                          <th className="px-4 py-2.5 font-bold">Module Name</th>
                          <th className="px-4 py-2.5 font-bold">Priority</th>
                          <th className="px-4 py-2.5 font-bold">Complexity</th>
                          <th className="px-4 py-2.5 font-bold">Development Status</th>
                          <th className="px-4 py-2.5 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredModules.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                              No modules matched your filters.
                            </td>
                          </tr>
                        ) : (
                          filteredModules.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-bold text-slate-900">{m.name}</div>
                                <div className="text-[11px] text-slate-500 max-w-sm truncate" title={m.desc}>{m.desc}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                                  m.priority === 'P0' ? 'bg-red-50 text-red-600 border border-red-100' :
                                  m.priority === 'P1' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                  {m.priority}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-mono text-slate-600">{m.complexity}</span>
                              </td>
                              <td className="px-4 py-3">
                                <button 
                                  onClick={() => handleToggleModuleStatus(m.id)}
                                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                                    m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100' :
                                    m.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100' :
                                    'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
                                  }`}
                                  title="Click to cycle status"
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    m.status === 'Completed' ? 'bg-emerald-500' :
                                    m.status === 'In Progress' ? 'bg-blue-500' :
                                    'bg-slate-400'
                                  }`}></span>
                                  <span>{m.status}</span>
                                </button>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button 
                                  onClick={() => handleDeleteModule(m.id)}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors inline-block"
                                  title="Delete Module"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Side interactive timeline slider & PM Insights */}
                <div className="col-span-12 lg:col-span-4 space-y-5">
                  
                  {/* Timeline controller */}
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3 flex items-center justify-between">
                      <span>Timeline Configurator</span>
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>MVP Target Launch</span>
                          <span className="font-mono font-bold text-blue-600">{mvpTimelineWeeks} Weeks</span>
                        </div>
                        <input 
                          type="range" 
                          min={2} 
                          max={16} 
                          value={mvpTimelineWeeks} 
                          onChange={(e) => {
                            setMvpTimelineWeeks(parseInt(e.target.value));
                            triggerSync('MVP Target', `Set timeline to ${e.target.value} weeks`);
                          }}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      {/* Milestones calculated dynamically from timeline */}
                      <div className="bg-slate-50 rounded p-2.5 border border-slate-100 space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Milestones</div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600">Specs & Wireframe</span>
                            <span className="font-mono text-slate-500 font-medium">Week {Math.ceil(mvpTimelineWeeks * 0.15)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600">Inference Core MVP</span>
                            <span className="font-mono text-slate-500 font-medium">Week {Math.ceil(mvpTimelineWeeks * 0.4)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600">Beta Testing & Integrations</span>
                            <span className="font-mono text-slate-500 font-medium">Week {Math.ceil(mvpTimelineWeeks * 0.75)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PM Insight Board */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-5 text-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Active PM Insights & Risks</h4>
                        <button 
                          onClick={() => setIsRiskModalOpen(true)}
                          className="text-[10px] text-blue-400 hover:text-white flex items-center gap-0.5 border border-blue-500/30 px-1.5 py-0.5 rounded hover:bg-blue-600 transition-colors"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>Flag Risk</span>
                        </button>
                      </div>

                      <div className="space-y-3.5">
                        {risks.map(r => (
                          <div key={r.id} className={`flex items-start gap-2.5 pb-2.5 border-b border-slate-800 last:border-0 last:pb-0 ${r.resolved ? 'opacity-40' : ''}`}>
                            <button 
                              onClick={() => handleToggleRiskResolve(r.id)}
                              className={`mt-1 w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                                r.resolved ? 'bg-emerald-500 border-emerald-400 text-slate-900' : 'border-slate-600 hover:border-slate-400 bg-transparent'
                              }`}
                              title={r.resolved ? "Re-open Risk" : "Mark resolved"}
                            >
                              {r.resolved && <span className="text-[10px] font-bold">✓</span>}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <strong className={`text-xs ${r.resolved ? 'line-through text-slate-500' : 'text-white'}`}>{r.title}</strong>
                                <span className={`text-[8px] px-1 font-bold rounded ${
                                  r.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                                  r.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-slate-500/20 text-slate-400'
                                }`}>{r.severity}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{r.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 bg-slate-800 p-3 rounded border border-slate-700">
                      <div className="text-[10px] text-slate-400 uppercase mb-1 flex items-center justify-between">
                        <span>Current Risk Density</span>
                        <span className={`text-[10px] font-mono font-bold ${activeRisks > 1 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {activeRisks === 0 ? 'Optimal' : activeRisks > 2 ? 'High Risk' : 'Acceptable'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${activeRisks > 2 ? 'bg-red-500' : 'bg-blue-500'}`} 
                            style={{ width: `${Math.min(100, (activeRisks / 5) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold font-mono">{activeRisks} Active</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* 2. INTERACTION FLOWS PANEL */}
          {activeTab === 'flows' && (
            <div id="section-flows" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">User Interaction Flowchart</h3>
                  <p className="text-xs text-slate-500">Visualize the transactional pipelines, states, and action flows that control the LLM streaming interface.</p>
                </div>
                <button 
                  id="btn-add-flow-trigger"
                  onClick={() => setIsFlowModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Flow Step</span>
                </button>
              </div>

              {/* Visual flowchart container */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Interactive Stream Pipeline</h4>
                  
                  {/* Legend */}
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                      <span className="text-[10px] text-slate-500 font-mono">Action Block</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300"></span>
                      <span className="text-[10px] text-slate-500 font-mono">User/System State</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-200"></span>
                      <span className="text-[10px] text-slate-500 font-mono">Decision Node</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline visualizer split into three stages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  
                  {/* Phase 1: Planning / Initial */}
                  <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-100 flex flex-col gap-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                      1. Session Init & Handshake
                    </div>
                    {flows.filter(f => f.group === 'Planning').map((flow, index, arr) => (
                      <React.Fragment key={flow.id}>
                        <div className="bg-white border border-slate-200 rounded-md p-3 shadow-sm hover:border-blue-400 transition-all group relative">
                          <button 
                            onClick={() => handleDeleteFlow(flow.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                            title="Delete Step"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded ${flow.type === 'Action' ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                            <span className="text-xs font-bold text-slate-800">{flow.label}</span>
                            <span className="text-[8px] font-mono text-slate-400 border border-slate-100 px-1 rounded bg-slate-50 ml-auto">
                              {flow.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">{flow.desc}</p>
                        </div>
                        {index < arr.length - 1 && (
                          <div className="flex justify-center my-0.5">
                            <div className="h-4 w-0.5 bg-slate-300"></div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Phase 2: Orchestration */}
                  <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-100 flex flex-col gap-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                      2. LLM Stream Processing
                    </div>
                    {flows.filter(f => f.group === 'Orchestration').map((flow, index, arr) => (
                      <React.Fragment key={flow.id}>
                        <div className="bg-white border border-slate-200 rounded-md p-3 shadow-sm hover:border-blue-400 transition-all group relative">
                          <button 
                            onClick={() => handleDeleteFlow(flow.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                            title="Delete Step"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded ${
                              flow.type === 'Action' ? 'bg-blue-600' : 
                              flow.type === 'State' ? 'bg-amber-100 border border-amber-300' : 'bg-slate-300'
                            }`}></span>
                            <span className="text-xs font-bold text-slate-800">{flow.label}</span>
                            <span className="text-[8px] font-mono text-slate-400 border border-slate-100 px-1 rounded bg-slate-50 ml-auto">
                              {flow.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">{flow.desc}</p>
                        </div>
                        {index < arr.length - 1 && (
                          <div className="flex justify-center my-0.5">
                            <div className="h-4 w-0.5 bg-slate-300"></div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Phase 3: Deliverables */}
                  <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-100 flex flex-col gap-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                      3. Dispatch & Export
                    </div>
                    {flows.filter(f => f.group === 'Deliverables').map((flow, index, arr) => (
                      <React.Fragment key={flow.id}>
                        <div className="bg-white border border-slate-200 rounded-md p-3 shadow-sm hover:border-blue-400 transition-all group relative">
                          <button 
                            onClick={() => handleDeleteFlow(flow.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                            title="Delete Step"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded ${flow.type === 'Action' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            <span className="text-xs font-bold text-slate-800">{flow.label}</span>
                            <span className="text-[8px] font-mono text-slate-400 border border-slate-100 px-1 rounded bg-slate-50 ml-auto">
                              {flow.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">{flow.desc}</p>
                        </div>
                        {index < arr.length - 1 && (
                          <div className="flex justify-center my-0.5">
                            <div className="h-4 w-0.5 bg-slate-300"></div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 3. TECHNICAL ARCHITECTURE PANEL */}
          {activeTab === 'tech' && (
            <div id="section-tech" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Technical Architecture Proposal</h3>
                  <p className="text-xs text-slate-500">Map and organize stack frameworks, service components, queue managers, and data warehouses.</p>
                </div>
                <button 
                  id="btn-add-tech-trigger"
                  onClick={() => setIsTechModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tech Block</span>
                </button>
              </div>

              {/* Bento Grid layout of categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Frontend Column */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Client Frameworks</h4>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">FRONTEND</span>
                  </div>
                  <div className="p-4 flex-1 space-y-3.5">
                    {filteredTech.filter(t => t.category === 'Frontend').map(tech => (
                      <div key={tech.id} className="p-3 border border-slate-100 rounded bg-slate-50 hover:bg-slate-100/50 transition-colors relative group">
                        <button 
                          onClick={() => handleDeleteTech(tech.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-xs font-bold text-slate-800">{tech.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{tech.role}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-[8px] px-1.5 py-0.2 font-mono font-bold rounded ${
                            tech.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            tech.status === 'Under Review' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>{tech.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend Column */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">API & Processing Layer</h4>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">BACKEND</span>
                  </div>
                  <div className="p-4 flex-1 space-y-3.5">
                    {filteredTech.filter(t => t.category === 'Backend').map(tech => (
                      <div key={tech.id} className="p-3 border border-slate-100 rounded bg-slate-50 hover:bg-slate-100/50 transition-colors relative group">
                        <button 
                          onClick={() => handleDeleteTech(tech.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-xs font-bold text-slate-800">{tech.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{tech.role}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-[8px] px-1.5 py-0.2 font-mono font-bold rounded ${
                            tech.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            tech.status === 'Under Review' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>{tech.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Infrastructure Column */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Storage & Edge Delivery</h4>
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.2 rounded">INFRASTRUCTURE</span>
                  </div>
                  <div className="p-4 flex-1 space-y-3.5">
                    {filteredTech.filter(t => t.category === 'Infrastructure').map(tech => (
                      <div key={tech.id} className="p-3 border border-slate-100 rounded bg-slate-50 hover:bg-slate-100/50 transition-colors relative group">
                        <button 
                          onClick={() => handleDeleteTech(tech.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-xs font-bold text-slate-800">{tech.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{tech.role}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-[8px] px-1.5 py-0.2 font-mono font-bold rounded ${
                            tech.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            tech.status === 'Under Review' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>{tech.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 4. DATA SCHEMA MODELS PANEL */}
          {activeTab === 'data' && (
            <div id="section-data" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Relational Schema & Database Designer</h3>
                  <p className="text-xs text-slate-500">Design entity relationships, configure primary/foreign keys, and map relational fields for cloud persistence.</p>
                </div>
                <button 
                  id="btn-add-table-trigger"
                  onClick={() => setIsTableModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Table</span>
                </button>
              </div>

              {/* SQL visual editor and listing */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* Loop and render schemas as realistic database tables */}
                {dataTables.map(table => (
                  <div key={table.id} className="col-span-12 md:col-span-6 xl:col-span-4 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="px-4 py-2.5 bg-slate-900 text-white flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-bold font-mono tracking-wide">{table.name}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteTable(table.id)}
                        className="text-slate-400 hover:text-red-400 p-0.5 transition-colors"
                        title="Drop Table"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex-1 p-2 bg-slate-50 font-mono text-[11px]">
                      <div className="bg-white rounded border border-slate-200 divide-y divide-slate-100">
                        {table.fields.map((field, idx) => (
                          <div key={idx} className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50">
                            <div className="flex items-center gap-2">
                              {field.isKey ? (
                                <span className="text-[9px] font-bold text-amber-500 border border-amber-200 bg-amber-50 px-1 rounded">PK</span>
                              ) : (
                                <span className="w-4"></span>
                              )}
                              <span className="font-bold text-slate-800">{field.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">{field.type}</span>
                              <span className="text-[9px] text-slate-400">
                                {field.isNullable ? 'NULL' : 'NOT NULL'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* 5. API SPECS & SIMULATOR CLIENT */}
          {activeTab === 'apis' && (
            <div id="section-apis" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">API Specifications & Sandbox Client</h3>
                  <p className="text-xs text-slate-500">Test client-server connection payloads, configure endpoint routes, and run simulated REST requests.</p>
                </div>
                <button 
                  id="btn-add-api-trigger"
                  onClick={() => setIsApiModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Endpoint</span>
                </button>
              </div>

              {/* API Sandbox Grid */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* Left panel: List endpoints */}
                <div className="col-span-12 lg:col-span-5 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Lumina Spec Index</h4>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {filteredApis.map(api => (
                        <div 
                          key={api.id} 
                          onClick={() => setSelectedSandboxApi(api.id)}
                          className={`p-3 cursor-pointer transition-colors flex items-start gap-3 relative group ${
                            selectedSandboxApi === api.id ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded w-14 text-center shrink-0 ${
                            api.method === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                            api.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            api.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {api.method}
                          </span>
                          
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-mono font-bold text-slate-800 truncate">{api.path}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 truncate">{api.desc}</div>
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteApi(api.id);
                            }}
                            className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Endpoint"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right panel: Active Endpoint Sandbox */}
                <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                  {(() => {
                    const activeApi = apiSpecs.find(a => a.id === selectedSandboxApi);
                    if (!activeApi) return <div className="p-6 text-center text-slate-400 text-xs">Select an API Endpoint to test.</div>;
                    
                    return (
                      <>
                        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-xs font-mono font-bold text-slate-300">Mock Sandbox Client</span>
                          </div>
                          
                          <button 
                            onClick={executeSandboxRequest}
                            disabled={sandboxIsLoading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>{sandboxIsLoading ? 'Sending...' : 'Send Request'}</span>
                          </button>
                        </div>

                        {/* Request parameters layout */}
                        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 space-y-4">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Target Endpoint</div>
                            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded">
                              <span className="text-emerald-400 font-extrabold text-[10px]">{activeApi.method}</span>
                              <span className="text-white text-xs">{activeApi.path}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">JSON Payload Parameters</div>
                              <textarea 
                                value={sandboxRequest}
                                onChange={(e) => setSandboxRequest(e.target.value)}
                                rows={6}
                                className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-[11px] text-emerald-300 focus:outline-none focus:border-slate-700 font-mono resize-none"
                              />
                            </div>

                            <div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Simulator Output Logs</div>
                              <div className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-[10px] text-slate-400 h-[126px] overflow-y-auto space-y-1">
                                {sandboxLogs.length === 0 ? (
                                  <div className="text-slate-600 italic">No logs yet. Execute request to start simulation...</div>
                                ) : (
                                  sandboxLogs.map((log, idx) => (
                                    <div key={idx}>{log}</div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">JSON Server Response</div>
                            <pre className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-[11px] text-blue-300 h-28 overflow-y-auto whitespace-pre-wrap">
                              {sandboxResponse || '// Click Send Request above to parse response'}
                            </pre>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

              </div>
            </div>
          )}

          {/* 6. FIGMA ASSETS / WIREFRAME SANDBOX */}
          {activeTab === 'figma' && (
            <div id="section-figma" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">UI Layout Wireframe Sandbox</h3>
                  <p className="text-xs text-slate-500">Render dynamic grid blueprints, configure UI visual density parameters, and generate high-fidelity layout specs.</p>
                </div>
                
                {/* Density selector tools */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md border border-slate-200">
                  <button 
                    onClick={() => setWireframeDensity('high')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${wireframeDensity === 'high' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    High Density
                  </button>
                  <button 
                    onClick={() => setWireframeDensity('standard')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${wireframeDensity === 'standard' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setWireframeDensity('low')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${wireframeDensity === 'low' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    Low
                  </button>
                </div>
              </div>

              {/* Wireframe playground */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* Configurator Controls */}
                <div className="col-span-12 lg:col-span-4 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Layout Presets</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setWireframeLayout('dashboard')}
                        className={`w-full text-left px-3 py-2 text-xs rounded border transition-all flex items-center justify-between ${
                          wireframeLayout === 'dashboard' ? 'bg-blue-50 border-blue-300 font-bold text-blue-900' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>Multi-grid Dashboard</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">12-col</span>
                      </button>

                      <button 
                        onClick={() => setWireframeLayout('split')}
                        className={`w-full text-left px-3 py-2 text-xs rounded border transition-all flex items-center justify-between ${
                          wireframeLayout === 'split' ? 'bg-blue-50 border-blue-300 font-bold text-blue-900' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>Two-column Explorer</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">Sidebar</span>
                      </button>

                      <button 
                        onClick={() => setWireframeLayout('detailed')}
                        className={`w-full text-left px-3 py-2 text-xs rounded border transition-all flex items-center justify-between ${
                          wireframeLayout === 'detailed' ? 'bg-blue-50 border-blue-300 font-bold text-blue-900' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>Single-view Spec Sheet</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">Full width</span>
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Density Specs</div>
                      <div className="bg-slate-50 p-3 rounded font-mono text-[10px] space-y-1.5 text-slate-600">
                        <div>Spacing Unit: <span className="text-slate-900 font-bold">{wireframeDensity === 'high' ? '4px (p-1)' : wireframeDensity === 'standard' ? '12px (p-3)' : '24px (p-6)'}</span></div>
                        <div>Target Platform: <span className="text-slate-900 font-bold">Cloud Console</span></div>
                        <div>Render Quality: <span className="text-slate-900 font-bold">SVG Blueprint Canvas</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Render Canvas based on preset and density */}
                <div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-lg p-5 border border-slate-800 text-slate-300 min-h-[380px] flex flex-col justify-between shadow-xl">
                  
                  {/* Top Canvas Label */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Canvas: Figma Blueprint Wireframe</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono uppercase font-bold">
                      {wireframeDensity} Density
                    </span>
                  </div>

                  {/* Wireframe render box */}
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded p-4 flex flex-col gap-2 font-mono text-[9px]">
                    
                    {/* Header simulation */}
                    <div className="border border-dashed border-slate-700 p-2 rounded flex justify-between items-center text-slate-500">
                      <span>Header: Lumina Console</span>
                      <div className="flex gap-2">
                        <span className="w-8 h-2 bg-slate-800 rounded"></span>
                        <span className="w-12 h-2 bg-slate-800 rounded"></span>
                      </div>
                    </div>

                    {/* Dashboard preset */}
                    {wireframeLayout === 'dashboard' && (
                      <div className="grid grid-cols-12 gap-2 flex-1">
                        <div className="col-span-4 border border-dashed border-slate-700 p-2 rounded text-slate-500 flex flex-col justify-between">
                          <span>Sidebar Panel</span>
                          <div className="space-y-1">
                            <div className="h-1 bg-slate-800 rounded w-2/3"></div>
                            <div className="h-1 bg-slate-800 rounded w-full"></div>
                            <div className="h-1 bg-slate-800 rounded w-1/2"></div>
                          </div>
                        </div>

                        <div className="col-span-8 space-y-2 flex flex-col">
                          <div className="border border-dashed border-slate-700 p-2 rounded text-slate-500 flex-1 flex flex-col justify-between">
                            <span>Main Stats Table</span>
                            <div className="space-y-1.5 mt-2">
                              <div className="flex justify-between border-b border-slate-800 pb-1">
                                <span className="text-[8px] text-slate-600">Module</span>
                                <span className="text-[8px] text-slate-600">Priority</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Workspace</span>
                                <span className="text-slate-400">P0</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Inference</span>
                                <span className="text-slate-400">P0</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="border border-dashed border-slate-700 p-2 rounded text-slate-500 text-center">
                              <span>Flow Chart</span>
                            </div>
                            <div className="border border-dashed border-slate-700 p-2 rounded text-slate-500 text-center">
                              <span>Tech Stack</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Split Layout preset */}
                    {wireframeLayout === 'split' && (
                      <div className="flex gap-2 flex-1">
                        <div className="w-1/3 border border-dashed border-slate-700 p-3 rounded text-slate-500 flex flex-col justify-between">
                          <div>
                            <span>Explorer Nodes</span>
                            <div className="mt-2 space-y-1.5">
                              <div className="h-1.5 bg-slate-800 rounded w-3/4"></div>
                              <div className="h-1.5 bg-slate-800 rounded w-1/2"></div>
                              <div className="h-1.5 bg-slate-800 rounded w-2/3"></div>
                            </div>
                          </div>
                        </div>

                        <div className="w-2/3 border border-dashed border-slate-700 p-3 rounded text-slate-500 flex flex-col justify-between">
                          <div>
                            <span>Content Detailed Editor</span>
                            <div className="mt-4 space-y-3">
                              <div className="h-3 bg-slate-900 rounded w-full"></div>
                              <div className="h-2 bg-slate-900 rounded w-4/5"></div>
                              <div className="h-2 bg-slate-900 rounded w-2/3"></div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <span className="w-12 h-3.5 bg-slate-800 rounded"></span>
                            <span className="w-16 h-3.5 bg-blue-900 rounded"></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detailed layout preset */}
                    {wireframeLayout === 'detailed' && (
                      <div className="flex-1 border border-dashed border-slate-700 p-4 rounded text-slate-500 flex flex-col justify-between">
                        <div>
                          <span className="text-slate-400 font-bold">Lumina Platform Specs Detail</span>
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                              <span className="text-[8px] text-slate-500">DATABASE</span>
                              <div className="h-1 bg-slate-700 rounded w-2/3 mt-1"></div>
                            </div>
                            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                              <span className="text-[8px] text-slate-500">API SPECS</span>
                              <div className="h-1 bg-slate-700 rounded w-1/2 mt-1"></div>
                            </div>
                            <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                              <span className="text-[8px] text-slate-500">TIMELINE</span>
                              <div className="h-1 bg-slate-700 rounded w-3/4 mt-1"></div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 mt-4">
                          <div className="h-1 bg-slate-800 rounded w-full"></div>
                          <div className="h-1 bg-slate-800 rounded w-full"></div>
                          <div className="h-1 bg-slate-800 rounded w-2/3"></div>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Grid columns: 12-columns responsive system</span>
                    <button 
                      onClick={() => showToast("Figma layout framework synchronized!")}
                      className="text-blue-400 hover:text-white transition-colors"
                    >
                      Export Layout Specs
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* 1. MODULE CREATION MODAL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Add Functional Module</h4>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddModule} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Module Name</label>
                <input 
                  type="text" 
                  value={newModName}
                  onChange={(e) => setNewModName(e.target.value)}
                  placeholder="e.g. Authentication, Billing, Search"
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Description</label>
                <textarea 
                  value={newModDesc}
                  onChange={(e) => setNewModDesc(e.target.value)}
                  placeholder="Define functionality or architecture..."
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Priority</label>
                  <select 
                    value={newModPriority}
                    onChange={(e) => setNewModPriority(e.target.value as 'P0' | 'P1' | 'P2')}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="P0">P0 (Critical)</option>
                    <option value="P1">P1 (Important)</option>
                    <option value="P2">P2 (Optional)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Complexity</label>
                  <select 
                    value={newModComplexity}
                    onChange={(e) => setNewModComplexity(e.target.value as 'Low' | 'Medium' | 'High')}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Development Status</label>
                <select 
                  value={newModStatus}
                  onChange={(e) => setNewModStatus(e.target.value as 'Not Started' | 'In Progress' | 'Completed')}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 shadow cursor-pointer"
                >
                  Add Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. TECH BLOCK CREATION MODAL */}
      {isTechModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Add Stack Tech Block</h4>
              <button onClick={() => setIsTechModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddTech} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Technology Name</label>
                <input 
                  type="text" 
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  placeholder="e.g. Next.js, Prisma, Redis"
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Category Stack</label>
                <select 
                  value={newTechCategory}
                  onChange={(e) => setNewTechCategory(e.target.value as 'Frontend' | 'Backend' | 'Infrastructure')}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Frontend">Frontend Stack</option>
                  <option value="Backend">Backend / DB / Services</option>
                  <option value="Infrastructure">Infrastructure / Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Functional Role</label>
                <input 
                  type="text" 
                  value={newTechRole}
                  onChange={(e) => setNewTechRole(e.target.value)}
                  placeholder="e.g. API Services Layer, Job Scheduling"
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Status</label>
                <select 
                  value={newTechStatus}
                  onChange={(e) => setNewTechStatus(e.target.value as 'Approved' | 'Under Review' | 'Proposed')}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                >
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Proposed">Proposed</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 shadow cursor-pointer"
                >
                  Add Tech Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. FLOW BLOCK CREATION MODAL */}
      {isFlowModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Add Flow Step</h4>
              <button onClick={() => setIsFlowModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddFlow} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Step Label</label>
                <input 
                  type="text" 
                  value={newFlowLabel}
                  onChange={(e) => setNewFlowLabel(e.target.value)}
                  placeholder="e.g. Select AI Model, Save Result"
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Type</label>
                  <select 
                    value={newFlowType}
                    onChange={(e) => setNewFlowType(e.target.value as 'Action' | 'State' | 'System')}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="Action">Action Block</option>
                    <option value="State">User State</option>
                    <option value="System">System Node</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Pipeline Stage</label>
                  <select 
                    value={newFlowGroup}
                    onChange={(e) => setNewFlowGroup(e.target.value as 'Planning' | 'Orchestration' | 'Deliverables')}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="Planning">Session Init</option>
                    <option value="Orchestration">Stream Processing</option>
                    <option value="Deliverables">Dispatch & Save</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Description / Action details</label>
                <textarea 
                  value={newFlowDesc}
                  onChange={(e) => setNewFlowDesc(e.target.value)}
                  placeholder="Explain transaction details..."
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 h-16 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsFlowModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 shadow cursor-pointer"
                >
                  Create Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. SQL TABLE CREATION MODAL */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Create Relational SQL Table</h4>
              <button onClick={() => setIsTableModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddTable} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Table Name</label>
                <input 
                  type="text" 
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="e.g. Projects, AuditTrail"
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  required
                />
              </div>

              {/* Temporary Fields list */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Column definitions</div>
                
                <div className="space-y-1.5 max-h-28 overflow-y-auto mb-3">
                  {newTableFields.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        {f.isKey && <span className="text-[8px] bg-amber-500 text-white font-bold px-1 rounded">PK</span>}
                        <span className="font-bold">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{f.type}</span>
                        {i > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveFieldFromNewTable(i)}
                            className="text-slate-400 hover:text-red-500 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Field builder row */}
                <div className="grid grid-cols-12 gap-2">
                  <input 
                    type="text" 
                    placeholder="Field name"
                    value={tempFieldName}
                    onChange={(e) => setTempFieldName(e.target.value)}
                    className="col-span-5 text-xs border border-slate-300 bg-white rounded px-2 py-1 focus:outline-none"
                  />
                  <select 
                    value={tempFieldType}
                    onChange={(e) => setTempFieldType(e.target.value)}
                    className="col-span-4 text-xs border border-slate-300 bg-white rounded px-2 py-1"
                  >
                    <option value="VARCHAR(100)">VARCHAR(100)</option>
                    <option value="TEXT">TEXT</option>
                    <option value="INTEGER">INTEGER</option>
                    <option value="UUID">UUID</option>
                    <option value="TIMESTAMP">TIMESTAMP</option>
                    <option value="BOOLEAN">BOOLEAN</option>
                  </select>
                  <div className="col-span-2 flex items-center justify-center">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tempFieldIsPK} 
                        onChange={(e) => setTempFieldIsPK(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-[10px] text-slate-500">PK</span>
                    </label>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddFieldToNewTable}
                    className="col-span-1 bg-slate-900 text-white rounded hover:bg-slate-800 flex items-center justify-center p-1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsTableModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 shadow cursor-pointer"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. API SPEC CREATION MODAL */}
      {isApiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Add API Route Spec</h4>
              <button onClick={() => setIsApiModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddApi} className="p-5 space-y-4">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Method</label>
                  <select 
                    value={newApiMethod}
                    onChange={(e) => setNewApiMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE')}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <div className="col-span-9">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Path</label>
                  <input 
                    type="text" 
                    value={newApiPath}
                    onChange={(e) => setNewApiPath(e.target.value)}
                    placeholder="e.g. /api/billing/usage"
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Category</label>
                  <input 
                    type="text" 
                    value={newApiCategory}
                    onChange={(e) => setNewApiCategory(e.target.value)}
                    placeholder="e.g. Workspace, Auth"
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Brief Description</label>
                  <input 
                    type="text" 
                    value={newApiDesc}
                    onChange={(e) => setNewApiDesc(e.target.value)}
                    placeholder="Brief definition of route task"
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[11px]">
                <div>
                  <label className="block text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wide mb-1">Request Body (JSON)</label>
                  <textarea 
                    value={newApiRequest}
                    onChange={(e) => setNewApiRequest(e.target.value)}
                    rows={5}
                    className="w-full border border-slate-300 rounded p-2 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wide mb-1">Response Payload</label>
                  <textarea 
                    value={newApiResponse}
                    onChange={(e) => setNewApiResponse(e.target.value)}
                    rows={5}
                    className="w-full border border-slate-300 rounded p-2 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsApiModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 shadow cursor-pointer"
                >
                  Add Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. RISK CREATION MODAL */}
      {isRiskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Flag Operational Risk</h4>
              <button onClick={() => setIsRiskModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddRisk} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Risk / Issue Title</label>
                <input 
                  type="text" 
                  value={newRiskTitle}
                  onChange={(e) => setNewRiskTitle(e.target.value)}
                  placeholder="e.g. DB Latency, LLM Token Quotas"
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Risk description & Impact</label>
                <textarea 
                  value={newRiskDesc}
                  onChange={(e) => setNewRiskDesc(e.target.value)}
                  placeholder="Describe potential impacts or recovery specs..."
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 h-16 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Severity Level</label>
                <select 
                  value={newRiskSeverity}
                  onChange={(e) => setNewRiskSeverity(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="High">High Severity</option>
                  <option value="Medium">Medium Severity</option>
                  <option value="Low">Low Severity</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsRiskModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 shadow cursor-pointer"
                >
                  Flag Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. SHARE MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>Share Blueprint Proposal</span>
              </h4>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600">Generate a live-syncing shareable review URL that allows other product managers to view and comment on your functional specs.</p>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Generated Access Link</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://lumina-pm.blueprint/review/share-v2_4"
                    className="bg-slate-50 border border-slate-300 rounded text-xs px-2.5 py-1.5 select-all focus:outline-none flex-1 font-mono text-slate-700"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("https://lumina-pm.blueprint/review/share-v2_4");
                      showToast("Share link copied to clipboard!");
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded transition-all cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Review Collaboration Config</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>Access Authority: <strong>Read-Only</strong></div>
                  <div>Sync Loop: <strong>Immediate SSE</strong></div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  onClick={() => setShareModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 shadow w-full text-center cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. EXPORT BLUEPRINT MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white border border-slate-300 w-full max-w-xl rounded-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" />
                <span>Compile & Export Blueprint Document</span>
              </h4>
              <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600">Compile the dynamic project parameters, database fields, custom API specs, and timelines into a pristine, print-ready document.</p>
              
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-[11px] space-y-3 max-h-56 overflow-y-auto font-mono">
                <div className="border-b border-slate-200 pb-1.5 text-slate-500 font-bold uppercase text-[9px]">Preview: Compiled Blueprint Summary</div>
                <div>
                  <strong className="text-slate-800">1. Product Meta</strong>
                  <div className="text-slate-600 ml-3">Project Title: Lumina AI Platform</div>
                  <div className="text-slate-600 ml-3">MVP Timeline Estimation: {mvpTimelineWeeks} Weeks</div>
                </div>
                <div>
                  <strong className="text-slate-800">2. Active Modules ({totalModules})</strong>
                  <div className="text-slate-600 ml-3 space-y-0.5">
                    {modules.map(m => (
                      <div key={m.id}>- {m.name} ({m.priority} Priority, {m.complexity} Complex)</div>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="text-slate-800">3. Backend & Data schemas ({totalTables} Tables)</strong>
                  <div className="text-slate-600 ml-3 space-y-0.5">
                    {dataTables.map(t => (
                      <div key={t.id}>- Table: {t.name} ({t.fields.length} schema fields)</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  onClick={() => setExportModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    showToast("Compiled PDF downloaded successfully!");
                    setExportModalOpen(false);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
