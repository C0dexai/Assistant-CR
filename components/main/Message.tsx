import React from 'react';
import { Message as MessageType } from '../../types';
import { RobotIcon } from '../icons/RobotIcon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../ui/CodeBlock';


interface MessageProps {
  message: MessageType;
  isStreaming: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-700' : 'bg-secondary'}`}>
        {isUser ? (
          <span className="text-xl font-bold text-gray-200">U</span>
        ) : (
          <RobotIcon className="w-6 h-6" />
        )}
      </div>
      <div className={`rounded-lg max-w-3xl w-fit ${isUser ? 'bg-primary text-white' : 'bg-surface-hover text-text-primary'}`}>
         <div className="px-4 py-3 markdown-container">
            <ReactMarkdown
                children={message.content + (isStreaming ? '▍' : '')}
                remarkPlugins={[remarkGfm]}
                components={{
                    code: CodeBlock,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                }}
            />
         </div>
         { !isUser && message.createdAt && (
            <div className={`text-xs mt-1 px-4 pb-2 text-right text-gray-400`}>
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          )
         }
      </div>
    </div>
  );
};

export default Message;
