
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  const baseClasses = "block w-full bg-surface border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-text-primary resize-none";
  return <textarea className={`${baseClasses} ${className}`} {...props} />;
};

export default Textarea;
