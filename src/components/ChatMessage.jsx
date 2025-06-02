import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';

// Import all supported languages
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import scala from 'react-syntax-highlighter/dist/esm/languages/prism/scala';
import r from 'react-syntax-highlighter/dist/esm/languages/prism/r';
import dart from 'react-syntax-highlighter/dist/esm/languages/prism/dart';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import html from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import shell from 'react-syntax-highlighter/dist/esm/languages/prism/shell-session';

// Register all languages
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('scala', scala);
SyntaxHighlighter.registerLanguage('r', r);
SyntaxHighlighter.registerLanguage('dart', dart);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('shell', shell);

// Additional aliases for common cases
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('zsh', bash);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('cs', csharp);
SyntaxHighlighter.registerLanguage('rb', ruby);
SyntaxHighlighter.registerLanguage('yml', yaml);

const ChatMessage = ({ message, handleAddCommandFromMessage }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const processedCommands = useRef(new Set());

  // Handle command extraction from raw message content
  useEffect(() => {
    if (!handleAddCommandFromMessage) return;

    // Find all bash code blocks in the raw message content
    const bashBlocks = message.content.match(/```(?:sh|bash)\n([\s\S]*?)```/g) || [];

    bashBlocks.forEach(block => {
      // Extract clean command content
      const command = block
        .replace(/```(?:sh|bash)\n/, '')
        .replace(/```$/, '')
        .trim();

      if (command && !processedCommands.current.has(command)) {
        processedCommands.current.add(command);
        handleAddCommandFromMessage(command);
      }
    });
  }, [message.content, handleAddCommandFromMessage]);

  return (
    <div
      className={`mb-4 p-4 rounded-lg max-w-xl ${
        isUser
          ? 'ml-auto bg-secondary text-white'
          : isSystem
          ? 'mx-auto bg-accent2 text-gray-700 text-center italic text-sm'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '').trim();

            if (!inline && match) {
              return (
                // Added mb-4 class here for vertical spacing
                <div className="relative group mb-4 mt-4">
                  <button
                    onClick={() => navigator.clipboard.writeText(codeString)}
                    className="absolute right-2 top-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded"
                    aria-label="Copy code"
                  >
                    <Copy size={16} className="text-gray-600" />
                  </button>
                  <SyntaxHighlighter
                    style={oneLight}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      fontSize: '0.875rem',
                      padding: '1rem',
                      margin: 0,
                      background: '#f8fafc',
                      borderRadius: '0.375rem'
                    }}
                    codeTagProps={{ style: { fontSize: '0.875rem' } }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className={`${className} text-sm`} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessage;