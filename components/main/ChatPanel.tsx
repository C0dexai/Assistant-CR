import React, { useRef, useEffect } from 'react';
import { Assistant, Thread, Message as MessageType } from '../../types';
import Message from './Message';
import MessageInput from './MessageInput';

interface ChatPanelProps {
  assistant: Assistant;
  thread: Thread;
  messages: MessageType[];
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ assistant, thread, messages, isStreaming, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="p-4 border-b border-border bg-background">
        <h2 className="text-xl font-bold">{assistant.name}</h2>
        <p className="text-sm text-text-secondary truncate">{thread.title}</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} isStreaming={isStreaming && msg.role === 'assistant' && msg.id === messages[messages.length - 1].id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 border-t border-border bg-background">
        <MessageInput 
          onSendMessage={onSendMessage} 
          isSending={isStreaming}
        />
      </footer>
    </div>
  );
};

export default ChatPanel;
