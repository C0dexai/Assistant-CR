import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from '../ui/Button';
import { GeminiIcon } from '../icons/GeminiIcon';
import { OpenAiIcon } from '../icons/OpenAiIcon';
import { ApiIcon } from '../icons/ApiIcon';
import { SyncIcon } from '../icons/SyncIcon';
import { BrainCircuitIcon } from '../icons/BrainCircuitIcon';
import { PlayIcon } from '../icons/PlayIcon';
import { StopIcon } from '../icons/StopIcon';
import { RobotIcon } from '../icons/RobotIcon';
import { FileIcon } from '../icons/FileIcon';

const AGENTS = {
  architect: { name: 'FE Architect', domain: 'A', responsibilities: 'Vue.js Component Design' },
  backend: { name: 'Backend Dev', domain: 'A', responsibilities: 'Node.js API Implementation' },
  uiux: { name: 'UI/UX Pro', domain: 'B', responsibilities: 'Shadcn Theming & Layout' },
  devops: { name: 'DevOps Eng', domain: 'B', responsibilities: 'Vite Build & CI/CD' },
  reviewer: { name: 'Code Reviewer', domain: 'Center', responsibilities: 'QA & Best Practices' },
};

const WORKFLOW = [
    { agent: 'architect', task: 'Received user request. Scaffolding Vue app with Vite and designing component architecture.', handoff: 'backend', duration: 2500, link: { from: 'architect', to: 'backend', type: 'A2A' } },
    { agent: 'backend', task: 'Received frontend plan. Defining Node.js/Express API endpoints for tasks.', handoff: 'uiux', duration: 2000, link: { from: 'backend', to: 'uiux', type: 'API' } },
    { agent: 'uiux', task: 'Designing UI with Shadcn-Vue. Defining layout and component states.', handoff: 'architect', duration: 3000, link: { from: 'uiux', to: 'architect', type: 'A2A' } },
    { agent: 'meta_gemini', task: 'Supervisory check: Optimizing Vue component reactivity and performance.', duration: 1500, parent: 'architect' },
    { agent: 'backend', task: 'Implementing API endpoints and database logic.', handoff: 'reviewer', duration: 2500, link: { from: 'backend', to: 'reviewer', type: 'API' } },
    { agent: 'meta_openai', task: 'Supervisory check: Adding security middleware to Node.js server.', duration: 1500, parent: 'backend' },
    { agent: 'devops', task: 'Configuring vite.config.ts for production build and setting up CI pipeline.', handoff: 'reviewer', duration: 2000, link: { from: 'devops', to: 'reviewer', type: 'A2A' } },
    { agent: 'reviewer', task: 'Performing final code review, merging branches, and preparing for deployment.', handoff: null, duration: 2000 },
];

const KNOWLEDGE_FILES_INITIAL = [
  { id: 1, name: 'vite.config.ts', version: 1, status: 'synced' },
  { id: 2, name: 'api/routes.js', version: 1, status: 'synced' },
  { id: 3, name: 'src/App.vue', version: 1, status: 'synced' },
  { id: 4, name: 'package.json', version: 1, status: 'synced' },
];

type AgentStatus = 'idle' | 'active' | 'handoff' | 'error';
type AgentName = keyof typeof AGENTS | 'meta_gemini' | 'meta_openai';

