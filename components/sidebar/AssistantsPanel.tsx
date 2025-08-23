import React, { useState } from 'react';
import { Assistant } from '../../types';
import Button from '../ui/Button';
import CreateAssistantModal from '../modals/CreateAssistantModal';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { GeminiIcon } from '../icons/GeminiIcon';
import { OpenAiIcon } from '../icons/OpenAiIcon';

interface AssistantsPanelProps {
  assistants: Assistant[];
  selectedAssistantId: string | null;
  onSelectAssistant: (id: string) => void;
  onCreateAssistant: (name: string, instructions: string, provider: 'gemini' | 'openai') => void;
  onDeleteAssistant: (id: string) => void;
}

const AssistantsPanel: React.FC<AssistantsPanelProps> = ({ assistants, selectedAssistantId, onSelectAssistant, onCreateAssistant, onDeleteAssistant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDelete = (e: React.MouseEvent, assistantId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this assistant? This will also delete any associated data on the provider\'s service.')) {
        onDeleteAssistant(assistantId);
    }
  };

  const ProviderIcon = ({ provider }: { provider: 'gemini' | 'openai' }) => {
    if (provider === 'gemini') return <GeminiIcon className="w-5 h-5 text-text-secondary" />;
    return <OpenAiIcon className="w-5 h-5 text-text-secondary" />;
  };

  return (
    <>
      <aside className="bg-background flex flex-col h-full">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h1 className="text-lg font-bold">Assistants</h1>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)} className="!p-2">
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {assistants.length > 0 ? (
            <ul>
              {assistants.sort((a,b) => b.createdAt - a.createdAt).map(assistant => (
                <li key={assistant.id}
                  className={`flex justify-between items-center p-3 cursor-pointer hover:bg-surface-hover ${selectedAssistantId === assistant.id ? 'bg-primary/80' : ''}`}
                  onClick={() => onSelectAssistant(assistant.id)}
                  aria-selected={selectedAssistantId === assistant.id}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <ProviderIcon provider={assistant.provider} />
                    <span className="truncate font-medium">{assistant.name}</span>
                  </div>
                  <button onClick={(e) => handleDelete(e, assistant.id)} className="p-1 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-text-secondary text-sm">
              <p>No assistants yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </aside>
      <CreateAssistantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={onCreateAssistant} />
    </>
  );
};

export default AssistantsPanel;
