import React from 'react';
import { useOpenAI } from '../context/OpenAIContext';
import openaiLogo from '../assets/openai_logo.png';
import deepseekLogo from '../assets/deepseek_logo.png';

const modelOptions = [
  { name: 'GPT-4.1', value: 'gpt-4.1', logo: openaiLogo },
  { name: 'GPT-4o', value: 'gpt-4o', logo: openaiLogo },
  { name: 'o3', value: 'o3', logo: openaiLogo },
  { name: 'o4-mini', value: 'o4-mini', logo: openaiLogo },
  { name: 'DeepSeek-V3', value: 'deepseek-chat', logo: deepseekLogo },
  { name: 'DeepSeek-R1', value: 'deepseek-reasoner', logo: deepseekLogo }
];

const Navbar = ({ onToggleSidebar, onOpenRegister, onOpenLogin, onOpenConnectionCode, onToggleAPIKeys, onToggleModelSelection, token, onLogout }) => {
  const isAuth = !!token;
  const { selectedModel, systemInformation } = useOpenAI();
  
  // Find the current model info
  const currentModel = modelOptions.find(model => model.value === selectedModel);
  const modelName = currentModel ? currentModel.name : 'Unknown Model';
  const modelLogo = currentModel ? currentModel.logo : null;

  // Safe access to system resources
  const resources = systemInformation?.system_resources || {};
  const hostname = resources.hostname || '';
  const uptime = resources.uptime || '';
  const cpuVal = resources.cpu || '';
  const memoryVal = resources.memory || '';
  const diskVal = resources.disk || '';
  const gpuVal = resources.gpu || '';

  // Parse numerical values if available
  const cpuPercent = cpuVal ? parseFloat(cpuVal) : 0;
  const gpuPercent = gpuVal ? parseFloat(gpuVal) : 0;
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

  return (
    <nav className="bg-primary px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="ml-3 text-xl font-bold text-white">Llinux</h1>

          {/* Model Display - Only show when authenticated */}
          {isAuth && currentModel && (
            <div className="ml-6 flex items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded-full">
              <img
                src={modelLogo}
                alt={`${modelName} logo`}
                className="h-5 max-w-[60px] object-contain"
              />
              <span className="text-white text-sm font-medium">{modelName}</span>
            </div>
          )}
        </div>

        {/* System Resources Display */}
        {isAuth && systemInformation?.system_resources && (
          <div className="flex items-center space-x-4 text-white text-xs">
            <span className="font-mono">
              {hostname}
              {uptime && ` is up for: ${uptime}`}
            </span>
            <div className="flex items-center space-x-1">
              <span>CPU</span>
              <progress
                value={cpuPercent}
                max="100"
                className="w-12 h-1 accent-primary"
              />
              <span>{cpuVal ? `${cpuPercent.toFixed(1)}%` : '-'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Mem</span>
              <progress
                value={memPercent}
                max="100"
                className="w-12 h-1 accent-primary"
              />
              <span>{memoryVal ? `${memPercent.toFixed(1)}%` : '-'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Disk</span>
              <progress
                value={diskPercent}
                max="100"
                className="w-12 h-1 accent-primary"
              />
              <span>{diskVal ? `${diskPercent.toFixed(1)}%` : '-'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>GPU</span>
              <progress
                value={gpuPercent}
                max="100"
                className="w-12 h-1 accent-primary"
              />
              <span>{gpuVal ? `${gpuPercent.toFixed(1)}%` : '-'}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          {!isAuth ? (
            <>
              <button
                onClick={onOpenRegister}
                className="px-3 py-1 rounded-full bg-secondary text-white hover:bg-opacity-90 transition-colors"
              >
                Register
              </button>
              <button
                onClick={onOpenLogin}
                className="px-3 py-1 rounded-full bg-accent1 text-white hover:bg-opacity-90 transition-colors"
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenConnectionCode}
                className="px-3 py-1 rounded-full bg-secondary text-white hover:bg-opacity-90 transition-colors"
              >
                Connect Device
              </button>
              <button
                onClick={onToggleSidebar}
                className="px-3 py-1 rounded-full bg-secondary text-white hover:bg-opacity-90 transition-colors"
              >
                Command Panel
              </button>
              <button
                onClick={onToggleModelSelection}
                className="px-3 py-1 rounded-full bg-secondary text-white hover:bg-opacity-90 transition-colors"
              >
                Select Model
              </button>
              <button
                onClick={onToggleAPIKeys}
                className="px-3 py-1 rounded-full bg-secondary text-white hover:bg-opacity-90 transition-colors"
              >
                API Keys
              </button>
              <button 
                onClick={onLogout} 
                className="px-3 py-1 rounded-full bg-accent1 text-white hover:bg-opacity-90 transition-colors"
              >
                Log Out
              </button>
              <button className="px-3 py-1 rounded-full bg-accent1 text-white hover:bg-opacity-90 transition-colors">
                Settings
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;