import React, { useState, useEffect } from 'react';
import { Assistant } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

interface SettingsPanelProps {
  assistant: Assistant;
  onUpdateAssistant: (id: string, updates: Partial<Assistant>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ assistant, onUpdateAssistant }) => {
  const [name, setName] = useState(assistant.name);
  const [instructions, setInstructions] = useState(assistant.instructions);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsDirty(name !== assistant.name || instructions !== assistant.instructions);
  }, [name, instructions, assistant]);

  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
        await onUpdateAssistant(assistant.id, { name, instructions });
        setIsDirty(false);
    } catch(error) {
        console.error("Failed to save assistant settings", error);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-1">Assistant Settings</h2>
      <p className="text-text-secondary mb-6">Modify your assistant's configuration.</p>
      
      <div className="space-y-6 bg-surface p-6 rounded-lg border border-border">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Name</label>
          <Input 
            id="name" 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-text-secondary">Instructions</label>
          <Textarea 
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={8}
            className="mt-1"
          />
          <p className="mt-2 text-xs text-gray-500">This is the system prompt that guides the assistant's behavior.</p>
        </div>
        
        <div>
            <h3 className="block text-sm font-medium text-text-secondary">Details</h3>
            <div className="mt-2 space-y-2 text-sm text-gray-400">
                <p><strong>Provider:</strong> {assistant.provider}</p>
                <p><strong>Model:</strong> {assistant.model}</p>
                {assistant.provider === 'openai' && (
                  <>
                    <p><strong>Assistant ID:</strong> {assistant.openAiAssistantId}</p>
                    <p><strong>Vector Store ID:</strong> {assistant.vectorStoreId || 'N/A'}</p>
                  </>
                )}
            </div>
        </div>

      </div>
      
      {isDirty && (
        <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;