import React, { useState } from 'react';
import { Assistant, Thread, Message, OpenAI_Assistant, GoogleDriveFile } from '../../types';
import ThreadsPanel from '../middle/ThreadsPanel';
import ChatPanel from './ChatPanel';
import FilesPanel from './FilesPanel';
import SandboxPanel from './SandboxPanel';
import SettingsPanel from './SettingsPanel';
import DrivePanel from './DrivePanel';
import Tabs from '../ui/Tabs';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';
import { GoogleDriveIcon } from '../icons/GoogleDriveIcon';


interface MainContentProps {
  assistant: Assistant;
  threads: Thread[];
  messages: Message[];
  selectedThreadId: string | null;
  onSelectThread: (id: string) => void;
  onCreateThread: () => void;
  onDeleteThread: (id: string) => void;
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
  onUpdateAssistant: (id: string, updates: Partial<Assistant>) => void;
  googleAccessToken: string | null;
  onDriveFileSelect: (file: GoogleDriveFile) => void;
  attachedFile: GoogleDriveFile | null;
  onRemoveAttachment: () => void;
}

const MainContent: React.FC<MainContentProps> = (props) => {
  const [activeTab, setActiveTab] = useState('chat');
  
  const { assistant, threads, selectedThreadId, onSelectThread, onCreateThread, onDeleteThread } = props;

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'files', label: 'Knowledge Files', disabled: assistant.provider !== 'openai' },
    { id: 'sandbox', label: 'Sandbox', disabled: assistant.provider !== 'openai' },
    { id: 'drive', label: 'Google Drive', disabled: !props.googleAccessToken },
    { id: 'settings', label: 'Settings' },
  ];
  
  const currentThread = threads.find(t => t.id === selectedThreadId);

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border bg-background flex-shrink-0">
        <h2 className="text-xl font-bold">{assistant.name}</h2>
        <p className="text-sm text-text-secondary">
          {`Provider: ${assistant.provider} | Model: ${assistant.model}`}
        </p>
      </header>
      
      <div className="px-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' && (
          <div className="flex h-full">
            <div className="w-72 border-r border-border flex-shrink-0">
                <ThreadsPanel 
                    threads={threads}
                    selectedThreadId={selectedThreadId}
                    onSelectThread={onSelectThread}
                    onCreateThread={onCreateThread}
                    onDeleteThread={onDeleteThread}
                    disabled={false}
                />
            </div>
            <div className="flex-1">
                {selectedThreadId && currentThread ? (
                    <ChatPanel
                        key={selectedThreadId}
                        assistant={props.assistant}
                        thread={currentThread}
                        messages={props.messages}
                        isStreaming={props.isStreaming}
                        onSendMessage={props.onSendMessage}
                        attachedFile={props.attachedFile}
                        onRemoveAttachment={props.onRemoveAttachment}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <ChatBubbleIcon className="w-16 h-16 text-gray-600 mb-6" />
                        <h2 className="text-2xl font-bold text-text-primary mb-2">Select a Thread</h2>
                        <p className="text-md text-text-secondary max-w-md">
                        Choose a thread from the left panel or create a new one to start chatting.
                        </p>
                    </div>
                )}
            </div>
          </div>
        )}
        {activeTab === 'files' && assistant.provider === 'openai' && (
          <FilesPanel assistant={assistant as OpenAI_Assistant} />
        )}
        {activeTab === 'sandbox' && assistant.provider === 'openai' && (
          <SandboxPanel assistant={assistant as OpenAI_Assistant} />
        )}
        {activeTab === 'drive' && props.googleAccessToken && (
            <DrivePanel accessToken={props.googleAccessToken} onFileSelect={props.onDriveFileSelect} />
        )}
        {activeTab === 'settings' && (
          <SettingsPanel assistant={assistant} onUpdateAssistant={props.onUpdateAssistant} />
        )}
      </div>
    </div>
  );
};

export default MainContent;