const OrchestrationPanel: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [agentStatus, setAgentStatus] = useState<Record<AgentName, AgentStatus>>(() =>
    Object.keys(AGENTS).reduce((acc, key) => ({ ...acc, [key]: 'idle' }), {} as any)
  );
  const [log, setLog] = useState<any[]>([]);
  const [knowledgeFiles, setKnowledgeFiles] = useState(KNOWLEDGE_FILES_INITIAL);
  const [communicationLink, setCommunicationLink] = useState<any>(null);

  const timerRef = useRef<number | null>(null);

  const resetState = useCallback(() => {
    setCurrentStep(-1);
    setAgentStatus(Object.keys(AGENTS).reduce((acc, key) => ({ ...acc, [key]: 'idle' }), {} as any));
    setLog([]);
    setKnowledgeFiles(KNOWLEDGE_FILES_INITIAL);
    setCommunicationLink(null);
  }, []);

  const runSimulationStep = useCallback(() => {
    const stepIndex = currentStep + 1;
    if (stepIndex >= WORKFLOW.length) {
      setIsSimulating(false);
      setCommunicationLink(null);
      setAgentStatus(prev => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: 'idle' }), {} as any));
      setLog(prev => [...prev, { agent: 'System', text: 'Workflow completed.', timestamp: new Date() }]);
      return;
    }

    setCurrentStep(stepIndex);
    const step = WORKFLOW[stepIndex];

    setLog(prev => [...prev, { agent: step.agent, text: step.task, timestamp: new Date() }]);

    setAgentStatus(prev => ({ ...prev, [step.agent]: 'active' }));
    if(step.parent) setAgentStatus(prev => ({...prev, [step.parent]: 'active'}));
    if(step.link) setCommunicationLink(step.link);
    
    // Update knowledge base
    if (step.agent === 'devops') {
      setKnowledgeFiles(prev => prev.map(f => f.id === 1 ? { ...f, status: 'updating', version: f.version + 1 } : f));
    }
    if (step.agent === 'architect') {
        setKnowledgeFiles(prev => prev.map(f => f.id === 3 ? { ...f, status: 'updating', version: f.version + 1 } : f));
    }


    timerRef.current = window.setTimeout(() => {
      if (step.handoff) {
        setAgentStatus(prev => ({ ...prev, [step.agent]: 'handoff' }));
      } else {
        setAgentStatus(prev => ({ ...prev, [step.agent]: 'idle' }));
      }
      if(step.parent) setAgentStatus(prev => ({...prev, [step.parent]: 'idle'}));

      // Finish knowledge base update
      if (step.agent === 'devops') {
        setKnowledgeFiles(prev => prev.map(f => f.id === 1 ? { ...f, status: 'synced' } : f));
      }
      if (step.agent === 'architect') {
        setKnowledgeFiles(prev => prev.map(f => f.id === 3 ? { ...f, status: 'synced' } : f));
      }
      
      runSimulationStep();
    }, step.duration);

  }, [currentStep]);

  useEffect(() => {
    if (isSimulating) {
      resetState();
      timerRef.current = window.setTimeout(runSimulationStep, 500);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isSimulating, resetState, runSimulationStep]);
  
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'handoff': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }
  
  const AgentCard = ({ name, responsibilities, status }: { name: string, responsibilities: string, status: AgentStatus }) => (
    <div className={`bg-surface p-4 rounded-lg border border-border transition-all duration-300 ${status !== 'idle' ? 'border-primary shadow-lg' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RobotIcon className="w-6 h-6 text-primary"/>
          <h4 className="font-bold text-lg">{name}</h4>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} transition-colors`}></div>
      </div>
      <p className="text-sm text-text-secondary mt-2">{responsibilities}</p>
    </div>
  );
  
  const MetaAgentCard = ({ name, icon, status }: { name: string, icon: React.ReactNode, status: AgentStatus }) => (
    <div className={`flex-1 bg-surface-hover/50 p-4 rounded-lg border border-transparent transition-all duration-300 ${status !== 'idle' ? 'border-primary' : ''}`}>
        <div className="flex items-center gap-3">
          {icon}
          <h4 className="font-bold text-lg">{name}</h4>
          <div className={`w-3 h-3 rounded-full ml-auto ${getStatusColor(status)} transition-colors`}></div>
        </div>
        <p className="text-sm text-text-secondary mt-1">Supervisory Meta-Agent</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background p-4 sm:p-6 gap-6">
      <header className="flex-shrink-0">
        <h1 className="text-2xl font-bold">Automated Web Dev Workflow</h1>
        <p className="text-text-secondary">Live simulation of a multi-agent team building a web application.</p>
      </header>

      <div className="flex gap-4">
        <Button onClick={() => setIsSimulating(p => !p)} disabled={isSimulating && currentStep >= WORKFLOW.length-1}>
          {isSimulating ? <><StopIcon className="w-5 h-5"/> Stop Simulation</> : <><PlayIcon className="w-5 h-5"/> Start Simulation</>}
        </Button>
        <Button variant="secondary" onClick={resetState} disabled={isSimulating}>Reset</Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 min-h-0">

        {/* Meta Agents - Spans all columns on large screens */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row gap-4">
            <MetaAgentCard name="Gemini" icon={<GeminiIcon className="w-7 h-7 text-blue-400" />} status={agentStatus.meta_gemini || 'idle'} />
            <MetaAgentCard name="OpenAI" icon={<OpenAiIcon className="w-7 h-7 text-green-400" />} status={agentStatus.meta_openai || 'idle'} />
        </div>

        {/* Domain A */}
        <div className="bg-surface/50 rounded-lg p-4 flex flex-col gap-4 border border-border">
          <h3 className="text-xl font-semibold text-center">Frontend & Backend</h3>
          <div className="space-y-4">
            <AgentCard name="FE Architect" responsibilities={AGENTS.architect.responsibilities} status={agentStatus.architect}/>
            <AgentCard name="Backend Dev" responsibilities={AGENTS.backend.responsibilities} status={agentStatus.backend}/>
          </div>
        </div>
        
        {/* Center Column - Communication */}
        <div className="bg-surface/50 rounded-lg p-4 flex flex-col items-center justify-around gap-4 border border-border">
            <div className="flex flex-col items-center gap-2 text-center">
              {communicationLink?.type === 'API' && <ApiIcon className="w-10 h-10 text-primary animate-pulse" />}
              {communicationLink?.type === 'A2A' && <BrainCircuitIcon className="w-10 h-10 text-primary animate-pulse" />}
              {communicationLink && <p className="text-xs font-semibold uppercase">{communicationLink.type} Handoff</p>}
            </div>
            <div className="w-full h-px bg-border"></div>
            <AgentCard name="Code Reviewer" responsibilities={AGENTS.reviewer.responsibilities} status={agentStatus.reviewer}/>
        </div>
        
        {/* Domain B */}
        <div className="bg-surface/50 rounded-lg p-4 flex flex-col gap-4 border border-border">
          <h3 className="text-xl font-semibold text-center">Design & Infrastructure</h3>
          <div className="space-y-4">
            <AgentCard name="UI/UX Pro" responsibilities={AGENTS.uiux.responsibilities} status={agentStatus.uiux}/>
            <AgentCard name="DevOps Eng" responsibilities={AGENTS.devops.responsibilities} status={agentStatus.devops}/>
          </div>
        </div>
        
        {/* Bottom Row - Logs and Knowledge - Spans all columns on large screens */}
        <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">
          {/* Audit Log */}
          <div className="bg-surface/50 rounded-lg p-4 flex flex-col border border-border">
            <h3 className="text-lg font-semibold mb-2 flex-shrink-0">Live Audit Trail</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {log.map((entry, i) => (
                <div key={i} className="text-sm font-mono">
                  <span className="text-gray-500 mr-2">{entry.timestamp.toLocaleTimeString()}</span>
                  <span className={`font-bold ${entry.agent.startsWith('meta') ? 'text-purple-400' : 'text-primary'}`}>{entry.agent}:</span>
                  <span className="text-text-secondary ml-1">{entry.text}</span>
                </div>
              ))}
              {!isSimulating && currentStep >= WORKFLOW.length - 1 && (
                  <div className="text-green-400 font-bold p-2 bg-green-500/10 rounded-md">Workflow Complete: Ready for deployment.</div>
              )}
            </div>
          </div>
          
          {/* Knowledge Base */}
          <div className="bg-surface/50 rounded-lg p-4 flex flex-col border border-border">
            <h3 className="text-lg font-semibold mb-2 flex-shrink-0">Project Files</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {knowledgeFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between bg-surface p-2 rounded-md font-mono">
                  <div className="flex items-center gap-3">
                    <FileIcon className="w-5 h-5 text-text-secondary"/>
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs bg-background px-1.5 py-0.5 rounded">v{file.version}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {file.status === 'synced' && <><SyncIcon className="w-5 h-5 text-green-400"/> Synced</>}
                    {file.status === 'updating' && <><SyncIcon className="w-5 h-5 text-yellow-400 animate-spin"/> Updating...</>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationPanel;