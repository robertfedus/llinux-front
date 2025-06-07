import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useOpenAI } from '../context/OpenAIContext';
import { MessageSquare, Sparkles, Search, Loader2, BotMessageSquare, Terminal, Puzzle } from 'lucide-react';

function ChatArea({
  messages,
  setMessages,
  isReasoning,
  setIsReasoning,
  isSearching,
  setIsSearching,
  isLoading,
  setIsLoading,
  abortController,
  setAbortController,
  setCommands,
  halfWidth
}) {
  const { generateChatCompletion, systemInformation } = useOpenAI();
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isReasoning, isSearching, isLoading]);

  const handleReason = () => {
    setIsReasoning(true);
    setMessages([...messages, { role: 'system', content: 'Enabling reasoning mode...' }]);
    
    setTimeout(() => {
      setIsReasoning(false);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "Reasoning mode is now active. I'll think more deeply about complex questions." 
        }
      ]);
    }, 1500);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setMessages([...messages, { role: 'system', content: 'Searching for information...' }]);
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleSendMessage = async (content) => {
    // Add user message
    const updatedMessages = [...messages, { role: 'user', content }];
    setMessages(updatedMessages);
    
    // Create a new assistant message with empty content
    const assistantMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);
    
    // Create an AbortController for the request
    const controller = new AbortController();
    setAbortController(controller);
    setIsLoading(true);
    
    try {
      const stream = await generateChatCompletion(
        updatedMessages,
        {
          isSearching,
          signal: controller.signal
        }
      );

      // Process the stream
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkContent = chunk.choices[0]?.delta?.content || '';
        fullResponse += chunkContent;
        
        // Update the assistant message with the new content
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: fullResponse
          };
          return newMessages;
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        // Update the assistant message with the error
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: "Sorry, there was an error processing your request."
          };
          return newMessages;
        });
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleAddCommandFromMessage = (command) => {
    setCommands(prevCommands => {
      // Avoid adding duplicate commands
      if (!prevCommands.includes(command)) {
        return [...prevCommands, command];
      }
      return prevCommands;
    });
  };

  return (
    <div className={`${halfWidth ? 'w-1/2' : 'w-full'} flex flex-col h-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900`}>
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BotMessageSquare size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">You are chatting with LLinux, your Linux AI Assistant</h2>
                <p className="text-sm text-white/60">AI-powered conversation - don't forget to check any commands you run!</p>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-4">
              {isReasoning && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 rounded-lg border border-purple-400/30">
                  <Sparkles size={16} className="text-purple-300 animate-pulse" />
                  <span className="text-purple-200 text-sm font-medium">Reasoning</span>
                </div>
              )}
              
              {isSearching && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                  <Search size={16} className="text-emerald-300 animate-pulse" />
                  <span className="text-emerald-200 text-sm font-medium">Searching</span>
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <Loader2 size={16} className="text-blue-300 animate-spin" />
                  <span className="text-blue-200 text-sm font-medium">Generating</span>
                </div>
              )}
              
              {systemInformation?.system_resources ? (
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Device Online</span>
                </div>) : ''
              }

              {!systemInformation?.system_resources ? (
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Device Offline</span>
                </div>) : ''
              }
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - Made scrollable */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
      >
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              /* Welcome Screen */
              <div className="flex flex-col items-center justify-center min-h-full text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Welcome to LLinux!</h3>
                  <p className="text-white/60 max-w-md">
                    Start a conversation with our AI assistant. Ask questions, get help with Linux, 
                    or explore any topic you're curious about.
                  </p>
                </div>
                
                {/* Quick Start Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl">
                  <div className="p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-200">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Sparkles size={16} className="text-purple-300" />
                    </div>
                    <h4 className="font-medium text-white mb-1">AI Chatbot</h4>
                    <p className="text-white/60 text-sm">Have natural conversations on any topic</p>
                  </div>
                  
                  <div className="p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-200">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Terminal size={16} className="text-emerald-300" />
                    </div>
                    <h4 className="font-medium text-white mb-1">Linux Commands</h4>
                    <p className="text-white/60 text-sm">Execute the commands given by the AI</p>
                  </div>
                  
                  <div className="p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-200">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Puzzle size={16} className="text-blue-300" />
                    </div>
                    <h4 className="font-medium text-white mb-1">Multiple Models</h4>
                    <p className="text-white/60 text-sm">Select your desired LLM to chat with</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="space-y-6 pb-4">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    message={message} 
                    handleAddCommandFromMessage={handleAddCommandFromMessage} 
                  />
                ))}
                
                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex items-center space-x-3 max-w-4xl">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Input - Fixed at bottom */}
      <div className="flex-shrink-0">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onReason={handleReason}
          onSearch={handleSearch}
          onStop={handleStopGeneration}
          isReasoning={isReasoning}
          isSearching={isSearching}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default ChatArea;