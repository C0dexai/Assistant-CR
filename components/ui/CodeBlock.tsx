import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import { CopyIcon } from '../icons/CopyIcon';
import { CheckIcon } from '../icons/CheckIcon';

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    if (inline) {
        return <code className="text-sm font-mono bg-surface px-1 py-0.5 rounded-sm text-amber-300" {...props}>{children}</code>;
    }
    
    const language = match ? match[1] : 'text';

    return (
        <div className="relative my-2 bg-[#1e1e1e] rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-4 py-1 bg-gray-700/50 rounded-t-lg border-b border-gray-600">
                <span className="text-xs font-sans text-gray-300 capitalize">{language}</span>
                <button
                    className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white disabled:opacity-50 transition-colors"
                    onClick={handleCopy}
                    disabled={isCopied}
                >
                    {isCopied ? (
                        <><CheckIcon className="h-4 w-4 text-green-400" /> Copied!</>
                    ) : (
                        <><CopyIcon className="h-4 w-4" /> Copy code</>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                {...props}
                children={codeString}
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.875rem' }}
                codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' } }}
            />
        </div>
    );
};

export default CodeBlock;
