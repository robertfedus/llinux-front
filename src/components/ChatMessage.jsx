import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot, Settings } from 'lucide-react';

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
  const isAssistant = message.role === 'assistant';
  const processedCommands = useRef(new Set());
  const [copiedStates, setCopiedStates] = React.useState({});

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

  const handleCopy = async (text, blockId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [blockId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [blockId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getMessageIcon = () => {
    if (isUser) return <User size={18} className="text-purple-300" />;
    if (isSystem) return <Settings size={18} className="text-blue-300" />;
    return <Bot size={18} className="text-emerald-300" />;
  };

  const getMessageStyles = () => {
    if (isUser) {
      return 'ml-auto bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg border border-purple-500/30';
    }
    if (isSystem) {
      return 'mx-auto bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-sm';
    }
    return 'bg-white/10 backdrop-blur-sm text-white border border-white/20 shadow-lg';
  };

  return (
    <div className={`mb-6 p-5 rounded-xl max-w-4xl transition-all duration-300 hover:shadow-xl ${getMessageStyles()}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm">
          {getMessageIcon()}
        </div>
        <div className="flex-1">
          <div className={`text-sm font-medium ${
            isUser ? 'text-purple-100' : 
            isSystem ? 'text-blue-200' : 
            'text-white/90'
          }`}>
            {isUser ? 'You' : isSystem ? 'System' : 'LLinux'}
          </div>
          <div className={`text-xs ${
            isUser ? 'text-purple-200/75' : 
            isSystem ? 'text-blue-300/75' : 
            'text-white/60'
          }`}>
            {/* {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
          </div>
        </div>
      </div>

      <div className={`prose prose-invert max-w-none ${
        isSystem ? 'text-center italic' : ''
      }`}>
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className={`mb-3 leading-relaxed ${
                isUser ? 'text-white/95' : 
                isSystem ? 'text-blue-200' : 
                'text-white/90'
              }`}>
                {children}
              </p>
            ),
            
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3 text-white border-b border-white/20 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mb-2 text-white/95">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-medium mb-2 text-white/90">
                {children}
              </h3>
            ),

            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-3 space-y-1 text-white/90">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-3 space-y-1 text-white/90">
                {children}
              </ol>
            ),

            a: ({ href, children }) => (
              <a 
                href={href} 
                className="text-purple-300 hover:text-purple-200 underline decoration-purple-400/50 hover:decoration-purple-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),

            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-purple-400/50 pl-4 py-2 bg-white/5 rounded-r-lg mb-3 italic text-white/80">
                {children}
              </blockquote>
            ),

            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '').trim();
              const blockId = `code-${Math.random().toString(36).substr(2, 9)}`;

              if (!inline && match) {
                return (
                  <div className="relative group mb-4 mt-4">
                    <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-t-lg border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-sm text-white/70 font-medium">
                          {match[1]}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(codeString, blockId)}
                        className="flex items-center space-x-2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/70 hover:text-white text-xs"
                        aria-label="Copy code"
                      >
                        {copiedStates[blockId] ? (
                          <>
                            <Check size={14} className="text-green-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        fontSize: '0.875rem',
                        padding: '1rem',
                        margin: 0,
                        background: 'rgb(30, 41, 59)',
                        borderRadius: '0 0 0.5rem 0.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderTop: 'none'
                      }}
                      codeTagProps={{ 
                        style: { 
                          fontSize: '0.875rem',
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                        } 
                      }}
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              return (
                <code 
                  className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-sm font-mono text-purple-200 border border-white/20" 
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;