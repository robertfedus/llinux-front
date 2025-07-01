import { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatArea from './components/ChatArea';
import CommandSidebar from './components/CommandSidebar';
import { OpenAIProvider } from './context/OpenAIContext';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import APIKeysModal from './components/APIKeysModal';
import ConnectionCodeModal from './components/ConnectionCodeModal';
import ModelSelectionModal from './components/ModelSelectionModal';

function App() {
  const [messages, setMessages] = useState([]);
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
      setShowRegister(false);
      setShowLogin(false);
    } else {
      localStorage.removeItem('token');
    }
  }, [messages, token]);

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
            {/* Mobile: CommandSidebar takes full width and overlays ChatArea */}
            {/* Desktop: CommandSidebar takes half width alongside ChatArea */}
            {showSidebar && (
              <div className="absolute inset-0 top-16 z-10 md:relative md:inset-auto md:top-auto md:z-auto md:w-1/2">
                <CommandSidebar
                  commands={commands}
                  setCommands={setCommands}
                  commandResults={commandResults}
                  setCommandResults={setCommandResults}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onClose={() => setShowSidebar(false)}
                />
              </div>
            )}
            <ChatArea
              messages={messages}
              setMessages={setMessages}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              abortController={abortController}
              setAbortController={setAbortController}
              messagesEndRef={messagesEndRef}
              setCommands={setCommands}
              halfWidth={showSidebar}
              className={showSidebar ? 'hidden md:flex md:w-1/2' : 'w-full'}
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