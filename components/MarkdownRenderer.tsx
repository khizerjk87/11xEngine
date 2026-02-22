
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none text-sm leading-relaxed overflow-x-hidden">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                className="rounded-lg border border-white/10 !bg-black/40 my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-white/10 px-1 rounded font-mono text-purple-300" {...props}>
                {children}
              </code>
            );
          },
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc ml-4 mb-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-4 mb-4">{children}</ol>,
          h1: ({ children }) => <h1 className="text-xl font-bold mb-4 text-white/90">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-3 text-white/90">{children}</h2>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500/50 pl-4 py-1 italic bg-white/5 rounded-r">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
