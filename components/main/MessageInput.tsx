import React, { useState } from 'react';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { SendIcon } from '../icons/SendIcon';
import Spinner from '../ui/Spinner';
import { GoogleDriveFile } from '../../types';
import { FileIcon } from '../icons/FileIcon';


interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isSending: boolean;
  attachedFile: GoogleDriveFile | null;
  onRemoveAttachment: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isSending, attachedFile, onRemoveAttachment }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((content.trim() || attachedFile) && !isSending) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="relative">
      {attachedFile && (
        <div className="absolute bottom-full left-0 mb-2 w-full">
            <div className="bg-surface p-2 rounded-md flex items-center justify-between text-sm border border-border shadow-md">
                <div className="flex items-center gap-2 overflow-hidden">
                    <FileIcon className="w-5 h-5 flex-shrink-0 text-text-secondary" />
                    <span className="truncate text-text-secondary" title={attachedFile.name}>
                        {attachedFile.name}
                    </span>
                </div>
                <button 
                    onClick={onRemoveAttachment} 
                    className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-surface-hover transition-colors flex-shrink-0 ml-2"
                    aria-label="Remove attachment"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 !py-3"
          disabled={isSending}
        />
        <Button type="submit" disabled={isSending || (!content.trim() && !attachedFile)} className="!p-3">
          {isSending ? <Spinner className="h-5 w-5"/> : <SendIcon className="h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
