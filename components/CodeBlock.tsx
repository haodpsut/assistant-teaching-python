
import React from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CodeBlockProps {
    code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-code-bg rounded-lg overflow-hidden border border-gray-700 relative">
            <div className="p-4 font-mono text-sm text-dark-text overflow-x-auto">
                <pre><code>{code}</code></pre>
            </div>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md text-dark-text-secondary hover:bg-gray-600 hover:text-white transition-colors"
                aria-label="Copy code"
            >
                {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
            </button>
        </div>
    );
};
