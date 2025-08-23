import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { GeminiIcon } from '../icons/GeminiIcon';
import { OpenAiIcon } from '../icons/OpenAiIcon';

interface CreateAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, instructions: string, provider: 'gemini' | 'openai') => void;
}

const CreateAssistantModal: React.FC<CreateAssistantModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && instructions.trim()) {
      setIsLoading(true);
      try {
        await onCreate(name, instructions, provider);
        setName('');
        setInstructions('');
        setProvider('gemini');
        onClose();
      } catch (error) {
        console.error("Creation failed", error);
        // Error is handled in App.tsx
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleClose = () => {
    if (isLoading) return;
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Assistant">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Provider</label>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setProvider('gemini')} className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-colors ${provider === 'gemini' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
              <GeminiIcon className="w-5 h-5"/>
              <span>Gemini</span>
            </button>
            <button type="button" onClick={() => setProvider('openai')} className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-colors ${provider === 'openai' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
              <OpenAiIcon className="w-5 h-5"/>
              <span>OpenAI</span>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Name</label>
          <Input 
            id="name" 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Vue Component Expert"
            required 
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-text-secondary">Instructions</label>
          <Textarea 
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder={provider === 'gemini' 
                ? "You are an expert Vue.js developer. You specialize in creating accessible and performant UIs with Shadcn-Vue and TailwindCSS."
                : "You are a full-stack engineer. You can build entire features using Node.js, Express, and Vue.js. You can write code, configure Vite build tools, and set up project structures."
            }
            required 
            rows={5}
            className="mt-1"
          />
           <p className="mt-2 text-xs text-gray-500">
            { provider === 'openai' 
                ? "Your assistant will be created with `file_search` and `code_interpreter` tools, ideal for analyzing specs and writing code."
                : "This will be the system prompt for the Gemini model, defining its personality as a web developer."
            }
           </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" disabled={isLoading || !name.trim() || !instructions.trim()}>
            {isLoading ? 'Creating...' : 'Create Assistant'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAssistantModal;