import { useState } from 'react';
import { useOpenAI } from '../context/OpenAIContext';
import openaiLogo from '../assets/openai_logo.png';
import deepseekLogo from '../assets/deepseek_logo.png';
import { Bot, Menu, X } from 'lucide-react';

const modelOptions = [
  { name: 'GPT-4.1', value: 'gpt-4.1', logo: openaiLogo },
  { name: 'GPT-4o', value: 'gpt-4o', logo: openaiLogo },
  { name: 'o3', value: 'o3', logo: openaiLogo },
  { name: 'o4-mini', value: 'o4-mini', logo: openaiLogo },
  { name: 'DeepSeek-V3', value: 'deepseek-chat', logo: deepseekLogo },
  { name: 'DeepSeek-R1', value: 'deepseek-reasoner', logo: deepseekLogo }
];

const Navbar = ({ 
  onToggleSidebar, 
  onOpenRegister, 
  onOpenLogin, 
  onOpenConnectionCode, 
  onToggleAPIKeys, 
  onToggleModelSelection, 
  token, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuth = !!token;
  const { selectedModel, systemInformation } = useOpenAI();
  
  const currentModel = modelOptions.find(model => model.value === selectedModel);
  const modelName = currentModel ? currentModel.name : 'Unknown Model';
  const modelLogo = currentModel ? currentModel.logo : null;

  const resources = systemInformation?.system_resources || {};
  const hostname = resources.hostname || '';
  const uptime = resources.uptime || '';
  const cpuVal = resources.cpu || '';
  const memoryVal = resources.memory || '';
  const diskVal = resources.disk || '';

  const cpuPercent = cpuVal ? parseFloat(cpuVal) : 0;
  let memPercent = 0;
  if (memoryVal.includes('/')) {
    const [memUsed, memTotal] = memoryVal.split('/').map(x => parseFloat(x));
    memPercent = memTotal ? (memUsed / memTotal) * 100 : 0;
  }
  let diskPercent = 0;
  if (diskVal.includes('/')) {
    const [diskUsed, diskTotal] = diskVal.split('/').map(x => parseFloat(x));
    diskPercent = diskTotal ? (diskUsed / diskTotal) * 100 : 0;
  }

  const getResourceColor = (percent) => {
    if (percent > 80) return 'text-red-300';
    if (percent > 60) return 'text-yellow-300';
    return 'text-green-300';
  };

  const formatPercent = (percent) => {
    if (percent >= 100) return '100%';
    return `${percent.toFixed(1)}%`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuItemClick = (callback) => {
    callback();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md border-b border-white/10 shadow-2xl relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  <a href="#">LLinux</a>
                </h1>
              </div>

              {/* Desktop Model Selection */}
              {isAuth && currentModel && (
                <div 
                  onClick={onToggleModelSelection} 
                  className="cursor-pointer hidden lg:flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-200"
                >
                  <img
                    src={modelLogo}
                    alt={`${modelName} logo`}
                    className="h-6 max-w-[70px] object-contain drop-shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-semibold">{modelName}</span>
                    <span className="text-purple-200 text-xs opacity-75">Active Model</span>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop System Resources */}
            {isAuth && systemInformation?.system_resources && (
              <div className="hidden xl:flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <div className="text-center min-w-0 flex-shrink-0">
                  <div className="text-white text-xs font-medium truncate">{hostname || 'Server'}</div>
                  {uptime && (
                    <div className="text-purple-200 text-xs opacity-75 truncate">up {uptime}</div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center space-y-1 w-14">
                    <div className="flex flex-col items-center">
                      <span className="text-white text-xs font-medium">CPU</span>
                      <span className={`text-xs font-mono ${getResourceColor(cpuPercent)} w-10 text-center`}>
                        {cpuVal ? formatPercent(cpuPercent) : '-'}
                      </span>
                    </div>
                    <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          cpuPercent > 80 ? 'bg-red-400' : 
                          cpuPercent > 60 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${Math.min(cpuPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-1 w-14">
                    <div className="flex flex-col items-center">
                      <span className="text-white text-xs font-medium">RAM</span>
                      <span className={`text-xs font-mono ${getResourceColor(memPercent)} w-10 text-center`}>
                        {memoryVal ? formatPercent(memPercent) : '-'}
                      </span>
                    </div>
                    <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          memPercent > 80 ? 'bg-red-400' : 
                          memPercent > 60 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${Math.min(memPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-1 w-14">
                    <div className="flex flex-col items-center">
                      <span className="text-white text-xs font-medium">DISK</span>
                      <span className={`text-xs font-mono ${getResourceColor(diskPercent)} w-10 text-center`}>
                        {diskVal ? formatPercent(diskPercent) : '-'}
                      </span>
                    </div>
                    <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          diskPercent > 80 ? 'bg-red-400' : 
                          diskPercent > 60 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${Math.min(diskPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop and Mobile Actions */}
            <div className="flex items-center space-x-3">
              {!isAuth ? (
                <>
                  <button
                    onClick={onOpenRegister}
                    className="px-3 sm:px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30 text-sm sm:text-base"
                  >
                    Register
                  </button>
                  <button
                    onClick={onOpenLogin}
                    className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Menu Button */}
                  <div className="md:hidden">
                    <button 
                      onClick={toggleMobileMenu}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                  </div>

                  {/* Desktop Menu */}
                  <div className="hidden md:flex items-center space-x-2">
                    <button
                      onClick={onOpenConnectionCode}
                      className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
                    >
                      Connect
                    </button>
                    <button
                      onClick={onToggleSidebar}
                      className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
                    >
                      Commands
                    </button>
                    <button
                      onClick={onToggleAPIKeys}
                      className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
                    >
                      API Keys
                    </button>
                    
                    <div className="w-px h-6 bg-white/20 mx-2"></div>
                    
                    <button 
                      onClick={onLogout} 
                      className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isAuth && isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={toggleMobileMenu}>
          <div className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-l border-white/10 shadow-2xl">
            <div className="p-6 space-y-4">
              {currentModel && (
                <div 
                  onClick={() => handleMobileMenuItemClick(onToggleModelSelection)}
                  className="cursor-pointer flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-200"
                >
                  <img
                    src={modelLogo}
                    alt={`${modelName} logo`}
                    className="h-6 max-w-[70px] object-contain drop-shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-semibold">{modelName}</span>
                    <span className="text-purple-200 text-xs opacity-75">Active Model</span>
                  </div>
                </div>
              )}

              {systemInformation?.system_resources && (
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-center mb-3">
                    <div className="text-white text-sm font-medium">{hostname || 'Server'}</div>
                    {uptime && (
                      <div className="text-purple-200 text-xs opacity-75">up {uptime}</div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">CPU</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-mono ${getResourceColor(cpuPercent)}`}>
                          {cpuVal ? formatPercent(cpuPercent) : '-'}
                        </span>
                        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              cpuPercent > 80 ? 'bg-red-400' : 
                              cpuPercent > 60 ? 'bg-yellow-400' : 'bg-green-400'
                            }`}
                            style={{ width: `${Math.min(cpuPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">RAM</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-mono ${getResourceColor(memPercent)}`}>
                          {memoryVal ? formatPercent(memPercent) : '-'}
                        </span>
                        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              memPercent > 80 ? 'bg-red-400' : 
                              memPercent > 60 ? 'bg-yellow-400' : 'bg-green-400'
                            }`}
                            style={{ width: `${Math.min(memPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">DISK</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-mono ${getResourceColor(diskPercent)}`}>
                          {diskVal ? formatPercent(diskPercent) : '-'}
                        </span>
                        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              diskPercent > 80 ? 'bg-red-400' : 
                              diskPercent > 60 ? 'bg-yellow-400' : 'bg-green-400'
                            }`}
                            style={{ width: `${Math.min(diskPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => handleMobileMenuItemClick(onOpenConnectionCode)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 text-left"
                >
                  Connect
                </button>
                <button
                  onClick={() => handleMobileMenuItemClick(onToggleSidebar)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 text-left"
                >
                  Commands
                </button>
                <button
                  onClick={() => handleMobileMenuItemClick(onToggleAPIKeys)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 text-left"
                >
                  API Keys
                </button>
                
                <div className="border-t border-white/20 my-4"></div>
                
                <button 
                  onClick={() => handleMobileMenuItemClick(onLogout)}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;