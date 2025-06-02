import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai/index.mjs';
import Navbar from './components/Navbar';
import ChatArea from './components/ChatArea';
import CommandSidebar from './components/CommandSidebar';
import { OpenAIProvider } from './context/OpenAIContext';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import APIKeysModal from './components/APIKeysModal';
import ConnectionCodeModal from './components/ConnectionCodeModal';
import ModelSelectionModal from './components/ModelSelectionModal';
import { v4 as uuidv4 } from 'uuid'; // Added missing import

const generateId = () => uuidv4();

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [isReasoning, setIsReasoning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [commands, setCommands] = useState([]);
  const [commandResults, setCommandResults] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showConnectionCode, setShowConnectionCode] = useState(false);
  const [showAPIKeys, setShowAPIKeys] = useState(false);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();

    if (token) {
      localStorage.setItem('token', token);
      setShowRegister(false);
      setShowLogin(false);
    } else {
      localStorage.removeItem('token');
    }
  }, [messages, token]); // Fixed the dependency array - was missing comma

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="App">
      <div className="flex flex-col h-screen bg-gray-50">
        <OpenAIProvider>
          <Navbar
            onOpenRegister={() => setShowRegister(true)}
            onOpenLogin={() => setShowLogin(true)}
            onOpenConnectionCode={() => setShowConnectionCode(true)}
            onToggleSidebar={handleToggleSidebar}
            onToggleAPIKeys={() => setShowAPIKeys(true)}
            onToggleModelSelection={() => setShowModelSelection(true)}
            token={token}
            onLogout={onLogout}
          />
          
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            {showSidebar && (
              <CommandSidebar
                commands={commands}
                setCommands={setCommands}
                commandResults={commandResults}
                setCommandResults={setCommandResults}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}

            {/* Main Chat Area */}
            <ChatArea
              messages={messages}
              setMessages={setMessages}
              isReasoning={isReasoning}
              setIsReasoning={setIsReasoning}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              abortController={abortController}
              setAbortController={setAbortController}
              messagesEndRef={messagesEndRef}
              setCommands={setCommands}
            />
          </div>
          {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} onSuccess={setToken} />
        )}
        {showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} onSuccess={setToken} />
        )}

        {showConnectionCode && (
          <ConnectionCodeModal onClose={() => setShowConnectionCode(false)} />
        )}

        {showAPIKeys && (
          <APIKeysModal onClose={() => setShowAPIKeys(false)} />
        )}

        {showModelSelection && (
          <ModelSelectionModal onClose={() => setShowModelSelection(false)} />
      )}
        </OpenAIProvider>
      </div>

      
    </div>
  );
}

export default App;