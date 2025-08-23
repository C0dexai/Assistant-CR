
import React, { useState } from 'react';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { SendIcon } from '../icons/SendIcon';
import Spinner from '../ui/Spinner';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isSending }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSending) {
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
        <Button type="submit" disabled={isSending || !content.trim()} className="!p-3">
          {isSending ? <Spinner className="h-5 w-5"/> : <SendIcon className="h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
